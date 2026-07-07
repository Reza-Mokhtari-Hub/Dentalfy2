import re

with open('src/components/PublicHome.tsx', 'r') as f:
    content = f.read()

faculty_and_testimonials = '''      {/* Faculty Members */}
      <section className="py-20 sm:py-24 bg-white dark:bg-slate-800 border-t border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">اساتید و هیئت علمی دنتالفای</h2>
            <p className="text-slate-500 dark:text-slate-400 text-base">برجسته‌ترین اساتید دانشگاهی و متخصصین کشوری که در تولید محتوای علمی و بالینی دنتالفای مشارکت دارند.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "دکتر رضا احمدی", role: "متخصص جراحی فک و صورت", img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400&h=400" },
              { name: "دکتر سارا حسینی", role: "متخصص درمان ریشه", img: "https://images.unsplash.com/photo-1594824436951-7f12bc415175?auto=format&fit=crop&q=80&w=400&h=400" },
              { name: "دکتر علی کریمی", role: "متخصص پروتزهای دندانی", img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400&h=400" },
              { name: "دکتر مریم رضایی", role: "متخصص ارتودنسی", img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400&h=400" },
            ].map((prof, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-6 text-center border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:-translate-y-2 transition-all cursor-default group">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <img src={prof.img} alt={prof.name} className="w-full h-full object-cover rounded-2xl group-hover:rotate-3 transition-transform duration-300" />
                  <div className="absolute -bottom-2 -right-2 bg-teal-500 text-white p-1.5 rounded-lg shadow-sm">
                    <Award className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">{prof.name}</h3>
                <p className="text-xs font-bold text-teal-600 dark:text-teal-400">{prof.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 sm:py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-200/50 dark:border-slate-800/50 relative overflow-hidden">
        {/* Decor */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">نظرات دانشجویان و دندانپزشکان</h2>
            <p className="text-slate-500 dark:text-slate-400 text-base">بازخورد همکاران و دانشجویانی که از مقالات و آموزش‌های بالینی دنتالفای استفاده کرده‌اند.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { text: "دنتالفای بهترین منبع برای مرور سریع کیس‌های پیچیده جراحی است. دسترسی به تجربیات اساتید به صورت مستند و علمی بی‌نظیر است.", author: "دکتر نیما طاهری", role: "رزیدنت جراحی فک و صورت" },
              { text: "مقالات بخش اندو بسیار کاربردی هستند. من برای آمادگی آزمون بورد تخصصی از نکات بالینی این سایت استفاده زیادی کردم.", author: "دکتر سمانه کاظمی", role: "دندانپزشک عمومی" },
              { text: "امکان دانلود فرم‌های رضایت‌نامه و مستندات قانونی برای مطب شخصی من بسیار راهگشا بود. ممنون از تیم خوب دنتالفای.", author: "دکتر امید رستمی", role: "متخصص پروتز" },
            ].map((test, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm relative">
                <div className="text-4xl text-teal-200 dark:text-teal-900/50 absolute top-6 right-6">"</div>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-8 relative z-10 pt-4 font-medium">
                  {test.text}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-800 dark:to-teal-900 rounded-full flex items-center justify-center text-teal-700 dark:text-teal-200 font-bold text-sm">
                    {test.author.charAt(5)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{test.author}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ & CTA */}'''

content = content.replace('      {/* FAQ & CTA */}', faculty_and_testimonials)

with open('src/components/PublicHome.tsx', 'w') as f:
    f.write(content)

