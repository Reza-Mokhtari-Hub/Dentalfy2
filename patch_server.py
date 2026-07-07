import re

with open('server.ts', 'r') as f:
    content = f.read()

# Change startServer to configure and return the app, but not listen.
# Or just export a handler for Vercel at the end of the file.

content = content.replace("app.listen(PORT, \"0.0.0.0\", () => {\n    console.log(`🌍 dentalfy platform server ready on http://0.0.0.0:${PORT}`);\n  });", """
  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🌍 dentalfy platform server ready on http://0.0.0.0:${PORT}`);
    });
  }
""")

content = content.replace("startServer();", """
const appPromise = startServer();
export default async function handler(req: any, res: any) {
  const app = await appPromise;
  app(req, res);
}
""")

# Actually, startServer currently returns nothing and is scoped inside `async function startServer() {`
content = content.replace("async function startServer() {", "export async function startServer() {")
content = content.replace("  if (!process.env.VERCEL) {", "  return app;\n  if (!process.env.VERCEL) {")

with open('server.ts', 'w') as f:
    f.write(content)

