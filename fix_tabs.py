import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace('onClick={() => { setIsStudentMode(true); setIsRegisterMode(false); setLoginError(null); }}', 'onClick={() => { setIsStudentMode(true); setIsRegisterMode(false); setRegisterRole("student"); setLoginError(null); }}')
content = content.replace('onClick={() => { setIsStudentMode(false); setLoginError(null); }}', 'onClick={() => { setIsStudentMode(false); setIsRegisterMode(false); setLoginError(null); }}')

with open('src/App.tsx', 'w') as f:
    f.write(content)
