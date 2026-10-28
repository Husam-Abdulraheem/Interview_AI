import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Mic2, ArrowRight, Sparkles, CheckCircle2, Play } from "lucide-react";
import ThemeAndLanguageControls from "@/components/ThemeAndLanguageControls";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Landing() {
    const { language, t } = useLanguage();

    const heroTexts = {
        ar: {
            brand: "منصة InterviewAI",
            badge: "مدرب المقابلات والتدريب الذكي المدعوم بالذكاء الاصطناعي",
            heading1: "طوّر مهاراتك واجتز",
            headingHighlight: "المقابلات التقنية",
            heading2: "بثقة واحتراف",
            desc: "تدرّب على أسئلة حقيقية في الهندسة البرمجية وتصميم النظم، تحدّث بصوتك مباشرة واحصل على تقييم فوري يوضح نقاط قوتك ومواضع تحسينك.",
            ctaStart: "تجربة المنصة الآن",
            ctaLogin: "تسجيل الدخول",
            features: [
                { title: "تحليل صوتي فوري", desc: "حوّل إجاباتك الشفهية إلى نصوص دقيقة مع تحليل لجودة الطرح والمصطلحات." },
                { title: "سيناريوهات واقعية", desc: "أسئلة مصممة وفق معايير المقابلات العالمية في كبرى الشركات التقنية." },
                { title: "تقارير تقييم ذكية", desc: "درجات مئوية ونقاط قوة وضعف وتوصيات ملموسة بعد كل جلسة مقابلة." }
            ],
            footer: "© 2026 منصة InterviewAI. نسخة معرض الأعمال التفاعلية (Showcase Edition)."
        },
        en: {
            brand: "InterviewAI Platform",
            badge: "AI-Powered Technical Interview & Coaching Suite",
            heading1: "Master Your Skills & Ace",
            headingHighlight: "Technical Interviews",
            heading2: "With Total Confidence",
            desc: "Simulate real-world technical and system design interviews, practice speaking responses live with real-time feedback and diagnostic AI scoring.",
            ctaStart: "Explore Live Demo",
            ctaLogin: "Sign In",
            features: [
                { title: "Instant Speech Analysis", desc: "Transcribe spoken responses in real-time with nuance and terminology evaluation." },
                { title: "Industry Standard Scenarios", desc: "Practice questions aligned with FAANG & modern tech company hiring bars." },
                { title: "Actionable AI Reports", desc: "Clear score breakdowns, identified strengths, gaps, and targeted growth tips." }
            ],
            footer: "© 2026 InterviewAI Platform. Interactive Portfolio Showcase Edition."
        },
        tr: {
            brand: "InterviewAI Platformu",
            badge: "Yapay Zeka Destekli Teknik Mülakat ve Eğitim Koçu",
            heading1: "Becerilerinizi Geliştirin,",
            headingHighlight: "Teknik Mülakatları",
            heading2: "Güvenle Geçin",
            desc: "Gerçekçi yazılım mühendisliği ve sistem tasarımı senaryolarıyla pratik yapın, sesli yanıt verin ve yapay zeka tabanlı anlık değerlendirmelerle güçlü ve zayıf yönlerinizi keşfedin.",
            ctaStart: "Canlı Demoyu Keşfet",
            ctaLogin: "Giriş Yap",
            features: [
                { title: "Anlık Sesli Analiz", desc: "Konuşarak verdiğiniz cevaplar anında metne dönüştürülüp teknik doğrulukla analiz edilir." },
                { title: "Sektör Standartlarında Senaryolar", desc: "Global teknoloji devlerinin mülakat formatlarına uygun soru setleri." },
                { title: "Yapay Zeka Değerlendirme Raporu", desc: "Her oturum sonrasında detaylı puanlama, güçlü yönler ve somut gelişim tavsiyeleri." }
            ],
            footer: "© 2026 InterviewAI Platformu. Etkileşimli Portföy Demo Sürümü (Showcase Edition)."
        }
    };

    const content = heroTexts[language] || heroTexts.ar;

    return (
        <div className="min-h-screen flex flex-col bg-background font-sans text-foreground">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border transition-all">
                <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between py-3.5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 text-primary">
                            <Mic2 className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-lg sm:text-xl font-bold heading-font text-foreground">{content.brand}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <ThemeAndLanguageControls />
                        <Link href="/login">
                            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-xl text-xs sm:text-sm px-4">
                                {content.ctaLogin}
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="flex-1 gradient-hero flex items-center justify-center px-6 py-16 lg:py-24 relative overflow-hidden">
                <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up relative z-10">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-xs sm:text-sm font-medium border border-white/20 shadow-md">
                        <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                        <span>{content.badge}</span>
                    </div>

                    {/* Main Heading */}
                    <div className="space-y-4">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight heading-font">
                            {content.heading1}{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-emerald-200 to-cyan-300">
                                {content.headingHighlight}
                            </span>{" "}
                            {content.heading2}
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-blue-100/95 leading-relaxed max-w-2xl mx-auto font-normal">
                            {content.desc}
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3.5 justify-center pt-4 max-w-md mx-auto">
                        <Link href="/login" className="w-full sm:w-auto flex-1">
                            <Button className="w-full bg-white text-indigo-950 hover:bg-slate-100 font-bold px-7 py-6 text-base rounded-2xl shadow-xl shadow-black/20 transition-transform hover:scale-[1.02]">
                                {content.ctaStart} <ArrowRight className="w-4 h-4 ml-2 rtl:rotate-180" />
                            </Button>
                        </Link>
                    </div>

                    {/* Feature Highlights */}
                    <div className="pt-10 grid grid-cols-1 md:grid-cols-3 gap-5 text-left rtl:text-right max-w-5xl mx-auto">
                        {content.features.map((feature, i) => (
                            <div key={i} className="p-6 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md hover:bg-white/15 transition-all shadow-lg shadow-black/10">
                                <CheckCircle2 className="w-6 h-6 text-emerald-300 mb-3" />
                                <h3 className="text-white font-bold text-base mb-1.5 heading-font">{feature.title}</h3>
                                <p className="text-blue-100/90 text-xs sm:text-sm leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="text-center py-6 bg-card border-t border-border text-muted-foreground text-xs sm:text-sm">
                <p>{content.footer}</p>
            </footer>
        </div>
    );
}
