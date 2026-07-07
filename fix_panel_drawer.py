import re

with open('src/components/PanelDashboard.tsx', 'r') as f:
    content = f.read()

# Replace the wrapper and sidebar class
old_sidebar = '''      {/* Left Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white dark:bg-slate-800 border-b md:border-b-0 md:border-l border-slate-200 dark:border-slate-700 flex flex-col justify-between shrink-0 h-auto md:h-full z-10">'''

new_sidebar = '''      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar Navigation */}
      <aside className={`fixed md:relative top-0 right-0 z-50 w-64 h-full bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 flex flex-col justify-between shrink-0 transition-transform duration-300 ${isMobileSidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}`}>
        <div className="md:hidden flex justify-end p-4 border-b border-slate-100 dark:border-slate-800">
          <button onClick={() => setIsMobileSidebarOpen(false)} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
            ✕ بستن منو
          </button>
        </div>'''

content = content.replace(old_sidebar, new_sidebar)

# Restore outer wrapper to flex-row
content = content.replace(
    '<div className="flex flex-col md:flex-row h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans overflow-hidden" dir="rtl">',
    '<div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans overflow-hidden" dir="rtl">'
)

# And add the menu button to the header
old_header = '''        {/* Header bar */}
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-8 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-base font-extrabold text-slate-800 dark:text-slate-100">داشبورد یکپارچه دنتالفای</h1>
            <p className="text-[10px] text-slate-400 font-medium">سرویس دهی ابری و مانیتورینگ امن با RMO Cloud Node</p>
          </div>'''

new_header = '''        {/* Header bar */}
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 sm:px-8 flex items-center justify-between shrink-0 gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-xl"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-slate-100">داشبورد یکپارچه</h1>
              <p className="text-[9px] sm:text-[10px] text-slate-400 font-medium hidden sm:block">سرویس دهی ابری و مانیتورینگ امن</p>
            </div>
          </div>'''

if old_header in content:
    content = content.replace(old_header, new_header)

with open('src/components/PanelDashboard.tsx', 'w') as f:
    f.write(content)
