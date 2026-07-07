import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace('          onSelectPost={(post) => {\n            setSelectedPost(post);\n            setActiveView("post");\n          }}\n          onGoToPanel={() => setActiveView("panel")}', '          onSelectPost={(post) => {\n            setSelectedPost(post);\n            setActiveView("post");\n          }}\n          onGoToPanel={() => setActiveView("panel")}\n          onRegisterAuthor={() => { setIsStudentMode(true); setIsRegisterMode(true); setRegisterRole("author"); setActiveView("panel"); }}')

with open('src/App.tsx', 'w') as f:
    f.write(content)

with open('src/components/PublicHome.tsx', 'r') as f:
    content = f.read()

content = content.replace('  onGoToPanel: () => void;', '  onGoToPanel: () => void;\n  onRegisterAuthor: () => void;')
content = content.replace('}: { \n  settings: any, \n  courses: any[], \n  posts: any[], \n  onSelectPost: (post: any) => void, \n  onGoToPanel: () => void \n}) {', '}: { \n  settings: any, \n  courses: any[], \n  posts: any[], \n  onSelectPost: (post: any) => void, \n  onGoToPanel: () => void, \n  onRegisterAuthor: () => void \n}) {')

content = content.replace('''            <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-xl">
              دنتالفای فضایی ایمن و اختصاصی برای انتقال دانش بالینی، مرور سرفصل‌های دکتری عمومی و به اشتراک‌گذاری تجارب جراحی است. نوشته شده توسط برترین متخصصان و دندانپزشکان.
            </p>''', '''            <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-xl">
              دنتالفای فضایی ایمن و اختصاصی برای انتقال دانش بالینی، مرور سرفصل‌های دکتری عمومی و به اشتراک‌گذاری تجارب جراحی است. نوشته شده توسط برترین متخصصان و دندانپزشکان.
            </p>
            <div className="pt-4 flex flex-wrap gap-4 items-center justify-center md:justify-start">
              <button onClick={onRegisterAuthor} className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-sm text-center transition-all cursor-pointer">
                درخواست عضویت به عنوان نویسنده
              </button>
            </div>''')

with open('src/components/PublicHome.tsx', 'w') as f:
    f.write(content)

