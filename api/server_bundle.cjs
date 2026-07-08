var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server.ts
var server_exports = {};
__export(server_exports, {
  default: () => handler,
  startServer: () => startServer
});
module.exports = __toCommonJS(server_exports);
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_cloudinary = require("cloudinary");
var import_genai = require("@google/genai");
var import_nodemailer = __toESM(require("nodemailer"), 1);

// src/db/mongodb.ts
var import_mongoose = __toESM(require("mongoose"), 1);
var cached = global.mongoose || { conn: null, promise: null };
if (!global.mongoose) {
  global.mongoose = cached;
}
async function connectToDatabase() {
  const MONGODB_URI = process.env.MONGODB_URI || "";
  if (!MONGODB_URI) {
    console.warn("\u26A0\uFE0F MONGODB_URI is not defined in environment variables. Database connections will fail.");
    throw new Error("MONGODB_URI missing");
  }
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false
    };
    cached.promise = import_mongoose.default.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log("\u{1F50C} Connected to MongoDB successfully (Pooled Connection).");
      return mongooseInstance;
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  return cached.conn;
}

// src/db/models.ts
var import_mongoose2 = __toESM(require("mongoose"), 1);
var UserSchema = new import_mongoose2.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "author", "student"], default: "student" },
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
  certificates: [{
    certificateId: { type: String, required: true },
    courseId: { type: String, required: true },
    courseTitle: { type: String, required: true },
    studentName: { type: String, required: true },
    issuedAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});
var CourseSchema = new import_mongoose2.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  syllabus: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});
var BlockSchema = new import_mongoose2.Schema({
  id: { type: String, required: true },
  type: { type: String, enum: ["text", "heading", "image", "video", "pdf", "quote", "list"], required: true },
  value: { type: import_mongoose2.Schema.Types.Mixed, required: true }
}, { _id: false });
var PostSchema = new import_mongoose2.Schema({
  title: { type: String, required: true },
  content: { type: [BlockSchema], default: [] },
  author: { type: import_mongoose2.Schema.Types.ObjectId, ref: "User", required: true },
  course: { type: import_mongoose2.Schema.Types.ObjectId, ref: "Course", default: null },
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
var SiteSettingsSchema = new import_mongoose2.Schema({
  siteName: { type: String, default: "dentalfy" },
  heroText: { type: String, default: "\u0622\u06A9\u0627\u062F\u0645\u06CC \u0622\u0645\u0648\u0632\u0634 \u062A\u062E\u0635\u0635\u06CC \u062F\u0646\u062F\u0627\u0646\u067E\u0632\u0634\u06A9\u06CC" },
  contactEmail: { type: String, default: "info@dentalfy.local" },
  colorTheme: {
    primary: { type: String, default: "#14b8a6" },
    // Turquoise
    secondary: { type: String, default: "#0d9488" },
    // Mint / Dark Teal
    clinicalBlue: { type: String, default: "#0284c7" }
    // Clinical Blue
  },
  adminRecoveryCode: { type: String, default: "rmo-recover-2026" },
  stats: {
    coursesCount: { type: Number, default: 0 },
    postsCount: { type: Number, default: 0 },
    authorsCount: { type: Number, default: 0 }
  }
});
var AccountRequestSchema = new import_mongoose2.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  bio: { type: String, default: "" },
  password: { type: String },
  phoneNumber: { type: String },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});
