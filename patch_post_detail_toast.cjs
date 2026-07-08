const fs = require('fs');
let content = fs.readFileSync('src/components/PostDetail.tsx', 'utf8');

content = content.replace(
  'setSubmitMsg("پرسش / نظر شما ثبت شد و آماده پاسخ نویسنده یا مدیر علمی است.");',
  'setSubmitMsg("پرسش / نظر شما با موفقیت ثبت شد.");'
);

fs.writeFileSync('src/components/PostDetail.tsx', content);
console.log('PostDetail toast patched');
