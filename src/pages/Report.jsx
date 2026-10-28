/**
 * Report Component — Öğrenme Yönetim Sistemi
 * Performans raporu ve yapay zeka geri bildirimi
 */
import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useApp } from "@/contexts/AppContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { courseAttemptAPI } from "@/services/api";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
    ChevronDown, ChevronUp, ChevronRight, RotateCcw, BookOpen, Loader2,
    Trophy, TrendingUp, AlertTriangle, Lightbulb, CheckCircle, Star
} from "lucide-react";

// ─── Score Ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score, t }) {
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const color = score >= 80 ? "#10B981" : score >= 60 ? "#F59E0B" : "#F43F5E";
    const label = score >= 80 ? (t ? t("scoreExcellent") : "Mükemmel") : score >= 60 ? (t ? t("scoreGood") : "Yeterli") : (t ? t("scoreNeedsImprovement") : "Geliştirilmeli");

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-36 h-36">
                <svg className="w-36 h-36 -rotate-90" viewBox="0 0 128 128">
                    <circle cx="64" cy="64" r={radius} fill="none" stroke="currentColor" strokeWidth="8" className="text-secondary" />
                    <circle
                        cx="64" cy="64" r={radius} fill="none"
                        stroke={color} strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-foreground">{score}</span>
                    <span className="text-xs text-muted-foreground font-medium">/ 100</span>
                </div>
            </div>
            <div
                className="mt-3 px-4 py-1.5 rounded-full text-xs font-bold border"
                style={{ color, backgroundColor: `${color}15`, borderColor: `${color}30` }}
            >
                {label}
            </div>
        </div>
    );
}

