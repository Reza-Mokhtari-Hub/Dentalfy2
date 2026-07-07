import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = re.sub(r'                      <div className="text-center pt-4 border-t border-slate-100 dark:border-slate-800">\n                         <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">\n                            <p className="text-\[10px\] text-slate-500 dark:text-slate-400 leading-relaxed font-bold">\n                              برای پیوستن به تیم نویسندگان و اعضای هیئت علمی دنتالفای، لطفاً درخواست و رزومه خود را به آدرس ایمیل <span className="font-mono text-teal-600 dark:text-teal-400">admin@rmo.local<\/span> ارسال نمایید\.\n                            <\/p>\n                         <\/div>\n                      <\/div>', '', content)

with open('src/App.tsx', 'w') as f:
    f.write(content)