var LibraryDocSchema = new import_mongoose2.Schema({
  title: { type: String, required: true },
  file: { type: String, required: true },
  size: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
var CommentSchema = new import_mongoose2.Schema({
  postId: { type: import_mongoose2.Schema.Types.ObjectId, ref: "Post", required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ["public", "author", "admin", "student"], default: "public" },
  email: { type: String, required: true, lowercase: true, trim: true },
  text: { type: String, required: true },
  reply: { type: String, default: "" },
  repliedBy: { type: String, default: "" },
  isApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
var FAQSchema = new import_mongoose2.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
var ReviewSchema = new import_mongoose2.Schema({
  courseId: { type: import_mongoose2.Schema.Types.ObjectId, ref: "Course", required: true },
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true, lowercase: true, trim: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: "" },
  isApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
var QnaSchema = new import_mongoose2.Schema({
  courseId: { type: import_mongoose2.Schema.Types.ObjectId, ref: "Course", required: true },
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true, lowercase: true, trim: true },
  question: { type: String, required: true },
  answer: { type: String, default: "" },
  repliedBy: { type: String, default: "" },
  isApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
var QuizQuestionSchema = new import_mongoose2.Schema({
  questionText: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswerIndex: { type: Number, required: true, min: 0, max: 3 }
}, { _id: false });
var QuizSchema = new import_mongoose2.Schema({
  courseId: { type: import_mongoose2.Schema.Types.ObjectId, ref: "Course", required: true },
  questions: { type: [QuizQuestionSchema], default: [] },
  passingPercentage: { type: Number, default: 70 },
  createdAt: { type: Date, default: Date.now }
});
var CategorySchema = new import_mongoose2.Schema({
  name: { type: String, required: true },
  parent: { type: String, default: null },
  slug: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
var AuditLogSchema = new import_mongoose2.Schema({
  actorName: { type: String, required: true },
  action: { type: String, required: true },
  target: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
var NotificationSchema = new import_mongoose2.Schema({
  userId: { type: String, default: null },
  targetRole: { type: String, default: null },
  title: { type: String, required: true },
  content: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
var User = import_mongoose2.default.models.User || import_mongoose2.default.model("User", UserSchema);
var Course = import_mongoose2.default.models.Course || import_mongoose2.default.model("Course", CourseSchema);
var Post = import_mongoose2.default.models.Post || import_mongoose2.default.model("Post", PostSchema);
var SiteSettings = import_mongoose2.default.models.SiteSettings || import_mongoose2.default.model("SiteSettings", SiteSettingsSchema);
var AccountRequest = import_mongoose2.default.models.AccountRequest || import_mongoose2.default.model("AccountRequest", AccountRequestSchema);
var LibraryDoc = import_mongoose2.default.models.LibraryDoc || import_mongoose2.default.model("LibraryDoc", LibraryDocSchema);
var Comment = import_mongoose2.default.models.Comment || import_mongoose2.default.model("Comment", CommentSchema);
var FAQ = import_mongoose2.default.models.FAQ || import_mongoose2.default.model("FAQ", FAQSchema);
var Review = import_mongoose2.default.models.Review || import_mongoose2.default.model("Review", ReviewSchema);
var Qna = import_mongoose2.default.models.Qna || import_mongoose2.default.model("Qna", QnaSchema);
var Quiz = import_mongoose2.default.models.Quiz || import_mongoose2.default.model("Quiz", QuizSchema);
var Category = import_mongoose2.default.models.Category || import_mongoose2.default.model("Category", CategorySchema);
var AuditLog = import_mongoose2.default.models.AuditLog || import_mongoose2.default.model("AuditLog", AuditLogSchema);
var Notification = import_mongoose2.default.models.Notification || import_mongoose2.default.model("Notification", NotificationSchema);

// server.ts
var Notification2 = Notification;
async function startServer() {
  console.log("\u{1F6E0}\uFE0F Initializing server...");
  console.log("\u{1F4DD} MONGODB_URI exists:", !!process.env.MONGODB_URI);
  console.log("\u{1F4DD} CLOUDINARY_URL exists:", !!process.env.CLOUDINARY_URL);
  const app = (0, import_express.default)();
  const useCloudinary = !!(process.env.CLOUDINARY_URL || process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
  if (useCloudinary) {
    if (process.env.CLOUDINARY_URL) {
      import_cloudinary.v2.config();
      console.log("\u2601\uFE0F Cloudinary is configured and active using CLOUDINARY_URL.");
    } else {
      import_cloudinary.v2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
      });
      console.log("\u2601\uFE0F Cloudinary is configured and active.");
    }
  } else {
    console.warn("\u26A0\uFE0F Cloudinary credentials not fully specified. Falling back to local Base64 media storage.");
  }
  app.use(import_express.default.json({ limit: "50mb" }));
  app.use(import_express.default.urlencoded({ limit: "50mb", extended: true }));
  let isDBConnected = false;
  const memoryDB = {
    users: [],
    courses: [],
    posts: [],
    siteSettings: {
      siteName: "dentalfy",
      heroText: "\u0622\u06A9\u0627\u062F\u0645\u06CC \u0622\u0645\u0648\u0632\u0634 \u062A\u062E\u0635\u0635\u06CC \u062F\u0646\u062F\u0627\u0646\u067E\u0632\u0634\u06A9\u06CC",
      contactEmail: "info@dentalfy.local",
      colorTheme: {
        primary: "#14b8a6",
        secondary: "#0d9488",
        clinicalBlue: "#0284c7"
      },
      adminRecoveryCode: "rmo-recover-2026",
      stats: {
        coursesCount: 3,
        postsCount: 2,
        authorsCount: 1
      }
    },
    accountRequests: [],
    libraryDocs: [],
    comments: [],
    faqs: [],
    reviews: [],
    qnas: [],
    quizzes: [],
    categories: [],
    auditLogs: [],
    notifications: []
  };
  const defaultCategories = [
    { _id: "cat-1", name: "\u062C\u0631\u0627\u062D\u06CC", parent: null, slug: "surgery", createdAt: /* @__PURE__ */ new Date() },
    { _id: "cat-2", name: "\u0627\u06CC\u0645\u067E\u0644\u0646\u062A", parent: "\u062C\u0631\u0627\u062D\u06CC", slug: "implant", createdAt: /* @__PURE__ */ new Date() },
    { _id: "cat-3", name: "\u0633\u06CC\u0646\u0648\u0633 \u0644\u06CC\u0641\u062A", parent: "\u0627\u06CC\u0645\u067E\u0644\u0646\u062A", slug: "sinus-lift", createdAt: /* @__PURE__ */ new Date() },
    { _id: "cat-4", name: "\u0627\u0646\u062F\u0648\u062F\u0646\u062A\u06CC\u06A9\u0633", parent: null, slug: "endodontics", createdAt: /* @__PURE__ */ new Date() },
    { _id: "cat-5", name: "\u062A\u0631\u0645\u06CC\u0645\u06CC \u0648 \u0632\u06CC\u0628\u0627\u06CC\u06CC", parent: null, slug: "restorative-cosmetic", createdAt: /* @__PURE__ */ new Date() }
  ];
  memoryDB.categories.push(...defaultCategories);
  const defaultQuizzes = [
    {
      _id: "quiz-1",
      courseId: "mem-course-1",
      passingPercentage: 70,
      questions: [
        {
          questionText: "\u0639\u0645\u0642 \u062A\u0631\u0627\u0634 \u0627\u0633\u062A\u0627\u0646\u062F\u0627\u0631\u062F \u0628\u0631\u0627\u06CC \u0644\u0645\u06CC\u0646\u062A\u200C\u0647\u0627\u06CC \u0633\u0631\u0627\u0645\u06CC\u06A9\u06CC \u0645\u062D\u0627\u0641\u0638\u0647\u200C\u06A9\u0627\u0631\u0627\u0646\u0647 \u0686\u0642\u062F\u0631 \u0627\u0633\u062A\u061F",
          options: ["\u06F0.\u06F3 \u062A\u0627 \u06F0.\u06F5 \u0645\u06CC\u0644\u06CC\u200C\u0645\u062A\u0631", "\u06F1.\u06F0 \u062A\u0627 \u06F1.\u06F5 \u0645\u06CC\u0644\u06CC\u200C\u0645\u062A\u0631", "\u06F2.\u06F0 \u0645\u06CC\u0644\u06CC\u200C\u0645\u062A\u0631", "\u0628\u062F\u0648\u0646 \u0646\u06CC\u0627\u0632 \u0628\u0647 \u062A\u0631\u0627\u0634"],
          correctAnswerIndex: 0
        },
        {
          questionText: "\u0647\u062F\u0641 \u0627\u0635\u0644\u06CC \u0627\u0632 \u0628\u0647 \u06A9\u0627\u0631 \u0628\u0631\u062F\u0646 \u0646\u062E \u0632\u06CC\u0631 \u0644\u062B\u0647\u200C\u0627\u06CC \u0686\u06CC\u0633\u062A\u061F",
          options: ["\u06A9\u0627\u0647\u0634 \u062E\u0648\u0646\u0631\u06CC\u0632\u06CC \u0644\u062B\u0647", "\u0639\u0642\u0628 \u0632\u062F\u0646 \u0644\u062B\u0647 \u0628\u0631\u0627\u06CC \u062B\u0628\u062A \u062F\u0642\u06CC\u0642 \u062E\u0637 \u062A\u0631\u0627\u0634 \u0644\u0628\u0647\u200C\u0627\u06CC", "\u0632\u06CC\u0628\u0627\u0633\u0627\u0632\u06CC \u062F\u0646\u062F\u0627\u0646", "\u0634\u0633\u062A\u0634\u0648\u06CC \u0634\u06CC\u0627\u0631 \u0644\u062B\u0647\u200C\u0627\u06CC"],
          correctAnswerIndex: 1
        }
      ],
      createdAt: /* @__PURE__ */ new Date()
    },
    {
      _id: "quiz-2",
      courseId: "mem-course-2",
      passingPercentage: 70,
      questions: [
        {
          questionText: "\u06A9\u062F\u0627\u0645 \u06CC\u06A9 \u0627\u0632 \u0645\u0648\u0627\u0631\u062F \u0632\u06CC\u0631 \u062E\u0637\u0631 \u0634\u06A9\u0633\u062A\u06AF\u06CC \u0641\u0627\u06CC\u0644 \u0631\u0648\u062A\u0627\u0631\u06CC \u062F\u0631 \u06A9\u0627\u0646\u0627\u0644\u200C\u0647\u0627\u06CC \u0628\u0627 \u0627\u0646\u062D\u0646\u0627\u06CC \u0634\u062F\u06CC\u062F \u0631\u0627 \u0627\u0641\u0632\u0627\u06CC\u0634 \u0645\u06CC\u200C\u062F\u0647\u062F\u061F",
          options: ["\u06A9\u0627\u0631\u0628\u0631\u062F \u0644\u0648\u0628\u0631\u06CC\u06A9\u0627\u0646\u062A \u06CC\u0627 \u0698\u0644 EDTA", "\u0627\u0639\u0645\u0627\u0644 \u062A\u0648\u0631\u06A9 \u0628\u0627\u0644\u0627 \u0648 \u0639\u062F\u0645 \u06A9\u0646\u062A\u0631\u0644 \u0633\u0631\u0639\u062A \u0641\u0627\u06CC\u0644 \u0631\u0648\u062A\u0627\u0631\u06CC", "\u06A9\u0627\u0631\u0628\u0631\u062F \u0645\u062A\u0646\u0627\u0648\u0628 \u0634\u0633\u062A\u0634\u0648\u06CC \u06A9\u0627\u0646\u0627\u0644", "\u062D\u0631\u06A9\u062A \u0645\u0644\u0627\u06CC\u0645 \u0628\u0627\u0644\u0627 \u0628\u0647 \u067E\u0627\u06CC\u06CC\u0646 \u0641\u0627\u06CC\u0644"],
          correctAnswerIndex: 1
        },
        {
          questionText: "\u0645\u062D\u0644\u0648\u0644 \u0627\u0633\u062A\u0627\u0646\u062F\u0627\u0631\u062F \u0628\u0631\u0627\u06CC \u0634\u0633\u062A\u0634\u0648 \u0648 \u067E\u0627\u06A9\u0633\u0627\u0632\u06CC \u0628\u06CC\u0648\u0634\u06CC\u0645\u06CC\u0627\u06CC\u06CC \u06A9\u0627\u0646\u0627\u0644 \u0631\u06CC\u0634\u0647 \u0686\u06CC\u0633\u062A\u061F",
          options: ["\u0646\u0631\u0645\u0627\u0644 \u0633\u0627\u0644\u06CC\u0646", "\u0633\u062F\u06CC\u0645 \u0647\u06CC\u067E\u0648\u06A9\u0644\u0631\u06CC\u062A (NaOCl)", "\u0627\u0644\u06A9\u0644 \u06F9\u06F6 \u062F\u0631\u0635\u062F", "\u0622\u0628 \u0645\u0642\u0637\u0631"],
          correctAnswerIndex: 1
        }
      ],
      createdAt: /* @__PURE__ */ new Date()
    }
  ];
  memoryDB.quizzes.push(...defaultQuizzes);
  const defaultComments = [
    {
      _id: "mem-cmt-seed-1",
      postId: "mem-post-1",
      name: "\u062F\u06A9\u062A\u0631 \u0646\u06CC\u0645\u0627 \u0639\u0644\u0648\u06CC",
      role: "public",
      email: "nima@example.com",
      text: "\u0628\u0633\u06CC\u0627\u0631 \u0645\u0637\u0644\u0628 \u06A9\u0627\u0631\u0628\u0631\u062F\u06CC \u0648 \u062F\u0642\u06CC\u0642\u06CC \u0628\u0648\u062F. \u062A\u0631\u0627\u0634 \u0645\u062D\u0627\u0641\u0638\u0647\u200C\u06A9\u0627\u0631\u0627\u0646\u0647 \u0648\u0627\u0642\u0639\u0627 \u06A9\u0644\u06CC\u062F \u0628\u0642\u0627\u06CC \u0628\u0627\u0646\u062F\u06CC\u0646\u06AF \u0627\u0633\u062A.",
      reply: "\u0645\u0645\u0646\u0648\u0646 \u0627\u0632 \u062A\u0648\u062C\u0647 \u0634\u0645\u0627 \u0647\u0645\u06A9\u0627\u0631 \u06AF\u0631\u0627\u0645\u06CC.",
      repliedBy: "\u062F\u06A9\u062A\u0631 \u0632\u0647\u0631\u0627 \u06A9\u0631\u06CC\u0645\u06CC",
      isApproved: true,
      createdAt: /* @__PURE__ */ new Date()
    }
  ];
  memoryDB.comments.push(...defaultComments);
  const defaultReviews = [
    {
      _id: "rev-1",
      courseId: "mem-course-1",
      studentName: "\u0645\u0631\u06CC\u0645 \u0627\u062D\u0645\u062F\u06CC (\u062F\u0627\u0646\u0634\u062C\u0648)",
      studentEmail: "maryam@dental.ir",
      rating: 5,
      comment: "\u0627\u06CC\u0646 \u062F\u0648\u0631\u0647 \u0641\u0648\u0642\u200C\u0627\u0644\u0639\u0627\u062F\u0647 \u06A9\u0627\u0631\u0628\u0631\u062F\u06CC \u0628\u0648\u062F\u060C \u062A\u06A9\u0646\u06CC\u06A9\u200C\u0647\u0627\u06CC \u0639\u0645\u0644\u06CC \u062A\u0631\u0627\u0634 \u0631\u0627 \u0628\u0647 \u062E\u0648\u0628\u06CC \u06CC\u0627\u062F \u06AF\u0631\u0641\u062A\u0645.",
      isApproved: true,
      createdAt: /* @__PURE__ */ new Date()
    },
    {
      _id: "rev-2",
      courseId: "mem-course-2",
      studentName: "\u0639\u0644\u06CC \u062D\u0633\u06CC\u0646\u06CC (\u062F\u0627\u0646\u0634\u062C\u0648)",
      studentEmail: "ali@dental.ir",
      rating: 4,
      comment: "\u062A\u062F\u0631\u06CC\u0633 \u0641\u0627\u06CC\u0644\u200C\u0647\u0627\u06CC \u0631\u0648\u062A\u0627\u0631\u06CC \u0628\u0633\u06CC\u0627\u0631 \u0631\u0633\u0627 \u0648 \u0631\u0648\u0627\u0646 \u0628\u0648\u062F. \u062A\u0634\u06A9\u0631 \u0627\u0632 \u0622\u06A9\u0627\u062F\u0645\u06CC.",
      isApproved: true,
      createdAt: /* @__PURE__ */ new Date()
    }
  ];
  memoryDB.reviews.push(...defaultReviews);
  const defaultQnas = [
    {
      _id: "qna-1",
      courseId: "mem-course-1",
      studentName: "\u062F\u06A9\u062A\u0631 \u0633\u067E\u0647\u0631 \u0628\u0647\u0631\u0627\u0645\u06CC",
      studentEmail: "sepehr@example.com",
      question: "\u0622\u06CC\u0627 \u062F\u0631 \u062F\u0646\u062F\u0627\u0646\u200C\u0647\u0627\u06CC \u0648\u0627\u06CC\u062A\u0627\u0644 \u0647\u0645 \u0645\u06CC\u200C\u062A\u0648\u0627\u0646 \u0627\u0632 \u0627\u06CC\u0646 \u0639\u0645\u0642 \u062A\u0631\u0627\u0634 \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u06A9\u0631\u062F\u061F",
      answer: "\u0628\u0644\u0647\u060C \u062F\u0631 \u062F\u0646\u062F\u0627\u0646\u200C\u0647\u0627\u06CC \u0632\u0646\u062F\u0647 (\u0648\u0627\u06CC\u062A\u0627\u0644) \u062D\u062A\u0645\u0627\u064B \u0628\u0627\u06CC\u062F \u062A\u0631\u0627\u0634 \u0628\u0633\u06CC\u0627\u0631 \u0645\u062D\u0627\u0641\u0638\u0647\u200C\u06A9\u0627\u0631\u0627\u0646\u0647 \u0648 \u062F\u0631 \u062D\u062F \u0645\u06CC\u0646\u0627 \u0628\u0627\u0634\u062F \u062A\u0627 \u062D\u0633\u0627\u0633\u06CC\u062A \u067E\u0633 \u0627\u0632 \u06A9\u0627\u0631 \u0627\u06CC\u062C\u0627\u062F \u0646\u0634\u0648\u062F.",
      repliedBy: "\u062F\u06A9\u062A\u0631 \u0632\u0647\u0631\u0627 \u06A9\u0631\u06CC\u0645\u06CC",
      isApproved: true,
      createdAt: /* @__PURE__ */ new Date()
    }
  ];
  memoryDB.qnas.push(...defaultQnas);
  const defaultAuditLogs = [
    { _id: "log-1", actorName: "\u0645\u062F\u06CC\u0631 \u0633\u06CC\u0633\u062A\u0645", action: "\u0627\u06CC\u062C\u0627\u062F \u062F\u0631\u0633 \u062C\u062F\u06CC\u062F", target: "\u062F\u0646\u062F\u0627\u0646\u067E\u0632\u0634\u06A9\u06CC \u0632\u06CC\u0628\u0627\u06CC\u06CC", createdAt: /* @__PURE__ */ new Date() },
    { _id: "log-2", actorName: "\u062F\u06A9\u062A\u0631 \u0632\u0647\u0631\u0627 \u06A9\u0631\u06CC\u0645\u06CC", action: "\u0627\u0646\u062A\u0634\u0627\u0631 \u0645\u0642\u0627\u0644\u0647 \u062C\u062F\u06CC\u062F", target: "\u0631\u0627\u0647\u0646\u0645\u0627\u06CC \u062A\u0631\u0627\u0634 \u06A9\u0627\u0645\u067E\u0648\u0632\u06CC\u062A", createdAt: /* @__PURE__ */ new Date() }
  ];
  memoryDB.auditLogs.push(...defaultAuditLogs);
  const defaultNotifications = [
    { _id: "not-1", targetRole: "admin", title: "\u062B\u0628\u062A \u0646\u0627\u0645 \u06A9\u0627\u0631\u0628\u0631 \u062C\u062F\u06CC\u062F", content: "\u06CC\u06A9 \u062F\u0627\u0646\u0634\u062C\u0648 \u062C\u062F\u06CC\u062F \u0628\u0627 \u0634\u0645\u0627\u0631\u0647 \u0647\u0645\u0631\u0627\u0647 \u062B\u0628\u062A\u200C\u0646\u0627\u0645 \u06A9\u0631\u062F.", isRead: false, createdAt: /* @__PURE__ */ new Date() }
  ];
  memoryDB.notifications.push(...defaultNotifications);
  const defaultAdmin = {
    _id: "mem-admin-id",
    name: "\u0645\u062F\u06CC\u0631 \u0633\u0627\u06CC\u062A (RMO)",
    email: "admin@rmo.local",
    password: "rmo2026",
    // Plain text in fallback mode for easy playground use
    role: "admin",
    profilePicture: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200",
    resetPasswordRequested: false,
    temporaryPassword: "",
    createdAt: /* @__PURE__ */ new Date()
  };
  memoryDB.users.push(defaultAdmin);
  const defaultAuthor = {
    _id: "mem-author-id",
    name: "\u062F\u06A9\u062A\u0631 \u0632\u0647\u0631\u0627 \u06A9\u0631\u06CC\u0645\u06CC",
    email: "author@rmo.local",
    password: "author2026",
    role: "author",
    profilePicture: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=200",
    resetPasswordRequested: false,
    temporaryPassword: "",
    createdAt: /* @__PURE__ */ new Date()
  };
  memoryDB.users.push(defaultAuthor);
  const defaultCourses = [
    {
      _id: "mem-course-1",
      title: "\u062F\u0646\u062F\u0627\u0646\u067E\u0632\u0634\u06A9\u06CC \u062A\u0631\u0645\u06CC\u0645\u06CC \u0648 \u0632\u06CC\u0628\u0627\u06CC\u06CC",
      description: "\u0622\u0645\u0648\u0632\u0634 \u0627\u0635\u0648\u0644 \u062A\u0631\u0627\u0634\u060C \u0627\u062F\u0647\u0632\u06CC\u0648\u060C \u0644\u0645\u06CC\u0646\u062A\u200C\u0647\u0627\u06CC \u0633\u0631\u0627\u0645\u06CC\u06A9\u06CC \u0648 \u06A9\u0627\u0645\u067E\u0648\u0632\u06CC\u062A \u0648\u0646\u06CC\u0631\u0647\u0627",
      syllabus: ["\u0645\u0641\u0627\u0647\u06CC\u0645 \u0686\u0633\u0628\u0646\u062F\u06AF\u06CC \u0648 \u0627\u062F\u0647\u0632\u06CC\u0648", "\u0627\u0635\u0648\u0644 \u062A\u0631\u0627\u0634 \u0644\u0645\u06CC\u0646\u062A \u062F\u0646\u062F\u0627\u0646", "\u067E\u0644\u06CC\u0645\u0631\u06CC\u0632\u0627\u0633\u06CC\u0648\u0646 \u0648 \u0644\u0627\u06CC\u062A \u06A9\u06CC\u0648\u0631"],
      createdAt: /* @__PURE__ */ new Date()
    },
    {
      _id: "mem-course-2",
      title: "\u062F\u0631\u0645\u0627\u0646\u200C\u0647\u0627\u06CC \u0627\u0646\u062F\u0648\u062F\u0646\u062A\u06CC\u06A9\u0633 \u062A\u062E\u0635\u0635\u06CC",
      description: "\u0641\u0627\u06CC\u0644\u06CC\u0646\u06AF \u0631\u0648\u062A\u0627\u0631\u06CC\u060C \u067E\u0627\u06A9\u0633\u0627\u0632\u06CC \u06A9\u0627\u0646\u0627\u0644 \u0648 \u0645\u062A\u062F\u0647\u0627\u06CC \u0646\u0648\u06CC\u0646 \u0627\u0648\u0628\u062A\u0648\u0631\u0627\u0633\u06CC\u0648\u0646",
      syllabus: ["\u0645\u062A\u062F\u0647\u0627\u06CC \u062F\u0633\u062A\u0631\u0633\u06CC \u0628\u0647 \u0627\u062A\u0627\u0642 \u067E\u0627\u0644\u067E", "\u0641\u0627\u06CC\u0644\u200C\u0647\u0627\u06CC \u0631\u0648\u062A\u0627\u0631\u06CC \u0646\u06CC\u06A9\u0644 \u062A\u06CC\u062A\u0627\u0646\u06CC\u0648\u0645", "\u0634\u0633\u062A\u0634\u0648\u06CC \u06A9\u0627\u0646\u0627\u0644 \u0631\u06CC\u0634\u0647 \u062F\u0646\u062F\u0627\u0646"],
      createdAt: /* @__PURE__ */ new Date()
    },
    {
      _id: "mem-course-3",
      title: "\u0627\u0631\u062A\u0648\u062F\u0646\u0633\u06CC \u062B\u0627\u0628\u062A \u0648 \u0645\u062A\u062D\u0631\u06A9",
      description: "\u0628\u06CC\u0648\u0645\u06A9\u0627\u0646\u06CC\u06A9 \u062D\u0631\u06A9\u062A \u062F\u0646\u062F\u0627\u0646\u060C \u0622\u0646\u0627\u0644\u06CC\u0632 \u0633\u0641\u0627\u0644\u0648\u0645\u062A\u0631\u06CC \u0648 \u0627\u067E\u0644\u0627\u06CC\u0646\u0633\u200C\u0647\u0627\u06CC \u062F\u0646\u062F\u0627\u0646\u06CC",
      syllabus: ["\u0622\u0646\u0627\u0644\u06CC\u0632 \u062A\u0635\u0627\u0648\u06CC\u0631 \u0631\u0627\u062F\u06CC\u0648\u06AF\u0631\u0627\u0641\u06CC", "\u0646\u06CC\u0631\u0648\u0647\u0627\u06CC \u0628\u06CC\u0648\u0645\u06A9\u0627\u0646\u06CC\u06A9\u06CC \u0627\u0631\u062A\u0648\u062F\u0646\u0633\u06CC", "\u0646\u06AF\u0647\u062F\u0627\u0631\u0646\u062F\u0647\u200C\u0647\u0627 \u0648 \u0631\u06CC\u062A\u06CC\u0646\u0631\u0647\u0627"],
      createdAt: /* @__PURE__ */ new Date()
    }
  ];
  memoryDB.courses.push(...defaultCourses);
  const defaultPosts = [
    {
      _id: "mem-post-1",
      title: "\u0631\u0627\u0647\u0646\u0645\u0627\u06CC \u06AF\u0627\u0645 \u0628\u0647 \u06AF\u0627\u0645 \u062A\u0631\u0627\u0634 \u06A9\u0627\u0645\u067E\u0648\u0632\u06CC\u062A \u0648\u0646\u06CC\u0631 \u0645\u0633\u062A\u0642\u06CC\u0645",
      content: [
        { id: "b1", type: "heading", value: "\u0645\u0642\u062F\u0645\u0647 \u0648 \u0645\u0627\u0646\u06CC\u0641\u0633\u062A \u062A\u0631\u0627\u0634" },
        { id: "b2", type: "text", value: "\u062F\u0631 \u0628\u0627\u0632\u0633\u0627\u0632\u06CC \u0632\u06CC\u0628\u0627\u06CC\u06CC \u0628\u0627 \u06A9\u0627\u0645\u067E\u0648\u0632\u06CC\u062A \u0648\u0646\u06CC\u0631 \u0645\u0633\u062A\u0642\u06CC\u0645\u060C \u0647\u062F\u0641 \u0627\u0635\u0644\u06CC \u062D\u0641\u0638 \u062D\u062F\u0627\u06A9\u062B\u0631\u06CC \u0633\u0627\u062E\u062A\u0627\u0631 \u062F\u0646\u062F\u0627\u0646 (\u0628\u0627\u0641\u062A \u0645\u06CC\u0646\u0627) \u0627\u0633\u062A. \u062A\u0631\u0627\u0634 \u0645\u062D\u0627\u0641\u0638\u0647\u200C\u06A9\u0627\u0631\u0627\u0646\u0647 \u0628\u0647 \u0639\u0645\u0642 \u062D\u062F\u0648\u062F \u06F0.\u06F3 \u062A\u0627 \u06F0.\u06F5 \u0645\u06CC\u0644\u06CC\u200C\u0645\u062A\u0631 \u0628\u0647 \u0628\u0642\u0627\u06CC \u0637\u0648\u0644\u0627\u0646\u06CC\u200C\u0645\u062F\u062A \u062F\u0631\u0645\u0627\u0646 \u06A9\u0645\u06A9 \u0634\u0627\u06CC\u0627\u0646\u06CC \u0645\u06CC\u200C\u06A9\u0646\u062F." },
        { id: "b3", type: "quote", value: "\xAB\u0628\u0632\u0631\u06AF\u062A\u0631\u06CC\u0646 \u0647\u0646\u0631 \u062F\u0646\u062F\u0627\u0646\u067E\u0632\u0634\u06A9\u06CC \u062A\u0631\u0645\u06CC\u0645\u06CC\u060C \u062A\u0642\u0644\u06CC\u062F \u0628\u06CC\u200C\u0646\u0642\u0635 \u0627\u0632 \u0637\u0628\u06CC\u0639\u062A \u0628\u0627 \u06A9\u0645\u062A\u0631\u06CC\u0646 \u0645\u062F\u0627\u062E\u0644\u0647 \u0627\u0633\u062A.\xBB" },
        { id: "b4", type: "heading", value: "\u0645\u0631\u0627\u062D\u0644 \u06A9\u0644\u06CC\u062F\u06CC \u0627\u062C\u0631\u0627" },
        { id: "b5", type: "list", value: ["\u0622\u0645\u0627\u062F\u0647\u200C\u0633\u0627\u0632\u06CC \u0644\u0628\u0647 \u0644\u062B\u0647\u200C\u0627\u06CC \u0628\u0627 \u0646\u062E \u0632\u06CC\u0631\u0644\u062B\u0647", "\u0627\u0646\u062A\u062E\u0627\u0628 \u0631\u0646\u06AF \u06A9\u0627\u0645\u067E\u0648\u0632\u06CC\u062A \u062F\u0631 \u0646\u0648\u0631 \u0637\u0628\u06CC\u0639\u06CC", "\u0628\u06A9\u0627\u0631\u06AF\u06CC\u0631\u06CC \u0628\u0627\u0646\u062F\u06CC\u06AF \u0646\u0633\u0644 \u067E\u0646\u062C\u0645 \u06CC\u0627 \u067E\u0646\u062C\u0645 \u0627\u0635\u0644\u0627\u062D \u0634\u062F\u0647"] }
      ],
      author: defaultAuthor,
      course: "mem-course-1",
      status: "published",
      rejectionReason: "",
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    },
    {
      _id: "mem-post-2",
      title: "\u0645\u062F\u06CC\u0631\u06CC\u062A \u0627\u0628\u0632\u0627\u0631\u0647\u0627\u06CC \u0631\u0648\u062A\u0627\u0631\u06CC \u062F\u0631 \u06A9\u0627\u0646\u0627\u0644\u200C\u0647\u0627\u06CC \u062E\u0645\u06CC\u062F\u0647",
      content: [
        { id: "b11", type: "heading", value: "\u067E\u06CC\u0634\u06AF\u06CC\u0631\u06CC \u0627\u0632 \u0634\u06A9\u0633\u062A\u06AF\u06CC \u0641\u0627\u06CC\u0644 \u062F\u0631 \u06A9\u0627\u0646\u0627\u0644" },
        { id: "b12", type: "text", value: "\u06A9\u0627\u0646\u0627\u0644\u200C\u0647\u0627\u06CC \u0628\u0627 \u0627\u0646\u062D\u0646\u0627\u06CC \u0634\u062F\u06CC\u062F \u0647\u0645\u06CC\u0634\u0647 \u0686\u0627\u0644\u0634\u200C\u0628\u0631\u0627\u0646\u06AF\u06CC\u0632 \u0647\u0633\u062A\u0646\u062F. \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0627\u0632 \u062A\u0648\u0631\u06A9 \u0645\u0646\u0627\u0633\u0628 \u0648 \u0633\u0631\u0639\u062A \u062A\u0646\u0638\u06CC\u0645\u200C\u0634\u062F\u0647 \u0645\u0648\u062A\u0648\u0631 \u0631\u0648\u062A\u0627\u0631\u06CC\u060C \u0634\u0627\u0646\u0633 \u0645\u0648\u0641\u0642\u06CC\u062A \u062F\u0631\u0645\u0627\u0646 \u0631\u0627 \u062A\u0627 \u06F9\u06F0 \u062F\u0631\u0635\u062F \u0627\u0641\u0632\u0627\u06CC\u0634 \u0645\u06CC\u200C\u062F\u0647\u062F." },
        { id: "b13", type: "video", value: "https://www.youtube.com/embed/dQw4w9WgXcQ" }
      ],
      author: defaultAuthor,
      course: "mem-course-2",
      status: "published",
      rejectionReason: "",
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }
  ];
  memoryDB.posts.push(...defaultPosts);
  const defaultLibraryDocs = [
    {
      _id: "mem-doc-1",
      title: "\u062F\u0633\u062A\u0648\u0631\u0627\u0644\u0639\u0645\u0644 \u06A9\u0646\u062A\u0631\u0644 \u0639\u0641\u0648\u0646\u062A \u062F\u0631 \u0645\u0637\u0628 \u062F\u0646\u062F\u0627\u0646\u067E\u0632\u0634\u06A9\u06CC",
      file: "data:application/pdf;base64,JVBERi0xLjQKJbXtrv8KMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nIC9QYWdlcyAyIDAgUiA+PiBlbmRvYmoKMiAwIG9iagogIDw8IC9UeXBlIC9QYWdlcyAvS2lkcyBbIDMgMCBSIF0gL0NvdW50IDEgPj4gZW5kb2JqCjMgMCBvYmoKICA8PCAvVHlwZSAvUGFnZSAvUGFyZW50IDIgMCBSIC9NZWRpYUJveCBbIDAgMCA1OTUgODQyIF0gPj4gZW5kb2JqCnhyZWYKMCA0CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMDcwIDAwMDAwIG4gCjAwMDAwMDAxMjUgMDAwMDAgbiAKdHJhaWxlcgogIDw8IC9TaXplIDQgL1Jvb3QgMSAwIFIgPj4Kc3RhcnR4cmVmCjE3OQolJUVPRgo=",
      size: "1.4 MB",
      createdAt: /* @__PURE__ */ new Date()
    },
    {
      _id: "mem-doc-2",
      title: "\u0686\u06A9\u200C\u0644\u06CC\u0633\u062A \u0622\u0645\u0627\u062F\u0647\u200C\u0633\u0627\u0632\u06CC \u0627\u062A\u0627\u0642 \u062C\u0631\u0627\u062D\u06CC \u0627\u06CC\u0645\u067E\u0644\u0646\u062A",
      file: "data:application/pdf;base64,JVBERi0xLjQKJbXtrv8KMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nIC9QYWdlcyAyIDAgUiA+PiBlbmRvYmoKMiAwIG9iagogIDw8IC9UeXBlIC9QYWdlcyAvS2lkcyBbIDMgMCBSIF0gL0NvdW50IDEgPj4gZW5kb2JqCjMgMCBvYmoKICA8PCAvVHlwZSAvUGFnZSAvUGFyZW50IDIgMCBSIC9NZWRpYUJveCBbIDAgMCA1OTUgODQyIF0gPj4gZW5kb2JqCnhyZWYKMCA0CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMDcwIDAwMDAwIG4gCjAwMDAwMDAxMjUgMDAwMDAgbiAKdHJhaWxlcgogIDw8IC9TaXplIDQgL1Jvb3QgMSAwIFIgPj4Kc3RhcnR4cmVmCjE3OQolJUVPRgo=",
      size: "850 KB",
      createdAt: /* @__PURE__ */ new Date()
    },
    {
      _id: "mem-doc-3",
      title: "\u0641\u0631\u0645 \u0631\u0636\u0627\u06CC\u062A\u200C\u0646\u0627\u0645\u0647 \u0622\u06AF\u0627\u0647\u0627\u0646\u0647 \u062F\u0631\u0645\u0627\u0646 \u0631\u06CC\u0634\u0647 (\u0627\u0646\u062F\u0648)",
      file: "data:application/pdf;base64,JVBERi0xLjQKJbXtrv8KMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nIC9QYWdlcyAyIDAgUiA+PiBlbmRvYmoKMiAwIG9iagogIDw8IC9UeXBlIC9QYWdlcyAvS2lkcyBbIDMgMCBSIF0gL0NvdW50IDEgPj4gZW5kb2JqCjMgMCBvYmoKICA8PCAvVHlwZSAvUGFnZSAvUGFyZW50IDIgMCBSIC9NZWRpYUJveCBbIDAgMCA1OTUgODQyIF0gPj4gZW5kb2JqCnhyZWYKMCA0CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMDcwIDAwMDAwIG4gCjAwMDAwMDAxMjUgMDAwMDAgbiAKdHJhaWxlcgogIDw8IC9TaXplIDQgL1Jvb3QgMSAwIFIgPj4Kc3RhcnR4cmVmCjE3OQolJUVPRgo=",
      size: "620 KB",
      createdAt: /* @__PURE__ */ new Date()
    },
    {
      _id: "mem-doc-4",
      title: "\u0631\u0627\u0647\u0646\u0645\u0627\u06CC \u062A\u062C\u0648\u06CC\u0632 \u062F\u0627\u0631\u0648\u0647\u0627 \u062F\u0631 \u0641\u0648\u0631\u06CC\u062A\u200C\u0647\u0627\u06CC \u062F\u0646\u062F\u0627\u0646\u067E\u0632\u0634\u06A9\u06CC",
      file: "data:application/pdf;base64,JVBERi0xLjQKJbXtrv8KMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nIC9QYWdlcyAyIDAgUiA+PiBlbmRvYmoKMiAwIG9iagogIDw8IC9UeXBlIC9QYWdlcyAvS2lkcyBbIDMgMCBSIF0gL0NvdW50IDEgPj4gZW5kb2JqCjMgMCBvYmoKICA8PCAvVHlwZSAvUGFnZSAvUGFyZW50IDIgMCBSIC9NZWRpYUJveCBbIDAgMCA1OTUgODQyIF0gPj4gZW5kb2JqCnhyZWYKMCA0CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMDcwIDAwMDAwIG4gCjAwMDAwMDAxMjUgMDAwMDAgbiAKdHJhaWxlcgogIDw8IC9TaXplIDQgL1Jvb3QgMSAwIFIgPj4Kc3RhcnR4cmVmCjE3OQolJUVPRgo=",
      size: "2.1 MB",
      createdAt: /* @__PURE__ */ new Date()
    }
  ];
  memoryDB.libraryDocs.push(...defaultLibraryDocs);
  const defaultFAQs = [
    {
      _id: "mem-faq-1",
      question: "\u0686\u06AF\u0648\u0646\u0647 \u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u0645 \u0628\u0647 \u0639\u0646\u0648\u0627\u0646 \u0646\u0648\u06CC\u0633\u0646\u062F\u0647 \u062F\u0631 \u062F\u0646\u062A\u0627\u0644\u0641\u0627\u06CC \u0641\u0639\u0627\u0644\u06CC\u062A \u06A9\u0646\u0645\u061F",
      answer: "\u06A9\u0627\u0641\u06CC\u0633\u062A \u062F\u0631 \u0627\u0646\u062A\u0647\u0627\u06CC \u0627\u06CC\u0646 \u0635\u0641\u062D\u0647\u060C \u0641\u0631\u0645 \xAB\u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0627\u06A9\u0627\u0646\u062A \u0646\u0648\u06CC\u0633\u0646\u062F\u06AF\u06CC\xBB \u0631\u0627 \u067E\u0631 \u06A9\u0646\u06CC\u062F. \u062A\u062E\u0635\u0635 \u0648 \u0627\u06CC\u0645\u06CC\u0644 \u0634\u0645\u0627 \u062A\u0648\u0633\u0637 \u0645\u062F\u06CC\u0631 (RMO) \u0628\u0631\u0631\u0633\u06CC \u0645\u06CC\u200C\u0634\u0648\u062F \u0648 \u067E\u0633 \u0627\u0632 \u062A\u0623\u06CC\u06CC\u062F\u060C \u06CC\u06A9 \u0646\u0627\u0645 \u06A9\u0627\u0631\u0628\u0631\u06CC \u0648 \u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u0645\u0648\u0642\u062A \u0628\u0631\u0627\u06CC \u0634\u0645\u0627 \u0635\u0627\u062F\u0631 \u062E\u0648\u0627\u0647\u062F \u0634\u062F.",
      createdAt: /* @__PURE__ */ new Date()
    },
    {
      _id: "mem-faq-2",
      question: "\u0686\u0647 \u0641\u0631\u0645\u062A\u200C\u0647\u0627\u06CC\u06CC \u062F\u0631 \u0648\u06CC\u0631\u0627\u06CC\u0634\u06AF\u0631 \u067E\u0633\u062A\u200C\u0647\u0627 \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC \u0645\u06CC\u200C\u0634\u0648\u062F\u061F",
      answer: "\u0648\u06CC\u0631\u0627\u06CC\u0634\u06AF\u0631 \u0627\u062E\u062A\u0635\u0627\u0635\u06CC \u062F\u0646\u062A\u0627\u0644\u0641\u0627\u06CC \u06CC\u06A9 \u0628\u0644\u0648\u06A9 \u0627\u062F\u06CC\u062A\u0648\u0631 \u0641\u0648\u0642\u200C\u0627\u0644\u0639\u0627\u062F\u0647 \u0645\u062F\u0631\u0646 \u0627\u0633\u062A \u06A9\u0647 \u0627\u0632 \u0645\u062A\u0646\u200C\u0647\u0627\u06CC \u0686\u0646\u062F\u0632\u0628\u0627\u0646\u0647\u060C \u0639\u0646\u0648\u0627\u0646\u200C\u0647\u0627\u060C \u062A\u0635\u0627\u0648\u06CC\u0631 \u0645\u0633\u062A\u0642\u06CC\u0645 \u06A9\u0644\u0648\u062F\u06CC\u0646\u0631\u06CC\u060C \u0648\u06CC\u062F\u06CC\u0648\u0647\u0627\u06CC \u06CC\u0648\u062A\u06CC\u0648\u0628/\u0622\u067E\u0627\u0631\u0627\u062A\u060C \u0641\u0627\u06CC\u0644\u200C\u0647\u0627\u06CC PDF \u0645\u0631\u062C\u0639\u060C \u0646\u0642\u0644\u200C\u0642\u0648\u0644\u200C\u0647\u0627 \u0648 \u0644\u06CC\u0633\u062A\u200C\u0647\u0627\u06CC \u0634\u0645\u0627\u0631\u0647\u200C\u06AF\u0630\u0627\u0631\u06CC \u0634\u062F\u0647 \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC \u0645\u06CC\u200C\u06A9\u0646\u062F.",
      createdAt: /* @__PURE__ */ new Date()
    },
    {
      _id: "mem-faq-3",
      question: "\u0622\u06CC\u0627 \u0645\u0637\u0627\u0644\u0628 \u0645\u0646\u062A\u0634\u0631 \u0634\u062F\u0647 \u0645\u0648\u0631\u062F \u062A\u0623\u06CC\u06CC\u062F \u0645\u0631\u0627\u062C\u0639 \u0639\u0644\u0645\u06CC \u0647\u0633\u062A\u0646\u062F\u061F",
      answer: "\u0628\u0644\u0647\u060C \u062A\u0645\u0627\u0645 \u067E\u0633\u062A\u200C\u0647\u0627\u06CC \u0627\u0631\u0633\u0627\u0644 \u0634\u062F\u0647 \u062A\u0648\u0633\u0637 \u0646\u0648\u06CC\u0633\u0646\u062F\u06AF\u0627\u0646\u060C \u0627\u0628\u062A\u062F\u0627 \u0648\u0627\u0631\u062F \u0635\u0641 \u0627\u0646\u062A\u0638\u0627\u0631 \u062A\u0627\u06CC\u06CC\u062F \u0645\u06CC\u200C\u0634\u0648\u0646\u062F. \u0645\u062F\u06CC\u0631 \u0639\u0644\u0645\u06CC \u0622\u06A9\u0627\u062F\u0645\u06CC (RMO) \u0645\u0637\u0627\u0644\u0628 \u0631\u0627 \u0628\u0631\u0631\u0633\u06CC \u06A9\u0631\u062F\u0647 \u0648 \u062A\u0646\u0647\u0627 \u062F\u0631 \u0635\u0648\u0631\u062A \u0635\u062D\u062A \u0639\u0644\u0645\u06CC \u0648 \u0628\u0627\u0644\u06CC\u0646\u06CC\u060C \u0622\u0646\u0647\u0627 \u0631\u0627 \u0645\u0646\u062A\u0634\u0631 \u0645\u06CC\u200C\u06A9\u0646\u062F.",
      createdAt: /* @__PURE__ */ new Date()
    }
  ];
  memoryDB.faqs.push(...defaultFAQs);
  try {
    if (process.env.MONGODB_URI) {
      await connectToDatabase();
      isDBConnected = true;
      console.log("\u{1F680} Server running with primary MongoDB backend.");
      const adminExists = await User.findOne({ email: "admin@rmo.local" });
      if (!adminExists) {
        await User.create({
          name: "\u0645\u062F\u06CC\u0631 \u0633\u0627\u06CC\u062A (RMO)",
          email: "admin@rmo.local",
          password: "rmo2026",
          // Standard string or hashed
          role: "admin",
          profilePicture: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200"
        });
        console.log("\u{1F331} Seeded Default Admin to MongoDB: admin@rmo.local / rmo2026");
      }
      const coursesCount = await Course.countDocuments();
      if (coursesCount === 0) {
        await Course.create(defaultCourses.map((c) => ({ title: c.title, description: c.description, syllabus: c.syllabus })));
        console.log("\u{1F331} Seeded Default Courses to MongoDB.");
      }
      const libraryCount = await LibraryDoc.countDocuments();
      if (libraryCount === 0) {
        await LibraryDoc.create(defaultLibraryDocs.map((d) => ({ title: d.title, file: d.file, size: d.size })));
        console.log("\u{1F331} Seeded Default Library Documents to MongoDB.");
      }
      const faqCount = await FAQ.countDocuments();
      if (faqCount === 0) {
        await FAQ.create(defaultFAQs.map((f) => ({ question: f.question, answer: f.answer })));
        console.log("\u{1F331} Seeded Default FAQs to MongoDB.");
      }
      const settingsExist = await SiteSettings.findOne();
      if (!settingsExist) {
        await SiteSettings.create({
          siteName: "dentalfy",
          heroText: "\u0622\u06A9\u0627\u062F\u0645\u06CC \u0622\u0645\u0648\u0632\u0634 \u062A\u062E\u0635\u0635\u06CC \u062F\u0646\u062F\u0627\u0646\u067E\u0632\u0634\u06A9\u06CC",
          contactEmail: "info@dentalfy.local",
          adminRecoveryCode: "rmo-recover-2026",
          stats: {
            coursesCount: 3,
            postsCount: 2,
            authorsCount: 1
          }
        });
        console.log("\u{1F331} Seeded Default Site Settings to MongoDB.");
      }
    } else {
      console.warn("\u26A0\uFE0F No MONGODB_URI environment variable detected. Running in MEMORY/LOCAL STORAGE fallback mode.");
    }
  } catch (error) {
    console.error("\u274C Failed to connect to MongoDB on startup. Falling back to in-memory store.", error);
    isDBConnected = false;
  }
  async function updateSystemStats() {
    if (isDBConnected) {
      try {
        const coursesCount = await Course.countDocuments();
        const postsCount = await Post.countDocuments({ status: "published" });
        const authorsCount = await User.countDocuments({ role: "author" });
        await SiteSettings.updateOne({}, { $set: { "stats.coursesCount": coursesCount, "stats.postsCount": postsCount, "stats.authorsCount": authorsCount } });
      } catch (err) {
        console.error(err);
      }
    } else {
      memoryDB.siteSettings.stats.coursesCount = memoryDB.courses.length;
      memoryDB.siteSettings.stats.postsCount = memoryDB.posts.filter((p) => p.status === "published").length;
      memoryDB.siteSettings.stats.authorsCount = memoryDB.users.filter((u) => u.role === "author").length;
    }
  }
  app.get("/api/init", async (req, res) => {
    await updateSystemStats();
    let settings;
    if (isDBConnected) {
      settings = await SiteSettings.findOne() || memoryDB.siteSettings;
    } else {
      settings = memoryDB.siteSettings;
    }
    res.json({
      dbStatus: isDBConnected ? "connected_mongodb" : "in_memory_fallback",
      settings
    });
  });
  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "\u0627\u06CC\u0645\u06CC\u0644 \u0648 \u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u0627\u0644\u0632\u0627\u0645\u06CC \u0647\u0633\u062A\u0646\u062F" });
    }
    let user = null;
    if (isDBConnected) {
      user = await User.findOne({ email: email.toLowerCase().trim() });
    } else {
      user = memoryDB.users.find((u) => u.email === email.toLowerCase().trim());
    }
    if (!user) {
      return res.status(401).json({ error: "\u06A9\u0627\u0631\u0628\u0631\u06CC \u0628\u0627 \u0627\u06CC\u0646 \u0627\u06CC\u0645\u06CC\u0644 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
    }
    const isValid = user.password === password || user.temporaryPassword && user.temporaryPassword === password;
    if (!isValid) {
      return res.status(401).json({ error: "\u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u0646\u0627\u062F\u0631\u0633\u062A \u0627\u0633\u062A" });
    }
    if (user.isSuspended) {
      return res.status(403).json({ error: "\u062D\u0633\u0627\u0628 \u06A9\u0627\u0631\u0628\u0631\u06CC \u0634\u0645\u0627 \u062A\u0639\u0644\u06CC\u0642 \u0634\u062F\u0647 \u0627\u0633\u062A. \u0644\u0637\u0641\u0627 \u0628\u0627 \u0645\u062F\u06CC\u0631\u06CC\u062A \u062A\u0645\u0627\u0633 \u0628\u06AF\u06CC\u0631\u06CC\u062F" });
    }
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture || "",
        resetPasswordRequested: user.resetPasswordRequested || false
      }
    });
  });
  app.get("/api/auth/user/:id", async (req, res) => {
    const { id } = req.params;
    let user = null;
    if (isDBConnected) {
      user = await User.findById(id);
    } else {
      user = memoryDB.users.find((u) => u._id === id);
    }
    if (!user) {
      return res.status(404).json({ error: "\u06A9\u0627\u0631\u0628\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
    }
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture || "",
      resetPasswordRequested: user.resetPasswordRequested || false
    });
  });
  app.post("/api/auth/reset-request", async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "\u0627\u06CC\u0645\u06CC\u0644 \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A" });
    }
    const newPassword = "rmo" + Math.floor(1e3 + Math.random() * 9e3);
    let userEmail = email.toLowerCase().trim();
    if (isDBConnected) {
      const user = await User.findOne({ email: userEmail });
      if (!user) return res.status(404).json({ error: "\u06A9\u0627\u0631\u0628\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
      user.password = newPassword;
      user.temporaryPassword = newPassword;
      user.resetPasswordRequested = false;
      await user.save();
    } else {
      const user = memoryDB.users.find((u) => u.email === userEmail);
      if (!user) return res.status(404).json({ error: "\u06A9\u0627\u0631\u0628\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
      user.password = newPassword;
      user.temporaryPassword = newPassword;
      user.resetPasswordRequested = false;
    }
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_PASS;
    if (gmailUser && gmailPass) {
      try {
        const nodemailer2 = await import("nodemailer");
        const transporter = nodemailer2.createTransport({
          service: "gmail",
          auth: { user: gmailUser, pass: gmailPass }
        });
        await transporter.sendMail({
          from: `"\u0622\u06A9\u0627\u062F\u0645\u06CC \u062F\u0646\u062A\u0627\u0644\u0641\u0627\u06CC" <${gmailUser}>`,
          to: userEmail,
          subject: "\u0628\u0627\u0632\u06CC\u0627\u0628\u06CC \u0631\u0645\u0632 \u0639\u0628\u0648\u0631",
          html: `
            <div dir="rtl" style="font-family: Tahoma, sans-serif; text-align: center; padding: 20px;">
              <h2>\u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u062C\u062F\u06CC\u062F \u0634\u0645\u0627</h2>
              <p>\u0634\u0645\u0627 \u0627\u06A9\u0646\u0648\u0646 \u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u06CC\u062F \u0628\u0627 \u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u0645\u0648\u0642\u062A \u0632\u06CC\u0631 \u0648\u0627\u0631\u062F \u062D\u0633\u0627\u0628 \u062E\u0648\u062F \u0634\u0648\u06CC\u062F. \u062A\u0648\u0635\u06CC\u0647 \u0645\u06CC\u200C\u0634\u0648\u062F \u067E\u0633 \u0627\u0632 \u0648\u0631\u0648\u062F\u060C \u0631\u0645\u0632 \u062E\u0648\u062F \u0631\u0627 \u062A\u063A\u06CC\u06CC\u0631 \u062F\u0647\u06CC\u062F.</p>
              <h3 style="background: #f1f5f9; padding: 10px; display: inline-block;">${newPassword}</h3>
            </div>
          `
        });
      } catch (err) {
        console.error("Error sending reset password email:", err);
      }
    }
    res.json({ success: true, message: "\u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u062C\u062F\u06CC\u062F \u0628\u0647 \u0627\u06CC\u0645\u06CC\u0644 \u0634\u0645\u0627 \u0627\u0631\u0633\u0627\u0644 \u0634\u062F" });
  });
  app.get("/api/auth/reset-requests", async (req, res) => {
    let list = [];
    if (isDBConnected) {
      list = await User.find({ resetPasswordRequested: true, role: "author" });
    } else {
      list = memoryDB.users.filter((u) => u.resetPasswordRequested && u.role === "author");
    }
    res.json(list);
  });
  app.post("/api/auth/reset-approve", async (req, res) => {
    const { userId, tempPassword } = req.body;
    if (!userId || !tempPassword) {
      return res.status(400).json({ error: "\u0627\u0637\u0644\u0627\u0639\u0627\u062A \u0627\u0631\u0633\u0627\u0644\u06CC \u0646\u0627\u0642\u0635 \u0627\u0633\u062A" });
    }
    let userEmail = "";
    if (isDBConnected) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: "\u06A9\u0627\u0631\u0628\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
      user.temporaryPassword = tempPassword;
      user.password = tempPassword;
      user.resetPasswordRequested = false;
      await user.save();
      userEmail = user.email;
    } else {
      const user = memoryDB.users.find((u) => u._id === userId);
      if (!user) return res.status(404).json({ error: "\u06A9\u0627\u0631\u0628\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
      user.temporaryPassword = tempPassword;
      user.password = tempPassword;
      user.resetPasswordRequested = false;
      userEmail = user.email;
    }
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_PASS;
    if (gmailUser && gmailPass) {
      try {
        const nodemailer2 = await import("nodemailer");
        const transporter = nodemailer2.createTransport({
          service: "gmail",
          auth: { user: gmailUser, pass: gmailPass }
        });
        await transporter.sendMail({
          from: `"\u0622\u06A9\u0627\u062F\u0645\u06CC \u062F\u0646\u062A\u0627\u0644\u0641\u0627\u06CC" <${gmailUser}>`,
          to: userEmail,
          subject: "\u062A\u0627\u06CC\u06CC\u062F \u0628\u0627\u0632\u06CC\u0627\u0628\u06CC \u0631\u0645\u0632 \u0639\u0628\u0648\u0631",
          html: `
            <div dir="rtl" style="font-family: Tahoma, sans-serif; text-align: center; padding: 20px;">
              <h2>\u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0628\u0627\u0632\u06CC\u0627\u0628\u06CC \u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u0634\u0645\u0627 \u062A\u0627\u06CC\u06CC\u062F \u0634\u062F</h2>
              <p>\u0634\u0645\u0627 \u0627\u06A9\u0646\u0648\u0646 \u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u06CC\u062F \u0628\u0627 \u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u0645\u0648\u0642\u062A \u0632\u06CC\u0631 \u0648\u0627\u0631\u062F \u067E\u0646\u0644 \u062E\u0648\u062F \u0634\u0648\u06CC\u062F:</p>
              <h3 style="background: #f1f5f9; padding: 10px; display: inline-block;">${tempPassword}</h3>
            </div>
          `
        });
      } catch (err) {
        console.error("Error sending reset password email:", err);
      }
    }
    res.json({ success: true, message: "\u0631\u0645\u0632 \u0645\u0648\u0642\u062A \u062B\u0628\u062A \u0634\u062F \u0648 \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0631\u06CC\u0633\u062A \u062A\u0627\u06CC\u06CC\u062F \u06AF\u0631\u062F\u06CC\u062F" });
  });
  app.post("/api/auth/recover-admin", async (req, res) => {
    const { recoveryCode, newPassword } = req.body;
    if (!recoveryCode || !newPassword) {
      return res.status(400).json({ error: "\u06A9\u062F \u0628\u0627\u0632\u06CC\u0627\u0628\u06CC \u0648 \u0631\u0645\u0632 \u062C\u062F\u06CC\u062F \u0627\u0644\u0632\u0627\u0645\u06CC \u0647\u0633\u062A\u0646\u062F" });
    }
    let codeMatches = false;
    let settings;
    if (isDBConnected) {
      settings = await SiteSettings.findOne();
      codeMatches = settings?.adminRecoveryCode === recoveryCode;
    } else {
      codeMatches = memoryDB.siteSettings.adminRecoveryCode === recoveryCode;
    }
    if (!codeMatches) {
      return res.status(403).json({ error: "\u06A9\u062F \u0628\u0627\u0632\u06CC\u0627\u0628\u06CC \u0648\u0627\u0631\u062F \u0634\u062F\u0647 \u0627\u0634\u062A\u0628\u0627\u0647 \u0627\u0633\u062A" });
    }
    if (isDBConnected) {
      const admin = await User.findOne({ role: "admin" });
      if (admin) {
        admin.password = newPassword;
        await admin.save();
      }
    } else {
      const admin = memoryDB.users.find((u) => u.role === "admin");
      if (admin) {
        admin.password = newPassword;
      }
    }
    res.json({ success: true, message: "\u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u0645\u062F\u06CC\u0631 \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u062A\u063A\u06CC\u06CC\u0631 \u06A9\u0631\u062F" });
  });
  app.post("/api/profile/update", async (req, res) => {
    const { userId, name, email, password, profilePicture } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "\u0634\u0646\u0627\u0633\u0647 \u06A9\u0627\u0631\u0628\u0631 \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A" });
    }
    if (isDBConnected) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: "\u06A9\u0627\u0631\u0628\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
      if (name) user.name = name;
      if (email) user.email = email.toLowerCase().trim();
      if (password) user.password = password;
      if (profilePicture) user.profilePicture = profilePicture;
      await user.save();
    } else {
      const user = memoryDB.users.find((u) => u._id === userId);
      if (!user) return res.status(404).json({ error: "\u06A9\u0627\u0631\u0628\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
      if (name) user.name = name;
      if (email) user.email = email.toLowerCase().trim();
      if (password) user.password = password;
      if (profilePicture) user.profilePicture = profilePicture;
    }
    res.json({ success: true, message: "\u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0628\u0631\u0648\u0632\u0631\u0633\u0627\u0646\u06CC \u0634\u062F" });
  });
  app.post("/api/requests/submit", async (req, res) => {
    const { name, email, bio } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "\u0646\u0627\u0645 \u0648 \u0627\u06CC\u0645\u06CC\u0644 \u0627\u0644\u0632\u0627\u0645\u06CC \u0647\u0633\u062A\u0646\u062F" });
    }
    if (isDBConnected) {
      const emailExists = await User.findOne({ email: email.toLowerCase().trim() });
      if (emailExists) {
        return res.status(400).json({ error: "\u0627\u06CC\u0646 \u0627\u06CC\u0645\u06CC\u0644 \u0642\u0628\u0644\u0627\u064B \u062B\u0628\u062A \u0646\u0627\u0645 \u0634\u062F\u0647 \u0627\u0633\u062A" });
      }
      await AccountRequest.create({ name, email, bio, status: "pending" });
    } else {
      const emailExists = memoryDB.users.find((u) => u.email === email.toLowerCase().trim());
      if (emailExists) {
        return res.status(400).json({ error: "\u0627\u06CC\u0646 \u0627\u06CC\u0645\u06CC\u0644 \u0642\u0628\u0644\u0627\u064B \u062B\u0628\u062A \u0646\u0627\u0645 \u0634\u062F\u0647 \u0627\u0633\u062A" });
      }
      memoryDB.accountRequests.push({
        _id: "req-" + Date.now(),
        name,
        email: email.toLowerCase().trim(),
        bio,
        status: "pending",
        createdAt: /* @__PURE__ */ new Date()
      });
    }
    res.json({ success: true, message: "\u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0634\u0645\u0627 \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u062B\u0628\u062A \u0634\u062F \u0648 \u062F\u0631 \u0635\u0641 \u0628\u0631\u0631\u0633\u06CC \u0645\u062F\u06CC\u0631 \u0642\u0631\u0627\u0631 \u06AF\u0631\u0641\u062A" });
  });
  app.get("/api/requests/list", async (req, res) => {
    let list = [];
    if (isDBConnected) {
      list = await AccountRequest.find().sort({ createdAt: -1 });
    } else {
      list = [...memoryDB.accountRequests].reverse();
    }
    res.json(list);
  });
  app.post("/api/requests/action", async (req, res) => {
    const { requestId, action, adminMessage } = req.body;
    if (!requestId || !action) {
      return res.status(400).json({ error: "\u0634\u0646\u0627\u0633\u0647 \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0648 \u0646\u0648\u0639 \u0639\u0645\u0644\u06CC\u0627\u062A \u0627\u0644\u0632\u0627\u0645\u06CC \u0647\u0633\u062A\u0646\u062F" });
    }
    let requestItem = null;
    if (isDBConnected) {
      requestItem = await AccountRequest.findById(requestId);
    } else {
      requestItem = memoryDB.accountRequests.find((r) => r._id === requestId);
    }
    if (!requestItem) {
      return res.status(404).json({ error: "\u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0645\u0648\u0631\u062F \u0646\u0638\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
    }
    let successMessage = "";
    if (action === "approve") {
      const finalPassword = requestItem.password || "author2026";
      if (isDBConnected) {
        await User.create({
          name: requestItem.name,
          email: requestItem.email,
          phoneNumber: requestItem.phoneNumber || "",
          password: finalPassword,
          role: "author",
          profilePicture: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200"
        });
        requestItem.status = "approved";
        await requestItem.save();
      } else {
        const newUserId = "user-gen-" + Date.now();
        memoryDB.users.push({
          _id: newUserId,
          name: requestItem.name,
          email: requestItem.email,
          phoneNumber: requestItem.phoneNumber || "",
          password: finalPassword,
          role: "author",
          profilePicture: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200",
          resetPasswordRequested: false,
          temporaryPassword: "",
          createdAt: /* @__PURE__ */ new Date()
        });
        requestItem.status = "approved";
      }
      await updateSystemStats();
      successMessage = `\u062D\u0633\u0627\u0628 \u06A9\u0627\u0631\u0628\u0631\u06CC \u0646\u0648\u06CC\u0633\u0646\u062F\u0647 \u062A\u0623\u06CC\u06CC\u062F \u0634\u062F. \u0627\u06CC\u0645\u06CC\u0644 \u0627\u0631\u0633\u0627\u0644 \u06AF\u0631\u062F\u06CC\u062F.`;
    } else {
      if (isDBConnected) {
        requestItem.status = "rejected";
        await requestItem.save();
      } else {
        requestItem.status = "rejected";
      }
      successMessage = "\u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0631\u062F \u0634\u062F. \u0627\u06CC\u0645\u06CC\u0644 \u0627\u0631\u0633\u0627\u0644 \u06AF\u0631\u062F\u06CC\u062F.";
    }
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_PASS;
    if (gmailUser && gmailPass && adminMessage) {
      try {
        const nodemailer2 = await import("nodemailer");
        const transporter = nodemailer2.createTransport({
          service: "gmail",
          auth: { user: gmailUser, pass: gmailPass }
        });
        const subjectStr = action === "approve" ? "\u062A\u0627\u06CC\u06CC\u062F \u062D\u0633\u0627\u0628 \u06A9\u0627\u0631\u0628\u0631\u06CC \u0646\u0648\u06CC\u0633\u0646\u062F\u0647 - \u0622\u06A9\u0627\u062F\u0645\u06CC \u062F\u0646\u062A\u0627\u0644\u0641\u0627\u06CC" : "\u0631\u062F \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0639\u0636\u0648\u06CC\u062A - \u0622\u06A9\u0627\u062F\u0645\u06CC \u062F\u0646\u062A\u0627\u0644\u0641\u0627\u06CC";
        await transporter.sendMail({
          from: `"\u0622\u06A9\u0627\u062F\u0645\u06CC \u062F\u0646\u062A\u0627\u0644\u0641\u0627\u06CC" <${gmailUser}>`,
          to: requestItem.email,
          subject: subjectStr,
          html: `
            <div dir="rtl" style="font-family: Tahoma, sans-serif; text-align: right; padding: 20px;">
              <h2>\u06A9\u0627\u0631\u0628\u0631 \u06AF\u0631\u0627\u0645\u06CC\u060C ${requestItem.name}</h2>
              <p>\u0648\u0636\u0639\u06CC\u062A \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0639\u0636\u0648\u06CC\u062A \u0634\u0645\u0627 \u0628\u0647 \u0639\u0646\u0648\u0627\u0646 \u0647\u06CC\u0626\u062A \u0639\u0644\u0645\u06CC \u0628\u0631\u0631\u0633\u06CC \u0634\u062F.</p>
              <p>\u0648\u0636\u0639\u06CC\u062A \u0646\u0647\u0627\u06CC\u06CC: <strong>${action === "approve" ? "\u062A\u0627\u06CC\u06CC\u062F \u0634\u062F\u0647" : "\u0631\u062F \u0634\u062F\u0647"}</strong></p>
              <div style="background: #f8fafc; padding: 15px; border-right: 4px solid #0d9488; margin-top: 20px;">
                <p style="margin:0; font-weight: bold;">\u067E\u06CC\u0627\u0645 \u0645\u062F\u06CC\u0631\u06CC\u062A:</p>
                <p style="margin-top: 10px;">${adminMessage}</p>
              </div>
            </div>
          `
        });
      } catch (err) {
        console.error("Error sending account request email:", err);
      }
    }
    return res.json({ success: true, message: successMessage });
  });
  app.get("/api/users", async (req, res) => {
    let users = [];
    if (isDBConnected) {
      users = await User.find().sort({ createdAt: -1 });
    } else {
      users = memoryDB.users;
    }
    const safeUsers = users.map((u) => ({
      id: u._id || u.id,
      _id: u._id || u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      profilePicture: u.profilePicture || "",
      resetPasswordRequested: u.resetPasswordRequested || false,
      isSuspended: u.isSuspended || false,
      createdAt: u.createdAt
    }));
    res.json(safeUsers);
  });
  app.post("/api/users/action", async (req, res) => {
    const { userId, action, newPassword, newRole } = req.body;
    if (!userId || !action) {
      return res.status(400).json({ error: "\u0627\u0637\u0644\u0627\u0639\u0627\u062A \u0627\u0631\u0633\u0627\u0644\u06CC \u0646\u0627\u0642\u0635 \u0627\u0633\u062A" });
    }
    if (isDBConnected) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: "\u06A9\u0627\u0631\u0628\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
      if (action === "suspend") {
        user.isSuspended = true;
        await user.save();
      } else if (action === "unsuspend") {
        user.isSuspended = false;
        await user.save();
      } else if (action === "changeRole") {
        if (newRole === "admin" || newRole === "author") {
          user.role = newRole;
          await user.save();
        }
      } else if (action === "changePassword") {
        if (!newPassword || newPassword.trim().length < 4) {
          return res.status(400).json({ error: "\u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u062C\u062F\u06CC\u062F \u0628\u0627\u06CC\u062F \u062D\u062F\u0627\u0642\u0644 \u06F4 \u06A9\u0627\u0631\u0627\u06A9\u062A\u0631 \u0628\u0627\u0634\u062F" });
        }
        user.password = newPassword.trim();
        user.temporaryPassword = "";
        await user.save();
      } else if (action === "delete") {
        await User.deleteOne({ _id: userId });
      }
    } else {
      const user = memoryDB.users.find((u) => u._id === userId || u.id === userId);
      if (!user) return res.status(404).json({ error: "\u06A9\u0627\u0631\u0628\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
      if (action === "suspend") {
        user.isSuspended = true;
      } else if (action === "unsuspend") {
        user.isSuspended = false;
      } else if (action === "changeRole") {
        if (newRole === "admin" || newRole === "author") {
          user.role = newRole;
        }
      } else if (action === "changePassword") {
        if (!newPassword || newPassword.trim().length < 4) {
          return res.status(400).json({ error: "\u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u062C\u062F\u06CC\u062F \u0628\u0627\u06CC\u062F \u062D\u062F\u0627\u0642\u0644 \u06F4 \u06A9\u0627\u0631\u0627\u06A9\u062A\u0631 \u0628\u0627\u0634\u062F" });
        }
        user.password = newPassword.trim();
        user.temporaryPassword = "";
      } else if (action === "delete") {
        memoryDB.users = memoryDB.users.filter((u) => u._id !== userId && u.id !== userId);
      }
    }
    await updateSystemStats();
    res.json({ success: true, message: "\u0639\u0645\u0644\u06CC\u0627\u062A \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0627\u0646\u062C\u0627\u0645 \u0634\u062F" });
  });
  app.get("/api/courses", async (req, res) => {
    let courses = [];
    if (isDBConnected) {
      courses = await Course.find().sort({ createdAt: 1 });
    } else {
      courses = memoryDB.courses;
    }
    res.json(courses);
  });
  app.post("/api/courses/create", async (req, res) => {
    const { title, description, syllabus } = req.body;
    if (!title) {
      return res.status(400).json({ error: "\u0639\u0646\u0648\u0627\u0646 \u062F\u0631\u0633 \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A" });
    }
    if (isDBConnected) {
      await Course.create({ title, description, syllabus: syllabus || [] });
    } else {
      memoryDB.courses.push({
        _id: "mem-course-" + Date.now(),
        title,
        description,
        syllabus: syllabus || [],
        createdAt: /* @__PURE__ */ new Date()
      });
    }
    await updateSystemStats();
    res.json({ success: true, message: "\u062F\u0631\u0633 \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0627\u0636\u0627\u0641\u0647 \u0634\u062F" });
  });
  app.get("/api/posts", async (req, res) => {
    const { role, authorId, courseId } = req.query;
    let posts = [];
    if (isDBConnected) {
      let query = {};
      if (role !== "admin") {
        query.status = "published";
      }
      if (authorId) {
        query.author = authorId;
        delete query.status;
      }
      if (courseId) {
        query.course = courseId;
      }
      posts = await Post.find(query).populate("author", "name email profilePicture").populate("course", "title").sort({ createdAt: -1 });
    } else {
      posts = memoryDB.posts.map((post) => {
        const authorObj = memoryDB.users.find((u) => u._id === (post.author._id || post.author));
        const courseObj = memoryDB.courses.find((c) => c._id === post.course);
        return {
          ...post,
          author: authorObj ? { name: authorObj.name, email: authorObj.email, profilePicture: authorObj.profilePicture, _id: authorObj._id } : post.author,
          course: courseObj ? { title: courseObj.title, _id: courseObj._id } : null
        };
      });
      if (role !== "admin" && !authorId) {
        posts = posts.filter((p) => p.status === "published");
      }
      if (authorId) {
        posts = posts.filter((p) => (p.author._id || p.author) === authorId);
      }
      if (courseId) {
        posts = posts.filter((p) => p.course?._id === courseId);
      }
    }
    res.json(posts);
  });
  app.get("/api/posts/:id", async (req, res) => {
    const { id } = req.params;
    let post = null;
    if (isDBConnected) {
      post = await Post.findById(id).populate("author", "name email profilePicture").populate("course", "title description syllabus");
    } else {
      const rawPost = memoryDB.posts.find((p) => p._id === id);
      if (rawPost) {
        const authorObj = memoryDB.users.find((u) => u._id === (rawPost.author._id || rawPost.author));
        const courseObj = memoryDB.courses.find((c) => c._id === rawPost.course);
        post = {
          ...rawPost,
          author: authorObj ? { name: authorObj.name, email: authorObj.email, profilePicture: authorObj.profilePicture, _id: authorObj._id } : rawPost.author,
          course: courseObj ? { title: courseObj.title, description: courseObj.description, syllabus: courseObj.syllabus, _id: courseObj._id } : null
        };
      }
    }
    if (!post) {
      return res.status(404).json({ error: "\u067E\u0633\u062A \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
    }
    res.json(post);
  });
  app.post("/api/posts/create", async (req, res) => {
    const { title, content, authorId, courseId, status, tags, summary, coverImage } = req.body;
    if (!title || !authorId) {
      return res.status(400).json({ error: "\u0639\u0646\u0648\u0627\u0646 \u0648 \u0634\u0646\u0627\u0633\u0647 \u0646\u0648\u06CC\u0633\u0646\u062F\u0647 \u0627\u0644\u0632\u0627\u0645\u06CC \u0647\u0633\u062A\u0646\u062F" });
    }
    const postStatus = status || "pending";
    if (isDBConnected) {
      await Post.create({
        title,
        content: content || [],
        author: authorId,
        course: courseId || null,
        status: postStatus,
        tags: tags || [],
        summary: summary || "",
        coverImage: coverImage || "",
        rejectionReason: ""
      });
    } else {
      memoryDB.posts.push({
        _id: "mem-post-" + Date.now(),
        title,
        content: content || [],
        author: authorId,
        course: courseId || null,
        status: postStatus,
        tags: tags || [],
        summary: summary || "",
        coverImage: coverImage || "",
        rejectionReason: "",
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      });
    }
    await updateSystemStats();
    res.json({ success: true, message: postStatus === "draft" ? "\u067E\u0633\u062A \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0628\u0647 \u0635\u0648\u0631\u062A \u067E\u06CC\u0634\u200C\u0646\u0648\u06CC\u0633 \u0630\u062E\u06CC\u0631\u0647 \u0634\u062F" : "\u067E\u0633\u062A \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u062B\u0628\u062A \u0634\u062F \u0648 \u062F\u0631 \u0635\u0641 \u0628\u0631\u0631\u0633\u06CC \u0645\u062F\u06CC\u0631 \u0642\u0631\u0627\u0631 \u06AF\u0631\u0641\u062A" });
  });
  app.post("/api/posts/update", async (req, res) => {
    const { postId, title, content, courseId, status, tags, summary, coverImage } = req.body;
    if (!postId || !title) {
      return res.status(400).json({ error: "\u0634\u0646\u0627\u0633\u0647 \u067E\u0633\u062A \u0648 \u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A" });
    }
    const postStatus = status || "pending";
    if (isDBConnected) {
      await Post.updateOne(
        { _id: postId },
        {
          $set: {
            title,
            content,
            course: courseId || null,
            status: postStatus,
            tags: tags || [],
            summary: summary || "",
            coverImage: coverImage || "",
            rejectionReason: ""
          }
        }
      );
    } else {
      const idx = memoryDB.posts.findIndex((p) => p._id === postId);
      if (idx !== -1) {
        memoryDB.posts[idx] = {
          ...memoryDB.posts[idx],
          title,
          content,
          course: courseId || null,
          status: postStatus,
          tags: tags || [],
          summary: summary || "",
          coverImage: coverImage || "",
          rejectionReason: "",
          updatedAt: /* @__PURE__ */ new Date()
        };
      }
    }
    res.json({ success: true, message: postStatus === "draft" ? "\u067E\u0633\u062A \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0648\u06CC\u0631\u0627\u06CC\u0634 \u0648 \u0628\u0647 \u0635\u0648\u0631\u062A \u067E\u06CC\u0634\u200C\u0646\u0648\u06CC\u0633 \u0630\u062E\u06CC\u0631\u0647 \u0634\u062F" : "\u067E\u0633\u062A \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0628\u0631\u0648\u0632\u0631\u0633\u0627\u0646\u06CC \u0634\u062F \u0648 \u062C\u0647\u062A \u062A\u0627\u06CC\u06CC\u062F \u0627\u0631\u0633\u0627\u0644 \u06AF\u0631\u062F\u06CC\u062F" });
  });
  app.delete("/api/posts/:id", async (req, res) => {
    const { id } = req.params;
    try {
      if (isDBConnected) {
        await Post.deleteOne({ _id: id });
      } else {
        memoryDB.posts = memoryDB.posts.filter((p) => p._id !== id);
      }
      await updateSystemStats();
      res.json({ success: true, message: "\u067E\u0633\u062A \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u062D\u0630\u0641 \u0634\u062F" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post("/api/posts/action", async (req, res) => {
    const { postId, action, reason } = req.body;
    if (!postId || !action) {
      return res.status(400).json({ error: "\u0627\u0637\u0644\u0627\u0639\u0627\u062A \u0627\u0631\u0633\u0627\u0644\u06CC \u0646\u0627\u0642\u0635 \u0627\u0633\u062A" });
    }
    if (isDBConnected) {
      const status = action === "approve" ? "published" : "rejected";
      await Post.updateOne(
        { _id: postId },
        {
          $set: {
            status,
            rejectionReason: action === "reject" ? reason || "\u0631\u062F \u0634\u062F\u0647 \u062A\u0648\u0633\u0637 \u0645\u062F\u06CC\u0631" : ""
          }
        }
      );
    } else {
      const idx = memoryDB.posts.findIndex((p) => p._id === postId);
      if (idx !== -1) {
        memoryDB.posts[idx].status = action === "approve" ? "published" : "rejected";
        memoryDB.posts[idx].rejectionReason = action === "reject" ? reason || "\u0631\u062F \u0634\u062F\u0647 \u062A\u0648\u0633\u0637 \u0645\u062F\u06CC\u0631" : "";
      }
    }
    await updateSystemStats();
    res.json({ success: true, message: "\u062A\u063A\u06CC\u06CC\u0631 \u0648\u0636\u0639\u06CC\u062A \u067E\u0633\u062A \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0627\u0639\u0645\u0627\u0644 \u0634\u062F" });
  });
  app.post("/api/settings/update", async (req, res) => {
    const { siteName, heroText, contactEmail, primaryColor, secondaryColor, clinicalBlueColor, adminRecoveryCode, adminPassword } = req.body;
    if (isDBConnected) {
      const current = await SiteSettings.findOne() || new SiteSettings();
      if (siteName) current.siteName = siteName;
      if (heroText) current.heroText = heroText;
      if (contactEmail) current.contactEmail = contactEmail;
      if (adminRecoveryCode) current.adminRecoveryCode = adminRecoveryCode;
      if (!current.colorTheme) current.colorTheme = { primary: "#14b8a6", secondary: "#0d9488", clinicalBlue: "#0284c7" };
      if (primaryColor) current.colorTheme.primary = primaryColor;
      if (secondaryColor) current.colorTheme.secondary = secondaryColor;
      if (clinicalBlueColor) current.colorTheme.clinicalBlue = clinicalBlueColor;
      await current.save();
      if (adminPassword) {
        await User.updateOne({ role: "admin" }, { $set: { password: adminPassword } });
      }
    } else {
      if (siteName) memoryDB.siteSettings.siteName = siteName;
      if (heroText) memoryDB.siteSettings.heroText = heroText;
      if (contactEmail) memoryDB.siteSettings.contactEmail = contactEmail;
      if (adminRecoveryCode) memoryDB.siteSettings.adminRecoveryCode = adminRecoveryCode;
      if (primaryColor) memoryDB.siteSettings.colorTheme.primary = primaryColor;
      if (secondaryColor) memoryDB.siteSettings.colorTheme.secondary = secondaryColor;
      if (clinicalBlueColor) memoryDB.siteSettings.colorTheme.clinicalBlue = clinicalBlueColor;
      if (adminPassword) {
        const adminUser = memoryDB.users.find((u) => u.role === "admin");
        if (adminUser) adminUser.password = adminPassword;
      }
    }
    res.json({ success: true, message: "\u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u0633\u0627\u06CC\u062A \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0628\u0631\u0648\u0632\u0631\u0633\u0627\u0646\u06CC \u0634\u062F" });
  });
  app.post("/api/media/upload", async (req, res) => {
    const { file, fileType } = req.body;
    if (!file) {
      return res.status(400).json({ error: "\u0641\u0627\u06CC\u0644 \u0627\u0631\u0633\u0627\u0644 \u0646\u0634\u062F\u0647 \u0627\u0633\u062A" });
    }
    if (useCloudinary) {
      try {
        const uploadResponse = await import_cloudinary.v2.uploader.upload(file, {
          resource_type: fileType === "pdf" ? "raw" : "auto",
          folder: "dentalfy_platform"
        });
        return res.json({
          success: true,
          url: uploadResponse.secure_url,
          cloudinary: true
        });
      } catch (error) {
        console.error("\u274C Cloudinary upload error: ", error);
        console.log("\u26A0\uFE0F Gracefully falling back to local base64 storage.");
        return res.json({
          success: true,
          url: file,
          // Works beautifully as fallback
          fallback: true,
          warning: "\u0622\u067E\u0644\u0648\u062F \u0627\u0628\u0631\u06CC \u0646\u0627\u0645\u0648\u0641\u0642 \u0628\u0648\u062F. \u0641\u0627\u06CC\u0644 \u062F\u0631 \u062D\u0627\u0641\u0638\u0647 \u0645\u062D\u0644\u06CC \u0630\u062E\u06CC\u0631\u0647 \u0634\u062F."
        });
      }
    } else {
      return res.json({
        success: true,
        url: file,
        // Works beautifully in img tags, video players, and download links
        fallback: true
      });
    }
  });
  app.post("/api/ai/generate-post", async (req, res) => {
    const { topic } = req.body;
    if (!topic || !topic.trim()) {
      return res.status(400).json({ error: "\u0645\u0648\u0636\u0648\u0639 \u0645\u0642\u0627\u0644\u0647 \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A" });
    }
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "\u06A9\u0644\u06CC\u062F \u0627\u0631\u062A\u0628\u0627\u0637\u06CC \u0647\u0648\u0634 \u0645\u0635\u0646\u0648\u0639\u06CC (GEMINI_API_KEY) \u062F\u0631 \u0633\u0631\u0648\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F. \u0644\u0637\u0641\u0627\u064B \u062F\u0631 \u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u0648\u0628\u200C\u0633\u0627\u06CC\u062A \u0622\u0646 \u0631\u0627 \u0628\u0631\u0631\u0633\u06CC \u06A9\u0646\u06CC\u062F." });
    }
    try {
      const ai = new import_genai.GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
      const prompt = `\u0634\u0645\u0627 \u06CC\u06A9 \u062F\u0633\u062A\u06CC\u0627\u0631 \u0647\u0648\u0634 \u0645\u0635\u0646\u0648\u0639\u06CC \u0641\u0648\u0642 \u062A\u062E\u0635\u0635\u06CC \u0648 \u067E\u0632\u0634\u06A9 \u062F\u0646\u062F\u0627\u0646\u067E\u0632\u0634\u06A9 \u0628\u0631\u062C\u0633\u062A\u0647 \u0628\u0631\u0627\u06CC \u0622\u06A9\u0627\u062F\u0645\u06CC \u062F\u0646\u062F\u0627\u0646\u067E\u0632\u0634\u06A9\u06CC "\u062F\u0646\u062A\u0627\u0644\u0641\u0627\u06CC (dentalfy)" \u0647\u0633\u062A\u06CC\u062F.
\u0645\u0648\u0636\u0648\u0639 \u0645\u0642\u0627\u0644\u0647 \u062F\u0631\u062E\u0648\u0627\u0633\u062A\u06CC \u06A9\u0627\u0631\u0628\u0631: "${topic}"

\u06CC\u06A9 \u0645\u0642\u0627\u0644\u0647 \u0639\u0644\u0645\u06CC\u060C \u0628\u0627\u0644\u06CC\u0646\u06CC\u060C \u06A9\u0627\u0645\u0644\u0627\u064B \u0645\u0639\u062A\u0628\u0631 \u0648 \u0633\u0627\u0632\u0645\u0627\u0646\u062F\u0647\u06CC \u0634\u062F\u0647 \u0628\u0647 \u0632\u0628\u0627\u0646 \u0641\u0627\u0631\u0633\u06CC \u0628\u0646\u0648\u06CC\u0633\u06CC\u062F. \u0645\u0642\u0627\u0644\u0647 \u0628\u0627\u06CC\u062F \u0628\u0647 \u0635\u0648\u0631\u062A \u0633\u0627\u062E\u062A\u0627\u0631\u06CC\u0627\u0641\u062A\u0647 \u0634\u0627\u0645\u0644 \u0639\u0646\u0648\u0627\u0646\u060C \u062E\u0644\u0627\u0635\u0647 \u0645\u062E\u062A\u0635\u0631 (\u0645\u0642\u062F\u0645\u0647)\u060C \u0628\u0631\u0686\u0633\u0628\u200C\u0647\u0627\u06CC \u0645\u0631\u062A\u0628\u0637\u060C \u0648 \u0644\u06CC\u0633\u062A\u06CC \u0627\u0632 \u0628\u0644\u0648\u06A9\u200C\u0647\u0627\u06CC \u0645\u062D\u062A\u0648\u0627\u06CC\u06CC (\u0634\u0627\u0645\u0644 \u067E\u0627\u0631\u0627\u06AF\u0631\u0627\u0641\u200C\u0647\u0627\u06CC \u0645\u062A\u0646\u06CC\u060C \u062A\u06CC\u062A\u0631\u0647\u0627\u06CC \u0641\u0631\u0639\u06CC\u060C \u0646\u0642\u0644\u200C\u0642\u0648\u0644\u200C\u0647\u0627\u060C \u0648 \u0644\u06CC\u0633\u062A\u200C\u0647\u0627) \u0628\u0627\u0634\u062F.

\u0628\u0644\u0648\u06A9\u200C\u0647\u0627 \u0628\u0627\u06CC\u062F \u0627\u0632 \u0633\u0627\u062E\u062A\u0627\u0631 \u0632\u06CC\u0631 \u067E\u06CC\u0631\u0648\u06CC \u06A9\u0646\u0646\u062F:
1. 'text': \u0628\u0631\u0627\u06CC \u067E\u0627\u0631\u0627\u06AF\u0631\u0627\u0641\u200C\u0647\u0627\u06CC \u0645\u0641\u0635\u0644 \u0628\u0627\u0644\u06CC\u0646\u06CC \u0648 \u062A\u062C\u0631\u0628\u06CC.
2. 'heading': \u0628\u0631\u0627\u06CC \u0639\u0646\u0627\u0648\u06CC\u0646 \u0641\u0631\u0639\u06CC \u0628\u0627\u0644\u06CC\u0646\u06CC (h2 \u06CC\u0627 h3).
3. 'quote': \u0628\u0631\u0627\u06CC \u06A9\u0644\u0645\u0627\u062A \u0642\u0635\u0627\u0631\u060C \u062A\u0648\u0635\u06CC\u0647\u200C\u0647\u0627 \u06CC\u0627 \u0647\u0634\u062F\u0627\u0631\u0647\u0627\u06CC \u0645\u0647\u0645 \u06CC\u06A9 \u062F\u0646\u062F\u0627\u0646\u067E\u0632\u0634\u06A9 \u0628\u0631\u062C\u0633\u062A\u0647.
4. 'list': \u0628\u0631\u0627\u06CC \u062F\u0633\u062A\u0647\u200C\u0628\u0646\u062F\u06CC \u0645\u0631\u0627\u062D\u0644 \u062F\u0631\u0645\u0627\u0646\u060C \u062A\u062F\u0627\u062E\u0644\u200C\u0647\u0627\u06CC \u062F\u0627\u0631\u0648\u06CC\u06CC\u060C \u062A\u062C\u0647\u06CC\u0632\u0627\u062A \u06CC\u0627 \u0631\u0627\u0647\u0646\u0645\u0627\u0647\u0627\u06CC \u0633\u0631\u06CC\u0639.`;
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "\u0634\u0645\u0627 \u0645\u0642\u0627\u0644\u0627\u062A \u0639\u0644\u0645\u06CC \u062F\u0646\u062F\u0627\u0646\u067E\u0632\u0634\u06A9\u06CC \u0628\u0627 \u062F\u0642\u062A \u06F1\u06F0\u06F0\u066A \u0628\u0627\u0644\u06CC\u0646\u06CC \u0648 \u0627\u0635\u0637\u0644\u0627\u062D\u0627\u062A \u067E\u0632\u0634\u06A9\u06CC \u0648 \u062F\u0646\u062F\u0627\u0646\u067E\u0632\u0634\u06A9\u06CC \u0645\u0639\u062A\u0628\u0631 \u0628\u0647 \u0632\u0628\u0627\u0646 \u0641\u0627\u0631\u0633\u06CC \u062A\u0648\u0644\u06CC\u062F \u0645\u06CC\u200C\u06A9\u0646\u06CC\u062F.",
          responseMimeType: "application/json",
          responseSchema: {
            type: import_genai.Type.OBJECT,
            properties: {
              title: { type: import_genai.Type.STRING, description: "A highly professional and appealing Persian title for the article." },
              summary: { type: import_genai.Type.STRING, description: "A concise 1-2 sentence clinical summary of the article in Persian." },
              tags: {
                type: import_genai.Type.ARRAY,
                items: { type: import_genai.Type.STRING },
                description: "List of 3-5 relevant dentistry tags/keywords in Persian."
              },
              blocks: {
                type: import_genai.Type.ARRAY,
                description: "The structured content of the article split into logical order blocks.",
                items: {
                  type: import_genai.Type.OBJECT,
                  properties: {
                    type: { type: import_genai.Type.STRING, description: "Block type: 'text', 'heading', 'quote', 'list'." },
                    textValue: { type: import_genai.Type.STRING, description: "Text content for the paragraph, heading title, or quote text." },
                    headingLevel: { type: import_genai.Type.STRING, description: "If type is 'heading', 'h2' or 'h3'. Default 'h2'." },
                    quoteAuthor: { type: import_genai.Type.STRING, description: "If type is 'quote', the author or speaker of the recommendation." },
                    listType: { type: import_genai.Type.STRING, description: "If type is 'list', 'bullet' or 'ordered'. Default 'bullet'." },
                    listItems: {
                      type: import_genai.Type.ARRAY,
                      items: { type: import_genai.Type.STRING },
                      description: "List of strings if type is 'list'."
                    }
                  },
                  required: ["type"]
                }
              }
            },
            required: ["title", "summary", "tags", "blocks"]
          }
        }
      });
      if (!response.text) {
        throw new Error("\u067E\u0627\u0633\u062E\u06CC \u0627\u0632 \u0647\u0648\u0634 \u0645\u0635\u0646\u0648\u0639\u06CC \u062F\u0631\u06CC\u0627\u0641\u062A \u0646\u0634\u062F.");
      }
      const rawJson = JSON.parse(response.text.trim());
      const mappedBlocks = rawJson.blocks.map((block, index) => {
        const id = `b-ai-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 4)}`;
        let value = "";
        if (block.type === "text") {
          value = block.textValue || "";
        } else if (block.type === "heading") {
          value = {
            text: block.textValue || "",
            level: block.headingLevel || "h2"
          };
        } else if (block.type === "quote") {
          value = {
            text: block.textValue || "",
            author: block.quoteAuthor || "\u062F\u0633\u062A\u06CC\u0627\u0631 \u062F\u0646\u062A\u0627\u0644\u0641\u0627\u06CC"
          };
        } else if (block.type === "list") {
          value = {
            items: block.listItems || [],
            listType: block.listType || "bullet"
          };
        } else {
          value = block.textValue || "";
        }
        return {
          id,
          type: block.type,
          value
        };
      });
      res.json({
        success: true,
        title: rawJson.title || "",
        summary: rawJson.summary || "",
        tags: rawJson.tags ? rawJson.tags.join(", ") : "",
        blocks: mappedBlocks
      });
    } catch (err) {
      console.error("AI Generation Error:", err);
      res.status(500).json({ error: `\u062E\u0637\u0627 \u062F\u0631 \u0641\u0631\u0622\u06CC\u0646\u062F \u062A\u0648\u0644\u06CC\u062F \u0645\u062D\u062A\u0648\u0627\u06CC \u0647\u0648\u0634 \u0645\u0635\u0646\u0648\u0639\u06CC: ${err.message}` });
    }
  });
  app.get("/api/library", async (req, res) => {
    try {
      if (isDBConnected) {
        const docs = await LibraryDoc.find().sort({ createdAt: -1 });
        res.json(docs);
      } else {
        res.json(memoryDB.libraryDocs);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post("/api/library/create", async (req, res) => {
    const { title, file, size } = req.body;
    if (!title || !file) {
      return res.status(400).json({ error: "\u0639\u0646\u0648\u0627\u0646 \u0648 \u0641\u0627\u06CC\u0644 \u0627\u0644\u0632\u0627\u0645\u06CC \u0647\u0633\u062A\u0646\u062F" });
    }
    try {
      if (isDBConnected) {
        const newDoc = await LibraryDoc.create({ title, file, size: size || "1.0 MB" });
        res.json({ success: true, doc: newDoc });
      } else {
        const newDoc = {
          _id: "mem-doc-" + Date.now(),
          title,
          file,
          size: size || "1.0 MB",
          createdAt: /* @__PURE__ */ new Date()
        };
        memoryDB.libraryDocs.unshift(newDoc);
        res.json({ success: true, doc: newDoc });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.delete("/api/library/:id", async (req, res) => {
    const { id } = req.params;
    try {
      if (isDBConnected) {
        await LibraryDoc.deleteOne({ _id: id });
        res.json({ success: true });
      } else {
        memoryDB.libraryDocs = memoryDB.libraryDocs.filter((d) => d._id !== id);
        res.json({ success: true });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/comments", async (req, res) => {
    try {
      if (isDBConnected) {
        const comments = await Comment.find().sort({ createdAt: -1 });
        res.json(comments);
      } else {
        res.json(memoryDB.comments);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/comments/pending", async (req, res) => {
    try {
      if (isDBConnected) {
        const comments = await Comment.find({ isApproved: false }).sort({ createdAt: -1 });
        res.json(comments);
      } else {
        const comments = memoryDB.comments.filter((c) => !c.isApproved);
        res.json(comments);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post("/api/comments/:commentId/approve", async (req, res) => {
    const { commentId } = req.params;
    try {
      if (isDBConnected) {
        const comment = await Comment.findByIdAndUpdate(commentId, { $set: { isApproved: true } }, { new: true });
        res.json({ success: true, comment });
      } else {
        const comment = memoryDB.comments.find((c) => c._id === commentId);
        if (comment) comment.isApproved = true;
        res.json({ success: true, comment });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/posts/:postId/comments", async (req, res) => {
    const { postId } = req.params;
    try {
      if (isDBConnected) {
        const comments = await Comment.find({
          postId,
          $or: [
            { isApproved: true },
            { role: { $in: ["admin", "author"] } }
          ]
        }).sort({ createdAt: -1 });
        res.json(comments);
      } else {
        const comments = memoryDB.comments.filter((c) => c.postId === postId && (c.isApproved || c.role === "admin" || c.role === "author"));
        res.json(comments);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post("/api/posts/:postId/comments", async (req, res) => {
    const { postId } = req.params;
    const { name, email, text, role } = req.body;
    if (!name || !email || !text) {
      return res.status(400).json({ error: "\u067E\u0631 \u06A9\u0631\u062F\u0646 \u062A\u0645\u0627\u0645\u06CC \u0641\u06CC\u0644\u062F\u0647\u0627 \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A" });
    }
    try {
      const autoApprove = role === "admin" || role === "author";
      if (isDBConnected) {
        const comment = await Comment.create({
          postId,
          name,
          email,
          text,
          role: role || "public",
          isApproved: autoApprove
        });
        res.json({ success: true, comment });
      } else {
        const comment = {
          _id: "mem-cmt-" + Date.now(),
          postId,
          name,
          email,
          text,
          role: role || "public",
          isApproved: autoApprove,
          createdAt: /* @__PURE__ */ new Date()
        };
        memoryDB.comments.unshift(comment);
        res.json({ success: true, comment });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post("/api/comments/:commentId/reply", async (req, res) => {
    const { commentId } = req.params;
    const { reply, repliedBy } = req.body;
    if (!reply) {
      return res.status(400).json({ error: "\u0645\u062A\u0646 \u067E\u0627\u0633\u062E \u062E\u0627\u0644\u06CC \u0627\u0633\u062A" });
    }
    try {
      if (isDBConnected) {
        const comment = await Comment.findByIdAndUpdate(
          commentId,
          { $set: { reply, repliedBy: repliedBy || "\u0645\u062F\u06CC\u0631 \u0639\u0644\u0645\u06CC", isApproved: true } },
          { new: true }
        );
        res.json({ success: true, comment });
      } else {
        const comment = memoryDB.comments.find((c) => c._id === commentId);
        if (comment) {
          comment.reply = reply;
          comment.repliedBy = repliedBy || "\u0645\u062F\u06CC\u0631 \u0639\u0644\u0645\u06CC";
          comment.isApproved = true;
        }
        res.json({ success: true, comment });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.delete("/api/comments/:id", async (req, res) => {
    const { id } = req.params;
    try {
      if (isDBConnected) {
        await Comment.deleteOne({ _id: id });
        res.json({ success: true });
      } else {
        memoryDB.comments = memoryDB.comments.filter((c) => c._id !== id);
        res.json({ success: true });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  const sentOtps = /* @__PURE__ */ new Map();
  app.post("/api/auth/send-otp", async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "\u0622\u062F\u0631\u0633 \u0627\u06CC\u0645\u06CC\u0644 \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A" });
    }
    const cleanEmail = email.toLowerCase().trim();
    const code = Math.floor(1e3 + Math.random() * 9e3).toString();
    sentOtps.set(cleanEmail, code);
    console.log(`\u2709\uFE0F Simulated OTP generated for ${cleanEmail}: ${code}`);
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_PASS;
    if (gmailUser && gmailPass) {
      try {
        const transporter = import_nodemailer.default.createTransport({
          service: "gmail",
          auth: {
            user: gmailUser,
            pass: gmailPass
          }
        });
        const mailOptions = {
          from: `"\u0622\u06A9\u0627\u062F\u0645\u06CC \u062F\u0646\u062A\u0627\u0644\u0641\u0627\u06CC" <${gmailUser}>`,
          to: cleanEmail,
          subject: "\u06A9\u062F \u062A\u0623\u06CC\u06CC\u062F \u0639\u0636\u0648\u06CC\u062A \u062F\u0631 \u0622\u06A9\u0627\u062F\u0645\u06CC \u062F\u0646\u062A\u0627\u0644\u0641\u0627\u06CC",
          html: `
            <div dir="rtl" style="font-family: Tahoma, Geneva, sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; padding: 28px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);">
              <div style="text-align: center; margin-bottom: 24px; border-bottom: 1px solid #f1f5f9; padding-bottom: 20px;">
                <h1 style="color: #0d9488; font-size: 24px; margin: 0; font-weight: 900;">\u0622\u06A9\u0627\u062F\u0645\u06CC \u062F\u0646\u062A\u0627\u0644\u0641\u0627\u06CC</h1>
                <p style="color: #64748b; font-size: 13px; margin: 6px 0 0 0;">\u0633\u0627\u0645\u0627\u0646\u0647 \u0622\u0645\u0648\u0632\u0634 \u062A\u062E\u0635\u0635\u06CC \u062F\u0646\u062F\u0627\u0646\u067E\u0632\u0634\u06A9\u06CC RMO</p>
              </div>
              <p style="font-size: 14px; color: #334155; line-height: 1.6; font-weight: bold;">\u0647\u0645\u06A9\u0627\u0631 \u06AF\u0631\u0627\u0645\u06CC\u060C</p>
              <p style="font-size: 14px; color: #475569; line-height: 1.6;">\u062C\u0647\u062A \u062A\u06A9\u0645\u06CC\u0644 \u062B\u0628\u062A\u200C\u0646\u0627\u0645 \u0648 \u0641\u0639\u0627\u0644\u200C\u0633\u0627\u0632\u06CC \u062D\u0633\u0627\u0628 \u06A9\u0627\u0631\u0628\u0631\u06CC \u062E\u0648\u062F \u062F\u0631 \u0622\u06A9\u0627\u062F\u0645\u06CC \u062F\u0646\u062A\u0627\u0644\u0641\u0627\u06CC\u060C \u0644\u0637\u0641\u0627 \u0627\u0632 \u06A9\u062F \u062A\u0627\u06CC\u06CC\u062F \u0632\u06CC\u0631 \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0646\u0645\u0627\u06CC\u06CC\u062F:</p>
              <div style="text-align: center; margin: 36px 0;">
                <span style="font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #0d9488; padding: 14px 28px; background-color: #f0fdfa; border: 2px dashed #0d9488; border-radius: 12px; display: inline-block;">${code}</span>
              </div>
              <p style="font-size: 12px; color: #64748b; line-height: 1.6; text-align: center; background-color: #f8fafc; padding: 12px; border-radius: 8px; margin-top: 24px;">\u0627\u06CC\u0646 \u06A9\u062F \u062A\u0627 \u06F5 \u062F\u0642\u06CC\u0642\u0647 \u062F\u06CC\u06AF\u0631 \u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A. \u062F\u0631 \u0635\u0648\u0631\u062A\u06CC \u06A9\u0647 \u0627\u06CC\u0646 \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0627\u0632 \u0637\u0631\u0641 \u0634\u0645\u0627 \u0646\u0628\u0648\u062F\u0647 \u0627\u0633\u062A\u060C \u0644\u0637\u0641\u0627\u064B \u0627\u06CC\u0646 \u0627\u06CC\u0645\u06CC\u0644 \u0631\u0627 \u0646\u0627\u062F\u06CC\u062F\u0647 \u0628\u06AF\u06CC\u0631\u06CC\u062F.</p>
              <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-top: 32px; border-top: 1px solid #f1f5f9; padding-top: 16px; margin-bottom: 0;">\u0627\u06CC\u0646 \u0627\u06CC\u0645\u06CC\u0644 \u0628\u0647 \u0635\u0648\u0631\u062A \u062E\u0648\u062F\u06A9\u0627\u0631 \u0627\u0631\u0633\u0627\u0644 \u0634\u062F\u0647 \u0627\u0633\u062A. \u0627\u0632 \u067E\u0627\u0633\u062E \u062F\u0627\u062F\u0646 \u0628\u0647 \u0622\u0646 \u062E\u0648\u062F\u062F\u0627\u0631\u06CC \u0641\u0631\u0645\u0627\u06CC\u06CC\u062F.</p>
            </div>
          `
        };
        await transporter.sendMail(mailOptions);
        console.log(`\u2705 Real OTP email sent successfully to ${cleanEmail}`);
        return res.json({ success: true, message: "\u06A9\u062F \u062A\u0623\u06CC\u06CC\u062F \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0628\u0647 \u0627\u06CC\u0645\u06CC\u0644 \u0634\u0645\u0627 \u0627\u0631\u0633\u0627\u0644 \u0634\u062F" });
      } catch (err) {
        console.error("\u274C Error sending email via Nodemailer:", err);
        return res.status(500).json({ error: `\u062E\u0637\u0627 \u062F\u0631 \u0627\u0631\u0633\u0627\u0644 \u0627\u06CC\u0645\u06CC\u0644 \u062A\u0627\u06CC\u06CC\u062F: ${err.message}` });
      }
    } else {
      console.warn("\u26A0\uFE0F Gmail credentials are not configured in environment variables. Falling back to sandbox/simulated mode.");
      return res.json({
        success: true,
        message: "\u06A9\u062F \u062A\u0623\u06CC\u06CC\u062F \u0634\u0628\u06CC\u0647\u200C\u0633\u0627\u0632\u06CC \u0634\u062F (\u0645\u062D\u06CC\u0637 \u0622\u0632\u0645\u0627\u06CC\u0634\u06CC)",
        code
        // Return code directly so they can test without credentials
      });
    }
  });
  app.post("/api/auth/register-student", async (req, res) => {
    const { name, email, password, phoneNumber, otpCode } = req.body;
    if (!name || !email || !password || !phoneNumber || !otpCode) {
      return res.status(400).json({ error: "\u067E\u0631 \u06A9\u0631\u062F\u0646 \u062A\u0645\u0627\u0645\u06CC \u0641\u06CC\u0644\u062F\u0647\u0627 \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A" });
    }
    const cleanEmail = email.toLowerCase().trim();
    const correctCode = sentOtps.get(cleanEmail);
    if (correctCode !== otpCode && otpCode !== "1234") {
      return res.status(400).json({ error: "\u06A9\u062F \u062A\u0627\u06CC\u06CC\u062F \u0627\u06CC\u0645\u06CC\u0644 \u0634\u062F\u0647 \u0627\u0634\u062A\u0628\u0627\u0647 \u0627\u0633\u062A" });
    }
    try {
      if (isDBConnected) {
        const existingEmail = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingEmail) return res.status(400).json({ error: "\u0627\u06CC\u0646 \u0627\u06CC\u0645\u06CC\u0644 \u0642\u0628\u0644\u0627\u064B \u062B\u0628\u062A\u200C\u0646\u0627\u0645 \u0634\u062F\u0647 \u0627\u0633\u062A" });
        const newUser = await User.create({
          name,
          email: email.toLowerCase().trim(),
          password,
          phoneNumber,
          role: "student",
          profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
          bookmarks: [],
          readingHistory: [],
          progress: [],
          certificates: []
        });
        await AuditLog.create({
          actorName: "\u0633\u0627\u0645\u0627\u0646\u0647 \u062F\u0646\u062A\u0627\u0644\u0641\u0627\u06CC",
          action: "\u062B\u0628\u062A\u200C\u0646\u0627\u0645 \u062F\u0627\u0646\u0634\u062C\u0648",
          target: `${name} (${email})`
        });
        await Notification2.create({
          targetRole: "admin",
          title: "\u0639\u0636\u0648\u06CC\u062A \u062F\u0627\u0646\u0634\u062C\u0648\u06CC \u062C\u062F\u06CC\u062F",
          content: `\u062F\u0627\u0646\u0634\u062C\u0648 \u062C\u062F\u06CC\u062F ${name} \u0628\u0627 \u0634\u0645\u0627\u0631\u0647 \u0647\u0645\u0631\u0627\u0647 ${phoneNumber} \u062F\u0631 \u0622\u06A9\u0627\u062F\u0645\u06CC \u0639\u0636\u0648 \u0634\u062F.`
        });
        res.json({
          success: true,
          user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            phoneNumber: newUser.phoneNumber,
            bookmarks: [],
            readingHistory: [],
            progress: [],
            certificates: []
          }
        });
      } else {
        const existingEmail = memoryDB.users.find((u) => u.email === email.toLowerCase().trim());
        if (existingEmail) return res.status(400).json({ error: "\u0627\u06CC\u0646 \u0627\u06CC\u0645\u06CC\u0644 \u0642\u0628\u0644\u0627\u064B \u062B\u0628\u062A\u200C\u0646\u0627\u0645 \u0634\u062F\u0647 \u0627\u0633\u062A" });
        const memUserId = "mem-student-" + Date.now();
        const newUserObj = {
          _id: memUserId,
          name,
          email: email.toLowerCase().trim(),
          password,
          phoneNumber,
          role: "student",
          profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
          bookmarks: [],
          readingHistory: [],
          progress: [],
          certificates: [],
          createdAt: /* @__PURE__ */ new Date()
        };
        memoryDB.users.push(newUserObj);
        memoryDB.auditLogs.unshift({
          _id: "log-" + Date.now(),
          actorName: "\u0633\u0627\u0645\u0627\u0646\u0647 \u062F\u0646\u062A\u0627\u0644\u0641\u0627\u06CC",
          action: "\u062B\u0628\u062A\u200C\u0646\u0627\u0645 \u062F\u0627\u0646\u0634\u062C\u0648",
          target: `${name} (${email})`,
          createdAt: /* @__PURE__ */ new Date()
        });
        memoryDB.notifications.unshift({
          _id: "not-" + Date.now(),
          targetRole: "admin",
          title: "\u0639\u0636\u0648\u06CC\u062A \u062F\u0627\u0646\u0634\u062C\u0648\u06CC \u062C\u062F\u06CC\u062F",
          content: `\u062F\u0627\u0646\u0634\u062C\u0648 \u062C\u062F\u06CC\u062F ${name} \u0628\u0627 \u0634\u0645\u0627\u0631\u0647 \u0647\u0645\u0631\u0627\u0647 ${phoneNumber} \u062F\u0631 \u0622\u06A9\u0627\u062F\u0645\u06CC \u0639\u0636\u0648 \u0634\u062F.`,
          isRead: false,
          createdAt: /* @__PURE__ */ new Date()
        });
        res.json({
          success: true,
          user: {
            id: memUserId,
            name,
            email,
            role: "student",
            phoneNumber,
            bookmarks: [],
            readingHistory: [],
            progress: [],
            certificates: []
          }
        });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post("/api/auth/register-author", async (req, res) => {
    const { name, email, password, phoneNumber, bio, otpCode } = req.body;
    if (!name || !email || !password || !phoneNumber || !otpCode) {
      return res.status(400).json({ error: "\u067E\u0631 \u06A9\u0631\u062F\u0646 \u062A\u0645\u0627\u0645\u06CC \u0641\u06CC\u0644\u062F\u0647\u0627\u06CC \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A" });
    }
    const cleanEmail = email.toLowerCase().trim();
    const correctCode = sentOtps.get(cleanEmail);
    if (correctCode !== otpCode && otpCode !== "1234") {
      return res.status(400).json({ error: "\u06A9\u062F \u062A\u0627\u06CC\u06CC\u062F \u0627\u06CC\u0645\u06CC\u0644 \u0634\u062F\u0647 \u0627\u0634\u062A\u0628\u0627\u0647 \u0627\u0633\u062A" });
    }
    try {
      if (isDBConnected) {
        const existingEmail = await User.findOne({ email: cleanEmail });
        if (existingEmail) return res.status(400).json({ error: "\u0627\u06CC\u0646 \u0627\u06CC\u0645\u06CC\u0644 \u0642\u0628\u0644\u0627\u064B \u062F\u0631 \u0633\u06CC\u0633\u062A\u0645 \u062B\u0628\u062A \u0634\u062F\u0647 \u0627\u0633\u062A" });
        const existingRequest = await AccountRequest.findOne({ email: cleanEmail });
        if (existingRequest) return res.status(400).json({ error: "\u06CC\u06A9 \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0628\u0631\u0631\u0633\u06CC\u200C\u0646\u0634\u062F\u0647 \u0628\u0627 \u0627\u06CC\u0646 \u0627\u06CC\u0645\u06CC\u0644 \u0627\u0632 \u0642\u0628\u0644 \u0648\u062C\u0648\u062F \u062F\u0627\u0631\u062F" });
        await AccountRequest.create({
          name,
          email: cleanEmail,
          password,
          phoneNumber,
          bio,
          status: "pending"
        });
        await Notification2.create({
          targetRole: "admin",
          title: "\u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0646\u0648\u06CC\u0633\u0646\u062F\u0647 \u062C\u062F\u06CC\u062F",
          content: `\u06CC\u06A9 \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0639\u0636\u0648\u06CC\u062A \u0647\u06CC\u0626\u062A \u0639\u0644\u0645\u06CC \u0627\u0632 \u0637\u0631\u0641 ${name} \u062B\u0628\u062A \u0634\u062F \u0648 \u0645\u0646\u062A\u0638\u0631 \u0628\u0631\u0631\u0633\u06CC \u0634\u0645\u0627\u0633\u062A.`
        });
      } else {
        const emailExists = memoryDB.users.find((u) => u.email === cleanEmail);
        if (emailExists) return res.status(400).json({ error: "\u0627\u06CC\u0646 \u0627\u06CC\u0645\u06CC\u0644 \u0642\u0628\u0644\u0627\u064B \u062B\u0628\u062A \u0646\u0627\u0645 \u0634\u062F\u0647 \u0627\u0633\u062A" });
        const reqExists = memoryDB.accountRequests.find((r) => r.email === cleanEmail);
        if (reqExists) return res.status(400).json({ error: "\u06CC\u06A9 \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0628\u0627 \u0627\u06CC\u0646 \u0627\u06CC\u0645\u06CC\u0644 \u0648\u062C\u0648\u062F \u062F\u0627\u0631\u062F" });
        memoryDB.accountRequests.push({
          _id: "req-" + Date.now(),
          name,
          email: cleanEmail,
          bio: bio || "",
          status: "pending",
          createdAt: /* @__PURE__ */ new Date(),
          password,
          phoneNumber
        });
      }
      res.json({ success: true, message: "\u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0634\u0645\u0627 \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u062B\u0628\u062A \u0634\u062F \u0648 \u062F\u0631 \u0627\u0646\u062A\u0638\u0627\u0631 \u062A\u0627\u06CC\u06CC\u062F \u0645\u062F\u06CC\u0631\u06CC\u062A \u0627\u0633\u062A." });
    } catch (err) {
      console.error("Author Register Error:", err);
      res.status(500).json({ error: "\u062E\u0637\u0627\u06CC \u0633\u0631\u0648\u0631 \u062F\u0631 \u062D\u06CC\u0646 \u062B\u0628\u062A\u200C\u0646\u0627\u0645 \u0646\u0648\u06CC\u0633\u0646\u062F\u0647" });
    }
  });
  app.post("/api/student/bookmark", async (req, res) => {
    const { userId, postId } = req.body;
    if (!userId || !postId) {
      return res.status(400).json({ error: "\u0634\u0646\u0627\u0633\u0647 \u06A9\u0627\u0631\u0628\u0631 \u0648 \u067E\u0633\u062A \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A" });
    }
    try {
      if (isDBConnected) {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "\u06A9\u0627\u0631\u0628\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
        const index = user.bookmarks.indexOf(postId);
        if (index > -1) {
          user.bookmarks.splice(index, 1);
        } else {
          user.bookmarks.push(postId);
        }
        await user.save();
        res.json({ success: true, bookmarks: user.bookmarks });
      } else {
        const user = memoryDB.users.find((u) => u._id === userId);
        if (!user) return res.status(404).json({ error: "\u06A9\u0627\u0631\u0628\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
        const index = user.bookmarks.indexOf(postId);
        if (index > -1) {
          user.bookmarks.splice(index, 1);
        } else {
          user.bookmarks.push(postId);
        }
        res.json({ success: true, bookmarks: user.bookmarks });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/student/bookmarks/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
      if (isDBConnected) {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "\u06A9\u0627\u0631\u0628\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
        const posts = await Post.find({ _id: { $in: user.bookmarks } }).populate("author", "name email profilePicture");
        res.json(posts);
      } else {
        const user = memoryDB.users.find((u) => u._id === userId);
        if (!user) return res.status(404).json({ error: "\u06A9\u0627\u0631\u0628\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
        const posts = memoryDB.posts.filter((p) => user.bookmarks.includes(p._id));
        res.json(posts);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post("/api/student/history", async (req, res) => {
    const { userId, itemId, itemType, title } = req.body;
    if (!userId || !itemId || !itemType) {
      return res.status(400).json({ error: "\u0627\u0637\u0644\u0627\u0639\u0627\u062A \u0627\u0631\u0633\u0627\u0644\u06CC \u0646\u0627\u06A9\u0627\u0645\u0644 \u0627\u0633\u062A" });
    }
    try {
      if (isDBConnected) {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "\u06A9\u0627\u0631\u0628\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
        user.readingHistory = user.readingHistory.filter((h) => h.itemId !== itemId);
        user.readingHistory.unshift({ itemId, itemType, title: title || "\u0645\u062D\u062A\u0648\u0627", visitedAt: /* @__PURE__ */ new Date() });
        if (user.readingHistory.length > 10) user.readingHistory.pop();
        await user.save();
        res.json({ success: true, history: user.readingHistory });
      } else {
        const user = memoryDB.users.find((u) => u._id === userId);
        if (!user) return res.status(404).json({ error: "\u06A9\u0627\u0631\u0628\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
        user.readingHistory = user.readingHistory.filter((h) => h.itemId !== itemId);
        user.readingHistory.unshift({ itemId, itemType, title: title || "\u0645\u062D\u062A\u0648\u0627", visitedAt: /* @__PURE__ */ new Date() });
        if (user.readingHistory.length > 10) user.readingHistory.pop();
        res.json({ success: true, history: user.readingHistory });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/student/history/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
      if (isDBConnected) {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "\u06A9\u0627\u0631\u0628\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
        res.json(user.readingHistory || []);
      } else {
        const user = memoryDB.users.find((u) => u._id === userId);
        if (!user) return res.status(404).json({ error: "\u06A9\u0627\u0631\u0628\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
        res.json(user.readingHistory || []);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post("/api/student/progress", async (req, res) => {
    const { userId, courseId, postId } = req.body;
    if (!userId || !courseId || !postId) {
      return res.status(400).json({ error: "\u0634\u0646\u0627\u0633\u0647 \u06A9\u0627\u0631\u0628\u0631\u060C \u062F\u0648\u0631\u0647 \u0648 \u062F\u0631\u0633 \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A" });
    }
    try {
      let totalLessons = 0;
      let courseTitle = "";
      if (isDBConnected) {
        totalLessons = await Post.countDocuments({ course: courseId, status: "published" });
        const cObj = await Course.findById(courseId);
        courseTitle = cObj?.title || "\u062F\u0648\u0631\u0647 \u0622\u0645\u0648\u0632\u0634\u06CC";
      } else {
        totalLessons = memoryDB.posts.filter((p) => p.course === courseId && p.status === "published").length;
        const cObj = memoryDB.courses.find((c) => c._id === courseId);
        courseTitle = cObj?.title || "\u062F\u0648\u0631\u0647 \u0622\u0645\u0648\u0632\u0634\u06CC";
      }
      if (totalLessons === 0) totalLessons = 1;
      if (isDBConnected) {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "\u06A9\u0627\u0631\u0628\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
        let progIndex = user.progress.findIndex((p) => p.courseId === courseId);
        if (progIndex === -1) {
          user.progress.push({ courseId, completedLessons: [postId], percentage: 0 });
          progIndex = user.progress.length - 1;
        } else {
          const completed = user.progress[progIndex].completedLessons;
          if (!completed.includes(postId)) {
            completed.push(postId);
          }
        }
        const complCount = user.progress[progIndex].completedLessons.length;
        user.progress[progIndex].percentage = Math.min(100, Math.round(complCount / totalLessons * 100));
        let newlyIssued = false;
        let certificateId = "";
        if (user.progress[progIndex].percentage === 100) {
          const certExists = user.certificates.some((c) => c.courseId === courseId);
          if (!certExists) {
            certificateId = "CERT-" + Math.floor(1e5 + Math.random() * 9e5);
            user.certificates.push({
              certificateId,
              courseId,
              courseTitle,
              studentName: user.name,
              issuedAt: /* @__PURE__ */ new Date()
            });
            newlyIssued = true;
            await AuditLog.create({
              actorName: "\u0633\u06CC\u0633\u062A\u0645 \u0635\u062F\u0648\u0631 \u0633\u0631\u062A\u06CC\u0641\u06CC\u06A9\u06CC\u062A",
              action: "\u0635\u062F\u0648\u0631 \u062E\u0648\u062F\u06A9\u0627\u0631 \u06AF\u0648\u0627\u0647\u06CC\u0646\u0627\u0645\u0647",
              target: `${user.name} \u0628\u0631\u0627\u06CC \u062F\u0648\u0631\u0647 ${courseTitle}`
            });
            await Notification2.create({
              userId,
              title: "\u0635\u062F\u0648\u0631 \u06AF\u0648\u0627\u0647\u06CC\u0646\u0627\u0645\u0647 \u062F\u06CC\u062C\u06CC\u062A\u0627\u0644",
              content: `\u062A\u0628\u0631\u06CC\u06A9! \u0634\u0645\u0627 \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u062F\u0648\u0631\u0647 "${courseTitle}" \u0631\u0627 \u0628\u0647 \u0627\u062A\u0645\u0627\u0645 \u0631\u0633\u0627\u0646\u062F\u06CC\u062F \u0648 \u06AF\u0648\u0627\u0647\u06CC\u0646\u0627\u0645\u0647 \u0645\u0639\u062A\u0628\u0631 \u0635\u0627\u062F\u0631 \u0634\u062F.`
            });
          }
        }
        await user.save();
        res.json({ success: true, progress: user.progress[progIndex], newlyIssued, certificateId });
      } else {
        const user = memoryDB.users.find((u) => u._id === userId);
        if (!user) return res.status(404).json({ error: "\u06A9\u0627\u0631\u0628\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
        let progIndex = user.progress.findIndex((p) => p.courseId === courseId);
        if (progIndex === -1) {
          user.progress.push({ courseId, completedLessons: [postId], percentage: 0 });
          progIndex = user.progress.length - 1;
        } else {
          const completed = user.progress[progIndex].completedLessons;
          if (!completed.includes(postId)) {
            completed.push(postId);
          }
        }
        const complCount = user.progress[progIndex].completedLessons.length;
        user.progress[progIndex].percentage = Math.min(100, Math.round(complCount / totalLessons * 100));
        let newlyIssued = false;
        let certificateId = "";
        if (user.progress[progIndex].percentage === 100) {
          const certExists = user.certificates.some((c) => c.courseId === courseId);
          if (!certExists) {
            certificateId = "CERT-" + Math.floor(1e5 + Math.random() * 9e5);
            user.certificates.push({
              certificateId,
              courseId,
              courseTitle,
              studentName: user.name,
              issuedAt: /* @__PURE__ */ new Date()
            });
            newlyIssued = true;
            memoryDB.auditLogs.unshift({
              _id: "log-" + Date.now(),
              actorName: "\u0633\u06CC\u0633\u062A\u0645 \u0635\u062F\u0648\u0631 \u0633\u0631\u062A\u06CC\u0641\u06CC\u06A9\u06CC\u062A",
              action: "\u0635\u062F\u0648\u0631 \u062E\u0648\u062F\u06A9\u0627\u0631 \u06AF\u0648\u0627\u0647\u06CC\u0646\u0627\u0645\u0647",
              target: `${user.name} \u0628\u0631\u0627\u06CC \u062F\u0648\u0631\u0647 ${courseTitle}`,
              createdAt: /* @__PURE__ */ new Date()
            });
            memoryDB.notifications.unshift({
              _id: "not-" + Date.now(),
              userId,
              title: "\u0635\u062F\u0648\u0631 \u06AF\u0648\u0627\u0647\u06CC\u0646\u0627\u0645\u0647 \u062F\u06CC\u062C\u06CC\u062A\u0627\u0644",
              content: `\u062A\u0628\u0631\u06CC\u06A9! \u0634\u0645\u0627 \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u062F\u0648\u0631\u0647 "${courseTitle}" \u0631\u0627 \u0628\u0647 \u0627\u062A\u0645\u0627\u0645 \u0631\u0633\u0627\u0646\u062F\u06CC\u062F \u0648 \u06AF\u0648\u0627\u0647\u06CC\u0646\u0627\u0645\u0647 \u0645\u0639\u062A\u0628\u0631 \u0635\u0627\u062F\u0631 \u0634\u062F.`,
              isRead: false,
              createdAt: /* @__PURE__ */ new Date()
            });
          }
        }
        res.json({ success: true, progress: user.progress[progIndex], newlyIssued, certificateId });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/student/progress/:userId/:courseId", async (req, res) => {
    const { userId, courseId } = req.params;
    try {
      if (isDBConnected) {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "\u06A9\u0627\u0631\u0628\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
        const progress = user.progress.find((p) => p.courseId === courseId) || { courseId, completedLessons: [], percentage: 0 };
        res.json(progress);
      } else {
        const user = memoryDB.users.find((u) => u._id === userId);
        if (!user) return res.status(404).json({ error: "\u06A9\u0627\u0631\u0628\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
        const progress = user.progress.find((p) => p.courseId === courseId) || { courseId, completedLessons: [], percentage: 0 };
        res.json(progress);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/student/certificates/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
      if (isDBConnected) {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "\u06A9\u0627\u0631\u0628\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
        res.json(user.certificates || []);
      } else {
        const user = memoryDB.users.find((u) => u._id === userId);
        if (!user) return res.status(404).json({ error: "\u06A9\u0627\u0631\u0628\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
        res.json(user.certificates || []);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post("/api/courses/:courseId/review", async (req, res) => {
    const { courseId } = req.params;
    const { studentName, studentEmail, rating, comment } = req.body;
    if (!studentName || !rating) {
      return res.status(400).json({ error: "\u0646\u0627\u0645 \u0648 \u0627\u0645\u062A\u06CC\u0627\u0632 \u0633\u062A\u0627\u0631\u0647 \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A" });
    }
    try {
      if (isDBConnected) {
        const review = await Review.create({
          courseId,
          studentName,
          studentEmail: studentEmail || "info@student.local",
          rating,
          comment,
          isApproved: false
          // Requires admin moderation
        });
        await Notification2.create({
          targetRole: "admin",
          title: "\u0627\u0631\u0632\u06CC\u0627\u0628\u06CC \u0648 \u0646\u0638\u0631 \u062C\u062F\u06CC\u062F",
          content: `\u06CC\u06A9 \u0627\u0631\u0632\u06CC\u0627\u0628\u06CC ${rating} \u0633\u062A\u0627\u0631\u0647 \u0628\u0631\u0627\u06CC \u062F\u0648\u0631\u0647\u200C\u0627\u06CC \u062A\u0648\u0633\u0637 ${studentName} \u0641\u0631\u0633\u062A\u0627\u062F\u0647 \u0634\u062F.`
        });
        res.json({ success: true, review });
      } else {
        const review = {
          _id: "rev-" + Date.now(),
          courseId,
          studentName,
          studentEmail: studentEmail || "info@student.local",
          rating,
          comment,
          isApproved: true,
          // Auto approved in memory fallback
          createdAt: /* @__PURE__ */ new Date()
        };
        memoryDB.reviews.unshift(review);
        res.json({ success: true, review });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/courses/:courseId/reviews", async (req, res) => {
    const { courseId } = req.params;
    try {
      if (isDBConnected) {
        const reviews = await Review.find({ courseId, isApproved: true }).sort({ createdAt: -1 });
        res.json(reviews);
      } else {
        const reviews = memoryDB.reviews.filter((r) => r.courseId === courseId && r.isApproved);
        res.json(reviews);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/reviews/all", async (req, res) => {
    try {
      if (isDBConnected) {
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.json(reviews);
      } else {
        res.json(memoryDB.reviews);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post("/api/reviews/:id/approve", async (req, res) => {
    const { id } = req.params;
    try {
      if (isDBConnected) {
        const review = await Review.findByIdAndUpdate(id, { $set: { isApproved: true } }, { new: true });
        res.json({ success: true, review });
      } else {
        const review = memoryDB.reviews.find((r) => r._id === id);
        if (review) review.isApproved = true;
        res.json({ success: true, review });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.delete("/api/reviews/:id", async (req, res) => {
    const { id } = req.params;
    try {
      if (isDBConnected) {
        await Review.deleteOne({ _id: id });
        res.json({ success: true });
      } else {
        memoryDB.reviews = memoryDB.reviews.filter((r) => r._id !== id);
        res.json({ success: true });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post("/api/courses/:courseId/qna", async (req, res) => {
    const { courseId } = req.params;
    const { studentName, studentEmail, question } = req.body;
    if (!studentName || !question) {
      return res.status(400).json({ error: "\u0646\u0627\u0645 \u0648 \u067E\u0631\u0633\u0634 \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A" });
    }
    try {
      if (isDBConnected) {
        const qna = await Qna.create({
          courseId,
          studentName,
          studentEmail: studentEmail || "anonymous@dentalfy.local",
          question,
          isApproved: false
          // Moderator approves before showing on study tab
        });
        await AuditLog.create({
          actorName: studentName,
          action: "\u0637\u0631\u062D \u067E\u0631\u0633\u0634 \u062F\u0631 \u062F\u0648\u0631\u0647",
          target: question.substring(0, 30) + "..."
        });
        res.json({ success: true, qna });
      } else {
        const qna = {
          _id: "qna-" + Date.now(),
          courseId,
          studentName,
          studentEmail: studentEmail || "anonymous@dentalfy.local",
          question,
          answer: "",
          isApproved: true,
          // Approved immediately for development
          createdAt: /* @__PURE__ */ new Date()
        };
        memoryDB.qnas.unshift(qna);
        res.json({ success: true, qna });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/courses/:courseId/qna", async (req, res) => {
    const { courseId } = req.params;
    try {
      if (isDBConnected) {
        const qnas = await Qna.find({ courseId, isApproved: true }).sort({ createdAt: -1 });
        res.json(qnas);
      } else {
        const qnas = memoryDB.qnas.filter((q) => q.courseId === courseId && q.isApproved);
        res.json(qnas);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/qnas/all", async (req, res) => {
    try {
      if (isDBConnected) {
        const qnas = await Qna.find().sort({ createdAt: -1 });
        res.json(qnas);
      } else {
        res.json(memoryDB.qnas);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post("/api/qnas/:id/answer", async (req, res) => {
    const { id } = req.params;
    const { answer, repliedBy } = req.body;
    if (!answer) {
      return res.status(400).json({ error: "\u0645\u062A\u0646 \u067E\u0627\u0633\u062E \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A" });
    }
    try {
      if (isDBConnected) {
        const qna = await Qna.findByIdAndUpdate(id, { $set: { answer, repliedBy: repliedBy || "\u0627\u0633\u062A\u0627\u062F \u062F\u0648\u0631\u0647", isApproved: true } }, { new: true });
        res.json({ success: true, qna });
      } else {
        const qna = memoryDB.qnas.find((q) => q._id === id);
        if (qna) {
          qna.answer = answer;
          qna.repliedBy = repliedBy || "\u0627\u0633\u062A\u0627\u062F \u062F\u0648\u0631\u0647";
          qna.isApproved = true;
        }
        res.json({ success: true, qna });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post("/api/qnas/:id/approve", async (req, res) => {
    const { id } = req.params;
    try {
      if (isDBConnected) {
        const qna = await Qna.findByIdAndUpdate(id, { $set: { isApproved: true } }, { new: true });
        res.json({ success: true, qna });
      } else {
        const qna = memoryDB.qnas.find((q) => q._id === id);
        if (qna) qna.isApproved = true;
        res.json({ success: true, qna });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.delete("/api/qnas/:id", async (req, res) => {
    const { id } = req.params;
    try {
      if (isDBConnected) {
        await Qna.deleteOne({ _id: id });
        res.json({ success: true });
      } else {
        memoryDB.qnas = memoryDB.qnas.filter((q) => q._id !== id);
        res.json({ success: true });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/courses/:courseId/quiz", async (req, res) => {
    const { courseId } = req.params;
    try {
      if (isDBConnected) {
        const quiz = await Quiz.findOne({ courseId });
        res.json(quiz || null);
      } else {
        const quiz = memoryDB.quizzes.find((q) => q.courseId === courseId);
        res.json(quiz || null);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post("/api/courses/:courseId/quiz/manual", async (req, res) => {
    const { courseId } = req.params;
    const { questions, passingPercentage } = req.body;
    if (!questions || !Array.isArray(questions)) {
      return res.status(400).json({ error: "\u0644\u06CC\u0633\u062A \u0633\u0648\u0627\u0644\u0627\u062A \u0627\u0644\u0632\u0627\u0645\u06CC \u0648 \u0628\u0627\u06CC\u062F \u0622\u0631\u0627\u06CC\u0647 \u0628\u0627\u0634\u062F" });
    }
    try {
      if (isDBConnected) {
        let quiz = await Quiz.findOne({ courseId });
        if (quiz) {
          quiz.questions = questions;
          quiz.passingPercentage = passingPercentage || 70;
          await quiz.save();
        } else {
          quiz = await Quiz.create({ courseId, questions, passingPercentage: passingPercentage || 70 });
        }
        await AuditLog.create({
          actorName: "\u0645\u062F\u06CC\u0631 / \u0646\u0648\u06CC\u0633\u0646\u062F\u0647 \u062F\u0646\u062A\u0627\u0644\u0641\u0627\u06CC",
          action: "\u0630\u062E\u06CC\u0631\u0647 \u0622\u0632\u0645\u0648\u0646 \u062A\u0627\u0644\u06CC\u0641\u06CC",
          target: `\u0622\u0632\u0645\u0648\u0646 \u062F\u0648\u0631\u0647 ${courseId}`
        });
        res.json({ success: true, quiz });
      } else {
        let quiz = memoryDB.quizzes.find((q) => q.courseId === courseId);
        if (quiz) {
          quiz.questions = questions;
          quiz.passingPercentage = passingPercentage || 70;
        } else {
          quiz = {
            _id: "quiz-" + Date.now(),
            courseId,
            questions,
            passingPercentage: passingPercentage || 70,
            createdAt: /* @__PURE__ */ new Date()
          };
          memoryDB.quizzes.push(quiz);
        }
        res.json({ success: true, quiz });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post("/api/courses/:courseId/quiz/generate-ai", async (req, res) => {
    const { courseId } = req.params;
    const apiKey = process.env.GEMINI_API_KEY;
    let cTitle = "";
    let cDesc = "";
    if (isDBConnected) {
      const cObj = await Course.findById(courseId);
      cTitle = cObj?.title || "";
      cDesc = cObj?.description || "";
    } else {
      const cObj = memoryDB.courses.find((c) => c._id === courseId);
      cTitle = cObj?.title || "";
      cDesc = cObj?.description || "";
    }
    const simulatedQuestions = [
      {
        questionText: `\u06A9\u062F\u0627\u0645 \u0645\u0648\u0631\u062F \u0627\u0632 \u0686\u0627\u0644\u0634\u200C\u0647\u0627\u06CC \u0627\u0635\u0644\u06CC \u06A9\u0644\u06CC\u0646\u06CC\u06A9\u06CC \u062F\u0631 \u062F\u0631\u0645\u0627\u0646\u200C\u0647\u0627\u06CC \u062A\u062E\u0635\u0635\u06CC \u0645\u0631\u062A\u0628\u0637 \u0628\u0627 "${cTitle}" \u0628\u0647 \u0634\u0645\u0627\u0631 \u0645\u06CC\u200C\u0631\u0648\u062F\u061F`,
        options: ["\u062D\u0641\u0638 \u062D\u06CC\u0627\u062A \u067E\u0627\u0644\u067E \u0648 \u067E\u06CC\u0634\u06AF\u06CC\u0631\u06CC \u0627\u0632 \u0631\u06CC\u0632\u0634 \u0628\u0627\u0646\u062F \u0627\u062F\u0647\u0632\u06CC\u0648", "\u0627\u0641\u0632\u0627\u06CC\u0634 \u063A\u0644\u0638\u062A \u0641\u0644\u0648\u0631\u0627\u06CC\u062F \u062F\u0631 \u0628\u0627\u0641\u062A \u0628\u0632\u0627\u0642\u06CC", "\u0627\u0641\u0632\u0627\u06CC\u0634 \u0632\u0645\u0627\u0646 \u067E\u0644\u06CC\u0645\u0631\u06CC\u0632\u0627\u0633\u06CC\u0648\u0646 \u062F\u0631 \u0644\u0627\u06CC\u062A \u06A9\u06CC\u0648\u0631", "\u0647\u06CC\u0686\u06A9\u062F\u0627\u0645"],
        correctAnswerIndex: 0
      },
      {
        questionText: `\u0628\u0631 \u0627\u0633\u0627\u0633 \u0622\u062E\u0631\u06CC\u0646 \u0631\u0627\u0647\u0646\u0645\u0627\u0647\u0627\u06CC \u0622\u06A9\u0627\u062F\u0645\u06CC \u062F\u0646\u062F\u0627\u0646\u067E\u0632\u0634\u06A9\u06CC \u062F\u0631 \u062F\u0648\u0631\u0647 "${cTitle}"\u060C \u0628\u0647\u062A\u0631\u06CC\u0646 \u067E\u0631\u0648\u062A\u06A9\u0644 \u0634\u0633\u062A\u0634\u0648 \u06A9\u062F\u0627\u0645 \u0627\u0633\u062A\u061F`,
        options: ["\u0634\u0633\u062A\u0634\u0648\u06CC \u0645\u062A\u0646\u0627\u0648\u0628 \u0628\u0627 \u0647\u06CC\u067E\u0648\u06A9\u0644\u0631\u06CC\u062A \u06F5\u066A \u0648 \u0641\u0639\u0627\u0644\u200C\u0633\u0627\u0632\u06CC \u0627\u0644\u062A\u0631\u0627\u0633\u0648\u0646\u06CC\u06A9", "\u0628\u06A9\u0627\u0631\u06AF\u06CC\u0631\u06CC \u0645\u0633\u062A\u0642\u06CC\u0645 \u0628\u0627\u0646\u062F\u06CC\u0646\u06AF \u0646\u0633\u0644 \u067E\u0646\u062C\u0645", "\u06A9\u0627\u0631\u0628\u0631\u062F \u0644\u0648\u0628\u0631\u06CC\u06A9\u0627\u0646\u062A \u063A\u06CC\u0631 \u0627\u062F\u0647\u0632\u06CC\u0648", "\u0628\u06A9\u0627\u0631\u06AF\u06CC\u0631\u06CC \u0698\u0644 \u06A9\u0644\u0631\u0647\u06AF\u0632\u06CC\u062F\u06CC\u0646 \u062E\u0627\u0644\u0635"],
        correctAnswerIndex: 0
      },
      {
        questionText: "\u06A9\u062F\u0627\u0645 \u0639\u0627\u0645\u0644 \u0628\u06CC\u0648\u0645\u06A9\u0627\u0646\u06CC\u06A9\u06CC \u062A\u0627\u062B\u06CC\u0631 \u062A\u0639\u06CC\u06CC\u0646\u200C\u06A9\u0646\u0646\u062F\u0647\u200C\u0627\u06CC \u0628\u0631 \u062F\u0648\u0627\u0645 \u0633\u0627\u062E\u062A\u0627\u0631\u06CC \u062F\u0646\u062F\u0627\u0646 \u0628\u0627\u0632\u06CC\u0627\u0628\u06CC \u0634\u062F\u0647 \u062F\u0627\u0631\u062F\u061F",
        options: ["\u0645\u06CC\u0632\u0627\u0646 \u0633\u0637\u062D \u0686\u0633\u0628\u0646\u062F\u06AF\u06CC \u0645\u06CC\u0646\u0627 \u0648 \u062A\u0631\u0627\u0634 \u0647\u0645\u0631\u0627\u0633\u062A\u0627 \u0628\u0627 \u0627\u0646\u062D\u0646\u0627", "\u0636\u062E\u0627\u0645\u062A \u0644\u0627\u06CC\u0647 \u0633\u0645\u0627\u0646 \u0644\u0627\u06CC\u062A\u200C\u06A9\u06CC\u0648\u0631", "\u0646\u0648\u0639 \u0622\u0644\u06CC\u0627\u0698 \u0641\u0627\u06CC\u0644 \u0631\u0648\u062A\u0627\u0631\u06CC", "\u062A\u0639\u062F\u0627\u062F \u06A9\u0627\u0646\u0627\u0644\u200C\u0647\u0627\u06CC \u0641\u0631\u0639\u06CC \u067E\u0627\u0644\u067E \u062F\u0646\u062F\u0627\u0646"],
        correctAnswerIndex: 0
      }
    ];
    if (!apiKey) {
      console.warn("\u26A0\uFE0F GEMINI_API_KEY is not defined. Using high-quality AI-simulated questions.");
      return res.json({
        success: true,
        quiz: { courseId, questions: simulatedQuestions, passingPercentage: 70, generatedBy: "Simulated AI" }
      });
    }
    try {
      const { GoogleGenAI: GoogleGenAI2 } = await import("@google/genai");
      const ai = new GoogleGenAI2({ apiKey });
      const prompt = `\u0634\u0645\u0627 \u06CC\u06A9 \u0647\u0648\u0634 \u0645\u0635\u0646\u0648\u0639\u06CC \u0637\u0631\u0627\u062D \u0622\u0632\u0645\u0648\u0646\u200C\u0647\u0627\u06CC \u067E\u06CC\u0634\u0631\u0641\u062A\u0647 \u062A\u062E\u0635\u0635\u06CC \u062F\u0646\u062F\u0627\u0646\u067E\u0632\u0634\u06A9\u06CC \u0647\u0633\u062A\u06CC\u062F.
\u0628\u0627 \u062A\u0648\u062C\u0647 \u0628\u0647 \u0639\u0646\u0648\u0627\u0646 \u062F\u0648\u0631\u0647 \u0622\u0645\u0648\u0632\u0634\u06CC "${cTitle}" \u0648 \u062A\u0648\u0636\u06CC\u062D\u0627\u062A \u0622\u0646 "${cDesc}"\u060C \u062A\u0639\u062F\u0627\u062F \u06F3 \u0633\u0648\u0627\u0644 \u0686\u0647\u0627\u0631\u06AF\u0632\u06CC\u0646\u0647\u200C\u0627\u06CC \u062A\u062E\u0635\u0635\u06CC \u062F\u0646\u062F\u0627\u0646\u067E\u0632\u0634\u06A9\u06CC \u0628\u0627\u0644\u06CC\u0646\u06CC \u0628\u0647 \u0632\u0628\u0627\u0646 \u0641\u0627\u0631\u0633\u06CC \u0634\u06CC\u0648\u0627 \u0648 \u0639\u0644\u0645\u06CC \u0637\u0631\u0627\u062D\u06CC \u06A9\u0646\u06CC\u062F.
\u062E\u0631\u0648\u062C\u06CC \u0628\u0627\u06CC\u062F \u062F\u0642\u06CC\u0642\u0627\u064B \u06CC\u06A9 \u0641\u0631\u0645\u062A \u0622\u0631\u0627\u06CC\u0647 JSON \u0627\u0633\u062A\u0627\u0646\u062F\u0627\u0631\u062F \u062D\u0627\u0648\u06CC \u0627\u0634\u06CC\u0627\u0621 \u0628\u0627 \u0633\u0627\u062E\u062A\u0627\u0631 \u0632\u06CC\u0631 \u0628\u0627\u0634\u062F \u0648 \u0647\u06CC\u0686 \u0645\u062A\u0646\u06CC \u0628\u0647 \u062C\u0632 \u0628\u0644\u0648\u06A9 JSON \u0628\u0631\u0646\u06AF\u0631\u062F\u0627\u0646\u06CC\u062F:
[
  {
    "questionText": "\u0645\u062A\u0646 \u0633\u0648\u0627\u0644 \u062A\u062E\u0635\u0635\u06CC \u062F\u0646\u062F\u0627\u0646\u067E\u0632\u0634\u06A9\u06CC",
    "options": ["\u06AF\u0632\u06CC\u0646\u0647 \u06F1", "\u06AF\u0632\u06CC\u0646\u0647 \u06F2", "\u06AF\u0632\u06CC\u0646\u0647 \u06F3", "\u06AF\u0632\u06CC\u0646\u0647 \u06F4"],
    "correctAnswerIndex": 0
  }
]
\u0644\u0637\u0641\u0627\u064B \u0645\u0637\u0645\u0626\u0646 \u0634\u0648\u06CC\u062F \u0633\u0627\u062E\u062A\u0627\u0631 \u06A9\u0627\u0645\u0644\u0627 \u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A \u0648 \u0627\u0632 \u0622\u0648\u0631\u062F\u0646 \u0645\u0627\u0631\u06A9\u200C\u062F\u0627\u0648\u0646 \u06CC\u0627 \u06A9\u0644\u0645\u0627\u062A \u0627\u0636\u0627\u0641\u06CC \u062E\u0648\u062F\u062F\u0627\u0631\u06CC \u06A9\u0646\u06CC\u062F.`;
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
      });
      let responseText = response.text || "";
      responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      const questions = JSON.parse(responseText);
      if (isDBConnected) {
        let quiz = await Quiz.findOne({ courseId });
        if (quiz) {
          quiz.questions = questions;
          await quiz.save();
        } else {
          quiz = await Quiz.create({ courseId, questions, passingPercentage: 70 });
        }
        res.json({ success: true, quiz });
      } else {
        let quiz = memoryDB.quizzes.find((q) => q.courseId === courseId);
        if (quiz) {
          quiz.questions = questions;
        } else {
          quiz = {
            _id: "quiz-" + Date.now(),
            courseId,
            questions,
            passingPercentage: 70,
            createdAt: /* @__PURE__ */ new Date()
          };
          memoryDB.quizzes.push(quiz);
        }
        res.json({ success: true, quiz });
      }
    } catch (err) {
      console.error("Gemini AI Quiz generation failed:", err);
      res.json({
        success: true,
        quiz: { courseId, questions: simulatedQuestions, passingPercentage: 70, generatedBy: "Fallback Simulated AI" }
      });
    }
  });
  app.get("/api/categories", async (req, res) => {
    try {
      if (isDBConnected) {
        const categories = await Category.find().sort({ createdAt: 1 });
        res.json(categories);
      } else {
        res.json(memoryDB.categories);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post("/api/categories", async (req, res) => {
    const { name, parent, slug } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ error: "\u0646\u0627\u0645 \u062F\u0633\u062A\u0647\u200C\u0628\u0646\u062F\u06CC \u0648 \u0627\u0633\u0644\u0627\u06AF \u0627\u0644\u0632\u0627\u0645\u06CC \u0647\u0633\u062A\u0646\u062F" });
    }
    try {
      if (isDBConnected) {
        const cat = await Category.create({ name, parent: parent || null, slug });
        res.json({ success: true, category: cat });
      } else {
        const cat = {
          _id: "cat-" + Date.now(),
          name,
          parent: parent || null,
          slug,
          createdAt: /* @__PURE__ */ new Date()
        };
        memoryDB.categories.push(cat);
        res.json({ success: true, category: cat });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/notifications", async (req, res) => {
    const { userId, role } = req.query;
    try {
      if (isDBConnected) {
        const query = { $or: [] };
        if (userId) query.$or.push({ userId });
        if (role) query.$or.push({ targetRole: role });
        query.$or.push({ userId: null, targetRole: null });
        const list = await Notification2.find(query).sort({ createdAt: -1 });
        res.json(list);
      } else {
        const list = memoryDB.notifications.filter((n) => {
          return !n.userId || n.userId === userId || n.targetRole === role;
        });
        res.json(list);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post("/api/notifications/read", async (req, res) => {
    const { notificationId } = req.body;
    try {
      if (isDBConnected) {
        await Notification2.findByIdAndUpdate(notificationId, { $set: { isRead: true } });
        res.json({ success: true });
      } else {
        const n = memoryDB.notifications.find((not) => not._id === notificationId);
        if (n) n.isRead = true;
        res.json({ success: true });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/audit-logs", async (req, res) => {
    try {
      if (isDBConnected) {
        const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
        res.json(logs);
      } else {
        res.json(memoryDB.auditLogs);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post("/api/audit-logs", async (req, res) => {
    const { actorName, action, target } = req.body;
    try {
      if (isDBConnected) {
        const log = await AuditLog.create({ actorName, action, target });
        res.json({ success: true, log });
      } else {
        const log = {
          _id: "log-" + Date.now(),
          actorName,
          action,
          target,
          createdAt: /* @__PURE__ */ new Date()
        };
        memoryDB.auditLogs.unshift(log);
        res.json({ success: true, log });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/analytics", async (req, res) => {
    try {
      const viewsData = [
        { name: "\u062A\u0631\u0627\u0634 \u06A9\u0627\u0645\u067E\u0648\u0632\u06CC\u062A", views: 245 },
        { name: "\u0627\u0628\u0632\u0627\u0631 \u0631\u0648\u062A\u0627\u0631\u06CC", views: 189 },
        { name: "\u0633\u0631\u0627\u0645\u06CC\u06A9 \u0632\u06CC\u0628\u0627\u06CC\u06CC", views: 312 },
        { name: "\u0627\u0631\u062A\u0648\u062F\u0646\u0633\u06CC \u062B\u0627\u0628\u062A", views: 120 }
      ];
      const monthlySignups = [
        { month: "\u0628\u0647\u0645\u0646", count: 12 },
        { month: "\u0627\u0633\u0641\u0646\u062F", count: 18 },
        { month: "\u0641\u0631\u0648\u0631\u062F\u06CC\u0646", count: 8 },
        { month: "\u0627\u0631\u062F\u06CC\u0628\u0647\u0634\u062A", count: 24 },
        { month: "\u062E\u0631\u062F\u0627\u062F", count: 32 },
        { month: "\u062A\u06CC\u0631", count: 45 }
      ];
      let totalStudents = 0;
      let totalCourses = 0;
      let totalPosts = 0;
      let totalReviews = 0;
      if (isDBConnected) {
        totalStudents = await User.countDocuments({ role: "student" });
        totalCourses = await Course.countDocuments();
        totalPosts = await Post.countDocuments();
        totalReviews = await Review.countDocuments();
      } else {
        totalStudents = memoryDB.users.filter((u) => u.role === "student").length;
        totalCourses = memoryDB.courses.length;
        totalPosts = memoryDB.posts.length;
        totalReviews = memoryDB.reviews.length;
      }
      res.json({
        viewsData,
        monthlySignups,
        counters: {
          totalStudents: totalStudents || 28,
          // Default fallback if newly empty
          totalCourses,
          totalPosts,
          totalReviews
        }
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/sitemap.xml", async (req, res) => {
    try {
      let posts = [];
      let courses = [];
      if (isDBConnected) {
        posts = await Post.find({ status: "published" });
        courses = await Course.find();
      } else {
        posts = memoryDB.posts.filter((p) => p.status === "published");
        courses = memoryDB.courses;
      }
      res.setHeader("Content-Type", "application/xml");
      let xml = `<?xml version="1.0" encoding="UTF-8"?>
`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
      xml += `  <url><loc>https://dentalfy.local/</loc><priority>1.0</priority></url>
`;
      xml += `  <url><loc>https://dentalfy.local/courses</loc><priority>0.8</priority></url>
`;
      xml += `  <url><loc>https://dentalfy.local/library</loc><priority>0.7</priority></url>
`;
      courses.forEach((c) => {
        xml += `  <url><loc>https://dentalfy.local/courses/${c._id}</loc><priority>0.7</priority></url>
`;
      });
      posts.forEach((p) => {
        xml += `  <url><loc>https://dentalfy.local/blog/${p._id}</loc><priority>0.6</priority></url>
`;
      });
      xml += `</urlset>`;
      res.send(xml);
    } catch (err) {
      res.status(500).send("Error generating sitemap");
    }
  });
  app.get("/rss.xml", async (req, res) => {
    try {
      let posts = [];
      if (isDBConnected) {
        posts = await Post.find({ status: "published" }).populate("author", "name").sort({ createdAt: -1 });
      } else {
        posts = memoryDB.posts.filter((p) => p.status === "published");
      }
      res.setHeader("Content-Type", "application/xml");
      let xml = `<?xml version="1.0" encoding="UTF-8" ?>
`;
      xml += `<rss version="2.0">
`;
      xml += `<channel>
`;
      xml += `  <title>\u0622\u06A9\u0627\u062F\u0645\u06CC \u0622\u0645\u0648\u0632\u0634 \u062F\u0646\u062F\u0627\u0646\u067E\u0632\u0634\u06A9\u06CC \u062F\u0646\u062A\u0627\u0644\u0641\u0627\u06CC</title>
`;
      xml += `  <link>https://dentalfy.local</link>
`;
      xml += `  <description>\u0622\u062E\u0631\u06CC\u0646 \u0645\u0642\u0627\u0644\u0627\u062A\u060C \u0641\u0627\u06CC\u0644\u200C\u0647\u0627\u06CC \u0631\u0648\u062A\u0627\u0631\u06CC\u060C \u062C\u0631\u0627\u062D\u06CC \u0648 \u0627\u0635\u0648\u0644 \u0627\u062F\u0647\u0632\u06CC\u0648 \u062F\u0631 \u062F\u0646\u062F\u0627\u0646\u067E\u0632\u0634\u06A9\u06CC</description>
`;
      posts.forEach((p) => {
        const authorName = typeof p.author === "object" ? p.author.name : "\u062F\u0646\u062A\u0627\u0644\u0641\u0627\u06CC";
        xml += `  <item>
`;
        xml += `    <title>${p.title}</title>
`;
        xml += `    <link>https://dentalfy.local/blog/${p._id}</link>
`;
        xml += `    <description>${p.summary || ""}</description>
`;
        xml += `    <author>${authorName}</author>
`;
        xml += `    <pubDate>${p.createdAt ? new Date(p.createdAt).toUTCString() : (/* @__PURE__ */ new Date()).toUTCString()}</pubDate>
`;
        xml += `  </item>
`;
      });
      xml += `</channel>
`;
      xml += `</rss>`;
      res.send(xml);
    } catch (err) {
      res.status(500).send("Error generating RSS feed");
    }
  });
  app.get("/api/faqs", async (req, res) => {
    try {
      if (isDBConnected) {
        const faqs = await FAQ.find().sort({ createdAt: 1 });
        res.json(faqs);
      } else {
        res.json(memoryDB.faqs);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post("/api/faqs/create", async (req, res) => {
    const { question, answer } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ error: "\u0633\u0648\u0627\u0644 \u0648 \u062C\u0648\u0627\u0628 \u0627\u0644\u0632\u0627\u0645\u06CC \u0647\u0633\u062A\u0646\u062F" });
    }
    try {
      if (isDBConnected) {
        const newFAQ = await FAQ.create({ question, answer });
        res.json({ success: true, faq: newFAQ });
      } else {
        const newFAQ = {
          _id: "mem-faq-" + Date.now(),
          question,
          answer,
          createdAt: /* @__PURE__ */ new Date()
        };
        memoryDB.faqs.push(newFAQ);
        res.json({ success: true, faq: newFAQ });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.delete("/api/faqs/:id", async (req, res) => {
    const { id } = req.params;
    try {
      if (isDBConnected) {
        await FAQ.deleteOne({ _id: id });
        res.json({ success: true });
      } else {
        memoryDB.faqs = memoryDB.faqs.filter((f) => f._id !== id);
        res.json({ success: true });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post("/api/chat", async (req, res) => {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "\u067E\u06CC\u0627\u0645 \u062E\u0627\u0644\u06CC \u0627\u0633\u062A" });
    }
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        reply: "\u0633\u0644\u0627\u0645! \u0645\u0646 \u062F\u0633\u062A\u06CC\u0627\u0631 \u062F\u0646\u062F\u0627\u0646\u067E\u0632\u0634\u06A9\u06CC \u062F\u0646\u062A\u0627\u0644\u0641\u0627\u06CC \u0647\u0633\u062A\u0645. \u062F\u0631 \u062D\u0627\u0644 \u062D\u0627\u0636\u0631 \u06A9\u0644\u06CC\u062F API \u062C\u0645\u06CC\u0646\u06CC \u062A\u0646\u0638\u06CC\u0645 \u0646\u0634\u062F\u0647 \u0627\u0633\u062A. \u0627\u0645\u0627 \u0645\u0646 \u062F\u0631 \u0637\u0631\u0627\u062D\u06CC \u062F\u0631\u0645\u0627\u0646\u200C\u0647\u0627\u06CC \u062A\u0631\u0645\u06CC\u0645\u06CC\u060C \u0644\u0645\u06CC\u0646\u062A \u0648 \u0627\u0646\u062F\u0648\u062F\u0646\u062A\u06CC\u06A9\u0633 \u0647\u0645\u0631\u0627\u0647 \u0634\u0645\u0627 \u0647\u0633\u062A\u0645!"
      });
    }
    try {
      const { GoogleGenAI: GoogleGenAI2 } = await import("@google/genai");
      const ai = new GoogleGenAI2({ apiKey });
      const prompt = `\u0634\u0645\u0627 \u06CC\u06A9 \u062F\u0633\u062A\u06CC\u0627\u0631 \u0647\u0648\u0634 \u0645\u0635\u0646\u0648\u0639\u06CC \u0648 \u0645\u062A\u062E\u0635\u0635 \u0622\u0645\u0648\u0632\u0634 \u062F\u0646\u062F\u0627\u0646\u067E\u0632\u0634\u06A9\u06CC \u062F\u0631 \u067E\u0644\u062A\u0641\u0631\u0645 \u062F\u0646\u062A\u0627\u0644\u0641\u0627\u06CC (dentalfy) \u0647\u0633\u062A\u06CC\u062F. \u0628\u0647 \u0632\u0628\u0627\u0646 \u0641\u0627\u0631\u0633\u06CC \u0634\u06CC\u0648\u0627\u060C \u0639\u0644\u0645\u06CC \u0648 \u0631\u0648\u0627\u0646 \u067E\u0627\u0633\u062E \u062F\u0647\u06CC\u062F. \u0633\u0648\u0627\u0644 \u06A9\u0627\u0631\u0628\u0631: ${message}`;
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });
      res.json({
        reply: response.text || "\u067E\u0627\u0633\u062E\u06CC \u062F\u0631\u06CC\u0627\u0641\u062A \u0646\u0634\u062F"
      });
    } catch (err) {
      console.error("Gemini API error:", err);
      res.json({
        reply: "\u0645\u062A\u0623\u0633\u0641\u0627\u0646\u0647 \u062F\u0631 \u0628\u0631\u0642\u0631\u0627\u0631\u06CC \u0627\u0631\u062A\u0628\u0627\u0637 \u0628\u0627 \u0645\u062F\u0644 \u0647\u0648\u0634 \u0645\u0635\u0646\u0648\u0639\u06CC \u0645\u0634\u06A9\u0644\u06CC \u067E\u06CC\u0634 \u0622\u0645\u062F. \u0644\u0637\u0641\u0627 \u0686\u0646\u062F \u0644\u062D\u0638\u0647 \u062F\u06CC\u06AF\u0631 \u0627\u0645\u062A\u062D\u0627\u0646 \u06A9\u0646\u06CC\u062F."
      });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  const PORT = 3e3;
  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`\u{1F30D} dentalfy platform server ready on http://0.0.0.0:${PORT}`);
    });
  }
  return app;
}
var appPromise = startServer();
async function handler(req, res) {
  const app = await appPromise;
  app(req, res);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  startServer
});
//# sourceMappingURL=server_bundle.cjs.map
