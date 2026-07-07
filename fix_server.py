with open('server.ts', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "  return app;" in line and "if (!process.env.VERCEL)" in lines[i+1] if i+1 < len(lines) else False:
        lines[i] = ""

with open('server.ts', 'w') as f:
    f.writelines(lines)
