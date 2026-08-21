export interface IUser {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "author" | "student";
  permissions?: string[];
  gender?: "male" | "female" | "other" | "";
  profilePicture: string;
  resetPasswordRequested: boolean;
  temporaryPassword?: string;
  isSuspended?: boolean;
  phoneNumber?: string;
  bookmarks?: string[];
  readingHistory?: {
    itemId: string;
    itemType: "post" | "course";
    title: string;
    visitedAt: string;
  }[];
  progress?: {
    courseId: string;
    completedLessons: string[];
    percentage: number;
  }[];
  createdAt?: string;
}

export interface ICourse {
  _id: string;
  title: string;
  description: string;
  syllabus: string[];
  createdAt?: string;
}

export interface IBlock {
  id: string;
  type: "text" | "heading" | "image" | "video" | "pdf" | "quote" | "list" | "divider";
  value: any; // Stored block-specific values
}

export interface IPost {
  _id: string;
  title: string;
  content: IBlock[];
  author: {
    _id?: string;
    id?: string;
    name: string;
    email: string;
    profilePicture: string;
  } | string;
  course: {
    _id: string;
    title: string;
    description?: string;
    syllabus?: string[];
  } | null;
  status: "draft" | "pending" | "published" | "rejected";
  tags?: string[];
  summary?: string;
  coverImage?: string;
  rejectionReason: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  publishAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISiteSettings {
  siteName: string;
  heroText: string;
  contactEmail: string;
  colorTheme: {
    primary: string;
    secondary: string;
    clinicalBlue: string;
  };
  adminRecoveryCode: string;
  stats: {
    coursesCount: number;
    postsCount: number;
    authorsCount: number;
  };
}

export interface IAccountRequest {
  _id: string;
  name: string;
  email: string;
  bio: string;
  password?: string;
  phoneNumber?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface ILibraryDoc {
  _id: string;
  title: string;
  file: string;
  size: string;
  createdAt: string;
}

export interface IComment {
  _id: string;
  postId: string;
  name: string;
  role: "public" | "author" | "admin" | "student";
  email: string;
  text: string;
  reply?: string;
  repliedBy?: string;
  isApproved: boolean;
  createdAt: string;
}

export interface IFAQ {
  _id: string;
  question: string;
  answer: string;
  createdAt: string;
}

export interface IReview {
  _id?: string;
  courseId: string;
  studentName: string;
  studentEmail: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt?: string;
}

export interface IQna {
  _id?: string;
  courseId: string;
  studentName: string;
  studentEmail: string;
  question: string;
  answer?: string;
  repliedBy?: string;
  isApproved: boolean;
  createdAt?: string;
}

export interface IQuizQuestion {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface IQuiz {
  _id?: string;
  courseId: string;
  questions: IQuizQuestion[];
  passingPercentage: number;
  createdAt?: string;
}

export interface ICategory {
  _id?: string;
  name: string;
  parent: string | null;
  slug: string;
  createdAt?: string;
}

export interface IAuditLog {
  _id?: string;
  actorName: string;
  action: string;
  target: string;
  createdAt?: string;
}

export interface INotification {
  _id?: string;
  userId?: string;
  targetRole?: string;
  title: string;
  content: string;
  isRead: boolean;
  createdAt?: string;
}

