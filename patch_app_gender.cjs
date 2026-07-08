const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// For student registration (around line 414)
const studentNameInput = `                        <input 
                          type="text" 
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          placeholder="مثال: دکتر علیرضا رضایی" 
                          className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-black focus:outline-none focus:border-indigo-500 transition-all"
                          required
                        />
                      </div>`;

const studentGenderSelect = `                        <input 
                          type="text" 
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          placeholder="مثال: دکتر علیرضا رضایی" 
                          className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-black focus:outline-none focus:border-indigo-500 transition-all"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-500 mr-2">جنسیت</label>
                        <select
                          value={studentGender}
                          onChange={(e) => setStudentGender(e.target.value)}
                          className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-black focus:outline-none focus:border-indigo-500 transition-all"
                          required
                        >
                          <option value="">انتخاب کنید</option>
                          <option value="male">آقا</option>
                          <option value="female">خانم</option>
                        </select>
                      </div>`;

content = content.replace(studentNameInput, studentGenderSelect);

// For author registration
const authorNameInput = `                        <input 
                          type="text" 
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          placeholder="دکتر ..." 
                          className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-black focus:outline-none focus:border-indigo-500 transition-all"
                          required
                        />
                      </div>`;

const authorGenderSelect = `                        <input 
                          type="text" 
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          placeholder="دکتر ..." 
                          className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-black focus:outline-none focus:border-indigo-500 transition-all"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-500 mr-2">جنسیت</label>
                        <select
                          value={studentGender}
                          onChange={(e) => setStudentGender(e.target.value)}
                          className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-black focus:outline-none focus:border-indigo-500 transition-all"
                          required
                        >
                          <option value="">انتخاب کنید</option>
                          <option value="male">آقا</option>
                          <option value="female">خانم</option>
                        </select>
                      </div>`;

content = content.replace(authorNameInput, authorGenderSelect);
fs.writeFileSync('src/App.tsx', content);
console.log('App patched');
