import re

with open('server.ts', 'r') as f:
    content = f.read()

# Replace the cloudinary block with nothing
pattern = r'// Configure Cloudinary if credentials are provided.*?console\.warn\("⚠️ Cloudinary credentials are not set\. Image uploads will fail\."\);\n\}'
content = re.sub(pattern, '', content, flags=re.DOTALL)

# Inject inside startServer
inject = '''async function startServer() {
  const app = express();

  const useCloudinary = !!(
    process.env.CLOUDINARY_URL ||
    (process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET)
  );

  if (useCloudinary) {
    if (process.env.CLOUDINARY_URL) {
      cloudinary.config();
      console.log("☁️ Cloudinary is configured and active using CLOUDINARY_URL.");
    } else {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
      console.log("☁️ Cloudinary is configured and active using discrete credentials.");
    }
  } else {
    console.warn("⚠️ Cloudinary credentials are not set. Image uploads will fail.");
  }'''
content = content.replace('async function startServer() {\n  const app = express();', inject)

with open('server.ts', 'w') as f:
    f.write(content)
