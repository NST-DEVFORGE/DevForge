import urllib.request, json, time, sys

handles = [
    'geetxnshgoyal', 'ravisharma-09', 'Layyzyy', 'luvyarana',
    'sharmavikas18', 'AryanPatel-ui', 'nithyarajmudhaliyar', 'prateek6789-ai',
    'Sahitya0805', 'saurabhyuvi14-ai', 'SidharthxNST', 'bhavesh-210',
    'unnati-jaiswal24', 'Shristibot', 'dhiraj-143r', 'nishtha-agarwal-211'
]

target_orgs = {
    'opensuse': 'openSUSE',
    'openfoodfacts': 'OpenFoodFacts',
    'json-schema-org': 'JSONSchema',
    'zulip': 'Zulip',
    'mit-cml': 'MIT App'
}

months = [
    {'label': 'Jan', 'start': '2026-01'},
    {'label': 'Feb', 'start': '2026-02'},
    {'label': 'Mar', 'start': '2026-03'},
    {'label': 'Apr', 'start': '2026-04'},
    {'label': 'May', 'start': '2026-05'},
    {'label': 'Jun', 'start': '2026-06'},
]

month_counts = {m['label']: 0 for m in months}
org_counts = {slug: 0 for slug in target_orgs}
total_prs = 0

def fetch_prs(username):
    items = []
    page = 1
    while True:
        url = f'https://api.github.com/search/issues?q=author:{username}+type:pr+is:merged&per_page=100&page={page}'
        req = urllib.request.Request(url, headers={'User-Agent': 'DevForge'})
        try:
            with urllib.request.urlopen(req, timeout=10) as r:
                data = json.load(r)
                fetched = data.get('items', [])
                items.extend(fetched)
                print(f"  {username} page {page}: got {len(fetched)}")
                if len(fetched) < 100 or len(items) >= 500:
                    break
        except urllib.error.HTTPError as e:
            if e.code in [403, 429]:
                print(f"Rate limited on {username} page {page}, waiting 20s...")
                time.sleep(20)
                continue
            else:
                print(f"Error {e.code} for {username}")
                break
        except Exception as e:
            print(f"Error for {username}: {e}")
            break
        page += 1
        time.sleep(6)  # avoid rate limit (10 req/min = 6s per req)
    return items

for handle in handles:
    print(f"Fetching {handle}...")
    prs = fetch_prs(handle)
    total_prs += len(prs)
    for pr in prs:
        closed_at = pr.get('closed_at')
        if closed_at:
            month_prefix = closed_at[:7]
            for m in months:
                if month_prefix == m['start']:
                    month_counts[m['label']] += 1
        repo_url = pr.get('repository_url', '')
        if 'repos/' in repo_url:
            slug = repo_url.split('repos/')[-1].split('/')[0].lower()
            if slug in org_counts:
                org_counts[slug] += 1
    time.sleep(6)

out = {
    'monthlyData': [{'month': k, 'count': v} for k, v in month_counts.items()],
    'orgData': [{'org': target_orgs[k], 'count': v} for k, v in org_counts.items()],
    'totalMergedPRs': total_prs
}

with open('data/graph-stats.json', 'w') as f:
    json.dump(out, f, indent=2)

print("Done! Wrote data/graph-stats.json")
