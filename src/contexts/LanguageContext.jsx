import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext(null);

export const TRANSLATIONS = {
  ar: {
    // Navigation
    navOverview: "لوحة التحكم",
    navCourses: "الدورات والمواد",
    navAttempts: "المحاولات والتقارير",
    navCreateCourse: "إنشاء دورة جديدة",
    navAnalytics: "التحليلات والأداء",
    navAdminPanel: "لوحة الإدارة",
    navUsers: "إدارة المستخدمين",
    navContent: "إدارة المحتوى",
    navSettings: "الإعدادات",
    navLogout: "تسجيل الخروج",

    // Roles
    roleAdmin: "مدير النظام",
    roleCreator: "منشئ محتوى",
    roleTrainee: "طالب / متدرب",
    roleGuest: "زائر",

    // Banner & Showcase
    bannerTag: "معرض الأعمال · Demo Mode",
    bannerDesc: "نسخة تفاعلية متكاملة دون الحاجة لسيرفر سحابي. يمكنك التبديل بين الأدوار فوراً:",
    bannerCurrentRole: "الصلاحية الحالية:",
    bannerReset: "إعادة ضبط",

    // General UI
    loginTitle: "تسجيل الدخول",
    loginSubtitle: "أدخل بيانات حسابك أو اختر الدخول السريع لمعرض الأعمال",
    emailLabel: "البريد الإلكتروني",
    passwordLabel: "كلمة المرور",
    forgotPassword: "نسيت كلمة المرور؟",
    loginBtn: "دخول",
    loggingIn: "جاري التحقق...",
    registerPrompt: "ليس لديك حساب؟",
    registerBtn: "تسجيل حساب جديد",
    quickDemoTitle: "الدخول السريع لمعرض الأعمال (1-Click Demo)",
    quickDemoSubtitle: "استكشف كل جانب من المنصة بنقرة واحدة بحساب تجريبي مسبق التهيئة:",

    // Trainee Dashboard
    exploreCategories: "استكشف التخصصات",
    viewAll: "عرض الكل",
    recommendedCourses: "الدورات والمقابلات المقترحة",
    startCourse: "بدء التدريب",
    inspectCourse: "معاينة الدورة",
    coursesCount: "دورات متاحة",
    questionsCount: "سؤال",

    // Interview
    voiceAnswer: "الإجابة الصوتية",
    recordingInProgress: "جاري تسجيل الصوت...",
    startRecording: "بدء التسجيل",
    stopRecording: "إيقاف التسجيل",
    submitAnswer: "حفظ الإجابة والمتابعة",
    finishInterview: "إنهاء المقابلة واستخراج التقرير",
    timeLeft: "متبقي",
    speechLanguage: "لغة المحادثة الصوتية",

    // Report
    performanceReport: "تقرير تقييم الأداء",
    overallScore: "الدرجة الكلية",
    strengths: "أبرز نقاط القوة",
    weaknesses: "نقاط تتطلب التطوير",
    suggestions: "توصيات الذكاء الاصطناعي للتحسين",
    tryAgain: "إعادة المحاولة",
    newCourse: "دورة جديدة",

    // Theme & Settings
    appearance: "المظهر وتخصيص الألوان",
    themeLight: "النمط الفاتح",
    themeDark: "النمط الليلي",
    audioTest: "اختبار الميكروفون",
    testMicBtn: "فحص الصوت الآن",

    // Admin Dashboard
    adminTitle: "لوحة تحكم الإدارة",
    adminSubtitle: "إدارة المستخدمين، طلبات الانضمام، والمحتوى التدريبي في المنصة",
    tabOverview: "نظرة عامة",
    tabUsers: "المستخدمين",
    tabRequests: "الطلبات",
    tabCourses: "المسارات التدريبية",
    statTotalUsers: "إجمالي المستخدمين",
    statPendingRequests: "الطلبات المعلقة",
    statActiveCourses: "المسارات النشطة",
    statSystemStatus: "حالة النظام",
    recentUsers: "المستخدمون المنضمون حديثاً",
    recentCourses: "أحدث المسارات التدريبية",
    emptyUsers: "لا يوجد مستخدمون حالياً.",
    emptyCourses: "لا توجد مسارات تدريبية.",
    emptyRequests: "لا توجد طلبات معلقة.",
    approveBtn: "موافقة وقبول",
    detailsBtn: "التفاصيل",
    addCourseBtn: "إضافة مسار تدريبي",
    colName: "الاسم",
    colEmail: "البريد الإلكتروني",
    colRole: "الصلاحية",
    colActions: "الإجراءات",
    colTitle: "العنوان",
    colCategory: "التخصص / الفئة",
    colType: "النوع",
    typeGeneral: "عام",
    typeSpecialized: "مخصص",

    // Creator Dashboard
    creatorTitle: "لوحة تحكم منشئ المحتوى",
    creatorSubtitle: "إدارة مساراتك التدريبية ومتابعة أداء واختبارات المتدربين",
    creatorApprovedNotice: "حسابك معتمد ومفعل بالكامل",
    creatorPendingNotice: "حسابك قيد مراجعة الإدارة",
    creatorPendingDesc: "حساب منشئ المحتوى قيد المراجعة حالياً من قبل الإدارة. في وضع المعرض يمكنك إنشاء وتعديل المسارات بحرية.",
    newCourseBtn: "مسار جديد",
    publishedCourses: "المسارات المنشورة",
    totalQuestions: "إجمالي الأسئلة",

    // Courses & Attempts
    coursesLibrary: "مكتبة المسارات والمقابلات",
    coursesSubtitle: "اختر مسارك المهني وابدأ محاكاة المقابلة بالذكاء الاصطناعي",
    searchPlaceholder: "ابحث عن مسار، تقنية أو مهارة...",
    allCategories: "الكل",
    startTraining: "بدء المقابلة",
    attemptsTitle: "سجل المقابلات والمحاولات",
    attemptsSubtitle: "راجع أداءك السابق وتقييمات الذكاء الاصطناعي الصوتية",
    noAttemptsYet: "لا توجد مقابلات مكتملة بعد",
    noAttemptsDesc: "ابدأ أول مقابلة تجريبية بالذكاء الاصطناعي من صفحة المسارات للاطلاع على تقريرك.",
    browseCourses: "تصفح المسارات الآن",
    scoreExcellent: "ممتاز",
    scoreGood: "جيد جداً",
    scoreNeedsImprovement: "يحتاج تطوير",
    questionsBreakdown: "تقييم الأسئلة بالتفصيل"
  },

  en: {
    // Navigation
    navOverview: "Dashboard",
    navCourses: "Courses",
    navAttempts: "My Attempts",
    navCreateCourse: "Create Course",
    navAnalytics: "Analytics",
    navAdminPanel: "Admin Portal",
    navUsers: "User Management",
    navContent: "Manage Content",
    navSettings: "Settings",
    navLogout: "Log Out",

    // Roles
    roleAdmin: "Administrator",
    roleCreator: "Content Creator",
    roleTrainee: "Trainee Candidate",
    roleGuest: "Guest",

    // Banner & Showcase
    bannerTag: "Portfolio · Showcase Mode",
    bannerDesc: "Fully interactive showcase with simulated AI responses. Switch roles instantly:",
    bannerCurrentRole: "Current role:",
    bannerReset: "Reset Data",

    // General UI
    loginTitle: "Sign In",
    loginSubtitle: "Access your dashboard or use 1-click demo login below",
    emailLabel: "Email Address",
    passwordLabel: "Password",
    forgotPassword: "Forgot password?",
    loginBtn: "Sign In",
    loggingIn: "Signing in...",
    registerPrompt: "Don't have an account?",
    registerBtn: "Create an Account",
    quickDemoTitle: "1-Click Portfolio Demo Login",
    quickDemoSubtitle: "Instantly explore any workflow with pre-configured accounts:",

    // Trainee Dashboard
    exploreCategories: "Explore Categories",
    viewAll: "View All",
    recommendedCourses: "Recommended Tracks & Interviews",
    startCourse: "Start Interview",
    inspectCourse: "Inspect Track",
    coursesCount: "tracks available",
    questionsCount: "questions",

    // Interview
    voiceAnswer: "Voice Answer",
    recordingInProgress: "Recording in progress...",
    startRecording: "Start Voice Answer",
    stopRecording: "Stop & Transcribe",
    submitAnswer: "Save Answer & Next",
    finishInterview: "Complete Interview & Get Report",
    timeLeft: "remaining",
    speechLanguage: "Voice Recognition Language",

    // Report
    performanceReport: "AI Performance Report",
    overallScore: "Overall Score",
    strengths: "Key Strengths",
    weaknesses: "Areas for Growth",
    suggestions: "AI Actionable Recommendations",
    tryAgain: "Try Again",
    newCourse: "Browse Tracks",

    // Theme & Settings
    appearance: "Appearance & Theme",
    themeLight: "Light Mode",
    themeDark: "Dark Mode",
    audioTest: "Microphone Diagnostics",
    testMicBtn: "Test Microphone Now",

    // Admin Dashboard
    adminTitle: "Admin Portal",
    adminSubtitle: "Manage platform users, registration requests, and curriculum",
    tabOverview: "Overview",
    tabUsers: "Users",
    tabRequests: "Requests",
    tabCourses: "Courses",
    statTotalUsers: "Total Users",
    statPendingRequests: "Pending Requests",
    statActiveCourses: "Active Courses",
    statSystemStatus: "System Status",
    recentUsers: "Recently Joined Users",
    recentCourses: "Latest Curriculum Tracks",
    emptyUsers: "No users found.",
    emptyCourses: "No courses found.",
    emptyRequests: "No pending requests.",
    approveBtn: "Approve Request",
    detailsBtn: "Details",
    addCourseBtn: "Add Course",
    colName: "Name",
    colEmail: "Email",
    colRole: "Role",
    colActions: "Actions",
    colTitle: "Title",
    colCategory: "Specialty / Category",
    colType: "Type",
    typeGeneral: "General",
    typeSpecialized: "Specialized",

    // Creator Dashboard
    creatorTitle: "Creator Dashboard",
    creatorSubtitle: "Manage your courses, assessment questions, and track trainee progress",
    creatorApprovedNotice: "Your account is verified and fully active",
    creatorPendingNotice: "Account Pending Admin Approval",
    creatorPendingDesc: "Creator account is awaiting review. In showcase mode, course creation and updates remain fully enabled.",
    newCourseBtn: "New Course",
    publishedCourses: "Published Courses",
    totalQuestions: "Total Questions",

    // Courses & Attempts
    coursesLibrary: "Courses & Interviews Library",
    coursesSubtitle: "Select your engineering track and practice realistic AI interviews",
    searchPlaceholder: "Search track, tech stack, or skill...",
    allCategories: "All Tracks",
    startTraining: "Start Interview",
    attemptsTitle: "Interview Attempts & History",
    attemptsSubtitle: "Review your past mock sessions and automated AI evaluations",
    noAttemptsYet: "No interview attempts yet",
    noAttemptsDesc: "Start your first AI mock interview from the Courses page to generate your score report.",
    browseCourses: "Browse Courses Now",
    scoreExcellent: "Excellent",
    scoreGood: "Good",
    scoreNeedsImprovement: "Needs Growth",
    questionsBreakdown: "Question Breakdown"
  },

  tr: {
    // Navigation
    navOverview: "Ana Panel",
    navCourses: "Eğitimlerim",
    navAttempts: "Denemelerim",
    navCreateCourse: "Kurs Oluştur",
    navAnalytics: "Analizler",
    navAdminPanel: "Yönetici Paneli",
    navUsers: "Kullanıcılar",
    navContent: "İçerikler",
    navSettings: "Ayarlar",
    navLogout: "Çıkış Yap",

    // Roles
    roleAdmin: "Sistem Yöneticisi",
    roleCreator: "İçerik Üretici",
    roleTrainee: "Öğrenci / Kursiyer",
    roleGuest: "Misafir",

    // Banner & Showcase
    bannerTag: "Portföy · Demo Modu",
    bannerDesc: "Bulut sunucusuz etkileşimli portföy demosu. Rolleri hemen test edebilirsiniz:",
    bannerCurrentRole: "Mevcut rol:",
    bannerReset: "Sıfırla",

    // General UI
    loginTitle: "Giriş Yap",
    loginSubtitle: "Hesabınıza erişmek için bilgilerinizi girin veya hızlı demoyu seçin",
    emailLabel: "E-posta Adresi",
    passwordLabel: "Şifre",
    forgotPassword: "Şifremi unuttum",
    loginBtn: "Giriş Yap",
    loggingIn: "Giriş yapılıyor...",
    registerPrompt: "Hesabınız yok mu?",
    registerBtn: "Kayıt Ol",
    quickDemoTitle: "Portföy Hızlı Girişi (1-Click Demo)",
    quickDemoSubtitle: "Herhangi bir rolü önceden yapılandırılmış hesaplarla anında keşfedin:",

    // Trainee Dashboard
    exploreCategories: "Kategorileri Keşfet",
    viewAll: "Tümünü Gör",
    recommendedCourses: "Önerilen Eğitimler",
    startCourse: "Eğitime Başla",
    inspectCourse: "Eğitimi İncele",
    coursesCount: "eğitim",
    questionsCount: "Soru",

    // Interview
    voiceAnswer: "Sesli Yanıt",
    recordingInProgress: "Kayıt Yapılıyor...",
    startRecording: "Kaydı Başlat",
    stopRecording: "Kaydı Durdur",
    submitAnswer: "Cevabı Kaydet ve İlerle",
    finishInterview: "Mülakatı Bitir ve Rapor Al",
    timeLeft: "kaldı",
    speechLanguage: "Ses Tanıma Dili",

    // Report
    performanceReport: "Performans Raporu",
    overallScore: "Toplam Puan",
    strengths: "Güçlü Yönler",
    weaknesses: "Geliştirilecek Alanlar",
    suggestions: "Yapay Zeka Önerileri",
    tryAgain: "Tekrar Dene",
    newCourse: "Yeni Eğitim",

    // Theme & Settings
    appearance: "Görünüm ve Tema",
    themeLight: "Açık Tema",
    themeDark: "Koyu Tema",
    audioTest: "Mikrofon Testi",
    testMicBtn: "Mikrofonu Şimdi Test Et",

    // Admin Dashboard
    adminTitle: "Yönetici Paneli",
    adminSubtitle: "Kullanıcıları, kayıt taleplerini ve platform içeriklerini yönetin",
    tabOverview: "Genel Bakış",
    tabUsers: "Kullanıcılar",
    tabRequests: "Talepler",
    tabCourses: "Eğitimler",
    statTotalUsers: "Toplam Kullanıcı",
    statPendingRequests: "Bekleyen Talepler",
    statActiveCourses: "Aktif Eğitimler",
    statSystemStatus: "Sistem Durumu",
    recentUsers: "Yeni Kayıt Olan Kullanıcılar",
    recentCourses: "Son İçerikler",
    emptyUsers: "Kullanıcı bulunamadı.",
    emptyCourses: "Eğitim bulunamadı.",
    emptyRequests: "Bekleyen talep yok.",
    approveBtn: "Onayla",
    detailsBtn: "Detaylar",
    addCourseBtn: "Eğitim Ekle",
    colName: "İsim",
    colEmail: "E-posta",
    colRole: "Rol",
    colActions: "İşlemler",
    colTitle: "Başlık",
    colCategory: "Uzmanlık / Kategori",
    colType: "Tür",
    typeGeneral: "Genel",
    typeSpecialized: "Özel",

    // Creator Dashboard
    creatorTitle: "Eğitmen Paneli",
    creatorSubtitle: "Eğitimlerinizi yönetin ve öğrenci etkileşimini takip edin",
    creatorApprovedNotice: "Hesabınız onaylandı",
    creatorPendingNotice: "Hesabınız Onay Bekliyor",
    creatorPendingDesc: "İçerik üretici hesabınız onay sürecinde. Portföy demo modunda tüm eğitim oluşturma özellikleri açıktır.",
    newCourseBtn: "Yeni Eğitim",
    publishedCourses: "Yayınlanan Eğitimler",
    totalQuestions: "Toplam Soru",

    // Courses & Attempts
    coursesLibrary: "Eğitim Kütüphanesi",
    coursesSubtitle: "Tüm kategorilerdeki eğitimleri keşfedin ve yapay zeka mülakatlarına katılın",
    searchPlaceholder: "Eğitim, konu veya beceri ara...",
    allCategories: "Tümü",
    startTraining: "Eğitime Başla",
    attemptsTitle: "Mülakat Geçmişi",
    attemptsSubtitle: "Geçmiş performansınızı ve yapay zeka değerlendirmelerini inceleyin",
    noAttemptsYet: "Henüz Deneme Yok",
    noAttemptsDesc: "Henüz hiçbir eğitim mülakatını tamamlamadınız. İlk oturumunuzu başlatmak için Eğitimler bölümüne gidin.",
    browseCourses: "Eğitimlere Göz At",
    scoreExcellent: "Mükemmel",
    scoreGood: "Yeterli",
    scoreNeedsImprovement: "Geliştirilmeli",
    questionsBreakdown: "Soru Soru Değerlendirme"
  }
};

export function LanguageProvider({ children, defaultLanguage = "ar" }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const stored = localStorage.getItem("app_language");
      if (stored && ["ar", "en", "tr"].includes(stored)) return stored;
    } catch {}
    return defaultLanguage;
  });

  const setLanguage = (lang) => {
    if (!["ar", "en", "tr"].includes(lang)) return;
    setLanguageState(lang);
    try {
      localStorage.setItem("app_language", lang);
    } catch {}
  };

  useEffect(() => {
    const root = document.documentElement;
    root.lang = language;
    root.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const t = (key) => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS["ar"]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir: language === "ar" ? "rtl" : "ltr" }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
