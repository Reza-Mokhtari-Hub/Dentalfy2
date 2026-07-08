const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf8');

content = content.replace(
  'export interface IAccountRequest {\n  id: string;\n  _id?: string;\n  name: string;\n  email: string;\n  bio?: string;\n  status: "pending" | "approved" | "rejected";\n  createdAt?: string;\n}',
  'export interface IAccountRequest {\n  id: string;\n  _id?: string;\n  name: string;\n  email: string;\n  bio?: string;\n  status: "pending" | "approved" | "rejected";\n  createdAt?: string;\n  gender?: "male" | "female" | "other" | "";\n}'
);

fs.writeFileSync('src/types.ts', content);
console.log('patched');
