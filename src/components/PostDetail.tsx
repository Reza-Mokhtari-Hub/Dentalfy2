import React, { useState, useEffect } from "react";
import { ArrowRight, Calendar, BookOpen, Quote, Download, FileText, Play, MessageSquare, Send, CornerDownLeft, HelpCircle, CheckCircle2, XCircle } from "lucide-react";
import { IPost, IComment } from "../types";
import { ClinicalHtmlRenderer } from "./ClinicalHtmlRenderer";

function InteractivePostQuiz({ quizVal }: { quizVal: any; key?: string }) {
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const question = quizVal?.question || quizVal?.questionText || "سوال خودآزمایی بالینی";
  const options = Array.isArray(quizVal?.options) ? quizVal.options : ["گزینه ۱", "گزینه ۲", "گزینه ۳", "گزینه ۴"];
  const correctIdx = typeof quizVal?.correctAnswer === "number" ? quizVal.correctAnswer : (typeof quizVal?.correctAnswerIndex === "number" ? quizVal.correctAnswerIndex : 0);
  const explanation = quizVal?.explanation || "";

  return (
    <div className="my-6 p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl space-y-4" dir="rtl">
      <div className="flex items-center gap-2 text-teal-400 text-xs font-black">
        <HelpCircle className="w-4 h-4 text-teal-400" />
        خودآزمایی بالینی مقاله (تست یادگیری)
      </div>
      <h4 className="text-xs md:text-sm font-extrabold text-slate-100 leading-relaxed">
        {question}
      </h4>
      <div className="space-y-2">
        {options.map((opt: string, idx: number) => {
          let btnStyle = "bg-slate-800/80 border-slate-700/80 text-slate-200 hover:bg-slate-800";
          if (submitted) {
            if (idx === correctIdx) {
              btnStyle = "bg-emerald-950/80 border-emerald-500/80 text-emerald-200 font-bold";
            } else if (idx === selectedOpt) {
              btnStyle = "bg-rose-950/80 border-rose-500/80 text-rose-200";
            } else {
              btnStyle = "bg-slate-800/40 border-slate-800 text-slate-500 opacity-60";
            }
          } else if (selectedOpt === idx) {
            btnStyle = "bg-teal-900/60 border-teal-500 text-teal-200 font-bold";
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={submitted}
              onClick={() => setSelectedOpt(idx)}
              className={`w-full p-3 rounded-xl border text-xs text-right transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
            >
              <span>{opt}</span>
              <span className="w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center font-mono text-[10px] shrink-0 mr-2">
                {idx + 1}
              </span>
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <button
          type="button"
          disabled={selectedOpt === null}
          onClick={() => setSubmitted(true)}
          className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white text-xs font-black rounded-xl transition-all shadow-md shadow-teal-600/20 cursor-pointer"
        >
          ثبت و بررسی پاسخ
        </button>
      ) : (
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${selectedOpt === correctIdx ? "bg-emerald-900/30 text-emerald-300 border border-emerald-500/30" : "bg-rose-900/30 text-rose-300 border border-rose-500/30"}`}>
            {selectedOpt === correctIdx ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                پاسخ شما کاملاً صحیح است!
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-rose-400" />
                پاسخ نادرست است. گزینه {correctIdx + 1} صحیح می‌باشد.
              </>
            )}
          </div>
          {explanation && (
            <p className="text-[11px] text-slate-300 bg-slate-800/50 p-3 rounded-xl leading-relaxed">
              💡 <span className="font-bold text-teal-400">تحلیل علمی:</span> {explanation}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

interface PostDetailProps {
  post: IPost;
  onBack: () => void;
}

export function PostDetail({ post, onBack }: PostDetailProps) {
  const authorName = typeof post.author === "object" ? post.author?.name : "نویسنده آکادمی";
  const authorPic = typeof post.author === "object" ? post.author?.profilePicture : "";
  const authorEmail = typeof post.author === "object" ? post.author?.email : "";
  const courseTitle = post.course?.title || "سایر مباحث دندانپزشکی";

  const [comments, setComments] = useState<IComment[]>([]);
  const [commentName, setCommentName] = useState("");
  const [commentEmail, setCommentEmail] = useState("");
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/posts/${post._id}/comments`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setComments(data);
      })
      .catch(err => console.error(err));
  }, [post._id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName || !commentEmail || !commentText) return;
    setIsSubmitting(true);
    setSubmitMsg(null);

    try {
      const res = await fetch(`/api/posts/${post._id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: commentName, email: commentEmail, text: commentText, role: "public" })
      });
      const data = await res.json();
      if (res.ok) {
        setComments(prev => [data.comment, ...prev]);
        setCommentText("");
        setSubmitMsg("پرسش / نظر شما با موفقیت ثبت شد.");
      } else {
        setSubmitMsg("ثبت نظر ناموفق بود.");
      }
    } catch (err) {
      setSubmitMsg("خطا در اتصال به سرور.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans py-8 px-4" dir="rtl">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Back Button & Navigation */}
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-teal-700 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" /> بازگشت به صفحه اصلی
        </button>

        {/* Article Container */}
        <article className="bg-white dark:bg-slate-800 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
          {/* Cover & Category Banner */}
          <div className="bg-gradient-to-l from-teal-50 to-sky-50 px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-xs font-bold text-teal-700 bg-teal-100/60 px-3 py-1.5 rounded-lg self-start">
              {courseTitle}
            </span>
            <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(post.createdAt || "").toLocaleDateString("fa-IR")}
              </span>
            </div>
          </div>

          <div className="p-8 md:p-12 space-y-8">
            {/* Header / Title */}
            <h1 className="text-2xl md:text-4xl font-black text-slate-800 dark:text-slate-100 leading-snug">
              {post.title}
            </h1>

            {/* Author details card */}
            <div className="flex items-center gap-3.5 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-teal-500 bg-slate-200 shadow-sm">
                <img 
                  src={authorPic || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150"} 
                  alt={authorName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-700 dark:text-slate-200">{authorName}</h4>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{authorEmail || "نویسنده تأیید شده علمی دنتالفای"}</p>
              </div>
            </div>

            {/* Content block-by-block renderer */}
            <div className="space-y-6 text-slate-700 dark:text-slate-200 text-sm md:text-base leading-relaxed">
              {post.content && post.content.map((block) => {
                switch (block.type) {
                  case "heading": {
                    const hVal = block.value && typeof block.value === "object" ? block.value : { text: block.value || "", level: "h2" };
                    if (hVal.level === "h3") {
                      return (
                        <h4 key={block.id} className="text-base md:text-lg font-black text-slate-800 dark:text-slate-100 pt-3 border-r-4 border-emerald-500 pr-2.5">
                          {hVal.text}
                        </h4>
                      );
                    }
                    return (
                      <h3 key={block.id} className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 pt-4 border-r-4 border-teal-500 pr-3">
                        {hVal.text}
                      </h3>
                    );
                  }

                  case "text": {
                    const tText = typeof block.value === "object" ? (block.value?.text || "") : (block.value || "");
                    return (
                      <p key={block.id} className="whitespace-pre-line text-slate-600 dark:text-slate-300 font-normal leading-loose">
                        {tText}
                      </p>
                    );
                  }

                  case "quote": {
                    const qVal = block.value && typeof block.value === "object" ? block.value : { text: block.value || "", author: "دنتالفای" };
                    return (
                      <div key={block.id} className="p-5 bg-teal-50/50 border-r-4 border-teal-600 rounded-xl my-4 text-teal-800 font-medium italic flex flex-col gap-2">
                        <div className="flex gap-3">
                          <Quote className="w-6 h-6 text-teal-600 shrink-0" />
                          <p className="text-xs md:text-sm leading-relaxed">{qVal.text}</p>
                        </div>
                        {qVal.author && (
                          <span className="text-[10px] font-bold text-teal-600/70 mr-9">— {qVal.author}</span>
                        )}
                      </div>
                    );
                  }

                  case "list": {
                    const lVal = block.value && typeof block.value === "object" && !Array.isArray(block.value) ? block.value : { items: Array.isArray(block.value) ? block.value : [""], listType: "bullet" };
                    return (
                      <div key={block.id} className="my-4 pr-4">
                        {lVal.listType === "ordered" ? (
                          <ol className="space-y-2.5 list-decimal text-slate-600 dark:text-slate-300 pr-5 text-xs md:text-sm">
                            {lVal.items.map((item: string, idx: number) => (
                              <li key={idx} className="leading-relaxed font-semibold">
                                <span>{item}</span>
                              </li>
                            ))}
                          </ol>
                        ) : (
                          <ul className="space-y-2.5">
                            {lVal.items.map((item: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-300 text-xs md:text-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 shrink-0"></span>
                                <span className="leading-relaxed font-semibold">{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  }

                  case "image": {
                    const iVal = block.value && typeof block.value === "object" ? block.value : { url: block.value || "", caption: "" };
                    return (
                      <div key={block.id} className="my-6 space-y-2 text-center">
                        <div className="rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-md max-h-[400px] bg-slate-100 flex items-center justify-center">
                          <img 
                            src={iVal.url} 
                            alt={iVal.caption || "تصویر ضمیمه درمان دندان"} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">{iVal.caption || "تصویر ثبت شده توسط پزشک معالج"}</span>
                      </div>
                    );
                  }

                  case "video": {
                    const vVal = block.value && typeof block.value === "object" ? block.value : { url: block.value || "", caption: "" };
                    const isEmbed = vVal.url && (vVal.url.includes("youtube.com") || vVal.url.includes("aparat.com") || vVal.url.includes("embed"));
                    return (
                      <div key={block.id} className="my-6 space-y-2">
                        <div className="rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-md bg-slate-950 aspect-video relative">
                          {isEmbed ? (
                            <iframe
                              src={vVal.url}
                              className="w-full h-full"
                              allowFullScreen
                              title="ویدیو آموزشی"
                            />
                          ) : (
                            <video 
                              src={vVal.url} 
                              controls 
                              className="w-full h-full"
                            />
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium text-center block">{vVal.caption || "ویدیو شبیه‌سازی بالینی و متدولوژی جراحی"}</span>
                      </div>
                    );
                  }

                  case "pdf": {
                    const pVal = block.value && typeof block.value === "object" ? block.value : { url: block.value || "", name: "فایل راهنمای بالینی دندانپزشکی" };
                    return (
                      <div key={block.id} className="my-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <h5 className="font-bold text-xs text-slate-700 dark:text-slate-200">{pVal.name || "سند پی‌دی‌اف مرجع"}</h5>
                            <p className="text-[9px] text-slate-400 font-mono">پیوست علمی پست دنتالفای</p>
                          </div>
                        </div>
                        <a 
                          href={pVal.url} 
                          download={`${pVal.name || "dentalfy"}.pdf`}
                          onClick={(e) => {
                            if (pVal.url.startsWith("data:") || pVal.url.startsWith("blob:") || pVal.url.startsWith("http")) {
                              return;
                            }
                            e.preventDefault();
                          }}
                          className="px-4 py-2 bg-white dark:bg-slate-800 dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="w-4.5 h-4.5" /> دانلود پیوست
                        </a>
                      </div>
                    );
                  }

                  case "divider":
                    return (
                      <div key={block.id} className="py-6 flex items-center justify-center">
                        <div className="w-full border-t border-dashed border-slate-200 dark:border-slate-700"></div>
                        <span className="px-4 text-[9px] font-bold text-slate-300 uppercase tracking-wider">جداکننده مباحث</span>
                        <div className="w-full border-t border-dashed border-slate-200 dark:border-slate-700"></div>
                      </div>
                    );

                  case "html": {
                    const hCode = typeof block.value === "object" ? (block.value?.code || block.value?.text || "") : (block.value || "");
                    return (
                      <ClinicalHtmlRenderer 
                        key={block.id} 
                        htmlCode={hCode} 
                      />
                    );
                  }

                  case "quiz": {
                    return (
                      <InteractivePostQuiz key={block.id} quizVal={block.value} />
                    );
                  }

                  default:
                    return null;
                }
              })}
            </div>
          </div>
        </article>

        {/* Syllabus / Course Syllabus recommendation */}
        {post.course && typeof post.course === "object" && post.course.syllabus && (
          <div className="bg-white dark:bg-slate-800 dark:bg-slate-800 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-lg space-y-4">
            <h3 className="font-black text-slate-800 dark:text-slate-100 text-base flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-600" />
              سرفصل علمی این درس ({post.course.title})
            </h3>
            <p className="text-slate-400 text-xs">{post.course.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {post.course.syllabus.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <span className="w-5 h-5 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-mono font-bold text-[10px]">
                    {idx + 1}
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="bg-white dark:bg-slate-800 dark:bg-slate-800 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-lg space-y-6">
          <h3 className="font-black text-slate-800 dark:text-slate-100 text-base flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-teal-600" />
            پرسش‌ها و نظرات بالینی دندانپزشکی ({comments.length})
          </h3>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500">نام و نام خانوادگی</label>
                <input 
                  type="text" 
                  value={commentName} 
                  onChange={(e) => setCommentName(e.target.value)} 
                  placeholder="مثال: دکتر سارا احمدی" 
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-teal-500"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500">آدرس ایمیل</label>
                <input 
                  type="email" 
                  value={commentEmail} 
                  onChange={(e) => setCommentEmail(e.target.value)} 
                  placeholder="name@example.com" 
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-left focus:outline-none focus:border-teal-500 font-mono"
                  dir="ltr"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500">متن پرسش یا دیدگاه بالینی شما</label>
              <textarea 
                value={commentText} 
                onChange={(e) => setCommentText(e.target.value)} 
                placeholder="سوال، بازخورد یا ابهام بالینی خود درباره این مقاله را بنویسید..." 
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-teal-500 h-24 resize-none"
                required
              />
            </div>

            {submitMsg && (
              <p className="p-3 bg-teal-50 border border-teal-100 text-teal-700 rounded-xl text-xs font-semibold text-center">
                {submitMsg}
              </p>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-teal-600/10"
            >
              <Send className="w-4 h-4" /> 
              {isSubmitting ? "در حال ارسال..." : "ثبت و ارسال پرسش علمی"}
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            {comments.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-4 font-semibold">تاکنون پرسشی برای این مقاله مطرح نشده است. اولین نفری باشید که سوال می‌پرسد!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-extrabold text-xs">
                        {comment.name[0]}
                      </div>
                      <div>
                        <h5 className="font-extrabold text-xs text-slate-700 dark:text-slate-200">{comment.name}</h5>
                        <span className="text-[9px] text-slate-400 font-mono">{new Date(comment.createdAt).toLocaleDateString("fa-IR")}</span>
                      </div>
                    </div>
                    {comment.role !== "public" && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-teal-100 text-teal-700">
                        {comment.role === "admin" ? "مدیر علمی RMO" : "نویسنده مقاله"}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 pr-10 leading-relaxed whitespace-pre-line">{comment.text}</p>

                  {/* Replied Thread */}
                  {comment.reply && (
                    <div className="mt-2 mr-6 p-3 bg-teal-50/40 border border-teal-100/30 rounded-xl space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-teal-800">
                        <CornerDownLeft className="w-3.5 h-3.5" />
                        <span>پاسخ از {comment.repliedBy || "مدیر علمی آکادمی"}:</span>
                      </div>
                      <p className="text-xs text-teal-900/80 pr-5 leading-relaxed">{comment.reply}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
