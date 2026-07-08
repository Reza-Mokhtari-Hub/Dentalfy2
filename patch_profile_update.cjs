const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(
  '  app.post("/api/profile/update", async (req, res) => {\n    const { userId, name, email, oldPassword, newPassword, profilePicture } = req.body;',
  '  app.post("/api/profile/update", async (req, res) => {\n    const { userId, name, email, oldPassword, newPassword, profilePicture, gender } = req.body;'
);

content = content.replace(
  '        if (name) user.name = name;\n        if (email) user.email = email.toLowerCase().trim();\n        if (profilePicture) user.profilePicture = profilePicture;\n\n        await user.save();',
  '        if (name) user.name = name;\n        if (email) user.email = email.toLowerCase().trim();\n        if (profilePicture) user.profilePicture = profilePicture;\n        if (gender !== undefined) user.gender = gender;\n\n        await user.save();'
);

content = content.replace(
  '        if (name) user.name = name;\n        if (email) user.email = email.toLowerCase().trim();\n        if (profilePicture) user.profilePicture = profilePicture;\n      }\n\n      res.json({ success: true, message: "پروفایل با موفقیت بروزرسانی شد" });',
  '        if (name) user.name = name;\n        if (email) user.email = email.toLowerCase().trim();\n        if (profilePicture) user.profilePicture = profilePicture;\n        if (gender !== undefined) user.gender = gender;\n      }\n\n      res.json({ success: true, message: "پروفایل با موفقیت بروزرسانی شد" });'
);

fs.writeFileSync('server.ts', content);
console.log('patched');
