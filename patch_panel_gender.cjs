const fs = require('fs');
let content = fs.readFileSync('src/components/PanelDashboard.tsx', 'utf8');

const target = `                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 mr-2">جنسیت</label>
                    <select 
                      value={profileGenderInput}
                      onChange={(e) => setProfileGenderInput(e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold text-right focus:outline-none focus:border-indigo-500 transition-all"
                    >
                      <option value="">نامشخص</option>
                      <option value="male">مرد</option>
                      <option value="female">زن</option>
                    </select>
                  </div>`;

const replacement = `                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 mr-2">جنسیت</label>
                    <select 
                      value={profileGenderInput}
                      onChange={(e) => setProfileGenderInput(e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold text-right focus:outline-none focus:border-indigo-500 transition-all"
                    >
                      <option value="">انتخاب کنید</option>
                      <option value="male">آقا</option>
                      <option value="female">خانم</option>
                    </select>
                  </div>`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/components/PanelDashboard.tsx', content);
  console.log('PanelDashboard patched');
} else {
  console.log('PanelDashboard target not found');
}
