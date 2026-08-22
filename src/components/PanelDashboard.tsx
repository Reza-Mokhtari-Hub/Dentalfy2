import React, { useState, useEffect } from "react";
import { 
  Shield, BookOpen, FileText, Users, Settings, LogOut, Menu, X, 
  PlusCircle, Trash2, CheckCircle, XCircle, ChevronLeft, ChevronUp, ChevronDown, 
  Upload, Download, HelpCircle, Lock, User, UserCog, RefreshCw, Eye, MessageSquare, Sparkles, Activity,
  Key, Unlock, Camera, Award, Grid, Search, Filter, ShieldCheck, CheckSquare, Square, UserCheck, AlertCircle,
  Code, FileCode, Terminal, Copy, Check, ExternalLink, Layers, Maximize2, SlidersHorizontal, BookmarkCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { IUser, ICourse, IPost, ISiteSettings, IAccountRequest, IBlock, ILibraryDoc, IComment, IFAQ } from "../types";
import { ClinicalHtmlRenderer } from "./ClinicalHtmlRenderer";

interface PanelDashboardProps {
  currentUser: IUser;
  settings: ISiteSettings;
  courses: ICourse[];
  posts: IPost[];
  onLogout: () => void;
  onRefreshData: () => void;
  onUpdateCurrentUser?: (user: Partial<IUser>) => void;
}

export function PanelDashboard({ currentUser, settings, courses, posts, onLogout, onRefreshData, onUpdateCurrentUser }: PanelDashboardProps) {
  const isAdmin = currentUser.role === "admin";
  const [activeTab, setActiveTab] = useState<"dashboard" | "posts" | "courses" | "categories" | "requests" | "siteSettings" | "profile" | "comments" | "libraryAndFaqs" | "users">("dashboard");
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
  const [adminEmailInput, setAdminEmailInput] = useState(settings.adminEmail || "");
  const [contactPhoneInput, setContactPhoneInput] = useState(settings.contactPhone || "");
  const [addressInput, setAddressInput] = useState(settings.address || "");
  const [footerTextInput, setFooterTextInput] = useState(settings.footerText || "");
  const [adminRecoveryCodeInput, setAdminRecoveryCodeInput] = useState(settings.adminRecoveryCode || "");
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [primaryColorInput, setPrimaryColorInput] = useState(settings.colorTheme?.primary || "#14b8a6");
  const [secondaryColorInput, setSecondaryColorInput] = useState(settings.colorTheme?.secondary || "#0d9488");
  const [clinicalBlueInput, setClinicalBlueInput] = useState(settings.colorTheme?.clinicalBlue || "#0284c7");

  useEffect(() => {
    setSiteNameInput(settings.siteName || "");
    setHeroTextInput(settings.heroText || "");
    setContactEmailInput(settings.contactEmail || "");
    setAdminEmailInput(settings.adminEmail || "");
    setContactPhoneInput(settings.contactPhone || "");
    setAddressInput(settings.address || "");
    setFooterTextInput(settings.footerText || "");
    setAdminRecoveryCodeInput(settings.adminRecoveryCode || "");
    setPrimaryColorInput(settings.colorTheme?.primary || "#14b8a6");
    setSecondaryColorInput(settings.colorTheme?.secondary || "#0d9488");
    setClinicalBlueInput(settings.colorTheme?.clinicalBlue || "#0284c7");
  }, [settings]);

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

  useEffect(() => {
    if (currentUser) {
      setProfileNameInput(currentUser.name || "");
      setProfileEmailInput(currentUser.email || "");
      setProfilePicBase64(currentUser.profilePicture || "");
      setProfileGenderInput(currentUser.gender || "");
    }
  }, [currentUser]);

  // Block Editor states
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [isSavingPost, setIsSavingPost] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [postTitle, setPostTitle] = useState("");
  const [postCourseId, setPostCourseId] = useState("");
  const [postCategory, setPostCategory] = useState("");
  const [postBlocks, setPostBlocks] = useState<IBlock[]>([]);
  const [postTags, setPostTags] = useState("");
  const [postSummary, setPostSummary] = useState("");
  const [postCoverImage, setPostCoverImage] = useState("");
  const [editorActiveSubTab, setEditorActiveSubTab] = useState<"edit" | "html_code" | "preview">("edit");
  const [fullHtmlInput, setFullHtmlInput] = useState("");
  const [htmlCopySuccess, setHtmlCopySuccess] = useState(false);
  const [showHtmlBlockPreview, setShowHtmlBlockPreview] = useState<{ [blockId: string]: boolean }>({});
  const [htmlPreviewDevice, setHtmlPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [htmlPreviewTheme, setHtmlPreviewTheme] = useState<"dark" | "light">("light");
  const [htmlStudioFullscreen, setHtmlStudioFullscreen] = useState(false);

  // AI Assistant states
  const [aiTopicInput, setAiTopicInput] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiAudience, setAiAudience] = useState<"specialists" | "patients">("specialists");
  const [aiFormat, setAiFormat] = useState<"comprehensive_article" | "case_report" | "step_by_step" | "faq_guide">("comprehensive_article");
  const [aiDepth, setAiDepth] = useState<"standard" | "ultra_deep">("ultra_deep");
  const [aiIncludeInteractive, setAiIncludeInteractive] = useState(true);
  const [aiShowAdvancedOptions, setAiShowAdvancedOptions] = useState(false);
  const [aiStepStatus, setAiStepStatus] = useState<string>("");

  // Quick Course Creation state for Article Writing
  const [showQuickAddCourse, setShowQuickAddCourse] = useState(false);
  const [quickCourseTitle, setQuickCourseTitle] = useState("");
  const [quickCourseAdding, setQuickCourseAdding] = useState(false);

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
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [catSearchQuery, setCatSearchQuery] = useState("");
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
          gender: profileGenderInput,
          oldPassword: oldPasswordInput || undefined,
          newPassword: newPasswordInput || undefined,
          profilePicture: finalPic
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProfileMsg("پروفایل کاربری با موفقیت بروزرسانی شد.");
        setOldPasswordInput("");
        setNewPasswordInput("");
        setConfirmPasswordInput("");
        if (data.user && onUpdateCurrentUser) {
          onUpdateCurrentUser(data.user);
        }
        onRefreshData();
      } else {
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
          adminEmail: adminEmailInput,
          contactPhone: contactPhoneInput,
          address: addressInput,
          footerText: footerTextInput,
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

  // Quick Course creation from Article Editor
  const handleQuickAddCourse = async () => {
    if (!quickCourseTitle.trim()) {
      alert("لطفاً عنوان درس جدید را وارد نمائید.");
      return;
    }
    setQuickCourseAdding(true);
    try {
      const res = await fetch("/api/courses/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title: quickCourseTitle.trim(), 
          description: "درس ثبت‌شده هنگام نگارش مقاله" 
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showMessage(`درس "${quickCourseTitle.trim()}" با موفقیت ایجاد و انتخاب شد.`);
        setQuickCourseTitle("");
        setShowQuickAddCourse(false);
        await fetchAdminLists();
        if (data.course?._id) {
          setPostCourseId(data.course._id);
        }
      } else {
        alert(data.error || "خطا در ایجاد درس جدید.");
      }
    } catch (err) {
      alert("خطا در برقراری ارتباط با سرور.");
    } finally {
      setQuickCourseAdding(false);
    }
  };

  const handleStartEditCourse = (course: ICourse) => {
    setEditingCourseId(course._id);
    setNewCourseTitle(course.title);
    setNewCourseDesc(course.description || "");
    setNewCourseSyllabus(course.syllabus || []);
    setTimeout(() => {
      const el = document.getElementById("course-form-section");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
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
    if (!newCatName.trim() || !newCatSlug.trim()) return;
    setIsSavingCategory(true);
    try {
      const isEdit = !!editingCategoryId;
      const endpoint = isEdit ? `/api/categories/${editingCategoryId}` : "/api/categories";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCatName.trim(),
          slug: newCatSlug.trim().toLowerCase(),
          parent: newCatParent || null
        })
      });
      if (res.ok) {
        showMessage(isEdit ? `دسته‌بندی "${newCatName}" با موفقیت بروزرسانی شد.` : `دسته‌بندی تخصصی "${newCatName}" با موفقیت تعریف شد.`);
        setNewCatName("");
        setNewCatSlug("");
        setNewCatParent("");
        setEditingCategoryId(null);
        fetchAdminLists();
      } else {
        const errData = await res.json();
        alert(errData.error || "خطا در ثبت دسته‌بندی.");
      }
    } catch (err) {
      console.error(err);
      alert("خطا در برقراری ارتباط با سرور.");
    } finally {
      setIsSavingCategory(false);
    }
  };

  const handleEditCategoryStart = (cat: any) => {
    setEditingCategoryId(cat._id);
    setNewCatName(cat.name);
    setNewCatSlug(cat.slug);
    setNewCatParent(cat.parent || "");
    setTimeout(() => {
      const el = document.getElementById("category-form-section");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const handleAddSubcategoryStart = (parentCat: any) => {
    setEditingCategoryId(null);
    setNewCatName("");
    setNewCatSlug("");
    setNewCatParent(parentCat.name || parentCat._id);
    setTimeout(() => {
      const el = document.getElementById("category-form-section");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const handleCancelCategoryEdit = () => {
    setEditingCategoryId(null);
    setNewCatName("");
    setNewCatSlug("");
    setNewCatParent("");
  };

  const handleSeedDefaultCategories = async () => {
    try {
      const res = await fetch("/api/categories/seed-defaults", { method: "POST" });
      if (res.ok) {
        showMessage("دسته‌بندی‌های پایه دندانپزشکی با موفقیت بارگذاری شدند.");
        fetchAdminLists();
      } else {
        alert("خطا در بارگذاری دسته‌بندی‌های پیش‌فرض.");
      }
    } catch (err) {
      alert("خطا در برقراری ارتباط با سرور.");
    }
  };

  const handleAutoGenerateSlug = (name: string) => {
    const map: Record<string, string> = {
      "ارتودنسی": "orthodontics",
      "اندودنتیکس": "endodontics",
      "اندو": "endo",
      "ترمیمی و زیبایی": "restorative-cosmetic",
      "ترمیمی": "restorative",
      "زیبایی": "cosmetic",
      "جراحی فک و صورت": "maxillofacial-surgery",
      "جراحی": "surgery",
      "ایمپلنت": "implant",
      "ایمپلنتولوژی": "implantology",
      "پریودنتیکس": "periodontics",
      "پریو": "perio",
      "دندانپزشکی کودکان": "pediatric-dentistry",
      "کودکان": "pediatrics",
      "بیماری‌های دهان و فک": "oral-medicine",
      "پروتزهای دندانی": "prosthodontics",
      "رادیولوژی دهان": "oral-radiology",
      "پاتولوژی دهان": "oral-pathology"
    };

    const trimmed = name.trim();
    if (map[trimmed]) {
      setNewCatSlug(map[trimmed]);
    } else {
      const slug = trimmed
        .toLowerCase()
        .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, '')
        .replace(/\s+/g, '-');
      setNewCatSlug(slug || "category-" + Date.now().toString().slice(-4));
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

  // Helper to convert existing post blocks into clean HTML string
  const convertBlocksToHtml = (blocks: IBlock[]): string => {
    if (!blocks || blocks.length === 0) return "<!-- مقاله خالی است -->";
    return blocks.map(b => {
      switch (b.type) {
        case "heading": {
          const val = typeof b.value === "object" ? b.value : { text: b.value || "", level: "h2" };
          const tag = val.level === "h3" ? "h3" : "h2";
          const cls = val.level === "h3" ? "text-lg font-bold text-slate-800 dark:text-slate-100 border-r-4 border-emerald-500 pr-2 my-4" : "text-xl font-black text-slate-900 dark:text-slate-100 border-r-4 border-teal-600 pr-3 my-5";
          return `<${tag} class="${cls}">${val.text || ""}</${tag}>`;
        }
        case "text": {
          const text = typeof b.value === "object" ? (b.value?.text || "") : (b.value || "");
          return `<p class="my-4 text-slate-700 dark:text-slate-200 leading-relaxed font-medium">${(text || "").replace(/\n/g, "<br/>")}</p>`;
        }
        case "quote": {
          const val = typeof b.value === "object" ? b.value : { text: b.value || "", author: "دنتالفای" };
          return `<blockquote class="p-4 my-4 bg-teal-50 dark:bg-slate-800 border-r-4 border-teal-600 rounded-lg text-teal-900 dark:text-teal-300 font-medium italic">\n  <p>«${val.text || ""}»</p>\n  ${val.author ? `<cite class="block mt-2 text-xs font-bold text-teal-700 dark:text-teal-400 not-italic">— ${val.author}</cite>` : ""}\n</blockquote>`;
        }
        case "list": {
          const val = typeof b.value === "object" && !Array.isArray(b.value) ? b.value : { items: Array.isArray(b.value) ? b.value : [""], listType: "bullet" };
          const tag = val.listType === "ordered" ? "ol" : "ul";
          const listCls = val.listType === "ordered" ? "list-decimal pr-6 my-4 space-y-2 text-slate-700 dark:text-slate-200 font-semibold text-sm" : "list-disc pr-6 my-4 space-y-2 text-slate-700 dark:text-slate-200 font-semibold text-sm";
          const items = (val.items || []).map((it: string) => `  <li>${it}</li>`).join("\n");
          return `<${tag} class="${listCls}">\n${items}\n</${tag}>`;
        }
        case "image": {
          const val = typeof b.value === "object" ? b.value : { url: b.value || "", caption: "" };
          return `<figure class="my-6 text-center">\n  <img src="${val.url || ""}" alt="${val.caption || "تصویر دنتالفای"}" class="rounded-2xl border border-slate-200 dark:border-slate-700 max-h-96 mx-auto object-cover shadow-md"/>\n  ${val.caption ? `<figcaption class="mt-2 text-xs text-slate-400 font-medium">${val.caption}</figcaption>` : ""}\n</figure>`;
        }
        case "video": {
          const val = typeof b.value === "object" ? b.value : { url: b.value || "", caption: "" };
          return `<div class="my-6 aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">\n  <iframe src="${val.url || ""}" class="w-full h-full" allowfullscreen></iframe>\n</div>`;
        }
        case "pdf": {
          const val = typeof b.value === "object" ? b.value : { url: b.value || "", name: "فایل راهنما" };
          return `<div class="my-4 p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-between">\n  <span class="font-bold text-xs text-teal-700 dark:text-teal-300">📄 ${val.name || "سند ضمیمه"}</span>\n  <a href="${val.url || "#"}" download class="px-4 py-2 bg-teal-600 text-white font-bold text-xs rounded-xl hover:bg-teal-700 transition">دانلود PDF</a>\n</div>`;
        }
        case "divider": {
          return `<hr class="my-6 border-t border-dashed border-slate-300 dark:border-slate-700"/>`;
        }
        case "html": {
          const code = typeof b.value === "object" ? (b.value?.code || b.value?.text || "") : (b.value || "");
          return code;
        }
        default:
          return "";
      }
    }).join("\n\n");
  };

  const handleApplyFullHtmlCodeToPost = () => {
    if (!fullHtmlInput.trim()) return;
    const newHtmlBlock: IBlock = {
      id: "b-html-" + Date.now(),
      type: "html",
      value: { code: fullHtmlInput }
    };
    setPostBlocks([newHtmlBlock]);
    showMessage("کد HTML مقاله با موفقیت در ساختار ذخیره شد.");
  };

  const insertSnippetIntoFullHtml = (snippet: string) => {
    setFullHtmlInput(prev => (prev ? prev + "\n\n" : "") + snippet);
  };

  const handleBeautifyHtml = () => {
    if (!fullHtmlInput.trim()) return;
    try {
      let indent = 0;
      const lines = fullHtmlInput.replace(/>\s*</g, ">\n<").split("\n");
      const formatted = lines.map(line => {
        let trimmed = line.trim();
        if (!trimmed) return "";
        if (trimmed.match(/^<\//)) {
          indent = Math.max(0, indent - 1);
        }
        const indented = "  ".repeat(indent) + trimmed;
        if (trimmed.match(/^<[^\/!?][^>]*[^\/]>$/) && !trimmed.match(/^<(img|hr|br|input|meta|link|source)/i)) {
          indent++;
        }
        return indented;
      }).filter(Boolean).join("\n");
      setFullHtmlInput(formatted);
      showMessage("کد HTML با موفقیت مرتب‌سازی و زیباسازی شد.");
    } catch (e) {
      alert("خطا در مرتب‌سازی کد HTML.");
    }
  };

  // Block Editor Actions
  const handleAddNewBlock = (type: "text" | "heading" | "image" | "video" | "pdf" | "quote" | "list" | "divider" | "html") => {
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
    } else if (type === "html") {
      defaultValue = { code: '<div class="p-4 bg-teal-50/70 dark:bg-slate-800 border-r-4 border-teal-600 rounded-xl my-4 text-teal-900 dark:text-teal-200 font-medium">\n  <h4 class="font-extrabold text-xs mb-1 text-teal-800 dark:text-teal-300">📌 عنوان کادر سفارشی HTML</h4>\n  <p class="text-xs leading-relaxed">متن خود را با تگ‌های سفارشی HTML بنویسید...</p>\n</div>' };
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
    setPostCategory(allCategories[0]?.name || allCategories[0]?.slug || "ترمیمی و زیبایی");
    setPostBlocks([
      { id: "b-first-txt", type: "text", value: "" }
    ]);
    setPostTags("");
    setPostSummary("");
    setPostCoverImage("");
    setFullHtmlInput("");
    setEditorActiveSubTab("edit");
    setIsCreatingPost(true);
  };

  // Edit rejected / existing post
  const handleStartEditPost = (post: IPost) => {
    setEditingPostId(post._id);
    setPostTitle(post.title);
    setPostCourseId(typeof post.course === "object" ? post.course?._id || "" : post.course || "");
    setPostCategory(post.category || allCategories[0]?.name || "ترمیمی و زیبایی");
    const initialBlocks = post.content || [];
    setPostBlocks(initialBlocks);
    setPostTags(post.tags ? post.tags.join(", ") : "");
    setPostSummary(post.summary || "");
    setPostCoverImage(post.coverImage || "");
    setFullHtmlInput(convertBlocksToHtml(initialBlocks));
    setEditorActiveSubTab("edit");
    setIsCreatingPost(true);
  };

  // Submit Post from Editor to DB (with role-based status option)
  const handleSavePostToDB = async (targetStatus: "draft" | "pending" | "published") => {
    if (isSavingPost) return;
    if (!postTitle.trim()) {
      alert("عنوان پست الزامی است.");
      return;
    }

    setIsSavingPost(true);

    const payload = {
      postId: editingPostId,
      title: postTitle.trim(),
      content: postBlocks,
      courseId: postCourseId,
      category: postCategory,
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
    } finally {
      setIsSavingPost(false);
    }
  };

  // AI Assisted Article Generation Call
  const handleAIGeneratePost = async () => {
    if (!aiTopicInput.trim()) {
      alert("لطفاً موضوع مقاله یا کلمات کلیدی مورد نظر خود را وارد نمائید.");
      return;
    }

    setAiGenerating(true);
    setAiStepStatus("در حال تحلیل منابع و رفرنس‌های جدید بالینی...");

    const t1 = setTimeout(() => {
      setAiStepStatus("در حال نگارش تخصصی، تدوین جداول مقایسه‌ای و کادرهای بالینی...");
    }, 2500);

    const t2 = setTimeout(() => {
      setAiStepStatus("در حال طراحی سوالات خودآزمایی و پایش نهایی کیفیت...");
    }, 5500);

    try {
      const res = await fetch("/api/ai/generate-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          topic: aiTopicInput.trim(),
          audience: aiAudience,
          format: aiFormat,
          depth: aiDepth,
          includeInteractive: aiIncludeInteractive
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPostTitle(data.title || "");
        setPostSummary(data.summary || "");
        setPostTags(data.tags || "");
        setPostBlocks(data.blocks || []);
        showMessage("مقاله فوق تخصصی و عمیق دندانپزشکی با موفقیت توسط هوش مصنوعی تولید و بارگذاری شد!");
      } else {
        alert(data.error || "تولید مقاله با هوش مصنوعی متاسفانه با خطا مواجه شد.");
      }
    } catch (err: any) {
      alert("خطا در برقراری ارتباط با سرور هوش مصنوعی.");
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      setAiGenerating(false);
      setAiStepStatus("");
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
                  onClick={() => { setActiveTab("categories"); setIsMobileSidebarOpen(false); setIsCreatingPost(false); }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-[1.25rem] font-bold text-sm transition-all duration-300 cursor-pointer group ${activeTab === "categories" ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-indigo-600"}`}
                >
                  <Grid className={`w-5 h-5 ${activeTab === "categories" ? "text-white" : "group-hover:scale-110 transition-transform"}`} /> 
                  دسته‌بندی‌های علمی
                  <span className={`mr-auto text-[10px] px-2.5 py-0.5 rounded-full font-bold ${activeTab === "categories" ? "bg-white/20 text-white" : "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400"}`}>{allCategories.length}</span>
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
                
                {/* Editor Tabs: Edit vs HTML Code vs Preview */}
                <div className="flex bg-slate-100 dark:bg-slate-900/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700 gap-1">
                  <button
                    onClick={() => setEditorActiveSubTab("edit")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${editorActiveSubTab === "edit" ? "bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-400 shadow-sm" : "text-slate-500 hover:text-slate-800 dark:text-slate-300"}`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>ویرایشگر بلوکی</span>
                  </button>
                  <button
                    onClick={() => {
                      setFullHtmlInput(convertBlocksToHtml(postBlocks));
                      setEditorActiveSubTab("html_code");
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${editorActiveSubTab === "html_code" ? "bg-slate-900 text-emerald-400 shadow-sm border border-slate-700" : "text-slate-500 hover:text-slate-800 dark:text-slate-300"}`}
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>ویرایش مستقیم HTML</span>
                  </button>
                  <button
                    onClick={() => setEditorActiveSubTab("preview")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${editorActiveSubTab === "preview" ? "bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-400 shadow-sm" : "text-slate-500 hover:text-slate-800 dark:text-slate-300"}`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>پیش‌نمایش بالینی</span>
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
                  <div className="bg-gradient-to-br from-teal-500/10 via-emerald-500/10 to-cyan-500/10 border border-teal-500/30 rounded-2xl p-5 space-y-4 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-teal-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-teal-600/20 shrink-0">
                          <Sparkles className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-black text-slate-900 dark:text-white">مولد فوق هوشمند و تخصصی مقالات دندانپزشکی</h4>
                            <span className="px-2 py-0.5 bg-teal-600 text-white font-mono text-[9px] font-extrabold rounded-full">Gemini 3.7 Pro</span>
                          </div>
                          <p className="text-[11px] text-teal-700 dark:text-teal-300 font-bold mt-0.5">تولید هوشمند مقالات مرجع، کیس رپورت‌ها و پروتکل‌های اجرایی با جداول مقایسه‌ای و تست خودآزمایی</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setAiShowAdvancedOptions(!aiShowAdvancedOptions)}
                        className="text-xs font-extrabold text-teal-700 dark:text-teal-300 hover:text-teal-900 dark:hover:text-teal-100 flex items-center gap-1.5 self-end md:self-auto bg-teal-500/10 hover:bg-teal-500/20 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        {aiShowAdvancedOptions ? "بستن تنظیمات پیشرفته" : "تنظیمات پیشرفته هوش مصنوعی"}
                      </button>
                    </div>

                    {/* Main Input Bar */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input 
                        type="text" 
                        value={aiTopicInput}
                        onChange={(e) => setAiTopicInput(e.target.value)}
                        placeholder="موضوع مقاله یا کلمات کلیدی (مثال: روش‌های تراش لبه دندان در درمان ونیر کامپوزیت)"
                        className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 border border-teal-200 dark:border-teal-800/60 rounded-xl text-xs focus:outline-none focus:border-teal-500 placeholder:text-slate-400 font-bold shadow-inner"
                      />
                      <button
                        type="button"
                        disabled={aiGenerating}
                        onClick={handleAIGeneratePost}
                        className="px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 disabled:opacity-50 text-white text-xs font-black rounded-xl transition-all shadow-lg shadow-teal-600/20 cursor-pointer shrink-0 flex items-center justify-center gap-2"
                      >
                        {aiGenerating ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            در حال تولید مقاله جامع...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            تولید مقاله فوق تخصصی
                          </>
                        )}
                      </button>
                    </div>

                    {/* Generation status banner */}
                    {aiGenerating && (
                      <div className="p-3 bg-teal-900/10 dark:bg-teal-900/30 border border-teal-500/30 rounded-xl flex items-center gap-3 animate-pulse">
                        <span className="w-3 h-3 bg-teal-500 rounded-full animate-ping"></span>
                        <p className="text-xs font-extrabold text-teal-800 dark:text-teal-200">
                          {aiStepStatus || "در حال ارتباط با موتور فوق تخصصی Gemini..."}
                        </p>
                      </div>
                    )}

                    {/* Suggested Hot Topics */}
                    <div className="space-y-1.5 pt-1">
                      <p className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <BookmarkCheck className="w-3 h-3 text-teal-600" /> موضوعات کلینیکی و کاربردی پیشنهادی:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          "پروتکل کامل آماده‌سازی کانال‌های خمیده اندودنتیکس با سیستم روتاری",
                          "تکنیک‌های تراش و باندینگ لمینت سرامیکی و لمینت کامپوزیتی",
                          "راهنمای بیحسی‌های موضعی فک پایین (تکنیک‌های ملامد و Gow-Gates)",
                          "مدیریت تحلیل استخوان و پیوند استخوان در ایمپلنتولوژی",
                          "تداخلات دارویی و هشدارهای سیستمیک در جراحی‌های دهان"
                        ].map((promptText, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setAiTopicInput(promptText)}
                            className="px-2.5 py-1 bg-white/80 dark:bg-slate-800/80 hover:bg-teal-50 dark:hover:bg-teal-950/50 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300 rounded-lg transition-all cursor-pointer"
                          >
                            + {promptText}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Advanced Options Panel */}
                    {aiShowAdvancedOptions && (
                      <div className="pt-3 border-t border-teal-500/20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-white/60 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                        {/* Audience */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold text-slate-600 dark:text-slate-300">مخاطب مقاله</label>
                          <select
                            value={aiAudience}
                            onChange={(e: any) => setAiAudience(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold focus:outline-none focus:border-teal-500"
                          >
                            <option value="specialists">دندانپزشکان و دانشجویان (تخصصی)</option>
                            <option value="patients">بیماران و عموم (آموزشی و روان)</option>
                          </select>
                        </div>

                        {/* Format */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold text-slate-600 dark:text-slate-300">فرمت ساختار محتوا</label>
                          <select
                            value={aiFormat}
                            onChange={(e: any) => setAiFormat(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold focus:outline-none focus:border-teal-500"
                          >
                            <option value="comprehensive_article">مقاله جامع و مرجع بالینی</option>
                            <option value="case_report">گزارش کیس بالینی (Case Report)</option>
                            <option value="step_by_step">پروتکل اجرایی گام‌به‌گام</option>
                            <option value="faq_guide">پاسخ به چالش‌ها و سوالات شایع</option>
                          </select>
                        </div>

                        {/* Depth */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold text-slate-600 dark:text-slate-300">عمق و حجم مقاله</label>
                          <select
                            value={aiDepth}
                            onChange={(e: any) => setAiDepth(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold focus:outline-none focus:border-teal-500"
                          >
                            <option value="ultra_deep">بسیار جامع و عمیق (۱۰-۱۵ بلوک غنی)</option>
                            <option value="standard">استاندارد و خلاصه (۷-۱۰ بلوک)</option>
                          </select>
                        </div>

                        {/* Interactive Toggle */}
                        <div className="space-y-1 flex flex-col justify-end">
                          <label className="text-[10px] font-extrabold text-slate-600 dark:text-slate-300 mb-1">عناصر تعاملی</label>
                          <label className="flex items-center gap-2 cursor-pointer bg-white dark:bg-slate-900 p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg">
                            <input
                              type="checkbox"
                              checked={aiIncludeInteractive}
                              onChange={(e) => setAiIncludeInteractive(e.target.checked)}
                              className="w-3.5 h-3.5 text-teal-600 rounded focus:ring-teal-500"
                            />
                            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">جدول مقایسه‌ای + کوییز</span>
                          </label>
                        </div>
                      </div>
                    )}
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

                    {/* Category Selection */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-500">دسته‌بندی موضوعی مقاله</label>
                        <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">
                          {allCategories.length > 0 ? `${allCategories.length} دسته تعریف‌شده` : "لیست عمومی"}
                        </span>
                      </div>
                      <select 
                        value={postCategory}
                        onChange={(e) => setPostCategory(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-teal-500 text-slate-800 dark:text-slate-100 font-bold cursor-pointer"
                      >
                        <option value="">-- انتخاب دسته‌بندی علمی --</option>
                        {allCategories.length > 0 ? (
                          allCategories.map(cat => (
                            <option key={cat._id || cat.slug} value={cat.name || cat.slug}>
                              {cat.name} {cat.parent ? `(زیرمجموعه ${cat.parent})` : ""}
                            </option>
                          ))
                        ) : (
                          <>
                            <option value="ترمیمی و زیبایی">ترمیمی و زیبایی</option>
                            <option value="اندودنتیکس">اندودنتیکس (درمان ریشه)</option>
                            <option value="پروتزهای دندانی">پروتزهای دندانی</option>
                            <option value="جراحی و ایمپلنت">جراحی و ایمپلنت</option>
                            <option value="ارتودنسی">ارتودنسی</option>
                            <option value="پریودنتیکس">پریودنتیکس</option>
                            <option value="عمومی">عمومی و سایر</option>
                          </>
                        )}
                      </select>
                    </div>

                    {/* Course Selection */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-500">مربوط به کدام درس تخصصی؟</label>
                        <button
                          type="button"
                          onClick={() => setShowQuickAddCourse(!showQuickAddCourse)}
                          className="text-[10px] text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-200 font-extrabold flex items-center gap-1 cursor-pointer bg-teal-50 dark:bg-teal-950/50 px-2 py-0.5 rounded-lg border border-teal-200 dark:border-teal-800/50 transition-all"
                        >
                          <PlusCircle className="w-3 h-3 text-teal-600" />
                          {showQuickAddCourse ? "بستن فرم" : "+ تعریف درس جدید"}
                        </button>
                      </div>

                      {showQuickAddCourse && (
                        <div className="p-3 bg-teal-50/90 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-xl space-y-2 animate-fadeIn">
                          <p className="text-[10px] font-extrabold text-teal-900 dark:text-teal-200">ایجاد و افزودن مستقیم درس به آکادمی:</p>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={quickCourseTitle}
                              onChange={(e) => setQuickCourseTitle(e.target.value)}
                              placeholder="عنوان درس جدید (مثال: اندودنتیکس ۳ یا پروتز ثابت ۲)"
                              className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-teal-200 dark:border-teal-700 rounded-lg text-xs font-bold focus:outline-none focus:border-teal-500"
                            />
                            <button
                              type="button"
                              disabled={quickCourseAdding}
                              onClick={handleQuickAddCourse}
                              className="px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg transition-all shrink-0 cursor-pointer disabled:opacity-50"
                            >
                              {quickCourseAdding ? "در حال ثبت..." : "ثبت و انتخاب"}
                            </button>
                          </div>
                        </div>
                      )}

                      <select 
                        value={postCourseId}
                        onChange={(e) => {
                          if (e.target.value === "__NEW__") {
                            setShowQuickAddCourse(true);
                          } else {
                            setPostCourseId(e.target.value);
                          }
                        }}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-teal-500 text-slate-800 dark:text-slate-100 font-bold cursor-pointer"
                      >
                        <option value="">-- بدون ارتباط مستقیم با درس (مقاله عمومی) --</option>
                        {allCourses.map(c => (
                          <option key={c._id} value={c._id}>{c.title}</option>
                        ))}
                        <option value="__NEW__">➕ (+ ایجاد و افزودن درس جدید...)</option>
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

                        {/* HTML / Custom Code Block */}
                        {block.type === "html" && (() => {
                          const hVal = typeof block.value === "object" ? (block.value?.code || block.value?.text || "") : (block.value || "");
                          const isPreview = !!showHtmlBlockPreview[block.id];

                          const insertSnippetIntoBlock = (snippet: string) => {
                            handleUpdateBlockValue(block.id, { code: (hVal ? hVal + "\n" : "") + snippet });
                          };

                          return (
                            <div className="space-y-3">
                              {/* HTML Snippets Toolbar for Block */}
                              <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-900 rounded-xl text-[10px] border border-slate-800">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className="text-emerald-400 font-mono font-bold px-1.5 py-0.5 bg-emerald-950/80 rounded border border-emerald-800/50">کد آماده:</span>
                                  <button 
                                    type="button"
                                    onClick={() => insertSnippetIntoBlock('<div class="p-4 my-4 bg-teal-50 dark:bg-slate-800 border-r-4 border-teal-600 rounded-xl text-teal-900 dark:text-teal-200 font-medium">\n  <h4 class="font-extrabold text-xs mb-1 text-teal-800 dark:text-teal-300">📌 نکته کلیدی بالینی</h4>\n  <p class="text-xs leading-relaxed">توضیحات و نکات کاربردی خود را وارد کنید...</p>\n</div>')}
                                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10px] font-bold cursor-pointer"
                                  >
                                    + کادر نکته
                                  </button>
                                  <button 
                                    type="button"
                                    onClick={() => insertSnippetIntoBlock('<div class="overflow-x-auto my-4">\n  <table class="w-full border-collapse border border-slate-200 dark:border-slate-700 text-right text-xs">\n    <thead>\n      <tr class="bg-teal-600 text-white font-bold">\n        <th class="p-2 border border-teal-700">پارامتر</th>\n        <th class="p-2 border border-teal-700">روش A</th>\n        <th class="p-2 border border-teal-700">روش B</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr class="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-800/30">\n        <td class="p-2 font-bold border border-slate-200 dark:border-slate-800">مقاومت خمشی</td>\n        <td class="p-2 border border-slate-200 dark:border-slate-800">120 MPa</td>\n        <td class="p-2 border border-slate-200 dark:border-slate-800">350 MPa</td>\n      </tr>\n    </tbody>\n  </table>\n</div>')}
                                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10px] font-bold cursor-pointer"
                                  >
                                    + جدول مقایسه‌ای
                                  </button>
                                  <button 
                                    type="button"
                                    onClick={() => insertSnippetIntoBlock('<span class="inline-block px-3 py-1 bg-teal-500/20 text-teal-300 font-extrabold text-[11px] rounded-full border border-teal-500/30 my-1">برچسب رنگی</span>')}
                                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10px] font-bold cursor-pointer"
                                  >
                                    + بج رنگی
                                  </button>
                                  <button 
                                    type="button"
                                    onClick={() => insertSnippetIntoBlock('<a href="#" target="_blank" class="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow transition-all">\n  دانلود راهنما مستقیم\n</a>')}
                                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10px] font-bold cursor-pointer"
                                  >
                                    + دکمه ویژه
                                  </button>
                                </div>
                                
                                <button
                                  type="button"
                                  onClick={() => setShowHtmlBlockPreview(prev => ({ ...prev, [block.id]: !prev[block.id] }))}
                                  className={`px-3 py-1 rounded font-bold transition-all text-[10px] cursor-pointer flex items-center gap-1 ${isPreview ? "bg-teal-500 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
                                >
                                  <Eye className="w-3 h-3" />
                                  {isPreview ? "ویرایش کد" : "پیش‌نمایش این بلوک"}
                                </button>
                              </div>

                              {!isPreview ? (
                                <textarea
                                  value={hVal}
                                  onChange={(e) => handleUpdateBlockValue(block.id, { code: e.target.value })}
                                  placeholder="کد HTML سفارشی خود را اینجا بنویسید (مانند <table>, <div>, <iframe>, <span>...)"
                                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-emerald-400 focus:outline-none focus:border-teal-500 h-40 leading-relaxed dir-ltr shadow-inner"
                                  dir="ltr"
                                />
                              ) : (
                                <div className="p-4 bg-white dark:bg-slate-800 border border-teal-500/30 rounded-xl shadow-sm text-xs leading-relaxed overflow-x-auto">
                                  <div className="text-[9px] font-bold text-teal-600 mb-2 font-mono flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-teal-500"></span> پیش‌نمایش رندر شده HTML:
                                  </div>
                                  <ClinicalHtmlRenderer htmlCode={hVal} />
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
                    <div className="flex flex-wrap gap-2 bg-slate-100 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 justify-center">
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
                      <button onClick={() => handleAddNewBlock("html")} className="px-3 py-1.5 bg-slate-900 text-emerald-400 hover:bg-slate-800 border border-slate-800 rounded-lg text-[10px] font-bold cursor-pointer transition-colors flex items-center gap-1 shadow-sm">
                        <Code className="w-3.5 h-3.5" /> + کد / HTML مستقیم
                      </button>
                      <button onClick={() => handleAddNewBlock("divider")} className="px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-teal-50 hover:text-teal-700 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-bold cursor-pointer transition-colors">
                        + خط جداکننده (Divider)
                      </button>
                    </div>
                  </div>

                  {/* Multi-role action buttons */}
                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3">
                    <button 
                      type="button"
                      disabled={isSavingPost}
                      onClick={() => handleSavePostToDB("draft")}
                      className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 dark:text-slate-200 font-extrabold rounded-xl text-xs transition-all cursor-pointer border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2"
                    >
                      {isSavingPost && <span className="w-3.5 h-3.5 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></span>}
                      ذخیره به عنوان پیش‌نویس
                    </button>
                    
                    {isAdmin ? (
                      <button 
                        type="button"
                        disabled={isSavingPost}
                        onClick={() => handleSavePostToDB("published")}
                        className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-extrabold rounded-xl text-xs transition-all shadow-lg shadow-teal-600/10 cursor-pointer flex items-center justify-center gap-2"
                      >
                        {isSavingPost && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                        انتشار مستقیم و فوری مقاله
                      </button>
                    ) : (
                      <button 
                        type="button"
                        disabled={isSavingPost}
                        onClick={() => handleSavePostToDB("pending")}
                        className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-extrabold rounded-xl text-xs transition-all shadow-lg shadow-teal-600/10 cursor-pointer flex items-center justify-center gap-2"
                      >
                        {isSavingPost && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                        ارسال جهت بررسی و تایید مدیر علمی
                      </button>
                    )}
                  </div>
                </div>
              ) : editorActiveSubTab === "html_code" ? (
                /* --- PROFESSIONAL RAW HTML CODE STUDIO VIEW --- */
                <div className={`bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 p-6 space-y-6 shadow-2xl transition-all ${htmlStudioFullscreen ? "fixed inset-2 z-[9999] overflow-y-auto bg-slate-950 rounded-2xl" : ""}`}>
                  {/* Studio Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                        <Code className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-white flex items-center gap-2">
                          استودیو هوشمند کدنویسی مستقیم HTML5
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-mono rounded-full border border-emerald-500/30">Clinical HTML5 Studio Pro</span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">محیط کامل ویرایش مستقیم کدهای HTML، ساخت جدول، کادرهای بالینی و استخراج هوشمند.</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={handleBeautifyHtml}
                        className="px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-xs font-bold rounded-xl transition-all cursor-pointer border border-indigo-500/40 flex items-center gap-1.5"
                        title="مرتب‌سازی و کُد تمیز"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> زیباسازی کد (Beautify)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const html = convertBlocksToHtml(postBlocks);
                          setFullHtmlInput(html);
                          showMessage("کد HTML مقاله با موفقیت از روی بلوک‌ها بازسازی شد.");
                        }}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer border border-slate-700 flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> استخراج از بلوک‌ها
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(fullHtmlInput);
                          setHtmlCopySuccess(true);
                          setTimeout(() => setHtmlCopySuccess(false), 2000);
                        }}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer border border-slate-700 flex items-center gap-1.5"
                      >
                        {htmlCopySuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {htmlCopySuccess ? "کپی شد!" : "کپی کد HTML"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setHtmlStudioFullscreen(!htmlStudioFullscreen)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer border border-slate-700 flex items-center gap-1.5"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        {htmlStudioFullscreen ? "خروج از تمام‌صفحه" : "تمام‌صفحه"}
                      </button>
                      <button
                        type="button"
                        onClick={handleApplyFullHtmlCodeToPost}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-600/20 flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-4 h-4" /> همگام‌سازی و اعمال کد
                      </button>
                    </div>
                  </div>

                  {/* Quick HTML Snippet Preset Buttons */}
                  <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 space-y-3">
                    <div className="flex items-center justify-between text-xs font-extrabold text-slate-300">
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        <Sparkles className="w-4 h-4" /> میانبرهای کدهای جاهای مختلف دندانپزشکی (Clinical HTML Snippets)
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">درج با ۱ کلیک</span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => insertSnippetIntoFullHtml('<div class="p-4 my-4 bg-teal-50 dark:bg-slate-800 border-r-4 border-teal-600 rounded-xl text-teal-900 dark:text-teal-200 font-medium shadow-sm">\n  <h4 class="font-extrabold text-xs mb-1 text-teal-800 dark:text-teal-300">📌 نکته کلیدی بالینی</h4>\n  <p class="text-xs leading-relaxed">توضیحات و نکات کاربردی دندانپزشکی را اینجا وارد نمائید...</p>\n</div>')}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-1 hover:border-teal-500/50"
                      >
                        💡 کادر نکته (Callout)
                      </button>
                      <button
                        type="button"
                        onClick={() => insertSnippetIntoFullHtml('<div class="p-4 my-4 bg-amber-50 dark:bg-amber-950/40 border-r-4 border-amber-500 rounded-xl text-amber-900 dark:text-amber-200 font-medium shadow-sm">\n  <h4 class="font-extrabold text-xs mb-1 text-amber-800 dark:text-amber-400">⚠️ هشدار ایمنی درمان</h4>\n  <p class="text-xs leading-relaxed">احتیاط‌ها و کنترااندیکاسیون‌های بالینی...</p>\n</div>')}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-1 hover:border-amber-500/50"
                      >
                        ⚠️ باکس هشدار بالینی
                      </button>
                      <button
                        type="button"
                        onClick={() => insertSnippetIntoFullHtml('<div class="overflow-x-auto my-5">\n  <table class="w-full border-collapse border border-slate-200 dark:border-slate-700 text-right text-xs">\n    <thead>\n      <tr class="bg-teal-600 text-white font-bold">\n        <th class="p-2.5 border border-teal-700">ویژگی / متریال</th>\n        <th class="p-2.5 border border-teal-700">کامپوزیت خلفی</th>\n        <th class="p-2.5 border border-teal-700">آمالگام ماتریکس</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr class="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-800/30">\n        <td class="p-2.5 font-bold border border-slate-200 dark:border-slate-800">مقاومت سایشی</td>\n        <td class="p-2.5 border border-slate-200 dark:border-slate-800">عالی (۴۰۰ MPa)</td>\n        <td class="p-2.5 border border-slate-200 dark:border-slate-800">متوسط (۲۵۰ MPa)</td>\n      </tr>\n    </tbody>\n  </table>\n</div>')}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-1 hover:border-emerald-500/50"
                      >
                        📊 جدول مقایسه‌ای
                      </button>
                      <button
                        type="button"
                        onClick={() => insertSnippetIntoFullHtml('<details class="my-4 border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-slate-50 dark:bg-slate-900/60">\n  <summary class="font-bold text-teal-700 dark:text-teal-400 cursor-pointer">❓ پرسش: پروتکل اچینگ در عاج دندان چگونه است؟</summary>\n  <p class="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">پاسخ: اچینگ عاج نباید بیش از ۱۵ ثانیه به طول انجامد تا از آسیب به الیاف کلاژن جلوگیری شود.</p>\n</details>')}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-1 hover:border-indigo-500/50"
                      >
                        📂 آکاردئون پرسش و پاسخ
                      </button>
                      <button
                        type="button"
                        onClick={() => insertSnippetIntoFullHtml('<div class="p-4 my-4 bg-slate-900 border border-teal-500/30 rounded-2xl shadow-lg">\n  <span class="px-2.5 py-0.5 bg-teal-500/20 text-teal-300 font-extrabold text-[10px] rounded-full">مرور کیس بالینی #۱۰۲</span>\n  <h4 class="font-black text-sm text-white mt-2">بازسازی اندودنتیک دندان ۶ بالا</h4>\n  <p class="text-xs text-slate-300 mt-1 leading-relaxed">گزارش مرحله به مرحله عصب‌کشی و ترمیم تاج با پین و کامپوزیت...</p>\n</div>')}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-1 hover:border-cyan-500/50"
                      >
                        🩺 کارت کیس بالینی
                      </button>
                      <button
                        type="button"
                        onClick={() => insertSnippetIntoFullHtml('<span class="inline-block px-3 py-1 bg-teal-500/20 text-teal-300 font-extrabold text-xs rounded-full border border-teal-500/30 my-1"># پروتکل جراحی</span>')}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-1 hover:border-sky-500/50"
                      >
                        🏷️ برچسب رنگی (Badge)
                      </button>
                      <button
                        type="button"
                        onClick={() => insertSnippetIntoFullHtml('<div class="my-6 aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl">\n  <iframe src="https://www.aparat.com/video/video/embed/videohash/xxx/vt/frame" class="w-full h-full" allowfullscreen></iframe>\n</div>')}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-1 hover:border-rose-500/50"
                      >
                        🎥 آی‌فریم ویدیو Aparat
                      </button>
                      <button
                        type="button"
                        onClick={() => insertSnippetIntoFullHtml('<a href="#" target="_blank" class="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all my-2">\n  📥 دریافت فایل راهنمای بالینی دندانپزشکی\n</a>')}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-1 hover:border-purple-500/50"
                      >
                        🔘 دکمه دانلود / CTA
                      </button>
                      <button
                        type="button"
                        onClick={() => insertSnippetIntoFullHtml('<mark class="bg-amber-300/30 text-amber-200 px-2 py-0.5 rounded font-bold border border-amber-500/30">متن مورد نظر جهت هایلایت</mark>')}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-1 hover:border-amber-400/50"
                      >
                        🎨 هایلایت زرد
                      </button>
                    </div>
                  </div>

                  {/* Textarea Code Editor */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
                      <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <Terminal className="w-4 h-4" /> ویرایشگر کد HTML5 (Monospace Editor)
                      </span>
                      <span>تعداد کاراکتر: {fullHtmlInput.length.toLocaleString("fa-IR")} | خطوط: {fullHtmlInput.split("\n").length.toLocaleString("fa-IR")}</span>
                    </div>
                    <textarea
                      value={fullHtmlInput}
                      onChange={(e) => setFullHtmlInput(e.target.value)}
                      placeholder="کدهای HTML خود را اینجا تایپ کنید یا کدهای آماده را از بالا درج نمائید..."
                      className={`w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-2xl font-mono text-xs text-emerald-400 focus:outline-none focus:border-emerald-500 leading-relaxed dir-ltr shadow-inner ${htmlStudioFullscreen ? "h-[320px]" : "min-h-[360px]"}`}
                      dir="ltr"
                    />
                  </div>

                  {/* Live Rendered HTML Preview Controls & Container */}
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                      <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                        <Eye className="w-4 h-4 text-emerald-400" />
                        پیش‌نمایش زنده و رندرشده خروجی کد HTML (Live Renderer)
                      </h4>
                      
                      {/* Preview Controls: Theme & Viewport */}
                      <div className="flex items-center gap-3">
                        {/* Theme Switcher */}
                        <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[10px] font-bold">
                          <button
                            type="button"
                            onClick={() => setHtmlPreviewTheme("light")}
                            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${htmlPreviewTheme === "light" ? "bg-white text-slate-900 shadow-xs" : "text-slate-400 hover:text-white"}`}
                          >
                            ☀️ تم روشن
                          </button>
                          <button
                            type="button"
                            onClick={() => setHtmlPreviewTheme("dark")}
                            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${htmlPreviewTheme === "dark" ? "bg-slate-800 text-teal-300 shadow-xs" : "text-slate-400 hover:text-white"}`}
                          >
                            🌙 تم تاریک
                          </button>
                        </div>

                        {/* Viewport Switcher */}
                        <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[10px] font-bold">
                          <button
                            type="button"
                            onClick={() => setHtmlPreviewDevice("desktop")}
                            className={`px-2 py-1 rounded-md transition-all cursor-pointer ${htmlPreviewDevice === "desktop" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"}`}
                          >
                            دسکتاپ
                          </button>
                          <button
                            type="button"
                            onClick={() => setHtmlPreviewDevice("tablet")}
                            className={`px-2 py-1 rounded-md transition-all cursor-pointer ${htmlPreviewDevice === "tablet" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"}`}
                          >
                            تبلت (768px)
                          </button>
                          <button
                            type="button"
                            onClick={() => setHtmlPreviewDevice("mobile")}
                            className={`px-2 py-1 rounded-md transition-all cursor-pointer ${htmlPreviewDevice === "mobile" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"}`}
                          >
                            موبایل (375px)
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Preview Box */}
                    <div className="p-2 sm:p-4 bg-slate-900 rounded-xl overflow-x-auto">
                      <div 
                        className={`p-6 rounded-2xl border transition-all ${htmlPreviewTheme === "dark" ? "bg-slate-900 text-slate-100 border-slate-800" : "bg-white text-slate-800 border-slate-200"} ${htmlPreviewDevice === "mobile" ? "max-w-[375px] mx-auto shadow-2xl rounded-3xl border-4 border-slate-700" : htmlPreviewDevice === "tablet" ? "max-w-[768px] mx-auto" : "w-full"}`}
                        dir="rtl"
                      >
                        {fullHtmlInput ? (
                          <ClinicalHtmlRenderer htmlCode={fullHtmlInput} />
                        ) : (
                          <p className="text-slate-400 italic text-center py-10 text-xs font-medium">کد HTML را در ادیتور بالا وارد فرمائید تا پیش‌نمایش زنده اینجا نمایش داده شود.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Actions */}
                  <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
                    <button 
                      type="button"
                      onClick={() => {
                        handleApplyFullHtmlCodeToPost();
                        setEditorActiveSubTab("edit");
                      }}
                      className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs transition-all shadow-lg shadow-emerald-600/20 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" /> اعمال کد HTML و بازگشت به ویرایشگر بلوکی
                    </button>
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
                        case "html": {
                          const hVal = typeof block.value === "object" ? (block.value?.code || block.value?.text || "") : (block.value || "");
                          return (
                            <ClinicalHtmlRenderer key={block.id || idx} htmlCode={hVal} />
                          );
                        }
                        case "quiz": {
                          const qVal = block.value || {};
                          return (
                            <div key={block.id || idx} className="p-4 bg-slate-900 text-white rounded-xl text-xs space-y-2 border border-slate-800">
                              <span className="text-teal-400 font-extrabold text-[10px]">کوییز و خودآزمایی بالینی:</span>
                              <p className="font-bold">{qVal.question || "سوال خودآزمایی"}</p>
                              <div className="grid grid-cols-2 gap-1.5 pt-1">
                                {(qVal.options || []).map((o: string, oI: number) => (
                                  <div key={oI} className={`p-2 rounded-lg border text-[11px] ${oI === (qVal.correctAnswer ?? 0) ? "border-emerald-500 bg-emerald-950/40 text-emerald-300 font-bold" : "border-slate-700 bg-slate-800 text-slate-300"}`}>
                                    {oI + 1}. {o}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }
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
              <div id="course-form-section" className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/10 dark:shadow-none space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-800 dark:text-white leading-tight">
                      {editingCourseId ? `ویرایش جزئیات سرفصل: ${newCourseTitle}` : "تعریف سرفصل آموزشی جدید"}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold italic leading-tight">مدیریت سرفصل‌های آکادمیک</p>
                  </div>
                  {editingCourseId && (
                    <button 
                      type="button"
                      onClick={() => {
                        setEditingCourseId(null);
                        setNewCourseTitle("");
                        setNewCourseDesc("");
                        setNewCourseSyllabus([]);
                      }}
                      className="mr-auto text-[10px] font-bold text-rose-500 hover:text-rose-600 underline cursor-pointer"
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
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-slate-500 mr-2">افزودن مباحث و سرفصل‌های زیرمجموعه</label>
                      <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                        {newCourseSyllabus.length} مبحث ثبت‌شده
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <input 
                        type="text"
                        value={syllabusInput}
                        onChange={(e) => setSyllabusInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddSyllabusItem();
                          }
                        }}
                        placeholder="نام مبحث را وارد کنید و کلید اینتر یا ثبت مبحث را بزنید..."
                        className="flex-1 px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold focus:outline-none focus:border-indigo-500 transition-all"
                      />
                      <button 
                        type="button"
                        onClick={handleAddSyllabusItem}
                        className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl transition-all active:scale-95 cursor-pointer shadow-lg shadow-indigo-600/20"
                      >
                        + ثبت مبحث
                      </button>
                    </div>
                    
                    {newCourseSyllabus.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-4">
                        {newCourseSyllabus.map((item, idx) => (
                          <div key={idx} className="bg-indigo-50/80 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold px-4 py-3 rounded-2xl flex items-center justify-between group">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <span className="w-5 h-5 rounded-lg bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-100 text-[10px] flex items-center justify-center shrink-0 font-extrabold">
                                {idx + 1}
                              </span>
                              <span className="truncate">{item}</span>
                            </div>
                            <button 
                              type="button"
                              onClick={() => setNewCourseSyllabus(prev => prev.filter((_, i) => i !== idx))}
                              className="text-indigo-400 hover:text-rose-600 transition-colors cursor-pointer shrink-0"
                              title="حذف مبحث"
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
          ) : activeTab === "categories" ? (
            /* --- SCIENTIFIC CATEGORIES MANAGEMENT --- */
            <div className="space-y-8 animate-fade-in max-w-6xl">
              {/* Header Bar */}
              <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/10 dark:shadow-none flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
                    <Grid className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-800 dark:text-white leading-tight">
                      مدیریت دسته‌بندی‌های علمی
                    </h3>
                    <p className="text-xs text-slate-400 font-bold mt-1">
                      دسته‌بندی موضوعی مقالات، دروس و سرفصل‌های تخصصی دنتالفای
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSeedDefaultCategories}
                    className="px-5 py-3.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 text-xs font-bold rounded-2xl transition-all cursor-pointer flex items-center gap-2 border border-emerald-200 dark:border-emerald-800/50"
                  >
                    <Sparkles className="w-4 h-4" />
                    🌱 درج سریع دسته‌بندی‌های پایه دندانپزشکی
                  </button>
                  <button
                    type="button"
                    onClick={fetchAdminLists}
                    className="p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl hover:bg-slate-100 transition-all cursor-pointer"
                    title="به‌روزرسانی"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Form and Quick Stats Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Category Registration / Edit Form */}
                <div id="category-form-section" className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/10 dark:shadow-none space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
                        {editingCategoryId ? "ویرایش دسته‌بندی علمی" : newCatParent ? `افزودن زیردسته موضوعی` : "ثبت دسته‌بندی علمی جدید"}
                      </h4>
                      {newCatParent && !editingCategoryId && (
                        <p className="text-[10px] font-bold text-teal-600 dark:text-teal-400 mt-1">
                          ↳ این دسته جدید به عنوان زیرمجموعه «{newCatParent}» تعریف خواهد شد.
                        </p>
                      )}
                    </div>
                    {(editingCategoryId || newCatParent) && (
                      <button
                        type="button"
                        onClick={handleCancelCategoryEdit}
                        className="text-xs font-bold text-rose-500 hover:text-rose-600 underline cursor-pointer"
                      >
                        انصراف
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleCreateCategory} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mr-1">
                          نام دسته‌بندی <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={newCatName}
                          onChange={(e) => {
                            setNewCatName(e.target.value);
                            if (!newCatSlug || !editingCategoryId) {
                              handleAutoGenerateSlug(e.target.value);
                            }
                          }}
                          placeholder="مثال: کامپوزیت ونیر و لایه‌گذاری"
                          className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold focus:outline-none focus:border-teal-500 transition-all"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between mr-1">
                          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                            نامک (Slug) <span className="text-rose-500">*</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => handleAutoGenerateSlug(newCatName)}
                            className="text-[10px] font-bold text-teal-600 hover:text-teal-700 cursor-pointer"
                          >
                            ⚡ تولید نامک
                          </button>
                        </div>
                        <input
                          type="text"
                          value={newCatSlug}
                          onChange={(e) => setNewCatSlug(e.target.value)}
                          placeholder="composite-veneers"
                          className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold focus:outline-none focus:border-teal-500 transition-all text-left font-mono"
                          dir="ltr"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mr-1">
                        دسته‌بندی مادر (اختیاری)
                      </label>
                      <select
                        value={newCatParent}
                        onChange={(e) => setNewCatParent(e.target.value)}
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold focus:outline-none focus:border-teal-500 transition-all cursor-pointer"
                      >
                        <option value="">فاقد دسته‌بندی مادر (دسته‌بندی اصلی)</option>
                        {allCategories
                          .filter(c => c._id !== editingCategoryId && c.name !== newCatName)
                          .map(cat => (
                            <option key={cat._id || cat.slug} value={cat.name}>
                              {cat.name} ({cat.slug})
                            </option>
                          ))}
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={isSavingCategory}
                      className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-2xl transition-all cursor-pointer shadow-lg shadow-teal-600/20 active:scale-[0.99] disabled:opacity-50"
                    >
                      {isSavingCategory ? "در حال ثبت اطلاعات..." : editingCategoryId ? "بروزرسانی دسته‌بندی علمی" : newCatParent ? "ثبت زیردسته جدید" : "ثبت دسته‌بندی علمی جدید"}
                    </button>
                  </form>
                </div>

                {/* Stats & Info Card */}
                <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 space-y-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="space-y-4 relative z-10">
                    <span className="text-[10px] font-extrabold text-teal-400 uppercase tracking-widest">آمار ساختار علمی</span>
                    <h4 className="text-lg font-extrabold leading-tight">دسته‌بندی‌های موضوعی دنتالفای</h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-bold">
                      با سازماندهی دسته‌بندی‌ها، مقالات تخصصی و دروس آکادمی به تفکیک حوزه‌های تخصصی دندانپزشکی دسته‌بندی می‌شوند.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 relative z-10 pt-4 border-t border-slate-800">
                    <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/50">
                      <span className="text-[10px] text-slate-400 font-bold block">کل دسته‌بندی‌ها</span>
                      <span className="text-2xl font-black text-teal-400 mt-1 block">{allCategories.length}</span>
                    </div>
                    <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/50">
                      <span className="text-[10px] text-slate-400 font-bold block">دسته‌بندی‌های اصلی</span>
                      <span className="text-2xl font-black text-indigo-400 mt-1 block">{allCategories.filter(c => !c.parent).length}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Scientific Categories List */}
              <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/10 dark:shadow-none overflow-hidden space-y-6 p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-700">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-800 dark:text-white">دسته‌بندی‌های فعال علمی</h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">مدیریت، ویرایش و تنظیم زیردسته‌های موضوعی</p>
                  </div>

                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={catSearchQuery}
                      onChange={(e) => setCatSearchQuery(e.target.value)}
                      placeholder="جستجو در دسته‌بندی‌ها (نام یا اسلاگ)..."
                      className="w-full pr-11 pl-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                {allCategories.length === 0 ? (
                  <div className="py-16 text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                      <Grid className="w-8 h-8" />
                    </div>
                    <div>
                      <h5 className="text-sm font-extrabold text-slate-700 dark:text-slate-200">هیچ دسته‌بندی ثبت نشده است.</h5>
                      <p className="text-xs text-slate-400 font-bold mt-1">با فرم بالا یا دکمه درج سریع زیر، دسته‌بندی‌های علمی دندانپزشکی را اضافه کنید.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleSeedDefaultCategories}
                      className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-2xl transition-all cursor-pointer shadow-lg shadow-teal-600/20 inline-flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      درج سریع دسته‌بندی‌های پایه دندانپزشکی
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="bg-slate-50/80 dark:bg-slate-900/50 text-slate-400 text-[10px] uppercase tracking-wider">
                          <th className="px-6 py-4 font-extrabold rounded-r-2xl">نام دسته‌بندی علمی</th>
                          <th className="px-6 py-4 font-extrabold">نامک (Slug)</th>
                          <th className="px-6 py-4 font-extrabold">وضعیت ساختار</th>
                          <th className="px-6 py-4 font-extrabold">تعداد مقالات</th>
                          <th className="px-6 py-4 font-extrabold text-left rounded-l-2xl">عملیات مدیریت</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                        {allCategories
                          .filter(c => 
                            c.name.toLowerCase().includes(catSearchQuery.toLowerCase()) || 
                            c.slug.toLowerCase().includes(catSearchQuery.toLowerCase())
                          )
                          .map(cat => {
                            const parentCat = allCategories.find(p => p._id === cat.parent || p.name === cat.parent);
                            const relatedPostsCount = allPosts.filter(p => p.category === cat.slug || p.category === cat.name).length;

                            return (
                              <tr key={cat._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors group">
                                <td className="px-6 py-4 font-extrabold text-slate-800 dark:text-slate-100">
                                  <div className="flex items-center gap-2">
                                    {cat.parent && <span className="text-teal-500 font-mono text-[11px]">↳</span>}
                                    <span className="group-hover:text-teal-600 transition-colors">{cat.name}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 font-mono text-slate-500 dark:text-slate-400 text-[11px]" dir="ltr">
                                  <span className="bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-lg">/{cat.slug}</span>
                                </td>
                                <td className="px-6 py-4">
                                  {parentCat ? (
                                    <span className="px-3 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 font-bold rounded-lg text-[10px]">
                                      زیر‌دسته از: {parentCat.name}
                                    </span>
                                  ) : (
                                    <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold rounded-lg text-[10px]">
                                      دسته‌بندی اصلی (مادر)
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4">
                                  <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 rounded-lg font-bold text-[10px]">
                                    {relatedPostsCount} مقاله
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-left">
                                  <div className="flex items-center justify-end gap-3">
                                    <button
                                      type="button"
                                      onClick={() => handleAddSubcategoryStart(cat)}
                                      className="text-teal-600 hover:text-teal-700 font-bold text-[10px] cursor-pointer"
                                    >
                                      + افزودن زیردسته
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleEditCategoryStart(cat)}
                                      className="text-indigo-600 hover:text-indigo-700 font-bold text-[10px] cursor-pointer"
                                    >
                                      ویرایش
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteCategory(cat._id)}
                                      className="text-rose-500 hover:text-rose-600 font-bold text-[10px] cursor-pointer"
                                    >
                                      حذف
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 mr-2">نام برند آکادمی</label>
                    <input 
                      type="text" 
                      value={siteNameInput}
                      onChange={(e) => setSiteNameInput(e.target.value)}
                      placeholder="مثال: dentalfy"
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold focus:outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 mr-2">شعار تبلیغاتی اصلی (Hero Text)</label>
                    <input 
                      type="text" 
                      value={heroTextInput}
                      onChange={(e) => setHeroTextInput(e.target.value)}
                      placeholder="مثال: آکادمی آموزش تخصصی دندانپزشکی"
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold focus:outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 mr-2">ایمیل عمومی / پشتیبانی آکادمی</label>
                    <input 
                      type="email" 
                      value={contactEmailInput}
                      onChange={(e) => setContactEmailInput(e.target.value)}
                      placeholder="dentalfyweb@gmail.com"
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold text-left focus:outline-none focus:border-indigo-500 transition-all"
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 mr-2">ایمیل اختصاصی مدیریت سایت</label>
                    <input 
                      type="email" 
                      value={adminEmailInput}
                      onChange={(e) => setAdminEmailInput(e.target.value)}
                      placeholder="dentalfyweb@gmail.com"
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold text-left focus:outline-none focus:border-indigo-500 transition-all"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 mr-2">شماره تلفن ارتباطی (اختیاری)</label>
                    <input 
                      type="text" 
                      value={contactPhoneInput}
                      onChange={(e) => setContactPhoneInput(e.target.value)}
                      placeholder="مثال: ۰۲۱-۸۸۸۸۸۸۸۸"
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold text-left focus:outline-none focus:border-indigo-500 transition-all"
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 mr-2">آدرس و موقعیت آکادمی (اختیاری)</label>
                    <input 
                      type="text" 
                      value={addressInput}
                      onChange={(e) => setAddressInput(e.target.value)}
                      placeholder="مثال: تهران، خیابان ولیعصر"
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold focus:outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 mr-2">متن توضیحات پاورقی (فوتر سایت)</label>
                  <textarea 
                    rows={2}
                    value={footerTextInput}
                    onChange={(e) => setFooterTextInput(e.target.value)}
                    placeholder="توضیح کوتاه درباره آکادمی در پایین سایت..."
                    className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-medium focus:outline-none focus:border-indigo-500 transition-all resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 mr-2">تغییر رمز عبور مدیریت</label>
                  <input 
                    type="password" 
                    value={adminPasswordInput}
                    onChange={(e) => setAdminPasswordInput(e.target.value)}
                    placeholder="در صورت تمایل به تغییر، رمز عبور جدید را وارد کنید..."
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold focus:outline-none focus:border-indigo-500 transition-all"
                  />
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
