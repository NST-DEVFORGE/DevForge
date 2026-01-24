#!/usr/bin/env node

// PR Data Extraction Script for DevForge
// Run with: node scripts/pr-data.js

const TEAM_MEMBERS = [
    { name: 'Geetansh Goyal', github: 'geetxnshgoyal' },
    { name: 'Lay Shah', github: 'Layyzyy' },
    { name: 'Luvya Rana', github: 'luvyarana' },
    { name: 'Vikas Sharma', github: 'sharmavikas18' },
    { name: 'Aryan Patel', github: 'AryanPatel-ui' },
    { name: 'Nithyaraj', github: 'nithyarajmudhaliyar' },
    { name: 'Prateek', github: 'prateek6789-ai' },
    { name: 'Sahitya Singh', github: 'Sahitya0805' },
    { name: 'Saurabh', github: 'saurabhyuvi14-ai' },
    { name: 'Sidharth', github: 'SidharthxNST' },
    { name: 'Bhavesh Sharma', github: 'bhavesh-210' },
    { name: 'Unnati Jaiswal', github: 'unnati-jaiswal24' },
    { name: 'Shristi Kumari', github: 'Shristibot' },
    { name: 'Dhiraj Rathod', github: 'dhiraj-143r' }
];

// Common GSoC organizations
const GSOC_ORGS = [
    'openSUSE', 'mozilla', 'kubernetes', 'apache', 'google', 'tensorflow',
    'gnome', 'kde', 'fedora', 'debian', 'ubuntu', 'python', 'numpy',
    'scipy', 'pandas', 'matplotlib', 'jupyter', 'django', 'rails',
    'react', 'angular', 'vuejs', 'nodejs', 'golang', 'rust-lang',
    'llvm', 'gcc', 'linux', 'freebsd', 'openbsd', 'jenkins', 'gitlab',
    'gitea', 'forgejo', 'zulip', 'mattermost', 'rocket.chat', 'element',
    'matrix-org', 'signal', 'tor', 'privacytools', 'eff', 'fsf',
    'wikimedia', 'wordpress', 'drupal', 'joomla', 'magento', 'prestashop',
    'opencart', 'woocommerce', 'shopify', 'stripe', 'paypal', 'square',
    'plaid', 'braintree', 'adyen', 'mollie', 'klarna', 'affirm',
    'cncf', 'hashicorp', 'elastic', 'grafana', 'prometheus', 'influxdata'
];

