const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const route = `  app.get("/api/student/certificates/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
      if (isDBConnected) {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "کاربر یافت نشد" });
        res.json(user.certificates || []);
      } else {
        const user = memoryDB.users.find(u => u._id === userId);
        if (!user) return res.status(404).json({ error: "کاربر یافت نشد" });
        res.json(user.certificates || []);
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });`;

content = content.replace(route, '');
fs.writeFileSync('server.ts', content);
console.log('patched');
