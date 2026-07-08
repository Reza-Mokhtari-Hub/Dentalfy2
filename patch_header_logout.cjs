const fs = require('fs');
let content = fs.readFileSync('src/components/StudentPanel.tsx', 'utf8');

const target = `            {/* Mobile menu trigger / Logout */}
            <button 
              onClick={onLogout}
              className="p-2 bg-rose-50 hover:bg-rose-100 rounded-xl text-rose-600 transition-colors md:hidden cursor-pointer"
              title="خروج"
            >
              <LogOut className="w-4 h-4" />
            </button>`;

const replacement = `            {/* Logout Button */}
            <button 
              onClick={onLogout}
              className="p-2 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded-xl text-rose-600 dark:text-rose-400 transition-colors cursor-pointer flex items-center justify-center"
              title="خروج از حساب"
            >
              <LogOut className="w-5 h-5" />
            </button>`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/StudentPanel.tsx', content);
console.log('Header logout patched');
