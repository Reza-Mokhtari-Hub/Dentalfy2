content = """import React, { useState, useEffect } from "react";
import { 
  BookOpen, FileText, CheckCircle, Download, UserPlus, 
  ChevronRight, Clock, ArrowUpRight, HelpCircle, Shield, ArrowRight, User,
  Menu, X, Award, Users, Star, GraduationCap, ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ICourse, IPost, ISiteSettings, ILibraryDoc, IFAQ } from "../types";

interface PublicHomeProps {
  settings: ISiteSettings;
  courses: ICourse[];
  posts: IPost[];
  onSelectPost: (post: IPost) => void;
  onGoToPanel: () => void;
  onRegisterAuthor: () => void;
}

export function PublicHome({ settings, courses, posts, onSelectPost, onGoToPanel, onRegisterAuthor }: PublicHomeProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedCourseDetail, setSelectedCourseDetail] = useState<ICourse | null>(null);
  const [libraryDocs, setLibraryDocs] = useState<ILibraryDoc[]>([]);
  const [faqs, setFaqs] = useState<IFAQ[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/library")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setLibraryDocs(data);
      })
      .catch(err => console.error(err));

    fetch("/api/faqs")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setFaqs(data);
      })
      .catch(err => console.error(err));
  }, []);

  const filteredPosts = selectedCourseId
    ? posts.filter((p) => {
        const cId = typeof p.course === "object" ? p.course?._id : p.course;
        return cId === selectedCourseId;
      })
    : posts;

  // Single Course View
  if (selectedCourseDetail) {
    const coursePosts = posts.filter(p => {
      const cId = typeof p.course === "object" ? p.course?._id : p.course;
      return cId === selectedCourseDetail._id;
    });

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans pb-16" dir="rtl">
        {/* Course Header */}
        <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-40">
          <button 
            onClick={() => setSelectedCourseDetail(null)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 ml-1" /> بازگشت به خانه
          </button>
          <span className="text-lg font-black text-teal-800 dark:text-teal-400">{settings.siteName || "dentalfy"}</span>
        </header>

        {/* Course Hero Banner */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
          <div className="bg-gradient-to-br from-teal-700 via-teal-800 to-teal-950 rounded-3xl p-8 md:p-14 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 space-y-5">
              <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-full text-[11px] font-extrabold inline-flex items-center gap-2 shadow-sm">
                <BookOpen className="w-3.5 h-3.5" /> صفحه اختصاصی درس
              </span>
              <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight">{selectedCourseDetail.title}</h1>
              <p className="text-teal-50 text-sm md:text-base max-w-2xl leading-relaxed opacity-90">
                {selectedCourseDetail.description || "سرفصل آموزشی مصوب وزارت بهداشت برای دوره دکتری عمومی دندانپزشکی."}
              </p>

              {/* Syllabus items */}
              {selectedCourseDetail.syllabus && selectedCourseDetail.syllabus.length > 0 && (
                <div className="pt-6 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-teal-200">سرفصل‌ها و مباحث مرجع:</h4>
                  <div className="flex flex-wrap gap-2.5">
                    {selectedCourseDetail.syllabus.map((item, idx) => (
                      <span key={idx} className="bg-teal-900/40 text-teal-50 text-xs px-4 py-1.5 rounded-full border border-teal-500/30">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Course Posts Grid */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-4">
            <div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">مقالات و آموزش‌های بالینی</h2>
              <p className="text-slate-400 text-sm mt-1.5">آرشیو کامل پست‌های منتشر شده مربوط به درس {selectedCourseDetail.title}</p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-4 py-1.5 rounded-lg text-xs font-bold">
              {coursePosts.length} مقاله آموزشی
            </div>
          </div>

          {coursePosts.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-800 p-16 text-center shadow-sm">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-600 dark:text-slate-300">هنوز پستی برای این درس ثبت نشده است</h3>
              <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto leading-relaxed">به زودی مقالات و تجربیات بالینی توسط دندانپزشکان آکادمی منتشر خواهند شد.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {coursePosts.map((post, i) => {
                const authorObj = typeof post.author === "object" ? post.author : null;
                const authorName = authorObj?.name || "نویسنده آکادمی";
                const authorPic = authorObj?.profilePicture;
                
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={post._id || i}
                    className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden flex flex-col justify-between cursor-pointer group"
                    onClick={() => onSelectPost(post)}
                  >
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/30 px-3 py-1 rounded-md">
                          {selectedCourseDetail.title}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(post.createdAt || "").toLocaleDateString("fa-IR")}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg line-clamp-2 leading-snug group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 leading-relaxed">
                        {post.content?.find(b => b.type === "text")?.value || "بدون خلاصه متنی..."}
                      </p>
                    </div>
                    <div className="px-6 py-4 border-t border-slate-50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm">
                          <img 
                            src={authorPic || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100"} 
                            alt={authorName} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{authorName}</span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center text-teal-600 dark:text-teal-400 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Home Page
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans" dir="rtl">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/30">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-800 dark:text-white leading-none">
                {settings.siteName || "Dentalfy"}
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-teal-600 dark:text-teal-400 tracking-wide mt-1">
                Clinical Learning Network
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            <a href="#courses" className="text-sm font-bold text-slate-600 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400 transition-colors">دروس تخصصی</a>
            <a href="#posts" className="text-sm font-bold text-slate-600 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400 transition-colors">مقالات بالینی</a>
            <a href="#library" className="text-sm font-bold text-slate-600 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400 transition-colors">کتابخانه فرم‌ها</a>
            <a href="#faq" className="text-sm font-bold text-slate-600 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400 transition-colors">راهنما</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button 
              onClick={onRegisterAuthor}
              className="px-4 py-2.5 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 dark:bg-teal-900/30 dark:text-teal-300 dark:hover:bg-teal-900/50 rounded-xl transition-colors cursor-pointer"
            >
              عضویت هیئت علمی
            </button>
            <button 
              onClick={onGoToPanel}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-slate-900/10 cursor-pointer flex items-center gap-2"
            >
              <User className="w-4 h-4" /> پنل کاربری
            </button>
          </div>

          <button 
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
            >
              <div className="px-4 py-6 flex flex-col gap-4">
                <a href="#courses" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200">دروس تخصصی</a>
                <a href="#posts" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200">مقالات بالینی</a>
                <a href="#library" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200">کتابخانه فرم‌ها</a>
                <div className="grid grid-cols-2 gap-3 mt-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                  <button onClick={() => { setIsMobileMenuOpen(false); onRegisterAuthor(); }} className="py-3 text-xs font-bold text-teal-700 bg-teal-50 dark:bg-teal-900/30 dark:text-teal-300 rounded-xl text-center cursor-pointer">
                    عضویت مدرس
                  </button>
                  <button onClick={() => { setIsMobileMenuOpen(false); onGoToPanel(); }} className="py-3 bg-slate-800 dark:bg-white dark:text-slate-900 text-white text-xs font-bold rounded-xl text-center cursor-pointer">
                    ورود به پنل
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200/50 dark:border-slate-800/50 pt-16 pb-20 sm:pt-24 sm:pb-32 lg:pb-36">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
          <div className="w-[500px] h-[500px] bg-teal-400/10 dark:bg-teal-500/5 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3">
          <div className="w-[600px] h-[600px] bg-sky-400/10 dark:bg-sky-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex justify-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-xs font-bold shadow-sm border border-slate-200 dark:border-slate-700">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
              </span>
              پلتفرم یادگیری مبتنی بر شواهد
            </span>
          </motion.div>
          
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-4xl sm:text-5xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
            {settings.heroText || "مرجع معتبر آموزش بالینی دندانپزشکی"}
          </motion.h1>
          
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="mt-6 text-base sm:text-lg lg:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            دنتالفای فضایی اختصاصی برای انتقال دانش، مرور سرفصل‌های دکتری عمومی و به‌اشتراک‌گذاری تجارب جراحی است. نوشته شده توسط برترین متخصصان و هیئت علمی دانشگاه‌ها.
          </motion.p>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="#courses" className="w-full sm:w-auto px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-extrabold text-sm shadow-xl shadow-teal-600/20 transition-all flex items-center justify-center gap-2">
              شروع یادگیری <ArrowLeft className="w-4 h-4" />
            </a>
            <button onClick={onRegisterAuthor} className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 rounded-2xl font-extrabold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer">
              پیوستن به عنوان مدرس
            </button>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-16 flex justify-center gap-8 sm:gap-16 opacity-60 grayscale filter hover:grayscale-0 transition-all duration-500">
             <div className="flex items-center gap-2 font-black text-slate-600 dark:text-slate-300 text-xl"><GraduationCap className="w-8 h-8 text-teal-600"/> دانشگاه علوم پزشکی</div>
             <div className="flex items-center gap-2 font-black text-slate-600 dark:text-slate-300 text-xl hidden sm:flex"><Shield className="w-8 h-8 text-blue-600"/> مرکز تحقیقات دندانپزشکی</div>
          </motion.div>
        </div>
      </section>

      {/* Stats/Features Banner */}
      <section className="bg-slate-50 dark:bg-slate-900 py-12 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-slate-200 dark:divide-slate-700">
            <div className="pt-6 sm:pt-0 flex flex-col items-center sm:items-start text-center sm:text-right px-4">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">سرفصل‌های مصوب</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">دسترسی به تمامی سرفصل‌های دکتری عمومی مصوب وزارت بهداشت.</p>
            </div>
            <div className="pt-6 sm:pt-0 flex flex-col items-center sm:items-start text-center sm:text-right px-4">
              <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400 rounded-2xl flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">محتوای بازنگری‌شده</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">کلیه مقالات توسط هیئت علمی و متخصصین مجرب بررسی و تأیید می‌شوند.</p>
            </div>
            <div className="pt-6 sm:pt-0 flex flex-col items-center sm:items-start text-center sm:text-right px-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">جامعه متخصصین</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">ارتباط مستقیم با اساتید و پرسش و پاسخ در ذیل هر مقاله علمی.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-20 sm:py-24 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">دروس تخصصی و آکادمیک</h2>
            <p className="text-slate-500 dark:text-slate-400 text-base">با انتخاب هر درس، پست‌های بالینی تخصصی مربوط به همان حوزه را مطالعه کنید. سرفصل‌ها بر اساس کتب مرجع دندانپزشکی دسته‌بندی شده‌اند.</p>
          </div>

          {/* Desktop Grid / Mobile Horizontal Scroll */}
          <div className="flex overflow-x-auto sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-8 sm:pb-0 snap-x snap-mandatory hide-scrollbar">
            {/* "All Courses" / Universal Selector */}
            <div 
              onClick={() => setSelectedCourseId(null)}
              className={`min-w-[280px] sm:min-w-0 snap-start shrink-0 p-6 sm:p-8 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between min-h-[220px] ${
                selectedCourseId === null 
                  ? "bg-teal-600 border-teal-600 text-white shadow-xl shadow-teal-600/20 scale-100 sm:scale-105" 
                  : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:border-teal-400"
              }`}
            >
              <div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${selectedCourseId === null ? "bg-white/20 text-white" : "bg-white dark:bg-slate-800 text-teal-600 shadow-sm"}`}>
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-black text-xl mb-2">همه مقالات آکادمی</h3>
                <p className={`text-sm leading-relaxed ${selectedCourseId === null ? "text-teal-50" : "text-slate-500 dark:text-slate-400"}`}>
                  نمایش تمامی مقالات و آموزش‌های بالینی بدون فیلتر دسته‌بندی.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-end">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedCourseId === null ? "bg-white text-teal-600" : "bg-slate-200 dark:bg-slate-700 text-slate-500"}`}>
                  <ArrowLeft className="w-4 h-4" />
                </div>
              </div>
            </div>

            {courses.map((course, i) => (
              <div 
                key={course._id || i}
                onClick={() => {
                  setSelectedCourseId(course._id || null);
                  setSelectedCourseDetail(course);
                }}
                className="min-w-[280px] sm:min-w-0 snap-start shrink-0 p-6 sm:p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-700 hover:border-teal-400 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between min-h-[220px] group"
              >
                <div>
                  <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center text-teal-600 mb-6 group-hover:scale-110 transition-transform">
                    {i % 2 === 0 ? <CheckCircle className="w-6 h-6" /> : <Star className="w-6 h-6" />}
                  </div>
                  <h3 className="font-black text-xl text-slate-800 dark:text-slate-100 mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {course.description || `سرفصل‌های آموزشی درس ${course.title}`}
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-3 py-1 rounded-lg">مشاهده سرفصل‌ها</span>
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 group-hover:bg-teal-600 group-hover:text-white flex items-center justify-center transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Posts */}
      <section id="posts" className="py-20 sm:py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-4">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">آخرین مقالات بالینی</h2>
              <p className="text-slate-500 dark:text-slate-400 text-base">تازه‌ترین تجربیات، گزارش کیس‌ها و مقالات آموزشی منتشر شده توسط اعضای هیئت علمی دنتالفای.</p>
            </div>
            {selectedCourseId && (
              <button 
                onClick={() => setSelectedCourseId(null)}
                className="self-start sm:self-auto px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-teal-600 flex items-center gap-2 shadow-sm cursor-pointer"
              >
                لغو فیلتر درس <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {filteredPosts.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-16 text-center shadow-sm">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-600 dark:text-slate-300">مقاله‌ای یافت نشد</h3>
              <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto leading-relaxed">هنوز مقاله‌ای در این بخش منتشر نشده است یا با فیلتر شما همخوانی ندارد.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPosts.slice(0, 8).map((post, i) => {
                const cObj = typeof post.course === "object" ? post.course : courses.find(c => c._id === post.course);
                const courseTitle = cObj?.title || "بدون دسته‌بندی";
                const authorObj = typeof post.author === "object" ? post.author : null;
                const authorName = authorObj?.name || "نویسنده آکادمی";
                const authorPic = authorObj?.profilePicture;

                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    key={post._id || i}
                    className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden flex flex-col justify-between cursor-pointer group h-full"
                    onClick={() => onSelectPost(post)}
                  >
                    <div className="p-6 sm:p-8 space-y-5 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-extrabold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/30 px-3 py-1.5 rounded-lg line-clamp-1">
                          {courseTitle}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono flex items-center gap-1 shrink-0">
                          <Clock className="w-3 h-3" />
                          {new Date(post.createdAt || "").toLocaleDateString("fa-IR")}
                        </span>
                      </div>
                      <h3 className="font-black text-slate-800 dark:text-slate-100 text-lg leading-snug group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 leading-relaxed">
                        {post.content?.find(b => b.type === "text")?.value || "بدون خلاصه متنی..."}
                      </p>
                    </div>
                    <div className="px-6 sm:px-8 py-5 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm">
                          <img 
                            src={authorPic || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100"} 
                            alt={authorName} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{authorName}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Library Section */}
      <section id="library" className="py-20 sm:py-24 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 dark:bg-slate-950 rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-16 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/50 to-transparent"></div>
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 rounded-full text-xs font-bold border border-slate-700">
                  <Download className="w-4 h-4 text-teal-400" /> دانلود رایگان
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">کتابخانه فرم‌ها و چک‌لیست‌های بالینی</h2>
                <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
                  مجموعه‌ای از پرکاربردترین فرم‌های رضایت‌نامه، چک‌لیست‌های جراحی و مدارک قانونی مورد نیاز در مطب دندانپزشکی، آماده برای دانلود و استفاده فوری.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
                {libraryDocs.slice(0, 4).map((doc, idx) => (
                  <div key={idx} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 flex items-center justify-between transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm sm:text-base line-clamp-1">{doc.title}</h4>
                        <span className="text-xs text-slate-400 font-mono mt-1 block">{doc.size || "1.0 MB"} • فرمت PDF</span>
                      </div>
                    </div>
                    <a 
                      href={doc.file} 
                      download={`${doc.title}.pdf`}
                      onClick={(e) => {
                        if (doc.file.startsWith("data:") || doc.file.startsWith("http")) return;
                        e.preventDefault();
                        alert(`دریافت فایل: ${doc.title}`);
                      }}
                      className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-teal-500 hover:text-white transition-all cursor-pointer shrink-0"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ & CTA */}
      <section id="faq" className="py-20 sm:py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">سوالات متداول کاربران</h2>
                <p className="text-slate-500 dark:text-slate-400">پاسخ به پرتکرارترین سوالات درباره نحوه استفاده از دنتالفای.</p>
              </div>

              <div className="space-y-4">
                {faqs.map((item, i) => (
                  <div key={item._id || i} className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h4 className="font-bold text-base sm:text-lg text-slate-800 dark:text-slate-100 flex items-start gap-3">
                      <HelpCircle className="w-6 h-6 text-teal-600 shrink-0 mt-0.5" />
                      {item.question}
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed mt-4 sm:pr-9">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-gradient-to-br from-teal-600 to-emerald-800 rounded-[2.5rem] p-8 sm:p-12 text-white shadow-xl sticky top-28">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm">
                  <UserPlus className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black mb-4">به تیم نویسندگان بپیوندید</h3>
                <p className="text-teal-50 text-base leading-relaxed mb-8 opacity-90">
                  اگر عضو هیئت علمی دانشگاه، متخصص دندانپزشکی یا رزیدنت هستید، می‌توانید با انتشار مقالات علمی در دنتالفای، دانش خود را با هزاران دانشجو به اشتراک بگذارید.
                </p>
                <button 
                  onClick={onRegisterAuthor}
                  className="w-full py-4 bg-white text-teal-800 hover:bg-slate-50 font-black rounded-2xl transition-colors shadow-lg cursor-pointer"
                >
                  ثبت درخواست مدرس
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-black text-slate-800 dark:text-white">{settings.siteName || "Dentalfy"}</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-sm">
                پلتفرمی تحت وب برای یکپارچه‌سازی فرآیندهای آموزشی رفرنس دندانپزشکی و دسترسی به محتوای بالینی بازنگری‌شده.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-6">دسترسی سریع</h4>
              <ul className="space-y-4">
                <li><a href="#courses" className="text-sm text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 transition-colors">دروس تخصصی</a></li>
                <li><a href="#library" className="text-sm text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 transition-colors">کتابخانه فرم‌ها</a></li>
                <li><a href="#faq" className="text-sm text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 transition-colors">سوالات متداول</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-6">ارتباط با آکادمی</h4>
              <ul className="space-y-4">
                <li className="text-sm text-slate-500 dark:text-slate-400 font-mono">info@dentalfy.local</li>
                <li className="text-sm text-slate-500 dark:text-slate-400 font-mono">admin@dentalfy.local</li>
                <li>
                  <button onClick={onGoToPanel} className="mt-4 text-sm font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer">
                    ورود به پنل مدیریت
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-wider">
              Powered by RMO © {new Date().getFullYear()} • Clinical Learning Network
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              پایداری سیستم: فعال (SERVERLESS OK)
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
"""

with open('src/components/PublicHome.tsx', 'w') as f:
    f.write(content)
