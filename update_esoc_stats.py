import urllib.request, json, time

handles = [
    'geetxnshgoyal', 'ravisharma-09', 'Layyzyy', 'luvyarana',
    'sharmavikas18', 'AryanPatel-ui', 'nithyarajmudhaliyar', 'prateek6789-ai',
    'Sahitya0805', 'saurabhyuvi14-ai', 'SidharthxNST', 'bhavesh-210',
    'unnati-jaiswal24', 'Shristibot', 'dhiraj-143r', 'nishtha-agarwal-211'
]

esoc_orgs = [
    'pyaptamer', 'shap', 'sktime', 'openml', 'pgmpy', 
    'pygam', 'prefix-dev', 'pytorch-forecasting', 'electrolux', 'skore'
]

results = []

def fetch_prs(username, state):
    # state = 'merged' or 'open' (for open, we use is:open)
    items = []
    page = 1
    query = f"author:{username} type:pr " + ("is:merged" if state == 'merged' else "is:open")
    while True:
        url = f'https://api.github.com/search/issues?q={urllib.parse.quote(query)}&per_page=100&page={page}'
        req = urllib.request.Request(url, headers={'User-Agent': 'DevForge'})
        try:
            with urllib.request.urlopen(req, timeout=10) as r:
                data = json.load(r)
                fetched = data.get('items', [])
                items.extend(fetched)
                if len(fetched) < 100 or len(items) >= 300:
                    break
        except urllib.error.HTTPError as e:
            if e.code in [403, 429]:
                print(f"Rate limited on {username} {state}, waiting 20s...")
                time.sleep(20)
                continue
            break
        except Exception:
            break
        page += 1
        time.sleep(6)
    return items

for handle in handles:
    print(f"Processing {handle}...")
    merged_items = fetch_prs(handle, 'merged')
    time.sleep(6)
    open_items = fetch_prs(handle, 'open')
    time.sleep(6)

    esoc_merged = 0
    esoc_open = 0
    org_breakdown = {}

    def add_to_org(repo_url, state_key):
        for org in esoc_orgs:
            if f'repos/{org}/' in repo_url:
                if org not in org_breakdown:
                    org_breakdown[org] = {'merged': 0, 'open': 0}
                org_breakdown[org][state_key] += 1
                return True
        return False

    for item in merged_items:
        repo_url = item.get('repository_url', '').lower()
        if add_to_org(repo_url, 'merged'):
            esoc_merged += 1

    for item in open_items:
        repo_url = item.get('repository_url', '').lower()
        if add_to_org(repo_url, 'open'):
            esoc_open += 1

    # Format org breakdown
    formatted_orgs = [{'name': org, 'merged': counts['merged'], 'open': counts['open']} for org, counts in org_breakdown.items()]

    results.append({
        'name': handle,  # we will use handle as name fallback in frontend
        'github': handle,
        'esocPRs': {
            'merged': esoc_merged,
            'open': esoc_open,
            'orgs': formatted_orgs
        }
    })

out = {'members': results}
with open('data/esoc-stats.json', 'w') as f:
    json.dump(out, f, indent=2)
print("Done!")
