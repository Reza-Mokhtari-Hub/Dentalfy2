import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Remove state variables
content = re.sub(r'  // Admin recovery States\n  const \[showAdminRecoveryForm, setShowAdminRecoveryForm\] = useState\(false\);\n  const \[recoveryCode, setRecoveryCode\] = useState\(""\);\n  const \[recoveryNewPassword, setRecoveryNewPassword\] = useState\(""\);\n  const \[recoveryMessage, setRecoveryMessage\] = useState<string \| null>\(null\);\n  const \[recoveryError, setRecoveryError\] = useState<string \| null>\(null\);\n\n', '', content)

content = re.sub(r'  // Author Register form states\n  const \[isAuthorRegisterMode, setIsAuthorRegisterMode\] = useState\(false\);\n  const \[authorName, setAuthorName\] = useState\(""\);\n  const \[authorEmail, setAuthorEmail\] = useState\(""\);\n  const \[authorPassword, setAuthorPassword\] = useState\(""\);\n  const \[authorPhone, setAuthorPhone\] = useState\(""\);\n  const \[authorBio, setAuthorBio\] = useState\(""\);\n  const \[authorOtpCode, setAuthorOtpCode\] = useState\(""\);\n  const \[isAuthorOtpSent, setIsAuthorOtpSent\] = useState\(false\);\n  const \[authorSimulatedOtpCode, setAuthorSimulatedOtpCode\] = useState<string \| null>\(null\);\n  const \[authorOtpError, setAuthorOtpError\] = useState<string \| null>\(null\);\n  const \[sendingAuthorOtp, setSendingAuthorOtp\] = useState\(false\);\n  const \[authorRegisterMessage, setAuthorRegisterMessage\] = useState<string \| null>\(null\);\n\n', '', content)

# Remove functions
content = re.sub(r'  // Admin recovery code password reset.*?  };\n\n' , '', content, flags=re.DOTALL)
content = re.sub(r'  // Send Author OTP Email Action.*?  };\n\n' , '', content, flags=re.DOTALL)
content = re.sub(r'  // Register Author Action.*?  };\n\n' , '', content, flags=re.DOTALL)

# Update logic in the render
content = content.replace('!showForgotForm && !showAdminRecoveryForm ? (', '!showForgotForm ? (')

# Let's replace the block containing the buttons
block_to_replace = """                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button 
                          type="button" 
                          onClick={() => { setShowForgotForm(true); setLoginError(null); }}
                          className="hover:text-teal-600 cursor-pointer"
                        >
                          فراموشی رمز عبور نویسنده؟
                        </button>
                        <button 
                          type="button" 
                          onClick={() => { setShowAdminRecoveryForm(true); setLoginError(null); }}
                          className="hover:text-teal-600 cursor-pointer text-rose-500"
                        >
                          بازیابی اضطراری ادمین؟
                        </button>
                      </div>
                      
                      <div className="text-center pt-2">
                        <button 
                          type="button" 
                          onClick={() => { setIsAuthorRegisterMode(true); setLoginError(null); }}
                          className="text-[10px] text-slate-500 hover:text-slate-800 dark:text-slate-100 font-bold cursor-pointer underline"
                        >
                          ثبت‌نام به عنوان نویسنده جدید
                        </button>
                      </div>
                    </form>
                  ) : isAuthorRegisterMode ? ("""

new_block = """                      <div className="flex justify-center items-center text-[10px] font-bold text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button 
                          type="button" 
                          onClick={() => { setShowForgotForm(true); setLoginError(null); }}
                          className="hover:text-teal-600 cursor-pointer"
                        >
                          فراموشی رمز عبور نویسنده؟
                        </button>
                      </div>
                      
                      <div className="text-center pt-4 border-t border-slate-100 dark:border-slate-800">
                         <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-bold">
                              برای پیوستن به تیم نویسندگان و اعضای هیئت علمی دنتالفای، لطفاً درخواست و رزومه خود را به آدرس ایمیل <span className="font-mono text-teal-600 dark:text-teal-400">admin@rmo.local</span> ارسال نمایید.
                            </p>
                         </div>
                      </div>
                    </form>
                  ) : isAuthorRegisterMode ? ("""

content = content.replace(block_to_replace, new_block)

# Now we need to remove the `isAuthorRegisterMode` and `showAdminRecoveryForm` form blocks.
# We'll use a regex to replace `) : isAuthorRegisterMode ? ( ... ) : showForgotForm ? (` with `) : showForgotForm ? (`
content = re.sub(r'\) : isAuthorRegisterMode \? \(.*?\) : showForgotForm \? \(', ') : showForgotForm ? (', content, flags=re.DOTALL)

# And replace `) : (\n                    /\* ADMIN RECOVERY CODE PASSWORD RESET FORM \*/.*?\n                  )` with ``
content = re.sub(r'\) : \(\s*/\* ADMIN RECOVERY CODE PASSWORD RESET FORM \*/.*?</form>\s*\)', '', content, flags=re.DOTALL)

with open('src/App.tsx', 'w') as f:
    f.write(content)

