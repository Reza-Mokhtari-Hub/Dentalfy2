const fs = require('fs');
let content = fs.readFileSync('src/components/PanelDashboard.tsx', 'utf8');

const target = `                    <select 
                      value={profileGenderInput}
                      onChange={(e) => setProfileGenderInput(e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold text-right focus:outline-none focus:border-indigo-500 transition-all"
                    >
                      <option value="">نامشخص</option>
                      <option value="male">مرد</option>
                      <option value="female">زن</option>
                      <option value="other">سایر</option>
                    </select>`;

const replacement = `                    <select 
                      value={profileGenderInput}
                      onChange={(e) => setProfileGenderInput(e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold text-right focus:outline-none focus:border-indigo-500 transition-all appearance-none"
                    >
                      <option value="">انتخاب کنید</option>
                      <option value="male">آقا</option>
                      <option value="female">خانم</option>
                    </select>`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/components/PanelDashboard.tsx', content);
  console.log('PanelDashboard patched');
} else {
  console.log('PanelDashboard target not found');
}
