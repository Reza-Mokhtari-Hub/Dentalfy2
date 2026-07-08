const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const target1 = `        const comment = await Comment.create({
          postId,
          name,
          email,
          text,
          role: role || "public",
          isApproved: autoApprove
        });`;

const replacement1 = `        const comment = await Comment.create({
          postId,
          name,
          email,
          text,
          role: role || "public",
          isApproved: true // Auto-approved for demo
        });`;

const target2 = `        const comment = {
          _id: "mem-cmt-" + Date.now(),
          postId,
          name,
          email,
          text,
          role: role || "public",
          isApproved: autoApprove,
          createdAt: new Date()
        };`;

const replacement2 = `        const comment = {
          _id: "mem-cmt-" + Date.now(),
          postId,
          name,
          email,
          text,
          role: role || "public",
          isApproved: true, // Auto-approved for demo
          createdAt: new Date()
        };`;

content = content.replace(target1, replacement1);
content = content.replace(target2, replacement2);

fs.writeFileSync('server.ts', content);
console.log('Post comments auto-approve patched');
