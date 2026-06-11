const fs = require('fs');
const prData = JSON.parse(fs.readFileSync('/Users/sahityasingh/DevForge/pr-data-report.json', 'utf8'));

const orgCounts = {};
const monthlyCounts = {};

prData.members.forEach(m => {
    const allPrs = [...(m.prs || []), ...(m.gsocPRList || [])];
    allPrs.forEach(pr => {
        if (!pr.repo) return;
        const org = pr.repo.split('/')[0];
        if (!orgCounts[org]) orgCounts[org] = { merged: 0, open: 0, closed: 0, total: 0 };
        orgCounts[org].total++;
        if (pr.state === 'merged') orgCounts[org].merged++;
        if (pr.state === 'open') orgCounts[org].open++;
        if (pr.state === 'closed') orgCounts[org].closed++;

        if (pr.date && pr.state === 'merged') {
            const date = new Date(pr.date);
            const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
            if (!monthlyCounts[monthYear]) monthlyCounts[monthYear] = 0;
            monthlyCounts[monthYear]++;
        }
    });
});

console.log("Org Counts:");
Object.entries(orgCounts).sort((a,b) => b[1].total - a[1].total).forEach(([org, counts]) => {
    console.log(`${org}: ${JSON.stringify(counts)}`);
});

console.log("\nMonthly Counts:");
console.log(monthlyCounts);
