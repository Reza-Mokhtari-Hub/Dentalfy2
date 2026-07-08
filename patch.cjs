const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

// The exact block to remove
const startIdx = content.indexOf('// Configure Cloudinary if credentials are provided');
const endIdx = content.indexOf('console.warn("⚠️ Cloudinary credentials are not set. Image uploads will fail.");\n}');

if(startIdx !== -1 && endIdx !== -1) {
  content = content.substring(0, startIdx) + content.substring(endIdx + 87);
}

// Inject it inside startServer if not already there
if (!content.includes('const useCloudinary = !!(')) {
  const injectTarget = 'async function startServer() {\n  const app = express();';
  const newBlock = `async function startServer() {
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
  }`;
  content = content.replace(injectTarget, newBlock);
}

fs.writeFileSync('server.ts', content);
