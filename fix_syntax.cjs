const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(/,\s*,/g, ',');
content = content.replace(/,\s*\}/g, '}');

fs.writeFileSync('server.ts', content);
