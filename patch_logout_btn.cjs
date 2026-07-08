const fs = require('fs');
let content = fs.readFileSync('src/components/StudentPanel.tsx', 'utf8');

const target = `                <button 
                  type="submit"
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-xl transition-all cursor-pointer shadow-md"
                >
                  ذخیره اطلاعات من
                </button>
              </form>`;

const replacement = `                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    type="submit"
                    className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-xl transition-all cursor-pointer shadow-md"
                  >
                    ذخیره اطلاعات من
                  </button>
                  <button 
                    type="button"
                    onClick={onLogout}
                    className="flex-1 py-2.5 bg-rose-50 dark:bg-rose-900/10 hover:bg-rose-100 dark:hover:bg-rose-900/20 text-rose-600 font-extrabold rounded-xl transition-all cursor-pointer border border-rose-100 dark:border-rose-900/30"
                  >
                    خروج از حساب
                  </button>
                </div>
              </form>`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/StudentPanel.tsx', content);
console.log('logout button patched in profile');
