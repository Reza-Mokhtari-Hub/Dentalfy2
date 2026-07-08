const fs = require('fs');
let content = fs.readFileSync('src/components/StudentPanel.tsx', 'utf8');

const startStr = '{/* Digital Certificate Builder Preview */}';
const endStr = '{/* Study QA Board - ENHANCED */}';

const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
  const blockToRemove = content.substring(startIndex, endIndex);
  content = content.replace(blockToRemove, '');
  fs.writeFileSync('src/components/StudentPanel.tsx', content);
  console.log('patched');
} else {
  console.log('not found');
}
