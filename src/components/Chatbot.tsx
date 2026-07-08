import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Bot, RefreshCw, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: "user" | "bot"; text: string }>>([
    { sender: "bot", text: "سلام! من دستیار هوشمند دنتالفای هستم. چطور می‌توانم در یادگیری مباحث دندانپزشکی یا استفاده از پلتفرم به شما کمک کنم؟" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleClearChat = () => {
    setMessages([
      { sender: "bot", text: "سلام! من دستیار هوشمند دنتالفای هستم. چطور می‌توانم در یادگیری مباحث دندانپزشکی یا استفاده از پلتفرم به شما کمک کنم؟" }
    ]);
    setShowClearConfirm(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply || "پاسخی دریافت نشد" }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "bot", text: "متأسفانه خطایی در اتصال به دستیار هوش مصنوعی رخ داد." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 font-sans" dir="rtl">
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-teal-600 hover:bg-teal-700 text-white rounded-full flex items-center justify-center shadow-lg shadow-teal-600/30 cursor-pointer transition-colors"
        id="chatbot-trigger"
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="absolute bottom-16 left-0 w-80 md:w-96 h-[480px] bg-white dark:bg-slate-800 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-teal-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 dark:bg-slate-800/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">مشاور هوشمند دنتالفای</h4>
                  <p className="text-[10px] text-teal-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> آنلاین • پشتیبانی علمی دندانپزشکی
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {showClearConfirm ? (
                  <div className="flex items-center gap-1 bg-teal-700/80 rounded-lg p-0.5 text-[9px] font-bold">
                    <span className="px-1 text-teal-100">حذف گفتگو؟</span>
                    <button
                      onClick={handleClearChat}
                      className="px-1.5 py-0.5 bg-rose-600 text-white rounded hover:bg-rose-700 transition-colors cursor-pointer"
                    >
                      بله
                    </button>
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="px-1.5 py-0.5 bg-teal-800 text-white rounded hover:bg-teal-950 transition-colors cursor-pointer"
                    >
                      خیر
                    </button>
                  </div>
                ) : (
                  messages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setShowClearConfirm(true)}
                      className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-teal-100 hover:text-white"
                      title="پاک کردن گفتگو"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white dark:bg-slate-800/10 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages list */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 dark:bg-slate-900/50">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                      msg.sender === "user"
                        ? "bg-teal-600 text-white rounded-br-none"
                        : "bg-white dark:bg-slate-800 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-none border border-slate-100 dark:border-slate-800"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-slate-800 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl rounded-bl-none p-3 shadow-sm flex items-center gap-2 text-slate-400 text-xs">
                    <RefreshCw className="w-4 h-4 animate-spin text-teal-600" />
                    درحال تحلیل پاسخ علمی...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 dark:bg-slate-800 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="سوال علمی یا بالینی خود را بپرسید..."
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-teal-500 text-slate-800 dark:text-slate-100"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl disabled:opacity-50 transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
