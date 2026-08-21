import mongoose, { Schema, Document, Model } from "mongoose";

// --- USER INTERFACE & SCHEMA ---
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "admin" | "editor" | "author" | "student";
  permissions?: string[];
  gender?: "male" | "female" | "other" | "";
  profilePicture: string;
  resetPasswordRequested: boolean;
  temporaryPassword?: string;
  isSuspended?: boolean;
  phoneNumber?: string;
  bookmarks: string[]; // array of post IDs
  readingHistory: {
    itemId: string;
    itemType: "post" | "course";
    title: string;
    visitedAt: Date;
  }[];
  progress: {
    courseId: string;
    completedLessons: string[]; // array of post IDs
    percentage: number;
  }[];
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "editor", "author", "student"], default: "student" },
  permissions: { type: [String], default: [] },
  gender: { type: String, enum: ["male", "female", "other", ""], default: "" },
  profilePicture: { type: String, default: "" },
  resetPasswordRequested: { type: Boolean, default: false },
  temporaryPassword: { type: String, default: "" },
  isSuspended: { type: Boolean, default: false },
  phoneNumber: { type: String, default: "" },
  bookmarks: { type: [String], default: [] },
  readingHistory: [{
    itemId: { type: String, required: true },
    itemType: { type: String, enum: ["post", "course"], required: true },
    title: { type: String, default: "" },
    visitedAt: { type: Date, default: Date.now }
  }],
  progress: [{
    courseId: { type: String, required: true },
    completedLessons: { type: [String], default: [] },
    percentage: { type: Number, default: 0 }
  }],
  createdAt: { type: Date, default: Date.now }
});


// --- COURSE INTERFACE & SCHEMA ---
export interface ICourse extends Document {
  title: string;
  description: string;
  syllabus: string[];
  createdAt: Date;
}

const CourseSchema = new Schema<ICourse>({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  syllabus: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});


// --- POST INTERFACE & SCHEMA ---
export interface IBlock {
  id: string;
  type: "text" | "heading" | "image" | "video" | "pdf" | "quote" | "list";
  value: any; // Stored block-specific values like content, Cloudinary URLs, lists, etc.
}

export interface IPost extends Document {
  title: string;
  content: IBlock[];
  author: mongoose.Types.ObjectId | IUser;
  course: mongoose.Types.ObjectId | ICourse | null;
  status: "draft" | "pending" | "published" | "rejected";
  tags?: string[];
  summary?: string;
  coverImage?: string;
  rejectionReason: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  publishAt?: Date; // Scheduled publishing
  createdAt: Date;
  updatedAt: Date;
}

const BlockSchema = new Schema<IBlock>({
  id: { type: String, required: true },
  type: { type: String, enum: ["text", "heading", "image", "video", "pdf", "quote", "list"], required: true },
  value: { type: Schema.Types.Mixed, required: true }
}, { _id: false });

const PostSchema = new Schema<IPost>({
  title: { type: String, required: true },
  content: { type: [BlockSchema], default: [] },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  course: { type: Schema.Types.ObjectId, ref: "Course", default: null },
  status: { type: String, enum: ["draft", "pending", "published", "rejected"], default: "pending" },
  tags: { type: [String], default: [] },
  summary: { type: String, default: "" },
  coverImage: { type: String, default: "" },
  rejectionReason: { type: String, default: "" },
  seoTitle: { type: String, default: "" },
  seoDescription: { type: String, default: "" },
  seoKeywords: { type: [String], default: [] },
  publishAt: { type: Date, default: null }
}, {
  timestamps: true
});


