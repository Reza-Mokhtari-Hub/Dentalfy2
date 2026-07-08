import React, { useState, useEffect } from "react";
import { 
  BookOpen, FileText, CheckCircle, Download, Award, Search, 
  MessageSquare, HelpCircle, Clock, ArrowRight, User, Bookmark, 
  ListTodo, Activity, Sparkles, Star, Send, Bell, LogOut, LucideIcon, Shield, Menu, X, Trash2, Lock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { IUser, ICourse, IPost, ISiteSettings, IReview, IQna, IQuiz, INotification, ILibraryDoc } from "../types";

interface StudentPanelProps {
  currentUser: IUser;
  settings: ISiteSettings;
  courses: ICourse[];
  posts: IPost[];
  onLogout: () => void;
  onRefreshData: () => void;
}

export function StudentPanel({ currentUser, settings, courses, posts, onLogout, onRefreshData }: StudentPanelProps) {
  // Navigation & Tab States
  const [activeTab, setActiveTab] = useState<"dashboard" | "courses" | "bookmarks" | "history" | "profile" | "library">("dashboard");
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);
  const [customConfirm, setCustomConfirm] = useState<{
    title: string;
    message: string;
    onConfirm: () => void | Promise<void>;
  } | null>(null);

  // Data States
  const [coursePosts, setCoursePosts] = useState<IPost[]>([]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [coursePercentage, setCoursePercentage] = useState<number>(0);
  const [savedBookmarks, setSavedBookmarks] = useState<IPost[]>([]);
  const [readingHistory, setReadingHistory] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [siteStats, setSiteStats] = useState<any>(null);
  const [libraryDocs, setLibraryDocs] = useState<ILibraryDoc[]>([]);

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
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [profilePhone, setProfilePhone] = useState<string>(currentUser.phoneNumber || "");
  const [profileGender, setProfileGender] = useState<string>(currentUser.gender || "");
  const [profilePic, setProfilePic] = useState<string>(currentUser.profilePicture || "");
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);

  // Global Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
    fetchLibrary();
  }, [currentUser]);

  // Fetch related posts when course selected
  useEffect(() => {
    if (selectedCourse) {
      fetchCourseDetails(selectedCourse._id);
    }
  }, [selectedCourse]);

  useEffect(() => {
    if (selectedPost) {
      fetch(`/api/posts/${selectedPost._id}/comments`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setPostComments(data);
        })
        .catch(err => console.error("Error fetching comments:", err));
    }
  }, [selectedPost]);

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

  const fetchLibrary = async () => {
    try {
      const res = await fetch("/api/library");
      if (res.ok) {
        const data = await res.json();
        setLibraryDocs(data);
      }
    } catch (err) {
      console.error("Error fetching library:", err);
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

  // Clear Entire Reading History
  const handleClearHistory = async () => {
    setCustomConfirm({
      title: "پاک کردن کل تاریخچه",
      message: "آیا از پاک کردن کامل تاریخچه مطالعات خود اطمینان دارید؟",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/student/history/${currentUser.id || currentUser._id}`, {
            method: "DELETE"
          });
          if (res.ok) {
            setReadingHistory([]);
            showToast("تاریخچه مطالعات شما با موفقیت پاک شد.");
          }
        } catch (err) {
          console.error(err);
        }
      }
    });
  };

  // Delete Individual History Item
  const handleDeleteHistoryItem = async (itemId: string) => {
    try {
      const res = await fetch(`/api/student/history/${currentUser.id || currentUser._id}/${itemId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        const data = await res.json();
        setReadingHistory(data.history || []);
        showToast("آیتم مورد نظر از تاریخچه حذف شد.");
      }
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
          showToast(`🎉 تبریک! دوره ${selectedCourse.title} را با موفقیت به پایان رساندید!`);
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
        showToast("ارزیابی شما با موفقیت ثبت شد.");
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

  // Submit Post Comment
  const handleSubmitPostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !postCommentText.trim()) return;
    setSubmittingPostComment(true);
    try {
      const res = await fetch(`/api/posts/${selectedPost._id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: currentUser.name,
          email: currentUser.email,
          text: postCommentText.trim(),
          role: "student"
        })
      });
      if (res.ok) {
        const data = await res.json();
        setPostComments(prev => [data.comment, ...prev]);
        setPostCommentText("");
        showToast("نظر شما با موفقیت ثبت شد.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingPostComment(false);
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
        showToast("پرسش بالینی شما با موفقیت ثبت شد.");
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

    if (newPassword && newPassword !== confirmPassword) {
      showToast("رمز عبور جدید با تایید آن مطابقت ندارد.");
      return;
    }

    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id || currentUser._id,
          name: profileName,
          email: profileEmail,
          oldPassword: oldPassword || undefined,
          newPassword: newPassword || undefined,
          profilePicture: profilePic
        })
      });
      if (res.ok) {
        setProfileSuccessMsg("اطلاعات حساب دکتری / دانشجویی شما با موفقیت در دیتابیس بروزرسانی شد.");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
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
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans" dir="rtl">
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

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <div className="md:w-72 shrink-0 h-full">
        <aside className={`fixed top-0 right-0 z-50 w-72 h-full bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 flex flex-col justify-between transition-transform duration-300 ${isMobileSidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"} overflow-hidden shadow-2xl md:shadow-none`}>
          <div className="flex flex-col h-full relative z-10">
            {/* Mobile Close Button */}
            <div className="md:hidden flex justify-end p-6 border-b border-slate-100 dark:border-slate-700/50">
              <button 
                onClick={() => setIsMobileSidebarOpen(false)}
                className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          {/* Logo Section */}
          <div className="p-8 flex items-center gap-4 border-b border-slate-100 dark:border-slate-700/50">
            <div className="w-12 h-12 bg-linear-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-slate-800 dark:text-white tracking-tight leading-none">{settings.siteName}</span>
              <span className="text-[10px] font-medium text-teal-600 mt-1 uppercase tracking-wider">سامانه مدیریت یادگیری</span>
            </div>
          </div>

          {/* Student Profile Card */}
          <div className="m-6 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex items-center gap-4 group cursor-pointer hover:bg-white dark:hover:bg-slate-800 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-slate-200 border-2 border-white dark:border-slate-800 overflow-hidden relative shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              <img 
                src={currentUser.profilePicture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"} 
                alt={currentUser.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{currentUser.name}</div>
              <div className="text-[10px] bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400 px-2 py-0.5 rounded-lg font-medium inline-block mt-1 uppercase">پنل کاربری دانشجویی</div>
            </div>
          </div>

          {/* Sidebar Menu */}
          <nav className="px-6 py-2 space-y-1.5 flex-1 overflow-y-auto custom-scrollbar">
            <div className="px-3 mb-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">اصلی</div>
            
            <button 
              onClick={() => { setActiveTab("dashboard"); setSelectedCourse(null); setSelectedPost(null); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer group ${activeTab === "dashboard" && !selectedCourse ? "bg-teal-600 text-white shadow-lg shadow-teal-600/20" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-teal-600"}`}
            >
              <Activity className={`w-5 h-5 ${activeTab === "dashboard" && !selectedCourse ? "text-white" : "group-hover:scale-110 transition-transform"}`} /> 
              داشبورد آکادمی
            </button>

            <button 
              onClick={() => { setActiveTab("courses"); setSelectedCourse(null); setSelectedPost(null); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer group ${activeTab === "courses" || selectedCourse ? "bg-teal-600 text-white shadow-lg shadow-teal-600/20" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-teal-600"}`}
            >
              <BookOpen className={`w-5 h-5 ${activeTab === "courses" || selectedCourse ? "text-white" : "group-hover:scale-110 transition-transform"}`} /> 
              دروس و دوره‌های من
            </button>

            <div className="px-3 mt-8 mb-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">کتابخانه شخصی</div>

            <button 
              onClick={() => { setActiveTab("bookmarks"); setSelectedCourse(null); setSelectedPost(null); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer group ${activeTab === "bookmarks" ? "bg-teal-600 text-white shadow-lg shadow-teal-600/20" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-teal-600"}`}
            >
              <Bookmark className={`w-5 h-5 ${activeTab === "bookmarks" ? "text-white" : "group-hover:scale-110 transition-transform"}`} /> 
              مقالات نشان‌شده
              <span className={`mr-auto text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === "bookmarks" ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-900 text-slate-500"}`}>{savedBookmarks.length}</span>
            </button>

            <button 
              onClick={() => { setActiveTab("history"); setSelectedCourse(null); setSelectedPost(null); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer group ${activeTab === "history" ? "bg-teal-600 text-white shadow-lg shadow-teal-600/20" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-teal-600"}`}
            >
              <Clock className={`w-5 h-5 ${activeTab === "history" ? "text-white" : "group-hover:scale-110 transition-transform"}`} /> 
              تاریخچه مطالعه
            </button>

            <button 
              onClick={() => { setActiveTab("library"); setSelectedCourse(null); setSelectedPost(null); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer group ${activeTab === "library" ? "bg-teal-600 text-white shadow-lg shadow-teal-600/20" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-teal-600"}`}
            >
              <Download className={`w-5 h-5 ${activeTab === "library" ? "text-white" : "group-hover:scale-110 transition-transform"}`} /> 
              کتابخانه فرم‌ها
            </button>

            <div className="px-3 mt-8 mb-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">تنظیمات</div>

            <button 
              onClick={() => { setActiveTab("profile"); setSelectedCourse(null); setSelectedPost(null); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer group ${activeTab === "profile" ? "bg-teal-600 text-white shadow-lg shadow-teal-600/20" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-teal-600"}`}
            >
              <User className={`w-5 h-5 ${activeTab === "profile" ? "text-white" : "group-hover:scale-110 transition-transform"}`} /> 
              تنظیمات پروفایل
            </button>
          </nav>
        </div>

        {/* Logout Section */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-700/50">
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-3 py-3.5 bg-rose-50 dark:bg-rose-900/10 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer group active:scale-95"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> خروج از سامانه
          </button>
        </div>
      </aside>
      </div>

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header bar */}
        <header className="h-20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 px-6 md:px-10 flex items-center justify-between shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 md:hidden bg-teal-50 dark:bg-teal-900/20 rounded-xl text-teal-600 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base md:text-lg font-extrabold text-slate-900 dark:text-white leading-tight">پلتفرم آموزش تخصصی دنتالفای</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">میز کار دانشجویی • نشست فعال</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5">
            {/* Notification Bell */}
            <div className="relative group">
              <button 
                onClick={markAllNotificationsRead}
                className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-900 hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded-xl relative cursor-pointer text-slate-600 dark:text-slate-300 transition-all duration-300 group/bell"
                title="نوتیفیکیشن‌ها"
              >
                <Bell className="w-5 h-5 group-hover/bell:rotate-12 transition-transform" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 text-white rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center text-[8px] font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification drop-down */}
              <div className="absolute left-0 sm:left-auto sm:-right-10 mt-2 w-72 sm:w-80 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50 p-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-2">
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200">نوتیفیکیشن‌های زنده</span>
                  <span className="text-[9px] text-slate-400">سیستم پیام‌رسانی هوشمند</span>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-2 text-right">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-[10px] text-slate-400 font-bold">هیچ اعلانی ندارید.</div>
                  ) : (
                    notifications.map((not) => (
                      <div key={not._id} className={`p-2.5 rounded-xl border transition-colors ${not.isRead ? "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-800" : "bg-teal-50/40 border-teal-50"}`}>
                        <div className="text-[10px] font-extrabold text-teal-800">{not.title}</div>
                        <p className="text-[9px] text-slate-500 mt-0.5 leading-relaxed font-medium">{not.content}</p>
                        <span className="text-[8px] text-slate-400 block mt-1 font-mono">{not.createdAt ? new Date(not.createdAt).toLocaleDateString("fa-IR") : "هم‌اکنون"}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button 
              onClick={onLogout}
              className="p-2 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded-xl text-rose-600 dark:text-rose-400 transition-colors cursor-pointer flex items-center justify-center"
              title="خروج از حساب"
            >
              <LogOut className="w-5 h-5" />
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
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:bg-slate-800 hover:bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
              >
                <ArrowRight className="w-4 h-4" /> بازگشت به دوره
              </button>

              <div className="bg-white dark:bg-slate-800 dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 md:p-8 space-y-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md">
                    {selectedCourse?.title}
                  </span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleToggleBookmark(selectedPost._id)}
                      className="p-2 hover:bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-teal-600 cursor-pointer transition-colors"
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
                  <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 leading-snug">{selectedPost.title}</h2>
                  {selectedPost.summary && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 border-r-4 border-teal-500 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-l-2xl leading-relaxed">
                      {selectedPost.summary}
                    </div>
                  )}
                </div>

                {/* Cover Image */}
                {selectedPost.coverImage && (
                  <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-80 bg-slate-100 flex items-center justify-center">
                    <img src={selectedPost.coverImage} className="w-full h-80 object-cover" alt="تصویر شاخص" referrerPolicy="no-referrer" />
                  </div>
                )}

                {/* Article blocks */}
                <div className="space-y-6 pt-4 text-xs leading-relaxed text-slate-700 dark:text-slate-200 font-medium">
                  {selectedPost.content && selectedPost.content.map((block) => (
                    <div key={block.id} className="space-y-2">
                      {block.type === "heading" && (
                        <h3 className="text-base font-black text-slate-800 dark:text-slate-100 border-r-4 border-teal-500 pr-2 pt-2">
                          {typeof block.value === 'object' ? (block.value?.text || block.value?.title || '') : block.value}
                        </h3>
                      )}
                      {block.type === "text" && (
                        <p className="text-xs leading-relaxed whitespace-pre-wrap">
                          {typeof block.value === 'object' ? (block.value?.text || '') : block.value}
                        </p>
                      )}
                      {block.type === "quote" && (
                        <div className="bg-teal-50/50 p-4 border border-teal-100 rounded-2xl italic flex flex-col gap-1 my-3">
                          <p className="text-teal-800">
                            «{typeof block.value === 'object' ? (block.value?.text || '') : block.value}»
                          </p>
                          <span className="text-[10px] text-teal-600 font-bold self-end">— {block.value?.author || "پزشک همکار دنتالفای"}</span>
                        </div>
                      )}
                      {block.type === "list" && (
                        <ul className="list-disc pr-6 space-y-1.5 text-xs">
                          {(Array.isArray(block.value?.items) 
                            ? block.value.items 
                            : Array.isArray(block.value) 
                              ? block.value 
                              : typeof block.value === 'string' 
                                ? block.value.split('\n') 
                                : []
                          ).map((item: string, idx: number) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      )}
                      {block.type === "divider" && (
                        <hr className="border-slate-100 dark:border-slate-800 my-4" />
                      )}
                      {block.type === "image" && (
                        <div className="my-4 space-y-1.5">
                          <img src={block.value?.url || block.value} alt={block.value?.caption} className="rounded-xl border border-slate-100 dark:border-slate-800 mx-auto max-h-72 object-cover" />
                          {block.value?.caption && <span className="text-[10px] text-slate-400 text-center block">{block.value.caption}</span>}
                        </div>
                      )}
                      {block.type === "video" && (
                        <div className="my-4 aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-black">
                          <iframe src={block.value?.url || block.value} className="w-full h-full" frameBorder="0" allowFullScreen></iframe>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* POST COMMENTS SECTION (DISCUSSION) */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-teal-600" />
                  بحث و تبادل نظر در مورد این درس ({postComments.length})
                </h3>

                {/* Comment Form */}
                <form onSubmit={handleSubmitPostComment} className="relative z-10">
                  <div className="relative">
                    <textarea 
                      value={postCommentText} 
                      onChange={(e) => setPostCommentText(e.target.value)} 
                      placeholder="سوال، بازخورد یا ابهام علمی خود درباره این درس را بنویسید..." 
                      className="w-full p-4 pb-14 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs focus:outline-none focus:border-teal-500 transition-all resize-none min-h-[120px] font-medium"
                      required
                    />
                    <div className="absolute bottom-3 left-3">
                      <button 
                        type="submit"
                        disabled={submittingPostComment}
                        className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-[10px] font-black transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-lg shadow-teal-600/20 active:scale-95"
                      >
                        <Send className="w-3.5 h-3.5" /> ثبت نظر
                      </button>
                    </div>
                  </div>
                </form>

                {/* Comments List */}
                <div className="space-y-4 pt-2">
                  {postComments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 opacity-60">
                      <MessageSquare className="w-8 h-8 text-slate-300 mb-2" />
                      <p className="text-[10px] text-slate-500 font-bold text-center">هنوز نظری ثبت نشده است. اولین نفری باشید که نظر می‌دهد!</p>
                    </div>
                  ) : (
                    postComments.map((comment) => (
                      <div key={comment._id} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-400 flex items-center justify-center font-extrabold text-[10px]">
                              {comment.name[0]}
                            </div>
                            <div>
                              <h5 className="font-extrabold text-[10px] text-slate-700 dark:text-slate-200">{comment.name}</h5>
                              <span className="text-[8px] text-slate-400 font-mono">{new Date(comment.createdAt).toLocaleDateString("fa-IR")}</span>
                            </div>
                          </div>
                          {comment.role !== "public" && (
                            <span className="text-[8px] font-bold px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400">
                              {comment.role === "admin" ? "مدیر علمی" : comment.role === "student" ? "دانشجو" : "نویسنده"}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 pr-9 leading-relaxed whitespace-pre-line">{comment.text}</p>
                        
                        {comment.reply && (
                          <div className="mt-2 mr-9 p-3 bg-teal-50/40 dark:bg-teal-900/10 border border-teal-100/50 dark:border-teal-900/30 rounded-xl space-y-1.5">
                            <div className="flex items-center gap-1.5 text-[9px] font-bold text-teal-800 dark:text-teal-400">
                              <CornerDownLeft className="w-3.5 h-3.5" />
                              <span>پاسخ از {comment.repliedBy || "مدیر علمی"}:</span>
                            </div>
                            <p className="text-[11px] text-teal-900/80 dark:text-teal-100/70 leading-relaxed font-medium">{comment.reply}</p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : selectedCourse ? (
            /* --- COURSE DETAILED STUDY & WORKSPACE VIEW --- */
            <div className="space-y-8 max-w-5xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <button 
                  onClick={() => { setSelectedCourse(null); setQuizState("idle"); }}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:bg-slate-800 hover:bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                >
                  <ArrowRight className="w-4 h-4" /> بازگشت به دوره‌ها
                </button>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-teal-50 text-teal-700 text-[10px] font-black rounded-full">پیشرفت شما: {coursePercentage}%</span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 dark:text-slate-300 text-[10px] font-bold rounded-full">{coursePosts.length} مقاله علمی</span>
                </div>
              </div>

              {/* Course Bento Header Banner */}
              <div className="bg-gradient-to-r from-teal-800 to-slate-950 p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row justify-between gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                <div className="space-y-3 relative z-10">
                  <h2 className="text-2xl font-extrabold">{selectedCourse.title}</h2>
                  <p className="text-teal-100 text-[11px] max-w-2xl leading-relaxed font-medium">{selectedCourse.description}</p>
                  
                  {/* Progress bar */}
                  <div className="pt-4 space-y-2 max-w-md">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-teal-200">وضعیت پیشروی آموزشی</span>
                      <span>{coursePercentage}% کامل شده</span>
                    </div>
                    <div className="w-full h-2 bg-white/15 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-400 transition-all duration-500 shadow-[0_0_8px_rgba(45,212,191,0.6)]" style={{ width: `${coursePercentage}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* Right Area: Certificate Claim or Exam */}
                <div className="shrink-0 flex flex-col justify-center items-stretch sm:items-end gap-3 relative z-10 border-t md:border-t-0 md:border-r border-white/10 pt-4 md:pt-0 md:pr-6 min-w-[200px]">
                  {coursePercentage === 100 ? (
                    <div className="text-center sm:text-right space-y-2">
                      <div className="text-teal-300 font-bold text-xs flex items-center gap-1.5 justify-center sm:justify-start">
                        <Award className="w-4.5 h-4.5 animate-bounce" /> دوره تکمیل شد!
                      </div>
                      <span className="text-[10px] text-slate-300 block font-medium">شما مجاز به دانلود سرتیفیکیت هستید.</span>
                    </div>
                  ) : (
                    <div className="text-center sm:text-right space-y-1">
                      <div className="text-[10px] text-teal-200 font-bold">پیش‌نیاز آزمون نهایی:</div>
                      <div className="text-[11px] text-white font-medium">مطالعه تمام مقالات دوره</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Course Main Hub: 2 Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left side: Articles and Quiz */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Articles section */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4 shadow-sm">
                    <h3 className="font-bold text-xs text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                      <ListTodo className="w-4.5 h-4.5 text-teal-600" />
                      فهرست مقالات و دروس این دوره تخصصی
                    </h3>

                    <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                      {coursePosts.length === 0 ? (
                        <div className="p-8 text-center text-xs text-slate-400 font-bold">هیچ درسی هنوز برای این دوره منتشر نشده است.</div>
                      ) : (
                        coursePosts.map((post) => (
                          <div 
                            key={post._id}
                            className="py-4 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 px-2 rounded-xl transition-colors cursor-pointer"
                            onClick={() => { setSelectedPost(post); handleAddToHistory(post._id, post.title); }}
                          >
                            <div className="space-y-1 overflow-hidden">
                              <h4 className="font-bold text-xs text-slate-700 dark:text-slate-200 truncate hover:text-teal-600 transition-colors">{post.title}</h4>
                              <p className="text-[10px] text-slate-400 font-medium line-clamp-1">{post.summary || "تجربه عملی و ابزارهای مورد استفاده..."}</p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {completedLessons.includes(post._id) ? (
                                <span className="text-[9px] bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                                  <CheckCircle className="w-3.5 h-3.5" /> خوانده شده
                                </span>
                              ) : (
                                <span className="text-[9px] bg-slate-100 dark:bg-slate-900 text-slate-400 px-2.5 py-1 rounded-full font-bold">در انتظار مطالعه</span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Smart Exam Block */}
                  <div className="bg-gradient-to-l from-sky-500/5 to-teal-500/5 border border-teal-500/20 rounded-2xl p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-teal-600/20">
                          <Sparkles className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">آزمون تخصصی هوشمند دکتری دندانپزشکی</h4>
                          <p className="text-[10px] text-slate-400 font-medium">سیستم ارزش‌سنجی تولید شده با هوش مصنوعی</p>
                        </div>
                      </div>

                      {/* AI generate button if no quiz or as refresh */}
                      <button 
                        onClick={handleGenerateSmartQuiz}
                        disabled={isGeneratingQuiz}
                        className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-50 text-teal-700 hover:text-teal-800 text-[10px] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                      >
                        {isGeneratingQuiz ? "در حال تالیف آزمون..." : "تألیف هوشمند آزمون جدید"}
                      </button>
                    </div>

                    {quizState === "idle" || quizState === "intro" ? (
                      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800 p-5 space-y-4 text-center">
                        <HelpCircle className="w-10 h-10 text-teal-500 mx-auto" />
                        {activeQuiz ? (
                          <div className="space-y-3">
                            <h5 className="font-bold text-xs text-slate-800 dark:text-slate-100">آزمون دکتری دوره "{selectedCourse.title}" آماده است!</h5>
                            <p className="text-[10px] text-slate-400 font-medium leading-relaxed max-w-md mx-auto">
                              شامل {activeQuiz?.questions?.length || 0} سوال تستی و تخصصی. کسب نمره {activeQuiz?.passingPercentage || 70}٪ برای قبولی در این آزمون الزامی است.
                            </p>
                            <button 
                              onClick={handleStartQuiz}
                              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-teal-600/20 cursor-pointer inline-block active:scale-95"
                            >
                              شروع رقابت علمی / آزمون
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <h5 className="font-bold text-xs text-slate-800 dark:text-slate-100">هنوز آزمونی برای این دوره تالیف نشده است</h5>
                            <p className="text-[10px] text-slate-400 font-medium">شما می‌توانید با دکمه بالا درخواست تالیف فوری آزمون توسط هوش مصنوعی دنتالفای را صادر کنید.</p>
                          </div>
                        )}
                      </div>
                    ) : (quizState === "running" && activeQuiz && activeQuiz.questions && activeQuiz.questions[quizCurrentIndex]) ? (
                      /* --- QUIZ ACTIVE PLAYING --- */
                      <div className="bg-white dark:bg-slate-800 dark:bg-slate-800 rounded-xl border border-teal-500/20 p-5 space-y-4">
                        <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800 pb-2">
                          <span>سوال {quizCurrentIndex + 1} از {activeQuiz?.questions?.length || 0}</span>
                          <span className="text-teal-600">آزمون آکادمیک</span>
                        </div>

                        <p className="text-xs font-bold text-slate-800 dark:text-slate-100 pt-2">{activeQuiz.questions[quizCurrentIndex].questionText}</p>

                        <div className="space-y-2 pt-2">
                          {(activeQuiz.questions[quizCurrentIndex].options || []).map((opt, oIdx) => (
                            <button 
                              key={oIdx}
                              onClick={() => handleSelectQuizOption(oIdx)}
                              className={`w-full text-right p-3 rounded-xl border text-xs font-semibold transition-all flex justify-between items-center cursor-pointer ${
                                quizAnswers[quizCurrentIndex] === oIdx
                                  ? "bg-teal-50/50 border-teal-500 text-teal-800"
                                  : "bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                              }`}
                            >
                              <span>{oIdx + 1}. {opt}</span>
                              {quizAnswers[quizCurrentIndex] === oIdx && <div className="w-2 h-2 bg-teal-500 rounded-full"></div>}
                            </button>
                          ))}
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                          <button 
                            disabled={quizCurrentIndex === 0}
                            onClick={() => setQuizCurrentIndex(prev => prev - 1)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 rounded-lg text-[10px] font-bold cursor-pointer"
                          >
                            سوال قبلی
                          </button>

                          {quizCurrentIndex === (activeQuiz?.questions?.length || 0) - 1 ? (
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
                      <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-10 text-center space-y-6 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-teal-500 to-emerald-500"></div>
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${quizScore >= (activeQuiz?.passingPercentage || 70) ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" : "bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400"} group-hover:scale-110 transition-transform duration-500`}>
                          <Award className="w-10 h-10" />
                        </div>
                        <div className="space-y-2">
                          <h5 className="font-black text-xl text-slate-800 dark:text-white">نتیجه ارزیابی بالینی شما</h5>
                          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Digital Assessment Outcome</p>
                        </div>
                        <div className="text-5xl font-black font-mono tracking-tighter">
                          <span className={quizScore >= (activeQuiz?.passingPercentage || 70) ? "text-emerald-600" : "text-rose-500"}>{quizScore}٪</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 max-w-sm mx-auto">
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-bold">
                            {quizScore >= (activeQuiz?.passingPercentage || 70)
                              ? `تبریک! شما با کسب امتیاز عالی، حد قبولی (${activeQuiz?.passingPercentage}٪) این دوره را با موفقیت پشت سر گذاشتید.`
                              : `متاسفانه حد نصاب قبولی در این آزمون (${activeQuiz?.passingPercentage}٪) را کسب نکردید. لطفاً مجدداً مطالعه کرده و شرکت کنید.`}
                          </p>
                        </div>
                        <div className="flex gap-4 justify-center">
                          <button 
                            onClick={handleStartQuiz}
                            className="px-8 py-3.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-100 rounded-2xl text-xs font-black transition-all cursor-pointer border border-slate-200 dark:border-slate-600 active:scale-95"
                          >
                            تلاش مجدد
                          </button>
                          <button 
                            onClick={() => setQuizState("idle")}
                            className="px-8 py-3.5 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl text-xs font-black transition-all cursor-pointer shadow-lg shadow-teal-600/20 active:scale-95"
                          >
                            تایید و بازگشت
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right side: Clinical Certificates QnA and Ratings */}
                <div className="space-y-8">
                  {/* Study QA Board - ENHANCED */}
                  <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-900/20 rounded-full blur-3xl -translate-y-10 translate-x-10 pointer-events-none group-hover:scale-125 transition-transform duration-700"></div>
                    <div className="relative z-10 flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner">
                          <MessageSquare className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-black text-sm text-slate-800 dark:text-slate-100">تالار پرسش و پاسخ بالینی</h3>
                          <span className="text-[10px] font-bold text-slate-400 tracking-wider">بحث و تبادل نظر با اساتید (Q&A)</span>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-[10px] font-black rounded-full border border-indigo-100 dark:border-indigo-800">
                        {courseQnas.length} پرسش
                      </span>
                    </div>

                    <form onSubmit={handleSubmitQna} className="relative z-10">
                      <div className="relative">
                        <textarea 
                          value={newQnaQuestion}
                          onChange={(e) => setNewQnaQuestion(e.target.value)}
                          placeholder="سوال بالینی یا ابهام علمی خود را دقیق مطرح کنید..."
                          rows={3}
                          className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none shadow-inner"
                          required
                        />
                        <button 
                          type="submit"
                          disabled={submittingQna}
                          className="absolute bottom-3 left-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95"
                        >
                          <Send className="w-3.5 h-3.5" /> ثبت پرسش
                        </button>
                      </div>
                    </form>

                    <div className="max-h-[350px] overflow-y-auto space-y-4 pt-2 relative z-10 pr-2 custom-scrollbar">
                      {courseQnas.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 opacity-60">
                          <HelpCircle className="w-12 h-12 text-slate-300 mb-3" />
                          <p className="text-xs text-slate-500 font-bold text-center">اولین نفری باشید که در این سرفصل سوال می‌پرسد!</p>
                        </div>
                      ) : (
                        courseQnas.map((qna, idx) => (
                          <div key={idx} className="group/qna bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3 text-right hover:border-indigo-200 dark:hover:border-indigo-800/50 hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-sm">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                  <User className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                                </div>
                                <span className="text-[10px] font-black text-slate-600 dark:text-slate-300">{qna.studentName}</span>
                              </div>
                              <span className="text-[8px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">پرسش دانشجویی</span>
                            </div>
                            <p className="text-xs text-slate-800 dark:text-slate-200 font-bold leading-relaxed pr-8">
                              {qna.question}
                            </p>
                            {qna.answer ? (
                              <div className="relative mt-4 pl-4 border-r-4 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10 p-4 rounded-xl rounded-tr-none text-right">
                                <div className="absolute top-0 right-[-6px] w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-slate-800"></div>
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                                    <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                  </div>
                                  <strong className="text-[10px] font-black text-emerald-700 dark:text-emerald-400">پاسخ استاد: {qna.repliedBy}</strong>
                                </div>
                                <p className="text-xs text-emerald-900 dark:text-emerald-100/80 leading-relaxed font-medium">
                                  {qna.answer}
                                </p>
                              </div>
                            ) : (
                              <div className="mt-4 flex items-center gap-2 text-[9px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-lg w-max">
                                <Clock className="w-3.5 h-3.5" /> منتظر بررسی و پاسخ اساتید
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  {/* Course Reviews */}
                  <div className="bg-white dark:bg-slate-800 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4 shadow-sm">
                    <h3 className="font-extrabold text-xs text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
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
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-medium focus:outline-none focus:border-teal-500 transition-all"
                        required
                      />

                      <button 
                        type="submit"
                        disabled={submittingReview}
                        className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-[10px] font-bold rounded-xl cursor-pointer shadow-lg shadow-teal-600/10 active:scale-95 transition-all"
                      >
                        ثبت نمره و نظر
                      </button>
                    </form>

                    <div className="max-h-60 overflow-y-auto space-y-2.5 pt-2">
                      {courseReviews.length === 0 ? (
                        <p className="text-[10px] text-slate-400 font-bold text-center">هنوز نظری ثبت نشده است.</p>
                      ) : (
                        courseReviews.map((rev, idx) => (
                          <div key={idx} className="p-2.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-bold text-slate-700 dark:text-slate-200">{rev.studentName}</span>
                              <div className="flex gap-0.5 scale-75 origin-left">
                                {Array.from({ length: 5 }).map((_, sI) => (
                                  <Star key={sI} className={`w-3.5 h-3.5 ${sI < rev.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
                                ))}
                              </div>
                            </div>
                            <p className="text-[9px] text-slate-500 italic font-medium leading-relaxed">{rev.comment}</p>
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
                <div 
                  onClick={() => setActiveTab("courses")}
                  className="bg-white dark:bg-slate-800 dark:bg-slate-800 p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4 relative overflow-hidden cursor-pointer hover:border-teal-500/40 transition-all group"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-xl"></div>
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">کل دروس دانشگاهی</span>
                    <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{siteStats?.coursesCount || (courses || []).length} درس مرجع</h3>
                  </div>
                </div>

                <div 
                  onClick={() => setActiveTab("library")}
                  className="bg-white dark:bg-slate-800 p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4 relative overflow-hidden cursor-pointer hover:border-sky-500/40 transition-all group"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-xl"></div>
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">مقالات بالینی معتبر</span>
                    <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{siteStats?.postsCount || 4} مقاله دندانپزشکی</h3>
                  </div>
                </div>

                <div 
                  onClick={() => setActiveTab("profile")}
                  className="bg-white dark:bg-slate-800 p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4 relative overflow-hidden sm:col-span-2 lg:col-span-1 cursor-pointer hover:border-emerald-500/40 transition-all group"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl"></div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">نویسندگان علمی فعال</span>
                    <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{siteStats?.authorsCount || 2} متخصص عالی‌رتبه</h3>
                  </div>
                </div>
              </div>

              {/* Grid: Courses Selection & Recent history */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Courses list */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="font-extrabold text-xs text-slate-800 dark:text-slate-100">انتخاب درس تخصصی جهت مطالعه بالینی</h3>
                    <span className="text-[9px] text-slate-400">سرفصل مصوب دوره دکتری عمومی</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {(courses || []).map((course) => (
                      <div 
                        key={course._id}
                        onClick={() => setSelectedCourse(course)}
                        className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-teal-500/40 shadow-sm hover:shadow-lg transition-all cursor-pointer space-y-3 text-right group"
                      >
                        <span className="px-2 py-0.5 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 text-[9px] font-bold rounded">سرفصل دکتری عمومی</span>
                        <h4 className="font-extrabold text-sm text-slate-800 dark:text-white group-hover:text-teal-600 transition-colors leading-tight">{course.title}</h4>
                        <p className="text-[10px] text-slate-400 font-medium leading-relaxed line-clamp-2">{course.description}</p>
                        
                        <div className="pt-2 border-t border-slate-50 dark:border-slate-700/50 flex justify-between items-center text-[10px] text-slate-500 font-bold">
                          <span className="font-medium">مشاهده درس</span>
                          <span className="text-teal-600 flex items-center gap-1 group-hover:translate-x-[-4px] transition-transform">مطالعه بالینی ←</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Study History sidebar */}
                <div className="space-y-4">
                  <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="font-bold text-xs text-slate-800 dark:text-slate-100">آخرین مقالات مطالعه شده شما</h3>
                  </div>

                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-3 shadow-sm">
                    {(!readingHistory || readingHistory.length === 0) ? (
                      <div className="p-8 text-center text-[10px] text-slate-400 font-bold">هنوز مقاله‌ای را مطالعه نکرده‌اید.</div>
                    ) : (
                      (readingHistory || []).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 py-2 border-b border-slate-50 dark:border-slate-700 last:border-0 overflow-hidden text-right">
                          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                          <div className="overflow-hidden">
                            <h5 className="font-bold text-[10px] text-slate-700 dark:text-slate-200 truncate">{item.title}</h5>
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
            <div className="space-y-8 animate-fade-in">
              <div className="relative overflow-hidden bg-gradient-to-l from-teal-600 to-indigo-700 p-8 sm:p-10 rounded-[2rem] shadow-xl text-right">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full translate-x-20 -translate-y-20 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400/20 blur-2xl rounded-full -translate-x-10 translate-y-10 pointer-events-none"></div>
                <div className="relative z-10 space-y-4 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full backdrop-blur-md text-white">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-[10px] font-extrabold tracking-wider">دانشکده مجازی</span>
                  </div>
                  <h3 className="font-black text-2xl sm:text-3xl text-white leading-tight">دروس مرجع و سرفصل‌های دانشگاهی</h3>
                  <p className="text-teal-50 text-xs sm:text-sm leading-relaxed font-medium opacity-90">
                    در این بخش لیست کامل دروس آکادمیک برای شما فهرست شده است. با کلیک بر روی هر دوره به مقالات بالینی تخصصی، آزمون تستی هوش مصنوعی و امکان تبادل نظر با اساتید دسترسی خواهید داشت.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {(courses || []).map((course, idx) => {
                  const gradientColors = [
                    "from-blue-500/10 to-indigo-500/5",
                    "from-teal-500/10 to-emerald-500/5",
                    "from-purple-500/10 to-pink-500/5",
                    "from-orange-500/10 to-amber-500/5",
                    "from-rose-500/10 to-red-500/5",
                    "from-cyan-500/10 to-sky-500/5",
                  ];
                  const iconColors = [
                    "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30",
                    "text-teal-600 dark:text-teal-400 bg-teal-100 dark:bg-teal-900/30",
                    "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30",
                    "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30",
                    "text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/30",
                    "text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-900/30",
                  ];
                  
                  const bgClass = gradientColors[idx % gradientColors.length];
                  const iconClass = iconColors[idx % iconColors.length];

                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={course._id}
                      onClick={() => setSelectedCourse(course)}
                      className="group bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer text-right flex flex-col justify-between overflow-hidden relative"
                    >
                      <div className={`absolute top-0 right-0 w-full h-32 bg-gradient-to-b ${bgClass} opacity-50 group-hover:opacity-100 transition-opacity`}></div>
                      
                      <div className="p-6 relative z-10 space-y-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-start">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconClass} shadow-inner`}>
                            <BookOpen className="w-6 h-6" />
                          </div>
                          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 text-[10px] font-extrabold rounded-full">
                            {course.syllabus?.length || 0} سرفصل
                          </span>
                        </div>
                        
                        <div className="space-y-3 flex-1">
                          <h4 className="font-black text-lg text-slate-800 dark:text-white group-hover:text-teal-600 transition-colors leading-tight">{course.title}</h4>
                          <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed line-clamp-3 font-medium">{course.description}</p>
                        </div>
                      </div>

                      <div className="p-6 pt-0 relative z-10">
                        <div className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl group-hover:bg-teal-50 dark:group-hover:bg-teal-900/20 transition-colors">
                          <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 group-hover:text-teal-700 dark:group-hover:text-teal-300">ورود به کلاس بالینی</span>
                          <div className="w-6 h-6 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                            <ArrowRight className="w-3 h-3 text-teal-600" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ) : activeTab === "bookmarks" ? (
            /* --- BOOKMARKS CATALOGUE TAB --- */
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2 text-right">
                <h3 className="font-bold text-xs text-slate-800 dark:text-slate-100 border-r-4 border-teal-500 pr-2">آرشیو مقالات و جراحی‌های نشان‌گذاری شده</h3>
                <p className="text-slate-400 text-[10px] font-medium">مقالاتی که برای دسترسی سریع‌تر نشان کرده‌اید در این بخش طبقه‌بندی شده‌اند تا در زمان جراحی یا مطب به آسانی آنها را مطالعه نمایید.</p>
              </div>

              {savedBookmarks.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-16 text-center shadow-sm">
                  <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h4 className="font-bold text-slate-600 dark:text-slate-300 text-xs">هیچ مقاله‌ای نشان‌گذاری نشده است</h4>
                  <p className="text-slate-400 text-[10px] mt-1 font-medium">با کلیک روی آیکون بوکمارک در داخل صفحات دروس، مقالات دلخواه خود را در این بخش ذخیره کنید.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedBookmarks.map((post) => (
                    <div 
                      key={post._id}
                      onClick={() => { setSelectedPost(post); handleAddToHistory(post._id, post.title); }}
                      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-3 cursor-pointer hover:border-teal-500/40 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
                    >
                      <div className="space-y-2 text-right">
                        <span className="text-[8px] font-bold text-teal-600 bg-teal-50 dark:bg-teal-900/20 px-2 py-0.5 rounded">مقاله علمی</span>
                        <h4 className="font-extrabold text-sm text-slate-800 dark:text-white group-hover:text-teal-600 transition-colors line-clamp-2 leading-relaxed">{post.title}</h4>
                      </div>

                      <div className="pt-3 border-t border-slate-50 dark:border-slate-700/50 flex justify-between items-center text-[10px] font-bold text-slate-500">
                        <span className="text-teal-600 flex items-center gap-1 group-hover:translate-x-[-4px] transition-transform">ادامه مطلب ←</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleBookmark(post._id);
                          }}
                          className="p-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 rounded-lg text-slate-400 transition-colors cursor-pointer"
                          title="حذف از نشان‌شده‌ها"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : activeTab === "history" ? (
            /* --- READING HISTORY RECORDS TAB --- */
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-right">
                <div className="space-y-2">
                  <h3 className="font-bold text-xs text-slate-800 dark:text-slate-100 border-r-4 border-teal-500 pr-2">تاریخچه کامل مطالعات بالینی</h3>
                  <p className="text-slate-400 text-[10px] font-medium">آخرین مقالات، جراحی‌ها و مباحث مرجعی که اخیراً مورد مطالعه قرار داده‌اید به ترتیب بازدید در زیر ذخیره شده‌اند.</p>
                </div>
                {readingHistory.length > 0 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleClearHistory(); }}
                    className="px-3.5 py-2 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white rounded-xl text-[10px] font-bold cursor-pointer transition-all border border-rose-100 dark:border-rose-900/40 shrink-0 flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>پاک کردن کل تاریخچه</span>
                  </button>
                )}
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                  {(!readingHistory || readingHistory.length === 0) ? (
                    <div className="p-12 text-center text-xs text-slate-400 font-bold">تاریخچه مطالعات شما خالی است.</div>
                  ) : (
                    (readingHistory || []).map((item, idx) => (
                      <div 
                        key={idx} 
                        className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer group"
                        onClick={() => {
                          const post = (posts || []).find(p => p._id === item.itemId || p._id === item.id);
                          if (post) setSelectedPost(post);
                        }}
                      >
                        <div className="flex items-center gap-3 text-right">
                          <Clock className="w-4.5 h-4.5 text-teal-600 shrink-0" />
                          <div>
                            <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100 group-hover:text-teal-600 transition-colors">{item.title}</h4>
                            <span className="text-[8px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded font-bold uppercase mt-0.5 inline-block">مقاله دندانپزشکی</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-[9px] text-slate-400 font-mono font-medium">{new Date(item.visitedAt).toLocaleDateString("fa-IR")} - {new Date(item.visitedAt).toLocaleTimeString("fa-IR", {hour: '2-digit', minute:'2-digit'})}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteHistoryItem(item.itemId || item.id);
                            }}
                            className="p-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 rounded-lg text-slate-400 transition-colors cursor-pointer"
                            title="حذف از تاریخچه"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : activeTab === "library" ? (
            /* --- LIBRARY TAB --- */
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/10 dark:shadow-none space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/20 text-white">
                    <Download className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-800 dark:text-white leading-tight">کتابخانه فرم‌های بالینی و اسناد مطب</h3>
                    <p className="text-[10px] text-slate-400 font-bold italic leading-tight">دسترسی به اسناد قانونی و تخصصی دندانپزشکی</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {libraryDocs.length === 0 ? (
                    <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
                      <p className="text-xs text-slate-400 font-bold italic">هیچ سندی در کتابخانه یافت نشد.</p>
                    </div>
                  ) : (
                    libraryDocs.map((doc) => (
                      <div 
                        key={doc._id}
                        className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between group hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 text-teal-500 flex items-center justify-center shadow-sm group-hover:bg-teal-500 group-hover:text-white transition-colors">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-xs text-slate-700 dark:text-slate-100">{doc.title}</h4>
                            <span className="text-[9px] text-slate-400 font-mono font-bold">{doc.size || "1.0 MB"} • PDF Format</span>
                          </div>
                        </div>
                        <a 
                          href={doc.file}
                          download={`${doc.title}.pdf`}
                          className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center hover:bg-teal-600 hover:text-white transition-all cursor-pointer shadow-sm active:scale-90"
                        >
                          <Download className="w-4.5 h-4.5" />
                        </a>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* --- PROFILE TAB --- */
            <div className="max-w-xl bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-6 text-right">
              <h3 className="font-bold text-xs text-slate-800 dark:text-slate-100 border-r-4 border-teal-500 pr-2">تنظیمات کاربری و دفتری دانشجو</h3>
              
              <form onSubmit={handleProfileUpdate} className="space-y-5 text-xs text-right font-medium">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500">نام و نام خانوادگی</label>
                    <input 
                      type="text" 
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-teal-500 transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500">شماره همراه (OTP ثبت شده)</label>
                    <input 
                      type="text" 
                      value={profilePhone}
                      disabled
                      className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 font-mono text-center"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500">جنسیت</label>
                  <select
                    value={profileGender}
                    onChange={(e) => setProfileGender(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="">نامشخص</option>
                    <option value="male">آقا</option>
                    <option value="female">خانم</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500">آدرس ایمیل</label>
                  <input 
                    type="email" 
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-left"
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
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-left"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500">رمز عبور فعلی (جهت تایید هویت)</label>
                  <input 
                    type="password" 
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="رمز عبور فعلی خود را وارد کنید..."
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500">رمز عبور جدید</label>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="رمز جدید را وارد کنید..."
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500">تکرار رمز عبور جدید</label>
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="رمز جدید را مجدداً وارد کنید..."
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                {profileSuccessMsg && (
                  <div className="p-3 bg-teal-50 text-teal-700 rounded-xl text-[10px] font-bold text-center">
                    {profileSuccessMsg}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    type="submit"
                    className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-xl transition-all cursor-pointer shadow-md"
                  >
                    ذخیره اطلاعات من
                  </button>
                  <button 
                    type="button"
                    onClick={onLogout}
                    className="flex-1 py-2.5 bg-rose-50 dark:bg-rose-900/10 hover:bg-rose-100 dark:hover:bg-rose-900/20 text-rose-600 font-extrabold rounded-xl transition-all cursor-pointer border border-rose-100 dark:border-rose-900/30"
                  >
                    خروج از حساب
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer branding of Student Panel */}
        <footer className="h-12 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-8 flex items-center justify-between shrink-0 text-[10px] text-slate-400 font-semibold uppercase tracking-widest">
          <span>Dentalfy Student Center Terminal</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span> ONLINE SECURE SESSION
          </span>
        </footer>
      </main>

      {/* Custom Confirmation Modal */}
      {customConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" style={{ direction: "rtl" }}>
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 p-8 max-w-sm w-full text-center space-y-6 shadow-2xl">
            <div className="w-12 h-12 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center mx-auto shadow-md">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-white leading-tight">{customConfirm.title}</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{customConfirm.message}</p>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setCustomConfirm(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer"
              >
                انصراف
              </button>
              <button
                onClick={async () => {
                  const onConfirm = customConfirm.onConfirm;
                  setCustomConfirm(null);
                  await onConfirm();
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold transition-colors cursor-pointer shadow-md shadow-rose-600/20"
              >
                بله، انجام شود
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
