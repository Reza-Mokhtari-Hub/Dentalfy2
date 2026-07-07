import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '''onStudentRegister={() => { setIsStudentMode(true); setIsRegisterMode(true); setActiveView("panel"); }}''',
    '''onStudentRegister={() => { setIsStudentMode(true); setIsRegisterMode(true); setRegisterRole("student"); setActiveView("panel"); }}'''
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
