with open('server.ts', 'r') as f:
    content = f.read()

# remove all "  return app;"
content = content.replace("  return app;\n\n  \n  if (!process.env.VERCEL) {", "  if (!process.env.VERCEL) {")
content = content.replace("  return app;\n\n  if (!process.env.VERCEL) {", "  if (!process.env.VERCEL) {")
content = content.replace("  return app;\n    if (!process.env.VERCEL) {", "  if (!process.env.VERCEL) {")

with open('server.ts', 'w') as f:
    f.write(content)
