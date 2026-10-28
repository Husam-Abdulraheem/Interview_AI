import { useState } from "react";
import { useLocation } from "wouter";
import { useApp } from "@/contexts/AppContext";
import { useLanguage } from "@/contexts/LanguageContext";
import ThemeAndLanguageControls from "@/components/ThemeAndLanguageControls";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import { Eye, EyeOff, Loader2, Zap, ArrowRight, Sparkles, GraduationCap, Users, Shield } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { authAPI, userAPI } from "@/services/api";
import { DEMO_USERS } from "@/services/mockData";

export default function Login() {
  const [, navigate] = useLocation();
  const { login } = useApp();
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoLogin = (roleKey) => {
    const demoUser = DEMO_USERS[roleKey];
    if (!demoUser) return;

    localStorage.setItem("auth_token", `demo_token_${demoUser.role}_${Date.now()}`);
    login(demoUser);
    toast.success(`مرحباً بك! تم الدخول بصلاحية: ${t(`role${roleKey.charAt(0).toUpperCase() + roleKey.slice(1)}`) || demoUser.roleName}`);

    if (demoUser.role === 0 || demoUser.role === 1) {
      navigate("/dashboard/admin");
    } else if (demoUser.role === 2) {
      navigate("/dashboard/creator");
    } else {
      navigate("/dashboard/trainee");
    }
  };

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Geçerli bir e-posta girin").required("E-posta zorunludur"),
      password: Yup.string().required("Şifre zorunludur"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await authAPI.login({ email: values.email, password: values.password });
        if (response?.token) localStorage.setItem("auth_token", response.token);

        let roleId = "3", userEmail = values.email, userId = "";
        if (response?.token) {
          try {
            const decoded = jwtDecode(response.token);
            let roleClaim = decoded.role || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            if (Array.isArray(roleClaim)) roleClaim = roleClaim.find(r => String(r).toLowerCase().includes("super")) || roleClaim[0];
            if (roleClaim) roleId = String(roleClaim);
            userEmail = decoded.email || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || values.email;
            userId = decoded.sub || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || "";
          } catch {
            roleId = String(response.role ?? "3");
            userEmail = response.email || values.email;
            userId = response.id || "";
          }
        }

        let profile = { email: userEmail, id: userId, fullName: response?.fullName || userEmail.split("@")[0] };
        try { const p = await userAPI.getProfile(); profile = { ...profile, ...p }; } catch {}

        let roleValue = parseInt(roleId, 10);
        if (isNaN(roleValue)) {
          const r = roleId.toLowerCase();
          if (r.includes("super")) roleValue = 0;
          else if (r === "admin") roleValue = 1;
          else if (r === "creator") roleValue = 2;
          else roleValue = 3;
        }

        login({ ...profile, role: roleValue });
        toast.success("Tekrar hoş geldiniz!");
        if (roleValue === 0 || roleValue === 1) navigate("/dashboard/admin");
        else if (roleValue === 2) navigate("/dashboard/creator");
        else navigate("/dashboard/trainee");
      } catch (error) {
        toast.error(error.response?.data?.message || "Giriş yapılamadı. Bilgilerinizi kontrol edin.");
      } finally {
        setIsLoading(false);
      }
    }
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center p-4 sm:p-6 relative">
      {/* Top right floating controls */}
      <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-20">
        <ThemeAndLanguageControls />
      </div>

      <div className="w-full max-w-[440px] my-auto py-8">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25 mb-3 text-white">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-foreground font-bold text-lg">InterviewAI Platform</span>
          <span className="text-muted-foreground text-xs font-medium">{t("bannerTag")}</span>
        </div>

        {/* 1-Click Demo Login Banner Card */}
        <div className="bg-primary/5 dark:bg-card/90 border border-primary/20 dark:border-border rounded-2xl p-4 mb-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
              {t("quickDemoTitle")}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
            {t("quickDemoSubtitle")}
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin("trainee")}
              className="flex flex-col items-center justify-center p-2.5 bg-card hover:bg-secondary rounded-xl border border-border hover:border-primary/40 hover:shadow-md transition-all text-center group"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-xs font-bold text-foreground">{t("roleTrainee")}</span>
              <span className="text-[10px] text-muted-foreground">Trainee</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin("creator")}
              className="flex flex-col items-center justify-center p-2.5 bg-card hover:bg-secondary rounded-xl border border-border hover:border-amber-500/40 hover:shadow-md transition-all text-center group"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <Users className="w-4 h-4 text-amber-500" />
              </div>
              <span className="text-xs font-bold text-foreground">{t("roleCreator")}</span>
              <span className="text-[10px] text-muted-foreground">Creator</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin("admin")}
              className="flex flex-col items-center justify-center p-2.5 bg-card hover:bg-secondary rounded-xl border border-border hover:border-rose-500/40 hover:shadow-md transition-all text-center group"
            >
              <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <Shield className="w-4 h-4 text-rose-500" />
              </div>
              <span className="text-xs font-bold text-foreground">{t("roleAdmin")}</span>
              <span className="text-[10px] text-muted-foreground">Admin</span>
            </button>
          </div>
        </div>

        {/* Card */}
        <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm p-6 sm:p-7">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-foreground mb-1">{t("loginTitle")}</h2>
            <p className="text-muted-foreground text-xs">{t("loginSubtitle")}</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">{t("emailLabel")}</label>
              <input
                id="email" type="email" placeholder="ornek@email.com"
                {...formik.getFieldProps("email")}
                className={`w-full px-4 py-2.5 rounded-xl text-sm bg-secondary/30 border text-foreground placeholder:text-muted-foreground outline-none transition-all focus:bg-card focus:ring-2 focus:ring-primary/20 focus:border-primary ${formik.touched.email && formik.errors.email ? "border-destructive" : "border-border"}`}
              />
              {formik.touched.email && formik.errors.email && <p className="mt-1 text-xs text-destructive">{formik.errors.email}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-foreground">{t("passwordLabel")}</label>
                <button type="button" onClick={() => toast.info("في وضع العرض التجريبي، يمكنك استخدام أزرار الدخول السريع في الأعلى أو إدخال أي كلمة مرور.")} className="text-xs text-primary hover:underline font-medium transition-colors">{t("forgotPassword")}</button>
              </div>
              <div className="relative">
                <input
                  id="password" type={showPassword ? "text" : "password"} placeholder="••••••••"
                  {...formik.getFieldProps("password")}
                  className={`w-full px-4 py-2.5 pr-11 rtl:pr-4 rtl:pl-11 rounded-xl text-sm bg-secondary/30 border text-foreground placeholder:text-muted-foreground outline-none transition-all focus:bg-card focus:ring-2 focus:ring-primary/20 focus:border-primary ${formik.touched.password && formik.errors.password ? "border-destructive" : "border-border"}`}
                />
                <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3.5 rtl:right-auto rtl:left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && <p className="mt-1 text-xs text-destructive">{formik.errors.password}</p>}
            </div>

            <button
              type="submit" disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-primary-foreground bg-primary hover:bg-primary/90 transition-all disabled:opacity-60 shadow-md shadow-primary/20 active:scale-[0.98]"
            >
              {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" />{t("loggingIn")}</> : <><span>{t("loginBtn")}</span><ArrowRight className="w-4 h-4 rtl:rotate-180" /></>}
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-5">
            {t("registerPrompt")}{" "}
            <button onClick={() => navigate("/register")} className="text-primary hover:underline font-semibold transition-colors">
              {t("registerBtn")}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
