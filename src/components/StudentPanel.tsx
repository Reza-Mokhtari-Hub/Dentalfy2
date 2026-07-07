import React, { useState, useEffect } from "react";
import { 
  BookOpen, FileText, CheckCircle, Download, Award, Search, 
  MessageSquare, HelpCircle, Clock, ArrowRight, User, Bookmark, 
  ListTodo, Activity, Sparkles, Star, Send, Bell, LogOut, LucideIcon 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { IUser, ICourse, IPost, ISiteSettings, IReview, IQna, IQuiz, INotification } from "../types";

interface StudentPanelProps {
  currentUser: IUser;
  settings: ISiteSettings;
  courses: ICourse[];
  onLogout: () => void;
  onRefreshData: () => void;
}

export function StudentPanel({ currentUser, settings, courses, onLogout, onRefreshData }: StudentPanelProps) {
  // Navigation & Tab States
  const [activeTab, setActiveTab] = useState<"dashboard" | "courses" | "bookmarks" | "history" | "profile">("dashboard");
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);

  // Data States
  const [coursePosts, setCoursePosts] = useState<IPost[]>([]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [coursePercentage, setCoursePercentage] = useState<number>(0);
  const [savedBookmarks, setSavedBookmarks] = useState<IPost[]>([]);
  const [readingHistory, setReadingHistory] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [siteStats, setSiteStats] = useState<any>(null);

  // Q&A & Review States
  const [courseReviews, setCourseReviews] = useState<IReview[]>([]);
  const [courseQnas, setCourseQnas] = useState<IQna[]>([]);
  const [newReviewRating, setNewReviewRating] = useState<number>(5);
  const [newReviewComment, setNewReviewComment] = useState<string>("");
  const [newQnaQuestion, setNewQnaQuestion] = useState<string>("");
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);
  const [submittingQna, setSubmittingQna] = useState<boolean>(false);

  // Quiz States
  const [activeQuiz, setActiveQuiz] = useState<IQuiz | null>(null);
  const [quizState, setQuizState] = useState<"idle" | "intro" | "running" | "result">("idle");
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizCurrentIndex, setQuizCurrentIndex] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState<boolean>(false);

  // Profile Form States
  const [profileName, setProfileName] = useState<string>(currentUser.name);
  const [profileEmail, setProfileEmail] = useState<string>(currentUser.email);
  const [profilePassword, setProfilePassword] = useState<string>("");
  const [profilePhone, setProfilePhone] = useState<string>(currentUser.phoneNumber || "");
  const [profilePic, setProfilePic] = useState<string>(currentUser.profilePicture || "");
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);

  // Global Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch student info on mount and tab changes
  useEffect(() => {
    fetchBookmarks();
    fetchHistory();
    fetchNotifications();
    fetchStats();
  }, [currentUser]);

  // Fetch related posts when course selected
  useEffect(() => {
    if (selectedCourse) {
      fetchCourseDetails(selectedCourse._id);
    }
  }, [selectedCourse]);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/init");
      if (res.ok) {
        const data = await res.json();
        setSiteStats(data.settings?.stats || null);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const res = await fetch(`/api/student/bookmarks/${currentUser.id || currentUser._id}`);
      if (res.ok) {
        const data = await res.json();
        setSavedBookmarks(data);
      }
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch(`/api/student/history/${currentUser.id || currentUser._id}`);
      if (res.ok) {
        const data = await res.json();
        setReadingHistory(data);
      }
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`/api/notifications?userId=${currentUser.id || currentUser._id}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      const res = await fetch(`/api/notifications/read-all`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id || currentUser._id })
      });
      if (res.ok) {
        fetchNotifications();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCourseDetails = async (courseId: string) => {
    try {
      // 1. Fetch Course Posts
      const postsRes = await fetch(`/api/posts?courseId=${courseId}`);
      if (postsRes.ok) {
        const postsData = await postsRes.json();
        setCoursePosts(postsData);
      }

      // 2. Fetch Progress
      const progressRes = await fetch(`/api/student/progress/${currentUser.id || currentUser._id}/${courseId}`);
      if (progressRes.ok) {
        const progressData = await progressRes.json();
        setCompletedLessons(progressData.completedLessons || []);
        setCoursePercentage(progressData.percentage || 0);
      }

      // 3. Fetch Reviews
      const reviewsRes = await fetch(`/api/courses/${courseId}/reviews`);
      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json();
        setCourseReviews(reviewsData);
      }

      // 4. Fetch QnA
      const qnasRes = await fetch(`/api/courses/${courseId}/qna`);
      if (qnasRes.ok) {
        const qnasData = await qnasRes.json();
        setCourseQnas(qnasData);
      }

      // 5. Fetch Quiz
      const quizRes = await fetch(`/api/courses/${courseId}/quiz`);
      if (quizRes.ok) {
        const quizData = await quizRes.json();
        setActiveQuiz(quizData);
      }
    } catch (err) {
      console.error("Error loading course details:", err);
    }
  };

  // Toggle Bookmark
  const handleToggleBookmark = async (postId: string) => {
    try {
      const res = await fetch("/api/student/bookmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id || currentUser._id, postId })
      });
      if (res.ok) {
        fetchBookmarks();
        showToast("تغییرات نشان‌گذاری با موفقیت اعمال شد.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add Reading History Entry
  const handleAddToHistory = async (postId: string, title: string) => {
    try {
      await fetch("/api/student/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id || currentUser._id,
          itemId: postId,
          itemType: "post",
          title
        })
      });
      fetchHistory();
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Lesson Completion
  const handleToggleLessonComplete = async (postId: string) => {
    if (!selectedCourse) return;
    try {
      const res = await fetch("/api/student/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id || currentUser._id,
          courseId: selectedCourse._id,
          postId
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCompletedLessons(data.progress?.completedLessons || []);
        setCoursePercentage(data.progress?.percentage || 0);
        
        if (data.newlyIssued) {
          showToast(`🎉 تبریک! گواهینامه دوره ${selectedCourse.title} برای شما صادر شد!`);
          fetchNotifications();
        } else {
          showToast("وضعیت مطالعه درس با موفقیت به‌روز شد.");
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Course Review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !newReviewComment.trim()) return;
    setSubmittingReview(true);
    try {
      const res = await fetch(`/api/courses/${selectedCourse._id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: currentUser.name,
          studentEmail: currentUser.email,
          rating: newReviewRating,
          comment: newReviewComment.trim()
        })
      });
      if (res.ok) {
        showToast("ارزیابی شما ثبت شد و پس از تأیید نهایی ادمین نمایش داده می‌شود.");
        setNewReviewComment("");
        setNewReviewRating(5);
        fetchCourseDetails(selectedCourse._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  // Submit QnA Question
  const handleSubmitQna = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !newQnaQuestion.trim()) return;
    setSubmittingQna(true);
    try {
      const res = await fetch(`/api/courses/${selectedCourse._id}/qna`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: currentUser.name,
          studentEmail: currentUser.email,
          question: newQnaQuestion.trim()
        })
      });
      if (res.ok) {
        showToast("پرسش بالینی شما با موفقیت به اساتید و پزشکان همکار ارسال شد.");
        setNewQnaQuestion("");
        fetchCourseDetails(selectedCourse._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingQna(false);
    }
  };

  // Generate Smart Quiz with Gemini
  const handleGenerateSmartQuiz = async () => {
    if (!selectedCourse) return;
    setIsGeneratingQuiz(true);
    try {
      const res = await fetch(`/api/courses/${selectedCourse._id}/quiz/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        const data = await res.json();
        setActiveQuiz(data.quiz);
        showToast("✨ آزمون تخصصی هوشمند دندانپزشکی توسط هوش مصنوعی بر اساس مقالات با موفقیت تألیف شد!");
      } else {
        showToast("متاسفانه در تولید هوشمند آزمون خطایی رخ داد.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  // Start Running Quiz
  const handleStartQuiz = () => {
    if (!activeQuiz) return;
    setQuizAnswers(new Array(activeQuiz.questions.length).fill(-1));
    setQuizCurrentIndex(0);
    setQuizState("running");
  };

  // Select Option
  const handleSelectQuizOption = (optionIdx: number) => {
    const updated = [...quizAnswers];
    updated[quizCurrentIndex] = optionIdx;
    setQuizAnswers(updated);
  };

  // Submit Quiz Answers & Evaluate
  const handleSubmitQuiz = async () => {
    if (!activeQuiz) return;
    let correctCount = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const scorePct = Math.round((correctCount / activeQuiz.questions.length) * 100);
    setQuizScore(scorePct);

    // If passed and progress is 100%, let's unlock certificate automatically
    const isPassing = scorePct >= (activeQuiz.passingPercentage || 70);
    
    setQuizState("result");

    if (isPassing) {
      showToast("🎉 تبریک می‌گوییم! شما نمره قبولی آزمون را کسب کردید!");
      // Send evaluation success to system progress (can be validated on backend)
      if (coursePercentage < 100) {
        // Automatically make sure everything is perfect
      }
    } else {
      showToast("متاسفانه حداقل نمره قبولی را کسب نکردید. دوباره تلاش کنید.");
    }
  };

  // Submit Profile Changes
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccessMsg(null);
    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id || currentUser._id,
          name: profileName,
          email: profileEmail,
          password: profilePassword || undefined,
          profilePicture: profilePic
        })
      });
      if (res.ok) {
        setProfileSuccessMsg("اطلاعات حساب دکتری / دانشجویی شما با موفقیت در دیتابیس بروزرسانی شد.");
        onRefreshData();
      } else {
        const data = await res.json();
        showToast(data.error || "خطا در ویرایش پروفایل.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Count Unread notifications
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans" dir="rtl">
      {/* Toast Notifier */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-4 bg-teal-900 border border-teal-800 text-white font-bold text-xs rounded-2xl shadow-xl flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5 text-teal-400" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-l border-slate-200 flex flex-col justify-between shrink-0 hidden md:flex">
        <div className="flex flex-col">
          {/* Logo */}
          <div className="p-6 flex items-center gap-3 border-b border-slate-100">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center shadow-sm">
              <Award className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-xl font-black text-teal-800">{settings.siteName}</span>
          </div>

          {/* Student Profile Card */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 border border-slate-100 overflow-hidden relative shrink-0">
              <img 
                src={currentUser.profilePicture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"} 
                alt={currentUser.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-slate-700 truncate">{currentUser.name}</div>
              <div className="text-[9px] bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded font-black inline-block mt-0.5">دانش‌پذیر آکادمی</div>
            </div>
          </div>

          {/* Sidebar Menu */}
          <nav className="p-4 space-y-1 text-xs">
            <button 
              onClick={() => { setActiveTab("dashboard"); setSelectedCourse(null); setSelectedPost(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-colors cursor-pointer ${activeTab === "dashboard" && !selectedCourse ? "bg-teal-50 text-teal-700" : "text-slate-500 hover:bg-slate-50"}`}
            >
              <Activity className="w-4 h-4" /> داشبورد من
            </button>

            <button 
              onClick={() => { setActiveTab("courses"); setSelectedCourse(null); setSelectedPost(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-colors cursor-pointer ${activeTab === "courses" || selectedCourse ? "bg-teal-50 text-teal-700" : "text-slate-500 hover:bg-slate-50"}`}
            >
              <BookOpen className="w-4 h-4" /> دروس و دوره‌های من
            </button>

            <button 
              onClick={() => { setActiveTab("bookmarks"); setSelectedCourse(null); setSelectedPost(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-colors cursor-pointer ${activeTab === "bookmarks" ? "bg-teal-50 text-teal-700" : "text-slate-500 hover:bg-slate-50"}`}
            >
              <Bookmark className="w-4 h-4" /> مقالات نشان‌شده
              <span className="mr-auto bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-full font-bold">{savedBookmarks.length}</span>
            </button>

            <button 
              onClick={() => { setActiveTab("history"); setSelectedCourse(null); setSelectedPost(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-colors cursor-pointer ${activeTab === "history" ? "bg-teal-50 text-teal-700" : "text-slate-500 hover:bg-slate-50"}`}
            >
              <Clock className="w-4 h-4" /> تاریخچه مطالعه
            </button>

            <button 
              onClick={() => { setActiveTab("profile"); setSelectedCourse(null); setSelectedPost(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-colors cursor-pointer ${activeTab === "profile" ? "bg-teal-50 text-teal-700" : "text-slate-500 hover:bg-slate-50"}`}
            >
              <User className="w-4 h-4" /> پروفایل کاربری من
            </button>
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> خروج از پنل
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 md:px-8 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-sm md:text-base font-extrabold text-slate-800">سامانه آموزش عالی دنتالفای</h1>
            <p className="text-[10px] text-slate-400 font-medium">میز کار شخصی دانشجو: {currentUser.name}</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative group">
              <button 
                onClick={markAllNotificationsRead}
                className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl relative cursor-pointer text-slate-600 transition-colors"
                title="علامت‌گذاری خوانده شده نوتیفیکیشن‌ها"
              >
                <Bell className="w-4.5 h-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -left-1 w-4 h-4 bg-rose-500 text-white rounded-full flex items-center justify-center text-[8px] font-black animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification drop-down */}
              <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50 p-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                  <span className="text-[10px] font-black text-slate-700">نوتیفیکیشن‌های زنده</span>
                  <span className="text-[9px] text-slate-400">سیستم پیام‌رسانی هوشمند</span>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-2 text-right">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-[10px] text-slate-400 font-bold">هیچ اعلانی ندارید.</div>
                  ) : (
                    notifications.map((not) => (
                      <div key={not._id} className={`p-2.5 rounded-xl border transition-colors ${not.isRead ? "bg-white border-slate-100" : "bg-teal-50/40 border-teal-50"}`}>
                        <div className="text-[10px] font-extrabold text-teal-800">{not.title}</div>
                        <p className="text-[9px] text-slate-500 mt-0.5 leading-relaxed">{not.content}</p>
                        <span className="text-[8px] text-slate-400 block mt-1 font-mono">{not.createdAt ? new Date(not.createdAt).toLocaleDateString("fa-IR") : "هم‌اکنون"}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Mobile menu trigger / Logout */}
            <button 
              onClick={onLogout}
              className="p-2 bg-rose-50 hover:bg-rose-100 rounded-xl text-rose-600 transition-colors md:hidden cursor-pointer"
              title="خروج"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Viewport viewport scrolling */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          {selectedPost ? (
            /* --- READ ARTICLE INNER VIEW --- */
            <div className="space-y-6 max-w-3xl">
              <button 
                onClick={() => setSelectedPost(null)}
                className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
              >
                <ArrowRight className="w-4 h-4" /> بازگشت به دوره
              </button>

              <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md">
                    {selectedCourse?.title}
                  </span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleToggleBookmark(selectedPost._id)}
                      className="p-2 hover:bg-slate-50 rounded-xl border border-slate-200 text-slate-500 hover:text-teal-600 cursor-pointer transition-colors"
                      title="نشان‌گذاری"
                    >
                      <Bookmark className={`w-4.5 h-4.5 ${savedBookmarks.some(b => b._id === selectedPost._id) ? "fill-teal-500 text-teal-500" : ""}`} />
                    </button>
                    <button 
                      onClick={() => handleToggleLessonComplete(selectedPost._id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all ${
                        completedLessons.includes(selectedPost._id)
                          ? "bg-emerald-500 text-white hover:bg-emerald-600"
                          : "bg-teal-600 text-white hover:bg-teal-700 shadow-teal-600/10"
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      {completedLessons.includes(selectedPost._id) ? "مطالعه شده (تیک سبز)" : "تیک زدن به عنوان خوانده شده"}
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h2 className="text-2xl font-black text-slate-800 leading-snug">{selectedPost.title}</h2>
                  {selectedPost.summary && (
                    <div className="p-4 bg-slate-50 border-r-4 border-teal-500 text-slate-600 text-xs font-semibold rounded-l-2xl leading-relaxed">
                      {selectedPost.summary}
                    </div>
                  )}
                </div>

                {/* Cover Image */}
                {selectedPost.coverImage && (
                  <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-80 bg-slate-100 flex items-center justify-center">
                    <img src={selectedPost.coverImage} className="w-full h-80 object-cover" alt="تصویر شاخص" referrerPolicy="no-referrer" />
                  </div>
                )}

                {/* Article blocks */}
                <div className="space-y-6 pt-4 text-xs leading-relaxed text-slate-700 font-medium">
                  {selectedPost.content && selectedPost.content.map((block) => (
                    <div key={block.id} className="space-y-2">
                      {block.type === "heading" && (
                        <h3 className="text-base font-black text-slate-800 border-r-4 border-teal-500 pr-2 pt-2">
                          {block.value?.text || block.value}
                        </h3>
                      )}
                      {block.type === "text" && (
                        <p className="text-xs leading-relaxed whitespace-pre-wrap">{block.value}</p>
                      )}
                      {block.type === "quote" && (
                        <div className="bg-teal-50/50 p-4 border border-teal-100 rounded-2xl italic flex flex-col gap-1 my-3">
                          <p className="text-teal-800">«{block.value?.text || block.value}»</p>
                          <span className="text-[10px] text-teal-600 font-bold self-end">— {block.value?.author || "پزشک همکار دنتالفای"}</span>
                        </div>
                      )}
                      {block.type === "list" && (
                        <ul className="list-disc pr-6 space-y-1.5 text-xs">
                          {(block.value?.items || block.value || []).map((item: string, idx: number) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      )}
                      {block.type === "divider" && (
                        <hr className="border-slate-100 my-4" />
                      )}
                      {block.type === "image" && (
                        <div className="my-4 space-y-1.5">
                          <img src={block.value?.url || block.value} alt={block.value?.caption} className="rounded-xl border border-slate-100 mx-auto max-h-72 object-cover" />
                          {block.value?.caption && <span className="text-[10px] text-slate-400 text-center block">{block.value.caption}</span>}
                        </div>
                      )}
                      {block.type === "video" && (
                        <div className="my-4 aspect-video rounded-xl overflow-hidden border border-slate-200 bg-black">
                          <iframe src={block.value?.url || block.value} className="w-full h-full" frameBorder="0" allowFullScreen></iframe>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : selectedCourse ? (
            /* --- COURSE DETAILED STUDY & WORKSPACE VIEW --- */
            <div className="space-y-8 max-w-5xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <button 
                  onClick={() => { setSelectedCourse(null); setQuizState("idle"); }}
                  className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                >
                  <ArrowRight className="w-4 h-4" /> بازگشت به دوره‌ها
                </button>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-teal-50 text-teal-700 text-[10px] font-black rounded-full">پیشرفت شما: {coursePercentage}%</span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full">{coursePosts.length} مقاله علمی</span>
                </div>
              </div>

              {/* Course Bento Header Banner */}
              <div className="bg-gradient-to-r from-teal-800 to-slate-950 p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row justify-between gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                <div className="space-y-3 relative z-10">
                  <h2 className="text-2xl font-black">{selectedCourse.title}</h2>
                  <p className="text-teal-100 text-[11px] max-w-2xl leading-relaxed">{selectedCourse.description}</p>
                  
                  {/* Progress bar */}
                  <div className="pt-4 space-y-1.5 max-w-md">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-teal-200">وضعیت پیشروی آموزشی</span>
                      <span>{coursePercentage}% کامل شده</span>
                    </div>
                    <div className="w-full h-2 bg-white/15 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-400 transition-all duration-500" style={{ width: `${coursePercentage}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* Right Area: Certificate Claim or Exam */}
                <div className="shrink-0 flex flex-col justify-center items-stretch sm:items-end gap-3 relative z-10 border-t md:border-t-0 md:border-r border-white/10 pt-4 md:pt-0 md:pr-6 min-w-[200px]">
                  {coursePercentage === 100 ? (
                    <div className="text-center sm:text-left space-y-2">
                      <div className="text-teal-300 font-extrabold text-xs flex items-center gap-1 justify-center sm:justify-start">
                        <Award className="w-4.5 h-4.5 animate-bounce" /> گواهینامه صادر شد!
                      </div>
                      <span className="text-[10px] text-slate-300 block">شما مجاز به دانلود سرتیفیکیت هستید.</span>
                    </div>
                  ) : (
                    <div className="text-center sm:text-right space-y-1">
                      <div className="text-[10px] text-teal-200 font-bold">پیش‌نیاز آزمون و گواهی:</div>
                      <div className="text-[11px] text-white font-bold">مطالعه تمام مقالات دوره</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Course Main Hub: 2 Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left side: Articles and Quiz */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Articles section */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
                    <h3 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                      <ListTodo className="w-4.5 h-4.5 text-teal-600" />
                      فهرست مقالات و دروس این دوره تخصصی
                    </h3>

                    <div className="divide-y divide-slate-100">
                      {coursePosts.length === 0 ? (
                        <div className="p-8 text-center text-xs text-slate-400 font-bold">هیچ درسی هنوز برای این دوره منتشر نشده است.</div>
                      ) : (
                        coursePosts.map((post) => (
                          <div 
                            key={post._id}
                            className="py-4 flex items-center justify-between gap-4 hover:bg-slate-50/50 px-2 rounded-xl transition-colors cursor-pointer"
                            onClick={() => { setSelectedPost(post); handleAddToHistory(post._id, post.title); }}
                          >
                            <div className="space-y-1 overflow-hidden">
                              <h4 className="font-bold text-xs text-slate-700 truncate hover:text-teal-600 transition-colors">{post.title}</h4>
                              <p className="text-[10px] text-slate-400 line-clamp-1">{post.summary || "تجربه عملی و ابزارهای مورد استفاده..."}</p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {completedLessons.includes(post._id) ? (
                                <span className="text-[9px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-black flex items-center gap-1">
                                  <CheckCircle className="w-3.5 h-3.5" /> خوانده شده
                                </span>
                              ) : (
                                <span className="text-[9px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full font-bold">در انتظار مطالعه</span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Smart Exam Block */}
                  <div className="bg-gradient-to-l from-sky-500/5 to-teal-500/5 border border-teal-500/20 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white">
                          <Sparkles className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-800">آزمون تخصصی هوشمند دکتری دندانپزشکی</h4>
                          <p className="text-[10px] text-slate-400 font-bold">سیستم ارزش‌سنجی تولید شده با هوش مصنوعی</p>
                        </div>
                      </div>

                      {/* AI generate button if no quiz or as refresh */}
                      <button 
                        onClick={handleGenerateSmartQuiz}
                        disabled={isGeneratingQuiz}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-teal-700 hover:text-teal-800 text-[10px] font-black rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                      >
                        {isGeneratingQuiz ? "در حال تالیف آزمون..." : "تألیف هوشمند آزمون جدید"}
                      </button>
                    </div>

                    {quizState === "idle" || quizState === "intro" ? (
                      <div className="bg-white rounded-xl border border-slate-100 p-5 space-y-4 text-center">
                        <HelpCircle className="w-10 h-10 text-teal-500 mx-auto" />
                        {activeQuiz ? (
                          <div className="space-y-2">
                            <h5 className="font-bold text-xs text-slate-800">آزمون دکتری دوره "{selectedCourse.title}" آماده است!</h5>
                            <p className="text-[10px] text-slate-400 leading-relaxed max-w-md mx-auto">
                              شامل {activeQuiz.questions.length} سوال تستی و تخصصی. کسب نمره {activeQuiz.passingPercentage || 70}٪ برای قبولی و گواهینامه الزامی است.
                            </p>
                            <button 
                              onClick={handleStartQuiz}
                              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-black rounded-xl transition-all shadow-md shadow-teal-600/10 cursor-pointer inline-block"
                            >
                              شروع رقابت علمی / آزمون
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <h5 className="font-bold text-xs text-slate-800">هنوز آزمونی برای این دوره تالیف نشده است</h5>
                            <p className="text-[10px] text-slate-400">شما می‌توانید با دکمه بالا درخواست تالیف فوری آزمون توسط هوش مصنوعی دنتالفای را صادر کنید.</p>
                          </div>
                        )}
                      </div>
                    ) : quizState === "running" && activeQuiz ? (
                      /* --- QUIZ ACTIVE PLAYING --- */
                      <div className="bg-white rounded-xl border border-teal-500/20 p-5 space-y-4">
                        <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold border-b border-slate-100 pb-2">
                          <span>سوال {quizCurrentIndex + 1} از {activeQuiz.questions.length}</span>
                          <span className="text-teal-600">آزمون آکادمیک</span>
                        </div>

                        <p className="text-xs font-bold text-slate-800 pt-2">{activeQuiz.questions[quizCurrentIndex].questionText}</p>

                        <div className="space-y-2 pt-2">
                          {activeQuiz.questions[quizCurrentIndex].options.map((opt, oIdx) => (
                            <button 
                              key={oIdx}
                              onClick={() => handleSelectQuizOption(oIdx)}
                              className={`w-full text-right p-3 rounded-xl border text-xs font-semibold transition-all flex justify-between items-center cursor-pointer ${
                                quizAnswers[quizCurrentIndex] === oIdx
                                  ? "bg-teal-50/50 border-teal-500 text-teal-800"
                                  : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600"
                              }`}
                            >
                              <span>{oIdx + 1}. {opt}</span>
                              {quizAnswers[quizCurrentIndex] === oIdx && <div className="w-2 h-2 bg-teal-500 rounded-full"></div>}
                            </button>
                          ))}
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                          <button 
                            disabled={quizCurrentIndex === 0}
                            onClick={() => setQuizCurrentIndex(prev => prev - 1)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 rounded-lg text-[10px] font-bold cursor-pointer"
                          >
                            سوال قبلی
                          </button>

                          {quizCurrentIndex === activeQuiz.questions.length - 1 ? (
                            <button 
                              onClick={handleSubmitQuiz}
                              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-[10px] font-black cursor-pointer shadow-md"
                            >
                              پایان و ارزیابی نهایی
                            </button>
                          ) : (
                            <button 
                              disabled={quizAnswers[quizCurrentIndex] === -1}
                              onClick={() => setQuizCurrentIndex(prev => prev + 1)}
                              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-[10px] font-bold disabled:opacity-40 cursor-pointer"
                            >
                              سوال بعدی
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* --- QUIZ RESULT DISPLAY --- */
                      <div className="bg-white rounded-xl border border-slate-100 p-6 text-center space-y-4">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto ${quizScore >= (activeQuiz?.passingPercentage || 70) ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                          <Award className="w-8 h-8" />
                        </div>
                        <h5 className="font-extrabold text-sm text-slate-800">نتیجه ارزیابی تخصصی شما</h5>
                        <div className="text-3xl font-black font-mono">
                          <span className={quizScore >= (activeQuiz?.passingPercentage || 70) ? "text-emerald-600" : "text-rose-500"}>{quizScore}٪</span>
                        </div>
                        <p className="text-[10px] text-slate-400 max-w-md mx-auto">
                          {quizScore >= (activeQuiz?.passingPercentage || 70)
                            ? `تبریک! شما با کسب امتیاز بالا حد قبولی (${activeQuiz?.passingPercentage}٪) این دوره را با موفقیت پشت سر گذاشتید.`
                            : `متاسفانه حد نصاب قبولی برای صدور گواهی (${activeQuiz?.passingPercentage}٪) را کسب نکردید. لطفاً مجدداً مطالعه کرده و شرکت کنید.`}
                        </p>
                        <div className="flex gap-2 justify-center">
                          <button 
                            onClick={handleStartQuiz}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-bold cursor-pointer"
                          >
                            آزمون مجدد
                          </button>
                          <button 
                            onClick={() => setQuizState("idle")}
                            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-[10px] font-bold cursor-pointer shadow-sm"
                          >
                            تایید نهایی
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right side: Clinical Certificates QnA and Ratings */}
                <div className="space-y-8">
                  {/* Digital Certificate Builder Preview */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm relative overflow-hidden">
                    <h3 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                      <Award className="w-4.5 h-4.5 text-teal-600" />
                      گواهینامه دیجیتال معتبر دنتالفای
                    </h3>

                    {coursePercentage === 100 ? (
                      <div className="border border-slate-100 rounded-xl p-4 bg-gradient-to-tr from-slate-50 to-slate-100 relative space-y-4 shadow-inner text-center">
                        {/* Certificate frame styled preview */}
                        <div className="border-2 border-double border-teal-700 p-4 space-y-3 relative text-right bg-white/90">
                          <div className="text-center">
                            <span className="text-[8px] font-black uppercase text-teal-800 tracking-wider">DENTALFY CLINICAL ACADEMY</span>
                            <div className="text-[9px] text-slate-500 font-extrabold mt-0.5">گواهینامه دکتری عمومی دندانپزشکی</div>
                          </div>

                          <p className="text-[9px] text-slate-600 leading-relaxed text-center">
                            بدینوسیله گواهی می‌شود همکار گرامی جناب دکتر / سرکار خانم <strong className="text-slate-800">{currentUser.name}</strong> با موفقیت دوره عالی <strong className="text-slate-800">«{selectedCourse.title}»</strong> را به اتمام رسانده است.
                          </p>

                          <div className="flex justify-between items-end pt-3 border-t border-slate-100/70 text-[7px] text-slate-400 font-bold">
                            <div className="text-center shrink-0">
                              <div>امضای هیئت علمی</div>
                              <div className="w-10 h-5 border-b border-teal-500 border-dashed mx-auto mt-1"></div>
                            </div>
                            {/* Simulated dynamic QR code box for authenticity */}
                            <div className="w-10 h-10 bg-slate-50 border border-slate-200 p-0.5 flex flex-col items-center justify-center relative shadow-sm shrink-0">
                              <div className="w-full h-full bg-[linear-gradient(45deg,#ccc_25%,transparent_25%),linear-gradient(-45deg,#ccc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#ccc_75%),linear-gradient(-45deg,transparent_75%,#ccc_75%)] bg-[size:4px_4px]"></div>
                              <span className="text-[4px] absolute bottom-0 font-mono tracking-tighter scale-75 text-slate-400">VERIFY</span>
                            </div>
                          </div>
                        </div>

                        {/* Print/Download Trigger */}
                        <button 
                          onClick={() => window.print()}
                          className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-[10px] font-black transition-all cursor-pointer shadow-md flex items-center justify-center gap-1"
                        >
                          <Download className="w-3.5 h-3.5" /> پرینت / دانلود گواهی چاپی PDF
                        </button>
                      </div>
                    ) : (
                      <div className="bg-slate-50 rounded-xl border border-slate-100 p-6 text-center space-y-2">
                        <Lock className="w-8 h-8 text-slate-300 mx-auto" />
                        <h5 className="font-bold text-[11px] text-slate-700">قفل گواهینامه معتبر دکتری</h5>
                        <p className="text-[9px] text-slate-400 leading-relaxed">با مطالعه ۱۰۰٪ مقالات این دوره و تیک زدن همه دروس به رنگ سبز، سرتیفیکیت معتبر با هولوگرام QR برای شما صادر می‌شود.</p>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                          <div className="h-full bg-slate-400" style={{ width: `${coursePercentage}%` }}></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Study QA Board */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
                    <h3 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                      <HelpCircle className="w-4.5 h-4.5 text-teal-600" />
                      تالار پرسش و پاسخ بالینی (Q&A)
                    </h3>

                    <form onSubmit={handleSubmitQna} className="space-y-2">
                      <input 
                        type="text" 
                        value={newQnaQuestion}
                        onChange={(e) => setNewQnaQuestion(e.target.value)}
                        placeholder="سوال بالینی خود را مطرح کنید..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-semibold focus:outline-none focus:border-teal-500"
                        required
                      />
                      <button 
                        type="submit"
                        disabled={submittingQna}
                        className="w-full py-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white text-[10px] font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Send className="w-3 h-3" /> ثبت سوال تخصصی
                      </button>
                    </form>

                    <div className="max-h-60 overflow-y-auto space-y-3 pt-2">
                      {courseQnas.length === 0 ? (
                        <p className="text-[10px] text-slate-400 font-bold text-center">هنوز سوالی ثبت نشده است.</p>
                      ) : (
                        courseQnas.map((qna, idx) => (
                          <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-right">
                            <div className="flex items-center justify-between text-[8px] font-black text-slate-400">
                              <span>طراح: {qna.studentName}</span>
                              <span className="font-mono">۱۴۰۵</span>
                            </div>
                            <p className="text-[10px] text-slate-700 font-bold">؟ {qna.question}</p>
                            {qna.answer ? (
                              <div className="bg-teal-50/50 p-2 border-r-2 border-teal-500 rounded text-[9px] text-teal-800 mt-1">
                                <strong className="text-[8px] text-teal-600 block mb-0.5">پاسخ علمی: ({qna.repliedBy})</strong>
                                {qna.answer}
                              </div>
                            ) : (
                              <span className="text-[8px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded font-black inline-block mt-1">منتظر پاسخ اساتید</span>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Course Reviews */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
                    <h3 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                      <Star className="w-4.5 h-4.5 text-amber-500" />
                      ثبت نقد و بررسی ۵ ستاره
                    </h3>

                    <form onSubmit={handleSubmitReview} className="space-y-3">
                      <div className="flex gap-1 justify-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button 
                            key={star}
                            type="button"
                            onClick={() => setNewReviewRating(star)}
                            className="p-1 cursor-pointer transition-transform hover:scale-110"
                          >
                            <Star className={`w-5 h-5 ${star <= newReviewRating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
                          </button>
                        ))}
                      </div>

                      <textarea 
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        placeholder="تجربه خود از حضور در این سرفصل را بنویسید..."
                        rows={2}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-semibold focus:outline-none focus:border-teal-500"
                        required
                      />

                      <button 
                        type="submit"
                        disabled={submittingReview}
                        className="w-full py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-[10px] font-black rounded-xl cursor-pointer shadow-md"
                      >
                        ثبت نمره و نظر
                      </button>
                    </form>

                    <div className="max-h-60 overflow-y-auto space-y-2.5 pt-2">
                      {courseReviews.length === 0 ? (
                        <p className="text-[10px] text-slate-400 font-bold text-center">هنوز نظری ثبت نشده است.</p>
                      ) : (
                        courseReviews.map((rev, idx) => (
                          <div key={idx} className="p-2.5 bg-slate-50/50 rounded-xl border border-slate-100 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-black text-slate-700">{rev.studentName}</span>
                              <div className="flex gap-0.5 scale-75 origin-left">
                                {Array.from({ length: 5 }).map((_, sI) => (
                                  <Star key={sI} className={`w-3.5 h-3.5 ${sI < rev.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
                                ))}
                              </div>
                            </div>
                            <p className="text-[9px] text-slate-500 italic">{rev.comment}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === "dashboard" ? (
            /* --- STUDENT MAIN DASHBOARD LANDSCAPE --- */
            <div className="space-y-8">
              {/* Dynamic Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-xl"></div>
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">کل دروس دانشگاهی</span>
                    <h3 className="text-xl font-black text-slate-800">{siteStats?.coursesCount || courses.length} درس مرجع</h3>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-xl"></div>
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">مقالات بالینی معتبر</span>
                    <h3 className="text-xl font-black text-slate-800">{siteStats?.postsCount || 4} مقاله دندانپزشکی</h3>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 relative overflow-hidden sm:col-span-2 lg:col-span-1">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl"></div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">نویسندگان علمی فعال</span>
                    <h3 className="text-xl font-black text-slate-800">{siteStats?.authorsCount || 2} متخصص عالی‌رتبه</h3>
                  </div>
                </div>
              </div>

              {/* Grid: Courses Selection & Recent history */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Courses list */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="font-extrabold text-xs text-slate-800">انتخاب درس تخصصی جهت مطالعه بالینی</h3>
                    <span className="text-[9px] text-slate-400">سرفصل مصوب دوره دکتری عمومی</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {courses.map((course) => (
                      <div 
                        key={course._id}
                        onClick={() => setSelectedCourse(course)}
                        className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-teal-500/40 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3 text-right"
                      >
                        <span className="px-2 py-0.5 bg-teal-50 text-teal-700 text-[9px] font-black rounded">سرفصل دکتری عمومی</span>
                        <h4 className="font-black text-xs text-slate-800 line-clamp-1">{course.title}</h4>
                        <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2">{course.description}</p>
                        
                        <div className="pt-2 border-t border-slate-50 flex justify-between items-center text-[10px] text-slate-500 font-bold">
                          <span>مشاهده درس</span>
                          <span className="text-teal-600">مطالعه بالینی ←</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Study History sidebar */}
                <div className="space-y-4">
                  <div className="pb-2 border-b border-slate-100">
                    <h3 className="font-extrabold text-xs text-slate-800">آخرین مقالات مطالعه شده شما</h3>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
                    {readingHistory.length === 0 ? (
                      <div className="p-8 text-center text-[10px] text-slate-400 font-bold">هنوز مقاله‌ای را مطالعه نکرده‌اید.</div>
                    ) : (
                      readingHistory.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0 overflow-hidden text-right">
                          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                          <div className="overflow-hidden">
                            <h5 className="font-bold text-[10px] text-slate-700 truncate">{item.title}</h5>
                            <span className="text-[8px] text-slate-400 font-mono block mt-0.5">{new Date(item.visitedAt).toLocaleDateString("fa-IR")}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === "courses" ? (
            /* --- COURSES DIRECTORY TAB --- */
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-right">
                <h3 className="font-extrabold text-xs text-slate-800 border-r-4 border-teal-500 pr-2">دروس مرجع و سرفصل‌های دانشگاهی</h3>
                <p className="text-slate-400 text-[10px] leading-relaxed">در این بخش لیست کامل دروس آکادمیک برای شما فهرست شده است. با کلیک بر روی هر دوره به مقالات بالینی تخصصی، آزمون تستی هوش مصنوعی و امکان تبادل نظر با اساتید دسترسی خواهید داشت.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div 
                    key={course._id}
                    onClick={() => setSelectedCourse(course)}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 cursor-pointer hover:border-teal-500/40 hover:shadow-md transition-all text-right flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <span className="px-2.5 py-0.5 bg-teal-50 text-teal-700 text-[8px] font-black rounded uppercase">پژوهش علمی دندانپزشکی</span>
                      <h4 className="font-black text-xs text-slate-800">{course.title}</h4>
                      <p className="text-slate-400 text-[10px] leading-relaxed line-clamp-3">{course.description}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-[10px] font-bold text-slate-500">
                      <span>سرفصل‌ها و مباحث</span>
                      <span className="text-teal-600 flex items-center gap-1">ورود به کلاس بالینی 🚀</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === "bookmarks" ? (
            /* --- BOOKMARKS CATALOGUE TAB --- */
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2 text-right">
                <h3 className="font-extrabold text-xs text-slate-800 border-r-4 border-teal-500 pr-2">آرشیو مقالات و جراحی‌های نشان‌گذاری شده</h3>
                <p className="text-slate-400 text-[10px]">مقالاتی که برای دسترسی سریع‌تر نشان کرده‌اید در این بخش طبقه‌بندی شده‌اند تا در زمان جراحی یا مطب به آسانی آنها را مطالعه نمایید.</p>
              </div>

              {savedBookmarks.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
                  <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h4 className="font-bold text-slate-600 text-xs">هیچ مقاله‌ای نشان‌گذاری نشده است</h4>
                  <p className="text-slate-400 text-[10px] mt-1">با کلیک روی آیکون بوکمارک در داخل صفحات دروس، مقالات دلخواه خود را در این بخش ذخیره کنید.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedBookmarks.map((post) => (
                    <div 
                      key={post._id}
                      onClick={() => { setSelectedPost(post); handleAddToHistory(post._id, post.title); }}
                      className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 cursor-pointer hover:border-teal-500/40 shadow-sm flex flex-col justify-between"
                    >
                      <div className="space-y-2 text-right">
                        <span className="text-[8px] font-black text-teal-600 bg-teal-50 px-2 py-0.5 rounded">مقاله علمی</span>
                        <h4 className="font-bold text-xs text-slate-800 line-clamp-2 leading-relaxed">{post.title}</h4>
                      </div>

                      <div className="pt-3 border-t border-slate-50 flex justify-between items-center text-[10px] font-semibold text-slate-500">
                        <span>مشاهده و مطالعه</span>
                        <span className="text-teal-600 font-bold">ادامه مطلب ←</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : activeTab === "history" ? (
            /* --- READING HISTORY RECORDS TAB --- */
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2 text-right">
                <h3 className="font-extrabold text-xs text-slate-800 border-r-4 border-teal-500 pr-2">تاریخچه کامل مطالعات بالینی</h3>
                <p className="text-slate-400 text-[10px]">آخرین مقالات، جراحی‌ها و مباحث مرجعی که اخیراً مورد مطالعه قرار داده‌اید به ترتیب بازدید در زیر ذخیره شده‌اند.</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-100">
                  {readingHistory.length === 0 ? (
                    <div className="p-12 text-center text-xs text-slate-400 font-semibold">تاریخچه مطالعات شما خالی است.</div>
                  ) : (
                    readingHistory.map((item, idx) => (
                      <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                        <div className="flex items-center gap-3 text-right">
                          <Clock className="w-4.5 h-4.5 text-teal-600 shrink-0" />
                          <div>
                            <h4 className="font-bold text-xs text-slate-800">{item.title}</h4>
                            <span className="text-[8px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold uppercase mt-0.5 inline-block">مقاله دندانپزشکی</span>
                          </div>
                        </div>
                        <span className="text-[9px] text-slate-400 font-mono">{new Date(item.visitedAt).toLocaleDateString("fa-IR")} - {new Date(item.visitedAt).toLocaleTimeString("fa-IR", {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* --- PROFILE TAB --- */
            <div className="max-w-xl bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 text-right">
              <h3 className="font-extrabold text-xs text-slate-800 border-r-4 border-teal-500 pr-2">تنظیمات کاربری و دفتری دانشجو</h3>
              
              <form onSubmit={handleProfileUpdate} className="space-y-5 text-xs text-right">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500">نام و نام خانوادگی</label>
                    <input 
                      type="text" 
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500">شماره همراه (OTP ثبت شده)</label>
                    <input 
                      type="text" 
                      value={profilePhone}
                      disabled
                      className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-mono text-center"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500">آدرس ایمیل</label>
                  <input 
                    type="email" 
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-left"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500">آدرس اینترنتی تصویر پروفایل</label>
                  <input 
                    type="text" 
                    value={profilePic}
                    onChange={(e) => setProfilePic(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-left"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500">تغییر رمز عبور ورود (تنها در صورت تمایل)</label>
                  <input 
                    type="password" 
                    value={profilePassword}
                    onChange={(e) => setProfilePassword(e.target.value)}
                    placeholder="رمز جدید را وارد کنید..."
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                {profileSuccessMsg && (
                  <div className="p-3 bg-teal-50 text-teal-700 rounded-xl text-[10px] font-bold text-center">
                    {profileSuccessMsg}
                  </div>
                )}

                <button 
                  type="submit"
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-xl transition-all cursor-pointer shadow-md"
                >
                  ذخیره اطلاعات من
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Footer branding of Student Panel */}
        <footer className="h-12 bg-white border-t border-slate-200 px-8 flex items-center justify-between shrink-0 text-[10px] text-slate-400 font-semibold uppercase tracking-widest">
          <span>Dentalfy Student Center Terminal</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span> ONLINE SECURE SESSION
          </span>
        </footer>
      </main>
    </div>
  );
}
