const fs = require('fs');
let content = fs.readFileSync('src/components/StudentPanel.tsx', 'utf8');

content = content.replace(
  'showToast("ارزیابی شما ثبت شد و پس از تأیید نهایی ادمین نمایش داده می‌شود.");',
  'showToast("ارزیابی شما با موفقیت ثبت شد.");'
);
content = content.replace(
  'showToast("پرسش بالینی شما با موفقیت به اساتید و پزشکان همکار ارسال شد.");',
  'showToast("پرسش بالینی شما با موفقیت ثبت شد.");'
);

fs.writeFileSync('src/components/StudentPanel.tsx', content);
console.log('Toasts patched');
