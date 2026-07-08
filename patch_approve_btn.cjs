const fs = require('fs');
let content = fs.readFileSync('src/components/PanelDashboard.tsx', 'utf8');

const target = `                            {linkedPost && (
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 dark:text-slate-300">
                                مربوط به مقاله: {linkedPost.title}
                              </span>
                            )}
                            <button 
                              onClick={() => handleCommentDelete(comment._id)}`;

const replacement = `                            {linkedPost && (
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
                                <Check className="w-4 h-4" />
                                <span className="text-[10px] font-bold">تایید</span>
                              </button>
                            )}
                            <button 
                              onClick={() => handleCommentDelete(comment._id)}`;

content = content.replace(target, replacement);

const targetBadge = `                            <span className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 font-extrabold text-xs flex items-center justify-center shadow-sm">
                              {comment.name[0]}
                            </span>
                            <div>`;

const replacementBadge = `                            <div className="relative">
                              <span className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 font-extrabold text-xs flex items-center justify-center shadow-sm">
                                {comment.name[0]}
                              </span>
                              {!comment.isApproved && (
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 border-2 border-white dark:border-slate-800 rounded-full animate-pulse"></span>
                              )}
                            </div>
                            <div>`;

content = content.replace(targetBadge, replacementBadge);

fs.writeFileSync('src/components/PanelDashboard.tsx', content);
console.log('approve btn patched');
