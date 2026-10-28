/**
 * Mock Data & Local Store for Portfolio Showcase / Demo Mode
 * Provides rich, realistic data for Trainee, Creator, and Admin roles
 * with local persistence so visitors can test CRUD operations seamlessly.
 */

const STORAGE_KEYS = {
    COURSES: "interviewai_demo_courses",
    ATTEMPTS: "interviewai_demo_attempts",
    USERS: "interviewai_demo_users",
    REQUESTS: "interviewai_demo_requests",
    INITIALIZED: "interviewai_demo_initialized_v2"
};

export const DEMO_USERS = {
    admin: {
        id: "demo-user-admin",
        fullName: "مدير النظام (Admin Demo)",
        email: "admin@interviewai.demo",
        role: 0,
        roleName: "Super Admin",
        bio: "مدير منصة المقابلات والتدريب الذكي.",
        joinedAt: "2025-01-10T10:00:00.000Z"
    },
    creator: {
        id: "demo-user-creator",
        fullName: "سارة المهندس (Senior Tech Mentor)",
        email: "creator@interviewai.demo",
        role: 2,
        roleName: "Creator",
        bio: "مهندسة برمجيات أولى وموجهة تقنية لأكثر من 8 سنوات.",
        portfolioUrl: "https://github.com",
        youTubeUrl: "https://youtube.com",
        experienceYears: 8,
        joinedAt: "2025-02-15T12:00:00.000Z"
    },
    trainee: {
        id: "demo-user-trainee",
        fullName: "عمر خالد (Software Candidate)",
        email: "trainee@interviewai.demo",
        role: 3,
        roleName: "Trainee",
        bio: "مطور برمجيات طموح يستعد لمقابلات الشركات التقنية.",
        joinedAt: "2025-03-01T09:30:00.000Z"
    }
};

