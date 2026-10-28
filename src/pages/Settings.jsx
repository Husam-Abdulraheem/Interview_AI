import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useApp } from "@/contexts/AppContext";
import { useTheme } from "@/contexts/ThemeContext";
import { mockStore } from "@/services/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { User, Sun, Moon, Mic, Volume2, RotateCcw, ShieldCheck, Check } from "lucide-react";

export default function Settings() {
    const { user, login } = useApp();
    const { theme, setTheme } = useTheme();

    const [fullName, setFullName] = useState(user?.fullName || user?.name || "المستخدم التجريبي");
    const [bio, setBio] = useState(user?.bio || "مطور برمجيات ومهتم بتقنيات الذكاء الاصطناعي والمقابلات التقنية.");
    const [micStatus, setMicStatus] = useState("idle");

    const handleSaveProfile = (e) => {
        e.preventDefault();
        login({ ...user, fullName, name: fullName, bio });
        toast.success("تم تحديث معلومات الحساب بنجاح");
    };

    const handleTestMic = async () => {
        try {
            setMicStatus("testing");
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setMicStatus("working");
            toast.success("الميكروفون يعمل بنجاح وبوضوح!");
            setTimeout(() => {
                stream.getTracks().forEach(t => t.stop());
                setMicStatus("idle");
            }, 3000);
        } catch {
            setMicStatus("error");
            toast.error("تعذر الوصول إلى الميكروفون. يرجى مراجعة إذن المتصفح.");
        }
    };

    const handleResetAllData = () => {
        if (!confirm("هل ترغب في استعادة البيانات التجريبية الافتراضية للكورسات والمحاولات؟")) return;
        mockStore.resetAll();
        toast.success("تمت استعادة البيانات الافتراضية بنجاح");
        setTimeout(() => window.location.reload(), 600);
    };

    return (
        <DashboardLayout title="Ayarlar / الإعدادات">
            <div className="p-6 lg:p-8 space-y-8 animate-fade-in-up max-w-4xl">
                <div>
                    <h2 className="text-2xl font-bold heading-font text-foreground mb-1">الإعدادات وتفضيلات الحساب</h2>
                    <p className="text-sm text-muted-foreground">تخصيص المظهر، إعدادات الصوت، ومعلومات الحساب في المنصة.</p>
                </div>

                <div className="grid gap-6">
                    {/* Profile Information */}
                    <div className="glass-card rounded-2xl p-6 border border-border shadow-sm">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <User className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-foreground">الملف الشخصي (Profile)</h3>
                                <p className="text-xs text-muted-foreground">تعديل الاسم والنبذة التعريفية المعروضة في النظام.</p>
                            </div>
                        </div>

                        <form onSubmit={handleSaveProfile} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-xs font-semibold mb-1.5 block">الاسم الكامل / Ad Soyad</Label>
                                    <Input
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="rounded-xl bg-secondary/30"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs font-semibold mb-1.5 block">البريد الإلكتروني / E-posta</Label>
                                    <Input
                                        value={user?.email || "user@interviewai.demo"}
                                        disabled
                                        className="rounded-xl bg-secondary/60 opacity-70 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label className="text-xs font-semibold mb-1.5 block">النبذة التعريفية / Biyografi</Label>
                                <Textarea
                                    rows={3}
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="rounded-xl bg-secondary/30"
                                    placeholder="اكتب نبذة مختصرة عنك..."
                                />
                            </div>

                            <Button type="submit" size="sm" className="btn-gradient">
                                حفظ التغييرات
                            </Button>
                        </form>
                    </div>

                    {/* Appearance & Theme */}
                    <div className="glass-card rounded-2xl p-6 border border-border shadow-sm">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <Sun className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-foreground">المظهر والعرض (Appearance)</h3>
                                <p className="text-xs text-muted-foreground">التبديل بين النمط الفاتح والنمط الليلي الداكن.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => setTheme("light")}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                                    theme === "light"
                                        ? "border-primary bg-primary/10 text-primary shadow-sm"
                                        : "border-border hover:bg-secondary/50 text-muted-foreground"
                                }`}
                            >
                                <Sun className="w-4 h-4" />
                                <span>فاتح (Light)</span>
                                {theme === "light" && <Check className="w-3.5 h-3.5 ml-1" />}
                            </button>

                            <button
                                type="button"
                                onClick={() => setTheme("dark")}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                                    theme === "dark"
                                        ? "border-primary bg-primary/10 text-primary shadow-sm"
                                        : "border-border hover:bg-secondary/50 text-muted-foreground"
                                }`}
                            >
                                <Moon className="w-4 h-4" />
                                <span>داكن (Dark)</span>
                                {theme === "dark" && <Check className="w-3.5 h-3.5 ml-1" />}
                            </button>
                        </div>
                    </div>

                    {/* Audio & Hardware Testing */}
                    <div className="glass-card rounded-2xl p-6 border border-border shadow-sm">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                <Mic className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-foreground">اختبار الميكروفون والصوت</h3>
                                <p className="text-xs text-muted-foreground">التحقق من جاهزية الميكروفون لجلسات المقابلات الصوتية الذكية.</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <p className="text-sm font-medium text-foreground">فحص إذن الميكروفون المباشر</p>
                                <p className="text-xs text-muted-foreground">تأكد من أن متصفحك يمتلك صلاحية الاستماع للصوت لتفريغ الإجابات.</p>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleTestMic}
                                disabled={micStatus === "testing"}
                                className="rounded-xl border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
                            >
                                <Volume2 className="w-4 h-4 mr-2" />
                                {micStatus === "testing" ? "جاري الفحص..." : "اختبار الميكروفون الآن"}
                            </Button>
                        </div>
                    </div>

                    {/* Portfolio Showcase Reset */}
                    <div className="glass-card rounded-2xl p-6 border border-border shadow-sm">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                                <RotateCcw className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-foreground">إعادة ضبط بيانات العرض (Demo Reset)</h3>
                                <p className="text-xs text-muted-foreground">استعادة الكورسات والمحاولات والمستخدمين إلى الحالة الافتراضية.</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <p className="text-sm font-medium text-foreground">استعادة بيانات النموذج الأولي</p>
                                <p className="text-xs text-muted-foreground">يفيد هذا الخيار إذا أضفت أو حذفت كورسات وتريد تنظيف المتصفح.</p>
                            </div>
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={handleResetAllData}
                                className="rounded-xl"
                            >
                                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                                استعادة البيانات الافتراضية
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
