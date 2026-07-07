import re

with open('src/components/PublicHome.tsx', 'r') as f:
    content = f.read()

# 1. Update Props
old_props = '''export function PublicHome({ 
  settings, 
  courses, 
  posts, 
  onSelectPost, 
  onGoToPanel, 
  onRegisterAuthor 
}: { 
  settings: ISiteSettings; 
  courses: ICourse[]; 
  posts: IPost[]; 
  onSelectPost: (post: IPost) => void; 
  onGoToPanel: () => void; 
  onRegisterAuthor: () => void;
}) {'''

new_props = '''export function PublicHome({ 
  settings, 
  courses, 
  posts, 
  onSelectPost, 
  onGoToPanel, 
  onRegisterAuthor,
  onStudentLogin,
  onStudentRegister
}: { 
  settings: ISiteSettings; 
  courses: ICourse[]; 
  posts: IPost[]; 
  onSelectPost: (post: IPost) => void; 
  onGoToPanel: () => void; 
  onRegisterAuthor: () => void;
  onStudentLogin?: () => void;
  onStudentRegister?: () => void;
}) {'''

content = content.replace(old_props, new_props)

# 2. Add to mobile menu
old_mobile_menu = '''                <div className="grid grid-cols-2 gap-3 mt-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                  <button onClick={() => { setIsMobileMenuOpen(false); onRegisterAuthor(); }} className="py-3 text-xs font-bold text-teal-700 bg-teal-50 dark:bg-teal-900/30 dark:text-teal-300 rounded-xl text-center cursor-pointer">
                    عضویت مدرس
                  </button>
                  <button onClick={() => { setIsMobileMenuOpen(false); onGoToPanel(); }} className="py-3 bg-slate-800 dark:bg-white dark:text-slate-900 text-white text-xs font-bold rounded-xl text-center cursor-pointer">
                    ورود به پنل
                  </button>
                </div>'''

new_mobile_menu = '''                <div className="grid grid-cols-2 gap-3 mt-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                  <button onClick={() => { setIsMobileMenuOpen(false); onRegisterAuthor(); }} className="py-3 text-xs font-bold text-teal-700 bg-teal-50 dark:bg-teal-900/30 dark:text-teal-300 rounded-xl text-center cursor-pointer">
                    عضویت مدرس
                  </button>
                  <button onClick={() => { setIsMobileMenuOpen(false); if(onStudentRegister) onStudentRegister(); }} className="py-3 text-xs font-bold text-blue-700 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300 rounded-xl text-center cursor-pointer">
                    عضویت دانشجو
                  </button>
                  <button onClick={() => { setIsMobileMenuOpen(false); onGoToPanel(); }} className="py-3 col-span-2 bg-slate-800 dark:bg-white dark:text-slate-900 text-white text-xs font-bold rounded-xl text-center cursor-pointer">
                    ورود به پنل
                  </button>
                </div>'''

content = content.replace(old_mobile_menu, new_mobile_menu)

# 3. Add to Hero Section
old_hero_buttons = '''          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="#courses" className="w-full sm:w-auto px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-extrabold text-sm shadow-xl shadow-teal-600/20 transition-all flex items-center justify-center gap-2">
              شروع یادگیری <ArrowLeft className="w-4 h-4" />
            </a>
            <button onClick={onRegisterAuthor} className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 rounded-2xl font-extrabold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer">
              پیوستن به عنوان مدرس
            </button>
          </motion.div>'''

new_hero_buttons = '''          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button onClick={onStudentRegister} className="w-full sm:w-auto px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-extrabold text-sm shadow-xl shadow-teal-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer">
              عضویت دانشجو <ArrowLeft className="w-4 h-4" />
            </button>
            <button onClick={onRegisterAuthor} className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 rounded-2xl font-extrabold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer">
              پیوستن به عنوان مدرس
            </button>
          </motion.div>'''

content = content.replace(old_hero_buttons, new_hero_buttons)

# 4. Desktop nav top menu
old_desktop_nav = '''            <nav className="hidden md:flex items-center gap-6">
              <a href="#courses" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">دروس تخصصی</a>
              <a href="#posts" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">مقالات بالینی</a>
              <a href="#library" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">کتابخانه فرم‌ها</a>
              <div className="flex items-center gap-3 mr-4">
                <button onClick={onRegisterAuthor} className="px-5 py-2.5 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 dark:bg-teal-900/30 dark:text-teal-300 dark:hover:bg-teal-900/50 rounded-xl transition-colors cursor-pointer">
                  عضویت مدرس
                </button>
                <button onClick={onGoToPanel} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-slate-800/10 cursor-pointer">
                  ورود به پنل
                </button>
              </div>
            </nav>'''

new_desktop_nav = '''            <nav className="hidden md:flex items-center gap-6">
              <a href="#courses" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">دروس تخصصی</a>
              <a href="#posts" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">مقالات بالینی</a>
              <a href="#library" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">کتابخانه فرم‌ها</a>
              <div className="flex items-center gap-3 mr-4">
                <button onClick={onStudentRegister} className="px-5 py-2.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 rounded-xl transition-colors cursor-pointer">
                  عضویت دانشجو
                </button>
                <button onClick={onRegisterAuthor} className="px-5 py-2.5 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 dark:bg-teal-900/30 dark:text-teal-300 dark:hover:bg-teal-900/50 rounded-xl transition-colors cursor-pointer">
                  عضویت مدرس
                </button>
                <button onClick={onGoToPanel} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-slate-800/10 cursor-pointer">
                  ورود 
                </button>
              </div>
            </nav>'''

content = content.replace(old_desktop_nav, new_desktop_nav)

with open('src/components/PublicHome.tsx', 'w') as f:
    f.write(content)