async function fetchPRsForUser(username) {
    const headers = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'DevForge-PR-Stats'
    };

    if (process.env.GITHUB_TOKEN) {
        headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const results = {
        merged: [],
        open: [],
        closed: [],
        gsocMerged: [],
        gsocOpen: [],
        gsocClosed: []
    };

    try {
        // Fetch ALL PRs (merged, open, closed)
        const states = ['merged', 'open', 'closed'];

        for (const state of states) {
            let query;
            if (state === 'merged') {
                query = `author:${username} is:pr is:merged`;
            } else if (state === 'open') {
                query = `author:${username} is:pr is:open`;
            } else {
                query = `author:${username} is:pr is:closed is:unmerged`;
            }

            const searchUrl = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=100`;

            const response = await fetch(searchUrl, { headers });

            if (!response.ok) {
                console.error(`Failed to fetch ${state} PRs for ${username}: ${response.status}`);
                continue;
            }

            const data = await response.json();
            const prs = data.items || [];

            for (const pr of prs) {
                const repoUrl = pr.repository_url;
                const repoName = repoUrl.split('/').slice(-2).join('/');
                const org = repoName.split('/')[0].toLowerCase();

                const prData = {
                    title: pr.title,
                    url: pr.html_url,
                    repo: repoName,
                    number: pr.number,
                    date: pr.closed_at || pr.created_at,
                    state: state
                };

                results[state].push(prData);

                // Check if GSoC org
                if (GSOC_ORGS.some(gsocOrg => org.includes(gsocOrg.toLowerCase()))) {
                    results[`gsoc${state.charAt(0).toUpperCase() + state.slice(1)}`].push(prData);
                }
            }
        }
    } catch (error) {
        console.error(`Error fetching PRs for ${username}:`, error.message);
    }

    return results;
}

async function main() {
    console.log('╔══════════════════════════════════════════════════════════════════╗');
    console.log('║          DevForge PR Data Report - Student Contributions         ║');
    console.log('╚══════════════════════════════════════════════════════════════════╝\n');

    const allData = [];
    let totalMerged = 0, totalOpen = 0, totalClosed = 0;
    let totalGsocMerged = 0, totalGsocOpen = 0, totalGsocClosed = 0;

    for (const member of TEAM_MEMBERS) {
        console.log(`Fetching data for ${member.name} (@${member.github})...`);
        const data = await fetchPRsForUser(member.github);

        allData.push({
            name: member.name,
            github: member.github,
            ...data
        });

        totalMerged += data.merged.length;
        totalOpen += data.open.length;
        totalClosed += data.closed.length;
        totalGsocMerged += data.gsocMerged.length;
        totalGsocOpen += data.gsocOpen.length;
        totalGsocClosed += data.gsocClosed.length;

        // Small delay to avoid rate limiting
        await new Promise(r => setTimeout(r, 500));
    }

    // Print Summary
    console.log('\n');
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('                         OVERALL SUMMARY                           ');
    console.log('═══════════════════════════════════════════════════════════════════\n');

    console.log('📊 ALL PRs:');
    console.log(`   ✅ Merged:  ${totalMerged}`);
    console.log(`   🔓 Open:    ${totalOpen}`);
    console.log(`   ❌ Closed:  ${totalClosed}`);
    console.log(`   📈 Total:   ${totalMerged + totalOpen + totalClosed}\n`);

    console.log('🌟 GSoC-ELIGIBLE ORG PRs:');
    console.log(`   ✅ Merged:  ${totalGsocMerged}`);
    console.log(`   🔓 Open:    ${totalGsocOpen}`);
    console.log(`   ❌ Closed:  ${totalGsocClosed}`);
    console.log(`   📈 Total:   ${totalGsocMerged + totalGsocOpen + totalGsocClosed}\n`);

    // Print per-member breakdown
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('                      PER-MEMBER BREAKDOWN                         ');
    console.log('═══════════════════════════════════════════════════════════════════\n');

    for (const member of allData) {
        console.log(`👤 ${member.name} (@${member.github})`);
        console.log(`   All PRs:  Merged: ${member.merged.length}, Open: ${member.open.length}, Closed: ${member.closed.length}`);
        console.log(`   GSoC PRs: Merged: ${member.gsocMerged.length}, Open: ${member.gsocOpen.length}, Closed: ${member.gsocClosed.length}`);
        console.log('');
    }

    // Print detailed GSoC PRs
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('                    DETAILED GSOC PR LIST                          ');
    console.log('═══════════════════════════════════════════════════════════════════\n');

    for (const member of allData) {
        const allGsocPRs = [...member.gsocMerged, ...member.gsocOpen, ...member.gsocClosed];
        if (allGsocPRs.length > 0) {
            console.log(`\n👤 ${member.name}:`);
            for (const pr of allGsocPRs) {
                const statusIcon = pr.state === 'merged' ? '✅' : pr.state === 'open' ? '🔓' : '❌';
                console.log(`   ${statusIcon} [${pr.state.toUpperCase()}] ${pr.repo}#${pr.number}`);
                console.log(`      ${pr.title}`);
                console.log(`      ${pr.url}`);
            }
        }
    }

    // Output JSON for further processing
    const outputData = {
        generatedAt: new Date().toISOString(),
        summary: {
            allPRs: { merged: totalMerged, open: totalOpen, closed: totalClosed },
            gsocPRs: { merged: totalGsocMerged, open: totalGsocOpen, closed: totalGsocClosed }
        },
        members: allData.map(m => ({
            name: m.name,
            github: m.github,
            allPRs: { merged: m.merged.length, open: m.open.length, closed: m.closed.length },
            gsocPRs: { merged: m.gsocMerged.length, open: m.gsocOpen.length, closed: m.gsocClosed.length },
            gsocPRList: [...m.gsocMerged, ...m.gsocOpen, ...m.gsocClosed]
        }))
    };

    // Save to file
    const fs = require('fs');
    fs.writeFileSync('pr-data-report.json', JSON.stringify(outputData, null, 2));
    console.log('\n\n📁 Full data saved to: pr-data-report.json');
}

main().catch(console.error);
