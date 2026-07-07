import re

with open('src/components/PanelDashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans" dir="rtl">',
    '<div className="flex flex-col md:flex-row h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans overflow-hidden" dir="rtl">'
)

with open('src/components/PanelDashboard.tsx', 'w') as f:
    f.write(content)

