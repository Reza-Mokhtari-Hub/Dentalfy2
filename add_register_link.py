import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace('''                      <div className="flex justify-center items-center text-[10px] font-bold text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button 
                          type="button" 
                          onClick={() => { setShowForgotForm(true); setLoginError(null); }}
                          className="hover:text-teal-600 cursor-pointer"
                        >
                          فراموشی رمز عبور نویسنده؟
                        </button>
                      </div>''', '''                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button 
                          type="button" 
                          onClick={() => { setIsStudentMode(true); setIsRegisterMode(true); setRegisterRole("author"); setLoginError(null); }}
                          className="hover:text-teal-600 cursor-pointer text-teal-600"
                        >
                          ثبت نام نویسنده جدید
                        </button>
                        <button 
                          type="button" 
                          onClick={() => { setShowForgotForm(true); setLoginError(null); }}
                          className="hover:text-teal-600 cursor-pointer"
                        >
                          فراموشی رمز عبور نویسنده؟
                        </button>
                      </div>''')

with open('src/App.tsx', 'w') as f:
    f.write(content)