const DEFAULT_COURSES = [
    {
        id: "course-1-swe",
        title: "Software Engineering & System Design",
        description: "دليل شامل لاجتياز المقابلات الهندسية وتصميم الأنظمة الكبيرة ذات الموثوقية العالية والقابلية للتوسع.",
        specialty: "Software Engineering",
        category: "Software Engineering",
        isGeneral: false,
        creatorId: "demo-user-creator",
        youTubeVideoUrl: "https://www.youtube.com/watch?v=bUHFg8CZFCA",
        contentMaterial: `### محاور الدورة:
1. المبادئ الأساسية لتصميم النظم (CAP Theorem, ACID vs BASE).
2. استراتيجيات التوسع الأفقي والعمودي وقواعد البيانات الموزعة.
3. التخزين المؤقت (Caching Strategies) وموازنة الأحمال (Load Balancing).
4. أسلوب الإجابة المنهجي في مقابلات System Design.`,
        questions: [
            {
                id: "q-101",
                content: "اشرح الفرق بين Monolithic Architecture و Microservices، ومتى تفضل استخدام كل منهما؟",
                orderIndex: 0
            },
            {
                id: "q-102",
                content: "كيف تتعامل مع مشكلات الأداء وقابلية التوسع (Scalability) في قواعد البيانات عندما يتزايد عدد الاستعلامات بمعدل ضخم؟",
                orderIndex: 1
            },
            {
                id: "q-103",
                content: "تحدث عن موقف واجهتك فيه مشكلة برمجية معقدة في بيئة الإنتاج (Production)، وكيف قمت بتشخيصها وحلها؟",
                orderIndex: 2
            }
        ]
    },
    {
        id: "course-2-frontend",
        title: "Frontend Mastery: React & Modern Web Performance",
        description: "إتقان مفاهيم الواجهات الأمامية المتقدمة، تحسين سرعة الصفحات، وهندسة تطبيقات الويب الحديثة.",
        specialty: "Frontend Development",
        category: "Frontend Development",
        isGeneral: false,
        creatorId: "demo-user-creator",
        youTubeVideoUrl: "https://www.youtube.com/watch?v=w7ejDZ8SWv8",
        contentMaterial: `### محاور الدورة:
- المعالجة الداخلية لـ Virtual DOM و Reconciliation.
- تحسين مقاييس تجربة المستخدم Core Web Vitals (LCP, INP, CLS).
- أنماط إدارة الحالة المتقدمة وإدارة الذاكرة.`,
        questions: [
            {
                id: "q-201",
                content: "كيف تعمل آلية Virtual DOM في React لتحسين كفاءة إعادة التصيير (Re-rendering)، وما هي الحالات التي قد تسبب مشاكل أداء؟",
                orderIndex: 0
            },
            {
                id: "q-202",
                content: "ما هي استراتيجياتك العملية لتحسين مقاييس Core Web Vitals خاصة سرعة تحميل المحتوى الأكبر (LCP)؟",
                orderIndex: 1
            },
            {
                id: "q-203",
                content: "اشرح الفرق بين useMemo و useCallback وما هي المخاطر المصاحبة للإفراط في استخدامهما؟",
                orderIndex: 2
            }
        ]
    },
    {
        id: "course-3-behavioral",
        title: "Behavioral & Leadership: STAR Method Mastery",
        description: "كيف تجيب باحترافية على أسئلة المقابلات السلوكية والقيادية باستخدام تقنية STAR لإبهار مسؤولي التوظيف.",
        specialty: "General Interview Prep",
        category: "General Interview Prep",
        isGeneral: true,
        creatorId: "demo-user-creator",
        youTubeVideoUrl: "https://www.youtube.com/watch?v=8mR8zKCGs68",
        contentMaterial: `### هيكل إجابة STAR:
- **Situation (الموقف):** وضع السياق العام للمشكلة.
- **Task (المهمة):** تحديد مسؤوليتك المباشرة.
- **Action (الإجراء):** الخطوات الدقيقة التي اتخذتها.
- **Result (النتيجة):** الأثر القابل للقياس بالأرقام والإنجاز المحقق.`,
        questions: [
            {
                id: "q-301",
                content: "صف موقفاً اختلف فيه رأيك التقني مع أحد زملائك في الفريق أو مديرك، وكيف وصلت إلى حل توافقي مثمر؟",
                orderIndex: 0
            },
            {
                id: "q-302",
                content: "احكِ عن مشروع فشلت فيه في تحقيق موعد التسليم المحدد، كيف تصرفت وماذا تعلمت من تلك التجربة؟",
                orderIndex: 1
            },
            {
                id: "q-303",
                content: "كيف تدير أولوياتك وتتجنب الضغط النفسي عند تراكم مهام عاجلة متعددة في نفس الوقت؟",
                orderIndex: 2
            }
        ]
    },
    {
        id: "course-4-devops",
        title: "DevOps, CI/CD & Cloud Infrastructure",
        description: "تدريب تطبيقي على خطوط النشر المؤتمتة، إدارة الحاويات عبر Docker و Kubernetes، ومفاهيم الحوسبة السحابية.",
        specialty: "DevOps",
        category: "DevOps",
        isGeneral: false,
        creatorId: "demo-user-creator",
        youTubeVideoUrl: "https://www.youtube.com/watch?v=X48VuDVv0do",
        contentMaterial: `### محاور الدورة:
- الحاويات مقابل الأجهزة الافتراضية.
- بناء أنابيب CI/CD خالية من الانقطاع (Zero-downtime deployment).
- المراقبة والتنبيهات (Observability & Monitoring).`,
        questions: [
            {
                id: "q-401",
                content: "ما هو الفرق الجوهري بين Containerization والـ Virtualization ومتى تفضل الحاويات؟",
                orderIndex: 0
            },
            {
                id: "q-402",
                content: "كيف تقوم بإعداد خط أنابيب CI/CD آمن يضمن فحص جودة الكود ونشره للإنتاج بسلاسة؟",
                orderIndex: 1
            }
        ]
    },
    {
        id: "course-5-datascience",
        title: "Data Science & Machine Learning Foundations",
        description: "استعداد كامل لمقابلات علم البيانات: تنظيف البيانات، هندسة الميزات، واختيار النماذج المناسبة.",
        specialty: "Data Science",
        category: "Data Science",
        isGeneral: false,
        creatorId: "demo-user-creator",
        youTubeVideoUrl: "https://www.youtube.com/watch?v=GwIo3gDZCVQ",
        contentMaterial: `### محاور علم البيانات:
- معالجة البيانات غير المتوازنة (Imbalanced Data).
- المفاضلة بين دقة النموذج (Bias vs Variance Tradeoff).
- مقاييس تقييم النماذج في بيئات العمل الحقيقية.`,
        questions: [
            {
                id: "q-501",
                content: "ما هو الفرق بين Overfitting و Underfitting وكيف تتعامل معهما عملياً؟",
                orderIndex: 0
            },
            {
                id: "q-502",
                content: "متى تفضل استخدام مقياس Precision على Recall والعكس في تصنيف البيانات؟",
                orderIndex: 1
            }
        ]
    }
];

