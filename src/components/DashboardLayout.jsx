/**
 * DashboardLayout — Shared responsive sidebar layout for all roles
 * Features: Fixed left/right sidebar (RTL/LTR aware), theme toggle, language switcher, user status
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { useApp } from "@/contexts/AppContext";
import { useLanguage } from "@/contexts/LanguageContext";
import ThemeAndLanguageControls from "@/components/ThemeAndLanguageControls";
import { toast } from "sonner";
import {
  Brain, LayoutDashboard, BookOpen, Users, Settings, LogOut,
  ChevronLeft, ChevronRight, Bell, PlusCircle, BarChart3,
  FileText, Shield, Menu, Sparkles
} from "lucide-react";

export default function DashboardLayout({ children, title }) {
  const [, navigate] = useLocation();
  const [location] = useLocation();
  const { user, logout } = useApp();
  const { t, dir } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeRole = (user?.role == "0" || user?.role == "1") ? "admin" :
    user?.role == "2" ? "creator" :
      user?.role == "3" ? "trainee" :
        user?.role?.toString().toLowerCase() || "";

  const NAV_ITEMS = [
    { key: "navOverview", fallback: "Ana Panel", icon: <LayoutDashboard className="w-4 h-4" />, path: "/dashboard/trainee", roles: ["trainee"] },
    { key: "navCourses", fallback: "Eğitimlerim", icon: <BookOpen className="w-4 h-4" />, path: "/courses", roles: ["trainee"] },
    { key: "navAttempts", fallback: "Denemelerim", icon: <BarChart3 className="w-4 h-4" />, path: "/attempts", roles: ["trainee"] },
    { key: "navOverview", fallback: "Ana Panel", icon: <LayoutDashboard className="w-4 h-4" />, path: "/dashboard/creator", roles: ["creator"] },
    { key: "navCreateCourse", fallback: "Kurs Oluştur", icon: <PlusCircle className="w-4 h-4" />, path: "/creator/courses", roles: ["creator"] },
    { key: "navAnalytics", fallback: "Analizler", icon: <BarChart3 className="w-4 h-4" />, path: "/creator/analytics", roles: ["creator"] },
    { key: "navAdminPanel", fallback: "Yönetici Paneli", icon: <Shield className="w-4 h-4" />, path: "/dashboard/admin", roles: ["admin"] },
    { key: "navUsers", fallback: "Kullanıcılar", icon: <Users className="w-4 h-4" />, path: "/admin/users", roles: ["admin"] },
    { key: "navContent", fallback: "İçerikler", icon: <FileText className="w-4 h-4" />, path: "/admin/content", roles: ["admin"] },
    { key: "navAnalytics", fallback: "Analizler", icon: <BarChart3 className="w-4 h-4" />, path: "/admin/analytics", roles: ["admin"] },
  ];

  const BOTTOM_ITEMS = [
    { key: "navSettings", fallback: "Ayarlar", icon: <Settings className="w-4 h-4" />, path: "/settings", roles: ["trainee", "creator", "admin"] },
  ];

  const handleLogout = () => {
    logout();
    toast.success(t("navLogout") || "تم تسجيل الخروج");
    navigate("/login");
  };

  const handleNav = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const filteredNav = NAV_ITEMS.filter(item => user && item.roles.includes(activeRole));
  const filteredBottom = BOTTOM_ITEMS.filter(item => user && item.roles.includes(activeRole));

  const roleColors = {
    admin: "from-rose-500 to-pink-600",
    creator: "from-amber-500 to-orange-600",
    trainee: "from-blue-500 to-cyan-600",
  };
  const roleColor = user ? roleColors[activeRole] : "from-blue-500 to-cyan-600";

  const SidebarContent = () => (
    <div className="flex flex-col h-full font-sans">
      {/* Brand Header */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-sidebar-border ${collapsed ? "justify-center" : ""}`}>
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${roleColor} flex items-center justify-center flex-shrink-0 shadow-md text-white`}>
          <Brain className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <span className="text-base font-bold heading-font text-foreground truncate">InterviewAI</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
              {t(`role${activeRole.charAt(0).toUpperCase() + activeRole.slice(1)}`) || activeRole}
            </span>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {filteredNav.map(item => {
          const isActive = location === item.path;
          const label = t(item.key) || item.fallback;
          return (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/70"
              } ${collapsed ? "justify-center" : ""}`}
              title={collapsed ? label : undefined}
            >
              <span className={`flex-shrink-0 ${isActive ? "scale-105" : ""}`}>{item.icon}</span>
              {!collapsed && <span className="truncate">{label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom items */}
      <div className="px-3 py-3 border-t border-sidebar-border space-y-1.5 bg-sidebar/50 backdrop-blur-sm">
        {filteredBottom.map(item => {
          const isActive = location === item.path;
          const label = t(item.key) || item.fallback;
          return (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/70"
              } ${collapsed ? "justify-center" : ""}`}
              title={collapsed ? label : undefined}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="truncate">{label}</span>}
            </button>
          );
        })}

        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 ${
            collapsed ? "justify-center" : ""
          }`}
          title={collapsed ? t("navLogout") : undefined}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span className="truncate">{t("navLogout")}</span>}
        </button>
      </div>

      {/* Collapse toggle (desktop) */}
      <button
        onClick={() => setCollapsed(p => !p)}
        className="hidden lg:flex items-center justify-center w-full py-3 border-t border-sidebar-border text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors text-xs"
        aria-label="Toggle Sidebar"
      >
        {collapsed ? (
          dir === "rtl" ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
        ) : (
          dir === "rtl" ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background text-foreground font-sans selection:bg-primary/20">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col flex-shrink-0 bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out z-40 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-10 animate-in slide-in-from-left duration-300 shadow-2xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        {/* Top Header Bar */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-border bg-card/70 backdrop-blur-md sticky top-0 z-30 transition-all duration-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 -ml-1 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              aria-label="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            {title && (
              <h1 className="text-base sm:text-lg font-bold heading-font text-foreground tracking-tight truncate max-w-[200px] sm:max-w-md">
                {title}
              </h1>
            )}
          </div>

          {/* Right Header Controls (Theme, Language, User) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeAndLanguageControls />

            <div className="h-5 w-px bg-border/80 hidden sm:block" />

            {/* User Profile Pill */}
            <div
              onClick={() => navigate("/settings")}
              className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-secondary/50 hover:bg-secondary cursor-pointer border border-border/60 transition-all"
              title="الملف الشخصي والإعدادات"
            >
              <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${roleColor} text-white flex items-center justify-center font-bold text-xs shadow-sm flex-shrink-0`}>
                {(user?.fullName || user?.name || user?.email || "U").charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:flex flex-col text-left rtl:text-right">
                <span className="text-xs font-bold text-foreground leading-tight truncate max-w-[110px]">
                  {user?.fullName || user?.name || "User"}
                </span>
                <span className="text-[10px] text-muted-foreground font-medium leading-none">
                  {t(`role${activeRole.charAt(0).toUpperCase() + activeRole.slice(1)}`) || activeRole}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}
