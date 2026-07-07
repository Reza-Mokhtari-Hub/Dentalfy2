import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '''onClick={() => { setIsStudentMode(true); setIsRegisterMode(true); setRegisterRole("author"); setLoginError(null); }}''',
    '''onClick={() => { setIsStudentMode(false); setIsRegisterMode(true); setRegisterRole("author"); setLoginError(null); }}'''
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
