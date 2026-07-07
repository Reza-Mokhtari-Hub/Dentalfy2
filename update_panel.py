import re

with open('src/components/PanelDashboard.tsx', 'r') as f:
    content = f.read()

# Add a mobile menu state
import_match = re.search(r'const \[activeTab, setActiveTab\] = useState<[^>]+>\("dashboard"\);', content)
if import_match:
    insertion = '\n  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);\n'
    content = content[:import_match.end()] + insertion + content[import_match.end():]

# Add Menu icon to imports if not there
if 'Menu' not in content[:content.find('}')]:
    content = content.replace('LogOut,', 'LogOut, Menu, X,')

# Replace the layout wrapper
old_wrapper = '''  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-200" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 flex flex-col shrink-0 overflow-y-auto">'''

new_wrapper = '''  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-200 overflow-hidden" dir="rtl">
      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:relative z-50 w-64 h-full bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 flex flex-col shrink-0 overflow-y-auto transition-transform duration-300 ${isMobileSidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}`}>
        <div className="md:hidden flex justify-end p-4">
          <button onClick={() => setIsMobileSidebarOpen(false)} className="p-2 text-slate-500 bg-slate-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>'''

if old_wrapper in content:
    content = content.replace(old_wrapper, new_wrapper)

# Update the Header bar inside main to add a hamburger menu button
old_header = '''        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-8 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-base font-extrabold text-slate-800 dark:text-slate-100">داشبورد یکپارچه دنتالفای</h1>
            <p className="text-[10px] text-slate-400 font-medium">سرویس دهی ابری و مانیتورینگ امن با RMO Cloud Node</p>
          </div>'''

new_header = '''        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 sm:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 text-slate-600 bg-slate-100 rounded-xl"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-slate-100">داشبورد یکپارچه</h1>
              <p className="text-[9px] sm:text-[10px] text-slate-400 font-medium hidden sm:block">سرویس دهی ابری و مانیتورینگ امن با RMO Cloud Node</p>
            </div>
          </div>'''

if old_header in content:
    content = content.replace(old_header, new_header)
    
# When clicking any sidebar item, we should close the sidebar on mobile
content = content.replace('setActiveTab("dashboard");', 'setActiveTab("dashboard"); setIsMobileSidebarOpen(false);')
content = content.replace('setActiveTab("posts");', 'setActiveTab("posts"); setIsMobileSidebarOpen(false);')
content = content.replace('setActiveTab("comments");', 'setActiveTab("comments"); setIsMobileSidebarOpen(false);')
content = content.replace('setActiveTab("courses");', 'setActiveTab("courses"); setIsMobileSidebarOpen(false);')
content = content.replace('setActiveTab("requests");', 'setActiveTab("requests"); setIsMobileSidebarOpen(false);')
content = content.replace('setActiveTab("writers" as any);', 'setActiveTab("writers" as any); setIsMobileSidebarOpen(false);')
content = content.replace('setActiveTab("libraryAndFaqs");', 'setActiveTab("libraryAndFaqs"); setIsMobileSidebarOpen(false);')
content = content.replace('setActiveTab("siteSettings");', 'setActiveTab("siteSettings"); setIsMobileSidebarOpen(false);')
content = content.replace('setActiveTab("profile");', 'setActiveTab("profile"); setIsMobileSidebarOpen(false);')


with open('src/components/PanelDashboard.tsx', 'w') as f:
    f.write(content)

