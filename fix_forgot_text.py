import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace('''                      <h3 className="font-bold text-slate-700 dark:text-slate-200 text-center">ارسال درخواست بازیابی رمز به مدیر</h3>
                      <p className="text-[10px] text-slate-400 leading-relaxed text-center">
                        مشخصات ایمیل خود را وارد نمایید. درخواست شما در داشبورد مدیر ثبت شده و پس از تأیید، یک رمز عبور موقت برای ورود دریافت خواهید کرد.
                      </p>''', '''                      <h3 className="font-bold text-slate-700 dark:text-slate-200 text-center">بازیابی رمز عبور</h3>
                      <p className="text-[10px] text-slate-400 leading-relaxed text-center">
                        ایمیل خود را وارد نمایید تا رمز عبور جدید به آن ارسال شود.
                      </p>''')

# Also change the button text
content = content.replace('''                      <button 
                        type="submit"
                        className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        ارسال درخواست بازیابی
                      </button>''', '''                      <button 
                        type="submit"
                        className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        دریافت رمز عبور جدید
                      </button>''')

with open('src/App.tsx', 'w') as f:
    f.write(content)
