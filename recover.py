import json

with open('dist/server.cjs.map', 'r') as f:
    data = json.load(f)

for i, src in enumerate(data.get('sources', [])):
    if 'server.ts' in src:
        with open('server.ts', 'w') as out:
            out.write(data['sourcesContent'][i])
        print("Recovered server.ts")
        break
