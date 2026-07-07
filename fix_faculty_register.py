import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Inside FACULTY MEMBER AUTHENTICATION
old_faculty_logic = '''                ) : (
                  /* FACULTY MEMBER AUTHENTICATION (AUTHOR/ADMIN) */
                  !showForgotForm ? (
                    /* STANDARD LOGIN FORM */'''

new_faculty_logic = '''                ) : (
                  /* FACULTY MEMBER AUTHENTICATION (AUTHOR/ADMIN) */
                  isRegisterMode ? (
                    /* AUTHOR REGISTER FORM */
                    <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
                      <div className="text-center space-y-1">
                        <div className="w-10 h-10 bg-teal-50 text-teal-700 rounded-xl flex items-center justify-center mx-auto">
                          <UserPlus className="w-5 h-5" />
                        </div>
                        <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">عضویت و احراز هویت نویسندگان</h3>
                        <p className="text-[9px] text-slate-400">ثبت‌نام به عنوان نویسنده علمی با تأیید ایمیل</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">نام و نام خانوادگی</label>
                        <input 
                          type="text" 
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          placeholder="مثال: دکتر سارا احمدی" 
                          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500">شماره همراه</label>
                          <input 
                            type="tel" 
                            value={studentPhone}
                            onChange={(e) => setStudentPhone(e.target.value)}
                            placeholder="09123456789" 
                            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-center font-mono"
                            dir="ltr"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500">رمز عبور</label>
                          <input 
                            type="password" 
                            value={studentPassword}
                            onChange={(e) => setStudentPassword(e.target.value)}
                            placeholder="رمز ورود..." 
                            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">آدرس ایمیل</label>
                        <div className="flex gap-2">
                          <input 
                            type="email" 
                            value={studentEmail}
                            onChange={(e) => setStudentEmail(e.target.value)}
                            placeholder="dr.ahmadi@gmail.com" 
                            className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-left"
                            dir="ltr"
                            disabled={isOtpSent}
                            required
                          />
                          <button 
                            type="button"
                            onClick={handleSendOtp}
                            disabled={sendingOtp || isOtpSent || !studentEmail}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white text-[10px] font-black rounded-xl cursor-pointer whitespace-nowrap"
                          >
                            {sendingOtp ? "ارسال..." : isOtpSent ? "ارسال شد" : "دریافت کد"}
                          </button>
                        </div>
                      </div>
                      {isOtpSent && (
                        <div className="space-y-2">
                          <div className="p-2.5 bg-teal-50 border border-teal-100 rounded-xl text-[10px] font-bold text-teal-800 text-center flex flex-col gap-1 leading-relaxed">
                            <span>✉️ ایمیل تایید ارسال شد!</span>
                            {simulatedOtpCode && (
                              <div className="mt-1 flex flex-col items-center gap-1">
                                <span className="text-[9px] text-slate-400">کد تایید شبیه‌سازی شده:</span>
                                <span className="font-mono bg-white dark:bg-slate-800 px-2 py-0.5 rounded text-xs text-teal-700 font-extrabold">{simulatedOtpCode}</span>
                              </div>
                            )}
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500">کد تایید ۴ رقمی</label>
                            <input 
                              type="text" 
                              value={studentOtpCode}
                              onChange={(e) => setStudentOtpCode(e.target.value)}
                              placeholder="کد ارسال شده به ایمیل" 
                              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-center font-mono font-bold tracking-widest text-sm"
                              maxLength={4}
                              required
                            />
                          </div>
                        </div>
                      )}
                      {otpError && (
                        <div className="p-3 bg-rose-50 text-rose-700 rounded-xl font-bold text-[10px] text-center">
                          ✕ {otpError}
                        </div>
                      )}
                      <button 
                        type="submit"
                        disabled={!isOtpSent}
                        className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-extrabold rounded-xl text-xs transition-colors cursor-pointer shadow-lg shadow-teal-600/10"
                      >
                        تکمیل عضویت نویسنده
                      </button>
                      <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button 
                          type="button" 
                          onClick={() => { setIsRegisterMode(false); setOtpError(null); }}
                          className="text-[10px] text-slate-400 hover:text-teal-600 font-bold cursor-pointer"
                        >
                          قبلاً عضو شده‌اید؟ ورود هیئت علمی
                        </button>
                      </div>
                    </form>
                  ) : !showForgotForm ? (
                    /* STANDARD LOGIN FORM */'''

content = content.replace(old_faculty_logic, new_faculty_logic)

with open('src/App.tsx', 'w') as f:
    f.write(content)

