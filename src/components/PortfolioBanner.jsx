import { useState } from "react";
import { useLocation } from "wouter";
import { useApp } from "@/contexts/AppContext";
import { DEMO_USERS, mockStore } from "@/services/mockData";
import { Sparkles, Users, Shield, GraduationCap, RotateCcw, X, Info } from "lucide-react";
import { toast } from "sonner";

export default function PortfolioBanner() {
    const [dismissed, setDismissed] = useState(false);
    const { user, login } = useApp();
    const [, navigate] = useLocation();

    if (dismissed) return null;

    const handleQuickRoleSwitch = (roleKey) => {
        const demoUser = DEMO_USERS[roleKey];
        if (!demoUser) return;

        localStorage.setItem("auth_token", `demo_token_${demoUser.role}_${Date.now()}`);
        login(demoUser);
        toast.success(`تم التبديل إلى: ${demoUser.fullName}`);

        if (demoUser.role === 0 || demoUser.role === 1) {
            navigate("/dashboard/admin");
        } else if (demoUser.role === 2) {
            navigate("/dashboard/creator");
        } else {
            navigate("/dashboard/trainee");
        }
    };

    const handleResetData = () => {
        mockStore.resetAll();
        toast.info("تمت استعادة البيانات الافتراضية للمنصة");
        window.location.reload();
    };

    const activeRoleLabel = user?.role === 0 || user?.role === 1 || user?.role === "admin"
        ? "مدير النظام (Admin)"
        : user?.role === 2 || user?.role === "creator"
            ? "منشئ محتوى (Creator)"
            : user
                ? "طالب / متدرب (Trainee)"
                : "زائر (Guest)";

    return (
        <aside aria-label="Portfolio Showcase Mode" className="relative z-50 bg-gradient-to-r from-indigo-900/95 via-slate-900/95 to-indigo-950/95 text-white border-b border-indigo-500/20 shadow-md backdrop-blur-md px-4 py-2.5 text-xs transition-all">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* Information */}
                <div className="flex items-center gap-2.5 min-w-0">
                    <span className="flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-400/30">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                        <span>معرض الأعمال · Demo Mode</span>
                    </span>
                    <p className="text-gray-300 truncate hidden md:block">
                        مشروع تفاعلي مع محاكاة كاملة للمقابلات والتقارير. يمكنك التبديل الفوري بين الأدوار:
                    </p>
                    {user && (
                        <span className="text-gray-400 hidden lg:inline">
                            (أنت الآن: <strong className="text-white">{activeRoleLabel}</strong>)
                        </span>
                    )}
                </div>

                {/* Quick Role Switchers */}
                <div className="flex items-center gap-1.5 flex-wrap justify-center">
                    <button
                        onClick={() => handleQuickRoleSwitch("trainee")}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                            user?.role === 3 ? "bg-blue-600 text-white shadow-sm ring-1 ring-blue-400" : "bg-white/10 hover:bg-white/20 text-gray-200"
                        }`}
                        title="تجربة كطالب"
                    >
                        <GraduationCap className="w-3.5 h-3.5 text-cyan-300" />
                        <span>طالب</span>
                    </button>

                    <button
                        onClick={() => handleQuickRoleSwitch("creator")}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                            user?.role === 2 ? "bg-amber-600 text-white shadow-sm ring-1 ring-amber-400" : "bg-white/10 hover:bg-white/20 text-gray-200"
                        }`}
                        title="تجربة كمنشئ محتوى"
                    >
                        <Users className="w-3.5 h-3.5 text-amber-300" />
                        <span>منشئ</span>
                    </button>

                    <button
                        onClick={() => handleQuickRoleSwitch("admin")}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                            user?.role === 0 || user?.role === 1 ? "bg-rose-600 text-white shadow-sm ring-1 ring-rose-400" : "bg-white/10 hover:bg-white/20 text-gray-200"
                        }`}
                        title="تجربة كمدير للنظام"
                    >
                        <Shield className="w-3.5 h-3.5 text-rose-300" />
                        <span>مدير</span>
                    </button>

                    <button
                        onClick={handleResetData}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white transition-all ml-1"
                        title="إعادة تعيين البيانات الافتراضية"
                    >
                        <RotateCcw className="w-3 h-3" />
                        <span className="hidden xl:inline">إعادة ضبط</span>
                    </button>

                    <button
                        onClick={() => setDismissed(true)}
                        className="text-gray-400 hover:text-white p-1 transition-colors ml-1"
                        title="إخفاء الشريط"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </aside>
    );
}
