import React, { useState, useEffect } from "react";
import { 
  Shield, BookOpen, FileText, Users, Settings, LogOut, Menu, X, 
  PlusCircle, Trash2, CheckCircle, XCircle, ChevronLeft, ChevronUp, ChevronDown, 
  Upload, Download, HelpCircle, Lock, User, UserCog, RefreshCw, Eye, MessageSquare, Sparkles, Activity,
  Key, Unlock, Camera, Award, Grid, Search, Filter, ShieldCheck, CheckSquare, Square, UserCheck, AlertCircle
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
  const [activeTab, setActiveTab] = useState<"dashboard" | "posts" | "courses" | "requests" | "siteSettings" | "profile" | "comments" | "libraryAndFaqs" | "users">("dashboard");
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
  const [profileGenderInput, setProfileGenderInput] = useState(currentUser.gender || "");
  const [profilePicLinkInput, setProfilePicLinkInput] = useState("");
  const [profilePasswordInput, setProfilePasswordInput] = useState("");
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [oldPasswordInput, setOldPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");

  // Block Editor states
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
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
  const [customConfirm, setCustomConfirm] = useState<{
    title: string;
    message: string;
    onConfirm: () => void | Promise<void>;
  } | null>(null);

  // Users lists & user action states (RBAC)
  const [allUsers, setAllUsers] = useState<IUser[]>([]);
  const [allAuthors, setAllAuthors] = useState<any[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [selectedUserForRoleModal, setSelectedUserForRoleModal] = useState<IUser | null>(null);
  const [targetRole, setTargetRole] = useState<"admin" | "editor" | "author" | "student">("author");
  const [targetPermissions, setTargetPermissions] = useState<string[]>([]);
  const [savingUserRole, setSavingUserRole] = useState(false);
  const [selectedUserToChangePassword, setSelectedUserToChangePassword] = useState<IUser | null>(null);
  const [newPasswordForUser, setNewPasswordForUser] = useState("");

  // Post Search and Author Filter states
  const [postSearchQuery, setPostSearchQuery] = useState("");
  const [postAuthorFilter, setPostAuthorFilter] = useState("all");
  const [postStatusFilter, setPostStatusFilter] = useState("all");

  // New Course Inputs
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseDesc, setNewCourseDesc] = useState("");
  const [newCourseSyllabus, setNewCourseSyllabus] = useState<string[]>([]);
  const [syllabusInput, setSyllabusInput] = useState("");

  // Quiz Management States
  const [selectedCourseForQuiz, setSelectedCourseForQuiz] = useState<ICourse | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [quizPassingPercentage, setQuizPassingPercentage] = useState<number>(70);
  const [isFetchingQuiz, setIsFetchingQuiz] = useState(false);
  const [isSavingQuiz, setIsSavingQuiz] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

  // Category Manager States
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [newCatParent, setNewCatParent] = useState("");
  const [isSavingCategory, setIsSavingCategory] = useState(false);

  // Security Audit Log States
  const [auditLogsList, setAuditLogsList] = useState<any[]>([]);
  const [isFetchingLogs, setIsFetchingLogs] = useState(false);

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

      // Fetch authors list
      const authRes = await fetch("/api/authors");
      if (authRes.ok) {
        const authData = await authRes.json();
        setAllAuthors(authData);
      }

      // Fetch all courses and posts
      const crsRes = await fetch("/api/courses");
      if (crsRes.ok) {
        const crsData = await crsRes.json();
        setAllCourses(crsData);
      }

      const queryUrl = isAdmin ? "/api/posts?role=admin" : `/api/posts?authorId=${currentUser.id || currentUser._id}`;
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

      // Fetch Categories
      const catRes = await fetch("/api/categories");
      if (catRes.ok) {
        const catData = await catRes.json();
        setAllCategories(catData);
      }

      // Fetch Security Audit Logs
      const auditRes = await fetch("/api/audit-logs");
      if (auditRes.ok) {
        const auditData = await auditRes.json();
        setAuditLogsList(auditData);
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

  // Helper to extract full text for block-level searching
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
        if (typeof b.value === "string") parts.push(b.value);
        else if (typeof b.value === "object") {
          if (b.value.text) parts.push(String(b.value.text));
          if (b.value.caption) parts.push(String(b.value.caption));
          if (b.value.author) parts.push(String(b.value.author));
          if (Array.isArray(b.value.items)) parts.push(b.value.items.join(" "));
        }
      });
    }
    return parts.join(" ").toLowerCase();
  };

  const filteredPostsList = allPosts.filter((post) => {
    // 1. Author Filter
    if (postAuthorFilter !== "all") {
      const aId = typeof post.author === "object" ? (post.author?._id || (post.author as any)?.id) : post.author;
      if (aId !== postAuthorFilter) return false;
    }

    // 2. Status Filter
    if (postStatusFilter !== "all") {
      if (post.status !== postStatusFilter) return false;
    }

    // 3. Full-Text Search
    if (postSearchQuery.trim()) {
      const q = postSearchQuery.trim().toLowerCase();
      const terms = q.split(/\s+/).filter(Boolean);
      const fullText = getPostFullText(post);
      const matches = terms.every(term => fullText.includes(term));
      if (!matches) return false;
    }

    return true;
  });

  const filteredUsersList = allUsers.filter((user) => {
    if (userRoleFilter !== "all") {
      if (userRoleFilter === "suspended") {
        if (!user.isSuspended) return false;
      } else {
        if (user.role !== userRoleFilter) return false;
      }
    }

    if (userSearchQuery.trim()) {
      const q = userSearchQuery.trim().toLowerCase();
      const matchName = (user.name || "").toLowerCase().includes(q);
      const matchEmail = (user.email || "").toLowerCase().includes(q);
      if (!matchName && !matchEmail) return false;
    }

    return true;
  });

  const handleOpenRoleModal = (user: IUser) => {
    setSelectedUserForRoleModal(user);
    setTargetRole((user.role as any) || "author");
    setTargetPermissions(user.permissions || []);
  };

  const handleSaveUserRole = async () => {
    if (!selectedUserForRoleModal) return;
    setSavingUserRole(true);
    try {
      const res = await fetch(`/api/users/${selectedUserForRoleModal.id || selectedUserForRoleModal._id}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: targetRole,
          permissions: targetPermissions,
          actorName: currentUser.name
        })
      });
      if (res.ok) {
        showMessage(`نقش و دسترسی‌های کاربر ${selectedUserForRoleModal.name} با موفقیت ذخیره شد.`);
        setSelectedUserForRoleModal(null);
        fetchAdminLists();
      } else {
        const data = await res.json();
        alert(data.error || "خطا در بروزرسانی نقش");
      }
    } catch (err) {
      alert("خطا در برقراری ارتباط با سرور");
    } finally {
      setSavingUserRole(false);
    }
  };

  const AVAILABLE_PERMISSIONS = [
    { key: "posts:create", label: "نگارش و ایجاد مقالات علمی جدید", group: "مقالات" },
    { key: "posts:publish", label: "انتشار مستقیم مقالات بدون نیاز به تایید مدیریت", group: "مقالات" },
    { key: "posts:edit_all", label: "ویرایش و بازبینی مقالات تمامی نویسندگان", group: "مقالات" },
    { key: "posts:delete", label: "حذف مقالات علمی از سیستم", group: "مقالات" },
    { key: "courses:manage", label: "مدیریت و ایجاد سرفصل‌ها و دروس آکادمیک", group: "دروس" },
    { key: "comments:manage", label: "تایید، پاسخ و مدیریت دیدگاه‌های کاربران", group: "دیدگاه‌ها" },
    { key: "users:manage", label: "مدیریت کاربران، تغییر نقش و ارزیابی دسترسی‌ها", group: "کاربران" },
    { key: "settings:manage", label: "تنظیمات عمومی سامانه، تغییر نام و قالب سایت", group: "سیستم" }
  ];

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
          userId: currentUser.id || currentUser._id,
          name: profileNameInput,
          email: profileEmailInput,
          oldPassword: oldPasswordInput || undefined,
          newPassword: newPasswordInput || undefined,
          profilePicture: finalPic
        })
      });
      if (res.ok) {
        setProfileMsg("پروفایل کاربری با موفقیت بروزرسانی شد.");
        setOldPasswordInput("");
        setNewPasswordInput("");
        setConfirmPasswordInput("");
        onRefreshData();
      } else {
        const data = await res.json();
        setProfileMsg(data.error || "تغییرات ثبت نشد.");
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

  // Submit / Update Course (Admin)
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle) return;

    try {
      const endpoint = editingCourseId ? "/api/courses/update" : "/api/courses/create";
      const payload = editingCourseId 
        ? { courseId: editingCourseId, title: newCourseTitle, description: newCourseDesc, syllabus: newCourseSyllabus }
        : { title: newCourseTitle, description: newCourseDesc, syllabus: newCourseSyllabus };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showMessage(editingCourseId ? "دوره با موفقیت بروزرسانی شد." : "درس جدید با موفقیت به سرفصل‌های آکادمی افزوده شد.");
        setNewCourseTitle("");
        setNewCourseDesc("");
        setNewCourseSyllabus([]);
        setEditingCourseId(null);
        fetchAdminLists();
      }
    } catch (err) {
      alert("خطا در ثبت اطلاعات درس.");
    }
  };

  const handleStartEditCourse = (course: ICourse) => {
    setEditingCourseId(course._id);
    setNewCourseTitle(course.title);
    setNewCourseDesc(course.description || "");
    setNewCourseSyllabus(course.syllabus || []);
    // Scroll to form or ensure visible
  };

  const handleDeleteCourse = async (courseId: string) => {
    setCustomConfirm({
      title: "حذف درس و سرفصل‌ها",
      message: "آیا از حذف این درس و تمامی سرفصل‌های آن اطمینان دارید؟ مقالات مربوطه بدون دسته‌بندی خواهند شد.",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/courses/${courseId}`, { method: "DELETE" });
          if (res.ok) {
            showMessage("درس با موفقیت حذف شد.");
            fetchAdminLists();
          }
        } catch (err) {
          alert("خطا در حذف درس.");
        }
      }
    });
  };

  const handleAddSyllabusItem = () => {
    if (!syllabusInput.trim()) return;
    setNewCourseSyllabus(prev => [...prev, syllabusInput.trim()]);
    setSyllabusInput("");
  };

  // --- QUIZ MANAGEMENT HANDLERS ---
  const handleManageQuiz = async (course: ICourse) => {
    setSelectedCourseForQuiz(course);
    setIsFetchingQuiz(true);
    setQuizQuestions([]);
    setQuizPassingPercentage(70);
    try {
      const res = await fetch(`/api/courses/${course._id}/quiz`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.questions) {
          setQuizQuestions(data.questions);
          setQuizPassingPercentage(data.passingPercentage || 70);
        } else {
          // If no quiz exists, set standard empty array
          setQuizQuestions([]);
        }
      }
    } catch (err) {
      console.error("Error fetching quiz:", err);
    } finally {
      setIsFetchingQuiz(false);
    }
  };

  const handleSaveQuizManual = async () => {
    if (!selectedCourseForQuiz) return;
    setIsSavingQuiz(true);
    try {
      const res = await fetch(`/api/courses/${selectedCourseForQuiz._id}/quiz/manual`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questions: quizQuestions,
          passingPercentage: quizPassingPercentage
        })
      });
      if (res.ok) {
        showMessage("آزمون تالیفی با موفقیت در سیستم ثبت گردید.");
      } else {
        alert("خطا در ذخیره‌سازی آزمون.");
      }
    } catch (err) {
      console.error(err);
      alert("خطا در برقراری ارتباط.");
    } finally {
      setIsSavingQuiz(false);
    }
  };

  const handleGenerateAILiveQuiz = async () => {
    if (!selectedCourseForQuiz) return;
    setIsGeneratingQuiz(true);
    try {
      const res = await fetch(`/api/courses/${selectedCourseForQuiz._id}/quiz/generate-ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.quiz && data.quiz.questions) {
          setQuizQuestions(data.quiz.questions);
          setQuizPassingPercentage(data.quiz.passingPercentage || 70);
          showMessage("✨ آزمون تخصصی هوشمند دندانپزشکی بر اساس سرفصل علمی با موفقیت توسط هوش مصنوعی تالیف شد!");
        }
      } else {
        alert("خطا در تالیف هوشمند آزمون.");
      }
    } catch (err) {
      console.error(err);
      alert("خطا در اتصال به موتور هوش مصنوعی.");
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  // --- CATEGORY MANAGER HANDLERS ---
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName || !newCatSlug) return;
    setIsSavingCategory(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCatName,
          slug: newCatSlug,
          parent: newCatParent || null
        })
      });
      if (res.ok) {
        showMessage(`دسته‌بندی تخصصی "${newCatName}" با موفقیت تعریف شد.`);
        setNewCatName("");
        setNewCatSlug("");
        setNewCatParent("");
        fetchAdminLists();
      } else {
        alert("خطا در ثبت دسته‌بندی.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    setCustomConfirm({
      title: "حذف دسته‌بندی علمی",
      message: "آیا از حذف این دسته‌بندی علمی اطمینان دارید؟",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/categories/${catId}`, { method: "DELETE" });
          if (res.ok) {
            showMessage("دسته‌بندی با موفقیت حذف گردید.");
            fetchAdminLists();
          }
        } catch (err) {
          console.error(err);
        }
      }
    });
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

  // Post Deletion (Admin/Author)
  const handleDeletePost = async (postId: string) => {
    setCustomConfirm({
      title: "حذف دائمی مقاله",
      message: "آیا از حذف این مقاله اطمینان دارید؟ این عمل غیرقابل بازگشت است.",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/posts/${postId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          });
          if (res.ok) {
            showMessage("مقاله با موفقیت از پلتفرم حذف شد.");
            fetchAdminLists();
          } else {
            const data = await res.json();
            alert(data.error || "خطا در حذف مقاله.");
          }
        } catch (err) {
          alert("خطا در اتصال به سرور.");
        }
      }
    });
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
      authorId: currentUser.id || currentUser._id,
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

  const handleCommentApprove = async (commentId: string) => {
    try {
      const res = await fetch(`/api/comments/${commentId}/approve`, {
        method: "POST"
      });
      if (res.ok) {
        showMessage("نظر با موفقیت تایید شد.");
        fetchAdminLists();
      }
    } catch (err) {
      alert("خطا در تایید نظر.");
    }
  };

  const handleCommentDelete = async (commentId: string) => {
    setCustomConfirm({
      title: "حذف نظر / پرسش",
      message: "آیا از حذف این نظر/پرسش اطمینان دارید؟",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/comments/${commentId}`, { method: "DELETE" });
          if (res.ok) {
            showMessage("نظر با موفقیت حذف شد.");
            fetchAdminLists();
          }
        } catch (err) {
          alert("خطا در حذف نظر.");
        }
      }
    });
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
    setCustomConfirm({
      title: "حذف سند از کتابخانه",
      message: "آیا از حذف این سند اطمینان دارید؟",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/library/${docId}`, { method: "DELETE" });
          if (res.ok) {
            showMessage("سند از کتابخانه حذف شد.");
            fetchAdminLists();
          }
        } catch (err) {
          alert("خطا در حذف سند.");
        }
      }
    });
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
    setCustomConfirm({
      title: "حذف سوال متداول",
      message: "آیا از حذف این سوال متداول اطمینان دارید؟",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/faqs/${faqId}`, { method: "DELETE" });
          if (res.ok) {
            showMessage("سوال متداول با موفقیت حذف شد.");
            fetchAdminLists();
          }
        } catch (err) {
          alert("خطا در حذف سوال متداول.");
        }
      }
    });
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
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <div className="lg:w-72 shrink-0 h-full">
        <aside className={`fixed top-0 right-0 z-50 w-72 h-full bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 flex flex-col justify-between transition-transform duration-300 ${isMobileSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"} overflow-hidden shadow-2xl lg:shadow-none`}>
          <div className="flex flex-col h-full relative z-10">
            {/* Mobile Close Button */}
            <div className="lg:hidden flex justify-end p-6 border-b border-slate-100 dark:border-slate-700/50">
              <button onClick={() => setIsMobileSidebarOpen(false)} className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-500 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

          {/* Logo Section */}
          <div className="p-8 flex items-center gap-4 border-b border-slate-100 dark:border-slate-700/50">
            <div className="w-12 h-12 bg-linear-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-slate-800 dark:text-white tracking-tight leading-none">{isAdmin ? "پنل مدیریت" : "پنل اساتید"}</span>
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 mt-1 uppercase tracking-wider">Dentalfy Core v2</span>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="m-6 p-5 rounded-[2rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex items-center gap-4 group cursor-pointer hover:bg-white dark:hover:bg-slate-800 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-slate-200 border-2 border-white dark:border-slate-800 overflow-hidden relative shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              <img 
                src={profilePicBase64 || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200"} 
                alt={currentUser.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-extrabold text-slate-800 dark:text-slate-100 truncate leading-tight">{currentUser.name}</div>
              <div className="text-[10px] bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-lg font-bold inline-block mt-1 uppercase tracking-tighter">{currentUser.role === 'admin' ? 'مدیر ارشد پلتفرم' : 'متخصص و نویسنده علمی'}</div>
            </div>
          </div>

          {/* Menu items */}
          <nav className="px-6 py-2 space-y-1.5 flex-1 overflow-y-auto custom-scrollbar">
            <div className="px-3 mb-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">اصلی</div>
            
            <button 
              onClick={() => { setActiveTab("dashboard"); setIsMobileSidebarOpen(false); setIsCreatingPost(false); }}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-[1.25rem] font-bold text-sm transition-all duration-300 cursor-pointer group ${activeTab === "dashboard" ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-indigo-600"}`}
            >
              <Activity className={`w-5 h-5 ${activeTab === "dashboard" ? "text-white" : "group-hover:scale-110 transition-transform"}`} /> 
              داشبورد مدیریتی
            </button>

            <div className="px-3 mt-8 mb-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">محتوا</div>

            <button 
              onClick={() => { setActiveTab("posts"); setIsMobileSidebarOpen(false); setIsCreatingPost(false); }}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-[1.25rem] font-bold text-sm transition-all duration-300 cursor-pointer group ${activeTab === "posts" ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-indigo-600"}`}
            >
              <FileText className={`w-5 h-5 ${activeTab === "posts" ? "text-white" : "group-hover:scale-110 transition-transform"}`} /> 
              {isAdmin ? "کل مقالات سایت" : "مقالات من"}
              <span className={`mr-auto text-[10px] px-2.5 py-0.5 rounded-full font-bold ${activeTab === "posts" ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-900 text-slate-500"}`}>{allPosts.length}</span>
            </button>

            <button 
              onClick={() => { setActiveTab("comments"); setIsMobileSidebarOpen(false); setIsCreatingPost(false); }}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-[1.25rem] font-bold text-sm transition-all duration-300 cursor-pointer group ${activeTab === "comments" ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-indigo-600"}`}
            >
              <MessageSquare className={`w-5 h-5 ${activeTab === "comments" ? "text-white" : "group-hover:scale-110 transition-transform"}`} /> 
              دیدگاه‌های کاربران
              <span className={`mr-auto text-[10px] px-2.5 py-0.5 rounded-full font-bold ${activeTab === "comments" ? "bg-white/20 text-white" : "bg-teal-100 dark:bg-teal-900 text-teal-700"}`}>{allComments.length}</span>
            </button>

            {isAdmin && (
              <>
                <div className="px-3 mt-8 mb-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">سیستم</div>
                
                <button 
                  onClick={() => { setActiveTab("courses"); setIsMobileSidebarOpen(false); setIsCreatingPost(false); }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-[1.25rem] font-bold text-sm transition-all duration-300 cursor-pointer group ${activeTab === "courses" ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-indigo-600"}`}
                >
                  <BookOpen className={`w-5 h-5 ${activeTab === "courses" ? "text-white" : "group-hover:scale-110 transition-transform"}`} /> 
                  دروس و سرفصل‌ها
                </button>

                <button 
                  onClick={() => { setActiveTab("requests"); setIsMobileSidebarOpen(false); setIsCreatingPost(false); }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-[1.25rem] font-bold text-sm transition-all duration-300 cursor-pointer group ${activeTab === "requests" ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-indigo-600"}`}
                >
                  <Users className={`w-5 h-5 ${activeTab === "requests" ? "text-white" : "group-hover:scale-110 transition-transform"}`} /> 
                  درخواست‌های عضویت
                  {allRequests.filter(r => r.status === "pending").length > 0 && <span className="mr-auto w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>}
                </button>

                <button 
                  onClick={() => { setActiveTab("users"); setIsMobileSidebarOpen(false); setIsCreatingPost(false); }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-[1.25rem] font-bold text-sm transition-all duration-300 cursor-pointer group ${activeTab === "users" ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-indigo-600"}`}
                >
                  <Users className={`w-5 h-5 ${activeTab === "users" ? "text-white" : "group-hover:scale-110 transition-transform"}`} /> 
                  مدیریت کاربران
                </button>

                <button 
                  onClick={() => { setActiveTab("libraryAndFaqs"); setIsMobileSidebarOpen(false); setIsCreatingPost(false); }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-[1.25rem] font-bold text-sm transition-all duration-300 cursor-pointer group ${activeTab === "libraryAndFaqs" ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-indigo-600"}`}
                >
                  <Download className={`w-5 h-5 ${activeTab === "libraryAndFaqs" ? "text-white" : "group-hover:scale-110 transition-transform"}`} /> 
                  کتابخانه و سوالات
                </button>

                <button 
                  onClick={() => { setActiveTab("siteSettings"); setIsMobileSidebarOpen(false); setIsCreatingPost(false); }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-[1.25rem] font-bold text-sm transition-all duration-300 cursor-pointer group ${activeTab === "siteSettings" ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-indigo-600"}`}
                >
                  <Settings className={`w-5 h-5 ${activeTab === "siteSettings" ? "text-white" : "group-hover:scale-110 transition-transform"}`} /> 
                  تنظیمات پلتفرم
                </button>
              </>
            )}

            <button 
              onClick={() => { setActiveTab("profile"); setIsMobileSidebarOpen(false); setIsCreatingPost(false); }}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-[1.25rem] font-bold text-sm transition-all duration-300 cursor-pointer group ${activeTab === "profile" ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-indigo-600"}`}
            >
              <User className={`w-5 h-5 ${activeTab === "profile" ? "text-white" : "group-hover:scale-110 transition-transform"}`} /> 
              تنظیمات پروفایل
            </button>
          </nav>
        </div>

        {/* Bottom logout */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-700/50">
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-3 py-4 bg-rose-50 dark:bg-rose-900/10 text-rose-600 hover:bg-rose-600 hover:text-white rounded-2xl text-sm font-bold transition-all duration-300 cursor-pointer group active:scale-95"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> خروج از سامانه
          </button>
        </div>
      </aside>
      </div>

      {/* Main Panel Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header bar */}
        <header className="h-20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 px-4 md:px-10 flex items-center justify-between shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-indigo-600 bg-indigo-50 rounded-xl shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-sm md:text-lg font-extrabold text-slate-900 dark:text-white leading-tight truncate">مدیریت متمرکز دنتالفای</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shrink-0"></span>
                <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-tighter truncate">نود فعال سیستم • وضعیت {currentUser.role === 'admin' ? 'مدیریت' : 'اساتید'}</p>
              </div>
            </div>
          </div>
            <div className="flex items-center gap-2">
              {/* Mobile Logout */}
              <button 
                onClick={onLogout}
                className="p-2 bg-rose-50 hover:bg-rose-100 rounded-xl text-rose-600 lg:hidden cursor-pointer"
                title="خروج"
              >
                <LogOut className="w-5 h-5" />
              </button>
              
              <button 
                onClick={handleStartNewPost}
                className="px-3.5 md:px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2.5 cursor-pointer active:scale-95"
              >
                <PlusCircle className="w-4.5 h-4.5" /> 
                <span className="hidden md:inline">ایجاد مقاله جدید</span>
              </button>
            </div>
        </header>

        {/* Body content scroll viewport */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
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

                    <div className="flex flex-col sm:flex-row gap-2">
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
            <div className="space-y-10">
              {/* Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div 
                  onClick={() => setActiveTab("posts")}
                  className="bg-white dark:bg-slate-800 p-5 md:p-6 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/20 dark:shadow-none group hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                >
                  <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 group-hover:rotate-12 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">مقالات منتشر شده</div>
                  <div className="flex items-baseline gap-2">
                    <div className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{publishedCount}</div>
                    <div className="text-[9px] md:text-[10px] text-emerald-500 font-bold px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg tracking-tighter">در دسترس همگانی</div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-5 md:p-6 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/10 dark:shadow-none group hover:scale-[1.02] transition-all duration-300">
                  <div className="w-10 h-10 bg-rose-50 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4 group-hover:rotate-12 transition-transform">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <div className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">در انتظار بررسی علمی</div>
                  <div className="flex items-baseline gap-2">
                    <div className="text-3xl md:text-4xl font-extrabold text-rose-600 tracking-tight">{pendingCount}</div>
                    <div className="text-[9px] md:text-[10px] text-rose-500 font-bold px-2 py-0.5 bg-rose-50 dark:bg-rose-900/20 rounded-lg tracking-tighter">نیازمند اقدام</div>
                  </div>
                </div>

                <div 
                  onClick={() => isAdmin && setActiveTab("users")}
                  className={`bg-white dark:bg-slate-800 p-5 md:p-6 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/10 dark:shadow-none group hover:scale-[1.02] transition-all duration-300 ${isAdmin ? "cursor-pointer" : ""}`}
                >
                  <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 group-hover:rotate-12 transition-transform">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">متخصصین دنتالفای</div>
                  <div className="flex items-baseline gap-2">
                    <div className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{settings.stats?.authorsCount || 1}</div>
                    <div className="text-[9px] md:text-[10px] text-blue-500 font-bold px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg tracking-tighter">نویسنده فعال</div>
                  </div>
                </div>

                <div 
                  onClick={() => isAdmin && setActiveTab("courses")}
                  className={`bg-white dark:bg-slate-800 p-5 md:p-6 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/10 dark:shadow-none group hover:scale-[1.02] transition-all duration-300 ${isAdmin ? "cursor-pointer" : ""}`}
                >
                  <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4 group-hover:rotate-12 transition-transform">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">سرفصل‌های مصوب</div>
                  <div className="flex items-baseline gap-2">
                    <div className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{allCourses.length}</div>
                    <div className="text-[10px] text-amber-500 font-bold px-2 py-0.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg tracking-tighter">دوره تخصصی</div>
                  </div>
                </div>
              </div>

              {/* Main Grid: Action items */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Right col: Queues */}
                <div className="lg:col-span-2 space-y-10">
                  {isAdmin ? (
                    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/10 dark:shadow-none overflow-hidden">
                      <div className="p-8 border-b border-slate-100 dark:border-slate-700/50 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/20">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                            <RefreshCw className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h2 className="font-extrabold text-sm text-slate-800 dark:text-white">صف بررسی مقالات تخصصی</h2>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">بررسی علمی مقالات اساتید</p>
                          </div>
                        </div>
                        {allPosts.filter(p => p.status === "pending").length > 0 && (
                          <span className="text-[10px] text-rose-600 font-bold bg-rose-50 dark:bg-rose-900/20 px-3 py-1 rounded-xl animate-pulse">اقدام فوری مورد نیاز</span>
                        )}
                      </div>
                      
                      <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                        {allPosts.filter(p => p.status === "pending").length === 0 ? (
                          <div className="p-20 text-center flex flex-col items-center">
                            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-[2rem] flex items-center justify-center text-emerald-500 mb-4">
                              <CheckCircle className="w-10 h-10" />
                            </div>
                            <h4 className="text-sm font-extrabold text-slate-800 dark:text-white mb-2">تمامی موارد بررسی شدند</h4>
                            <p className="text-xs text-slate-400 font-bold italic">هیچ مقاله جدیدی در صف انتظار تایید علمی نیست.</p>
                          </div>
                        ) : (
                          allPosts.filter(p => p.status === "pending").map(post => {
                            const postAuthorName = typeof post.author === "object" ? post.author?.name : "نویسنده";
                            return (
                              <div key={post._id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-all duration-300 group">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-2xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-600">
                                    <img src={post.coverImage || "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=200"} className="w-full h-full object-cover" alt="" />
                                  </div>
                                  <div>
                                    <h4 className="font-extrabold text-sm text-slate-800 dark:text-white group-hover:text-indigo-600 transition-colors leading-tight">{post.title}</h4>
                                    <div className="flex items-center gap-3 mt-1.5">
                                      <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/40 px-2 py-0.5 rounded-lg">{postAuthorName}</span>
                                      <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 font-medium">
                                        <BookOpen className="w-3 h-3" />
                                        {post.course?.title || "بدون دسته‌بندی"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-3 shrink-0">
                                  <button 
                                    onClick={() => handleApprovePost(post._id)}
                                    className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-[11px] font-bold cursor-pointer shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                                  >
                                    تأیید علمی و انتشار
                                  </button>
                                  <button 
                                    onClick={() => handleOpenRejectPostModal(post._id)}
                                    className="px-6 py-3 bg-white dark:bg-slate-800 border border-rose-100 dark:border-slate-700 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-2xl text-[11px] font-bold cursor-pointer transition-all active:scale-95"
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
                    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 p-8 shadow-xl shadow-slate-200/10 dark:shadow-none">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center text-rose-600">
                          <XCircle className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">مقالات نیازمند اصلاح و بازنگری</h3>
                          <p className="text-[10px] text-slate-400 font-bold italic">بازخوردهای اصلاحی مدیر سامانه</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {allPosts.filter(p => p.status === "rejected").length === 0 ? (
                          <div className="p-12 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2rem]">
                            <p className="text-xs text-slate-400 font-bold italic">تبریک! هیچ مقاله‌ای در وضعیت رد شده قرار ندارد.</p>
                          </div>
                        ) : (
                          allPosts.filter(p => p.status === "rejected").map(post => (
                            <div key={post._id} className="p-6 bg-rose-50/50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 rounded-[2rem] space-y-4 group">
                              <div className="flex justify-between items-start">
                                <h5 className="font-extrabold text-sm text-slate-800 dark:text-white group-hover:text-rose-600 transition-colors leading-tight">{post.title}</h5>
                                <span className="text-[9px] font-bold bg-rose-500 text-white px-2 py-0.5 rounded-lg uppercase tracking-tighter">ناموفق</span>
                              </div>
                              <div className="p-4 bg-white/60 dark:bg-slate-900/60 rounded-2xl border border-rose-100/50 dark:border-rose-900/20">
                                <p className="text-[11px] text-rose-700 dark:text-rose-400 font-bold leading-relaxed flex gap-2">
                                  <MessageSquare className="w-4 h-4 shrink-0" />
                                  بازخورد ادمین: {post.rejectionReason || "توضیحات تکمیلی ثبت نشده است."}
                                </p>
                              </div>
                              <button 
                                onClick={() => handleStartEditPost(post)}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-[11px] font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                              >
                                شروع فرآیند اصلاح و ویرایش مقاله
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* Account requests list */}
                  {isAdmin && (
                    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-2xl shadow-slate-200/20 dark:shadow-none overflow-hidden">
                      <div className="p-8 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/20 flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h2 className="font-black text-sm text-slate-800 dark:text-white">درخواست‌های عضویت کادر علمی</h2>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Writer Onboarding • Identity Verification</p>
                        </div>
                      </div>
                      
                      <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                        {allRequests.filter(r => r.status === "pending").length === 0 ? (
                          <div className="p-20 text-center text-xs text-slate-400 font-bold italic">
                            هیچ درخواست جدیدی در صف انتظار نیست.
                          </div>
                        ) : (
                          allRequests.filter(r => r.status === "pending").map(req => (
                            <div key={req._id} className="p-6 flex flex-col sm:flex-row justify-between gap-6 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-all">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl flex items-center justify-center font-extrabold text-lg">
                                  {req.name?.[0]}
                                </div>
                                <div>
                                  <h4 className="font-extrabold text-sm text-slate-800 dark:text-white leading-tight">{req.name}</h4>
                                  <p className="text-[10px] text-slate-400 font-bold">{req.email}</p>
                                  <div className="mt-2 text-[10px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 italic font-medium">
                                    "{req.bio || "توضیحات بیوگرافی ثبت نشده است"}"
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-3 shrink-0 self-center">
                                <button 
                                  onClick={() => handleApproveRequest(req._id)}
                                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-[11px] font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
                                >
                                  تایید هویت و ایجاد حساب
                                </button>
                                <button 
                                  onClick={() => handleRejectRequest(req._id)}
                                  className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-2xl text-[11px] font-bold transition-all active:scale-95 cursor-pointer"
                                >
                                  رد درخواست
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Left col: Security Queues */}
                {isAdmin && (
                  <div className="space-y-10">
                    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/10 dark:shadow-none p-8">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-600">
                          <Lock className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">بازیابی دسترسی</h3>
                          <p className="text-[10px] text-slate-400 font-bold italic">Password Reset Requests</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {resetRequests.length === 0 ? (
                          <div className="p-8 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2rem]">
                            <p className="text-[10px] text-slate-400 font-bold italic font-medium">موردی یافت نشد.</p>
                          </div>
                        ) : (
                          resetRequests.map(user => (
                            <div key={user._id} className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-slate-800 group hover:border-amber-200 transition-all">
                              <div className="text-sm font-extrabold text-slate-800 dark:text-white mb-1 group-hover:text-amber-600 transition-colors leading-tight">{user.name}</div>
                              <div className="text-[10px] text-slate-400 font-bold mb-4">{user.email}</div>
                              <button 
                                onClick={() => handleApprovePasswordReset(user._id || user.id)}
                                className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl text-[10px] font-bold shadow-lg shadow-amber-500/20 transition-all active:scale-95"
                              >
                                تولید گذرواژه موقت و ارسال
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="bg-linear-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                        <Sparkles className="w-32 h-32 rotate-12" />
                      </div>
                      <div className="relative z-10">
                        <h4 className="text-lg font-extrabold leading-tight mb-2">سیستم مدیریت مقالات هوشمند</h4>
                        <p className="text-xs text-white/80 font-bold leading-relaxed mb-6">با استفاده از هوش مصنوعی، مقالات خود را در سریع‌ترین زمان ممکن تولید و منتشر کنید.</p>
                        <button 
                          onClick={handleStartNewPost}
                          className="w-full py-4 bg-white text-indigo-600 rounded-2xl text-xs font-bold hover:bg-indigo-50 transition-colors shadow-lg active:scale-95"
                        >
                          شروع نگارش هوشمند
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === "posts" ? (
            /* --- POSTS MANAGER WITH FULL-TEXT SEARCH & AUTHOR FILTERING --- */
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-800 dark:text-white leading-tight">
                    {isAdmin ? "مدیریت و آرشیو جامع مقالات علمی" : "لیست مقالات و انتشارات علمی شما"}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">جستجوی تمام‌متن در محتوا و فیلتر بر اساس نویسنده و وضعیت</p>
                </div>
                <button 
                  onClick={handleStartNewPost}
                  className="px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white text-xs font-black rounded-2xl shadow-lg shadow-teal-600/20 flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
                >
                  <PlusCircle className="w-4 h-4" /> ثبت مقاله جدید
                </button>
              </div>

              {/* Search & Filters Bar */}
              <div className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Full-Text Search */}
                <div className="relative md:col-span-6">
                  <Search className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text"
                    value={postSearchQuery}
                    onChange={(e) => setPostSearchQuery(e.target.value)}
                    placeholder="جستجوی تمام‌متن (عنوان، متون بلوک‌ها، برچسب‌ها، کلیدواژه‌ها)..."
                    className="w-full pl-10 pr-11 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                  {postSearchQuery && (
                    <button 
                      onClick={() => setPostSearchQuery("")}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Author Filter Dropdown */}
                <div className="md:col-span-3">
                  <select
                    value={postAuthorFilter}
                    onChange={(e) => setPostAuthorFilter(e.target.value)}
                    className="w-full py-3 px-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="all">👨‍⚕️ همه نویسندگان</option>
                    {allAuthors.map(auth => (
                      <option key={auth.id || auth._id} value={auth.id || auth._id}>
                        {auth.name} ({auth.postCount || 0} مقاله)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter Dropdown */}
                <div className="md:col-span-3">
                  <select
                    value={postStatusFilter}
                    onChange={(e) => setPostStatusFilter(e.target.value)}
                    className="w-full py-3 px-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="all">📊 همه وضعیت‌ها</option>
                    <option value="published">✅ منتشر شده</option>
                    <option value="pending">⏳ در انتظار تایید</option>
                    <option value="rejected">❌ رد شده</option>
                  </select>
                </div>
              </div>

              {/* Table with matching posts */}
              <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/10 dark:shadow-none overflow-hidden">
                <div className="p-5 bg-slate-50/70 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                    تعداد مقالات یافت شده: {filteredPostsList.length} مورد
                  </span>
                  {(postSearchQuery || postAuthorFilter !== "all" || postStatusFilter !== "all") && (
                    <button 
                      onClick={() => {
                        setPostSearchQuery("");
                        setPostAuthorFilter("all");
                        setPostStatusFilter("all");
                      }}
                      className="text-[10px] font-bold text-teal-600 hover:underline flex items-center gap-1"
                    >
                      <X className="w-3 h-3" /> پاکسازی فیلترها
                    </button>
                  )}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="bg-slate-50/50 dark:bg-slate-900/30 text-slate-400 text-[10px] uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                        <th className="px-6 py-4 font-extrabold">عنوان مقاله علمی</th>
                        <th className="px-6 py-4 font-extrabold">نویسنده</th>
                        <th className="px-6 py-4 font-extrabold">سرفصل درس</th>
                        <th className="px-6 py-4 font-extrabold text-center">وضعیت انتشار</th>
                        <th className="px-6 py-4 font-extrabold text-center">تاریخ</th>
                        <th className="px-6 py-4 font-extrabold text-left">عملیات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                      {filteredPostsList.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-12 text-center text-slate-400 font-bold text-xs italic">
                            هیچ مقاله‌ای با شرایط جستجوی فعلی یافت نشد.
                          </td>
                        </tr>
                      ) : (
                        filteredPostsList.map(post => {
                          const authorObj = typeof post.author === "object" ? post.author : null;
                          const authorName = authorObj?.name || "نویسنده آکادمی";
                          const authorPic = authorObj?.profilePicture || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200";

                          return (
                            <tr key={post._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors group">
                              <td className="px-6 py-4">
                                <div className="font-extrabold text-slate-800 dark:text-slate-100 group-hover:text-teal-600 transition-colors line-clamp-1 max-w-sm">
                                  {post.title}
                                </div>
                                {post.summary && (
                                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 max-w-sm font-medium">
                                    {post.summary}
                                  </p>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2.5">
                                  <img src={authorPic} className="w-7 h-7 rounded-lg object-cover border border-slate-200 dark:border-slate-700" alt={authorName} />
                                  <span className="font-bold text-slate-700 dark:text-slate-200 text-[11px] whitespace-nowrap">{authorName}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-semibold text-[11px]">
                                {post.course?.title || "سایر مباحث"}
                              </td>
                              <td className="px-6 py-4 text-center">
                                {post.status === "published" ? (
                                  <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg font-bold text-[10px]">منتشر شده</span>
                                ) : post.status === "pending" ? (
                                  <span className="px-3 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-lg font-bold text-[10px]">در انتظار تایید</span>
                                ) : (
                                  <span className="px-3 py-1 bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded-lg font-bold text-[10px]">رد شده</span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-center text-slate-400 font-mono text-[10px] font-bold">
                                {new Date(post.updatedAt || post.createdAt || "").toLocaleDateString("fa-IR")}
                              </td>
                              <td className="px-6 py-4 text-left shrink-0">
                                <div className="flex gap-2 justify-end items-center">
                                  <button 
                                    onClick={() => handleStartEditPost(post)}
                                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-teal-600 hover:text-white rounded-xl font-bold text-[10px] transition-all cursor-pointer"
                                  >
                                    ویرایش
                                  </button>
                                  <button 
                                    onClick={() => handleDeletePost(post._id)}
                                    className="w-7 h-7 flex items-center justify-center bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white rounded-xl font-bold transition-all cursor-pointer"
                                    title="حذف مقاله"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : activeTab === "courses" ? (
            /* --- COURSES MANAGER (ADMIN ONLY) --- */
            <div className="space-y-10">
              {/* Add New Course form */}
              <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/10 dark:shadow-none space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-800 dark:text-white leading-tight">
                      {editingCourseId ? "ویرایش جزئیات سرفصل" : "تعریف سرفصل آموزشی جدید"}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold italic leading-tight">مدیریت سرفصل‌های آکادمیک</p>
                  </div>
                  {editingCourseId && (
                    <button 
                      onClick={() => {
                        setEditingCourseId(null);
                        setNewCourseTitle("");
                        setNewCourseDesc("");
                        setNewCourseSyllabus([]);
                      }}
                      className="mr-auto text-[10px] font-bold text-rose-500 hover:text-rose-600 underline"
                    >
                      انصراف از ویرایش
                    </button>
                  )}
                </div>

                <form onSubmit={handleCreateCourse} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-500 mr-2">عنوان تخصصی درس</label>
                      <input 
                        type="text"
                        value={newCourseTitle}
                        onChange={(e) => setNewCourseTitle(e.target.value)}
                        placeholder="مثال: دندانپزشکی ترمیمی و زیبایی"
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold focus:outline-none focus:border-indigo-500 transition-all"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-500 mr-2">توضیحات کوتاه علمی</label>
                      <input 
                        type="text"
                        value={newCourseDesc}
                        onChange={(e) => setNewCourseDesc(e.target.value)}
                        placeholder="مثال: اصول آماده‌سازی و بازسازی دندان‌های خلفی"
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold focus:outline-none focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-slate-500 mr-2">افزودن مباحث و سرفصل‌های زیرمجموعه</label>
                    <div className="flex gap-3">
                      <input 
                        type="text"
                        value={syllabusInput}
                        onChange={(e) => setSyllabusInput(e.target.value)}
                        placeholder="نام مبحث را وارد کنید..."
                        className="flex-1 px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold focus:outline-none focus:border-indigo-500 transition-all"
                      />
                      <button 
                        type="button"
                        onClick={handleAddSyllabusItem}
                        className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-2xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all active:scale-95 cursor-pointer shadow-lg"
                      >
                        ثبت مبحث
                      </button>
                    </div>
                    
                    {newCourseSyllabus.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-4">
                        {newCourseSyllabus.map((item, idx) => (
                          <div key={idx} className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold px-4 py-2 rounded-xl flex items-center gap-3 group">
                            {item}
                            <button 
                              type="button"
                              onClick={() => setNewCourseSyllabus(prev => prev.filter((_, i) => i !== idx))}
                              className="text-indigo-400 hover:text-rose-600 transition-colors cursor-pointer"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-[1.5rem] transition-all cursor-pointer shadow-xl shadow-indigo-600/20 active:scale-[0.98]"
                  >
                    {editingCourseId ? "بروزرسانی نهایی سرفصل" : "تایید نهایی و ثبت سرفصل در آکادمی"}
                  </button>
                </form>
              </div>

              {/* Course lists */}
              <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/10 dark:shadow-none overflow-hidden">
                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
                  <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.2em]">لیست دروس فعال</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="bg-slate-50/50 dark:bg-slate-900/30 text-slate-400 text-[10px] uppercase tracking-widest">
                        <th className="px-8 py-5 font-extrabold">عنوان تخصصی</th>
                        <th className="px-8 py-5 font-extrabold">شرح دوره</th>
                        <th className="px-8 py-5 font-extrabold">وضعیت مباحث</th>
                        <th className="px-8 py-5 font-extrabold">عملیات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                      {allCourses.map(course => (
                        <tr key={course._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors group">
                          <td className="px-8 py-5 font-extrabold text-slate-800 dark:text-white group-hover:text-indigo-600 transition-colors leading-tight">{course.title}</td>
                          <td className="px-8 py-5 text-slate-400 font-bold">{course.description || "سرفصل مصوب علمی"}</td>
                          <td className="px-8 py-5">
                            <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg font-bold text-[10px]">
                              {course.syllabus?.length || 0} مبحث آموزشی
                            </span>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex gap-4">
                              <button 
                                onClick={() => handleManageQuiz(course)}
                                className="text-amber-500 hover:text-amber-600 font-bold text-[10px] cursor-pointer"
                              >
                                مدیریت آزمون
                              </button>
                              <button 
                                onClick={() => handleStartEditCourse(course)}
                                className="text-indigo-600 hover:text-indigo-700 font-bold text-[10px] cursor-pointer"
                              >
                                ویرایش جزئیات
                              </button>
                              <button 
                                onClick={() => handleDeleteCourse(course._id)}
                                className="text-rose-500 hover:text-rose-600 font-bold text-[10px] cursor-pointer"
                              >
                                حذف
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quiz Editor Interface */}
              {selectedCourseForQuiz && (
                <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/10 dark:shadow-none space-y-8 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-800 dark:text-white leading-tight">
                          مدیریت و تالیف آزمون: {selectedCourseForQuiz.title}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold italic leading-tight">پیکربندی سوالات سنجش علمی دوره</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        type="button"
                        onClick={handleGenerateAILiveQuiz}
                        disabled={isGeneratingQuiz}
                        className="px-5 py-3 bg-gradient-to-l from-indigo-600 to-indigo-700 text-white text-[11px] font-bold rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                      >
                        {isGeneratingQuiz ? (
                          <>در حال تالیف هوشمند...</>
                        ) : (
                          <>✨ تالیف هوشمند آزمون با هوش مصنوعی (Gemini)</>
                        )}
                      </button>
                      <button 
                        type="button"
                        onClick={() => setSelectedCourseForQuiz(null)}
                        className="px-5 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 text-[11px] font-bold rounded-xl transition-all cursor-pointer"
                      >
                        بستن پنل آزمون
                      </button>
                    </div>
                  </div>

                  {isFetchingQuiz ? (
                    <div className="text-center py-10 space-y-3">
                      <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="text-xs text-slate-400 font-bold">در حال بازیابی سوالات آزمون از دیتابیس علمی...</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="space-y-2 max-w-xs">
                        <label className="text-[11px] font-bold text-slate-500 mr-2">حد نصاب قبولی در آزمون (درصد)</label>
                        <input 
                          type="number"
                          min="1"
                          max="100"
                          value={quizPassingPercentage}
                          onChange={(e) => setQuizPassingPercentage(parseInt(e.target.value) || 70)}
                          className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold focus:outline-none focus:border-indigo-500 transition-all"
                        />
                      </div>

                      {/* Questions list */}
                      <div className="space-y-6">
                        <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">لیست سوالات فعال ({quizQuestions.length})</span>
                        
                        {quizQuestions.length === 0 ? (
                          <div className="p-8 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-center text-slate-400 text-xs font-bold">
                            هیچ سوالی برای آزمون این درس یافت نشد. می‌توانید با هوش مصنوعی تالیف کنید یا با استفاده از دکمه زیر به صورت دستی سوال اضافه کنید.
                          </div>
                        ) : (
                          quizQuestions.map((q, qIdx) => (
                            <div key={qIdx} className="p-6 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4 relative group">
                              <button 
                                type="button"
                                onClick={() => setQuizQuestions(prev => prev.filter((_, idx) => idx !== qIdx))}
                                className="absolute top-4 left-4 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer text-[10px] font-bold flex items-center gap-1"
                              >
                                حذف سوال
                              </button>

                              <div className="space-y-2">
                                <span className="text-[10px] font-bold text-amber-600 block">سوال شماره {qIdx + 1}</span>
                                <input 
                                  type="text"
                                  value={q.questionText}
                                  onChange={(e) => {
                                    const updated = [...quizQuestions];
                                    updated[qIdx].questionText = e.target.value;
                                    setQuizQuestions(updated);
                                  }}
                                  placeholder="متن سوال تخصصی را وارد کنید..."
                                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-500"
                                />
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[0, 1, 2, 3].map((optIdx) => (
                                  <div key={optIdx} className="space-y-1">
                                    <label className="text-[10px] text-slate-400 mr-1 flex items-center gap-2">
                                      <input 
                                        type="radio"
                                        name={`correct-${qIdx}`}
                                        checked={q.correctAnswerIndex === optIdx}
                                        onChange={() => {
                                          const updated = [...quizQuestions];
                                          updated[qIdx].correctAnswerIndex = optIdx;
                                          setQuizQuestions(updated);
                                        }}
                                      />
                                      <span>گزینه {optIdx + 1}</span>
                                      {q.correctAnswerIndex === optIdx && (
                                        <span className="text-[9px] text-emerald-600 font-bold">گزینه صحیح</span>
                                      )}
                                    </label>
                                    <input 
                                      type="text"
                                      value={q.options[optIdx] || ""}
                                      onChange={(e) => {
                                        const updated = [...quizQuestions];
                                        updated[qIdx].options[optIdx] = e.target.value;
                                        setQuizQuestions(updated);
                                      }}
                                      placeholder={`متن گزینه {optIdx + 1}`}
                                      className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))
                        )}

                        <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                          <button 
                            type="button"
                            onClick={() => {
                              setQuizQuestions(prev => [
                                ...prev,
                                {
                                  questionText: "",
                                  options: ["", "", "", ""],
                                  correctAnswerIndex: 0
                                }
                              ]);
                            }}
                            className="px-5 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-xl hover:bg-slate-800 transition-all cursor-pointer shadow-md"
                          >
                            + افزودن دستی سوال جدید
                          </button>

                          {quizQuestions.length > 0 && (
                            <button 
                              type="button"
                              onClick={handleSaveQuizManual}
                              disabled={isSavingQuiz}
                              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-600/10 disabled:opacity-50"
                            >
                              {isSavingQuiz ? "در حال ثبت..." : "ذخیره نهایی سوالات آزمون"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : activeTab === "siteSettings" ? (
            /* --- SITE SETTINGS (ADMIN ONLY) --- */
            <div className="max-w-3xl bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 p-10 shadow-xl shadow-slate-200/10 dark:shadow-none space-y-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-800 dark:text-white leading-tight">پیکربندی هسته پلتفرم</h3>
                  <p className="text-[10px] text-slate-400 font-bold italic leading-tight">تنظیمات اصلی و برندینگ آکادمی</p>
                </div>
              </div>

              <form onSubmit={handleSettingsSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 mr-2">نام برند آکادمی</label>
                    <input 
                      type="text" 
                      value={siteNameInput}
                      onChange={(e) => setSiteNameInput(e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold focus:outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 mr-2">پست الکترونیک رسمی</label>
                    <input 
                      type="email" 
                      value={contactEmailInput}
                      onChange={(e) => setContactEmailInput(e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold text-left focus:outline-none focus:border-indigo-500 transition-all"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 mr-2">شعار تبلیغاتی اصلی (Hero Text)</label>
                  <input 
                    type="text" 
                    value={heroTextInput}
                    onChange={(e) => setHeroTextInput(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 mr-2">کد بازیابی اضطراری (Admin Recovery)</label>
                    <input 
                      type="text" 
                      value={adminRecoveryCodeInput}
                      onChange={(e) => setAdminRecoveryCodeInput(e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold text-center focus:outline-none focus:border-indigo-500 transition-all text-rose-500 font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 mr-2">تغییر رمز عبور مدیریت</label>
                    <input 
                      type="password" 
                      value={adminPasswordInput}
                      onChange={(e) => setAdminPasswordInput(e.target.value)}
                      placeholder="رمز عبور جدید..."
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold focus:outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>

                {/* Color definitions */}
                <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-8">
                  <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.2em] block mb-4">هویت بصری آکادمی</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <span className="text-[10px] text-slate-500 font-bold">رنگ اصلی (Primary)</span>
                      <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <input 
                          type="color" 
                          value={primaryColorInput}
                          onChange={(e) => setPrimaryColorInput(e.target.value)}
                          className="w-10 h-10 rounded-xl cursor-pointer border-none"
                        />
                        <span className="text-[10px] font-mono text-slate-400">{primaryColorInput}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className="text-[10px] text-slate-500 font-bold">رنگ مکمل (Secondary)</span>
                      <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <input 
                          type="color" 
                          value={secondaryColorInput}
                          onChange={(e) => setSecondaryColorInput(e.target.value)}
                          className="w-10 h-10 rounded-xl cursor-pointer border-none"
                        />
                        <span className="text-[10px] font-mono text-slate-400">{secondaryColorInput}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className="text-[10px] text-slate-500 font-bold">رنگ آبی کلینیکی</span>
                      <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <input 
                          type="color" 
                          value={clinicalBlueInput}
                          onChange={(e) => setClinicalBlueInput(e.target.value)}
                          className="w-10 h-10 rounded-xl cursor-pointer border-none"
                        />
                        <span className="text-[10px] font-mono text-slate-400">{clinicalBlueInput}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm rounded-[1.5rem] transition-all cursor-pointer shadow-xl active:scale-[0.98]"
                >
                  بروزرسانی و ذخیره پیکربندی پلتفرم
                </button>
              </form>

              {/* Category Manager and Audit Logs Console */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
                {/* Category Manager */}
                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 p-8 shadow-xl shadow-slate-200/10 dark:shadow-none space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-white">
                      <Grid className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-800 dark:text-white">مدیریت دسته‌بندی‌های علمی</h4>
                      <p className="text-[9px] text-slate-400 font-bold">دسته‌بندی موضوعی مقالات و سرفصل‌ها</p>
                    </div>
                  </div>

                  <form onSubmit={handleCreateCategory} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 mr-1">نام دسته‌بندی</label>
                        <input 
                          type="text"
                          value={newCatName}
                          onChange={(e) => setNewCatName(e.target.value)}
                          placeholder="مثال: ارتودنسی"
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 mr-1">نامک (Slug)</label>
                        <input 
                          type="text"
                          value={newCatSlug}
                          onChange={(e) => setNewCatSlug(e.target.value)}
                          placeholder="orthodontics"
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none text-left"
                          dir="ltr"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 mr-1">دسته‌بندی مادر (اختیاری)</label>
                      <select
                        value={newCatParent}
                        onChange={(e) => setNewCatParent(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none"
                      >
                        <option value="">فاقد دسته‌بندی مادر</option>
                        {allCategories.map(cat => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <button 
                      type="submit"
                      disabled={isSavingCategory}
                      className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold rounded-xl transition-all cursor-pointer shadow-md"
                    >
                      {isSavingCategory ? "در حال ثبت..." : "ثبت دسته‌بندی علمی جدید"}
                    </button>
                  </form>

                  <div className="space-y-2 max-h-60 overflow-y-auto pt-2">
                    <span className="text-[10px] font-extrabold text-slate-400">دسته‌بندی‌های فعال علمی</span>
                    {allCategories.length === 0 ? (
                      <p className="text-[10px] text-slate-400 text-center font-bold py-4">هیچ دسته‌بندی ثبت نشده است.</p>
                    ) : (
                      <div className="divide-y divide-slate-50 dark:divide-slate-700">
                        {allCategories.map(cat => (
                          <div key={cat._id} className="py-2.5 flex items-center justify-between">
                            <div>
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{cat.name}</span>
                              <span className="text-[9px] font-mono text-slate-400 mr-2 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">/{cat.slug}</span>
                            </div>
                            <button 
                              type="button"
                              onClick={() => handleDeleteCategory(cat._id)}
                              className="text-[9px] font-bold text-rose-500 hover:text-rose-600 cursor-pointer"
                            >
                              حذف
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Security Audit Logs */}
                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 p-8 shadow-xl shadow-slate-200/10 dark:shadow-none space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-800 dark:text-white">گزارشات و ردپای امنیتی (Security Audit Logs)</h4>
                      <p className="text-[9px] text-slate-400 font-bold">مانیتورینگ فعالیت‌های کلان، احراز هویت و دسترسی‌ها</p>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {auditLogsList.length === 0 ? (
                      <p className="text-[10px] text-slate-400 text-center font-bold py-8">هیچ گزارش امنیتی تاکنون در سامانه ثبت نشده است.</p>
                    ) : (
                      auditLogsList.map((log: any) => (
                        <div key={log._id || log.id} className="p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/50 rounded-xl space-y-1.5 font-mono text-[9px] text-slate-600 dark:text-slate-300">
                          <div className="flex justify-between items-center text-[8px]">
                            <span className="px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded font-bold">
                              {log.action}
                            </span>
                            <span className="text-slate-400 font-semibold">
                              {new Date(log.timestamp).toLocaleString("fa-IR")}
                            </span>
                          </div>
                          <p className="font-sans font-bold text-[10px] text-slate-700 dark:text-slate-200">{log.message}</p>
                          <div className="flex items-center justify-between text-slate-400 font-semibold text-[8px] pt-1 border-t border-slate-100 dark:border-slate-800/30">
                            <span>کاربر: {log.userEmail || "مهمان / سامانه"}</span>
                            <span>IP: {log.ipAddress || "ناشناس"}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === "comments" ? (
            /* --- COMMENTS & QUESTIONS MODERATION TAB --- */
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/10 dark:shadow-none space-y-4">
                <h3 className="font-extrabold text-xs text-slate-700 dark:text-slate-200 border-r-4 border-teal-500 pr-2">مدیریت و پاسخ‌دهی به پرسش‌های بالینی دندانپزشکی</h3>
                <p className="text-slate-400 text-[10px] leading-relaxed font-medium">پزشکان همکار و مدیران علمی می‌توانند به صورت کاملاً زنده به پرسش‌های دانشجویان، رزیدنت‌ها و مراجعین پاسخ تخصصی ارسال نمایند.</p>
              </div>

              <div className="space-y-4">
                {allComments.length === 0 ? (
                  <div className="bg-white dark:bg-slate-800 p-8 text-center rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-400 text-xs font-bold italic">
                    هیچ پرسش بالینی یافت نشد.
                  </div>
                ) : (
                  allComments.map(comment => {
                    const linkedPost = allPosts.find(p => p._id === comment.postId);
                    return (
                      <div key={comment._id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/10 dark:shadow-none space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <span className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 font-extrabold text-xs flex items-center justify-center shadow-sm">
                                {comment.name[0]}
                              </span>
                              {!comment.isApproved && (
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 border-2 border-white dark:border-slate-800 rounded-full animate-pulse"></span>
                              )}
                            </div>
                            <div>
                              <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-100 leading-tight">{comment.name} ({comment.email})</h4>
                              <span className="text-[9px] text-slate-400 font-bold italic">
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
                            {!comment.isApproved && (
                              <button 
                                onClick={() => handleCommentApprove(comment._id)}
                                className="p-1.5 hover:bg-emerald-50 text-emerald-500 hover:text-emerald-600 rounded-lg transition-colors cursor-pointer flex items-center gap-1 bg-emerald-50/50"
                                title="تایید دیدگاه"
                              >
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-[10px] font-bold">تایید</span>
                              </button>
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

                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pr-10 whitespace-pre-line font-medium">{comment.text}</p>
                        
                        {comment.reply ? (
                          <div className="mr-10 p-3.5 bg-teal-50/50 dark:bg-teal-900/10 border border-teal-100/30 dark:border-teal-900/30 rounded-xl space-y-1">
                            <span className="text-[9px] font-bold text-teal-800 dark:text-teal-400">پاسخ ثبت شده توسط {comment.repliedBy || "مدیر علمی"}:</span>
                            <p className="text-xs text-teal-950/80 dark:text-teal-200 leading-relaxed font-medium">{comment.reply}</p>
                          </div>
                        ) : (
                          <div className="mr-10 pt-2">
                            {replyCommentId === comment._id ? (
                              <div className="space-y-2">
                                <textarea 
                                  value={replyTextInput}
                                  onChange={(e) => setReplyTextInput(e.target.value)}
                                  placeholder="پاسخ تخصصی دندانپزشکی خود را بنویسید..."
                                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-teal-500 h-20 resize-none font-bold"
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
                                className="px-3 py-1.5 bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 text-teal-700 dark:text-teal-400 rounded-lg text-[10px] font-extrabold transition-colors cursor-pointer"
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
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/10 dark:shadow-none space-y-4">
                <h3 className="font-extrabold text-xs text-slate-700 dark:text-slate-200 border-r-4 border-teal-500 pr-2">مدیریت درخواست‌های نویسندگی و عضویت متخصصین</h3>
                <p className="text-slate-400 text-[10px] leading-relaxed font-medium">درخواست‌های معلق پزشکان، دندانپزشکان و متخصصینی که تقاضای عضویت در تیم نویسندگان دنتالفای را ثبت کرده‌اند در این بخش نمایش داده می‌شود.</p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/10 dark:shadow-none overflow-hidden">
                <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider">لیست کلی درخواست‌ها</span>
                  <span className="text-[10px] text-teal-700 dark:text-teal-400 font-bold bg-teal-50 dark:bg-teal-900/20 px-2 py-0.5 rounded-full">{allRequests.length} درخواست ثبت شده</span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {allRequests.length === 0 ? (
                    <div className="p-12 text-center text-xs text-slate-400 font-bold italic">هیچ درخواستی در سامانه ثبت نشده است.</div>
                  ) : (
                    allRequests.map(req => (
                      <div key={req._id} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-100">{req.name}</h4>
                            <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${
                              req.status === "pending" ? "bg-amber-100 text-amber-700" :
                              req.status === "approved" ? "bg-teal-100 text-teal-700" :
                              "bg-rose-100 text-rose-700"
                            }`}>
                              {req.status === "pending" ? "در انتظار بررسی" :
                               req.status === "approved" ? "تأیید شده (فعال)" :
                               "رد شده"}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-mono font-bold">{req.email}</p>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 italic max-w-xl leading-relaxed font-medium">
                            {req.bio || "بیوگرافی یا توضیحات علمی ارائه نشده است."}
                          </div>
                        </div>

                        {req.status === "pending" && (
                          <div className="flex gap-2 shrink-0 self-end sm:self-center">
                            <button 
                              onClick={() => handleApproveRequest(req._id)}
                              className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-[10px] font-bold cursor-pointer shadow-lg shadow-teal-600/20 transition-all"
                            >
                              تأیید و صدور پنل نویسنده
                            </button>
                            <button 
                              onClick={() => handleRejectRequest(req._id)}
                              className="px-3.5 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white rounded-xl text-[10px] font-bold cursor-pointer border border-rose-100 transition-all"
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
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/10 dark:shadow-none space-y-6">
                <h3 className="font-extrabold text-xs text-slate-700 dark:text-slate-200 border-r-4 border-teal-500 pr-2">مدیریت کتابخانه بالینی و اسناد مطب</h3>
                
                <form onSubmit={handleCreateLibraryDoc} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 items-end">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500">عنوان سند / فرم پزشکی</label>
                    <input 
                      type="text" 
                      value={newLibraryTitle}
                      onChange={(e) => setNewLibraryTitle(e.target.value)}
                      placeholder="مثال: چک‌لیست استریلیزاسیون اتوکلاو"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                      required
                    />
                  </div>
                  <div className="space-y-1 relative">
                    <label className="text-[10px] font-bold text-slate-500">فایل ضمیمه سند (PDF)</label>
                    <div className="w-full h-9 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center relative hover:bg-slate-50 dark:bg-slate-900 cursor-pointer overflow-hidden transition-colors">
                      <input 
                        type="file" 
                        accept=".pdf"
                        onChange={handleLibraryFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        required
                      />
                      <span className="text-[10px] text-slate-500 font-extrabold">
                        {newLibraryFile ? "فایل انتخاب شد" : "انتخاب فایل PDF"}
                      </span>
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-lg shadow-teal-600/20"
                  >
                    افزودن به کتابخانه عمومی
                  </button>
                </form>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {allLibraryDocs.length === 0 ? (
                    <p className="text-center text-xs text-slate-400 py-4 font-bold italic">هیچ سندی در کتابخانه عمومی یافت نشد.</p>
                  ) : (
                    allLibraryDocs.map(doc => (
                      <div key={doc._id} className="py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors px-2 rounded-lg">
                        <div>
                          <h4 className="font-extrabold text-xs text-slate-700 dark:text-slate-200">{doc.title}</h4>
                          <span className="text-[9px] text-slate-400 font-mono font-bold">{doc.size || "1.0 MB"} • فرمت PDF</span>
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
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/10 dark:shadow-none space-y-6">
                <h3 className="font-extrabold text-xs text-slate-700 dark:text-slate-200 border-r-4 border-indigo-500 pr-2">مدیریت سوالات متداول دانشجویان و دندانپزشکان</h3>
                
                <form onSubmit={handleCreateFAQ} className="space-y-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500">متن سوال (Question)</label>
                    <input 
                      type="text" 
                      value={newFaqQuestion}
                      onChange={(e) => setNewFaqQuestion(e.target.value)}
                      placeholder="چه موضوعاتی در دنتالفای بررسی می‌شوند؟"
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500">متن پاسخ کوتاه (Answer)</label>
                    <textarea 
                      value={newFaqAnswer}
                      onChange={(e) => setNewFaqAnswer(e.target.value)}
                      placeholder="پاسخ کوتاه و علمی متناسب را درج کنید..."
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs h-24 focus:outline-none focus:border-indigo-500 font-medium resize-none"
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <button 
                      type="submit"
                      className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-lg shadow-indigo-600/20"
                    >
                      افزودن سوال متداول
                    </button>
                  </div>
                </form>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {allFaqs.length === 0 ? (
                    <p className="text-center text-xs text-slate-400 py-4 font-bold italic">هیچ سوال متداولی ثبت نشده است.</p>
                  ) : (
                    allFaqs.map(faq => (
                      <div key={faq._id} className="py-4 space-y-1 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors px-2 rounded-lg">
                        <div className="flex items-start justify-between">
                          <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-100 flex items-center gap-1.5 leading-tight">
                            <HelpCircle className="w-4 h-4 text-indigo-600" />
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
                        <p className="text-[11px] text-slate-500 pr-5 leading-relaxed font-medium">{faq.answer}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : activeTab === "users" ? (
            /* --- USERS MANAGEMENT TAB --- */
            <div className="space-y-10">
              <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/10 dark:shadow-none">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-800 dark:text-white leading-tight">مدیریت جامع کاربران و سطوح دسترسی</h3>
                    <p className="text-[10px] text-slate-400 font-bold italic leading-tight">کنترل دسترسی و مدیریت هویت کاربران سیستم</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/10 dark:shadow-none overflow-hidden">
                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
                  <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.2em]">لیست فعالان پلتفرم</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="bg-slate-50/50 dark:bg-slate-900/30 text-slate-400 text-[10px] uppercase tracking-widest">
                        <th className="px-8 py-5 font-extrabold">پروفایل کاربر</th>
                        <th className="px-8 py-5 font-extrabold">ایمیل ثبت‌نامی</th>
                        <th className="px-8 py-5 font-extrabold text-center">وضعیت</th>
                        <th className="px-8 py-5 font-extrabold text-center">نقش</th>
                        <th className="px-8 py-5 font-extrabold text-left">عملیات کنترلی</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                      {allUsers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-12 text-center text-slate-400 font-bold text-xs italic">
                            هیچ رکوردی در پایگاه داده یافت نشد.
                          </td>
                        </tr>
                      ) : (
                        allUsers.map(user => (
                          <tr key={user._id || user.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors group">
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-4">
                                <img src={user.profilePicture || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200"} className="w-10 h-10 rounded-xl object-cover border-2 border-white dark:border-slate-700 shadow-md group-hover:scale-105 transition-transform" alt={user.name} />
                                <span className="font-extrabold text-slate-800 dark:text-white group-hover:text-indigo-600 transition-colors leading-tight">{user.name}</span>
                              </div>
                            </td>
                            <td className="px-8 py-5 text-slate-400 font-mono text-[11px] font-bold">{user.email}</td>
                            <td className="px-8 py-5 text-center">
                              {user.isSuspended ? (
                                <span className="px-3 py-1 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-lg font-bold text-[10px]">مسدود</span>
                              ) : (
                                <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg font-bold text-[10px]">فعال</span>
                              )}
                            </td>
                            <td className="px-8 py-5 text-center">
                              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg font-bold text-[10px] uppercase">
                                {user.role === 'author' ? 'نویسنده علمی' : user.role === 'admin' ? 'مدیر ارشد' : 'دانشجوی آکادمی'}
                              </span>
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex gap-3 justify-end items-center">
                                <button 
                                  onClick={() => {
                                    const nextRole = user.role === "author" ? "admin" : user.role === "admin" ? "student" : "author";
                                    const roleNames: any = { admin: "مدیر", author: "نویسنده", student: "دانشجو" };
                                    setCustomConfirm({
                                      title: "تغییر نقش کاربری",
                                      message: `آیا از تغییر سطح دسترسی ${user.name} به ${roleNames[nextRole]} اطمینان دارید؟`,
                                      onConfirm: async () => {
                                        try {
                                          const res = await fetch("/api/users/action", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ userId: user.id || user._id, action: "changeRole", newRole: nextRole })
                                          });
                                          if (res.ok) {
                                            showMessage(`نقش کاربری ${user.name} به ${roleNames[nextRole]} تغییر یافت.`);
                                            fetchAdminLists();
                                          }
                                        } catch (err) {
                                          alert("خطا در تغییر نقش.");
                                        }
                                      }
                                    });
                                  }}
                                  className="w-8 h-8 flex items-center justify-center bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-xl hover:bg-teal-600 hover:text-white transition-all cursor-pointer"
                                  title="تغییر نقش کاربری"
                                >
                                  <UserCog className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => {
                                    setSelectedUserToChangePassword(user);
                                    setNewPasswordForUser("");
                                  }}
                                  className="w-8 h-8 flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all cursor-pointer"
                                  title="تغییر رمز عبور"
                                >
                                  <Key className="w-4 h-4" />
                                </button>
                                
                                {user.isSuspended ? (
                                  <button 
                                    onClick={() => {
                                      setCustomConfirm({
                                        title: "فعال‌سازی حساب",
                                        message: `آیا می‌خواهید حساب ${user.name} را فعال کنید؟`,
                                        onConfirm: async () => {
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
                                        }
                                      });
                                    }}
                                    className="w-8 h-8 flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-600 hover:text-white transition-all cursor-pointer"
                                    title="رفع مسدودیت"
                                  >
                                    <Unlock className="w-4 h-4" />
                                  </button>
                                ) : (
                                  <button 
                                    onClick={() => {
                                      setCustomConfirm({
                                        title: "تعلیق حساب کاربری",
                                        message: `آیا از تعلیق حساب ${user.name} اطمینان دارید؟`,
                                        onConfirm: async () => {
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
                                        }
                                      });
                                    }}
                                    className="w-8 h-8 flex items-center justify-center bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                                    title="تعلیق حساب"
                                  >
                                    <Lock className="w-4 h-4" />
                                  </button>
                                )}

                                <button 
                                  onClick={() => {
                                    if ((user.id || user._id) === currentUser.id || (user.id || user._id) === currentUser._id) {
                                      alert("شما نمی‌توانید حساب کاربری خودتان را حذف کنید!");
                                      return;
                                    }
                                    setCustomConfirm({
                                      title: "حذف کامل حساب کاربری",
                                      message: `آیا از حذف دائم حساب ${user.name} اطمینان دارید؟`,
                                      onConfirm: async () => {
                                        try {
                                          const res = await fetch("/api/users/action", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ userId: user.id || user._id, action: "delete" })
                                          });
                                          if (res.ok) {
                                            showMessage(`حساب کاربر ${user.name} با موفقیت حذف شد.`);
                                            fetchAdminLists();
                                          }
                                        } catch (err) {
                                          alert("خطا در ارتباط با سرور");
                                        }
                                      }
                                    });
                                  }}
                                  className="w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-xl hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                                  title="حذف کامل"
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
            </div>
          ) : (
            /* --- PROFILE TAB --- */
            <div className="max-w-2xl bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 p-10 shadow-xl shadow-slate-200/10 dark:shadow-none space-y-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-800 dark:text-white leading-tight">پروفایل کاربری و امنیت</h3>
                  <p className="text-[10px] text-slate-400 font-bold italic leading-tight">مدیریت هویت شخصی و تنظیمات امنیتی</p>
                </div>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-8">
                <div className="flex flex-col items-center gap-6 pb-6">
                  <div className="relative group">
                    <img 
                      src={profilePicLinkInput.trim() || profilePicBase64 || currentUser?.profilePicture || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200"} 
                      className="w-32 h-32 rounded-[2.5rem] object-cover border-4 border-white dark:border-slate-700 shadow-xl group-hover:scale-[1.02] transition-transform"
                      alt="Profile"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-[2.5rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "profile")}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block mb-2">تغییر آواتار پزشک</span>
                    <input 
                      type="text" 
                      value={profilePicLinkInput}
                      onChange={(e) => setProfilePicLinkInput(e.target.value)}
                      placeholder="یا لینک مستقیم تصویر را وارد کنید..."
                      className="w-64 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl text-[10px] text-center font-bold focus:outline-none focus:border-indigo-500 transition-all"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 mr-2">نام و نام خانوادگی پزشک</label>
                    <input 
                      type="text" 
                      value={profileNameInput}
                      onChange={(e) => setProfileNameInput(e.target.value)}
                      placeholder="دکتر ..."
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold focus:outline-none focus:border-indigo-500 transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 mr-2">پست الکترونیک</label>
                    <input 
                      type="email" 
                      value={profileEmailInput}
                      onChange={(e) => setProfileEmailInput(e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold text-left focus:outline-none focus:border-indigo-500 transition-all"
                      dir="ltr"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 mr-2">جنسیت</label>
                    <select 
                      value={profileGenderInput}
                      onChange={(e) => setProfileGenderInput(e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold text-right focus:outline-none focus:border-indigo-500 transition-all appearance-none"
                    >
                      <option value="">انتخاب کنید</option>
                      <option value="male">آقا</option>
                      <option value="female">خانم</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-8">
                  <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.2em] block mb-4">تغییر رمز عبور امنیتی</span>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-500 mr-2">رمز عبور فعلی</label>
                      <input 
                        type="password" 
                        value={oldPasswordInput}
                        onChange={(e) => setOldPasswordInput(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold focus:outline-none focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 mr-2">رمز عبور جدید</label>
                        <input 
                          type="password" 
                          value={newPasswordInput}
                          onChange={(e) => setNewPasswordInput(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold focus:outline-none focus:border-indigo-500 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 mr-2">تکرار رمز جدید</label>
                        <input 
                          type="password" 
                          value={confirmPasswordInput}
                          onChange={(e) => setConfirmPasswordInput(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold focus:outline-none focus:border-indigo-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {profileMsg && (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl text-xs font-bold text-center">
                    {profileMsg}
                  </div>
                )}

                <button 
                  type="submit"
                  className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-[1.5rem] transition-all cursor-pointer shadow-xl shadow-indigo-600/20 active:scale-[0.98]"
                >
                  ذخیره تغییرات و بروزرسانی پروفایل
                </button>
              </form>
            </div>
          )}
        </div>
      </main>


      {/* Rejection Modal */}
      {rejectionModalPostId && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 leading-tight">توضیح بازخورد عدم تایید مقاله</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">لطفاً دلیل علمی، بالینی یا ساختاری رد این پست را با جزئیات بنویسید تا نویسنده برای انتشار مجدد اصلاح کند.</p>
            <textarea 
              value={rejectionReasonInput}
              onChange={(e) => setRejectionReasonInput(e.target.value)}
              placeholder="مثال: لزوم استفاده از تصاویر تراش دندان با وضوح بالاتر..."
              className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs h-32 focus:outline-none focus:border-rose-500 font-medium"
            />
            <div className="flex gap-2">
              <button 
                onClick={handleRejectPostSubmit}
                className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors shadow-lg shadow-rose-500/20"
              >
                ارسال رد پست
              </button>
              <button 
                onClick={() => setRejectionModalPostId(null)}
                className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl cursor-pointer transition-colors"
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

      {/* RBAC Role & Permissions Modal */}
      {selectedUserForRoleModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] animate-fade-in" style={{ direction: "rtl" }}>
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 p-8 max-w-lg w-full space-y-6 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center shadow-md">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-800 dark:text-white leading-tight">
                    تنظیم نقش و سطح دسترسی کاربر
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold">{selectedUserForRoleModal.name} ({selectedUserForRoleModal.email})</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedUserForRoleModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Role Radio Select */}
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-700 dark:text-slate-200">انتخاب نقش کاربری اصلی:</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "admin", label: "👑 مدیر ارشد", desc: "دسترسی کامل به تمام بخش‌ها" },
                  { id: "editor", label: "✍️ ویراستار ارشد", desc: "مدیریت و تایید مقالات و نظرات" },
                  { id: "author", label: "📝 نویسنده علمی", desc: "نگارش و انتشار مقالات خود" },
                  { id: "student", label: "🎓 دانشجوی آکادمی", desc: "مطالعه دروس، دیدگاه و کوئیزها" }
                ].map(r => (
                  <button
                    type="button"
                    key={r.id}
                    onClick={() => {
                      setTargetRole(r.id as any);
                      // Default preset permissions
                      if (r.id === "admin") {
                        setTargetPermissions(AVAILABLE_PERMISSIONS.map(p => p.key));
                      } else if (r.id === "editor") {
                        setTargetPermissions(["posts:create", "posts:publish", "posts:edit_all", "comments:manage", "courses:manage"]);
                      } else if (r.id === "author") {
                        setTargetPermissions(["posts:create"]);
                      } else {
                        setTargetPermissions([]);
                      }
                    }}
                    className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer ${targetRole === r.id ? "bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-600 text-indigo-900 dark:text-indigo-200 shadow-sm" : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300"}`}
                  >
                    <div className="font-extrabold text-xs">{r.label}</div>
                    <div className="text-[10px] text-slate-400 mt-1">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Permissions Checkboxes */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-black text-slate-700 dark:text-slate-200">مجوزها و دسترسی‌های تفصیلی (Granular Permissions):</label>
                <button
                  type="button"
                  onClick={() => {
                    if (targetPermissions.length === AVAILABLE_PERMISSIONS.length) {
                      setTargetPermissions([]);
                    } else {
                      setTargetPermissions(AVAILABLE_PERMISSIONS.map(p => p.key));
                    }
                  }}
                  className="text-[10px] font-extrabold text-indigo-600 hover:underline"
                >
                  {targetPermissions.length === AVAILABLE_PERMISSIONS.length ? "لغو همه" : "انتخاب همه"}
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {AVAILABLE_PERMISSIONS.map(perm => {
                  const isChecked = targetPermissions.includes(perm.key);
                  return (
                    <label 
                      key={perm.key}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700 cursor-pointer hover:bg-slate-100/60 transition-colors"
                    >
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setTargetPermissions(prev => [...prev, perm.key]);
                          } else {
                            setTargetPermissions(prev => prev.filter(k => k !== perm.key));
                          }
                        }}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex-1">{perm.label}</span>
                      <span className="text-[9px] font-extrabold text-slate-400 bg-slate-200/70 dark:bg-slate-800 px-2 py-0.5 rounded-md">{perm.group}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setSelectedUserForRoleModal(null)}
                className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
              >
                انصراف
              </button>
              <button
                type="button"
                disabled={savingUserRole}
                onClick={handleSaveUserRole}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black transition-colors cursor-pointer shadow-lg shadow-indigo-600/20 disabled:opacity-50"
              >
                {savingUserRole ? "در حال ذخیره..." : "ذخیره دسترسی و نقش"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {customConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] animate-fade-in" style={{ direction: "rtl" }}>
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 p-8 max-w-sm w-full text-center space-y-6 shadow-2xl">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto shadow-md">
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
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold transition-colors cursor-pointer shadow-md shadow-indigo-600/20"
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
