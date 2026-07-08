const fs = require('fs');
let content = fs.readFileSync('src/components/StudentPanel.tsx', 'utf8');

const startCert = '{/* Digital Certificate Builder Preview */}';
const endCert = '{/* Study QA Board */}';

const startIndexCert = content.indexOf(startCert);
const endIndexCert = content.indexOf(endCert);

if (startIndexCert !== -1 && endIndexCert !== -1) {
  const toRemove = content.substring(startIndexCert, endIndexCert);
  content = content.replace(toRemove, '');
  fs.writeFileSync('src/components/StudentPanel.tsx', content);
  console.log('removed cert');
} else {
  console.log('cert not found');
}
