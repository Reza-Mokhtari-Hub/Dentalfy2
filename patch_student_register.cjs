const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(
  '  app.post("/api/auth/register-student", async (req, res) => {\n    const { name, email, password, phoneNumber, otpCode } = req.body;\n    if (!name || !email || !password || !phoneNumber || !otpCode) {\n      return res.status(400).json({ error: "پر کردن تمامی فیلدها الزامی است" });\n    }',
  '  app.post("/api/auth/register-student", async (req, res) => {\n    const { name, email, password, phoneNumber, otpCode, gender } = req.body;\n    if (!name || !email || !password || !phoneNumber || !otpCode || !gender) {\n      return res.status(400).json({ error: "پر کردن تمامی فیلدها الزامی است" });\n    }'
);

content = content.replace(
  '        const newUser = await User.create({\n          name,\n          email: email.toLowerCase().trim(),\n          password,\n          phoneNumber,\n          role: "student",\n          profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",',
  '        const newUser = await User.create({\n          name,\n          email: email.toLowerCase().trim(),\n          password,\n          phoneNumber,\n          gender,\n          role: "student",\n          profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",'
);

content = content.replace(
  '            role: newUser.role,\n            phoneNumber: newUser.phoneNumber,\n            bookmarks: [],',
  '            role: newUser.role,\n            gender: newUser.gender,\n            phoneNumber: newUser.phoneNumber,\n            bookmarks: [],'
);

content = content.replace(
  '        const newUserObj = {\n          _id: memUserId,\n          name,\n          email: email.toLowerCase().trim(),\n          password,\n          phoneNumber,\n          role: "student" as const,\n          profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",',
  '        const newUserObj = {\n          _id: memUserId,\n          name,\n          email: email.toLowerCase().trim(),\n          password,\n          phoneNumber,\n          gender,\n          role: "student" as const,\n          profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",'
);

content = content.replace(
  '            role: "student",\n            phoneNumber,\n            bookmarks: [],',
  '            role: "student",\n            gender,\n            phoneNumber,\n            bookmarks: [],'
);

fs.writeFileSync('server.ts', content);
console.log('patched');
