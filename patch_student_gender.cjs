const fs = require('fs');
let content = fs.readFileSync('src/components/StudentPanel.tsx', 'utf8');

const target = `                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500">شماره همراه (OTP ثبت شده)</label>
                    <input 
                      type="text" 
                      value={profilePhone}
                      disabled
                      className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 font-mono text-center"
                    />
                  </div>
                </div>`;

const replacement = `                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500">شماره همراه (OTP ثبت شده)</label>
                    <input 
                      type="text" 
                      value={profilePhone}
                      disabled
                      className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 font-mono text-center"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500">جنسیت</label>
                  <select
                    value={profileGender}
                    onChange={(e) => setProfileGender(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="">نامشخص</option>
                    <option value="male">آقا</option>
                    <option value="female">خانم</option>
                  </select>
                </div>`;

content = content.replace(target, replacement);

const handleProfileUpdateTarget = `      body: JSON.stringify({
        name: profileName,
        email: profileEmail,
        profilePic,
        oldPassword,
        newPassword
      })`;

const handleProfileUpdateReplacement = `      body: JSON.stringify({
        name: profileName,
        email: profileEmail,
        profilePic,
        gender: profileGender,
        oldPassword,
        newPassword
      })`;

content = content.replace(handleProfileUpdateTarget, handleProfileUpdateReplacement);

fs.writeFileSync('src/components/StudentPanel.tsx', content);
console.log('StudentPanel patched');
