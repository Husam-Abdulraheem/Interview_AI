import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Shield, Users, BookOpen, TrendingUp, Activity, UserPlus, Check, X, Edit, Trash2, Plus, Mic } from "lucide-react";
import { toast } from "sonner";
import { userAPI, courseAPI } from "@/services/api";
import { useApp } from "@/contexts/AppContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { COURSE_CATEGORIES } from "@/utils/categories";

const PLATFORM_STATS = [
    { label: "Toplam Kullanıcı", value: "Yükleniyor...", icon: <Users className="w-5 h-5"/>, color: "text-blue-600", bg: "bg-blue-500/10" },
    { label: "Bekleyen Talepler", value: "Yükleniyor...", icon: <UserPlus className="w-5 h-5"/>, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Aktif Eğitimler", value: "Yükleniyor...", icon: <BookOpen className="w-5 h-5"/>, color: "text-cyan-400", bg: "bg-cyan-500/10" },
    { label: "Sistem Durumu", value: "99.9%", icon: <Activity className="w-5 h-5"/>, color: "text-amber-400", bg: "bg-amber-500/10" },
];

export default function DashboardAdmin() {
    const { user: currentUser } = useApp();
    const { t } = useLanguage();
    const [location, navigate] = useLocation();
    const [activeTab, setActiveTab] = useState("overview");

    const [users, setUsers] = useState([]);
    const [requests, setRequests] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal States
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [courseForm, setCourseForm] = useState({ title: "", description: "", isGeneral: false, specialty: "", youTubeVideoUrl: "", contentMaterial: "", questions: [] });
    const [newQuestionContent, setNewQuestionContent] = useState("");

    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, requestsRes, coursesRes] = await Promise.all([
                userAPI.getAll(),
                userAPI.getRequests(),
                courseAPI.getAll()
            ]);
            setUsers(usersRes || []);
            setRequests(requestsRes || []);
            setCourses(coursesRes || []);
        } catch (error) {
            console.error("Dashboard verisi yüklenemedi:", error);
            toast.error("Platform verisi yüklenemedi");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (location === "/admin/users") setActiveTab("users");
        else if (location === "/admin/content") setActiveTab("courses");
        else if (location === "/dashboard/admin") setActiveTab("overview");
    }, [location]);

    const handleTabChange = (val) => {
        setActiveTab(val);
        if (val === "users" && location !== "/admin/users") navigate("/admin/users");
        else if (val === "courses" && location !== "/admin/content") navigate("/admin/content");
        else if (val === "overview" && location !== "/dashboard/admin") navigate("/dashboard/admin");
    };

    // --- User Management ---
    const handleUpdateRole = async (userId, newRole) => {
        try {
            await userAPI.updateRole(userId, newRole);
            toast.success("Kullanıcı rolü başarıyla güncellendi");
            fetchData();
        } catch (error) {
            toast.error("Rol güncellenemedi");
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) return;
        try {
            await userAPI.delete(userId);
            toast.success("Kullanıcı başarıyla silindi");
            fetchData();
        } catch (error) {
            toast.error("Kullanıcı silinemedi");
        }
    };

    // --- Requests Management ---
    const handleApproveRequest = async (userId) => {
        try {
            await userAPI.approveRequest(userId);
            toast.success("Kullanıcı talebi onaylandı");
            fetchData();
        } catch (error) {
            toast.error("Talep onaylanamadı");
        }
    };

    // --- Course Management ---
    const handleSaveCourse = async () => {
        try {
            if (editingCourse) {
                const updatePayload = {
                    title: courseForm.title,
                    description: courseForm.description,
                    isGeneral: courseForm.isGeneral,
                    specialty: courseForm.specialty,
                    youTubeVideoUrl: courseForm.youTubeVideoUrl,
                    contentMaterial: courseForm.contentMaterial,
                };
                await courseAPI.update(editingCourse.id, updatePayload);

                const originalQuestions = editingCourse.questions || [];
                const currentQuestions = courseForm.questions || [];

                const currentQuestionIds = currentQuestions.map(q => q.id);
                const questionsToDelete = originalQuestions.filter(q => !currentQuestionIds.includes(q.id));
                for (const q of questionsToDelete) {
                    await courseAPI.deleteQuestion(q.id);
                }

                const newQuestions = currentQuestions.filter(q => q.isNew);
                if (newQuestions.length > 0) {
                    await courseAPI.addQuestions(editingCourse.id, newQuestions.map(q => q.content));
                }

                const existingQuestions = currentQuestions.filter(q => !q.isNew);
                for (const q of existingQuestions) {
                    const original = originalQuestions.find(oq => oq.id === q.id);
                    if (original && (original.content !== q.content || original.orderIndex !== q.orderIndex)) {
                        await courseAPI.updateQuestion(q.id, { content: q.content, orderIndex: q.orderIndex });
                    }
                }

                toast.success("Eğitim başarıyla güncellendi");
            } else {
                const createPayload = { 
                    ...courseForm, 
                    creatorId: "",
                    questions: courseForm.questions.map(q => q.content)
                };
                await courseAPI.create(createPayload);
                toast.success("Eğitim başarıyla oluşturuldu");
            }
            setIsCourseModalOpen(false);
            fetchData();
        } catch (error) {
            toast.error(editingCourse ? "Eğitim güncellenemedi" : "Eğitim oluşturulamadı");
        }
    };

    const handleDeleteCourse = async (courseId) => {
        if (!confirm("Bu eğitimi silmek istediğinize emin misiniz?")) return;
        try {
            await courseAPI.delete(courseId);
            toast.success("Eğitim başarıyla silindi");
            fetchData();
        } catch (error) {
            toast.error("Eğitim silinemedi");
        }
    };

    const openCourseModal = (course = null) => {
        if (course) {
            setEditingCourse(course);
            setCourseForm({
                title: course.title || "",
                description: course.description || "",
                isGeneral: course.isGeneral || false,
                specialty: course.specialty || "",
                youTubeVideoUrl: course.youTubeVideoUrl || "",
                contentMaterial: course.contentMaterial || "",
                questions: course.questions || []
            });
        } else {
            setEditingCourse(null);
            setCourseForm({ title: "", description: "", isGeneral: false, specialty: "", youTubeVideoUrl: "", contentMaterial: "", questions: [] });
        }
        setIsCourseModalOpen(true);
    };

    const handleAddQuestion = () => {
        if (!newQuestionContent.trim()) return;
        const newQ = {
            id: crypto.randomUUID(),
            content: newQuestionContent.trim(),
            orderIndex: courseForm.questions.length,
            isNew: true
        };
        setCourseForm(prev => ({
            ...prev,
            questions: [...prev.questions, newQ]
        }));
        setNewQuestionContent("");
    };

    const handleRemoveQuestion = (id) => {
        setCourseForm(prev => ({
            ...prev,
            questions: prev.questions.filter(q => q.id !== id)
        }));
    };

    const getRoleName = (roleId) => {
        if (roleId === 0 || roleId === 1) return t("roleAdmin");
        if (roleId === 2) return t("roleCreator");
        if (roleId === 3) return t("roleTrainee");
        return t("roleGuest");
    };

    return (
        <DashboardLayout title={t("adminTitle")}>
            <div className="p-6 space-y-6 animate-fade-in-up">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-rose-500"/>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-foreground">{t("adminTitle")}</h2>
                        <p className="text-xs text-muted-foreground">{t("adminSubtitle")}</p>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                    <TabsList className="mb-4">
                        <TabsTrigger value="overview">{t("tabOverview")}</TabsTrigger>
                        <TabsTrigger value="users">{t("tabUsers")} ({users.length})</TabsTrigger>
                        <TabsTrigger value="requests">{t("tabRequests")} ({requests.length})</TabsTrigger>
                        <TabsTrigger value="courses">{t("tabCourses")} ({courses.length})</TabsTrigger>
                    </TabsList>

                    {/* OVERVIEW TAB */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="glass-card rounded-xl p-4 glow-border">
                                <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3 text-blue-600"><Users className="w-5 h-5"/></div>
                                <div className="text-2xl font-bold text-foreground mb-0.5">{loading ? "-" : users.length}</div>
                                <div className="text-xs font-medium text-muted-foreground mb-0.5">{t("statTotalUsers")}</div>
                            </div>
                            <div className="glass-card rounded-xl p-4 glow-border">
                                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3 text-emerald-500"><UserPlus className="w-5 h-5"/></div>
                                <div className="text-2xl font-bold text-foreground mb-0.5">{loading ? "-" : requests.length}</div>
                                <div className="text-xs font-medium text-muted-foreground mb-0.5">{t("statPendingRequests")}</div>
                            </div>
                        </div>

                        {/* Recent Activity Sections */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Recent Users */}
                            <div className="glass-card rounded-xl border border-border p-5">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-sm font-bold text-foreground">{t("recentUsers")}</h3>
                                    <Button variant="ghost" size="sm" onClick={() => handleTabChange('users')} className="text-xs text-primary hover:bg-primary/10">{t("viewAll")}</Button>
                                </div>
                                <div className="space-y-3">
                                    {users.slice(0, 5).map(u => (
                                        <div key={u.id} className="flex justify-between items-center p-3 rounded-xl bg-secondary/30 border border-border/50 hover:bg-secondary/60 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs border border-primary/20">
                                                    {u.fullName?.[0]?.toUpperCase() || 'U'}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-foreground">{u.fullName || "—"}</div>
                                                    <div className="text-xs text-muted-foreground">{u.email}</div>
                                                </div>
                                            </div>
                                            <div className="text-[10px] font-bold px-2.5 py-1 bg-secondary text-foreground rounded-full border border-border uppercase tracking-wider">
                                                {getRoleName(u.role)}
                                            </div>
                                        </div>
                                    ))}
                                    {!loading && users.length === 0 && <div className="text-sm text-center text-muted-foreground py-6 bg-secondary/20 rounded-xl border border-dashed border-border">{t("emptyUsers")}</div>}
                                </div>
                            </div>

                            {/* Recent Courses */}
                            <div className="glass-card rounded-xl border border-border p-5">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-sm font-bold text-foreground">{t("recentCourses")}</h3>
                                    <Button variant="ghost" size="sm" onClick={() => handleTabChange('courses')} className="text-xs text-primary hover:bg-primary/10">{t("viewAll")}</Button>
                                </div>
                                <div className="space-y-3">
                                    {courses.slice(0, 5).map(c => (
                                        <div key={c.id} className="flex justify-between items-center p-3 rounded-xl bg-secondary/30 border border-border/50 hover:bg-secondary/60 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold border border-emerald-500/20">
                                                    <BookOpen className="w-4 h-4"/>
                                                </div>
                                                <div className="min-w-0 pr-2">
                                                    <div className="text-sm font-semibold text-foreground truncate max-w-[180px] sm:max-w-xs">{c.title}</div>
                                                    <div className="text-xs text-muted-foreground">{c.specialty || t("typeGeneral")}</div>
                                                </div>
                                            </div>
                                            <div className="text-xs font-semibold px-2.5 py-1 bg-primary/10 text-primary rounded-lg border border-primary/20 shrink-0">
                                                {c.questions?.length || 0} {t("questionsCount")}
                                            </div>
                                        </div>
                                    ))}
                                    {!loading && courses.length === 0 && <div className="text-sm text-center text-muted-foreground py-6 bg-secondary/20 rounded-xl border border-dashed border-border">{t("emptyCourses")}</div>}
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* USERS TAB */}
                    <TabsContent value="users">
                        <div className="glass-card rounded-xl border border-border overflow-hidden p-4">
                            <h3 className="text-lg font-semibold mb-4 text-foreground">{t("tabUsers")}</h3>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t("colName")}</TableHead>
                                        <TableHead>{t("colEmail")}</TableHead>
                                        <TableHead>{t("colRole")}</TableHead>
                                        <TableHead className="text-right">{t("colActions")}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.length === 0 ? (
                                        <TableRow><TableCell colSpan={4} className="text-center py-4 text-muted-foreground">{t("emptyUsers")}</TableCell></TableRow>
                                    ) : (
                                        users.map(user => {
                                            // Admin (1) cannot modify SuperAdmin (0) or other Admin (1). SuperAdmin (0) can modify anyone.
                                            const isProtected = (user.role === 0 || user.role === 1) && currentUser?.role === 1;
                                            return (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium text-foreground">{user.fullName || "—"}</TableCell>
                                                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                                <TableCell>
                                                    <Select disabled={isProtected} defaultValue={String(user.role)} onValueChange={(val) => handleUpdateRole(user.id, parseInt(val))}>
                                                        <SelectTrigger className="w-32 h-8">
                                                            <SelectValue placeholder={t("colRole")} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="0">{t("roleAdmin")}</SelectItem>
                                                            <SelectItem value="1">{t("roleAdmin")}</SelectItem>
                                                            <SelectItem value="2">{t("roleCreator")}</SelectItem>
                                                            <SelectItem value="3">{t("roleTrainee")}</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button disabled={isProtected} variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)} className="text-rose-500 hover:text-rose-600 hover:bg-rose-500/10">
                                                        <Trash2 className="w-4 h-4"/>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>

                    {/* REQUESTS TAB */}
                    <TabsContent value="requests">
                        <div className="glass-card rounded-xl border border-border overflow-hidden p-4">
                            <h3 className="text-lg font-semibold mb-4 text-foreground">{t("tabRequests")}</h3>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t("colEmail")}</TableHead>
                                        <TableHead>{t("colRole")}</TableHead>
                                        <TableHead className="text-right">{t("colActions")}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {requests.length === 0 ? (
                                        <TableRow><TableCell colSpan={3} className="text-center py-4 text-muted-foreground">{t("emptyRequests")}</TableCell></TableRow>
                                    ) : (
                                        requests.map(req => (
                                            <TableRow key={req.id}>
                                                <TableCell className="font-medium text-foreground">{req.email}</TableCell>
                                                <TableCell className="text-muted-foreground">{getRoleName(req.role)}</TableCell>
                                                <TableCell className="text-right flex items-center justify-end gap-2">
                                                    <Button size="sm" variant="outline" onClick={() => { setSelectedRequest(req); setIsRequestModalOpen(true); }} className="border-border hover:bg-secondary">{t("detailsBtn")}</Button>
                                                    <Button size="sm" onClick={() => handleApproveRequest(req.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                                        <Check className="w-4 h-4 mr-2"/> {t("approveBtn")}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>

                    {/* COURSES TAB */}
                    <TabsContent value="courses">
                        <div className="glass-card rounded-xl border border-border overflow-hidden p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-foreground">{t("tabCourses")}</h3>
                                <Button onClick={() => openCourseModal()} className="btn-gradient">
                                    <Plus className="w-4 h-4 mr-2"/> {t("addCourseBtn")}
                                </Button>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t("colTitle")}</TableHead>
                                        <TableHead>{t("colCategory")}</TableHead>
                                        <TableHead>{t("colType")}</TableHead>
                                        <TableHead className="text-right">{t("colActions")}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {courses.length === 0 ? (
                                        <TableRow><TableCell colSpan={4} className="text-center py-4 text-muted-foreground">{t("emptyCourses")}</TableCell></TableRow>
                                    ) : (
                                        courses.map(course => (
                                            <TableRow key={course.id}>
                                                <TableCell className="font-medium text-foreground">{course.title}</TableCell>
                                                <TableCell className="text-muted-foreground">{course.specialty || "—"}</TableCell>
                                                <TableCell className="text-muted-foreground">{course.isGeneral ? t("typeGeneral") : t("typeSpecialized")}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" onClick={() => openCourseModal(course)} className="text-primary hover:text-primary hover:bg-primary/10">
                                                        <Edit className="w-4 h-4"/>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteCourse(course.id)} className="text-rose-500 hover:text-rose-600 hover:bg-rose-500/10">
                                                        <Trash2 className="w-4 h-4"/>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* CREATE / EDIT COURSE MODAL */}
            <Dialog open={isCourseModalOpen} onOpenChange={setIsCourseModalOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingCourse ? "Eğitimi Düzenle" : "Yeni Eğitim Ekle"}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Eğitim Başlığı</Label>
                            <Input id="title" value={courseForm.title} onChange={e => setCourseForm({...courseForm, title: e.target.value})} placeholder="Örn: İleri Düzey Sistem Tasarımı" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="specialty">Uzmanlık / Kategori</Label>
                            <Select value={courseForm.specialty} onValueChange={val => setCourseForm({ ...courseForm, specialty: val })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Bir kategori seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    {COURSE_CATEGORIES.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="youtube">YouTube Video URL</Label>
                            <Input id="youtube" value={courseForm.youTubeVideoUrl} onChange={e => setCourseForm({...courseForm, youTubeVideoUrl: e.target.value})} placeholder="https://youtube.com/..." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contentMaterial">Eğitim Materyali / Dış Kaynak (URL)</Label>
                            <Input id="contentMaterial" value={courseForm.contentMaterial} onChange={e => setCourseForm({...courseForm, contentMaterial: e.target.value})} placeholder="https://..." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Açıklama</Label>
                            <Textarea id="description" value={courseForm.description} onChange={e => setCourseForm({...courseForm, description: e.target.value})} placeholder="Eğitim hakkında kısa bir açıklama" />
                        </div>
                        <div className="space-y-2 flex items-center gap-2 mt-2">
                            <input type="checkbox" id="isGeneral" checked={courseForm.isGeneral} onChange={e => setCourseForm({...courseForm, isGeneral: e.target.checked})} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                            <Label htmlFor="isGeneral" className="m-0 cursor-pointer">Genel Eğitim olarak işaretle</Label>
                        </div>

                        {/* Questions Section */}
                        <div className="mt-4 pt-4 border-t border-border space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-bold flex items-center gap-2">
                                    <Mic className="w-4 h-4 text-amber-400" />
                                    Değerlendirme Soruları
                                </Label>
                                <span className="text-xs text-muted-foreground">{courseForm.questions?.length || 0} soru</span>
                            </div>
                            
                            <div className="flex gap-2">
                                <Input 
                                    value={newQuestionContent} 
                                    onChange={e => setNewQuestionContent(e.target.value)}
                                    placeholder="Yapay zeka mülakatı için bir soru ekleyin..."
                                    onKeyDown={e => e.key === 'Enter' && handleAddQuestion()}
                                />
                                <Button size="icon" onClick={handleAddQuestion} className="flex-shrink-0">
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {courseForm.questions?.map((q, idx) => (
                                    <div key={q.id || idx} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 group">
                                        <span className="text-xs font-bold text-blue-500 mt-0.5">{idx + 1}</span>
                                        <p className="text-sm text-foreground flex-1">{q.content}</p>
                                        <button onClick={() => handleRemoveQuestion(q.id)} className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                {(!courseForm.questions || courseForm.questions.length === 0) && (
                                    <p className="text-xs text-center text-muted-foreground py-2 italic">Henüz soru eklenmedi.</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCourseModalOpen(false)}>İptal</Button>
                        <Button onClick={handleSaveCourse}>{editingCourse ? "Değişiklikleri Kaydet" : "Eğitim Oluştur"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {/* REQUEST DETAILS MODAL */}
            <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Kayıt Talebi Detayları</DialogTitle>
                    </DialogHeader>
                    {selectedRequest && (
                        <div className="grid gap-4 py-4 text-sm">
                            <div className="grid grid-cols-3 font-medium text-muted-foreground">İsim: <span className="col-span-2 text-foreground font-normal">{selectedRequest.fullName || "—"}</span></div>
                            <div className="grid grid-cols-3 font-medium text-muted-foreground">E-posta: <span className="col-span-2 text-foreground font-normal">{selectedRequest.email}</span></div>
                            <div className="grid grid-cols-3 font-medium text-muted-foreground">Talep Edilen Rol: <span className="col-span-2 text-foreground font-normal">{getRoleName(selectedRequest.role)}</span></div>
                            
                            {selectedRequest.role === 2 && (
                                <>
                                    <div className="grid grid-cols-3 font-medium text-muted-foreground">Deneyim: <span className="col-span-2 text-foreground font-normal">{selectedRequest.experienceYears != null ? `${selectedRequest.experienceYears} Yıl` : "—"}</span></div>
                                    <div className="grid grid-cols-3 font-medium text-muted-foreground">Portfolyo: <span className="col-span-2 text-foreground font-normal">{selectedRequest.portfolioUrl ? <a href={selectedRequest.portfolioUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Bağlantı</a> : "—"}</span></div>
                                    <div className="grid grid-cols-3 font-medium text-muted-foreground">YouTube: <span className="col-span-2 text-foreground font-normal">{selectedRequest.youTubeUrl ? <a href={selectedRequest.youTubeUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Bağlantı</a> : "—"}</span></div>
                                    <div className="grid grid-cols-3 font-medium text-muted-foreground">LinkedIn: <span className="col-span-2 text-foreground font-normal">{selectedRequest.linkedInUrl ? <a href={selectedRequest.linkedInUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Bağlantı</a> : "—"}</span></div>
                                    <div className="grid grid-cols-3 font-medium text-muted-foreground">Hakkında: <span className="col-span-2 text-foreground font-normal whitespace-pre-wrap">{selectedRequest.bio || "—"}</span></div>
                                </>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRequestModalOpen(false)}>Kapat</Button>
                        <Button onClick={() => { handleApproveRequest(selectedRequest.id); setIsRequestModalOpen(false); }} className="bg-emerald-500 hover:bg-emerald-600 text-white">Talebi Onayla</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