const DEFAULT_ATTEMPTS = [
    {
        id: "attempt-demo-1",
        courseId: "course-1-swe",
        userId: "demo-user-trainee",
        startedAt: "2025-03-20T14:10:00.000Z",
        completedAt: "2025-03-20T14:25:00.000Z",
        totalScore: 84,
        course: {
            id: "course-1-swe",
            title: "Software Engineering & System Design",
            specialty: "Software Engineering"
        },
        questionAttempts: [
            {
                id: "qa-1",
                questionId: "q-101",
                question: { content: "اشرح الفرق بين Monolithic Architecture و Microservices، ومتى تفضل استخدام كل منهما؟" },
                traineeAnswer: "المونوليث هو تطبيق ككتلة واحدة مناسب للبدايات والفرق الصغيرة، بينما المايكروسيرفسز توزع المهام على خدمات مستقلة لتسهيل التوسع.",
                score: 88,
                generalFeedback: "إجابة ممتازة وواضحة تركز على متطلبات التوسع وحجم الفريق.",
                strengths: ["وضوح في المفاهيم الأساسية", "ربط الاختيار بحجم ونمو الفريق التقني"],
                weaknesses: ["يمكن إضافة مزيد من التفاصيل حول تعقيدات شبكات الاتصال والـ Service Discovery"],
                suggestions: ["راجع نمط Database per service للمزيد من التعمق"]
            },
            {
                id: "qa-2",
                questionId: "q-102",
                question: { content: "كيف تتعامل مع مشكلات الأداء وقابلية التوسع (Scalability) في قواعد البيانات؟" },
                traineeAnswer: "أقوم بإضافة فهارس مدروسة، استخدام التخزين المؤقت Redis، وتقسيم القراءة والكتابة Read Replicas.",
                score: 80,
                generalFeedback: "حلول تقنية عملية وصائبة تغطي الجوانب الأساسية للأداء.",
                strengths: ["اقتراح Redis للتخزين المؤقت", "استخدام Read Replicas"],
                weaknesses: ["لم يتم التطرق لمفهوم الـ Database Sharding"],
                suggestions: ["تطرق دائماً إلى Sharding و Partitioning عند الحديث عن البيانات الضخمة جداً"]
            }
        ]
    },
    {
        id: "attempt-demo-2",
        courseId: "course-3-behavioral",
        userId: "demo-user-trainee",
        startedAt: "2025-03-22T16:00:00.000Z",
        completedAt: "2025-03-22T16:15:00.000Z",
        totalScore: 92,
        course: {
            id: "course-3-behavioral",
            title: "Behavioral & Leadership: STAR Method Mastery",
            specialty: "General Interview Prep"
        },
        questionAttempts: [
            {
                id: "qa-3",
                questionId: "q-301",
                question: { content: "صف موقفاً اختلف فيه رأيك التقني مع أحد زملائك، وكيف وصلت إلى حل؟" },
                traineeAnswer: "في مشروعي السابق، اختلفنا حول اختيار تقنية إدارة الحالة. قمت بإنشاء Proof of Concept مبسط لمقارنة الأداء، وبناءً على البيانات اتفقنا على الخيار الأنسب.",
                score: 92,
                generalFeedback: "تطبيق نموذجي لطريقة STAR مع التركيز على اتخاذ القرار بناءً على البيانات والتجارب العملية.",
                strengths: ["الاعتماد على التجربة العملية (PoC) بدلاً من الجدال النظري", "روح قيادية وتعاونية"],
                weaknesses: [],
                suggestions: ["حافظ على هذا الأسلوب الدبلوماسي في الإجابات القيادية"]
            }
        ]
    }
];

