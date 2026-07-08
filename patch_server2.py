import re

with open('server.ts', 'r') as f:
    lines = f.readlines()

new_lines = []
skip = False
for line in lines:
    if line.startswith('// Configure Cloudinary if credentials are provided'):
        skip = True
    
    if skip and 'console.warn("⚠️ Cloudinary credentials' in line:
        pass  # skip next line '}'
        continue
    if skip and '}' in line:
        skip = False
        continue
        
    if skip:
        continue
        
    new_lines.append(line)

content = "".join(new_lines)

inject = '''export async function startServer() {
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
      console.log("☁️ Cloudinary is configured and active.");
    }
  } else {
    console.warn("⚠️ Cloudinary credentials not fully specified. Falling back to local Base64 media storage.");
  }'''
content = content.replace('export async function startServer() {\n  const app = express();', inject)

with open('server.ts', 'w') as f:
    f.write(content)

