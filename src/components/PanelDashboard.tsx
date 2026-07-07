import React, { useState, useEffect } from "react";
import { 
  Shield, BookOpen, FileText, Users, Settings, LogOut, Menu, X, 
  PlusCircle, Trash2, CheckCircle, XCircle, ChevronLeft, ChevronUp, ChevronDown, 
  Upload, Download, HelpCircle, Lock, User, RefreshCw, Eye, MessageSquare, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { IUser, ICourse, IPost, ISiteSettings, IAccountRequest, IBlock, ILibraryDoc, IComment, IFAQ } from "../types";

interface PanelDashboardProps {
  currentUser: IUser;
  settings: ISiteSettings;
  courses: ICourse[];
  posts: IPost[];
  onLogout: () => void;
  onRefreshData: () => void;
}

export function PanelDashboard({ currentUser, settings, courses, posts, onLogout, onRefreshData }: PanelDashboardProps) {
  const isAdmin = currentUser.role === "admin";
  const [activeTab, setActiveTab] = useState<"dashboard" | "posts" | "courses" | "requests" | "siteSettings" | "profile" | "comments" | "libraryAndFaqs">("dashboard");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);


  // Dynamic resources states
  const [allComments, setAllComments] = useState<IComment[]>([]);
  const [allLibraryDocs, setAllLibraryDocs] = useState<ILibraryDoc[]>([]);
  const [allFaqs, setAllFaqs] = useState<IFAQ[]>([]);
  const [replyCommentId, setReplyCommentId] = useState<string | null>(null);
  const [replyTextInput, setReplyTextInput] = useState("");
  const [newLibraryTitle, setNewLibraryTitle] = useState("");
  const [newLibraryFile, setNewLibraryFile] = useState("");
  const [newLibrarySize, setNewLibrarySize] = useState("");
  const [newFaqQuestion, setNewFaqQuestion] = useState("");
  const [newFaqAnswer, setNewFaqAnswer] = useState("");

  // Local lists
  const [allRequests, setAllRequests] = useState<IAccountRequest[]>([]);
  const [resetRequests, setResetRequests] = useState<IUser[]>([]);
  const [allPosts, setAllPosts] = useState<IPost[]>(posts);
  const [allCourses, setAllCourses] = useState<ICourse[]>(courses);

  // Site Settings inputs (Admin)
  const [siteNameInput, setSiteNameInput] = useState(settings.siteName || "");
  const [heroTextInput, setHeroTextInput] = useState(settings.heroText || "");
  const [contactEmailInput, setContactEmailInput] = useState(settings.contactEmail || "");
  const [adminRecoveryCodeInput, setAdminRecoveryCodeInput] = useState(settings.adminRecoveryCode || "");
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [primaryColorInput, setPrimaryColorInput] = useState(settings.colorTheme?.primary || "#14b8a6");
  const [secondaryColorInput, setSecondaryColorInput] = useState(settings.colorTheme?.secondary || "#0d9488");
  const [clinicalBlueInput, setClinicalBlueInput] = useState(settings.colorTheme?.clinicalBlue || "#0284c7");

  // Profile Settings inputs
  const [profilePicBase64, setProfilePicBase64] = useState(currentUser.profilePicture || "");
  const [profileNameInput, setProfileNameInput] = useState(currentUser.name || "");
  const [profileEmailInput, setProfileEmailInput] = useState(currentUser.email || "");
  const [profilePicLinkInput, setProfilePicLinkInput] = useState("");
  const [profilePasswordInput, setProfilePasswordInput] = useState("");
  const [profileMsg, setProfileMsg] = useState<string | null>(null);

  // Block Editor states
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [postTitle, setPostTitle] = useState("");
  const [postCourseId, setPostCourseId] = useState("");
  const [postBlocks, setPostBlocks] = useState<IBlock[]>([]);
  const [postTags, setPostTags] = useState("");
  const [postSummary, setPostSummary] = useState("");
  const [postCoverImage, setPostCoverImage] = useState("");
  const [editorActiveSubTab, setEditorActiveSubTab] = useState<"edit" | "preview">("edit");

  // AI Assistant states
  const [aiTopicInput, setAiTopicInput] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);

  // Modals / Action states
  const [rejectionModalPostId, setRejectionModalPostId] = useState<string | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState("");
  const [globalMessage, setGlobalMessage] = useState<string | null>(null);
  const [approvalPasswordModal, setApprovalPasswordModal] = useState<{ isOpen: boolean; password?: string; name?: string; email?: string } | null>(null);
  const [requestActionModal, setRequestActionModal] = useState<{ isOpen: boolean, reqId: string, action: "approve" | "reject", message: string } | null>(null);

  // Users lists & user action states
  const [allUsers, setAllUsers] = useState<IUser[]>([]);
  const [selectedUserToChangePassword, setSelectedUserToChangePassword] = useState<IUser | null>(null);
  const [newPasswordForUser, setNewPasswordForUser] = useState("");

  // New Course Inputs
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseDesc, setNewCourseDesc] = useState("");
  const [newCourseSyllabus, setNewCourseSyllabus] = useState<string[]>([]);
  const [syllabusInput, setSyllabusInput] = useState("");

  // Refresh lists
  const fetchAdminLists = async () => {
    try {
      if (isAdmin) {
        // Fetch account requests
        const reqRes = await fetch("/api/requests/list");
        if (reqRes.ok) {
          const reqData = await reqRes.json();
          setAllRequests(reqData);
        }
        // Fetch password reset requests
        const rstRes = await fetch("/api/auth/reset-requests");
        if (rstRes.ok) {
          const rstData = await rstRes.json();
          setResetRequests(rstData);
        }
        // Fetch all users list
        const usrRes = await fetch("/api/users");
        if (usrRes.ok) {
          const usrData = await usrRes.json();
          setAllUsers(usrData);
        }
      }

      // Fetch all courses and posts
      const crsRes = await fetch("/api/courses");
      if (crsRes.ok) {
        const crsData = await crsRes.json();
        setAllCourses(crsData);
      }

      const queryUrl = isAdmin ? "/api/posts?role=admin" : `/api/posts?authorId=${currentUser.id}`;
      const pstRes = await fetch(queryUrl);
      if (pstRes.ok) {
        const pstData = await pstRes.json();
        setAllPosts(pstData);
      }

      // Fetch Comments, Library, and FAQs for dynamic management
      const cmtRes = await fetch("/api/comments");
      if (cmtRes.ok) {
        const cmtData = await cmtRes.json();
        setAllComments(cmtData);
      }

      const libRes = await fetch("/api/library");
      if (libRes.ok) {
        const libData = await libRes.json();
        setAllLibraryDocs(libData);
      }

      const faqRes = await fetch("/api/faqs");
      if (faqRes.ok) {
        const faqData = await faqRes.json();
        setAllFaqs(faqData);
      }
    } catch (err) {
      console.error("Error refreshing admin lists", err);
    }
  };

  useEffect(() => {
    fetchAdminLists();
  }, [currentUser, activeTab, isCreatingPost]);

  // Sync state inputs with parent settings prop when it finishes loading or updates
  useEffect(() => {
    if (settings) {
      setSiteNameInput(settings.siteName || "");
      setHeroTextInput(settings.heroText || "");
      setContactEmailInput(settings.contactEmail || "");
      setAdminRecoveryCodeInput(settings.adminRecoveryCode || "");
      if (settings.colorTheme) {
        setPrimaryColorInput(settings.colorTheme.primary || "#14b8a6");
        setSecondaryColorInput(settings.colorTheme.secondary || "#0d9488");
        setClinicalBlueInput(settings.colorTheme.clinicalBlue || "#0284c7");
      }
    }
  }, [settings]);

  // Sync profile pic when current user changes or loads
  useEffect(() => {
    if (currentUser) {
      setProfilePicBase64(currentUser.profilePicture || "");
      setProfileNameInput(currentUser.name || "");
      setProfileEmailInput(currentUser.email || "");
      setProfilePicLinkInput(currentUser.profilePicture || "");
    }
  }, [currentUser]);

  // Handle Toast helper
  const showMessage = (msg: string) => {
    setGlobalMessage(msg);
    setTimeout(() => setGlobalMessage(null), 4000);
  };

  // Profile Picture Upload Handler (Supports drag-and-drop & click)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>, target: "profile" | "coverImage" | { blockId: string }) => {
    let file: File | null = null;
    if ("dataTransfer" in e) {
      e.preventDefault();
      file = e.dataTransfer.files?.[0] || null;
    } else {
      file = e.target.files?.[0] || null;
    }

    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64String = reader.result as string;
      
      try {
        // Upload base64 string directly to API
        const uploadRes = await fetch("/api/media/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file: base64String, fileType: file?.type.includes("pdf") ? "pdf" : "image" })
        });
        const uploadData = await uploadRes.json();
        
        if (uploadRes.ok) {
          if (target === "profile") {
            setProfilePicBase64(uploadData.url);
          } else if (target === "coverImage") {
            setPostCoverImage(uploadData.url);
          } else {
            // Update Block in Editor
            setPostBlocks(prev => prev.map(b => b.id === target.blockId ? { ...b, value: uploadData.url } : b));
          }
        } else {
          alert("آپلود ناموفق بود.");
        }
      } catch (err) {
        alert("خطا در آپلود عکس به سرور.");
      }
    };
    reader.readAsDataURL(file);
  };

  // Submit Profile Changes
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);

    const finalPic = profilePicLinkInput.trim() || profilePicBase64;

    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          name: profileNameInput,
          email: profileEmailInput,
          password: profilePasswordInput || undefined,
          profilePicture: finalPic
        })
      });
      if (res.ok) {
        setProfileMsg("پروفایل کاربری با موفقیت بروزرسانی شد.");
        setProfilePasswordInput("");
        onRefreshData();
      } else {
        setProfileMsg("تغییرات ثبت نشد.");
      }
    } catch (err) {
      setProfileMsg("خطا در اتصال به سرور.");
    }
  };

  // Open Approve Modal
  const handleApproveRequest = (requestId: string) => {
    setRequestActionModal({ isOpen: true, reqId: requestId, action: "approve", message: "" });
  };

  // Open Reject Modal
  const handleRejectRequest = (requestId: string) => {
    setRequestActionModal({ isOpen: true, reqId: requestId, action: "reject", message: "" });
  };

  // Submit Account Request Action
  const submitRequestAction = async () => {
    if (!requestActionModal) return;
    try {
      const res = await fetch("/api/requests/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          requestId: requestActionModal.reqId, 
          action: requestActionModal.action, 
          adminMessage: requestActionModal.message 
        })
      });
      if (res.ok) {
        showMessage(`درخواست عضویت با موفقیت ${requestActionModal.action === "approve" ? "تأیید" : "رد"} شد و ایمیل اطلاع‌رسانی ارسال گردید.`);
        setRequestActionModal(null);
        fetchAdminLists();
      } else {
        alert("خطا در انجام عملیات.");
      }
    } catch (err) {
      alert("خطا در انجام عملیات.");
    }
  };

  // Approve Password Reset Request (Admin)
  const handleApprovePasswordReset = async (userId: string) => {
    const userItem = resetRequests.find(u => (u._id === userId || u.id === userId));
    const tempPass = "recover" + Math.floor(1000 + Math.random() * 9000);
    try {
      const res = await fetch("/api/auth/reset-approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, tempPassword: tempPass })
      });
      if (res.ok) {
        setApprovalPasswordModal({
          isOpen: true,
          password: tempPass,
          name: userItem?.name || "نویسنده",
          email: userItem?.email || ""
        });
        fetchAdminLists();
      }
    } catch (err) {
      alert("خطا در بازیابی رمز.");
    }
  };

  // Submit/Update Site Settings (Admin)
  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/settings/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteName: siteNameInput,
          heroText: heroTextInput,
          contactEmail: contactEmailInput,
          adminRecoveryCode: adminRecoveryCodeInput,
          adminPassword: adminPasswordInput || undefined,
          primaryColor: primaryColorInput,
          secondaryColor: secondaryColorInput,
          clinicalBlueColor: clinicalBlueInput
        })
      });
      if (res.ok) {
        showMessage("تنظیمات کلان آکادمی دنتالفای بروزرسانی شد.");
        setAdminPasswordInput("");
        onRefreshData();
      }
    } catch (err) {
      alert("خطا در بروزرسانی تنظیمات.");
    }
  };

  // Submit New Course (Admin)
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle) return;

    try {
      const res = await fetch("/api/courses/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newCourseTitle,
          description: newCourseDesc,
          syllabus: newCourseSyllabus
        })
      });
      if (res.ok) {
        showMessage("درس جدید با موفقیت به سرفصل‌های آکادمی افزوده شد.");
        setNewCourseTitle("");
        setNewCourseDesc("");
        setNewCourseSyllabus([]);
        fetchAdminLists();
      }
    } catch (err) {
      alert("خطا در ایجاد درس.");
    }
  };

  const handleAddSyllabusItem = () => {
    if (!syllabusInput.trim()) return;
    setNewCourseSyllabus(prev => [...prev, syllabusInput.trim()]);
    setSyllabusInput("");
  };

  // Post Actions (Admin approve / reject)
  const handleApprovePost = async (postId: string) => {
    try {
      const res = await fetch("/api/posts/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, action: "approve" })
      });
      if (res.ok) {
        showMessage("پست تأیید و منتشر شد!");
        fetchAdminLists();
      }
    } catch (err) {
      alert("خطا در تایید پست.");
    }
  };

  const handleOpenRejectPostModal = (postId: string) => {
    setRejectionModalPostId(postId);
    setRejectionReasonInput("");
  };

  const handleRejectPostSubmit = async () => {
    if (!rejectionModalPostId || !rejectionReasonInput.trim()) return;

    try {
      const res = await fetch("/api/posts/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: rejectionModalPostId, action: "reject", reason: rejectionReasonInput.trim() })
      });
      if (res.ok) {
        showMessage("پست رد شد و بازخورد به نویسنده فرستاده شد.");
        setRejectionModalPostId(null);
        fetchAdminLists();
      }
    } catch (err) {
      alert("خطا در رد پست.");
    }
  };

  // Block Editor Actions
  const handleAddNewBlock = (type: "text" | "heading" | "image" | "video" | "pdf" | "quote" | "list" | "divider") => {
    let defaultValue: any = "";
    if (type === "list") {
      defaultValue = { items: [""], listType: "bullet" };
    } else if (type === "heading") {
      defaultValue = { text: "", level: "h2" };
    } else if (type === "quote") {
      defaultValue = { text: "", author: "دنتالفای" };
    } else if (type === "image") {
      defaultValue = { url: "", caption: "" };
    } else if (type === "video") {
      defaultValue = { url: "", caption: "" };
    } else if (type === "pdf") {
      defaultValue = { url: "", name: "" };
    }

    const newBlock: IBlock = {
      id: "b-" + Date.now() + Math.random().toString(36).substr(2, 4),
      type,
      value: defaultValue
    };
    setPostBlocks(prev => [...prev, newBlock]);
  };

  const handleDeleteBlock = (blockId: string) => {
    setPostBlocks(prev => prev.filter(b => b.id !== blockId));
  };

  const handleUpdateBlockValue = (blockId: string, val: any) => {
    setPostBlocks(prev => prev.map(b => b.id === blockId ? { ...b, value: val } : b));
  };

  // Start Editor For New Post
  const handleStartNewPost = () => {
    setEditingPostId(null);
    setPostTitle("");
    setPostCourseId(allCourses[0]?._id || "");
    setPostBlocks([
      { id: "b-first-txt", type: "text", value: "" }
    ]);
    setPostTags("");
    setPostSummary("");
    setPostCoverImage("");
    setEditorActiveSubTab("edit");
    setIsCreatingPost(true);
  };

  // Edit rejected / existing post
  const handleStartEditPost = (post: IPost) => {
    setEditingPostId(post._id);
    setPostTitle(post.title);
    setPostCourseId(typeof post.course === "object" ? post.course?._id || "" : post.course || "");
    setPostBlocks(post.content || []);
    setPostTags(post.tags ? post.tags.join(", ") : "");
    setPostSummary(post.summary || "");
    setPostCoverImage(post.coverImage || "");
    setEditorActiveSubTab("edit");
    setIsCreatingPost(true);
  };

  // Submit Post from Editor to DB (with role-based status option)
  const handleSavePostToDB = async (targetStatus: "draft" | "pending" | "published") => {
    if (!postTitle.trim()) {
      alert("عنوان پست الزامی است.");
      return;
    }

    const payload = {
      postId: editingPostId,
      title: postTitle,
      content: postBlocks,
      courseId: postCourseId,
      authorId: currentUser.id,
      status: targetStatus,
      tags: postTags.split(",").map(t => t.trim()).filter(Boolean),
      summary: postSummary,
      coverImage: postCoverImage
    };

    try {
      const endpoint = editingPostId ? "/api/posts/update" : "/api/posts/create";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        showMessage(data.message || "پست با موفقیت ذخیره شد.");
        setIsCreatingPost(false);
        fetchAdminLists();
      } else {
        alert(data.error || "خطا در ذخیره پست.");
      }
    } catch (err) {
      alert("خطا در ذخیره پست.");
    }
  };

  // AI Assisted Article Generation Call
  const handleAIGeneratePost = async () => {
    if (!aiTopicInput.trim()) {
      alert("لطفاً موضوع مقاله خود را در کادر مربوطه بنویسید.");
      return;
    }

    setAiGenerating(true);
    try {
      const res = await fetch("/api/ai/generate-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: aiTopicInput.trim() })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPostTitle(data.title || "");
        setPostSummary(data.summary || "");
        setPostTags(data.tags || "");
        setPostBlocks(data.blocks || []);
        setAiTopicInput("");
        showMessage("مقاله فوق تخصصی دندانپزشکی با موفقیت توسط هوش مصنوعی تولید و بارگذاری شد!");
      } else {
        alert(data.error || "تولید مقاله با هوش مصنوعی متاسفانه با خطا مواجه شد.");
      }
    } catch (err: any) {
      alert("خطا در برقراری ارتباط با سرور هوش مصنوعی.");
    } finally {
      setAiGenerating(false);
    }
  };

  // Block mover
  const handleMoveBlock = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === postBlocks.length - 1) return;
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...postBlocks];
    const temp = updated[index];
    updated[index] = updated[nextIndex];
    updated[nextIndex] = temp;
    setPostBlocks(updated);
  };

  // --- COMMENTS MODERATION HANDLERS ---
  const handleCommentReplySubmit = async (commentId: string) => {
    if (!replyTextInput.trim()) return;
    try {
      const res = await fetch(`/api/comments/${commentId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: replyTextInput.trim(), repliedBy: currentUser.name })
      });
      if (res.ok) {
        showMessage("پاسخ شما با موفقیت ثبت شد.");
        setReplyCommentId(null);
        setReplyTextInput("");
        fetchAdminLists();
      }
    } catch (err) {
      alert("خطا در ثبت پاسخ.");
    }
  };

  const handleCommentDelete = async (commentId: string) => {
    if (!confirm("آیا از حذف این نظر/پرسش اطمینان دارید؟")) return;
    try {
      const res = await fetch(`/api/comments/${commentId}`, { method: "DELETE" });
      if (res.ok) {
        showMessage("نظر با موفقیت حذف شد.");
        fetchAdminLists();
      }
    } catch (err) {
      alert("خطا در حذف نظر.");
    }
  };

  // --- LIBRARY & FAQ HANDLERS ---
  const handleCreateLibraryDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLibraryTitle || !newLibraryFile) {
      alert("عنوان و فایل الزامی هستند.");
      return;
    }
    try {
      const res = await fetch("/api/library/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newLibraryTitle, file: newLibraryFile, size: newLibrarySize || "1.0 MB" })
      });
      if (res.ok) {
        showMessage("سند با موفقیت به کتابخانه افزوده شد.");
        setNewLibraryTitle("");
        setNewLibraryFile("");
        setNewLibrarySize("");
        fetchAdminLists();
      }
    } catch (err) {
      alert("خطا در اضافه کردن سند.");
    }
  };

  const handleDeleteLibraryDoc = async (docId: string) => {
    if (!confirm("آیا از حذف این سند اطمینان دارید؟")) return;
    try {
      const res = await fetch(`/api/library/${docId}`, { method: "DELETE" });
      if (res.ok) {
        showMessage("سند از کتابخانه حذف شد.");
        fetchAdminLists();
      }
    } catch (err) {
      alert("خطا در حذف سند.");
    }
  };

  const handleCreateFAQ = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqQuestion || !newFaqAnswer) {
      alert("سوال و جواب الزامی هستند.");
      return;
    }
    try {
      const res = await fetch("/api/faqs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: newFaqQuestion, answer: newFaqAnswer })
      });
      if (res.ok) {
        showMessage("سوال متداول با موفقیت اضافه شد.");
        setNewFaqQuestion("");
        setNewFaqAnswer("");
        fetchAdminLists();
      }
    } catch (err) {
      alert("خطا در ایجاد سوال متداول.");
    }
  };

  const handleDeleteFAQ = async (faqId: string) => {
    if (!confirm("آیا از حذف این سوال متداول اطمینان دارید؟")) return;
    try {
      const res = await fetch(`/api/faqs/${faqId}`, { method: "DELETE" });
      if (res.ok) {
        showMessage("سوال متداول با موفقیت حذف شد.");
        fetchAdminLists();
      }
    } catch (err) {
      alert("خطا در حذف سوال متداول.");
    }
  };

  const handleLibraryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert file size to human readable
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    setNewLibrarySize(`${sizeInMB} MB`);

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setNewLibraryFile(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Calculate stats count
  const publishedCount = allPosts.filter(p => p.status === "published").length;
  const pendingCount = allPosts.filter(p => p.status === "pending").length;
  const rejectedCount = allPosts.filter(p => p.status === "rejected").length;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans overflow-hidden" dir="rtl">
      {/* Toast Notification */}
      <AnimatePresence>
        {globalMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-4 bg-teal-900 border border-teal-800 text-white font-bold text-xs rounded-2xl shadow-xl flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5 text-teal-400" />
            {globalMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar Navigation */}
      <aside className={`fixed md:relative top-0 right-0 z-50 w-64 h-full bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 flex flex-col justify-between shrink-0 transition-transform duration-300 ${isMobileSidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}`}>
        <div className="md:hidden flex justify-end p-4 border-b border-slate-100 dark:border-slate-800">
          <button onClick={() => setIsMobileSidebarOpen(false)} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
            ✕ بستن منو
          </button>
        </div>
        <div className="flex flex-col">
          {/* Logo / Title */}
          <div className="p-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white dark:bg-slate-800 rounded-full opacity-80"></div>
            </div>
            <span className="text-xl font-black text-teal-800">{settings.siteName}</span>
          </div>

          {/* User Profile Summary */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 border border-slate-100 dark:border-slate-800 overflow-hidden relative shrink-0">
              <img 
                src={profilePicBase64 || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200"} 
                alt={currentUser.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{currentUser.name}</div>
              <div className="text-[10px] text-slate-400 font-mono truncate">{currentUser.email}</div>
            </div>
          </div>

          {/* Menu items */}
          <nav className="p-4 space-y-1 text-xs">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold px-3 py-2">مدیریت آکادمی</div>
            
            <button 
              onClick={() => { setActiveTab("dashboard"); setIsMobileSidebarOpen(false); setIsCreatingPost(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold cursor-pointer transition-colors ${activeTab === "dashboard" ? "bg-teal-50 text-teal-700" : "text-slate-500 hover:bg-slate-50 dark:bg-slate-900"}`}
            >
              <Shield className="w-4 h-4" /> داشبورد
            </button>

            <button 
              onClick={() => { setActiveTab("posts"); setIsMobileSidebarOpen(false); setIsCreatingPost(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold cursor-pointer transition-colors ${activeTab === "posts" ? "bg-teal-50 text-teal-700" : "text-slate-500 hover:bg-slate-50 dark:bg-slate-900"}`}
            >
              <FileText className="w-4 h-4" /> {isAdmin ? "کل پست‌های سایت" : "پست‌های من"}
              <span className="mr-auto bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-full font-bold">{allPosts.length}</span>
            </button>

            <button 
              onClick={() => { setActiveTab("comments"); setIsMobileSidebarOpen(false); setIsCreatingPost(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold cursor-pointer transition-colors ${activeTab === "comments" ? "bg-teal-50 text-teal-700" : "text-slate-500 hover:bg-slate-50 dark:bg-slate-900"}`}
            >
              <MessageSquare className="w-4 h-4" /> پرسش‌ها و نظرات بالینی
              <span className="mr-auto bg-teal-100 text-teal-700 text-[10px] px-2 py-0.5 rounded-full font-bold">{allComments.length}</span>
            </button>

            {isAdmin && (
              <>
                <button 
                  onClick={() => { setActiveTab("courses"); setIsMobileSidebarOpen(false); setIsCreatingPost(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold cursor-pointer transition-colors ${activeTab === "courses" ? "bg-teal-50 text-teal-700" : "text-slate-500 hover:bg-slate-50 dark:bg-slate-900"}`}
                >
                  <BookOpen className="w-4 h-4" /> دروس و سرفصل‌ها
                </button>

                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold px-3 py-2 pt-4">بخش نظارت ادمین</div>

                <button 
                  onClick={() => { setActiveTab("requests"); setIsMobileSidebarOpen(false); setIsCreatingPost(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold cursor-pointer transition-colors ${activeTab === "requests" ? "bg-teal-50 text-teal-700" : "text-slate-500 hover:bg-slate-50 dark:bg-slate-900"}`}
                >
                  <Users className="w-4 h-4" /> درخواست‌های نویسندگی
                  {allRequests.filter(r => r.status === "pending").length > 0 && (
                    <span className="mr-auto bg-amber-100 text-amber-700 text-[9px] px-1.5 py-0.5 rounded-full font-black animate-pulse-slow">جدید</span>
                  )}
                </button>

                <button 
                  onClick={() => { setActiveTab("users" as any); setIsMobileSidebarOpen(false); setIsCreatingPost(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold cursor-pointer transition-colors ${activeTab === ("users" as any) ? "bg-teal-50 text-teal-700" : "text-slate-500 hover:bg-slate-50 dark:bg-slate-900"}`}
                >
                  <Users className="w-4 h-4" /> مدیریت کاربران
                  <span className="mr-auto bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {allUsers.length}
                  </span>
                </button>

                <button 
                  onClick={() => { setActiveTab("libraryAndFaqs"); setIsMobileSidebarOpen(false); setIsCreatingPost(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold cursor-pointer transition-colors ${activeTab === "libraryAndFaqs" ? "bg-teal-50 text-teal-700" : "text-slate-500 hover:bg-slate-50 dark:bg-slate-900"}`}
                >
                  <HelpCircle className="w-4 h-4" /> کتابخانه فرم‌ها و FAQ
                </button>

                <button 
                  onClick={() => { setActiveTab("siteSettings"); setIsMobileSidebarOpen(false); setIsCreatingPost(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold cursor-pointer transition-colors ${activeTab === "siteSettings" ? "bg-teal-50 text-teal-700" : "text-slate-500 hover:bg-slate-50 dark:bg-slate-900"}`}
                >
                  <Settings className="w-4 h-4" /> تنظیمات سایت
                </button>
              </>
            )}

            <button 
              onClick={() => { setActiveTab("profile"); setIsMobileSidebarOpen(false); setIsCreatingPost(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold cursor-pointer transition-colors ${activeTab === "profile" ? "bg-teal-50 text-teal-700" : "text-slate-500 hover:bg-slate-50 dark:bg-slate-900"}`}
            >
              <User className="w-4 h-4" /> ویرایش پروفایل من
            </button>
          </nav>
        </div>

        {/* Bottom logout */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> خروج از سیستم
          </button>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header bar */}
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 sm:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 text-slate-600 bg-slate-100 rounded-xl"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-slate-100">داشبورد یکپارچه</h1>
              <p className="text-[9px] sm:text-[10px] text-slate-400 font-medium hidden sm:block">سرویس دهی ابری و مانیتورینگ امن با RMO Cloud Node</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleStartNewPost}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md shadow-teal-600/10 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" /> ایجاد پست جدید
            </button>
          </div>
        </header>

        {/* Body content scroll viewport */}
        <div className="flex-1 p-8 overflow-y-auto">
          {isCreatingPost ? (
            /* --- BLOCK EDITOR INTERFACE --- */
            <div className="space-y-6 max-w-3xl">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setIsCreatingPost(false)}
                  className="px-3.5 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:bg-slate-900 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer text-slate-700 dark:text-slate-200"
                >
                  <ChevronLeft className="w-4.5 h-4.5" /> بازگشت
                </button>
                
                {/* Editor Tabs: Edit vs Preview */}
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 dark:border-slate-700 gap-1">
                  <button
                    onClick={() => setEditorActiveSubTab("edit")}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${editorActiveSubTab === "edit" ? "bg-white dark:bg-slate-800 text-teal-700 shadow-sm" : "text-slate-500 hover:text-slate-800 dark:text-slate-100"}`}
                  >
                    ویرایش محتوا
                  </button>
                  <button
                    onClick={() => setEditorActiveSubTab("preview")}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${editorActiveSubTab === "preview" ? "bg-white dark:bg-slate-800 text-teal-700 shadow-sm" : "text-slate-500 hover:text-slate-800 dark:text-slate-100"}`}
                  >
                    پیش‌نمایش بالینی
                  </button>
                </div>

                <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
                  {editingPostId ? "در حال ویرایش پست" : "ایجاد و ارسال پست علمی جدید"}
                </span>
              </div>

              {editorActiveSubTab === "edit" ? (
                /* --- EDITING VIEW --- */
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-6 shadow-sm">
                  {/* AI Writing Assistant Box */}
                  <div className="bg-gradient-to-l from-teal-500/10 to-emerald-500/10 border border-teal-500/20 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-teal-600 rounded-lg flex items-center justify-center text-white">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-teal-800">دستیار نگارش علمی هوش مصنوعی (Gemini)</h4>
                        <p className="text-[9px] text-teal-600 font-bold">تولید سریع مقالات تخصصی دندانپزشکی بر اساس کلمات کلیدی</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={aiTopicInput}
                        onChange={(e) => setAiTopicInput(e.target.value)}
                        placeholder="مثال: روش‌های تراش لبه دندان در درمان ونیر کامپوزیت"
                        className="flex-1 px-3 py-2.5 bg-white dark:bg-slate-800 border border-teal-100 rounded-xl text-xs focus:outline-none focus:border-teal-500 placeholder:text-slate-400 font-bold"
                      />
                      <button
                        type="button"
                        disabled={aiGenerating}
                        onClick={handleAIGeneratePost}
                        className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white text-xs font-black rounded-xl transition-all shadow-md shadow-teal-600/10 cursor-pointer shrink-0 flex items-center gap-1"
                      >
                        {aiGenerating ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            در حال تولید...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            تولید هوشمند مقاله
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Grid for main metadata */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Title */}
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[11px] font-bold text-slate-500">عنوان مقاله علمی دندانپزشکی</label>
                      <input 
                        type="text" 
                        value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)}
                        placeholder="مثال: روش‌های آماده‌سازی اندودنتیکس در کانال‌های خمیده" 
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none focus:border-teal-500 text-slate-800 dark:text-slate-100"
                      />
                    </div>

                    {/* Course Selection */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500">مربوط به کدام درس تخصصی؟</label>
                      <select 
                        value={postCourseId}
                        onChange={(e) => setPostCourseId(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-teal-500 text-slate-800 dark:text-slate-100 font-bold"
                      >
                        {allCourses.map(c => (
                          <option key={c._id} value={c._id}>{c.title}</option>
                        ))}
                      </select>
                    </div>

                    {/* Tags / Keywords */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500">کلمات کلیدی / برچسب‌ها</label>
                      <input 
                        type="text" 
                        value={postTags}
                        onChange={(e) => setPostTags(e.target.value)}
                        placeholder="مثال: اندو, روتاری, درمان ریشه (با کاما جدا کنید)" 
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-teal-500 text-slate-800 dark:text-slate-100"
                      />
                    </div>

                    {/* Summary / Abstract */}
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[11px] font-bold text-slate-500">چکیده / خلاصه مختصر مقاله</label>
                      <textarea 
                        value={postSummary}
                        onChange={(e) => setPostSummary(e.target.value)}
                        placeholder="خلاصه‌ای یک یا دو جمله‌ای از کاربرد بالینی این مقاله بنویسید..." 
                        rows={2}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-teal-500 text-slate-800 dark:text-slate-100"
                      />
                    </div>

                    {/* Cover Image */}
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[11px] font-bold text-slate-500">تصویر شاخص مقاله دندانپزشکی (Cover Image)</label>
                      {postCoverImage ? (
                        <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-48 bg-slate-100 flex items-center justify-center">
                          <img src={postCoverImage} className="w-full h-48 object-cover" alt="تصویر شاخص" />
                          <button 
                            onClick={() => setPostCoverImage("")}
                            className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 shadow cursor-pointer text-[10px] font-bold"
                          >
                            حذف تصویر
                          </button>
                        </div>
                      ) : (
                        <div 
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => handleFileChange(e, "coverImage")}
                          className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-teal-500 rounded-xl p-6 text-center bg-slate-50 dark:bg-slate-900/50 cursor-pointer transition-colors relative"
                        >
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, "coverImage")}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                          <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                          <div className="text-xs font-bold text-slate-600 dark:text-slate-300">تصویر شاخص مقاله را بکشید یا برای انتخاب کلیک کنید</div>
                          <span className="text-[9px] text-slate-400">نمایش زیباتر در بالای مقاله</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Blocks list */}
                  <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-between">
                      <span>محتوای ساختاریافته مقاله علمی</span>
                      <span className="text-[10px] text-slate-400 font-semibold">استفاده از سیستم بلوکی هوشمند</span>
                    </div>
                    
                    {postBlocks.map((block, index) => (
                      <div key={block.id} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3 relative group">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-2">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                            <span className="w-4 h-4 bg-slate-200 text-slate-600 dark:text-slate-300 rounded-full flex items-center justify-center font-mono text-[8px]">{index + 1}</span>
                            {block.type === "heading" ? "عنوان فرعی" : block.type === "text" ? "متن ساده" : block.type === "image" ? "تصویر" : block.type === "video" ? "ویدیو" : block.type === "pdf" ? "سند PDF" : block.type === "quote" ? "نقل قول" : block.type === "divider" ? "خط جداکننده" : "لیست آیتم‌ها"}
                          </span>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => handleMoveBlock(index, "up")}
                              className="p-1 hover:bg-slate-200 text-slate-500 rounded disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                              title="حرکت به بالا"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              disabled={index === postBlocks.length - 1}
                              onClick={() => handleMoveBlock(index, "down")}
                              className="p-1 hover:bg-slate-200 text-slate-500 rounded disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                              title="حرکت به پایین"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                            <button 
                              type="button"
                              onClick={() => handleDeleteBlock(block.id)}
                              className="p-1 hover:bg-rose-50 hover:text-rose-500 text-slate-400 rounded cursor-pointer"
                              title="حذف بلوک"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Heading Block */}
                        {block.type === "heading" && (() => {
                          const hVal = block.value && typeof block.value === "object" ? block.value : { text: block.value || "", level: "h2" };
                          return (
                            <div className="space-y-3">
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateBlockValue(block.id, { ...hVal, level: "h2" })}
                                  className={`px-3 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors ${hVal.level === "h2" ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600 dark:text-slate-300 hover:bg-slate-200"}`}
                                >
                                  تیتر اصلی (H2)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateBlockValue(block.id, { ...hVal, level: "h3" })}
                                  className={`px-3 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors ${hVal.level === "h3" ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600 dark:text-slate-300 hover:bg-slate-200"}`}
                                >
                                  تیتر فرعی (H3)
                                </button>
                              </div>
                              <input 
                                type="text"
                                value={hVal.text || ""}
                                onChange={(e) => handleUpdateBlockValue(block.id, { ...hVal, text: e.target.value })}
                                placeholder="عنوان فرعی را وارد کنید..."
                                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold focus:outline-none focus:border-teal-500 text-slate-800 dark:text-slate-100"
                              />
                            </div>
                          );
                        })()}

                        {/* Paragraph/Text Block */}
                        {block.type === "text" && (
                          <textarea 
                            value={typeof block.value === "object" ? (block.value?.text || "") : (block.value || "")}
                            onChange={(e) => handleUpdateBlockValue(block.id, e.target.value)}
                            placeholder="متن خود را در این بخش بنویسید..."
                            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:border-teal-500 h-28 text-slate-800 dark:text-slate-100 leading-relaxed font-medium"
                          />
                        )}

                        {/* Quote Block */}
                        {block.type === "quote" && (() => {
                          const qVal = block.value && typeof block.value === "object" ? block.value : { text: block.value || "", author: "دنتالفای" };
                          return (
                            <div className="space-y-3">
                              <textarea 
                                value={qVal.text || ""}
                                onChange={(e) => handleUpdateBlockValue(block.id, { ...qVal, text: e.target.value })}
                                placeholder="متن نقل قول را وارد کنید..."
                                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:border-teal-500 text-slate-800 dark:text-slate-100 italic h-20 leading-relaxed font-medium"
                              />
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-slate-400 shrink-0">نام نویسنده/منبع:</span>
                                <input 
                                  type="text"
                                  value={qVal.author || ""}
                                  onChange={(e) => handleUpdateBlockValue(block.id, { ...qVal, author: e.target.value })}
                                  placeholder="دستیار دنتالفای..."
                                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:border-teal-500 text-slate-700 dark:text-slate-200 font-bold"
                                />
                              </div>
                            </div>
                          );
                        })()}

                        {/* List Block */}
                        {block.type === "list" && (() => {
                          const lVal = block.value && typeof block.value === "object" && !Array.isArray(block.value) ? block.value : { items: Array.isArray(block.value) ? block.value : [""], listType: "bullet" };
                          return (
                            <div className="space-y-3 bg-slate-100/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700/50">
                              <div className="flex gap-2 items-center justify-between">
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateBlockValue(block.id, { ...lVal, listType: "bullet" })}
                                    className={`px-3 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors ${lVal.listType === "bullet" ? "bg-teal-600 text-white" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"}`}
                                  >
                                    لیست نشانه‌دار (•)
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateBlockValue(block.id, { ...lVal, listType: "ordered" })}
                                    className={`px-3 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors ${lVal.listType === "ordered" ? "bg-teal-600 text-white" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"}`}
                                  >
                                    لیست شماره‌دار (1.)
                                  </button>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateBlockValue(block.id, { ...lVal, items: [...lVal.items, ""] })}
                                  className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer"
                                >
                                  + افزودن گزینه جدید
                                </button>
                              </div>

                              <div className="space-y-2">
                                {lVal.items.map((item: string, idx: number) => (
                                  <div key={idx} className="flex gap-2 items-center">
                                    <span className="text-[10px] font-mono font-bold text-slate-400 shrink-0 w-4">
                                      {lVal.listType === "bullet" ? "•" : `${idx + 1}.`}
                                    </span>
                                    <input 
                                      type="text"
                                      value={item || ""}
                                      onChange={(e) => {
                                        const updated = [...lVal.items];
                                        updated[idx] = e.target.value;
                                        handleUpdateBlockValue(block.id, { ...lVal, items: updated });
                                      }}
                                      placeholder={`آیتم شماره ${idx + 1}...`}
                                      className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:border-teal-500 text-slate-800 dark:text-slate-100"
                                    />
                                    {lVal.items.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updated = lVal.items.filter((_: any, i: number) => i !== idx);
                                          handleUpdateBlockValue(block.id, { ...lVal, items: updated });
                                        }}
                                        className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                                        title="حذف آیتم"
                                      >
                                        <XCircle className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}

                        {/* Image Block */}
                        {block.type === "image" && (() => {
                          const iVal = block.value && typeof block.value === "object" ? block.value : { url: block.value || "", caption: "" };
                          return (
                            <div className="space-y-3">
                              {iVal.url ? (
                                <div className="space-y-2">
                                  <div className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 max-h-48 bg-slate-100 flex items-center justify-center">
                                    <img src={iVal.url} className="h-full max-h-48 object-contain" alt="بارگذاری شده" />
                                    <button 
                                      type="button"
                                      onClick={() => handleUpdateBlockValue(block.id, { ...iVal, url: "" })}
                                      className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 shadow cursor-pointer text-[10px] font-bold"
                                    >
                                      حذف عکس
                                    </button>
                                  </div>
                                  <input 
                                    type="text"
                                    value={iVal.caption || ""}
                                    onChange={(e) => handleUpdateBlockValue(block.id, { ...iVal, caption: e.target.value })}
                                    placeholder="توضیح یا منبع عکس (Caption) اختیاری..."
                                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:border-teal-500 text-slate-600 dark:text-slate-300 italic"
                                  />
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <div 
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => handleFileChange(e, { blockId: block.id })}
                                    className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-teal-500 rounded-xl p-5 text-center bg-white dark:bg-slate-800 cursor-pointer transition-colors relative"
                                  >
                                    <input 
                                      type="file" 
                                      accept="image/*"
                                      onChange={(e) => handleFileChange(e, { blockId: block.id })}
                                      className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                                    <div className="text-xs font-bold text-slate-600 dark:text-slate-300">عکس مورد نظر را بکشید یا برای انتخاب کلیک کنید</div>
                                    <span className="text-[9px] text-slate-400">ذخیره خودکار در پایگاه ابری دنتالفای</span>
                                  </div>
                                  <input 
                                    type="text"
                                    value={iVal.url || ""}
                                    onChange={(e) => handleUpdateBlockValue(block.id, { ...iVal, url: e.target.value })}
                                    placeholder="یا آدرس اینترنتی عکس (URL) را مستقیماً وارد کنید..."
                                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:border-teal-500 text-slate-700 dark:text-slate-200 text-left"
                                    dir="ltr"
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })()}

                        {/* Video Block */}
                        {block.type === "video" && (() => {
                          const vVal = block.value && typeof block.value === "object" ? block.value : { url: block.value || "", caption: "" };
                          return (
                            <div className="space-y-3">
                              {vVal.url ? (
                                <div className="space-y-2 bg-slate-900 rounded-lg p-3 border border-slate-800">
                                  <div className="aspect-video bg-black rounded overflow-hidden relative flex items-center justify-center">
                                    <video src={vVal.url} className="w-full h-full object-contain" controls />
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateBlockValue(block.id, { ...vVal, url: "" })}
                                      className="absolute top-2 right-2 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[9px] font-bold cursor-pointer"
                                    >
                                      حذف ویدیو
                                    </button>
                                  </div>
                                  <input 
                                    type="text"
                                    value={vVal.caption || ""}
                                    onChange={(e) => handleUpdateBlockValue(block.id, { ...vVal, caption: e.target.value })}
                                    placeholder="توضیح یا زیرنویس ویدیو علمی دندانپزشکی..."
                                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded text-xs text-slate-300 focus:outline-none"
                                  />
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div 
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => handleFileChange(e, { blockId: block.id })}
                                    className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-teal-500 rounded-xl p-4 text-center bg-white dark:bg-slate-800 cursor-pointer transition-colors relative"
                                  >
                                    <input 
                                      type="file" 
                                      accept="video/*"
                                      onChange={(e) => handleFileChange(e, { blockId: block.id })}
                                      className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                                    <div className="text-[10px] font-bold text-slate-600 dark:text-slate-300">کشیدن یا آپلود ویدیو دندانپزشکی</div>
                                    <span className="text-[8px] text-slate-400">فرمت‌های Mp4, WebM</span>
                                  </div>

                                  <div className="space-y-2">
                                    <input 
                                      type="text"
                                      value={vVal.url || ""}
                                      onChange={(e) => handleUpdateBlockValue(block.id, { ...vVal, url: e.target.value })}
                                      placeholder="آدرس ویدیوی یوتیوب، آپارات یا لینک مستقیم..."
                                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:border-teal-500 text-slate-800 dark:text-slate-100 text-left"
                                      dir="ltr"
                                    />
                                    <input 
                                      type="text"
                                      value={vVal.caption || ""}
                                      onChange={(e) => handleUpdateBlockValue(block.id, { ...vVal, caption: e.target.value })}
                                      placeholder="توضیحات ویدیو (Caption)..."
                                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:border-teal-500 text-slate-700 dark:text-slate-200"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })()}

                        {/* PDF / Document Block */}
                        {block.type === "pdf" && (() => {
                          const pVal = block.value && typeof block.value === "object" ? block.value : { url: block.value || "", name: "فایل راهنمای بالینی دندانپزشکی" };
                          return (
                            <div className="space-y-3">
                              {pVal.url ? (
                                <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between">
                                  <div className="text-xs font-bold text-teal-700 truncate max-w-[80%] flex items-center gap-1.5">
                                    <span className="px-2 py-0.5 bg-teal-50 rounded text-[9px] font-black">PDF</span>
                                    {pVal.name || "سند ضمیمه بارگذاری شده"}
                                  </div>
                                  <button 
                                    type="button"
                                    onClick={() => handleUpdateBlockValue(block.id, { ...pVal, url: "" })}
                                    className="text-xs text-rose-500 font-bold hover:underline cursor-pointer"
                                  >
                                    حذف فایل
                                  </button>
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div 
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => handleFileChange(e, { blockId: block.id })}
                                    className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-teal-500 rounded-xl p-4 text-center bg-white dark:bg-slate-800 cursor-pointer transition-colors relative"
                                  >
                                    <input 
                                      type="file" 
                                      accept=".pdf"
                                      onChange={(e) => handleFileChange(e, { blockId: block.id })}
                                      className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                                    <div className="text-[10px] font-bold text-slate-600 dark:text-slate-300">کشیدن یا آپلود ضمیمه PDF</div>
                                    <span className="text-[8px] text-slate-400">حداکثر ۲۵ مگابایت</span>
                                  </div>

                                  <div className="space-y-2">
                                    <input 
                                      type="text"
                                      value={pVal.name || ""}
                                      onChange={(e) => handleUpdateBlockValue(block.id, { ...pVal, name: e.target.value })}
                                      placeholder="نام فارسی سند (مثلاً: پروتکل درمانی کانال)"
                                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:border-teal-500 text-slate-800 dark:text-slate-100 font-bold"
                                    />
                                    <input 
                                      type="text"
                                      value={pVal.url || ""}
                                      onChange={(e) => handleUpdateBlockValue(block.id, { ...pVal, url: e.target.value })}
                                      placeholder="یا آدرس اینترنتی مستقیم فایل PDF..."
                                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:border-teal-500 text-slate-700 dark:text-slate-200 text-left"
                                      dir="ltr"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })()}

                        {/* Divider Block */}
                        {block.type === "divider" && (
                          <div className="py-4 flex items-center justify-center">
                            <div className="w-full border-t border-dashed border-slate-300"></div>
                            <span className="px-3 text-[9px] font-bold text-slate-400 shrink-0 uppercase tracking-widest bg-slate-50 dark:bg-slate-900">خط جداکننده خطوط</span>
                            <div className="w-full border-t border-dashed border-slate-300"></div>
                          </div>
                        )}

                      </div>
                    ))}

                    {/* Add Block Toolbar */}
                    <div className="flex flex-wrap gap-2 bg-slate-100 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 justify-center">
                      <button onClick={() => handleAddNewBlock("text")} className="px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-teal-50 hover:text-teal-700 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-bold cursor-pointer transition-colors">
                        + متن پاراگراف
                      </button>
                      <button onClick={() => handleAddNewBlock("heading")} className="px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-teal-50 hover:text-teal-700 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-bold cursor-pointer transition-colors">
                        + عنوان فرعی (H2/H3)
                      </button>
                      <button onClick={() => handleAddNewBlock("quote")} className="px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-teal-50 hover:text-teal-700 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-bold cursor-pointer transition-colors">
                        + نقل قول دندانپزشک
                      </button>
                      <button onClick={() => handleAddNewBlock("list")} className="px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-teal-50 hover:text-teal-700 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-bold cursor-pointer transition-colors">
                        + لیست هوشمند
                      </button>
                      <button onClick={() => handleAddNewBlock("image")} className="px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-teal-50 hover:text-teal-700 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-bold cursor-pointer transition-colors">
                        + تصویر بالینی
                      </button>
                      <button onClick={() => handleAddNewBlock("video")} className="px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-teal-50 hover:text-teal-700 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-bold cursor-pointer transition-colors">
                        + ویدیو شبیه‌ساز
                      </button>
                      <button onClick={() => handleAddNewBlock("pdf")} className="px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-teal-50 hover:text-teal-700 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-bold cursor-pointer transition-colors">
                        + سند ضمیمه/PDF
                      </button>
                      <button onClick={() => handleAddNewBlock("divider")} className="px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-teal-50 hover:text-teal-700 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-bold cursor-pointer transition-colors">
                        + خط جداکننده (Divider)
                      </button>
                    </div>
                  </div>

                  {/* Multi-role action buttons */}
                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={() => handleSavePostToDB("draft")}
                      className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-extrabold rounded-xl text-xs transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
                    >
                      ذخیره به عنوان پیش‌نویس
                    </button>
                    
                    {isAdmin ? (
                      <button 
                        onClick={() => handleSavePostToDB("published")}
                        className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-xl text-xs transition-all shadow-lg shadow-teal-600/10 cursor-pointer"
                      >
                        انتشار مستقیم و فوری مقاله
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleSavePostToDB("pending")}
                        className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-xl text-xs transition-all shadow-lg shadow-teal-600/10 cursor-pointer"
                      >
                        ارسال جهت بررسی و تایید مدیر علمی
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* --- PREVIEW VIEW (CLINICAL STYLED) --- */
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 space-y-6 shadow-sm">
                  {postCoverImage && (
                    <div className="w-full h-60 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                      <img src={postCoverImage} className="w-full h-full object-cover" alt="Cover" />
                    </div>
                  )}

                  <div className="space-y-2">
                    <span className="px-2.5 py-1 bg-teal-50 text-teal-700 rounded-lg text-[10px] font-bold uppercase tracking-wide">
                      {allCourses.find(c => c._id === postCourseId)?.title || "درس تخصصی انتخاب نشده"}
                    </span>
                    <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 leading-relaxed">{postTitle || "عنوان مقاله را وارد نکرده‌اید"}</h2>
                  </div>

                  {postSummary && (
                    <div className="p-4 bg-teal-50/50 border-r-4 border-teal-500 rounded-l-xl text-slate-700 dark:text-slate-200 text-xs font-semibold leading-relaxed">
                      {postSummary}
                    </div>
                  )}

                  {/* Render Blocks Preview */}
                  <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                    {postBlocks.map((block, idx) => {
                      switch (block.type) {
                        case "heading": {
                          const hVal = block.value && typeof block.value === "object" ? block.value : { text: block.value || "", level: "h2" };
                          if (hVal.level === "h3") {
                            return (
                              <h4 key={block.id || idx} className="text-xs font-black text-slate-800 dark:text-slate-100 border-r-2 border-emerald-500 pr-2 pt-1">{hVal.text}</h4>
                            );
                          }
                          return (
                            <h3 key={block.id || idx} className="text-sm font-bold text-slate-800 dark:text-slate-100 border-r-2 border-teal-500 pr-2 pt-2">{hVal.text}</h3>
                          );
                        }
                        case "text": {
                          const tText = typeof block.value === "object" ? (block.value?.text || "") : (block.value || "");
                          return (
                            <p key={block.id || idx} className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-justify whitespace-pre-line">{tText}</p>
                          );
                        }
                        case "quote": {
                          const qVal = block.value && typeof block.value === "object" ? block.value : { text: block.value || "", author: "دنتالفای" };
                          return (
                            <div key={block.id || idx} className="p-4 bg-slate-50 dark:bg-slate-900 border-r-4 border-slate-300 rounded-l-lg text-xs italic text-slate-500 font-medium">
                              <p className="leading-relaxed">{qVal.text}</p>
                              {qVal.author && <span className="text-[9px] block text-slate-400 mt-1">— {qVal.author}</span>}
                            </div>
                          );
                        }
                        case "list": {
                          const lVal = block.value && typeof block.value === "object" && !Array.isArray(block.value) ? block.value : { items: Array.isArray(block.value) ? block.value : [""], listType: "bullet" };
                          return lVal.listType === "ordered" ? (
                            <ol key={block.id || idx} className="list-decimal list-inside space-y-1 pr-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                              {lVal.items.map((item: string, i: number) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ol>
                          ) : (
                            <ul key={block.id || idx} className="list-disc list-inside space-y-1 pr-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                              {lVal.items.map((item: string, i: number) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          );
                        }
                        case "image": {
                          const iVal = block.value && typeof block.value === "object" ? block.value : { url: block.value || "", caption: "" };
                          return iVal.url ? (
                            <div key={block.id || idx} className="space-y-1.5 text-center bg-slate-50 dark:bg-slate-900 rounded-xl p-2 border border-slate-100 dark:border-slate-800">
                              <div className="rounded-lg overflow-hidden max-h-96 flex justify-center bg-slate-50 dark:bg-slate-900">
                                <img src={iVal.url} className="max-h-96 object-contain" alt="Clinical Illustration" />
                              </div>
                              {iVal.caption && <span className="text-[9px] text-slate-400 font-medium italic">{iVal.caption}</span>}
                            </div>
                          ) : null;
                        }
                        case "video": {
                          const vVal = block.value && typeof block.value === "object" ? block.value : { url: block.value || "", caption: "" };
                          const isEmbed = vVal.url && (vVal.url.includes("youtube.com") || vVal.url.includes("aparat.com") || vVal.url.includes("embed"));
                          return vVal.url ? (
                            <div key={block.id || idx} className="space-y-1.5 text-center bg-slate-950 p-2 rounded-xl">
                              <div className="aspect-video rounded-lg overflow-hidden bg-slate-900">
                                {isEmbed ? (
                                  <iframe 
                                    src={vVal.url} 
                                    className="w-full h-full" 
                                    title="Clinical Video Simulator" 
                                    allowFullScreen
                                  />
                                ) : (
                                  <video src={vVal.url} controls className="w-full h-full" />
                                )}
                              </div>
                              {vVal.caption && <span className="text-[9px] text-slate-400 font-medium italic block">{vVal.caption}</span>}
                            </div>
                          ) : null;
                        }
                        case "pdf": {
                          const pVal = block.value && typeof block.value === "object" ? block.value : { url: block.value || "", name: "فایل راهنمای بالینی دندانپزشکی" };
                          return pVal.url ? (
                            <div key={block.id || idx} className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate max-w-[70%]">{pVal.name || "سند ضمیمه (رفرنس علمی دندانپزشکی)"}</span>
                              <a href={pVal.url} download={`${pVal.name || "reference"}.pdf`} className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-bold text-teal-600 hover:bg-slate-50 dark:bg-slate-900 shrink-0">
                                دانلود سند PDF
                              </a>
                            </div>
                          ) : null;
                        }
                        case "divider":
                          return (
                            <div key={block.id || idx} className="py-4 flex items-center justify-center">
                              <div className="w-full border-t border-dashed border-slate-200 dark:border-slate-700"></div>
                              <span className="px-2 text-[8px] font-bold text-slate-300">جداکننده</span>
                              <div className="w-full border-t border-dashed border-slate-200 dark:border-slate-700"></div>
                            </div>
                          );
                        default:
                          return null;
                      }
                    })}
                  </div>

                  {/* Bottom tags preview */}
                  {postTags && (
                    <div className="flex flex-wrap gap-1.5 pt-6 border-t border-slate-100 dark:border-slate-800">
                      {postTags.split(",").map(t => t.trim()).filter(Boolean).map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 dark:text-slate-300 rounded text-[9px] font-bold">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-4 flex items-center gap-2.5">
                    <img src={currentUser.profilePicture} className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700" alt={currentUser.name} />
                    <div>
                      <div className="text-[10px] font-bold text-slate-700 dark:text-slate-200">{currentUser.name}</div>
                      <div className="text-[8px] text-slate-400 font-medium">نویسنده علمی پلتفرم</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === "dashboard" ? (
            /* --- DASHBOARD VIEW --- */
            <div className="space-y-8">
              {/* Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">پست‌های منتشر شده</div>
                  <div className="flex items-end gap-2">
                    <div className="text-3xl font-black text-slate-800 dark:text-slate-100">{publishedCount}</div>
                    <div className="text-[10px] text-emerald-500 font-bold pb-1">بدون محدودیت</div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">در انتظار بررسی علمی</div>
                  <div className="flex items-end gap-2">
                    <div className="text-3xl font-black text-teal-600">{pendingCount}</div>
                    <div className="text-[10px] text-slate-400 pb-1">نیازمند بازنگری</div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">نویسندگان همکار</div>
                  <div className="flex items-end gap-2">
                    <div className="text-3xl font-black text-slate-800 dark:text-slate-100">{settings.stats?.authorsCount || 1}</div>
                    <div className="text-[10px] text-teal-600 font-bold pb-1">متخصصین تأیید شده</div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">دروس دانشگاهی فعال</div>
                  <div className="flex items-end gap-2">
                    <div className="text-3xl font-black text-slate-800 dark:text-slate-100">{allCourses.length}</div>
                    <div className="text-[10px] text-slate-400 pb-1">سرفصل فعال مصوب</div>
                  </div>
                </div>
              </div>

              {/* Main Grid: Pending items */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Right col: Pending posts queue for admin */}
                <div className="lg:col-span-2 space-y-6">
                  {isAdmin ? (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
                      <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
                        <h2 className="font-extrabold text-xs text-slate-700 dark:text-slate-200">صف بررسی و تایید مقالات ورودی</h2>
                        <span className="text-[10px] text-teal-600 font-bold bg-teal-50 px-2 py-0.5 rounded">نیاز به تایید ادمین</span>
                      </div>
                      
                      <div className="divide-y divide-slate-100">
                        {allPosts.filter(p => p.status === "pending").length === 0 ? (
                          <div className="p-8 text-center text-xs text-slate-400">
                            هیچ پستی در صف انتظار نیست. تمامی مقالات بررسی و مانیتور شده‌اند.
                          </div>
                        ) : (
                          allPosts.filter(p => p.status === "pending").map(post => {
                            const postAuthorName = typeof post.author === "object" ? post.author?.name : "نویسنده";
                            return (
                              <div key={post._id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:bg-slate-900/50 transition-colors">
                                <div>
                                  <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100">{post.title}</h4>
                                  <p className="text-[9px] text-slate-400 mt-1">توسط {postAuthorName} • مبحث: {post.course?.title || "سایر"}</p>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                  <button 
                                    onClick={() => handleApprovePost(post._id)}
                                    className="px-3 py-1 bg-teal-500 hover:bg-teal-600 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                                  >
                                    تأیید و انتشار
                                  </button>
                                  <button 
                                    onClick={() => handleOpenRejectPostModal(post._id)}
                                    className="px-3 py-1 bg-white dark:bg-slate-800 border border-rose-100 text-rose-500 hover:bg-rose-50 rounded-lg text-[10px] font-bold cursor-pointer"
                                  >
                                    رد مقاله
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                      <h3 className="font-bold text-xs text-slate-700 dark:text-slate-200 mb-4">پست‌های رد شده من (نیاز به بازنگری)</h3>
                      <div className="space-y-4">
                        {allPosts.filter(p => p.status === "rejected").length === 0 ? (
                          <p className="text-xs text-slate-400">خوشبختانه هیچ پستی از شما رد نشده است.</p>
                        ) : (
                          allPosts.filter(p => p.status === "rejected").map(post => (
                            <div key={post._id} className="p-4 bg-rose-50 border border-rose-100 rounded-xl space-y-2">
                              <h5 className="font-bold text-xs text-slate-800 dark:text-slate-100">{post.title}</h5>
                              <p className="text-[10px] text-rose-700">دلیل رد: {post.rejectionReason || "ذکر نشده"}</p>
                              <button 
                                onClick={() => handleStartEditPost(post)}
                                className="px-3 py-1 bg-white dark:bg-slate-800 border border-rose-200 text-slate-700 dark:text-slate-200 hover:text-teal-600 rounded-lg text-[10px] font-bold cursor-pointer"
                              >
                                ویرایش و اصلاح
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* Account requests list */}
                  {isAdmin && (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                      <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                        <h2 className="font-extrabold text-xs text-slate-700 dark:text-slate-200">درخواست‌های معلق عضویت نویسندگان</h2>
                      </div>
                      <div className="divide-y divide-slate-100">
                        {allRequests.filter(r => r.status === "pending").length === 0 ? (
                          <div className="p-6 text-center text-xs text-slate-400">هیچ درخواست معلقی یافت نشد.</div>
                        ) : (
                          allRequests.filter(r => r.status === "pending").map(req => (
                            <div key={req._id} className="p-4 flex flex-col sm:flex-row justify-between gap-4">
                              <div>
                                <h4 className="font-bold text-xs text-slate-700 dark:text-slate-200">{req.name}</h4>
                                <p className="text-[10px] text-slate-400">{req.email}</p>
                                <p className="text-[10px] text-slate-500 mt-1 italic">{req.bio || "توضیحاتی ثبت نشده"}</p>
                              </div>
                              <div className="flex gap-2 shrink-0 self-end">
                                <button 
                                  onClick={() => handleApproveRequest(req._id)}
                                  className="px-3 py-1 bg-teal-500 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                                >
                                  تأیید و ایجاد اکانت
                                </button>
                                <button 
                                  onClick={() => handleRejectRequest(req._id)}
                                  className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500 rounded-lg text-[10px] font-bold cursor-pointer"
                                >
                                  رد کردن
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Left col: Pending password reset request queue */}
                {isAdmin && (
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                      <h3 className="font-bold text-xs text-slate-700 dark:text-slate-200 mb-4 flex items-center justify-between">
                        درخواست‌های فراموشی رمز
                        <span className="bg-amber-100 text-amber-700 text-[8px] font-extrabold px-1.5 py-0.5 rounded-full">اقدام فوری</span>
                      </h3>
                      <div className="space-y-3">
                        {resetRequests.length === 0 ? (
                          <p className="text-xs text-slate-400">هیچ درخواست فراموشی رمزی ثبت نشده است.</p>
                        ) : (
                          resetRequests.map(user => (
                            <div key={user._id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                              <div className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">{user.name}</div>
                              <div className="text-[10px] text-slate-400">{user.email}</div>
                              <button 
                                onClick={() => handleApprovePasswordReset(user._id || user.id)}
                                className="mt-2 w-full py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-[9px] font-black cursor-pointer"
                              >
                                تایید و ارائه پسورد موقت جدید
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === "posts" ? (
            /* --- POSTS MANAGER --- */
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">لیست مطالب علمی شما</span>
                <button 
                  onClick={handleStartNewPost}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  ثبت پست علمی جدید
                </button>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900 text-slate-400 text-[10px] uppercase tracking-wider">
                      <th className="px-6 py-4 font-extrabold">عنوان مقاله</th>
                      <th className="px-6 py-4 font-extrabold">مبحث درس</th>
                      <th className="px-6 py-4 font-extrabold">وضعیت انتشار</th>
                      <th className="px-6 py-4 font-extrabold">آخرین بروزرسانی</th>
                      <th className="px-6 py-4 font-extrabold text-left">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {allPosts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-400 text-xs">
                          هنوز هیچ پستی ثبت نشده است. همین حالا اولین پست را بنویسید!
                        </td>
                      </tr>
                    ) : (
                      allPosts.map(post => (
                        <tr key={post._id} className="hover:bg-slate-50 dark:bg-slate-900/50 transition-colors">
                          <td className="px-6 py-3.5 font-bold text-slate-800 dark:text-slate-100">{post.title}</td>
                          <td className="px-6 py-3.5 text-slate-400 font-semibold">{post.course?.title || "سایر"}</td>
                          <td className="px-6 py-3.5">
                            {post.status === "published" ? (
                              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md font-bold text-[10px]">منتشر شده</span>
                            ) : post.status === "pending" ? (
                              <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-md font-bold text-[10px]">در انتظار تایید</span>
                            ) : (
                              <div className="space-y-1">
                                <span className="px-2.5 py-1 bg-rose-50 text-rose-700 rounded-md font-bold text-[10px]">رد شده</span>
                                {post.rejectionReason && (
                                  <p className="text-[9px] text-rose-500 max-w-xs">{post.rejectionReason}</p>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-3.5 text-slate-400 font-mono text-[10px]">
                            {new Date(post.updatedAt || post.createdAt || "").toLocaleDateString("fa-IR")}
                          </td>
                          <td className="px-6 py-3.5 text-left shrink-0">
                            <button 
                              onClick={() => handleStartEditPost(post)}
                              className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-teal-600 hover:border-teal-100 rounded-lg font-bold text-[10px] cursor-pointer"
                            >
                              ویرایش مجدد
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === "courses" ? (
            /* --- COURSES MANAGER (ADMIN ONLY) --- */
            <div className="space-y-8">
              {/* Add New Course form */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                <h3 className="font-extrabold text-xs text-slate-700 dark:text-slate-200 border-r-4 border-teal-500 pr-2">افزودن درس دانشگاهی و آکادمیک جدید</h3>
                <form onSubmit={handleCreateCourse} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500">عنوان درس</label>
                      <input 
                        type="text"
                        value={newCourseTitle}
                        onChange={(e) => setNewCourseTitle(e.target.value)}
                        placeholder="مثال: دندانپزشکی ترمیمی تخصصی"
                        className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500">توضیحات کوتاه</label>
                      <input 
                        type="text"
                        value={newCourseDesc}
                        onChange={(e) => setNewCourseDesc(e.target.value)}
                        placeholder="مثال: اصول و پروتکل‌های پیشرفته ادهزیو دندانی"
                        className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500">سرفصل‌های زیرمجموعه (یکی یکی اضافه کنید)</label>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={syllabusInput}
                        onChange={(e) => setSyllabusInput(e.target.value)}
                        placeholder="مثال: اصول تراش لمینیت سرامیکی"
                        className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                      />
                      <button 
                        type="button"
                        onClick={handleAddSyllabusItem}
                        className="px-4 py-2 bg-slate-100 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg cursor-pointer"
                      >
                        + افزودن سرفصل
                      </button>
                    </div>
                    
                    {newCourseSyllabus.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {newCourseSyllabus.map((item, idx) => (
                          <span key={idx} className="bg-teal-50 border border-teal-100 text-teal-700 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                            {item}
                            <button 
                              type="button"
                              onClick={() => setNewCourseSyllabus(prev => prev.filter((_, i) => i !== idx))}
                              className="text-teal-900 font-bold hover:text-rose-600 text-xs shrink-0"
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    ثبت و ذخیره درس در دیتابیس
                  </button>
                </form>
              </div>

              {/* Course lists */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900 text-slate-400 text-[10px]">
                      <th className="px-6 py-3.5 font-bold">نام درس</th>
                      <th className="px-6 py-3.5 font-bold">توضیحات</th>
                      <th className="px-6 py-3.5 font-bold">تعداد سرفصل‌ها</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {allCourses.map(course => (
                      <tr key={course._id} className="hover:bg-slate-50 dark:bg-slate-900/50">
                        <td className="px-6 py-3 font-bold text-slate-800 dark:text-slate-100">{course.title}</td>
                        <td className="px-6 py-3 text-slate-400">{course.description || "سرفصل مصوب"}</td>
                        <td className="px-6 py-3 text-teal-600 font-extrabold">{course.syllabus?.length || 0} مبحث مرجع</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === "siteSettings" ? (
            /* --- SITE SETTINGS (ADMIN ONLY) --- */
            <div className="max-w-2xl bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <h3 className="font-extrabold text-xs text-slate-700 dark:text-slate-200 mb-6 border-r-4 border-teal-500 pr-2">تنظیمات کلان آکادمی دنتالفای</h3>
              <form onSubmit={handleSettingsSubmit} className="space-y-6 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500">نام آکادمی (برند)</label>
                    <input 
                      type="text" 
                      value={siteNameInput}
                      onChange={(e) => setSiteNameInput(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500">ایمیل پشتیبانی آکادمی</label>
                    <input 
                      type="email" 
                      value={contactEmailInput}
                      onChange={(e) => setContactEmailInput(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-left focus:outline-none focus:border-teal-500"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500">متن سربرگ صفحه اصلی (Hero Title)</label>
                  <input 
                    type="text" 
                    value={heroTextInput}
                    onChange={(e) => setHeroTextInput(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500">کد بازیابی اضطراری مدیر (Admin Recovery Code)</label>
                    <input 
                      type="text" 
                      value={adminRecoveryCodeInput}
                      onChange={(e) => setAdminRecoveryCodeInput(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-center focus:outline-none focus:border-teal-500 text-rose-500 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500">تغییر رمز ورود مدیر سایت</label>
                    <input 
                      type="password" 
                      value={adminPasswordInput}
                      onChange={(e) => setAdminPasswordInput(e.target.value)}
                      placeholder="رمز جدید را وارد کنید..."
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                {/* Color definitions */}
                <div className="space-y-2.5 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <span className="font-bold text-slate-600 dark:text-slate-300 block mb-2">شخصی‌سازی کدهای رنگی کلینیک</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1 text-center">
                      <span className="text-[9px] text-slate-400 font-bold">رنگ فیروزه‌ای</span>
                      <input 
                        type="color" 
                        value={primaryColorInput}
                        onChange={(e) => setPrimaryColorInput(e.target.value)}
                        className="w-full h-8 rounded border border-slate-200 dark:border-slate-700 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1 text-center">
                      <span className="text-[9px] text-slate-400 font-bold">رنگ تیره (نعنایی)</span>
                      <input 
                        type="color" 
                        value={secondaryColorInput}
                        onChange={(e) => setSecondaryColorInput(e.target.value)}
                        className="w-full h-8 rounded border border-slate-200 dark:border-slate-700 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1 text-center">
                      <span className="text-[9px] text-slate-400 font-bold">رنگ آبی کلینیکی</span>
                      <input 
                        type="color" 
                        value={clinicalBlueInput}
                        onChange={(e) => setClinicalBlueInput(e.target.value)}
                        className="w-full h-8 rounded border border-slate-200 dark:border-slate-700 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-xl transition-all cursor-pointer"
                >
                  ذخیره تغییرات در دیتابیس MongoDB
                </button>
              </form>
            </div>
          ) : activeTab === "comments" ? (
            /* --- COMMENTS & QUESTIONS MODERATION TAB --- */
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                <h3 className="font-extrabold text-xs text-slate-700 dark:text-slate-200 border-r-4 border-teal-500 pr-2">مدیریت و پاسخ‌دهی به پرسش‌های بالینی دندانپزشکی</h3>
                <p className="text-slate-400 text-[10px] leading-relaxed">پزشکان همکار و مدیران علمی می‌توانند به صورت کاملاً زنده به پرسش‌های دانشجویان، رزیدنت‌ها و مراجعین پاسخ تخصصی ارسال نمایند.</p>
              </div>

              <div className="space-y-4">
                {allComments.length === 0 ? (
                  <div className="bg-white dark:bg-slate-800 p-8 text-center rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-400 text-xs font-semibold">
                    هیچ پرسش بالینی یافت نشد.
                  </div>
                ) : (
                  allComments.map(comment => {
                    const linkedPost = allPosts.find(p => p._id === comment.postId);
                    return (
                      <div key={comment._id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 font-extrabold text-xs flex items-center justify-center">
                              {comment.name[0]}
                            </span>
                            <div>
                              <h4 className="font-extrabold text-xs text-slate-700 dark:text-slate-200">{comment.name} ({comment.email})</h4>
                              <span className="text-[9px] text-slate-400 font-mono">
                                ثبت شده در تاریخ {new Date(comment.createdAt).toLocaleDateString("fa-IR")}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {linkedPost && (
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 dark:text-slate-300">
                                مربوط به مقاله: {linkedPost.title}
                              </span>
                            )}
                            <button 
                              onClick={() => handleCommentDelete(comment._id)}
                              className="p-1.5 hover:bg-rose-50 text-rose-500 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                              title="حذف دیدگاه"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pr-10 whitespace-pre-line">{comment.text}</p>

                        {/* Existing reply display */}
                        {comment.reply ? (
                          <div className="mr-10 p-3.5 bg-teal-50/50 border border-teal-100/30 rounded-xl space-y-1">
                            <span className="text-[9px] font-bold text-teal-800">پاسخ ثبت شده توسط {comment.repliedBy || "مدیر علمی"}:</span>
                            <p className="text-xs text-teal-950/80 leading-relaxed">{comment.reply}</p>
                          </div>
                        ) : (
                          <div className="mr-10 pt-2">
                            {replyCommentId === comment._id ? (
                              <div className="space-y-2">
                                <textarea 
                                  value={replyTextInput}
                                  onChange={(e) => setReplyTextInput(e.target.value)}
                                  placeholder="پاسخ تخصصی دندانپزشکی خود را بنویسید..."
                                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-teal-500 h-20 resize-none"
                                />
                                <div className="flex gap-2 justify-end">
                                  <button 
                                    onClick={() => setReplyCommentId(null)}
                                    className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:bg-slate-900 rounded-lg text-[10px] font-bold cursor-pointer"
                                  >
                                    انصراف
                                  </button>
                                  <button 
                                    onClick={() => handleCommentReplySubmit(comment._id)}
                                    className="px-3 py-1.5 bg-teal-600 text-white hover:bg-teal-700 rounded-lg text-[10px] font-bold cursor-pointer"
                                  >
                                    ثبت پاسخ علمی
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button 
                                onClick={() => { setReplyCommentId(comment._id); setReplyTextInput(""); }}
                                className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg text-[10px] font-extrabold transition-colors cursor-pointer"
                              >
                                ثبت پاسخ پزشک
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ) : activeTab === "requests" ? (
            /* --- WRITER REGISTRATION REQUESTS TAB (ADMIN ONLY) --- */
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                <h3 className="font-extrabold text-xs text-slate-700 dark:text-slate-200 border-r-4 border-teal-500 pr-2">مدیریت درخواست‌های نویسندگی و عضویت متخصصین</h3>
                <p className="text-slate-400 text-[10px] leading-relaxed">درخواست‌های معلق پزشکان، دندانپزشکان و متخصصینی که تقاضای عضویت در تیم نویسندگان دنتالفای را ثبت کرده‌اند در این بخش نمایش داده می‌شود. تایید هر درخواست به طور خودکار اکانت نویسندگی فعال برای ایشان صادر می‌نماید.</p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] uppercase font-black text-slate-500">لیست کلی درخواست‌ها</span>
                  <span className="text-[10px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded-full">{allRequests.length} درخواست ثبت شده</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {allRequests.length === 0 ? (
                    <div className="p-12 text-center text-xs text-slate-400 font-semibold">هیچ درخواستی در سامانه ثبت نشده است.</div>
                  ) : (
                    allRequests.map(req => (
                      <div key={req._id} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50 dark:bg-slate-900/40 transition-colors">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-100">{req.name}</h4>
                            <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${
                              req.status === "pending" ? "bg-amber-100 text-amber-700" :
                              req.status === "approved" ? "bg-teal-100 text-teal-700" :
                              "bg-rose-100 text-rose-700"
                            }`}>
                              {req.status === "pending" ? "در انتظار بررسی" :
                               req.status === "approved" ? "تأیید شده (فعال)" :
                               "رد شده"}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-mono">{req.email}</p>
                          <div className="text-[10px] text-slate-500 mt-2 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 italic max-w-xl">
                            {req.bio || "بیوگرافی یا توضیحات علمی ارائه نشده است."}
                          </div>
                        </div>

                        {req.status === "pending" && (
                          <div className="flex gap-2 shrink-0 self-end sm:self-center">
                            <button 
                              onClick={() => handleApproveRequest(req._id)}
                              className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-[10px] font-black cursor-pointer shadow-sm shadow-teal-600/10 transition-all"
                            >
                              تأیید و صدور پنل نویسنده
                            </button>
                            <button 
                              onClick={() => handleRejectRequest(req._id)}
                              className="px-3.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-rose-50 border border-slate-200 dark:border-slate-700 hover:border-rose-200 text-slate-500 hover:text-rose-600 rounded-xl text-[10px] font-bold cursor-pointer transition-all"
                            >
                              رد درخواست
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : activeTab === "libraryAndFaqs" ? (
            /* --- LIBRARY AND FAQS MANAGEMENT TAB (ADMIN ONLY) --- */
            <div className="space-y-8">
              {/* Clinical Library Manager */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
                <h3 className="font-extrabold text-xs text-slate-700 dark:text-slate-200 border-r-4 border-teal-500 pr-2">مدیریت کتابخانه بالینی و اسناد مطب</h3>
                
                <form onSubmit={handleCreateLibraryDoc} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 items-end">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500">عنوان سند / فرم پزشکی</label>
                    <input 
                      type="text" 
                      value={newLibraryTitle}
                      onChange={(e) => setNewLibraryTitle(e.target.value)}
                      placeholder="مثال: چک‌لیست استریلیزاسیون اتوکلاو"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1 relative">
                    <label className="text-[10px] font-bold text-slate-500">فایل ضمیمه سند (PDF)</label>
                    <div className="w-full h-9 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center relative hover:bg-slate-50 dark:bg-slate-900 cursor-pointer overflow-hidden">
                      <input 
                        type="file" 
                        accept=".pdf"
                        onChange={handleLibraryFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        required
                      />
                      <span className="text-[10px] text-slate-500 font-bold">
                        {newLibraryFile ? "فایل انتخاب شد" : "انتخاب فایل PDF"}
                      </span>
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-teal-600/10"
                  >
                    افزودن به کتابخانه عمومی
                  </button>
                </form>

                <div className="divide-y divide-slate-100">
                  {allLibraryDocs.length === 0 ? (
                    <p className="text-center text-xs text-slate-400 py-4 font-semibold">هیچ سندی در کتابخانه عمومی یافت نشد.</p>
                  ) : (
                    allLibraryDocs.map(doc => (
                      <div key={doc._id} className="py-3 flex items-center justify-between">
                        <div>
                          <h4 className="font-extrabold text-xs text-slate-700 dark:text-slate-200">{doc.title}</h4>
                          <span className="text-[9px] text-slate-400 font-mono">{doc.size || "1.0 MB"} • فرمت PDF</span>
                        </div>
                        <button 
                          onClick={() => handleDeleteLibraryDoc(doc._id)}
                          className="p-1.5 hover:bg-rose-50 text-rose-500 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                          title="حذف سند"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* FAQ Manager */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
                <h3 className="font-extrabold text-xs text-slate-700 dark:text-slate-200 border-r-4 border-teal-500 pr-2">مدیریت سوالات متداول دانشجویان و دندانپزشکان</h3>
                
                <form onSubmit={handleCreateFAQ} className="space-y-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500">متن سوال (Question)</label>
                    <input 
                      type="text" 
                      value={newFaqQuestion}
                      onChange={(e) => setNewFaqQuestion(e.target.value)}
                      placeholder="چه موضوعاتی در دنتالفای بررسی می‌شوند؟"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500">متن پاسخ کوتاه (Answer)</label>
                    <textarea 
                      value={newFaqAnswer}
                      onChange={(e) => setNewFaqAnswer(e.target.value)}
                      placeholder="پاسخ کوتاه و علمی متناسب را درج کنید..."
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs h-16 resize-none"
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <button 
                      type="submit"
                      className="py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-teal-600/10"
                    >
                      افزودن سوال متداول
                    </button>
                  </div>
                </form>

                <div className="divide-y divide-slate-100">
                  {allFaqs.length === 0 ? (
                    <p className="text-center text-xs text-slate-400 py-4 font-semibold">هیچ سوال متداولی ثبت نشده است.</p>
                  ) : (
                    allFaqs.map(faq => (
                      <div key={faq._id} className="py-4 space-y-1">
                        <div className="flex items-start justify-between">
                          <h4 className="font-bold text-xs text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                            <HelpCircle className="w-4 h-4 text-teal-600" />
                            {faq.question}
                          </h4>
                          <button 
                            onClick={() => handleDeleteFAQ(faq._id)}
                            className="p-1.5 hover:bg-rose-50 text-rose-500 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                            title="حذف سوال"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-400 pr-5 leading-relaxed">{faq.answer}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : activeTab === ("users" as any) ? (
            /* --- USERS MANAGEMENT TAB --- */
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                <h3 className="font-extrabold text-xs text-slate-700 dark:text-slate-200 border-r-4 border-teal-500 pr-2">لیست کاربران (نویسندگان و دانشجویان)</h3>
                <p className="text-[11px] text-slate-400">در این بخش می‌توانید حساب‌های کاربری را مشاهده و مدیریت کنید.</p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900 text-slate-400 text-[10px] uppercase tracking-wider">
                      <th className="px-6 py-4 font-extrabold">نام کاربر</th>
                      <th className="px-6 py-4 font-extrabold">ایمیل</th>
                      <th className="px-6 py-4 font-extrabold">وضعیت حساب</th>
                      <th className="px-6 py-4 font-extrabold">نقش سیستم</th>
                      <th className="px-6 py-4 font-extrabold text-left">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {allUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-400 text-xs">
                          هیچ کاربری یافت نشد.
                        </td>
                      </tr>
                    ) : (
                      allUsers.map(user => (
                        <tr key={user._id || user.id} className="hover:bg-slate-50 dark:bg-slate-900/50 transition-colors">
                          <td className="px-6 py-3.5 flex items-center gap-3 font-bold text-slate-800 dark:text-slate-100">
                            <img src={user.profilePicture || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200"} className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700" alt={user.name} />
                            <span>{user.name}</span>
                          </td>
                          <td className="px-6 py-3.5 text-slate-400 font-semibold">{user.email}</td>
                          <td className="px-6 py-3.5">
                            {user.isSuspended ? (
                              <span className="px-2.5 py-1 bg-rose-50 text-rose-700 rounded-md font-bold text-[10px]">تعلیق شده</span>
                            ) : (
                              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md font-bold text-[10px]">فعال</span>
                            )}
                          </td>
                          <td className="px-6 py-3.5 text-slate-500 font-bold uppercase text-[10px]">{user.role === 'author' ? 'نویسنده علمی' : user.role === 'admin' ? 'مدیر سیستم' : 'دانشجو'}</td>
                          <td className="px-6 py-3.5 text-left shrink-0">
                            <div className="flex gap-2 justify-end">
                              <button 
                                onClick={() => {
                                  setSelectedUserToChangePassword(user);
                                  setNewPasswordForUser("");
                                }}
                                className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-teal-600 hover:border-teal-100 rounded-lg font-bold text-[10px] cursor-pointer"
                              >
                                تغییر دستی رمز
                              </button>
                              
                              {user.isSuspended ? (
                                <button 
                                  onClick={async () => {
                                    if (!confirm(`آیا می‌خواهید حساب ${user.name} را فعال کنید؟`)) return;
                                    try {
                                      const res = await fetch("/api/users/action", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ userId: user.id || user._id, action: "unsuspend" })
                                      });
                                      if (res.ok) {
                                        showMessage(`حساب ${user.name} با موفقیت فعال شد.`);
                                        fetchAdminLists();
                                      }
                                    } catch (err) {
                                      alert("خطا در ارتباط با سرور");
                                    }
                                  }}
                                  className="px-2.5 py-1 bg-emerald-500 text-white hover:bg-emerald-600 rounded-lg font-bold text-[10px] cursor-pointer"
                                >
                                  فعال‌سازی مجدد
                                </button>
                              ) : (
                                <button 
                                  onClick={async () => {
                                    if (!confirm(`آیا از تعلیق حساب ${user.name} اطمینان دارید؟ در این صورت نویسنده دیگر امکان ورود به سیستم را نخواهد داشت.`)) return;
                                    try {
                                      const res = await fetch("/api/users/action", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ userId: user.id || user._id, action: "suspend" })
                                      });
                                      if (res.ok) {
                                        showMessage(`حساب ${user.name} با موفقیت تعلیق شد.`);
                                        fetchAdminLists();
                                      }
                                    } catch (err) {
                                      alert("خطا در ارتباط با سرور");
                                    }
                                  }}
                                  className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-rose-100 text-rose-500 hover:bg-rose-50 rounded-lg font-bold text-[10px] cursor-pointer"
                                >
                                  تعلیق موقت حساب
                                </button>
                              )}

                              <button 
                                onClick={async () => {
                                  if (!confirm(`آیا از حذف دائم حساب ${user.name} اطمینان دارید؟ این عمل غیرقابل بازگشت است.`)) return;
                                  try {
                                    const res = await fetch("/api/users/action", {
                                      method: "POST",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ userId: user.id || user._id, action: "delete" })
                                    });
                                    if (res.ok) {
                                      showMessage(`نویسنده ${user.name} با موفقیت حذف شد.`);
                                      fetchAdminLists();
                                    }
                                  } catch (err) {
                                    alert("خطا در ارتباط با سرور");
                                  }
                                }}
                                className="px-2 py-1 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="حذف دائم"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* --- PROFILE TAB --- */
            <div className="max-w-xl bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-6">
              <h3 className="font-extrabold text-xs text-slate-700 dark:text-slate-200 border-r-4 border-teal-500 pr-2">تنظیمات امنیتی و پروفایل من</h3>
              
              <form onSubmit={handleProfileSubmit} className="space-y-6 text-xs">
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500">نام و نام خانوادگی پزشک</label>
                  <input 
                    type="text" 
                    value={profileNameInput}
                    onChange={(e) => setProfileNameInput(e.target.value)}
                    placeholder="مثال: دکتر علیرضا رضایی"
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500">آدرس ایمیل</label>
                  <input 
                    type="email" 
                    value={profileEmailInput}
                    onChange={(e) => setProfileEmailInput(e.target.value)}
                    placeholder="example@dentalfy.ir"
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-left font-mono"
                    dir="ltr"
                    required
                  />
                </div>

                {/* Photo Drag & Drop / manual select / Link */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500">عکس پروفایل پزشک</label>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-teal-500 bg-slate-100 shrink-0 shadow-inner">
                      <img src={profilePicLinkInput.trim() || profilePicBase64 || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200"} alt="آواتار" className="w-full h-full object-cover" />
                    </div>
                    <div 
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleFileChange(e, "profile")}
                      className="flex-1 border border-dashed border-slate-200 dark:border-slate-700 hover:border-teal-500 p-4 text-center rounded-xl bg-slate-50 dark:bg-slate-900 cursor-pointer relative transition-colors"
                    >
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "profile")}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                      <span className="font-bold text-slate-600 dark:text-slate-300 block text-[11px]">بکشید و رها کنید یا کلیک کنید</span>
                      <span className="text-[9px] text-slate-400">ذخیره ایمن به عنوان فایل تصویر</span>
                    </div>
                  </div>

                  <div className="space-y-1 pt-1">
                    <label className="text-[9px] font-bold text-slate-400">یا لینک مستقیم تصویر پروفایل را وارد کنید:</label>
                    <input 
                      type="text" 
                      value={profilePicLinkInput}
                      onChange={(e) => setProfilePicLinkInput(e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-left font-mono"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500">رمز عبور شخصی جدید (تنها در صورت تمایل به تغییر)</label>
                  <input 
                    type="password" 
                    value={profilePasswordInput}
                    onChange={(e) => setProfilePasswordInput(e.target.value)}
                    placeholder="کلمه عبور جدید را وارد کنید..."
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                  />
                </div>

                {profileMsg && (
                  <div className="p-3 bg-teal-50 text-teal-700 rounded-lg text-xs font-semibold text-center">
                    {profileMsg}
                  </div>
                )}

                <button 
                  type="submit"
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-xl transition-all cursor-pointer"
                >
                  ذخیره اطلاعات من
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Footer Branding of Admin Console */}
        <footer className="h-12 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-8 flex items-center justify-between shrink-0 text-[10px] text-slate-400 font-semibold uppercase tracking-widest">
          <span>RMO Cloud Management Node ID: dntlf-srv-2026</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> SYSTEM: ONLINE
          </span>
        </footer>
      </main>

      {/* Rejection Modal */}
      {rejectionModalPostId && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">توضیح بازخورد عدم تایید مقاله</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">لطفاً دلیل علمی، بالینی یا ساختاری رد این پست را با جزئیات بنویسید تا نویسنده برای انتشار مجدد اصلاح کند.</p>
            <textarea 
              value={rejectionReasonInput}
              onChange={(e) => setRejectionReasonInput(e.target.value)}
              placeholder="مثال: لزوم استفاده از تصاویر تراش دندان با وضوح بالاتر..."
              className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs h-24 focus:outline-none focus:border-rose-500"
            />
            <div className="flex gap-2">
              <button 
                onClick={handleRejectPostSubmit}
                className="flex-1 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                ارسال رد پست
              </button>
              <button 
                onClick={() => setRejectionModalPostId(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl cursor-pointer"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Action Modal */}
      {requestActionModal && requestActionModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${requestActionModal.action === "approve" ? "bg-teal-50 text-teal-600" : "bg-rose-50 text-rose-600"}`}>
              {requestActionModal.action === "approve" ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
            </div>
            <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 text-center">
              {requestActionModal.action === "approve" ? "تأیید درخواست عضویت هیئت علمی" : "رد درخواست عضویت هیئت علمی"}
            </h4>
            <p className="text-[11px] text-slate-500 text-center">
              {requestActionModal.action === "approve" ? "آیا از تأیید این درخواست مطمئن هستید؟ یک ایمیل حاوی پیام شما ارسال خواهد شد." : "آیا از رد این درخواست مطمئن هستید؟ ایمیل اطلاع‌رسانی ارسال خواهد شد."}
            </p>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-300 block">پیام شما برای نویسنده (در ایمیل قرار می‌گیرد)</label>
              <textarea 
                value={requestActionModal.message}
                onChange={(e) => setRequestActionModal({ ...requestActionModal, message: e.target.value })}
                placeholder={requestActionModal.action === "approve" ? "همکار گرامی، عضویت شما تایید شد..." : "متاسفانه امکان تایید وجود ندارد..."}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs min-h-[80px]"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button 
                onClick={submitRequestAction}
                className={`flex-1 py-2 text-white text-xs font-bold rounded-xl cursor-pointer ${requestActionModal.action === "approve" ? "bg-teal-600 hover:bg-teal-700" : "bg-rose-500 hover:bg-rose-600"}`}
              >
                تأیید نهایی و ارسال ایمیل
              </button>
              <button 
                onClick={() => setRequestActionModal(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal for Admin */}
      {selectedUserToChangePassword && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">تغییر دستی رمز عبور</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              تغییر رمز عبور نویسنده: <strong className="text-slate-700 dark:text-slate-200">{selectedUserToChangePassword.name}</strong> ({selectedUserToChangePassword.email})
            </p>
            <input 
              type="text" 
              value={newPasswordForUser}
              onChange={(e) => setNewPasswordForUser(e.target.value)}
              placeholder="رمز عبور جدید (حداقل ۴ کاراکتر)..."
              className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-teal-500"
            />
            <div className="flex gap-2">
              <button 
                onClick={async () => {
                  if (!newPasswordForUser || newPasswordForUser.trim().length < 4) {
                    alert("رمز عبور جدید باید حداقل ۴ کاراکتر باشد");
                    return;
                  }
                  try {
                    const res = await fetch("/api/users/action", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ userId: selectedUserToChangePassword.id || selectedUserToChangePassword._id, action: "changePassword", newPassword: newPasswordForUser.trim() })
                    });
                    if (res.ok) {
                      showMessage("رمز عبور با موفقیت به صورت دستی تغییر یافت.");
                      setSelectedUserToChangePassword(null);
                      setNewPasswordForUser("");
                      fetchAdminLists();
                    } else {
                      const data = await res.json();
                      alert(data.error || "خطا در تغییر رمز");
                    }
                  } catch (err) {
                    alert("خطا در اتصال به سرور");
                  }
                }}
                className="flex-1 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                ثبت رمز عبور جدید
              </button>
              <button 
                onClick={() => {
                  setSelectedUserToChangePassword(null);
                  setNewPasswordForUser("");
                }}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl cursor-pointer"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
