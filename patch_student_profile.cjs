const fs = require('fs');
let content = fs.readFileSync('src/components/StudentPanel.tsx', 'utf8');

content = content.replace(
  '  const [profilePhone, setProfilePhone] = useState<string>(currentUser.phoneNumber || "");',
  '  const [profilePhone, setProfilePhone] = useState<string>(currentUser.phoneNumber || "");\n  const [profileGender, setProfileGender] = useState<string>(currentUser.gender || "");'
);

content = content.replace(
  '          name: profileName,\n          email: profileEmail,\n          oldPassword,\n          newPassword,\n          profilePicture: profilePic\n        })',
  '          name: profileName,\n          email: profileEmail,\n          gender: profileGender,\n          oldPassword,\n          newPassword,\n          profilePicture: profilePic\n        })'
);

// We need to add a gender selector to the profile form in StudentPanel.
const phoneField = `<div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">شماره موبایل</label>
                      <input 
                        type="tel" 
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 text-left font-sans"
                        dir="ltr"
                      />
                    </div>`;

const replacement = phoneField + `
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">جنسیت</label>
                      <select 
                        value={profileGender}
                        onChange={(e) => setProfileGender(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300"
                      >
                        <option value="">نامشخص</option>
                        <option value="male">مرد</option>
                        <option value="female">زن</option>
                        <option value="other">سایر</option>
                      </select>
                    </div>`;

content = content.replace(phoneField, replacement);

fs.writeFileSync('src/components/StudentPanel.tsx', content);
console.log('patched');