const DEFAULT_USERS_LIST = [
    {
        id: "user-1",
        fullName: "محمد القحطاني",
        email: "m.qahtani@example.com",
        role: 3,
        roleName: "Trainee",
        status: "Active",
        createdAt: "2025-01-12T08:00:00.000Z"
    },
    {
        id: "user-2",
        fullName: "سارة المهندس",
        email: "sara.mentor@example.com",
        role: 2,
        roleName: "Creator",
        status: "Active",
        bio: "Senior Software Engineer & Mentor",
        experienceYears: 8,
        createdAt: "2025-02-01T10:30:00.000Z"
    },
    {
        id: "user-3",
        fullName: "خالد بن ناصر",
        email: "khaled.admin@example.com",
        role: 1,
        roleName: "Admin",
        status: "Active",
        createdAt: "2024-12-01T14:00:00.000Z"
    },
    {
        id: "user-4",
        fullName: "ياسمين السعيد",
        email: "yasmin.dev@example.com",
        role: 3,
        roleName: "Trainee",
        status: "Active",
        createdAt: "2025-03-05T11:20:00.000Z"
    }
];

const DEFAULT_REQUESTS = [
    {
        id: "req-1",
        userId: "user-pending-1",
        fullName: "طارق حسام",
        email: "tariq.hossam@example.com",
        role: 2,
        bio: "مهندس سحابي متخصص في AWS و Kubernetes، أرغب في تقديم تدريبات ومقابلات للمرشحين الجدد.",
        experienceYears: 6,
        portfolioUrl: "https://linkedin.com",
        status: "Pending",
        requestedAt: "2025-03-24T15:45:00.000Z"
    },
    {
        id: "req-2",
        userId: "user-pending-2",
        fullName: "نور العبدالله",
        email: "nour.abdullah@example.com",
        role: 2,
        bio: "مديرة منتج تقني، قمت بإدارة دورات حياة منتجات رقمية في شركات ناشئة.",
        experienceYears: 5,
        portfolioUrl: "https://github.com",
        status: "Pending",
        requestedAt: "2025-03-25T09:15:00.000Z"
    }
];

const memoryStore = {};

function safeGetItem(key) {
    try {
        if (typeof localStorage !== "undefined") return localStorage.getItem(key);
    } catch {}
    return memoryStore[key] ?? null;
}

function safeSetItem(key, value) {
    try {
        if (typeof localStorage !== "undefined") {
            localStorage.setItem(key, value);
            return;
        }
    } catch {}
    memoryStore[key] = value;
}

function safeRemoveItem(key) {
    try {
        if (typeof localStorage !== "undefined") {
            localStorage.removeItem(key);
            return;
        }
    } catch {}
    delete memoryStore[key];
}

