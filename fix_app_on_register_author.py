import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '''onRegisterAuthor={() => { setIsStudentMode(true); setIsRegisterMode(true); setRegisterRole("author"); setActiveView("panel"); }}''',
    '''onRegisterAuthor={() => { setIsStudentMode(false); setIsRegisterMode(true); setRegisterRole("author"); setActiveView("panel"); }}\n          onStudentLogin={() => { setIsStudentMode(true); setIsRegisterMode(false); setActiveView("panel"); }}\n          onStudentRegister={() => { setIsStudentMode(true); setIsRegisterMode(true); setActiveView("panel"); }}'''
)

with open('src/App.tsx', 'w') as f:
    f.write(content)

