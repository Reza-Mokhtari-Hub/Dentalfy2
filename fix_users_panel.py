import re

with open('src/components/PanelDashboard.tsx', 'r') as f:
    content = f.read()

# Change the sidebar button text
old_writers_btn = '''                <button 
                  onClick={() => { setActiveTab("writers" as any); setIsMobileSidebarOpen(false); setIsCreatingPost(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold cursor-pointer transition-colors ${activeTab === ("writers" as any) ? "bg-teal-50 text-teal-700" : "text-slate-500 hover:bg-slate-50 dark:bg-slate-900"}`}
                >
                  <Users className="w-4 h-4" /> مدیریت نویسندگان علمی
                  <span className="mr-auto bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {allUsers.filter(u => u.role === "author").length}
                  </span>
                </button>'''

new_writers_btn = '''                <button 
                  onClick={() => { setActiveTab("users" as any); setIsMobileSidebarOpen(false); setIsCreatingPost(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold cursor-pointer transition-colors ${activeTab === ("users" as any) ? "bg-teal-50 text-teal-700" : "text-slate-500 hover:bg-slate-50 dark:bg-slate-900"}`}
                >
                  <Users className="w-4 h-4" /> مدیریت کاربران
                  <span className="mr-auto bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {allUsers.length}
                  </span>
                </button>'''

content = content.replace(old_writers_btn, new_writers_btn)

# Change the rendering logic to show all users (or separated by role)
old_writers_render = '''          ) : activeTab === ("writers" as any) ? (
            /* --- WRITERS MANAGEMENT TAB --- */
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                <h3 className="font-extrabold text-xs text-slate-700 dark:text-slate-200 border-r-4 border-teal-500 pr-2">لیست نویسندگان و همکاران علمی آکادمی</h3>
                <p className="text-[11px] text-slate-400">در این بخش می‌توانید حساب‌های کاربری نویسندگان را مدیریت، تعلیق یا رمز عبور آن‌ها را به صورت دستی تغییر دهید.</p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900 text-slate-400 text-[10px] uppercase tracking-wider">
                      <th className="px-6 py-4 font-extrabold">پزشک / نویسنده</th>
                      <th className="px-6 py-4 font-extrabold">ایمیل</th>
                      <th className="px-6 py-4 font-extrabold">وضعیت حساب</th>
                      <th className="px-6 py-4 font-extrabold">نقش سیستم</th>
                      <th className="px-6 py-4 font-extrabold text-left">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {allUsers.filter(u => u.role === "author").length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-400 text-xs">
                          هیچ نویسنده‌ای یافت نشد.
                        </td>
                      </tr>
                    ) : (
                      allUsers.filter(u => u.role === "author").map(user => ('''

new_writers_render = '''          ) : activeTab === ("users" as any) ? (
            /* --- USERS MANAGEMENT TAB --- */
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                <h3 className="font-extrabold text-xs text-slate-700 dark:text-slate-200 border-r-4 border-teal-500 pr-2">لیست کاربران (نویسندگان و دانشجویان)</h3>
                <p className="text-[11px] text-slate-400">در این بخش می‌توانید حساب‌های کاربری را مشاهده و مدیریت کنید.</p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900 text-slate-400 text-[10px] uppercase tracking-wider">
                      <th className="px-6 py-4 font-extrabold">نام کاربر</th>
                      <th className="px-6 py-4 font-extrabold">ایمیل</th>
                      <th className="px-6 py-4 font-extrabold">وضعیت حساب</th>
                      <th className="px-6 py-4 font-extrabold">نقش سیستم</th>
                      <th className="px-6 py-4 font-extrabold text-left">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {allUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-400 text-xs">
                          هیچ کاربری یافت نشد.
                        </td>
                      </tr>
                    ) : (
                      allUsers.map(user => ('''

content = content.replace(old_writers_render, new_writers_render)
content = content.replace('allUsers.filter(u => u.role === "author").length', 'allUsers.length')

with open('src/components/PanelDashboard.tsx', 'w') as f:
    f.write(content)
