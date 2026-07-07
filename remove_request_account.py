import re

with open('src/components/PublicHome.tsx', 'r') as f:
    content = f.read()

# Remove handleRequestSubmit logic
content = re.sub(r'  const \[requestName, setRequestName\] = useState\(""\);\n  const \[requestEmail, setRequestEmail\] = useState\(""\);\n  const \[requestBio, setRequestBio\] = useState\(""\);\n  const \[isSubmitting, setIsSubmitting\] = useState\(false\);\n  const \[submitMessage, setSubmitMessage\] = useState<string \| null>\(null\);\n  const \[submitError, setSubmitError\] = useState<string \| null>\(null\);\n\n  const handleRequestSubmit = async \(e: React.FormEvent\) => \{.*?\};\n\n', '', content, flags=re.DOTALL)

# Remove the section itself
content = re.sub(r'      \{\/\* Request Account Section \*\/\}\n      <section id="request-account".*?<\/section>\n', '', content, flags=re.DOTALL)

# Remove the anchor tags
content = re.sub(r'          <a href="#request-account" className="text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-1">\n            <UserPlus className="w-4 h-4" /> درخواست اکانت\n          </a>\n', '', content, flags=re.DOTALL)

content = re.sub(r'              <a href="#request-account" className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-sm text-center transition-all">\n                درخواست عضویت به عنوان نویسنده\n              </a>\n', '', content, flags=re.DOTALL)

with open('src/components/PublicHome.tsx', 'w') as f:
    f.write(content)

