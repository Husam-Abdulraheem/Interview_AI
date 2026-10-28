import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useApp } from "@/contexts/AppContext";
import { useLanguage } from "@/contexts/LanguageContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Play, BookOpen, Code2, Database, Briefcase, ChevronRight, Loader2, Sparkles, Trophy } from "lucide-react";
import { courseAPI } from "@/services/api";
import { COURSE_CATEGORIES } from "@/utils/categories";
import { getYouTubeThumbnail } from "@/utils/helpers";
import { toast } from "sonner";

const CATEGORY_ICONS = {
    "Software Engineering": <Code2 className="w-5 h-5 sm:w-6 sm:h-6" />,
    "Data Science": <Database className="w-5 h-5 sm:w-6 sm:h-6" />,
    "Product Management": <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />,
};

export default function DashboardTrainee() {
    const [, navigate] = useLocation();
    const { user } = useApp();
    const { t, language } = useLanguage();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const hour = new Date().getHours();
    const greetingText = {
        ar: hour < 12 ? "صباح الخير" : "مساء الخير",
        en: hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening",
        tr: hour < 12 ? "Günaydın" : hour < 18 ? "İyi günler" : "İyi akşamlar"
    }[language] || "مرحباً بك";

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await courseAPI.getAll();
                setCourses(data || []);
            } catch (error) {
                console.error("Eğitimler yüklenemedi", error);
                toast.error("Mevcut eğitimler yüklenemedi");
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const popularCategories = COURSE_CATEGORIES.slice(0, 4);

    return (
        <DashboardLayout title={t("navOverview")}>
            <div className="space-y-8 animate-fade-in-up">

                {/* Welcome Hero Banner */}
                <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-primary/10 via-indigo-500/10 to-cyan-500/10 border border-primary/20 relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary font-bold text-xs mb-3 border border-primary/25">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{t("bannerTag")}</span>
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-2">
                            {greetingText}، {user?.fullName || user?.name || "المتدرب"}! 👋
                        </h2>
                        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-4">
                            استعد لمقابلتك القادمة، اختر المسار التدريبي المناسب وتحدث بصوتك مباشرة مع مدرب المقابلات الذكي.
                        </p>
                        <div className="flex items-center gap-3">
                            <Button onClick={() => navigate("/courses")} className="btn-gradient text-xs sm:text-sm font-bold h-9">
                                {t("startCourse")}
                            </Button>
                            <Button variant="outline" onClick={() => navigate("/attempts")} className="border-border text-foreground hover:bg-secondary text-xs sm:text-sm h-9">
                                <Trophy className="w-3.5 h-3.5 mr-1.5" />
                                {t("navAttempts")}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Explore Categories */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg sm:text-xl font-bold heading-font text-foreground">{t("exploreCategories")}</h3>
                        <Button onClick={() => navigate("/courses")} variant="ghost" size="sm" className="text-primary hover:bg-primary/10 transition-colors text-xs">
                            {t("viewAll")} <ChevronRight className="w-3.5 h-3.5 ml-1 rtl:rotate-180"/>
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                        {popularCategories.map((cat, idx) => (
                            <div
                                key={idx}
                                onClick={() => navigate(`/courses?category=${encodeURIComponent(cat)}`)}
                                className="glass-card rounded-2xl p-5 hover:shadow-lg hover:border-primary/40 transition-all duration-200 cursor-pointer group border border-border"
                            >
                                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200 border border-primary/20">
                                    {CATEGORY_ICONS[cat] || <BookOpen className="w-5 h-5" />}
                                </div>
                                <h4 className="font-bold text-foreground text-xs sm:text-sm truncate">{cat}</h4>
                                <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">
                                    {courses.filter(c => c.specialty === cat).length} {t("coursesCount")}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Available Courses Feed */}
                <div>
                    <h3 className="text-lg sm:text-xl font-bold heading-font text-foreground mb-4">{t("recommendedCourses")}</h3>
                    
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : courses.length === 0 ? (
                        <div className="text-center py-16 glass-card rounded-2xl border border-dashed border-border">
                            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                                <BookOpen className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h4 className="text-base font-bold text-foreground">Henüz eğitim bulunmamaktadır</h4>
                            <p className="text-xs text-muted-foreground mt-1">Yeni içerikler için daha sonra tekrar kontrol edin!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {courses.slice(0, 6).map(course => (
                                <div key={course.id} className="glass-card rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-200 group flex flex-col border border-border hover:border-primary/40">
                                    <div className="h-44 bg-secondary relative overflow-hidden">
                                        {getYouTubeThumbnail(course.youTubeVideoUrl) ? (
                                            <img
                                                src={getYouTubeThumbnail(course.youTubeVideoUrl)}
                                                alt={course.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-primary/10" />
                                        )}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-background/50 backdrop-blur-sm transition-all duration-200">
                                            <Button onClick={() => navigate(`/study/${course.id}`)} size="sm" className="bg-primary text-primary-foreground shadow-lg">
                                                {t("inspectCourse")}
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="p-5 flex-1 flex flex-col">
                                        <span className="text-[11px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-md w-fit mb-2.5">
                                            {course.specialty || "Genel Hazırlık"}
                                        </span>

                                        <h3 className="text-sm font-bold text-foreground mb-1.5 line-clamp-2 group-hover:text-primary transition-colors">
                                            {course.title}
                                        </h3>
                                        <p className="text-xs text-muted-foreground line-clamp-2 mb-4 flex-1">
                                            {course.description || "Açıklama bulunmuyor."}
                                        </p>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => navigate(`/study/${course.id}`)}
                                            className="text-primary hover:text-primary hover:bg-primary/10 font-bold w-full justify-between mt-auto border border-primary/20 text-xs h-8"
                                        >
                                            <span>{t("startCourse")}</span>
                                            <ChevronRight className="w-3.5 h-3.5 ml-1 rtl:rotate-180" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </DashboardLayout>
    );
}
