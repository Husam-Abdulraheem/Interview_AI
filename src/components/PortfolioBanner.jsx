import { useState } from "react";
import { useLocation } from "wouter";
import { useApp } from "@/contexts/AppContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { DEMO_USERS, mockStore } from "@/services/mockData";
import { Sparkles, Users, Shield, GraduationCap, RotateCcw, X, Info } from "lucide-react";
import { toast } from "sonner";

export default function PortfolioBanner() {
    const [dismissed, setDismissed] = useState(false);
    const { user, login } = useApp();
    const { t } = useLanguage();
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

    const getRoleName = () => {
        if (user?.role === 0 || user?.role === 1 || user?.role === "admin") return t("roleAdmin");
        if (user?.role === 2 || user?.role === "creator") return t("roleCreator");
        if (user) return t("roleTrainee");
        return t("roleGuest");
    };

    return (
        <aside aria-label="Portfolio Showcase Mode" className="relative z-50 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white border-b border-indigo-500/30 shadow-md backdrop-blur-md px-4 py-2.5 text-xs transition-all">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* Information */}
                <div className="flex items-center gap-2.5 min-w-0">
                    <span className="flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/25 text-indigo-200 font-bold border border-indigo-400/40 shadow-sm">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                        <span>{t("bannerTag")}</span>
                    </span>
                    <p className="text-gray-200 text-xs truncate hidden md:block">
                        {t("bannerDesc")}
                    </p>
                    {user && (
                        <span className="text-gray-300 hidden lg:inline text-xs">
                            ({t("bannerCurrentRole")} <strong className="text-white font-semibold">{getRoleName()}</strong>)
                        </span>
                    )}
                </div>

                {/* Quick Role Switchers */}
                <div className="flex items-center gap-1.5 flex-wrap justify-center">
                    <button
                        onClick={() => handleQuickRoleSwitch("trainee")}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                            user?.role === 3 ? "bg-blue-600 text-white ring-2 ring-blue-300" : "bg-white/10 hover:bg-white/20 text-gray-100"
                        }`}
                        title={t("roleTrainee")}
                    >
                        <GraduationCap className="w-3.5 h-3.5 text-cyan-300" />
                        <span>{t("roleTrainee")}</span>
                    </button>

                    <button
                        onClick={() => handleQuickRoleSwitch("creator")}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                            user?.role === 2 ? "bg-amber-600 text-white ring-2 ring-amber-300" : "bg-white/10 hover:bg-white/20 text-gray-100"
                        }`}
                        title={t("roleCreator")}
                    >
                        <Users className="w-3.5 h-3.5 text-amber-300" />
                        <span>{t("roleCreator")}</span>
                    </button>

                    <button
                        onClick={() => handleQuickRoleSwitch("admin")}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                            user?.role === 0 || user?.role === 1 ? "bg-rose-600 text-white ring-2 ring-rose-300" : "bg-white/10 hover:bg-white/20 text-gray-100"
                        }`}
                        title={t("roleAdmin")}
                    >
                        <Shield className="w-3.5 h-3.5 text-rose-300" />
                        <span>{t("roleAdmin")}</span>
                    </button>

                    <button
                        onClick={handleResetData}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white transition-all ml-1 border border-white/15"
                        title={t("bannerReset")}
                    >
                        <RotateCcw className="w-3 h-3 text-gray-300" />
                        <span>{t("bannerReset")}</span>
                    </button>

                    <button
                        onClick={() => setDismissed(true)}
                        className="text-gray-300 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors ml-1"
                        title="Dismiss"
                        aria-label="Dismiss banner"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </aside>
    );
}
