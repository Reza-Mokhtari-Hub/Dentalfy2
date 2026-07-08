const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

// Replace certificates property initialization in memory arrays
content = content.replace(/certificates:\s*\[\]/g, '');

// I will just use regex to remove the certificates part from the API
content = content.replace(/\/\/ Auto-generate certificate if progress hits 100% and not already generated[\s\S]*?newlyIssued = true;[\s\S]*?\/\/ Log activity/g, 'let newlyIssued = false;\n            // Log activity');

content = content.replace(/res\.json\(\{ success: true, progress: user\.progress\[progIndex\], newlyIssued, certificateId \}\);/g, 'res.json({ success: true, progress: user.progress[progIndex], newlyIssued });');

fs.writeFileSync('server.ts', content);
console.log('patched');