function getFromStorage(key, fallback) {
    try {
        const item = safeGetItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch {
        return fallback;
    }
}

function setToStorage(key, data) {
    try {
        safeSetItem(key, JSON.stringify(data));
    } catch (e) {
        console.warn("Storage error", e);
    }
}

export function initDemoStore() {
    const initialized = safeGetItem(STORAGE_KEYS.INITIALIZED);
    if (!initialized) {
        setToStorage(STORAGE_KEYS.COURSES, DEFAULT_COURSES);
        setToStorage(STORAGE_KEYS.ATTEMPTS, DEFAULT_ATTEMPTS);
        setToStorage(STORAGE_KEYS.USERS, DEFAULT_USERS_LIST);
        setToStorage(STORAGE_KEYS.REQUESTS, DEFAULT_REQUESTS);
        safeSetItem(STORAGE_KEYS.INITIALIZED, "true");
    }
}

export const mockStore = {
    // Courses
    getCourses: () => {
        initDemoStore();
        return getFromStorage(STORAGE_KEYS.COURSES, DEFAULT_COURSES);
    },
    getCourseById: (id) => {
        const courses = mockStore.getCourses();
        return courses.find(c => c.id === id) || courses[0];
    },
    getMyCourses: (creatorId) => {
        const courses = mockStore.getCourses();
        return courses.filter(c => !creatorId || c.creatorId === creatorId || c.creatorId === "demo-user-creator");
    },
    saveCourse: (courseData) => {
        const courses = mockStore.getCourses();
        const newCourse = {
            id: `course-${Date.now()}`,
            ...courseData,
            createdAt: new Date().toISOString(),
            questions: (courseData.questions || []).map((q, i) =>
                typeof q === "string" ? { id: `q-${Date.now()}-${i}`, content: q, orderIndex: i } : q
            )
        };
        const updated = [newCourse, ...courses];
        setToStorage(STORAGE_KEYS.COURSES, updated);
        return newCourse;
    },
    updateCourse: (id, courseData) => {
        const courses = mockStore.getCourses();
        const updated = courses.map(c => c.id === id ? { ...c, ...courseData } : c);
        setToStorage(STORAGE_KEYS.COURSES, updated);
        return updated.find(c => c.id === id);
    },
    deleteCourse: (id) => {
        const courses = mockStore.getCourses();
        const updated = courses.filter(c => c.id !== id);
        setToStorage(STORAGE_KEYS.COURSES, updated);
        return true;
    },

    // Questions inside course
    addQuestionsToCourse: (courseId, questionStrings) => {
        const courses = mockStore.getCourses();
        const updated = courses.map(c => {
            if (c.id === courseId) {
                const currentQs = c.questions || [];
                const newQs = questionStrings.map((str, i) => ({
                    id: `q-${Date.now()}-${i}`,
                    content: str,
                    orderIndex: currentQs.length + i
                }));
                return { ...c, questions: [...currentQs, ...newQs] };
            }
            return c;
        });
        setToStorage(STORAGE_KEYS.COURSES, updated);
        return true;
    },
    updateQuestion: (questionId, data) => {
        const courses = mockStore.getCourses();
        const updated = courses.map(c => {
            if (c.questions?.some(q => q.id === questionId)) {
                return {
                    ...c,
                    questions: c.questions.map(q => q.id === questionId ? { ...q, ...data } : q)
                };
            }
            return c;
        });
        setToStorage(STORAGE_KEYS.COURSES, updated);
        return true;
    },
    deleteQuestion: (questionId) => {
        const courses = mockStore.getCourses();
        const updated = courses.map(c => ({
            ...c,
            questions: (c.questions || []).filter(q => q.id !== questionId)
        }));
        setToStorage(STORAGE_KEYS.COURSES, updated);
        return true;
    },

    // Attempts & Evaluation Simulation
    getAttempts: () => {
        initDemoStore();
        return getFromStorage(STORAGE_KEYS.ATTEMPTS, DEFAULT_ATTEMPTS);
    },
    getAttemptById: (id) => {
        const attempts = mockStore.getAttempts();
        return attempts.find(a => a.id === id) || attempts[0];
    },
    startAttempt: ({ courseId }) => {
        const course = mockStore.getCourseById(courseId);
        const newAttempt = {
            id: `attempt-${Date.now()}`,
            courseId,
            course,
            startedAt: new Date().toISOString(),
            completedAt: null,
            totalScore: 0,
            questionAttempts: []
        };
        const attempts = mockStore.getAttempts();
        setToStorage(STORAGE_KEYS.ATTEMPTS, [newAttempt, ...attempts]);
        return newAttempt;
    },
    submitAnswer: (attemptId, { questionId, answer }) => {
        const attempts = mockStore.getAttempts();
        const updated = attempts.map(att => {
            if (att.id === attemptId) {
                const existing = att.questionAttempts || [];
                const qObj = att.course?.questions?.find(q => q.id === questionId) || { content: "سؤال المقابلة" };
                
                // Smart score heuristic based on response quality & length
                const cleanLen = (answer || "").trim().length;
                let score = 70;
                let feedback = "إجابة جيدة تغطي المفاهيم الأساسية.";
                const strengths = ["محاولة جيدة وشجاعة في التعبير عن الفكرة"];
                const weaknesses = [];
                const suggestions = ["حاول دائماً تدعيم إجاباتك بأمثلة واقعية من مشاريعك السابقة"];

                if (cleanLen > 150) {
                    score = Math.min(96, 82 + Math.floor(Math.random() * 12));
                    feedback = "إجابة شاملة ومفصلة تعكس فهماً عميقاً للموضوع وخبرة تقنية جيدة.";
                    strengths.push("تغطية عميقة للجوانب التقنية", "تسلسل منطقي للأفكار والمفاهيم");
                } else if (cleanLen > 60) {
                    score = Math.min(85, 75 + Math.floor(Math.random() * 8));
                    feedback = "إجابة جيدة ولكن يمكن إثراؤها بمزيد من التفاصيل والحلول البديلة.";
                    strengths.push("إيصال الفكرة الأساسية باختصار");
                    weaknesses.push("الإجابة كانت مختصرة نوعاً ما ويمكن التوسع في الشرح");
                } else {
                    score = 60 + Math.floor(Math.random() * 8);
                    feedback = "الإجابة كانت مقتضبة جداً، ينصح بالتوسع وتقديم تفاصيل أكثر في المقابلات الحقيقية.";
                    weaknesses.push("قلة التفاصيل المقدمة", "غياب الأمثلة التوضيحية");
                }

                const newQa = {
                    id: `qa-${Date.now()}-${questionId}`,
                    questionId,
                    question: qObj,
                    traineeAnswer: answer,
                    score,
                    generalFeedback: feedback,
                    strengths,
                    weaknesses,
                    suggestions
                };

                return {
                    ...att,
                    questionAttempts: [...existing.filter(q => q.questionId !== questionId), newQa]
                };
            }
            return att;
        });
        setToStorage(STORAGE_KEYS.ATTEMPTS, updated);
        return true;
    },
    completeAttempt: (attemptId) => {
        const attempts = mockStore.getAttempts();
        const updated = attempts.map(att => {
            if (att.id === attemptId) {
                const qas = att.questionAttempts || [];
                const avgScore = qas.length > 0 
                    ? Math.round(qas.reduce((acc, q) => acc + (q.score || 75), 0) / qas.length)
                    : 78;
                return {
                    ...att,
                    completedAt: new Date().toISOString(),
                    totalScore: avgScore
                };
            }
            return att;
        });
        setToStorage(STORAGE_KEYS.ATTEMPTS, updated);
        return updated.find(a => a.id === attemptId);
    },

    // Users & Requests
    getUsers: () => {
        initDemoStore();
        return getFromStorage(STORAGE_KEYS.USERS, DEFAULT_USERS_LIST);
    },
    getRequests: () => {
        initDemoStore();
        return getFromStorage(STORAGE_KEYS.REQUESTS, DEFAULT_REQUESTS);
    },
    approveRequest: (requestId) => {
        const requests = mockStore.getRequests();
        const targetReq = requests.find(r => r.id === requestId);
        const remainingReqs = requests.filter(r => r.id !== requestId);
        setToStorage(STORAGE_KEYS.REQUESTS, remainingReqs);

        if (targetReq) {
            const users = mockStore.getUsers();
            const newUser = {
                id: targetReq.userId || `user-${Date.now()}`,
                fullName: targetReq.fullName,
                email: targetReq.email,
                role: 2,
                roleName: "Creator",
                bio: targetReq.bio,
                experienceYears: targetReq.experienceYears,
                status: "Active",
                createdAt: new Date().toISOString()
            };
            setToStorage(STORAGE_KEYS.USERS, [newUser, ...users]);
        }
        return true;
    },
    updateUserRole: (userId, newRole) => {
        const users = mockStore.getUsers();
        const roleInt = parseInt(newRole, 10);
        const roleNames = { 0: "Super Admin", 1: "Admin", 2: "Creator", 3: "Trainee" };
        const updated = users.map(u => u.id === userId ? { ...u, role: roleInt, roleName: roleNames[roleInt] || "User" } : u);
        setToStorage(STORAGE_KEYS.USERS, updated);
        return true;
    },
    deleteUser: (userId) => {
        const users = mockStore.getUsers();
        const updated = users.filter(u => u.id !== userId);
        setToStorage(STORAGE_KEYS.USERS, updated);
        return true;
    },

    resetAll: () => {
        safeRemoveItem(STORAGE_KEYS.COURSES);
        safeRemoveItem(STORAGE_KEYS.ATTEMPTS);
        safeRemoveItem(STORAGE_KEYS.USERS);
        safeRemoveItem(STORAGE_KEYS.REQUESTS);
        safeRemoveItem(STORAGE_KEYS.INITIALIZED);
        initDemoStore();
    }
};
