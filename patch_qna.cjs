const fs = require('fs');
let content = fs.readFileSync('src/components/StudentPanel.tsx', 'utf8');

const oldQna = `{/* Study QA Board */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4 shadow-sm">
                    <h3 className="font-bold text-xs text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                      <HelpCircle className="w-4.5 h-4.5 text-teal-600" />
                      تالار پرسش و پاسخ بالینی (Q&A)
                    </h3>
                    <form onSubmit={handleSubmitQna} className="space-y-2">
                      <input 
                        type="text" 
                        value={newQnaQuestion}
                        onChange={(e) => setNewQnaQuestion(e.target.value)}
                        placeholder="سوال بالینی خود را مطرح کنید..."
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-medium focus:outline-none focus:border-teal-500 transition-all"
                        required
                      />
                      <button 
                        type="submit"
                        disabled={submittingQna}
                        className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-95"
                      >
                        <Send className="w-3.5 h-3.5" /> ارسال پرسش تخصصی
                      </button>
                    </form>

                    <div className="max-h-60 overflow-y-auto space-y-3 pt-2">
                      {courseQnas.length === 0 ? (
                        <p className="text-[10px] text-slate-400 font-bold text-center">هنوز سوالی ثبت نشده است.</p>
                      ) : (
                        courseQnas.map((qna, idx) => (
                          <div key={idx} className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1.5 text-right">
                            <div className="flex items-center justify-between text-[8px] font-black text-slate-400">
                              <span>طراح: {qna.studentName}</span>
                              <span className="font-mono">۱۴۰۵</span>
                            </div>
                            <p className="text-[10px] text-slate-700 dark:text-slate-200 font-bold">؟ {qna.question}</p>
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
                  </div>`;

const newQna = `{/* Study QA Board - ENHANCED */}
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
                  </div>`;

if (content.includes('تالار پرسش و پاسخ بالینی (Q&A)')) {
  content = content.replace(oldQna, newQna);
  fs.writeFileSync('src/components/StudentPanel.tsx', content);
  console.log('patched');
} else {
  console.log('not found');
}
