import re

with open('src/components/PanelDashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '''<td className="px-6 py-3.5 text-slate-500 font-bold uppercase text-[10px]">نویسنده علمی</td>''',
    '''<td className="px-6 py-3.5 text-slate-500 font-bold uppercase text-[10px]">{user.role === 'author' ? 'نویسنده علمی' : user.role === 'admin' ? 'مدیر سیستم' : 'دانشجو'}</td>'''
)

with open('src/components/PanelDashboard.tsx', 'w') as f:
    f.write(content)
