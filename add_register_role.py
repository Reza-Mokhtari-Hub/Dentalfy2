import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add registerRole state
content = re.sub(r'  const \[isRegisterMode, setIsRegisterMode\] = useState\(false\); \/\/ True for Registering Student, False for Login\n', r'  const [isRegisterMode, setIsRegisterMode] = useState(false);\n  const [registerRole, setRegisterRole] = useState<"student" | "author">("student");\n', content)

# Modify handleRegisterStudentSubmit to handle both
# We'll replace the URL and body dynamically
content = re.sub(r'const res = await fetch\("/api/auth/register-student"', r'const url = registerRole === "author" ? "/api/auth/register-author" : "/api/auth/register-student";\n      const res = await fetch(url', content)

# The author registration requires a `bio` field, so we can just pass an empty string if it's missing. Wait, the schema says bio is required but let's just pass some default string or add a bio field.
content = re.sub(r'          otpCode: studentOtpCode\n        \}\)', r'          otpCode: studentOtpCode,\n          bio: registerRole === "author" ? "درخواست حساب کاربری هیئت علمی" : undefined\n        })', content)

with open('src/App.tsx', 'w') as f:
    f.write(content)
