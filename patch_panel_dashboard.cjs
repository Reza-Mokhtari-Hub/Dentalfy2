const fs = require('fs');
let content = fs.readFileSync('src/components/PanelDashboard.tsx', 'utf8');

content = content.replace(
  '  const [profileEmailInput, setProfileEmailInput] = useState(currentUser.email || "");',
  '  const [profileEmailInput, setProfileEmailInput] = useState(currentUser.email || "");\n  const [profileGenderInput, setProfileGenderInput] = useState(currentUser.gender || "");'
);

content = content.replace(
  '        name: profileNameInput,\n        email: profileEmailInput,\n        oldPassword: oldPasswordInput,',
  '        name: profileNameInput,\n        email: profileEmailInput,\n        gender: profileGenderInput,\n        oldPassword: oldPasswordInput,'
);

const emailField = `<div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 mr-2">پست الکترونیک</label>
                    <input 
                      type="email" 
                      value={profileEmailInput}
                      onChange={(e) => setProfileEmailInput(e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold text-left focus:outline-none focus:border-indigo-500 transition-all"
                      dir="ltr"
                      required
                    />
                  </div>`;

const replacement = emailField + `
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 mr-2">جنسیت</label>
                    <select 
                      value={profileGenderInput}
                      onChange={(e) => setProfileGenderInput(e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold text-right focus:outline-none focus:border-indigo-500 transition-all"
                    >
                      <option value="">نامشخص</option>
                      <option value="male">مرد</option>
                      <option value="female">زن</option>
                      <option value="other">سایر</option>
                    </select>
                  </div>`;

content = content.replace(emailField, replacement);

fs.writeFileSync('src/components/PanelDashboard.tsx', content);
console.log('patched');
