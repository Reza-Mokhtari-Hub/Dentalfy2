const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(
  '  app.post("/api/auth/register-author", async (req, res) => {\n    const { name, email, password, phoneNumber, bio, otpCode } = req.body;\n    if (!name || !email || !password || !phoneNumber || !otpCode) {',
  '  app.post("/api/auth/register-author", async (req, res) => {\n    const { name, email, password, phoneNumber, gender, bio, otpCode } = req.body;\n    if (!name || !email || !password || !phoneNumber || !otpCode || !gender) {'
);

content = content.replace(
  '        await AccountRequest.create({\n          name,\n          email: cleanEmail,\n          password,\n          phoneNumber,\n          bio,\n          status: "pending"\n        });',
  '        await AccountRequest.create({\n          name,\n          email: cleanEmail,\n          password,\n          phoneNumber,\n          gender,\n          bio,\n          status: "pending"\n        });'
);

content = content.replace(
  '        const newReq = {\n          _id: "req-" + Date.now(),\n          name,\n          email: cleanEmail,\n          password,\n          phoneNumber,\n          bio,\n          status: "pending" as const,\n          createdAt: new Date()\n        };\n        memoryDB.accountRequests.push(newReq);',
  '        const newReq = {\n          _id: "req-" + Date.now(),\n          name,\n          email: cleanEmail,\n          password,\n          phoneNumber,\n          gender,\n          bio,\n          status: "pending" as const,\n          createdAt: new Date()\n        };\n        memoryDB.accountRequests.push(newReq);'
);

fs.writeFileSync('server.ts', content);
console.log('patched');