// --- SITE SETTINGS INTERFACE & SCHEMA ---
export interface ISiteSettings extends Document {
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

const SiteSettingsSchema = new Schema<ISiteSettings>({
  siteName: { type: String, default: "dentalfy" },
  heroText: { type: String, default: "آکادمی آموزش تخصصی دندانپزشکی" },
  contactEmail: { type: String, default: "info@dentalfy.local" },
  colorTheme: {
    primary: { type: String, default: "#14b8a6" },       // Turquoise
    secondary: { type: String, default: "#0d9488" },     // Mint / Dark Teal
    clinicalBlue: { type: String, default: "#0284c7" }    // Clinical Blue
  },
  adminRecoveryCode: { type: String, default: "rmo-recover-2026" },
  stats: {
    coursesCount: { type: Number, default: 0 },
    postsCount: { type: Number, default: 0 },
    authorsCount: { type: Number, default: 0 }
  }
});


// --- ACCOUNT REQUEST INTERFACE & SCHEMA ---
export interface IAccountRequest extends Document {
  name: string;
  email: string;
  bio: string;
  password?: string;
  phoneNumber?: string;
  gender?: "male" | "female" | "other" | "";
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
}

const AccountRequestSchema = new Schema<IAccountRequest>({
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  bio: { type: String, default: "" },
  password: { type: String },
  phoneNumber: { type: String },
  gender: { type: String, default: "" },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});


// --- LIBRARY DOC INTERFACE & SCHEMA ---
export interface ILibraryDoc extends Document {
  title: string;
  file: string; // Base64 or cloud URL
  size: string;
  createdAt: Date;
}

const LibraryDocSchema = new Schema<ILibraryDoc>({
  title: { type: String, required: true },
  file: { type: String, required: true },
  size: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});


// --- COMMENT INTERFACE & SCHEMA ---
export interface IComment extends Document {
  postId: mongoose.Types.ObjectId;
  name: string;
  role: "public" | "author" | "admin" | "student";
  email: string;
  text: string;
  reply?: string;
  repliedBy?: string;
  isApproved: boolean;
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>({
  postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ["public", "author", "admin", "student"], default: "public" },
  email: { type: String, required: true, lowercase: true, trim: true },
  text: { type: String, required: true },
  reply: { type: String, default: "" },
  repliedBy: { type: String, default: "" },
  isApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});


// --- FAQ INTERFACE & SCHEMA ---
export interface IFAQ extends Document {
  question: string;
  answer: string;
  createdAt: Date;
}

const FAQSchema = new Schema<IFAQ>({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});


// --- REVIEW INTERFACE & SCHEMA ---
export interface IReview extends Document {
  courseId: mongoose.Types.ObjectId;
  studentName: string;
  studentEmail: string;
  rating: number; // 1 to 5
  comment: string;
  isApproved: boolean;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true, lowercase: true, trim: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: "" },
  isApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});


// --- Q&A INTERFACE & SCHEMA ---
export interface IQna extends Document {
  courseId: mongoose.Types.ObjectId;
  studentName: string;
  studentEmail: string;
  question: string;
  answer?: string;
  repliedBy?: string;
  isApproved: boolean;
  createdAt: Date;
}

const QnaSchema = new Schema<IQna>({
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true, lowercase: true, trim: true },
  question: { type: String, required: true },
  answer: { type: String, default: "" },
  repliedBy: { type: String, default: "" },
  isApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});


// --- QUIZ INTERFACE & SCHEMA ---
export interface IQuizQuestion {
  questionText: string;
  options: string[]; // 4 options
  correctAnswerIndex: number; // 0 to 3
}

export interface IQuiz extends Document {
  courseId: mongoose.Types.ObjectId;
  questions: IQuizQuestion[];
  passingPercentage: number;
  createdAt: Date;
}

const QuizQuestionSchema = new Schema<IQuizQuestion>({
  questionText: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswerIndex: { type: Number, required: true, min: 0, max: 3 }
}, { _id: false });

const QuizSchema = new Schema<IQuiz>({
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  questions: { type: [QuizQuestionSchema], default: [] },
  passingPercentage: { type: Number, default: 70 },
  createdAt: { type: Date, default: Date.now }
});


// --- CATEGORY INTERFACE & SCHEMA ---
export interface ICategory extends Document {
  name: string;
  parent: string | null; // Name or ID of parent category
  slug: string;
  createdAt: Date;
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  parent: { type: String, default: null },
  slug: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});


// --- AUDIT LOG INTERFACE & SCHEMA ---
export interface IAuditLog extends Document {
  actorName: string;
  action: string;
  target: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>({
  actorName: { type: String, required: true },
  action: { type: String, required: true },
  target: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});


// --- NOTIFICATION INTERFACE & SCHEMA ---
export interface INotification extends Document {
  userId?: string; // target user (if null, broadcast or for general panel notification)
  targetRole?: string; // e.g. "admin", "author", "student"
  title: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  userId: { type: String, default: null },
  targetRole: { type: String, default: null },
  title: { type: String, required: true },
  content: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});


// --- EXPORTS / MODEL RETRIEVAL (SAFE FOR HOT-RELOADS) ---
export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export const Course: Model<ICourse> = mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);
export const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);
export const SiteSettings: Model<ISiteSettings> = mongoose.models.SiteSettings || mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
export const AccountRequest: Model<IAccountRequest> = mongoose.models.AccountRequest || mongoose.model<IAccountRequest>("AccountRequest", AccountRequestSchema);
export const LibraryDoc: Model<ILibraryDoc> = mongoose.models.LibraryDoc || mongoose.model<ILibraryDoc>("LibraryDoc", LibraryDocSchema);
export const Comment: Model<IComment> = mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);
export const FAQ: Model<IFAQ> = mongoose.models.FAQ || mongoose.model<IFAQ>("FAQ", FAQSchema);
export const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
export const Qna: Model<IQna> = mongoose.models.Qna || mongoose.model<IQna>("Qna", QnaSchema);
export const Quiz: Model<IQuiz> = mongoose.models.Quiz || mongoose.model<IQuiz>("Quiz", QuizSchema);
export const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);
export const AuditLog: Model<IAuditLog> = mongoose.models.AuditLog || mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
export const Notification: Model<INotification> = mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);

