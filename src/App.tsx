import React, { useState, useEffect } from "react";
import { 
  Shield, Key, Lock, HelpCircle, ChevronLeft, ArrowRight, UserPlus, Smartphone, CheckCircle, Award
} from "lucide-react";
import { PublicHome } from "./components/PublicHome";
import { PostDetail } from "./components/PostDetail";
import { PanelDashboard } from "./components/PanelDashboard";
import { StudentPanel } from "./components/StudentPanel";
import { Chatbot } from "./components/Chatbot";
import { IUser, ICourse, IPost, ISiteSettings } from "./types";

export default function App() {
  // Navigation Routing States
  const [activeView, setActiveView] = useState<"home" | "post" | "panel">("home");
  
  // Data States
  const [settings, setSettings] = useState<ISiteSettings>({
    siteName: "dentalfy",
    heroText: "آکادمی آموزش تخصصی دندانپزشکی",
    contactEmail: "info@dentalfy.local",
    colorTheme: {
      primary: "#14b8a6",
      secondary: "#0d9488",
      clinicalBlue: "#0284c7"
    },
    adminRecoveryCode: "rmo-recover-2026",
    stats: {
      coursesCount: 3,
      postsCount: 2,
      authorsCount: 1
    }
  });
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);

  // Authentication States
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  // Forgot password States
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [showForgotForm, setShowForgotForm] = useState(false);
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);

  // Admin recovery States
  const [showAdminRecoveryForm, setShowAdminRecoveryForm] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState("");
  const [recoveryNewPassword, setRecoveryNewPassword] = useState("");
  const [recoveryMessage, setRecoveryMessage] = useState<string | null>(null);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);

  // Loading States
  const [isLoading, setIsLoading] = useState(true);

  // Student Portal Toggle States
  const [isStudentMode, setIsStudentMode] = useState(false); // True for Student, False for Author/Admin
  const [isRegisterMode, setIsRegisterMode] = useState(false); // True for Registering Student, False for Login
  
  // Student Register form states
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [studentOtpCode, setStudentOtpCode] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [simulatedOtpCode, setSimulatedOtpCode] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [sendingOtp, setSendingOtp] = useState(false);

  // Fetch initial configs, courses, and published posts
  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      // Fetch platform settings & stats
      const initRes = await fetch("/api/init");
      if (initRes.ok) {
        const initData = await initRes.json();
        if (initData.settings) {
          setSettings(initData.settings);
        }
      }

      // Fetch active courses
      const coursesRes = await fetch("/api/courses");
      if (coursesRes.ok) {
        const coursesData = await coursesRes.json();
        setCourses(coursesData);
      }

      // Fetch published posts
      const postsRes = await fetch("/api/posts");
      if (postsRes.ok) {
        const postsData = await postsRes.json();
        setPosts(postsData);
      }
    } catch (err) {
      console.error("Error loading dentalfy initial data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Check existing session from localStorage on mount
  useEffect(() => {
    fetchInitialData();
    const storedSession = localStorage.getItem("dentalfy_session");
    if (storedSession) {
      try {
        const userObj = JSON.parse(storedSession);
        setCurrentUser(userObj);
      } catch (err) {
        localStorage.removeItem("dentalfy_session");
      }
    }
  }, []);

  // Handle Login Authentication
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!loginEmail || !loginPassword) {
      setLoginError("پر کردن تمامی فیلدها الزامی است");
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentUser(data.user);
        localStorage.setItem("dentalfy_session", JSON.stringify(data.user));
        setLoginEmail("");
        setLoginPassword("");
      } else {
        setLoginError(data.error || "خطا در تأیید هویت کاربری");
      }
    } catch (err) {
      setLoginError("خطا در برقراری ارتباط با سرور");
    }
  };

  // Author Forgot Password Reset request
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotMessage(null);
    if (!forgotPasswordEmail) return;

    try {
      const res = await fetch("/api/auth/reset-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setForgotMessage("درخواست بازیابی رمز با موفقیت برای مدیریت ارسال شد. لطفاً منتظر تأیید بمانید.");
        setForgotPasswordEmail("");
      } else {
        setForgotError(data.error || "آدرس ایمیل یافت نشد");
      }
    } catch (err) {
      setForgotError("خطا در برقراری ارتباط با سرور");
    }
  };

  // Admin recovery code password reset
  const handleAdminRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError(null);
    setRecoveryMessage(null);
    if (!recoveryCode || !recoveryNewPassword) return;

    try {
      const res = await fetch("/api/auth/recover-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recoveryCode, newPassword: recoveryNewPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setRecoveryMessage("رمز عبور ادمین با موفقیت بازنشانی شد. اکنون می‌توانید وارد شوید.");
        setRecoveryCode("");
        setRecoveryNewPassword("");
      } else {
        setRecoveryError(data.error || "کد بازیابی نامعتبر است");
      }
    } catch (err) {
      setRecoveryError("خطا در برقراری ارتباط با سرور");
    }
  };

  // Send OTP Email Action
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);
    setSimulatedOtpCode(null);
    if (!studentEmail) {
      setOtpError("آدرس ایمیل الزامی است");
      return;
    }
    setSendingOtp(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: studentEmail })
      });
      const data = await res.json();
      if (res.ok) {
        setIsOtpSent(true);
        if (data.code) {
          setSimulatedOtpCode(data.code);
        }
      } else {
        setOtpError(data.error || "خطا در ارسال ایمیل تایید");
      }
    } catch (err) {
      setOtpError("خطا در ارتباط با سرور");
    } finally {
      setSendingOtp(false);
    }
  };

  // Register Student Action
  const handleRegisterStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);
    if (!studentName || !studentEmail || !studentPassword || !studentPhone || !studentOtpCode) {
      setOtpError("پر کردن تمامی فیلدهای الزامی است");
      return;
    }

    try {
      const res = await fetch("/api/auth/register-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: studentName,
          email: studentEmail,
          password: studentPassword,
          phoneNumber: studentPhone,
          otpCode: studentOtpCode
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
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
      }
    } catch (err) {
      setOtpError("خطا در ثبت نام. لطفاً مجدداً بررسی کنید.");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("dentalfy_session");
    setActiveView("home");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans" dir="rtl">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h2 className="text-sm font-bold text-slate-700">درحال بارگذاری داده‌های علمی دنتالفای...</h2>
          <p className="text-[10px] text-slate-400">اتصال ایمن به سرورهای کلینیکال</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {activeView === "home" && (
        <PublicHome 
          settings={settings}
          courses={courses}
          posts={posts}
          onSelectPost={(post) => {
            setSelectedPost(post);
            setActiveView("post");
          }}
          onGoToPanel={() => setActiveView("panel")}
        />
      )}

      {activeView === "post" && selectedPost && (
        <PostDetail 
          post={selectedPost}
          onBack={() => {
            setSelectedPost(null);
            setActiveView("home");
          }}
        />
      )}

      {activeView === "panel" && (
        <>
          {currentUser ? (
            /* Authorized panel view depending on role */
            currentUser.role === "student" ? (
              <StudentPanel 
                currentUser={currentUser}
                settings={settings}
                courses={courses}
                onLogout={handleLogout}
                onRefreshData={fetchInitialData}
              />
            ) : (
              <PanelDashboard 
                currentUser={currentUser}
                settings={settings}
                courses={courses}
                posts={posts}
                onLogout={handleLogout}
                onRefreshData={fetchInitialData}
              />
            )
          ) : (
            /* Login / Register Form view with custom roles toggles */
            <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-slate-50 font-sans" dir="rtl">
              <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-8 space-y-6">
                
                {/* Back button */}
                <div className="flex justify-between items-center">
                  <button 
                    onClick={() => setActiveView("home")}
                    className="px-3 py-1 bg-slate-50 hover:bg-slate-100 text-slate-500 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4" /> بازگشت به سایت
                  </button>

                  <span className="text-[9px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-black">Dentalfy secure access</span>
                </div>

                {/* Main Tab Segment Selector */}
                <div className="grid grid-cols-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-100">
                  <button 
                    onClick={() => { setIsStudentMode(true); setIsRegisterMode(false); setLoginError(null); }}
                    className={`py-2 rounded-xl text-[10px] font-black transition-all cursor-pointer ${isStudentMode ? "bg-white text-teal-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    ورود / ثبت‌نام دانشجویان
                  </button>
                  <button 
                    onClick={() => { setIsStudentMode(false); setLoginError(null); }}
                    className={`py-2 rounded-xl text-[10px] font-black transition-all cursor-pointer ${!isStudentMode ? "bg-white text-teal-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    اعضای علمی (نویسنده/مدیر)
                  </button>
                </div>

                {isStudentMode ? (
                  /* STUDENT AUTHENTICATION FLOW */
                  isRegisterMode ? (
                    /* STUDENT EMAIL-OTP REGISTRATION FORM */
                    <form onSubmit={handleRegisterStudentSubmit} className="space-y-4 text-xs">
                      <div className="text-center space-y-1">
                        <div className="w-10 h-10 bg-teal-50 text-teal-700 rounded-xl flex items-center justify-center mx-auto">
                          <UserPlus className="w-5 h-5" />
                        </div>
                        <h3 className="font-extrabold text-sm text-slate-800">عضویت و احراز هویت دانش‌پذیران</h3>
                        <p className="text-[9px] text-slate-400">ثبت‌نام با تأییدیه الکترونیکی ایمیل آکادمی دنتالفای</p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">نام و نام خانوادگی (با پیشوند دکتر)</label>
                        <input 
                          type="text" 
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          placeholder="مثال: دکتر سارا احمدی" 
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500">شماره همراه</label>
                          <input 
                            type="tel" 
                            value={studentPhone}
                            onChange={(e) => setStudentPhone(e.target.value)}
                            placeholder="09123456789" 
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center font-mono"
                            dir="ltr"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500">رمز عبور انتخابی</label>
                          <input 
                            type="password" 
                            value={studentPassword}
                            onChange={(e) => setStudentPassword(e.target.value)}
                            placeholder="رمز ورود..." 
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">آدرس ایمیل (جهت دریافت کد تایید)</label>
                        <div className="flex gap-2">
                          <input 
                            type="email" 
                            value={studentEmail}
                            onChange={(e) => setStudentEmail(e.target.value)}
                            placeholder="dr.ahmadi@gmail.com" 
                            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-left"
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
                            <span>✉️ ایمیل تایید ارسال شد! در صورت فعال بودن SMTP، کد به ایمیل شما فرستاده می‌شود.</span>
                            {simulatedOtpCode && (
                              <div className="mt-1 flex flex-col items-center gap-1">
                                <span className="text-[9px] text-slate-400">کد تایید شبیه‌سازی شده سیستم دنتالفای:</span>
                                <span className="font-mono bg-white px-2 py-0.5 rounded text-xs text-teal-700 font-extrabold">{simulatedOtpCode}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500">کد تایید ۴ رقمی دریافت شده</label>
                            <input 
                              type="text" 
                              value={studentOtpCode}
                              onChange={(e) => setStudentOtpCode(e.target.value)}
                              placeholder="کد ارسال شده به ایمیل را وارد کنید" 
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center font-mono font-bold tracking-widest text-sm"
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
                        تکمیل عضویت و ورود به آکادمی
                      </button>

                      <div className="text-center pt-2 border-t border-slate-100">
                        <button 
                          type="button" 
                          onClick={() => { setIsRegisterMode(false); setOtpError(null); }}
                          className="text-[10px] text-slate-400 hover:text-teal-600 font-bold cursor-pointer"
                        >
                          قبلاً عضو شده‌اید؟ ورود دانشجویان
                        </button>
                      </div>
                    </form>

                  ) : (
                    /* STUDENT EMAIL LOGIN FORM */
                    <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                      <div className="text-center space-y-1">
                        <div className="w-10 h-10 bg-teal-50 text-teal-700 rounded-xl flex items-center justify-center mx-auto">
                          <Shield className="w-5 h-5" />
                        </div>
                        <h3 className="font-extrabold text-sm text-slate-800">ورود دانش‌پذیران آکادمی</h3>
                        <p className="text-[9px] text-slate-400">به کلاس تخصصی جراحی و روت کانال خود وارد شوید</p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">آدرس ایمیل</label>
                        <input 
                          type="email" 
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="dr.student@gmail.com" 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-left"
                          dir="ltr"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">رمز عبور</label>
                        <input 
                          type="password" 
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••" 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
                          required
                        />
                      </div>

                      {loginError && (
                        <div className="p-3 bg-rose-50 text-rose-700 rounded-xl font-bold text-[10px] text-center">
                          ✕ {loginError}
                        </div>
                      )}

                      <button 
                        type="submit"
                        className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-xl text-xs transition-colors cursor-pointer shadow-lg shadow-teal-600/10"
                      >
                        ورود به میز کار دانشجو
                      </button>

                      <div className="text-center pt-2 border-t border-slate-100">
                        <button 
                          type="button" 
                          onClick={() => { setIsRegisterMode(true); setLoginError(null); }}
                          className="text-[10px] text-slate-400 hover:text-teal-600 font-bold cursor-pointer"
                        >
                          دندانپزشک جدید هستید؟ عضویت پیامکی سریع
                        </button>
                      </div>
                    </form>
                  )
                ) : (
                  /* FACULTY MEMBER AUTHENTICATION (AUTHOR/ADMIN) */
                  !showForgotForm && !showAdminRecoveryForm ? (
                    /* STANDARD LOGIN FORM */
                    <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                      <div className="text-center space-y-1">
                        <div className="w-10 h-10 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center mx-auto">
                          <Key className="w-5 h-5" />
                        </div>
                        <h3 className="font-extrabold text-sm text-slate-800">پنل اعضای هیئت علمی</h3>
                        <p className="text-[9px] text-slate-400">مخصوص نویسندگان بالینی و مدیر RMO</p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">ایمیل دفتری / آکادمیک</label>
                        <input 
                          type="email" 
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="example@rmo.local" 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-left"
                          dir="ltr"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">رمز عبور ورود</label>
                        <input 
                          type="password" 
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••" 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
                          required
                        />
                      </div>

                      {loginError && (
                        <div className="p-3 bg-rose-50 text-rose-700 rounded-xl font-bold text-[10px] text-center">
                          ✕ {loginError}
                        </div>
                      )}

                      <button 
                        type="submit"
                        className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-extrabold rounded-xl text-xs transition-colors cursor-pointer shadow-lg shadow-slate-800/10"
                      >
                        تأیید هویت و ورود هیئت علمی
                      </button>

                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 pt-2 border-t border-slate-100">
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
                    </form>
                  ) : showForgotForm ? (
                    /* AUTHOR FORGOT PASSWORD RESET REQUEST FORM */
                    <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs">
                      <h3 className="font-bold text-slate-700 text-center">ارسال درخواست بازیابی رمز به مدیر</h3>
                      <p className="text-[10px] text-slate-400 leading-relaxed text-center">
                        مشخصات ایمیل خود را وارد نمایید. درخواست شما در داشبورد مدیر ثبت شده و پس از تأیید، یک رمز عبور موقت برای ورود دریافت خواهید کرد.
                      </p>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">ایمیل نویسنده</label>
                        <input 
                          type="email" 
                          value={forgotPasswordEmail}
                          onChange={(e) => setForgotPasswordEmail(e.target.value)}
                          placeholder="example@dentalfy.local" 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-left"
                          dir="ltr"
                          required
                        />
                      </div>

                      {forgotMessage && (
                        <div className="p-3 bg-teal-50 text-teal-700 rounded-xl font-semibold text-center">
                          ✓ {forgotMessage}
                        </div>
                      )}

                      {forgotError && (
                        <div className="p-3 bg-rose-50 text-rose-700 rounded-xl font-semibold text-center">
                          ✕ {forgotError}
                        </div>
                      )}

                      <button 
                        type="submit"
                        className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-xl transition-all cursor-pointer"
                      >
                        ارسال درخواست به مدیریت RMO
                      </button>

                      <button 
                        type="button" 
                        onClick={() => { setShowForgotForm(false); setForgotError(null); setForgotMessage(null); }}
                        className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-[10px] cursor-pointer"
                      >
                        بازگشت به فرم ورود
                      </button>
                    </form>
                  ) : (
                    /* ADMIN RECOVERY CODE PASSWORD RESET FORM */
                    <form onSubmit={handleAdminRecoverySubmit} className="space-y-4 text-xs">
                      <h3 className="font-bold text-rose-600 text-center flex items-center justify-center gap-1">
                        <Lock className="w-4 h-4" /> بازیابی و ریست فوری رمز مدیر
                      </h3>
                      <p className="text-[10px] text-slate-400 leading-relaxed text-center">
                        با ارائه کد بازیابی معتبر آکادمی دنتالفای (پیش‌فرض: <code className="bg-slate-100 px-1 py-0.5 rounded text-rose-500 font-bold">rmo-recover-2026</code>) رمز عبور مدیر کل تغییر خواهد کرد.
                      </p>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">کد بازیابی اضطراری (Recovery Code)</label>
                        <input 
                          type="text" 
                          value={recoveryCode}
                          onChange={(e) => setRecoveryCode(e.target.value)}
                          placeholder="کد بازیابی کلان را وارد کنید..." 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-center font-mono font-bold"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">رمز عبور جدید مدیر (New Admin Password)</label>
                        <input 
                          type="password" 
                          value={recoveryNewPassword}
                          onChange={(e) => setRecoveryNewPassword(e.target.value)}
                          placeholder="حداقل ۶ کاراکتر..." 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
                          required
                        />
                      </div>

                      {recoveryMessage && (
                        <div className="p-3 bg-teal-50 text-teal-700 rounded-xl font-semibold text-center">
                          ✓ {recoveryMessage}
                        </div>
                      )}

                      {recoveryError && (
                        <div className="p-3 bg-rose-50 text-rose-700 rounded-xl font-semibold text-center">
                          ✕ {recoveryError}
                        </div>
                      )}

                      <button 
                        type="submit"
                        className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-extrabold rounded-xl transition-all cursor-pointer"
                      >
                        تغییر رمز عبور مدیر و ثبت در دیتابیس
                      </button>

                      <button 
                        type="button" 
                        onClick={() => { setShowAdminRecoveryForm(false); setRecoveryError(null); setRecoveryMessage(null); }}
                        className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-[10px] cursor-pointer"
                      >
                        بازگشت به فرم ورود
                      </button>
                    </form>
                  )
                )}

              </div>
            </div>
          )}
        </>
      )}

      {/* Floatable AI assistant powered by Gemini */}
      <Chatbot />
    </div>
  );
}
