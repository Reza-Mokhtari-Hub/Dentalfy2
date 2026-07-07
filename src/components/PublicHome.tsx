import React, { useState, useEffect } from "react";
import { 
  BookOpen, FileText, CheckCircle, Download, UserPlus, 
  ChevronRight, Clock, ArrowUpRight, HelpCircle, Shield, ArrowRight, User 
} from "lucide-react";
import { motion } from "motion/react";
import { ICourse, IPost, ISiteSettings, ILibraryDoc, IFAQ } from "../types";

interface PublicHomeProps {
  settings: ISiteSettings;
  courses: ICourse[];
  posts: IPost[];
  onSelectPost: (post: IPost) => void;
  onGoToPanel: () => void;
}

export function PublicHome({ settings, courses, posts, onSelectPost, onGoToPanel }: PublicHomeProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedCourseDetail, setSelectedCourseDetail] = useState<ICourse | null>(null);
  const [requestName, setRequestName] = useState("");
  const [requestEmail, setRequestEmail] = useState("");
  const [requestBio, setRequestBio] = useState("");
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [libraryDocs, setLibraryDocs] = useState<ILibraryDoc[]>([]);
  const [faqs, setFaqs] = useState<IFAQ[]>([]);

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

  // Filter posts based on selected course
  const filteredPosts = selectedCourseId
    ? posts.filter((p) => {
        const cId = typeof p.course === "object" ? p.course?._id : p.course;
        return cId === selectedCourseId;
      })
    : posts;


  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestName || !requestEmail) {
      setSubmitError("نام و ایمیل الزامی هستند");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitMessage(null);

    try {
      const res = await fetch("/api/requests/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: requestName, email: requestEmail, bio: requestBio }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitMessage("درخواست شما با موفقیت ثبت شد و پس از بررسی ادمین فعال خواهد شد.");
        setRequestName("");
        setRequestEmail("");
        setRequestBio("");
      } else {
        setSubmitError(data.error || "خطایی رخ داد");
      }
    } catch (err) {
      setSubmitError("خطا در اتصال به سرور");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (selectedCourseDetail) {
    const coursePosts = posts.filter(p => {
      const cId = typeof p.course === "object" ? p.course?._id : p.course;
      return cId === selectedCourseDetail._id;
    });

    return (
      <div className="min-h-screen bg-slate-50 font-sans pb-16" dir="rtl">
        {/* Course Header */}
        <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
          <button 
            onClick={() => setSelectedCourseDetail(null)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 ml-1" /> بازگشت به خانه
          </button>
          <span className="text-sm font-black text-teal-800">{settings.siteName || "dentalfy"}</span>
        </header>

        {/* Course Hero Banner */}
        <div className="max-w-6xl mx-auto px-6 pt-8">
          <div className="bg-gradient-to-r from-teal-700 to-teal-950 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            <div className="relative z-10 space-y-4">
              <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-extrabold inline-block">
                صفحه اختصاصی درس دانشگاهی
              </span>
              <h1 className="text-3xl md:text-4xl font-black">{selectedCourseDetail.title}</h1>
              <p className="text-teal-100 text-xs md:text-sm max-w-2xl leading-relaxed">
                {selectedCourseDetail.description || "سرفصل آموزشی مصوب وزارت بهداشت برای دوره دکتری عمومی دندانپزشکی."}
              </p>

              {/* Syllabus items */}
              {selectedCourseDetail.syllabus && selectedCourseDetail.syllabus.length > 0 && (
                <div className="pt-4 space-y-2">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-teal-200">سرفصل‌ها و مباحث مرجع این درس:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCourseDetail.syllabus.map((item, idx) => (
                      <span key={idx} className="bg-white/10 text-white text-[11px] px-3 py-1 rounded-full border border-white/5">
                        • {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Course Posts Grid */}
        <div className="max-w-6xl mx-auto px-6 pt-12 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-xl font-extrabold text-slate-800">مقالات و آموزش‌های بالینی این درس</h2>
            <p className="text-slate-400 text-xs mt-1">آرشیو کامل پست‌های منتشر شده مربوط به درس {selectedCourseDetail.title}</p>
          </div>

          {coursePosts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center shadow-sm">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="font-bold text-slate-600">هنوز پستی برای این درس ثبت نشده است</h3>
              <p className="text-slate-400 text-xs mt-1">به زودی مقالات و تجربیات بالینی توسط دندانپزشکان آکادمی منتشر خواهند شد.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coursePosts.map((post) => {
                const authorName = typeof post.author === "object" ? post.author?.name : "نویسنده آکادمی";
                const authorPic = typeof post.author === "object" ? post.author?.profilePicture : "";
                return (
                  <motion.div 
                    key={post._id}
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between cursor-pointer group"
                    onClick={() => onSelectPost(post)}
                  >
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md">
                          {selectedCourseDetail.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(post.createdAt || "").toLocaleDateString("fa-IR")}
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-800 text-base line-clamp-2 leading-snug group-hover:text-teal-600 transition-colors">
                        {post.title}
                      </h3>

                      <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed">
                        {post.content?.find(b => b.type === "text")?.value || "بدون خلاصه متنی..."}
                      </p>
                    </div>

                    <div className="px-6 py-4 border-t border-slate-50 bg-slate-50/50 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-100">
                          <img 
                            src={authorPic || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100"} 
                            alt={authorName} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <span className="text-xs font-semibold text-slate-600">{authorName}</span>
                      </div>

                      <span className="text-teal-600 text-xs font-bold flex items-center gap-0.5 group-hover:translate-x-[-2px] transition-transform">
                        مطالعه مقاله <ArrowUpRight className="w-4 h-4 ml-0.5" />
                      </span>
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

  return (
    <div className="min-h-screen bg-slate-50 font-sans" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center shadow-md shadow-teal-500/20">
            <div className="w-5 h-5 bg-white rounded-full opacity-90"></div>
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight text-teal-800">{settings.siteName || "dentalfy"}</span>
            <span className="hidden md:inline-block mr-2 text-xs bg-teal-50 text-teal-700 px-2.5 py-0.5 rounded-full font-bold">آکادمی دندانپزشکی</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <a href="#courses" className="hover:text-teal-600 transition-colors">دروس تخصصی</a>
          <a href="#posts" className="hover:text-teal-600 transition-colors">پست‌های اخیر</a>
          <a href="#library" className="hover:text-teal-600 transition-colors">کتابخانه فرم‌ها</a>
          <a href="#faq" className="hover:text-teal-600 transition-colors">سوالات متداول</a>
          <a href="#request-account" className="text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-1">
            <UserPlus className="w-4 h-4" /> درخواست اکانت
          </a>
        </nav>

        <button
          onClick={onGoToPanel}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors shadow-lg shadow-teal-600/10 flex items-center gap-1.5 cursor-pointer"
        >
          <Shield className="w-4 h-4" />
          پنل نویسندگان و مدیر
        </button>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-16">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8 md:p-14 relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl"></div>

          <div className="flex-1 space-y-6 relative z-10 text-center md:text-right">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-extrabold">
              <span className="w-2 h-2 bg-teal-500 rounded-full animate-ping"></span>
              پلتفرم نوین آموزش بالینی دندانپزشکی
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-800 leading-tight">
              {settings.heroText || "آکادمی آموزش تخصصی دندانپزشکی"}
            </h1>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-xl">
              دنتالفای فضایی ایمن و اختصاصی برای انتقال دانش بالینی، مرور سرفصل‌های دکتری عمومی و به اشتراک‌گذاری تجارب جراحی است. نوشته شده توسط برترین متخصصان و دندانپزشکان.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a href="#courses" className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-sm shadow-md shadow-teal-600/20 text-center transition-all">
                مشاهده دروس و سرفصل‌ها
              </a>
              <a href="#request-account" className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm text-center transition-all">
                درخواست عضویت به عنوان نویسنده
              </a>
            </div>
          </div>

          <div className="w-full md:w-80 h-56 bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden relative shadow-inner flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/10 to-transparent"></div>
            <img 
              src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=400" 
              alt="Dental Care Clinic"
              className="w-full h-full object-cover mix-blend-multiply opacity-85"
            />
          </div>
        </div>
      </section>

      {/* Courses Bento Selector */}
      <section id="courses" className="max-w-6xl mx-auto px-6 py-8">
        <div className="text-center md:text-right mb-8">
          <h2 className="text-2xl font-black text-slate-800">دروس تخصصی و آکادمیک</h2>
          <p className="text-slate-400 text-xs mt-1">با انتخاب هر درس، پست‌های بالینی تخصصی مربوط به همان حوزه را فیلتر کنید</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Universal selector */}
          <div 
            onClick={() => setSelectedCourseId(null)}
            className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-44 ${
              selectedCourseId === null 
                ? "bg-teal-600 border-teal-600 text-white shadow-lg shadow-teal-600/20" 
                : "bg-white border-slate-200 text-slate-800 hover:border-teal-400 shadow-sm"
            }`}
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-xl ${selectedCourseId === null ? "bg-white/20" : "bg-teal-50 text-teal-600"}`}>
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${selectedCourseId === null ? "bg-white/20" : "bg-slate-100 text-slate-500"}`}>
                  همه مباحث
                </span>
              </div>
              <h3 className="font-extrabold text-base">تمامی آموزش‌های بالینی</h3>
              <p className={`text-xs mt-1 leading-relaxed ${selectedCourseId === null ? "text-teal-100" : "text-slate-400"}`}>
                نمایش بدون محدودیت کل مقالات، دستورالعمل‌ها و ویدیوهای آکادمی.
              </p>
            </div>
          </div>

          {courses.map((course) => {
            const isSelected = selectedCourseId === course._id;
            return (
              <div 
                key={course._id}
                onClick={() => {
                  setSelectedCourseId(course._id);
                  setSelectedCourseDetail(course);
                }}
                className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-44 ${
                  isSelected 
                    ? "bg-teal-600 border-teal-600 text-white shadow-lg shadow-teal-600/20" 
                    : "bg-white border-slate-200 text-slate-800 hover:border-teal-400 shadow-sm"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-2.5 rounded-xl ${isSelected ? "bg-white/20" : "bg-teal-50 text-teal-600"}`}>
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${isSelected ? "bg-white/20" : "bg-slate-100 text-slate-500"}`}>
                      {course.syllabus?.length || 0} مبحث اصلی
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base truncate">{course.title}</h3>
                  <p className={`text-xs mt-1 leading-relaxed line-clamp-2 ${isSelected ? "text-teal-100" : "text-slate-400"}`}>
                    {course.description || "سرفصل آموزشی مصوب وزارت بهداشت"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Posts Feed */}
      <section id="posts" className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-2xl font-black text-slate-800">آموزش‌ها و مقالات بالینی اخیر</h2>
            <p className="text-slate-400 text-xs mt-1">تأیید شده علمی توسط گروه پایش درمان RMO</p>
          </div>
          {selectedCourseId && (
            <button 
              onClick={() => setSelectedCourseId(null)}
              className="text-xs text-teal-600 font-bold hover:underline self-start sm:self-center"
            >
              پاک کردن فیلتر درس ✕
            </button>
          )}
        </div>

        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-bold text-slate-600">هنوز پستی در این گروه منتشر نشده است</h3>
            <p className="text-slate-400 text-xs mt-1">نویسندگان به زودی اولین مقالات و تجربیات بالینی را ثبت خواهند کرد.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => {
              const authorName = typeof post.author === "object" ? post.author?.name : "نویسنده آکادمی";
              const authorPic = typeof post.author === "object" ? post.author?.profilePicture : "";
              const courseTitle = post.course?.title || "مبحث عمومی";

              return (
                <motion.div 
                  key={post._id}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between cursor-pointer group"
                  onClick={() => onSelectPost(post)}
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md">
                        {courseTitle}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(post.createdAt || "").toLocaleDateString("fa-IR")}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-800 text-base line-clamp-2 leading-snug group-hover:text-teal-600 transition-colors">
                      {post.title}
                    </h3>

                    {/* Quick preview of text block */}
                    <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed">
                      {post.content?.find(b => b.type === "text")?.value || "بدون خلاصه متنی..."}
                    </p>
                  </div>

                  <div className="px-6 py-4 border-t border-slate-50 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-100">
                        <img 
                          src={authorPic || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100"} 
                          alt={authorName} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-600">{authorName}</span>
                    </div>

                    <span className="text-teal-600 text-xs font-bold flex items-center gap-0.5 group-hover:translate-x-[-2px] transition-transform">
                      مطالعه مقاله <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Dental Library Section */}
      <section id="library" className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-3xl border border-slate-100 p-8 md:p-12 shadow-sm">
          <div className="text-center md:text-right mb-8">
            <h2 className="text-2xl font-black text-slate-800">کتابخانه فرم‌ها و چک‌لیست‌های بالینی</h2>
            <p className="text-slate-400 text-xs mt-1">دانلود فوری مدارک پزشکی و چک‌لیست‌های تخصصی مورد نیاز مطب‌ها</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {libraryDocs.map((doc, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between hover:bg-slate-100/60 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-700">{doc.title}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">{doc.size || "1.0 MB"} • فرمت PDF</span>
                  </div>
                </div>
                <a 
                  href={doc.file} 
                  download={`${doc.title}.pdf`}
                  onClick={(e) => {
                    if (doc.file.startsWith("data:")) {
                      return; // Standard download for Base64 Data URI
                    }
                    if (doc.file.startsWith("http")) {
                      return; // Standard download for full URL
                    }
                    e.preventDefault();
                    alert(`دریافت آزمایشی فایل: ${doc.title}`);
                  }}
                  className="p-2.5 bg-white border border-slate-200 text-slate-600 hover:text-teal-600 hover:border-teal-100 hover:bg-teal-50/20 rounded-xl transition-all cursor-pointer"
                  title="دانلود فایل"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion & About */}
      <section id="faq" className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-2xl font-black text-slate-800 mb-6">سوالات متداول کاربران</h2>
          {faqs.map((item, i) => (
            <div key={item._id || i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
              <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-teal-600" />
                {item.question}
              </h4>
              <p className="text-slate-500 text-xs leading-relaxed pr-6">
                {item.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-3xl p-8 border border-teal-100/40 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-black text-teal-800 text-lg">درباره آکادمی دنتالفای</h3>
            <p className="text-teal-900/70 text-xs leading-relaxed">
              دنتالفای پلتفرمی تحت وب برای یکپارچه‌سازی فرآیندهای آموزشی رفرنس دندانپزشکی است. با استفاده از این بستر، دانشجویان سراسر کشور می‌توانند به محتواهای بالینی بازنگری‌شده و معتبر، سرفصل‌های دروس عمومی و اختصاصی دندانپزشکی دسترسی آنی داشته باشند.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-teal-200/40 text-xs text-teal-800 font-bold flex justify-between">
            <span>مدیر ارشد آکادمی (RMO)</span>
            <span>info@dentalfy.local</span>
          </div>
        </div>
      </section>

      {/* Request Account Section */}
      <section id="request-account" className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-teal-950 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-xl shadow-teal-950/20">
          <div className="absolute top-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 max-w-xl mx-auto text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-black">درخواست حساب کاربری نویسنده</h2>
            <p className="text-teal-200 text-xs leading-relaxed">
              اگر متخصص دندانپزشکی، عضو هیئت علمی و یا دانشجو با رزومه علمی برجسته هستید، مشخصات خود را وارد کنید تا حساب کاربری شما توسط RMO تایید و رمز ورود برایتان صادر شود.
            </p>

            <form onSubmit={handleRequestSubmit} className="space-y-4 text-right">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-teal-200">نام و نام خانوادگی (همراه پیشوند علمی)</label>
                  <input 
                    type="text" 
                    value={requestName}
                    onChange={(e) => setRequestName(e.target.value)}
                    placeholder="مثال: دکتر علیرضا رضایی" 
                    className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-teal-400 placeholder-teal-400/60"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-teal-200">آدرس ایمیل معتبر</label>
                  <input 
                    type="email" 
                    value={requestEmail}
                    onChange={(e) => setRequestEmail(e.target.value)}
                    placeholder="مثال: dr.rezaei@email.com" 
                    className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-teal-400 placeholder-teal-400/60 text-left"
                    dir="ltr"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-teal-200">تخصص، رزومه و هدف از فعالیت در آکادمی (اختیاری)</label>
                <textarea 
                  value={requestBio}
                  onChange={(e) => setRequestBio(e.target.value)}
                  placeholder="مثال: رزیدنت ارتودنسی دانشگاه تهران / آماده‌سازی مطالب بالینی ارتودنسی ثابت..." 
                  className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-teal-400 placeholder-teal-400/60 h-20 resize-none"
                />
              </div>

              {submitMessage && (
                <div className="p-3 bg-teal-500/20 text-teal-200 rounded-xl text-xs font-semibold text-center">
                  ✓ {submitMessage}
                </div>
              )}

              {submitError && (
                <div className="p-3 bg-rose-500/20 text-rose-200 rounded-xl text-xs font-semibold text-center">
                  ✕ {submitError}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-3 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-teal-950 font-black rounded-xl text-sm transition-colors cursor-pointer"
              >
                {isSubmitting ? "در حال ثبت درخواست..." : "ارسال درخواست رسمی عضویت"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="bg-white border-t border-slate-100 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Powered by RMO © {new Date().getFullYear()} • Clinical Learning Network
          </div>
          <div className="flex items-center gap-6 text-[10px] font-bold text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> 
              پایداری دیتابیس: فعال (SERVERLESS OK)
            </span>
            <span>آکادمی تخصصی دندانپزشکی ایران</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
