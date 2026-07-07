import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace('''      if (res.ok && data.success) {
        setCurrentUser(data.user);
        localStorage.setItem("dentalfy_session", JSON.stringify(data.user));
        // Clear form
        setStudentName("");
        setStudentEmail("");
        setStudentPassword("");
        setStudentPhone("");
        setStudentOtpCode("");
        setIsOtpSent(false);
        setSimulatedOtpCode(null);
      } else {
        setOtpError(data.error || "خطا در ثبت نام دانشجو");
      }''', '''      if (res.ok && data.success) {
        if (registerRole === "author") {
          alert("درخواست شما با موفقیت ثبت شد و پس از بررسی توسط مدیر، حساب شما فعال خواهد شد.");
          setIsRegisterMode(false);
        } else {
          setCurrentUser(data.user);
          localStorage.setItem("dentalfy_session", JSON.stringify(data.user));
        }
        // Clear form
        setStudentName("");
        setStudentEmail("");
        setStudentPassword("");
        setStudentPhone("");
        setStudentOtpCode("");
        setIsOtpSent(false);
        setSimulatedOtpCode(null);
      } else {
        setOtpError(data.error || (registerRole === "author" ? "خطا در ثبت نام نویسنده" : "خطا در ثبت نام دانشجو"));
      }''')

with open('src/App.tsx', 'w') as f:
    f.write(content)
