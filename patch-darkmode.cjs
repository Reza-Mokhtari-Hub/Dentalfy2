const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const effectCode = `
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
`;

code = code.replace('const [isDarkMode, setIsDarkMode] = useState(false);', 'const [isDarkMode, setIsDarkMode] = useState(false);' + effectCode);

const toggleBtn = `
      {/* Dark Mode Toggle */}
      <button 
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed bottom-6 left-6 w-12 h-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 z-50 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
      >
        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
      <Chatbot />
`;

code = code.replace('<Chatbot />', toggleBtn);
fs.writeFileSync('src/App.tsx', code);
