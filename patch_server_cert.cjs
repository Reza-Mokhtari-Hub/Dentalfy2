const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

// Remove empty certificates arrays in initialization
content = content.replace(/          certificates: \[\]\n/g, '');
content = content.replace(/            certificates: \[\]\n/g, '');
content = content.replace(/          certificates: \[\] as any\[\],\n/g, '');

// The block for auto generating certificates in db connected
const certBlockDB = `
        // Auto-generate certificate if progress hits 100% and not already generated
        let newlyIssued = false;
        let certificateId = "";
        if (newPercentage === 100) {
          const certExists = user.certificates.some(c => c.courseId === courseId);
          if (!certExists) {
            certificateId = "CERT-" + Math.floor(100000 + Math.random() * 900000);
            user.certificates.push({
              certificateId,
              courseId,
              courseTitle: req.body.courseTitle || courseId,
              studentName: user.name,
              issuedAt: new Date()
            });
            newlyIssued = true;
          }
        }`;
content = content.replace(certBlockDB, '\n        let newlyIssued = false;');
content = content.replace('res.json({ success: true, progress: user.progress[progIndex], newlyIssued, certificateId });', 'res.json({ success: true, progress: user.progress[progIndex], newlyIssued });');

// The block for auto generating certificates in memory DB
const certBlockMem = `
        let newlyIssued = false;
        let certificateId = "";
        if (newPercentage === 100) {
          const certExists = user.certificates.some((c: any) => c.courseId === courseId);
          if (!certExists) {
            certificateId = "CERT-" + Math.floor(100000 + Math.random() * 900000);
            user.certificates.push({
              certificateId,
              courseId,
              courseTitle: req.body.courseTitle || courseId,
              studentName: user.name,
              issuedAt: new Date()
            });
            newlyIssued = true;
          }
        }`;
content = content.replace(certBlockMem, '\n        let newlyIssued = false;');

const routeCert = `
  app.get("/api/student/certificates/:userId", async (req, res) => {
    try {
      if (isDBConnected) {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user.certificates || []);
      } else {
        const user = memoryDB.users.find(u => u._id === req.params.userId);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user.certificates || []);
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });`;
content = content.replace(routeCert, '');

fs.writeFileSync('server.ts', content);
console.log('patched');
