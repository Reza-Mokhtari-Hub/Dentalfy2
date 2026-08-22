import React, { useState, useEffect } from "react";
import { 
  BookOpen, FileText, CheckCircle, Download, UserPlus, 
  ChevronRight, Clock, ArrowUpRight, HelpCircle, Shield, ArrowRight, User,
  Menu, X, Award, Users, Star, GraduationCap, ArrowLeft, Search, Filter, Sparkles
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
  onStudentLogin?: () => void;
  onStudentRegister?: () => void;
}

export function PublicHome({ settings, courses, posts, onSelectPost, onGoToPanel, onRegisterAuthor, onStudentLogin, onStudentRegister }: PublicHomeProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedAuthorId, setSelectedAuthorId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [authorsList, setAuthorsList] = useState<any[]>([]);
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

    fetch("/api/authors")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setAuthorsList(data);
      })
      .catch(err => console.error(err));
  }, []);

  // Helper for safe post snippet extraction
  const getPostSnippet = (p: IPost): string => {
    if (p.summary && typeof p.summary === "string" && p.summary.trim()) {
      return p.summary.trim();
    }
    if (Array.isArray(p.content)) {
      for (const b of p.content) {
        if (!b) continue;
        if (b.type === "text") {
          if (typeof b.value === "string" && b.value.trim()) return b.value.trim();
          if (typeof b.value === "object" && b.value?.text && typeof b.value.text === "string" && b.value.text.trim()) {
            return b.value.text.trim();
          }
        }
      }
    }
    return "مطالعه متن کامل مقاله بالینی و متدولوژی درمان...";
  };

  // Helper for full-text block extraction
  const getPostFullText = (p: IPost): string => {
    const parts: string[] = [];
    if (p.title) parts.push(p.title);
    if (p.summary) parts.push(p.summary);
    if (p.seoTitle) parts.push(p.seoTitle);
    if (p.seoDescription) parts.push(p.seoDescription);
    if (Array.isArray(p.tags)) parts.push(p.tags.join(" "));
    if (Array.isArray(p.content)) {
      p.content.forEach((b: any) => {
        if (!b || !b.value) return;
        if (typeof b.value === 'string') parts.push(b.value);
        else if (typeof b.value === 'object') {
          if (b.value.text) parts.push(String(b.value.text));
          if (b.value.caption) parts.push(String(b.value.caption));
          if (b.value.author) parts.push(String(b.value.author));
          if (Array.isArray(b.value.items)) parts.push(b.value.items.join(" "));
        }
      });
    }
    return parts.join(" ").toLowerCase();
  };

  const filteredPosts = posts.filter((p) => {
    // 1. Course Filter
    if (selectedCourseId) {
      const cId = typeof p.course === "object" ? p.course?._id : p.course;
      if (cId !== selectedCourseId) return false;
    }

    // 2. Author Filter
    if (selectedAuthorId && selectedAuthorId !== "all") {
      const aId = typeof p.author === "object" ? (p.author?._id || (p.author as any)?.id) : p.author;
      if (aId !== selectedAuthorId) return false;
    }

    // 3. Full-Text Search
    if (searchQuery.trim()) {
      const queryTerms = searchQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);
      const postText = getPostFullText(p);
      const matchesAll = queryTerms.every(term => postText.includes(term));
      if (!matchesAll) return false;
    }

    return true;
  });

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
                        {getPostSnippet(post)}
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
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 md:gap-4 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform duration-300 overflow-hidden bg-slate-900 border border-teal-500/30">
              <img src="/logo.svg" alt="Dentalfy Academy DA Logo" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "/logo.png"; }} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-800 dark:text-white leading-none">
                {settings.siteName || "Dentalfy"}
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-teal-600 dark:text-teal-400 tracking-wider mt-1 uppercase">
                Clinical Learning Network
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            <a href="#courses" className="text-sm font-bold text-slate-600 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 transition-colors relative group">
              دروس تخصصی
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-teal-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#posts" className="text-sm font-bold text-slate-600 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 transition-colors relative group">
              مقالات بالینی
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-teal-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#library" className="text-sm font-bold text-slate-600 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 transition-colors relative group">
              کتابخانه فرم‌ها
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-teal-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#faq" className="text-sm font-bold text-slate-600 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 transition-colors relative group">
              راهنما
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-teal-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button 
              onClick={onRegisterAuthor}
              className="px-4 py-2 text-xs font-bold text-teal-700 hover:text-teal-800 transition-colors cursor-pointer"
            >
              عضویت هیئت علمی
            </button>
            <button 
              onClick={onGoToPanel}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-slate-900/10 hover:shadow-slate-900/20 active:scale-95 cursor-pointer flex items-center gap-2"
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
                  <button onClick={() => { setIsMobileMenuOpen(false); if(onStudentRegister) onStudentRegister(); }} className="py-3 text-xs font-bold text-blue-700 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300 rounded-xl text-center cursor-pointer">
                    عضویت دانشجو
                  </button>
                  <button onClick={() => { setIsMobileMenuOpen(false); onGoToPanel(); }} className="py-3 col-span-2 bg-slate-800 dark:bg-white dark:text-slate-900 text-white text-xs font-bold rounded-xl text-center cursor-pointer">
                    ورود به پنل
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200/50 dark:border-slate-800/50 pt-12 pb-20 sm:pt-24 sm:pb-32 lg:pb-36">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
          <div className="w-[500px] h-[500px] bg-teal-400/10 dark:bg-teal-500/5 rounded-full blur-3xl animate-pulse"></div>
        </div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3">
          <div className="w-[600px] h-[600px] bg-sky-400/10 dark:bg-sky-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.5 }} 
            className="flex justify-center mb-8 sm:mb-10"
          >
            <span className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 rounded-full text-xs font-bold shadow-xs border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
              </span>
              پلتفرم یادگیری هوشمند مبتنی بر شواهد بالینی
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} 
            className="text-4xl sm:text-6xl lg:text-[80px] font-black text-slate-900 dark:text-white tracking-tighter leading-[1.1] max-w-5xl mx-auto"
          >
            {settings.heroText || "مرجع معتبر آموزش بالینی دندانپزشکی"}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.7, delay: 0.2 }} 
            className="mt-8 text-base sm:text-lg lg:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            دنتالفای فضایی اختصاصی برای انتقال دانش، مرور سرفصل‌های دکتری عمومی و به‌اشتراک‌گذاری تجارب جراحی است. نوشته شده توسط برترین متخصصان و هیئت علمی دانشگاه‌ها.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.7, delay: 0.4 }} 
            className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button 
              onClick={onStudentRegister} 
              className="group w-full sm:w-auto px-10 py-4.5 bg-teal-600 hover:bg-teal-500 text-white rounded-2xl font-black text-sm shadow-2xl shadow-teal-600/30 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
            >
              عضویت رایگان دانشجو 
              <ArrowLeft className="w-4.5 h-4.5 group-hover:-translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={onRegisterAuthor} 
              className="w-full sm:w-auto px-10 py-4.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-2xl font-black text-sm shadow-sm transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
            >
              پیوستن به عنوان مدرس
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.8, duration: 1 }} 
            className="mt-20 flex flex-wrap justify-center gap-8 sm:gap-16 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700"
          >
             <div className="flex items-center gap-3 font-black text-slate-600 dark:text-slate-300 text-lg">
               <GraduationCap className="w-7 h-7 text-teal-600"/> 
               دانشگاه علوم پزشکی
             </div>
             <div className="flex items-center gap-3 font-black text-slate-600 dark:text-slate-300 text-lg">
               <Shield className="w-7 h-7 text-blue-600"/> 
               مرکز تحقیقات دندانپزشکی
             </div>
          </motion.div>
        </div>
      </section>

      {/* Academy Metrics */}
      <section className="bg-teal-600 dark:bg-teal-900 py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8 text-center">
            <div className="space-y-3 group cursor-pointer">
              <div className="text-4xl sm:text-6xl font-black text-white tracking-tighter group-hover:scale-110 transition-transform">۵۰+</div>
              <div className="text-teal-100/80 font-bold text-xs sm:text-sm uppercase tracking-widest group-hover:text-white transition-colors">مدرس و متخصص</div>
            </div>
            <div className="space-y-3 group cursor-pointer">
              <div className="text-4xl sm:text-6xl font-black text-white tracking-tighter group-hover:scale-110 transition-transform">۱.۲k</div>
              <div className="text-teal-100/80 font-bold text-xs sm:text-sm uppercase tracking-widest group-hover:text-white transition-colors">مقاله بالینی</div>
            </div>
            <div className="space-y-3 group cursor-pointer">
              <div className="text-4xl sm:text-6xl font-black text-white tracking-tighter group-hover:scale-110 transition-transform">۱۵k+</div>
              <div className="text-teal-100/80 font-bold text-xs sm:text-sm uppercase tracking-widest group-hover:text-white transition-colors">دانشجو و پزشک</div>
            </div>
            <div className="space-y-3 group cursor-pointer">
              <div className="text-4xl sm:text-6xl font-black text-white tracking-tighter group-hover:scale-110 transition-transform">۱۰۰٪</div>
              <div className="text-teal-100/80 font-bold text-xs sm:text-sm uppercase tracking-widest group-hover:text-white transition-colors">تایید علمی</div>
            </div>
          </div>
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
            <div 
              onClick={onRegisterAuthor}
              className="pt-6 sm:pt-0 flex flex-col items-center sm:items-start text-center sm:text-right px-4 cursor-pointer group"
            >
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-teal-600 transition-colors">جامعه متخصصین</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">ارتباط مستقیم با اساتید و پرسش و پاسخ در ذیل هر مقاله علمی.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-24 sm:py-32 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">دروس تخصصی و آکادمیک</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
              با انتخاب هر درس، پست‌های بالینی تخصصی مربوط به همان حوزه را مطالعه کنید. سرفصل‌ها بر اساس کتب مرجع دندانپزشکی دسته‌بندی شده‌اند.
            </p>
          </div>

          <div className="flex overflow-x-auto sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-10 sm:pb-0 snap-x snap-mandatory hide-scrollbar">
            {/* Universal Selector */}
            <motion.div 
              whileHover={{ y: -8 }}
              onClick={() => setSelectedCourseId(null)}
              className={`min-w-[280px] sm:min-w-0 snap-start shrink-0 p-8 sm:p-10 rounded-[2.5rem] border-2 transition-all duration-500 cursor-pointer flex flex-col justify-between min-h-[280px] relative overflow-hidden group ${
                selectedCourseId === null 
                  ? "bg-teal-600 border-teal-600 text-white shadow-2xl shadow-teal-600/30 scale-[1.02]" 
                  : "bg-slate-50 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-700/60 text-slate-800 dark:text-slate-100 hover:border-teal-400"
              }`}
            >
              {selectedCourseId === null && (
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              )}
              <div className="relative z-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-transform duration-500 group-hover:rotate-6 ${selectedCourseId === null ? "bg-white/20 text-white" : "bg-white dark:bg-slate-700 text-teal-600 shadow-sm"}`}>
                  <BookOpen className="w-7 h-7" />
                </div>
                <h3 className="font-black text-2xl mb-3 tracking-tight">همه مقالات آکادمی</h3>
                <p className={`text-sm leading-relaxed font-medium ${selectedCourseId === null ? "text-teal-50/80" : "text-slate-500 dark:text-slate-400"}`}>
                  نمایش تمامی مقالات و آموزش‌های بالینی بدون فیلتر دسته‌بندی موضوعی.
                </p>
              </div>
              <div className="relative z-10 mt-8 flex items-center justify-end">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${selectedCourseId === null ? "bg-white text-teal-600 group-hover:translate-x-1" : "bg-slate-200 dark:bg-slate-700 text-slate-500 group-hover:bg-teal-600 group-hover:text-white"}`}>
                  <ArrowLeft className="w-5 h-5" />
                </div>
              </div>
            </motion.div>

            {courses.map((course, i) => (
              <motion.div 
                whileHover={{ y: -8 }}
                key={course._id || i}
                onClick={() => {
                  setSelectedCourseId(course._id || null);
                  setSelectedCourseDetail(course);
                }}
                className="min-w-[280px] sm:min-w-0 snap-start shrink-0 p-8 sm:p-10 bg-white dark:bg-slate-800/50 rounded-[2.5rem] border-2 border-slate-200/60 dark:border-slate-700/60 hover:border-teal-500/50 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-teal-900/20 transition-all duration-500 cursor-pointer flex flex-col justify-between min-h-[280px] group"
              >
                <div className="relative">
                  <div className="w-14 h-14 bg-slate-50 dark:bg-slate-700 rounded-2xl shadow-xs flex items-center justify-center text-teal-600 mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    {i % 2 === 0 ? <CheckCircle className="w-7 h-7" /> : <Star className="w-7 h-7" />}
                  </div>
                  <h3 className="font-black text-2xl text-slate-800 dark:text-slate-100 mb-3 tracking-tight line-clamp-2 leading-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{course.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium line-clamp-2">
                    {course.description || `سرفصل‌های آموزشی درس ${course.title} و مقالات تخصصی.`}
                  </p>
                </div>
                <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-700/50">
                  <span className="text-xs font-black text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-4 py-2 rounded-xl">مشاهده سرفصل‌ها</span>
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 group-hover:bg-teal-600 group-hover:text-white group-hover:translate-x-1 flex items-center justify-center transition-all duration-300">
                    <ArrowLeft className="w-5 h-5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Posts */}
      <section id="posts" className="py-24 sm:py-32 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
            <div className="max-w-2xl space-y-4">
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">جستجو و آرشیو مقالات بالینی</h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
                جستجوی تمام‌متن در محتوای دروس تخصصی، گزارش کیس‌ها و مقالات آموزشی منتشر شده توسط اساتید و هیئت علمی.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-4 py-2 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-2xl text-xs font-black">
                {filteredPosts.length} مقاله یافت شد
              </span>
              {(selectedCourseId || selectedAuthorId !== "all" || searchQuery.trim()) && (
                <button 
                  onClick={() => {
                    setSelectedCourseId(null);
                    setSelectedAuthorId("all");
                    setSearchQuery("");
                  }}
                  className="px-4 py-2 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-800 rounded-2xl text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-rose-100 transition-colors"
                >
                  <X className="w-3.5 h-3.5" /> پاکسازی فیلترها
                </button>
              )}
            </div>
          </div>

          {/* Search & Filtering Control Bar */}
          <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-4">
            {/* Full-Text Search Input */}
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی تمام‌متن (عنوان، اصطلاحات بالینی، متون مقالات، کلمات کلیدی)..."
                className="w-full pl-10 pr-12 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium focus:outline-none focus:border-teal-500 transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Author Filter Dropdown */}
            <div className="flex items-center gap-2 min-w-[220px]">
              <User className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={selectedAuthorId}
                onChange={(e) => setSelectedAuthorId(e.target.value)}
                className="w-full py-3.5 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-teal-500 transition-all cursor-pointer"
              >
                <option value="all">👨‍⚕️ همه نویسندگان و اساتید</option>
                {authorsList.map((author) => (
                  <option key={author.id || author._id} value={author.id || author._id}>
                    {author.name} ({author.postCount || 0} مقاله)
                  </option>
                ))}
              </select>
            </div>

            {/* Course Filter Dropdown */}
            <div className="flex items-center gap-2 min-w-[220px]">
              <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={selectedCourseId || "all"}
                onChange={(e) => setSelectedCourseId(e.target.value === "all" ? null : e.target.value)}
                className="w-full py-3.5 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-teal-500 transition-all cursor-pointer"
              >
                <option value="all">📚 همه مباحث و دروس</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-700/60 p-20 text-center shadow-xs">
              <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <FileText className="w-12 h-12 text-slate-200 dark:text-slate-700" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-200">مقاله‌ای یافت نشد</h3>
              <p className="text-slate-400 text-base mt-3 max-w-md mx-auto leading-relaxed font-medium">هنوز مقاله‌ای در این بخش منتشر نشده است یا با فیلتر شما همخوانی ندارد.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredPosts.slice(0, 8).map((post, i) => {
                const cObj = typeof post.course === "object" ? post.course : courses.find(c => c._id === (post.course as any as string));
                const courseTitle = cObj?.title || "بدون دسته‌بندی";
                const authorObj = typeof post.author === "object" ? post.author : null;
                const authorName = authorObj?.name || "نویسنده آکادمی";
                const authorPic = authorObj?.profilePicture;

                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -10 }}
                    key={post._id || i}
                    className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200/60 dark:border-slate-700/60 shadow-xs hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-teal-900/20 transition-all duration-500 overflow-hidden flex flex-col justify-between cursor-pointer group h-full"
                    onClick={() => onSelectPost(post)}
                  >
                    <div className="p-8 sm:p-9 space-y-6 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/40 px-3 py-2 rounded-xl line-clamp-1">
                          {courseTitle}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono flex items-center gap-1.5 shrink-0 font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(post.createdAt || "").toLocaleDateString("fa-IR")}
                        </span>
                      </div>
                      <h3 className="font-black text-slate-800 dark:text-slate-100 text-xl leading-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 leading-relaxed font-medium">
                        {getPostSnippet(post)}
                      </p>
                    </div>
                    <div className="px-8 py-6 border-t border-slate-50 dark:border-slate-700/50 bg-slate-50/30 dark:bg-slate-800/30 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm transition-transform duration-300 group-hover:scale-110">
                          <img 
                            src={authorPic || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100"} 
                            alt={authorName} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-slate-700 dark:text-slate-200">{authorName}</span>
                          <span className="text-[9px] text-slate-400 font-bold">هیئت علمی</span>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center text-teal-600 dark:text-teal-400 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                        <ArrowLeft className="w-5 h-5 group-hover:translate-x-1" />
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
      <section id="library" className="py-24 sm:py-32 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 dark:bg-slate-950 rounded-[3rem] p-10 sm:p-20 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-10 mix-blend-overlay group-hover:scale-105 transition-transform duration-1000"></div>
            <div className="absolute inset-0 bg-linear-to-r from-slate-900 via-slate-900/60 to-transparent"></div>
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/10 text-teal-400 rounded-full text-[10px] font-black tracking-widest uppercase border border-white/10 backdrop-blur-md">
                  <Download className="w-4 h-4" /> منابع بالینی رایگان
                </div>
                <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tighter">کتابخانه فرم‌ها و چک‌لیست‌های تخصصی</h2>
                <p className="text-slate-400 text-lg leading-relaxed font-medium">
                  مجموعه‌ای از پرکاربردترین فرم‌های رضایت‌نامه، چک‌لیست‌های جراحی و مدارک قانونی مورد نیاز در مطب دندانپزشکی، آماده برای دریافت و استفاده فوری.
                </p>
                <div className="flex items-center gap-6 pt-4">
                  <div className="flex -space-x-4 space-x-reverse">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                        <img src={`https://i.pravatar.cc/150?u=${i}`} alt="avatar" className="w-full h-full object-cover grayscale" />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 font-bold">توسط بیش از ۵۰۰ پزشک دریافت شده است</p>
                </div>
              </div>

              <div className="space-y-4">
                {libraryDocs.slice(0, 4).map((doc, idx) => (
                  <motion.div 
                    whileHover={{ x: -8 }}
                    key={idx} 
                    className="p-5 sm:p-6 bg-white/5 hover:bg-white/10 rounded-[1.5rem] border border-white/5 flex items-center justify-between transition-all backdrop-blur-sm group/item"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform">
                        <FileText className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="font-black text-white text-base sm:text-lg line-clamp-1 group-hover/item:text-teal-400 transition-colors">{doc.title}</h4>
                        <span className="text-[10px] text-slate-500 font-mono mt-1.5 block tracking-widest">{doc.size || "1.2 MB"} • PDF FORMAT</span>
                      </div>
                    </div>
                    <a 
                      href={doc.file} 
                      download={`${doc.title}.pdf`}
                      onClick={(e) => {
                        if (doc.file.startsWith("data:") || doc.file.startsWith("blob:") || doc.file.startsWith("http")) return;
                        e.preventDefault();
                      }}
                      className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-teal-500 hover:text-white transition-all cursor-pointer shrink-0 shadow-lg"
                    >
                      <Download className="w-5 h-5" />
                    </a>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features & Clinical Resources */}
      <section className="py-24 sm:py-32 bg-white dark:bg-slate-900 border-t border-slate-200/50 dark:border-slate-800/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">منابع کاربردی دنتالفای</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed">
              دسترسی سریع به امکانات ویژه‌ای که برای ارتقای سطح علمی و عملی پزشکان و دانشجویان طراحی شده است.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] p-10 border border-slate-200/60 dark:border-slate-700/60 shadow-xs flex flex-col h-full group"
            >
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">فرم‌های قانونی مطب</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed flex-grow font-medium">
                دریافت انواع رضایت‌نامه‌ها، برائت‌نامه‌ها و چک‌لیست‌های جراحی با فرمت‌های استاندارد و آماده چاپ برای استفاده روزانه.
              </p>
              <button onClick={() => document.getElementById("library")?.scrollIntoView({ behavior: "smooth" })} className="mt-8 flex items-center gap-3 text-blue-600 dark:text-blue-400 text-sm font-black hover:gap-5 transition-all w-fit cursor-pointer">
                مشاهده و دانلود <ArrowLeft className="w-4 h-4" />
              </button>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] p-10 border border-slate-200/60 dark:border-slate-700/60 shadow-xs flex flex-col h-full group"
            >
              <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">آرشیو جامع مقالات</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed flex-grow font-medium">
                دسترسی به بیش از صدها کیس ریپورت و نکات کلیدی درمان ریشه، جراحی فک و صورت و ترمیم‌های زیبایی با تایید هیئت علمی.
              </p>
              <button onClick={() => document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" })} className="mt-8 flex items-center gap-3 text-teal-600 dark:text-teal-400 text-sm font-black hover:gap-5 transition-all w-fit cursor-pointer">
                جستجو در آرشیو <ArrowLeft className="w-4 h-4" />
              </button>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] p-10 border border-slate-200/60 dark:border-slate-700/60 shadow-xs flex flex-col h-full group"
            >
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">شبکه علمی نخبگان</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed flex-grow font-medium">
                امکان ارتباط مستقیم با نویسندگان متخصص، طرح پرسش در ذیل هر مقاله، و دسترسی به پاسخ‌های بالینی تایید شده.
              </p>
              <button onClick={() => { if(onStudentRegister) onStudentRegister(); }} className="mt-8 flex items-center gap-3 text-purple-600 dark:text-purple-400 text-sm font-black hover:gap-5 transition-all w-fit cursor-pointer">
                پیوستن به شبکه <ArrowLeft className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ & CTA */}
      <section id="faq" className="py-24 sm:py-32 bg-slate-50 dark:bg-slate-900 border-t border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            
            <div className="lg:col-span-7 space-y-12">
              <div className="space-y-4">
                <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">سوالات متداول کاربران</h2>
                <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">پاسخ به پرتکرارترین پرسش‌های بالینی و فنی در دنتالفای.</p>
              </div>

              <div className="space-y-4">
                {faqs.map((item, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    key={item._id || i} 
                    className="bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-700/60 shadow-xs hover:shadow-xl hover:border-teal-500/30 transition-all duration-300 group"
                  >
                    <h4 className="font-black text-lg sm:text-xl text-slate-800 dark:text-slate-100 flex items-start gap-4 leading-tight">
                      <HelpCircle className="w-7 h-7 text-teal-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      {item.question}
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg leading-relaxed mt-6 sm:pr-11 font-medium">
                      {item.answer}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-linear-to-br from-teal-600 to-emerald-800 rounded-[3rem] p-10 sm:p-14 text-white shadow-2xl sticky top-28 overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-10 backdrop-blur-md">
                    <UserPlus className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-black mb-6 tracking-tight">به هیئت علمی بپیوندید</h3>
                  <p className="text-teal-50 text-lg leading-relaxed mb-10 opacity-90 font-medium">
                    اگر متخصص دندانپزشکی یا رزیدنت هستید، می‌توانید با انتشار مقالات علمی در دنتالفای، دانش خود را با هزاران دانشجو و همکار به اشتراک بگذارید.
                  </p>
                  <button 
                    onClick={onRegisterAuthor}
                    className="w-full py-5 bg-white text-teal-900 hover:bg-slate-50 font-black rounded-2xl transition-all shadow-xl shadow-black/10 active:scale-95 cursor-pointer"
                  >
                    ارسال درخواست عضویت
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden bg-slate-900 border border-teal-500/30">
                  <img src="/logo.svg" alt="Dentalfy Academy DA Logo" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "/logo.png"; }} />
                </div>
                <span className="text-2xl font-black text-slate-800 dark:text-white">{settings.siteName || "Dentalfy"}</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-sm">
                {settings.footerText || "پلتفرمی تحت وب برای یکپارچه‌سازی فرآیندهای آموزشی رفرنس دندانپزشکی و دسترسی به محتوای بالینی بازنگری‌شده."}
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
              <ul className="space-y-3">
                {settings.contactEmail && (
                  <li className="text-sm text-slate-500 dark:text-slate-400 font-mono flex items-center gap-2">
                    <span className="text-[11px] font-sans font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded">پشتیبانی:</span>
                    <a href={`mailto:${settings.contactEmail}`} className="hover:text-teal-600 transition-colors">{settings.contactEmail}</a>
                  </li>
                )}
                {settings.adminEmail && (
                  <li className="text-sm text-slate-500 dark:text-slate-400 font-mono flex items-center gap-2">
                    <span className="text-[11px] font-sans font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded">مدیریت:</span>
                    <a href={`mailto:${settings.adminEmail}`} className="hover:text-teal-600 transition-colors">{settings.adminEmail}</a>
                  </li>
                )}
                {settings.contactPhone && (
                  <li className="text-sm text-slate-500 dark:text-slate-400 font-sans flex items-center gap-2">
                    <span className="text-[11px] font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded">تلفن:</span>
                    <span dir="ltr">{settings.contactPhone}</span>
                  </li>
                )}
                {settings.address && (
                  <li className="text-xs text-slate-500 dark:text-slate-400 font-sans leading-relaxed pt-1">
                    📍 {settings.address}
                  </li>
                )}
                <li>
                  <button onClick={onGoToPanel} className="mt-2 text-sm font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer">
                    ورود به پنل مدیریت
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-wider">
              {settings.siteName || "Dentalfy"} © {new Date().getFullYear()} • Clinical Learning Network
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
