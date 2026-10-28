import { useLocation } from "wouter";
import { Zap, Users, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import ThemeAndLanguageControls from "@/components/ThemeAndLanguageControls";
import { useLanguage } from "@/contexts/LanguageContext";

export default function RegisterSelection() {
    const [, navigate] = useLocation();
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 relative">
            <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-20">
                <ThemeAndLanguageControls />
            </div>

            <div className="w-full max-w-2xl">
                {/* Logo */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25 mb-3 text-white">
                        <Zap className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">InterviewAI Platform</span>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">اختر نوع حسابك / Rol Seçimi</h1>
                    <p className="text-muted-foreground text-sm">كيف ترغب في استخدام المنصة؟ / Platformu nasıl kullanmak istersiniz?</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Trainee */}
                    <button
                        onClick={() => navigate("/register/trainee")}
                        className="group flex flex-col p-6 sm:p-8 rounded-2xl bg-card border border-border hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-200 text-left rtl:text-right"
                    >
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                            <Users className="w-6 h-6 text-emerald-500" />
                        </div>
                        <h2 className="text-lg font-bold text-foreground mb-2">{t("roleTrainee")} (Öğrenci)</h2>
                        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-5">
                            المشاركة في التدريبات، إجراء المقابلات الصوتية الذكية، ومتابعة تطور أدائك.
                        </p>
                        <div className="flex items-center gap-2 text-emerald-500 text-xs sm:text-sm font-semibold group-hover:gap-3 transition-all mt-auto">
                            <span>البدء كطالب</span>
                            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                        </div>
                    </button>

                    {/* Creator */}
                    <button
                        onClick={() => navigate("/register/creator")}
                        className="group flex flex-col p-6 sm:p-8 rounded-2xl bg-card border border-border hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-200 text-left rtl:text-right"
                    >
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                            <Sparkles className="w-6 h-6 text-amber-500" />
                        </div>
                        <h2 className="text-lg font-bold text-foreground mb-2">{t("roleCreator")} (İçerik Üretici)</h2>
                        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-5">
                            إنشاء دوراتك التدريبية، إعداد بنوك أسئلة المقابلات، ومتابعة تقارير المتدربين.
                        </p>
                        <div className="flex items-center gap-2 text-amber-500 text-xs sm:text-sm font-semibold group-hover:gap-3 transition-all mt-auto">
                            <span>البدء كمنشئ</span>
                            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                        </div>
                    </button>
                </div>

                <div className="flex justify-center mt-8">
                    <button
                        onClick={() => navigate("/login")}
                        className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
                        {t("loginTitle")} (Giriş Yap)
                    </button>
                </div>
            </div>
        </div>
    );
}
