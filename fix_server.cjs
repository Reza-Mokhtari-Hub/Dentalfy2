const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

// I will look for:
/*
        let newlyIssued = false;
            // Log activity
            await AuditLog.create({
              actorName: "سیستم صدور سرتیفیکیت",
              action: "صدور خودکار گواهینامه",
              target: `${user.name} برای دوره ${courseTitle}`
            });
            // Notification
            await Notification.create({
              userId,
              title: "صدور گواهینامه دیجیتال",
              content: `تبریک! شما با موفقیت دوره "${courseTitle}" را به اتمام رساندید و گواهینامه معتبر صادر شد.`
            });
          }
        }
*/
const patternToReplace1 = `        let newlyIssued = false;
            // Log activity
            await AuditLog.create({
              actorName: "سیستم صدور سرتیفیکیت",
              action: "صدور خودکار گواهینامه",
              target: \`\${user.name} برای دوره \${courseTitle}\`
            });
            // Notification
            await Notification.create({
              userId,
              title: "صدور گواهینامه دیجیتال",
              content: \`تبریک! شما با موفقیت دوره "\${courseTitle}" را به اتمام رساندید و گواهینامه معتبر صادر شد.\`
            });
          }
        }`;

content = content.replace(patternToReplace1, `        let newlyIssued = false;`);

const patternToReplace2 = `        let newlyIssued = false;
            // Notification
            const newNotif = {
              _id: "notif-" + Date.now(),
              userId,
              title: "صدور گواهینامه دیجیتال",
              content: \`تبریک! شما با موفقیت دوره "\${courseTitle}" را به اتمام رساندید و گواهینامه معتبر صادر شد.\`,
              createdAt: new Date(),
              read: false
            };
            memoryDB.notifications.push(newNotif);
          }
        }`;

content = content.replace(patternToReplace2, `        let newlyIssued = false;`);

fs.writeFileSync('server.ts', content);
