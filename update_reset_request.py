import re

with open('server.ts', 'r') as f:
    content = f.read()

replacement = '''  app.post("/api/auth/reset-request", async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "ایمیل الزامی است" });
    }

    const newPassword = "rmo" + Math.floor(1000 + Math.random() * 9000);
    let userEmail = email.toLowerCase().trim();

    if (isDBConnected) {
      const user = await User.findOne({ email: userEmail });
      if (!user) return res.status(404).json({ error: "کاربر یافت نشد" });
      user.password = newPassword;
      user.temporaryPassword = newPassword;
      user.resetPasswordRequested = false;
      await user.save();
    } else {
      const user = memoryDB.users.find(u => u.email === userEmail);
      if (!user) return res.status(404).json({ error: "کاربر یافت نشد" });
      user.password = newPassword;
      user.temporaryPassword = newPassword;
      user.resetPasswordRequested = false;
    }

    // Send Email
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_PASS;
    if (gmailUser && gmailPass) {
      try {
        const nodemailer = await import("nodemailer");
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: { user: gmailUser, pass: gmailPass },
        });
        await transporter.sendMail({
          from: `"آکادمی دنتالفای" <${gmailUser}>`,
          to: userEmail,
          subject: "بازیابی رمز عبور",
          html: `
            <div dir="rtl" style="font-family: Tahoma, sans-serif; text-align: center; padding: 20px;">
              <h2>رمز عبور جدید شما</h2>
              <p>شما اکنون می‌توانید با رمز عبور موقت زیر وارد حساب خود شوید. توصیه می‌شود پس از ورود، رمز خود را تغییر دهید.</p>
              <h3 style="background: #f1f5f9; padding: 10px; display: inline-block;">${newPassword}</h3>
            </div>
          `
        });
      } catch (err) {
        console.error("Error sending reset password email:", err);
      }
    }

    res.json({ success: true, message: "رمز عبور جدید به ایمیل شما ارسال شد" });
  });'''

old_block = '''  app.post("/api/auth/reset-request", async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "ایمیل الزامی است" });
    }

    if (isDBConnected) {
      const user = await User.findOne({ email: email.toLowerCase().trim() });
      if (!user) return res.status(404).json({ error: "کاربر یافت نشد" });
      user.resetPasswordRequested = true;
      await user.save();
    } else {
      const user = memoryDB.users.find(u => u.email === email.toLowerCase().trim());
      if (!user) return res.status(404).json({ error: "کاربر یافت نشد" });
      user.resetPasswordRequested = true;
    }

    res.json({ success: true, message: "درخواست بازنشانی رمز با موفقیت به مدیر ارسال شد" });
  });'''

content = content.replace(old_block, replacement)

with open('server.ts', 'w') as f:
    f.write(content)

