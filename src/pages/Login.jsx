import { useState } from "react";
import { useLocation } from "wouter";
import { useApp } from "@/contexts/AppContext";
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
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoLogin = (roleKey) => {
    const demoUser = DEMO_USERS[roleKey];
    if (!demoUser) return;

    localStorage.setItem("auth_token", `demo_token_${demoUser.role}_${Date.now()}`);
    login(demoUser);
    toast.success(`مرحباً بك! تم الدخول بصلاحية: ${demoUser.roleName}`);

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
          } catch (e) {
            // In demo mode or if token is plain string
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
    <div className="min-h-screen bg-[#F4F6FB] flex items-center justify-center p-6 py-10">
      <div className="w-full max-w-[440px]">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#4F46E5] flex items-center justify-center shadow-lg shadow-indigo-500/25 mb-3">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-gray-900 font-bold text-lg">InterviewAI Platform</span>
          <span className="text-gray-500 text-xs font-medium">ÖYS Platformu · Portfolio Showcase</span>
        </div>

        {/* 1-Click Demo Login Banner Card */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200/80 rounded-2xl p-4 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2.5">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
              الدخول السريع لمعرض الأعمال (1-Click Demo)
            </h3>
          </div>
          <p className="text-xs text-indigo-700/80 mb-3 leading-relaxed">
            استكشف المنصة بنقرة واحدة بحساب تجريبي مسبق التهيئة لكل دور:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin("trainee")}
              className="flex flex-col items-center justify-center p-2.5 bg-white rounded-xl border border-blue-200 hover:border-blue-500 hover:shadow-md hover:shadow-blue-500/10 transition-all text-center group"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-xs font-bold text-gray-800">طالب</span>
              <span className="text-[10px] text-gray-400">Trainee</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin("creator")}
              className="flex flex-col items-center justify-center p-2.5 bg-white rounded-xl border border-amber-200 hover:border-amber-500 hover:shadow-md hover:shadow-amber-500/10 transition-all text-center group"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <Users className="w-4 h-4 text-amber-600" />
              </div>
              <span className="text-xs font-bold text-gray-800">منشئ</span>
              <span className="text-[10px] text-gray-400">Creator</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin("admin")}
              className="flex flex-col items-center justify-center p-2.5 bg-white rounded-xl border border-rose-200 hover:border-rose-500 hover:shadow-md hover:shadow-rose-500/10 transition-all text-center group"
            >
              <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <Shield className="w-4 h-4 text-rose-600" />
              </div>
              <span className="text-xs font-bold text-gray-800">مدير</span>
              <span className="text-[10px] text-gray-400">Admin</span>
            </button>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">تسجيل الدخول / Giriş Yap</h2>
            <p className="text-gray-500 text-xs">أو يمكنك إدخال أي بريد إلكتروني وكلمة مرور للتجربة.</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">E-posta Adresi / البريد</label>
              <input
                id="email" type="email" placeholder="ornek@email.com"
                {...formik.getFieldProps("email")}
                className={`w-full px-4 py-2.5 rounded-xl text-sm bg-[#F4F6FB] border text-gray-900 placeholder-gray-400 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] ${formik.touched.email && formik.errors.email ? "border-red-400" : "border-gray-200"}`}
              />
              {formik.touched.email && formik.errors.email && <p className="mt-1 text-xs text-red-500">{formik.errors.email}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-gray-700">Şifre / كلمة المرور</label>
                <button type="button" onClick={() => toast.info("في وضع العرض التجريبي، يمكنك استخدام أزرار الدخول السريع في الأعلى أو إدخال أي كلمة مرور.")} className="text-xs text-[#4F46E5] hover:text-indigo-800 font-medium transition-colors">Şifremi unuttum</button>
              </div>
              <div className="relative">
                <input
                  id="password" type={showPassword ? "text" : "password"} placeholder="Şifrenizi girin"
                  {...formik.getFieldProps("password")}
                  className={`w-full px-4 py-2.5 pr-11 rounded-xl text-sm bg-[#F4F6FB] border text-gray-900 placeholder-gray-400 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] ${formik.touched.password && formik.errors.password ? "border-red-400" : "border-gray-200"}`}
                />
                <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && <p className="mt-1 text-xs text-red-500">{formik.errors.password}</p>}
            </div>

            <button
              type="submit" disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white bg-[#4F46E5] hover:bg-[#4338CA] transition-all disabled:opacity-60 shadow-md shadow-indigo-500/20 active:scale-[0.98]"
            >
              {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Giriş yapılıyor...</> : <><span>Giriş Yap</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-5">
            Hesabınız yok mu?{" "}
            <button onClick={() => navigate("/register")} className="text-[#4F46E5] hover:text-indigo-800 font-semibold transition-colors">
              Kayıt Ol (Yeni Hesap)
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
