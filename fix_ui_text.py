import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace("عضویت و احراز هویت دانش‌پذیران", "{registerRole === 'author' ? 'عضویت و احراز هویت نویسندگان' : 'عضویت و احراز هویت دانش‌پذیران'}")
content = content.replace("ثبت نام دانشجو", "{registerRole === 'author' ? 'ثبت نام نویسنده' : 'ثبت نام دانشجو'}")
content = content.replace("ارسال کد تایید به ایمیل دانشجو", "{registerRole === 'author' ? 'ارسال کد تایید به ایمیل نویسنده' : 'ارسال کد تایید به ایمیل دانشجو'}")
content = content.replace("ایمیل دانشجو", "{registerRole === 'author' ? 'ایمیل نویسنده' : 'ایمیل دانشجو'}")

with open('src/App.tsx', 'w') as f:
    f.write(content)
