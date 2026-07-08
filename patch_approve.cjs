const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(
  'isApproved: false // Requires admin moderation',
  'isApproved: true // Auto-approved for demo'
);

content = content.replace(
  'isApproved: false // Moderator approves before showing on study tab',
  'isApproved: true // Auto-approved for demo'
);

content = content.replace(
  'isApproved: false as const',
  'isApproved: true as const'
);

fs.writeFileSync('server.ts', content);
console.log('patched');