// ─── Question Item ────────────────────────────────────────────────────────────
function QuestionItem({ item, index }) {
    const [expanded, setExpanded] = useState(false);
    const color = item.score >= 80 ? "text-emerald-400" : item.score >= 60 ? "text-amber-400" : "text-red-400";
    const bg = item.score >= 80 ? "bg-emerald-500/10 border-emerald-500/20" : item.score >= 60 ? "bg-amber-500/10 border-amber-500/20" : "bg-red-500/10 border-red-500/20";

    return (
        <div className="glass-card rounded-xl border border-border overflow-hidden hover:border-primary/20 transition-all duration-200">
            <button
                onClick={() => setExpanded(p => !p)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-secondary/30 transition-colors text-left"
            >
                <div className="flex items-start gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5 border border-primary/20">
                        <span className="text-xs font-bold text-primary">{index + 1}</span>
                    </div>
                    <p className="text-sm font-medium text-foreground line-clamp-1">{item.question}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                    <div className={`text-sm font-bold px-3 py-1 rounded-lg border ${bg} ${color}`}>
                        {item.score}%
                    </div>
                    {expanded
                        ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        : <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    }
                </div>
            </button>
            {expanded && (
                <div className="px-5 py-4 border-t border-border bg-secondary/20">
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.generalFeedback}</p>
                </div>
            )}
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Report() {
    const params = useParams();
    const [, navigate] = useLocation();
    const { reportData } = useApp();
    const { t, language } = useLanguage();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const processReport = async () => {
            const currentAttemptId = params.attemptId || reportData?.attemptId;

            if (!currentAttemptId) {
                setData({
                    sessionId: "demo",
                    courseTitle: reportData?.courseTitle || (language === "ar" ? "مقابلة تجريبية" : "Interview Session"),
                    overallScore: 78,
                    completedAt: new Date().toISOString(),
                    strengths: language === "ar"
                        ? ["أسلوب تواصل واضح وهادئ", "معرفة تقنية ممتازة بالمفاهيم", "استخدام أمثلة عملية ومقنعة"]
                        : ["Açık iletişim stili", "Güçlü teknik bilgi", "İyi örnek kullanımı"],
                    weaknesses: language === "ar"
                        ? ["نقص في توظيف أرقام ونتائج قابلة للقياس", "يمكن اختصار بعض الأجوبة لزيادة التركيز"]
                        : ["Yanıtlarda ölçülebilir sonuçlar eksikti", "Özlülük geliştirilebilir"],
                    suggestions: language === "ar"
                        ? ["استخدم منهجية STAR بدقة", "قم بقياس التأثير بالأرقام والنسب", "تجنب التكرار والكلمات الحشوية"]
                        : ["STAR yöntemini pratik yapın", "Etkiyi metriklerle ölçün", "Dolgu kelimelerini azaltın"],
                    questionBreakdown: [
                        { questionId: "q1", question: language === "ar" ? "تحدث عن مشكلة تقنية معقدة قمت بحلها مؤخراً." : "Çözdüğünüz zorlu bir teknik problemi anlatın.", score: 82, generalFeedback: language === "ar" ? "هيكل منظم وأمثلة برمجية واقعية." : "Net yapı ve iyi örneklerle güçlü bir yanıt." },
                        { questionId: "q2", question: language === "ar" ? "كيف تبدأ في تصميم بنية نظام معقد وقابل للتوسع؟" : "Sistem tasarımına nasıl yaklaşırsınız?", score: 75, generalFeedback: language === "ar" ? "تغطية جيدة لكن تحتاج لتعميق التنازلات (trade-offs)." : "İyi kapsam ancak trade-off'larda derinlik eksikti." },
                        { questionId: "q3", question: language === "ar" ? "صف موقفاً قمت فيه بقيادة فريق في مشروع حرج." : "Bir ekibe liderlik ettiğiniz bir durumu anlatın.", score: 88, generalFeedback: language === "ar" ? "استخدام ممتاز لمنهجية STAR مع نتائج واضحة." : "Net sonuçlarla mükemmel STAR yöntemi kullanımı." },
                    ],
                });
                setIsLoading(false);
                return;
            }

            try {
                const attempt = await courseAttemptAPI.getById(currentAttemptId);
                const allStrengths = [];
                const allWeaknesses = [];
                const allSuggestions = [];
                const breakdowns = [];

                if (attempt.questionAttempts) {
                    for (const qa of attempt.questionAttempts) {
                        if (qa.strengths) allStrengths.push(...qa.strengths);
                        if (qa.weaknesses) allWeaknesses.push(...qa.weaknesses);
                        if (qa.suggestions) allSuggestions.push(...qa.suggestions);
                        breakdowns.push({
                            questionId: qa.questionId,
                            question: qa.question?.content || qa.question?.text || "Soru " + (breakdowns.length + 1),
                            score: qa.score,
                            generalFeedback: qa.generalFeedback
                        });
                    }
                }

                setData({
                    sessionId: attempt.id,
                    courseTitle: attempt.course?.title || "Mülakat Oturumu",
                    overallScore: attempt.totalScore || 0,
                    completedAt: attempt.completedAt || new Date().toISOString(),
                    strengths: allStrengths,
                    weaknesses: allWeaknesses,
                    suggestions: allSuggestions,
                    questionBreakdown: breakdowns,
                });
            } catch (error) {
                console.error("[Rapor] İşleme hatası:", error);
            } finally {
                setIsLoading(false);
            }
        };
        processReport();
    }, [params.attemptId, reportData?.attemptId, language]);

    if (isLoading || !data) {
        return (
            <DashboardLayout title={t("performanceReport")}>
                <div className="flex flex-col justify-center items-center h-96 gap-4">
                    <div className="w-12 h-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                    <p className="text-sm text-muted-foreground">...</p>
                </div>
            </DashboardLayout>
        );
    }

    const locale = language === "ar" ? "ar-SA" : language === "en" ? "en-US" : "tr-TR";
    const formattedDate = new Date(data.completedAt).toLocaleDateString(locale, {
        year: "numeric", month: "long", day: "numeric"
    });

    return (
        <DashboardLayout title={t("performanceReport")}>
            <div className="p-6 lg:p-8 space-y-6 animate-fade-in-up max-w-4xl">
                {/* ── Header ──────────────────────────────────── */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Trophy className="w-5 h-5 text-amber-400" />
                            <h2 className="text-2xl font-bold heading-font text-foreground">{t("performanceReport")}</h2>
                        </div>
                        <p className="text-sm text-muted-foreground">{data.courseTitle} · {formattedDate}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => navigate("/courses")} className="text-xs h-9 border-border hover:border-primary/30 hover:text-primary">
                            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                            {t("tryAgain")}
                        </Button>
                        <Button size="sm" onClick={() => navigate("/courses")} className="btn-gradient text-xs h-9">
                            <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                            {t("newCourse")}
                        </Button>
                    </div>
                </div>

                {/* ── Score Section ────────────────────────────── */}
                <div className="glass-card rounded-2xl border border-border p-8">
                    <div className="flex flex-col sm:flex-row items-center gap-8">
                        <div className="flex-shrink-0">
                            <ScoreRing score={data.overallScore} t={t} />
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                            <h3 className="text-xl font-bold text-foreground mb-2">{t("overallScore")}</h3>
                            <p className="text-muted-foreground leading-relaxed text-sm">
                                {data.overallScore} / 100
                            </p>
                            <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
                                {data.overallScore >= 80 && (
                                    <span className="text-xs bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-current" /> {t("scoreExcellent")}
                                    </span>
                                )}
                                <span className="text-xs bg-secondary text-muted-foreground border border-border px-3 py-1 rounded-full font-semibold">
                                    {data.questionBreakdown.length} {t("questionsCount")}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Strengths & Weaknesses ───────────────────── */}
                <div className="grid sm:grid-cols-2 gap-5">
                    {/* Güçlü Yönler */}
                    <div className="glass-card rounded-2xl border border-emerald-500/20 p-6 bg-emerald-500/5">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                            </div>
                            <h3 className="text-sm font-bold text-foreground">{t("strengths")}</h3>
                        </div>
                        {data.strengths.length === 0 ? (
                            <p className="text-sm text-muted-foreground italic">...</p>
                        ) : (
                            <ul className="space-y-2.5">
                                {data.strengths.map((s, i) => (
                                    <li key={i} className="flex items-start gap-2.5">
                                        <span className="text-emerald-500 font-bold mt-0.5 flex-shrink-0">✓</span>
                                        <span className="text-sm text-muted-foreground leading-relaxed">{s}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Geliştirilmesi Gereken Alanlar */}
                    <div className="glass-card rounded-2xl border border-amber-500/20 p-6 bg-amber-500/5">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                <TrendingUp className="w-4 h-4 text-amber-500" />
                            </div>
                            <h3 className="text-sm font-bold text-foreground">{t("weaknesses")}</h3>
                        </div>
                        {data.weaknesses.length === 0 ? (
                            <p className="text-sm text-muted-foreground italic">...</p>
                        ) : (
                            <ul className="space-y-2.5">
                                {data.weaknesses.map((w, i) => (
                                    <li key={i} className="flex items-start gap-2.5">
                                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-muted-foreground leading-relaxed">{w}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* ── Suggestions ──────────────────────────────── */}
                <div className="glass-card rounded-2xl border border-blue-500/20 p-6 bg-primary/5">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
                            <Lightbulb className="w-4 h-4 text-primary" />
                        </div>
                        <h3 className="text-sm font-bold text-foreground">{t("suggestions")}</h3>
                    </div>
                    {data.suggestions.length === 0 ? (
                        <p className="text-sm text-muted-foreground italic">...</p>
                    ) : (
                        <ul className="space-y-2.5">
                            {data.suggestions.map((s, i) => (
                                <li key={i} className="flex items-start gap-2.5">
                                    <ChevronRight className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-muted-foreground leading-relaxed">{s}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* ── Question Breakdown ───────────────────────── */}
                <div className="glass-card rounded-2xl border border-border p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center border border-border">
                            <BookOpen className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <h3 className="text-sm font-bold text-foreground">{t("questionsBreakdown")}</h3>
                    </div>
                    {data.questionBreakdown.length === 0 ? (
                        <p className="text-sm text-muted-foreground italic">...</p>
                    ) : (
                        <div className="space-y-3">
                            {data.questionBreakdown.map((item, i) => (
                                <QuestionItem key={i} item={item} index={i} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
