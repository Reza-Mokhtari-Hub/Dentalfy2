const fs = require('fs');
let content = fs.readFileSync('src/components/StudentPanel.tsx', 'utf8');

const target = `                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : selectedCourse ? (`;

const replacement = `                    </div>
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
          ) : selectedCourse ? (`;

content = content.replace(target, replacement);

fs.writeFileSync('src/components/StudentPanel.tsx', content);
console.log('StudentPanel comments UI added');
