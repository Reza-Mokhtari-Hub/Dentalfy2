import re

with open('server.ts', 'r') as f:
    content = f.read()

content = content.replace('import { createServer as createViteServer } from "vite";\n', '')

old_vite_block = '''  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }'''

new_vite_block = '''  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }'''

if old_vite_block in content:
    content = content.replace(old_vite_block, new_vite_block)
else:
    print("Could not find old_vite_block")

with open('server.ts', 'w') as f:
    f.write(content)

