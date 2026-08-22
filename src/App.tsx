import React, { useState, useEffect } from "react";
import { 
  Shield, Key, Lock, Moon, Sun, HelpCircle, ChevronLeft, ArrowRight, UserPlus, Smartphone, CheckCircle, Award
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  
  // Data States
  const [settings, setSettings] = useState<ISiteSettings>({
    siteName: "dentalfy",
    heroText: "آکادمی آموزش تخصصی دندانپزشکی",
    contactEmail: "dentalfyweb@gmail.com",
    adminEmail: "dentalfyweb@gmail.com",
    contactPhone: "",
    address: "",
    footerText: "پلتفرمی تحت وب برای یکپارچه‌سازی فرآیندهای آموزشی رفرنس دندانپزشکی و دسترسی به محتوای بالینی بازنگری‌شده.",
    colorTheme: {
      primary: "#14b8a6",
      secondary: "#0d9488",
      clinicalBlue: "#0284c7"
    },
    adminRecoveryCode: "rmo-recover-2026",
    stats: {
      coursesCount: 0,
      postsCount: 0,
      authorsCount: 0
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

  // Loading States
  const [isLoading, setIsLoading] = useState(true);

  // Student Portal Toggle States
  const [isStudentMode, setIsStudentMode] = useState(false); // True for Student, False for Author/Admin
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [registerRole, setRegisterRole] = useState<"student" | "author">("student");
  
  // Student Register form states
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [studentGender, setStudentGender] = useState("");
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
    if (!studentName || !studentEmail || !studentPassword || !studentPhone || !studentOtpCode || !studentGender) {
      setOtpError("پر کردن تمامی فیلدهای الزامی است");
      return;
    }

    try {
      const url = registerRole === "author" ? "/api/auth/register-author" : "/api/auth/register-student";
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: studentName,
          email: studentEmail,
          password: studentPassword,
          phoneNumber: studentPhone,
          gender: studentGender,
          otpCode: studentOtpCode,
          bio: registerRole === "author" ? "درخواست حساب کاربری هیئت علمی" : undefined
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (registerRole === "author") {
          setOtpError(null);
          alert(data.message || "درخواست شما با موفقیت ثبت شد.");
          setIsOtpSent(false);
          setSimulatedOtpCode(null);
          return;
        }
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
        setOtpError(data.error || `خطا در ${registerRole === 'author' ? 'ثبت نام نویسنده' : 'ثبت نام دانشجو'}`);
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans p-8 md:p-12 lg:p-20 space-y-12 animate-pulse" dir="rtl">
        {/* Skeleton Sidebar & Header */}
        <div className="flex justify-between items-center">
          <div className="h-8 w-40 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          <div className="flex gap-4">
            <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
            <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
          </div>
        </div>

        {/* Skeleton Hero */}
        <div className="space-y-4">
          <div className="h-16 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-[2rem]"></div>
          <div className="h-6 w-1/2 bg-slate-100 dark:bg-slate-800/50 rounded-xl"></div>
        </div>

        {/* Skeleton Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden p-6 space-y-6">
              <div className="h-40 bg-slate-50 dark:bg-slate-900/50 rounded-2xl"></div>
              <div className="space-y-3">
                <div className="h-6 w-3/4 bg-slate-100 dark:bg-slate-900/50 rounded-lg"></div>
                <div className="h-4 w-full bg-slate-50 dark:bg-slate-900/30 rounded-lg"></div>
                <div className="h-4 w-2/3 bg-slate-50 dark:bg-slate-900/30 rounded-lg"></div>
              </div>
              <div className="h-10 w-full bg-slate-100 dark:bg-slate-900/50 rounded-xl mt-auto"></div>
            </div>
          ))}
        </div>
        
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 text-center">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] animate-bounce">Dentalfy secure loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans selection:bg-indigo-100 selection:text-indigo-900">
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
          onRegisterAuthor={() => { setIsStudentMode(false); setIsRegisterMode(true); setRegisterRole("author"); setActiveView("panel"); }}
          onStudentLogin={() => { setIsStudentMode(true); setIsRegisterMode(false); setActiveView("panel"); }}
          onStudentRegister={() => { setIsStudentMode(true); setIsRegisterMode(true); setRegisterRole("student"); setActiveView("panel"); }}
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
                posts={posts}
                onLogout={handleLogout}
                onRefreshData={fetchInitialData}
                onUpdateCurrentUser={(updated) => setCurrentUser(prev => prev ? { ...prev, ...updated } : prev)}
              />
            ) : (
              <PanelDashboard 
                currentUser={currentUser}
                settings={settings}
                courses={courses}
                posts={posts}
                onLogout={handleLogout}
                onRefreshData={fetchInitialData}
                onUpdateCurrentUser={(updated) => setCurrentUser(prev => prev ? { ...prev, ...updated } : prev)}
              />
            )
          ) : (
            /* Login / Register Form view with custom roles toggles */
            <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-slate-900 font-sans" dir="rtl">
              <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-2xl shadow-slate-200/20 dark:shadow-none overflow-hidden p-6 sm:p-10 space-y-8 transition-all">
                
                {/* Back button */}
                <div className="flex justify-between items-center">
                  <button 
                    onClick={() => setActiveView("home")}
                    className="px-4 py-2 bg-slate-50 dark:bg-slate-900 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 text-slate-500 text-[10px] font-black rounded-xl transition-all flex items-center gap-2 cursor-pointer active:scale-95 group"
                  >
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> بازگشت به سایت
                  </button>

                  <span className="text-[9px] bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full font-black uppercase tracking-tighter">Secure Access Portal</span>
                </div>

                {/* Main Tab Segment Selector */}
                <div className="grid grid-cols-2 bg-slate-50 dark:bg-slate-900/50 p-1.5 rounded-[1.5rem] border border-slate-100 dark:border-slate-700">
                  <button 
                    onClick={() => { setIsStudentMode(true); setIsRegisterMode(false); setRegisterRole("student"); setLoginError(null); }}
                    className={`py-3 rounded-[1.25rem] text-[11px] font-black transition-all cursor-pointer ${isStudentMode ? "bg-white dark:bg-slate-800 text-indigo-600 shadow-lg shadow-indigo-600/5" : "text-slate-400 hover:text-slate-600 dark:text-slate-500"}`}
                  >
                    ورود دانشجویان
                  </button>
                  <button 
                    onClick={() => { setIsStudentMode(false); setIsRegisterMode(false); setLoginError(null); }}
                    className={`py-3 rounded-[1.25rem] text-[11px] font-black transition-all cursor-pointer ${!isStudentMode ? "bg-white dark:bg-slate-800 text-indigo-600 shadow-lg shadow-indigo-600/5" : "text-slate-400 hover:text-slate-600 dark:text-slate-500"}`}
                  >
                    پنل اساتید
                  </button>
                </div>

                {isStudentMode ? (
                  /* STUDENT AUTHENTICATION FLOW */
                  isRegisterMode ? (
                    /* STUDENT EMAIL-OTP REGISTRATION FORM */
                    <form onSubmit={handleRegisterStudentSubmit} className="space-y-6">
                      <div className="text-center space-y-2">
                        <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                          <UserPlus className="w-7 h-7" />
                        </div>
                        <h3 className="font-black text-lg text-slate-800 dark:text-white">{registerRole === 'author' ? 'درخواست عضویت علمی' : 'ثبت‌نام دانشجو جدید'}</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Academic Registration • Email Verification Required</p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-500 mr-2">نام و نام خانوادگی پزشک</label>
                        <input 
                          type="text" 
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          placeholder="مثال: دکتر علیرضا رضایی" 
                          className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-black focus:outline-none focus:border-indigo-500 transition-all"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-500 mr-2">جنسیت</label>
                        <select
                          value={studentGender}
                          onChange={(e) => setStudentGender(e.target.value)}
                          className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-black focus:outline-none focus:border-indigo-500 transition-all"
                          required
                        >
                          <option value="">انتخاب کنید</option>
                          <option value="male">آقا</option>
                          <option value="female">خانم</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[11px] font-black text-slate-500 mr-2">شماره تماس</label>
                          <input 
                            type="tel" 
                            value={studentPhone}
                            onChange={(e) => setStudentPhone(e.target.value)}
                            placeholder="09123456789" 
                            className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-center font-black text-xs tracking-widest focus:outline-none focus:border-indigo-500 transition-all"
                            dir="ltr"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[11px] font-black text-slate-500 mr-2">رمز عبور</label>
                          <input 
                            type="password" 
                            value={studentPassword}
                            onChange={(e) => setStudentPassword(e.target.value)}
                            placeholder="••••••••" 
                            className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-black focus:outline-none focus:border-indigo-500 transition-all"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-500 mr-2">آدرس ایمیل آکادمیک</label>
                        <div className="flex gap-3">
                          <input 
                            type="email" 
                            value={studentEmail}
                            onChange={(e) => setStudentEmail(e.target.value)}
                            placeholder="dr.example@gmail.com" 
                            className="flex-1 px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-black text-left focus:outline-none focus:border-indigo-500 transition-all"
                            dir="ltr"
                            disabled={isOtpSent}
                            required
                          />
                          <button 
                            type="button"
                            onClick={handleSendOtp}
                            disabled={sendingOtp || isOtpSent || !studentEmail}
                            className="px-6 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black rounded-2xl cursor-pointer whitespace-nowrap active:scale-95 transition-all disabled:opacity-50"
                          >
                            {sendingOtp ? "ارسال..." : isOtpSent ? "ارسال شد" : "دریافت کد"}
                          </button>
                        </div>
                      </div>

                      {isOtpSent && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-2xl text-[10px] font-bold text-indigo-800 dark:text-indigo-300 text-center flex flex-col gap-2 leading-relaxed">
                            <span className="flex items-center justify-center gap-2">
                              <CheckCircle className="w-3 h-3" /> کد تایید با موفقیت ارسال گردید
                            </span>
                            {simulatedOtpCode && (
                              <div className="mt-1 flex flex-col items-center gap-1 border-t border-indigo-100 dark:border-indigo-800 pt-2">
                                <span className="text-[9px] text-slate-400">کد تایید شبیه‌سازی شده:</span>
                                <span className="font-mono bg-white dark:bg-slate-800 px-3 py-1 rounded-lg text-sm text-indigo-600 font-black tracking-[0.3em]">{simulatedOtpCode}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-500 mr-2 text-center block">کد تایید ۴ رقمی</label>
                            <input 
                              type="text" 
                              value={studentOtpCode}
                              onChange={(e) => setStudentOtpCode(e.target.value)}
                              placeholder="0 0 0 0" 
                              className="w-full px-5 py-5 bg-white dark:bg-slate-900 border-2 border-indigo-100 dark:border-indigo-800 rounded-[1.5rem] text-center font-black tracking-[1em] text-xl focus:outline-none focus:border-indigo-500 transition-all shadow-xl shadow-indigo-600/5"
                              maxLength={4}
                              required
                            />
                          </div>
                        </div>
                      )}

                      {otpError && (
                        <div className="p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-2xl font-black text-[10px] text-center animate-shake">
                          {otpError}
                        </div>
                      )}

                      <button 
                        type="submit"
                        disabled={!isOtpSent}
                        className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-black rounded-[1.5rem] text-sm transition-all cursor-pointer shadow-xl shadow-indigo-600/20 active:scale-[0.98]"
                      >
                        تکمیل ثبت‌نام و ورود به آکادمی
                      </button>

                      <div className="text-center pt-4 border-t border-slate-50 dark:border-slate-800">
                        <button 
                          type="button" 
                          onClick={() => { setIsRegisterMode(false); setOtpError(null); }}
                          className="text-[11px] text-slate-400 hover:text-indigo-600 font-black transition-colors cursor-pointer"
                        >
                          قبلاً عضو شده‌اید؟ بازگشت به فرم ورود
                        </button>
                      </div>
                    </form>

                  ) : (
                    /* STUDENT EMAIL LOGIN FORM */
                    <form onSubmit={handleLoginSubmit} className="space-y-8">
                      <div className="text-center space-y-2">
                        <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                          <Shield className="w-7 h-7" />
                        </div>
                        <h3 className="font-black text-lg text-slate-800 dark:text-white">ورود دانش‌پذیران</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Student Portal • Clinical Education Access</p>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[11px] font-black text-slate-500 mr-2">پست الکترونیک (ایمیل)</label>
                          <input 
                            type="email" 
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            placeholder="dr.student@gmail.com" 
                            className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-black text-left focus:outline-none focus:border-indigo-500 transition-all"
                            dir="ltr"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[11px] font-black text-slate-500 mr-2">رمز عبور امنیتی</label>
                          <input 
                            type="password" 
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="••••••••" 
                            className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-black focus:outline-none focus:border-indigo-500 transition-all"
                            required
                          />
                        </div>
                      </div>

                      {loginError && (
                        <div className="p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-2xl font-black text-[10px] text-center">
                          {loginError}
                        </div>
                      )}

                      <button 
                        type="submit"
                        className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-[1.5rem] text-sm transition-all cursor-pointer shadow-xl shadow-indigo-600/20 active:scale-[0.98]"
                      >
                        ورود امن به پنل دانشجویی
                      </button>

                      <div className="text-center pt-4 border-t border-slate-50 dark:border-slate-800">
                        <button 
                          type="button" 
                          onClick={() => { setIsRegisterMode(true); setLoginError(null); }}
                          className="text-[11px] text-slate-400 hover:text-indigo-600 font-black transition-colors cursor-pointer"
                        >
                          هنوز عضو نشده‌اید؟ ثبت‌نام پزشک جدید
                        </button>
                      </div>
                    </form>
                  )
                ) : (
                  /* FACULTY MEMBER AUTHENTICATION (AUTHOR/ADMIN) */
                  isRegisterMode ? (
                    /* AUTHOR REGISTER FORM */
                    <form onSubmit={handleRegisterStudentSubmit} className="space-y-6">
                      <div className="text-center space-y-2">
                        <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                          <UserPlus className="w-7 h-7" />
                        </div>
                        <h3 className="font-black text-lg text-slate-800 dark:text-white">درخواست همکاری علمی</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Faculty Application • Peer Review Required</p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-500 mr-2">نام و نام خانوادگی استاد</label>
                        <input 
                          type="text" 
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          placeholder="دکتر ..." 
                          className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-black focus:outline-none focus:border-indigo-500 transition-all"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-500 mr-2">جنسیت</label>
                        <select
                          value={studentGender}
                          onChange={(e) => setStudentGender(e.target.value)}
                          className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-black focus:outline-none focus:border-indigo-500 transition-all"
                          required
                        >
                          <option value="">انتخاب کنید</option>
                          <option value="male">آقا</option>
                          <option value="female">خانم</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[11px] font-black text-slate-500 mr-2">شماره تماس</label>
                          <input 
                            type="tel" 
                            value={studentPhone}
                            onChange={(e) => setStudentPhone(e.target.value)}
                            placeholder="09123456789" 
                            className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-center font-black text-xs tracking-widest focus:outline-none focus:border-indigo-500 transition-all"
                            dir="ltr"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[11px] font-black text-slate-500 mr-2">رمز عبور</label>
                          <input 
                            type="password" 
                            value={studentPassword}
                            onChange={(e) => setStudentPassword(e.target.value)}
                            placeholder="••••••••" 
                            className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-black focus:outline-none focus:border-indigo-500 transition-all"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-500 mr-2">ایمیل سازمانی / شخصی</label>
                        <div className="flex gap-3">
                          <input 
                            type="email" 
                            value={studentEmail}
                            onChange={(e) => setStudentEmail(e.target.value)}
                            placeholder="university@example.com" 
                            className="flex-1 px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-black text-left focus:outline-none focus:border-indigo-500 transition-all"
                            dir="ltr"
                            disabled={isOtpSent}
                            required
                          />
                          <button 
                            type="button"
                            onClick={handleSendOtp}
                            disabled={sendingOtp || isOtpSent || !studentEmail}
                            className="px-6 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black rounded-2xl cursor-pointer whitespace-nowrap active:scale-95 transition-all disabled:opacity-50"
                          >
                            {sendingOtp ? "ارسال..." : isOtpSent ? "ارسال شد" : "دریافت کد"}
                          </button>
                        </div>
                      </div>

                      {isOtpSent && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-2xl text-[10px] font-bold text-emerald-800 dark:text-emerald-300 text-center">
                            کد تایید ۴ رقمی ارسال گردید
                            {simulatedOtpCode && (
                              <div className="mt-2 font-mono bg-white dark:bg-slate-800 px-3 py-1 rounded-lg text-sm text-emerald-600 font-black tracking-widest">{simulatedOtpCode}</div>
                            )}
                          </div>
                          <input 
                            type="text" 
                            value={studentOtpCode}
                            onChange={(e) => setStudentOtpCode(e.target.value)}
                            className="w-full px-5 py-4 bg-white dark:bg-slate-900 border-2 border-emerald-100 dark:border-emerald-800 rounded-2xl text-center font-black tracking-[1em] text-lg focus:outline-none focus:border-emerald-500 transition-all"
                            maxLength={4}
                            required
                          />
                        </div>
                      )}

                      {otpError && (
                        <div className="p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-2xl font-black text-[10px] text-center">
                          {otpError}
                        </div>
                      )}

                      <button 
                        type="submit"
                        disabled={!isOtpSent}
                        className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-black rounded-[1.5rem] text-sm transition-all cursor-pointer shadow-xl shadow-emerald-600/20 active:scale-[0.98]"
                      >
                        ثبت درخواست عضویت هیئت علمی
                      </button>

                      <div className="text-center pt-4 border-t border-slate-50 dark:border-slate-800">
                        <button 
                          type="button" 
                          onClick={() => { setIsRegisterMode(false); setOtpError(null); }}
                          className="text-[11px] text-slate-400 hover:text-emerald-600 font-black transition-colors cursor-pointer"
                        >
                          حساب دارید؟ ورود به پنل مدیریت
                        </button>
                      </div>
                    </form>
                  ) : !showForgotForm ? (
                    /* STANDARD LOGIN FORM */
                    <form onSubmit={handleLoginSubmit} className="space-y-8">
                      <div className="text-center space-y-2">
                        <div className="w-14 h-14 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                          <Key className="w-7 h-7" />
                        </div>
                        <h3 className="font-black text-lg text-slate-800 dark:text-white">پنل اساتید و مدیران</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Faculty Access • System Administration</p>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[11px] font-black text-slate-500 mr-2">ایمیل سازمانی (RMO)</label>
                          <input 
                            type="email" 
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            placeholder="admin@dentalfy.ir" 
                            className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-black text-left focus:outline-none focus:border-indigo-500 transition-all"
                            dir="ltr"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[11px] font-black text-slate-500 mr-2">رمز عبور مدیریتی</label>
                          <input 
                            type="password" 
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="••••••••" 
                            className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-black focus:outline-none focus:border-indigo-500 transition-all"
                            required
                          />
                        </div>
                      </div>

                      {loginError && (
                        <div className="p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-2xl font-black text-[10px] text-center">
                          {loginError}
                        </div>
                      )}

                      <button 
                        type="submit"
                        className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-[1.5rem] text-sm transition-all cursor-pointer shadow-xl active:scale-[0.98]"
                      >
                        تأیید صلاحیت و ورود به سیستم
                      </button>

                      <div className="flex justify-between items-center text-[11px] font-black pt-4 border-t border-slate-50 dark:border-slate-800">
                        <button 
                          type="button" 
                          onClick={() => { setIsStudentMode(false); setIsRegisterMode(true); setRegisterRole("author"); setLoginError(null); }}
                          className="text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
                        >
                          ثبت نام استاد جدید
                        </button>
                        <button 
                          type="button" 
                          onClick={() => { setShowForgotForm(true); setLoginError(null); }}
                          className="text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                        >
                          فراموشی رمز عبور؟
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* AUTHOR FORGOT PASSWORD RESET REQUEST FORM */
                    <form onSubmit={handleForgotSubmit} className="space-y-8">
                      <div className="text-center space-y-2">
                        <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                          <Lock className="w-7 h-7" />
                        </div>
                        <h3 className="font-black text-lg text-slate-800 dark:text-white">بازیابی دسترسی</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Security Reset • Credentials Recovery</p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-500 mr-2">ایمیل ثبت‌نامی هیئت علمی</label>
                        <input 
                          type="email" 
                          value={forgotPasswordEmail}
                          onChange={(e) => setForgotPasswordEmail(e.target.value)}
                          placeholder="example@dentalfy.local" 
                          className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-black text-left focus:outline-none focus:border-indigo-500 transition-all"
                          dir="ltr"
                          required
                        />
                      </div>

                      {forgotMessage && (
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl font-black text-[10px] text-center leading-relaxed">
                          {forgotMessage}
                        </div>
                      )}

                      {forgotError && (
                        <div className="p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-2xl font-black text-[10px] text-center">
                          {forgotError}
                        </div>
                      )}

                      <div className="space-y-3">
                        <button 
                          type="submit"
                          className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-[1.5rem] text-sm transition-all cursor-pointer shadow-xl shadow-indigo-600/20 active:scale-[0.98]"
                        >
                          ارسال درخواست بازیابی به مدیریت
                        </button>

                        <button 
                          type="button" 
                          onClick={() => { setShowForgotForm(false); setForgotError(null); setForgotMessage(null); }}
                          className="w-full py-5 bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 font-black rounded-[1.5rem] text-xs transition-all cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95"
                        >
                          بازگشت به فرم ورود اساتید
                        </button>
                      </div>
                    </form>
                  )
                )}

              </div>
            </div>
          )}
        </>
      )}

      {/* Floatable AI assistant powered by Gemini */}
      
      {/* Dark Mode Toggle */}
      <button 
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed bottom-6 left-24 w-12 h-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 z-50 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
      >
        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
      <Chatbot />

    </div>
  );
}
