import { useState } from "react";
import { useLocation } from "wouter";
import { useApp } from "@/contexts/AppContext";
import { useLanguage } from "@/contexts/LanguageContext";
import ThemeAndLanguageControls from "@/components/ThemeAndLanguageControls";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Sparkles, ArrowLeft, ArrowRight, Info } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { authAPI } from "@/services/api";

export default function RegisterCreator() {
  const [, navigate] = useLocation();
  const { login } = useApp();
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "", confirmPassword: "", bio: "", portfolioUrl: "", youTubeUrl: "", linkedInUrl: "", experienceYears: "" },
    validationSchema: Yup.object({
      name: Yup.string().required("Ad Soyad zorunludur / الاسم مطلوب"),
      email: Yup.string().email("Geçerli bir e-posta girin / بريد غير صالح").required("E-posta zorunludur / البريد مطلوب"),
      password: Yup.string().min(8, "En az 8 karakter olmalıdır / 8 خانات كحد أدنى").required("Şifre zorunludur / كلمة المرور مطلوبة"),
      confirmPassword: Yup.string().oneOf([Yup.ref("password"), null], "Şifreler eşleşmiyor / غير متطابق").required("Şifre onayı zorunludur / التأكيد مطلوب"),
      bio: Yup.string().max(500, "Biyografi çok uzun / نبذة طويلة جداً"),
      portfolioUrl: Yup.string().url("Geçerli bir URL girin / رابط غير صالح"),
      youTubeUrl: Yup.string().url("Geçerli bir URL girin / رابط غير صالح"),
      linkedInUrl: Yup.string().url("Geçerli bir URL girin / رابط غير صالح"),
      experienceYears: Yup.number().min(0, "Negatif olamaz").nullable(),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const payload = {
          fullName: values.name, email: values.email, password: values.password, role: 2,
          bio: values.bio || null, portfolioUrl: values.portfolioUrl || null,
          youTubeUrl: values.youTubeUrl || null, linkedInUrl: values.linkedInUrl || null,
          experienceYears: values.experienceYears ? parseInt(values.experienceYears, 10) : null
        };
        const response = await authAPI.register(payload);
        if (response?.token) localStorage.setItem("auth_token", response.token);
        login({ id: response?.id || `user_${Date.now()}`, fullName: values.name, email: values.email, role: 2, bio: values.bio, joinedAt: new Date().toISOString() });
        toast.success("Başvurunuz alındı! / تم تسجيل طلبك بنجاح");
        navigate("/dashboard/creator");
      } catch (error) {
        toast.error(error.response?.data?.message || "Kayıt başarısız. Lütfen tekrar deneyin.");
      } finally {
        setIsLoading(false);
      }
    }
  });

  const inputCls = (touched, error) =>
    `w-full px-4 py-2.5 rounded-xl text-sm bg-secondary/30 border text-foreground placeholder:text-muted-foreground outline-none transition-all focus:bg-card focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 ${touched && error ? "border-destructive" : "border-border"}`;

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 sm:p-6 py-12 relative">
      <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-20">
        <ThemeAndLanguageControls />
      </div>

      <div className="w-full max-w-[500px] my-auto py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-md shadow-amber-500/25 text-white">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium">InterviewAI Platform</div>
            <div className="text-sm font-semibold text-foreground">تسجيل منشئ محتوى / İçerik Üretici</div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-1">انضم كصانع محتوى تدريبي</h2>
          <p className="text-muted-foreground text-xs sm:text-sm">أنشئ دوراتك التدريبية وأسئلة المقابلات للمرشحين.</p>
        </div>

        {/* Approval notice */}
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-5">
          <Info className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-600 dark:text-amber-400 leading-relaxed">
            في وضع العرض التجريبي يتم اعتماد الحساب وتفعيله فوراً لتجربة لوحة المنشئ مباشرة!
          </p>
        </div>

        {/* Form card */}
        <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Ad Soyad / الاسم الكامل</label>
            <input id="name" placeholder="Ayşe Yılmaz / سارة المهندس" {...formik.getFieldProps("name")} className={inputCls(formik.touched.name, formik.errors.name)} />
            {formik.touched.name && formik.errors.name && <p className="mt-1 text-xs text-destructive">{formik.errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">E-posta Adresi / البريد</label>
            <input id="email" type="email" placeholder="ornek@email.com" {...formik.getFieldProps("email")} className={inputCls(formik.touched.email, formik.errors.email)} />
            {formik.touched.email && formik.errors.email && <p className="mt-1 text-xs text-destructive">{formik.errors.email}</p>}
          </div>

          {/* Experience + Portfolio */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Deneyim / الخبرة (سنوات)</label>
              <input id="experienceYears" type="number" min="0" placeholder="Örn. 5" {...formik.getFieldProps("experienceYears")} className={inputCls(formik.touched.experienceYears, formik.errors.experienceYears)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Portfolyo / رابط المعرض</label>
              <input id="portfolioUrl" placeholder="https://github.com/..." {...formik.getFieldProps("portfolioUrl")} className={inputCls(formik.touched.portfolioUrl, formik.errors.portfolioUrl)} />
            </div>
          </div>

          {/* YouTube + LinkedIn */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">YouTube</label>
              <input id="youTubeUrl" placeholder="https://youtube.com/..." {...formik.getFieldProps("youTubeUrl")} className={inputCls(formik.touched.youTubeUrl, formik.errors.youTubeUrl)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">LinkedIn</label>
              <input id="linkedInUrl" placeholder="https://linkedin.com/in/..." {...formik.getFieldProps("linkedInUrl")} className={inputCls(formik.touched.linkedInUrl, formik.errors.linkedInUrl)} />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Hakkında / نبذة عنك
            </label>
            <textarea id="bio" placeholder="أخبرنا باختصار عن مجالات خبرتك..." {...formik.getFieldProps("bio")} className={`${inputCls(formik.touched.bio, formik.errors.bio)} resize-none h-20`} />
            {formik.touched.bio && formik.errors.bio && <p className="mt-1 text-xs text-destructive">{formik.errors.bio}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Şifre / كلمة المرور</label>
            <div className="relative">
              <input id="password" type={showPassword ? "text" : "password"} placeholder="En az 8 karakter" {...formik.getFieldProps("password")} className={`${inputCls(formik.touched.password, formik.errors.password)} pr-11 rtl:pr-4 rtl:pl-11`} />
              <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3.5 rtl:right-auto rtl:left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && <p className="mt-1 text-xs text-destructive">{formik.errors.password}</p>}
          </div>

          {/* Confirm password */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Şifreyi Onayla / تأكيد كلمة المرور</label>
            <div className="relative">
              <input id="confirmPassword" type={showConfirm ? "text" : "password"} placeholder="Şifrenizi tekrar girin" {...formik.getFieldProps("confirmPassword")} className={`${inputCls(formik.touched.confirmPassword, formik.errors.confirmPassword)} pr-11 rtl:pr-4 rtl:pl-11`} />
              <button type="button" onClick={() => setShowConfirm(p => !p)} className="absolute right-3.5 rtl:right-auto rtl:left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {formik.touched.confirmPassword && formik.errors.confirmPassword && <p className="mt-1 text-xs text-destructive">{formik.errors.confirmPassword}</p>}
          </div>

          <button
            type="button"
            onClick={formik.handleSubmit}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white bg-amber-500 hover:bg-amber-600 transition-all disabled:opacity-60 shadow-md shadow-amber-500/20 active:scale-[0.98] mt-2"
          >
            {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Gönderiliyor...</> : <><span>إرسال طلب الانضمام</span><ArrowRight className="w-4 h-4 rtl:rotate-180" /></>}
          </button>
        </div>

        <div className="flex items-center justify-between mt-6">
          <button onClick={() => navigate("/register")} className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" /> العودة / Geri
          </button>
          <p className="text-xs sm:text-sm text-muted-foreground">
            لديك حساب بالفعل؟{" "}
            <button onClick={() => navigate("/login")} className="text-primary hover:underline font-semibold transition-colors">
              دخول
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
