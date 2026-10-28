# 🎙️ InterviewAI — AI-Powered Technical Interview & Training Platform

> **Interactive Portfolio Showcase Edition**  
> A modern SaaS platform designed to conduct AI-driven simulated technical interviews, convert speech to text in real-time, generate detailed performance evaluation reports, and manage multi-role workflows (Trainee, Creator, and Administrator).

---

## 🌟 Highlights & Key Features

- **⚡ 1-Click Showcase Demo Mode:** Explore every corner of the platform without needing a backend server or creating an account. Switch between **Trainee**, **Creator**, and **Admin** roles with one click.
- **🎙️ Real-time Speech-to-Text (Web Speech API):** Speak directly into your microphone in Arabic, English, or Turkish. Responses are transcribed live with manual text refinement support.
- **⏱️ Timed Simulation & Waveform Visualizer:** Realistic question countdown timers and animated sound wave visualizers.
- **📊 AI Evaluation & Scoring Engine:** Computes percentage scores, highlights technical strengths, identifies weaknesses, and delivers actionable recommendations for improvement.
- **🛡️ Multi-Role Architecture:**
  - **Trainee:** Browse curated tracks, study course materials & video lectures, take voice interviews, and view history reports.
  - **Creator:** Build courses, manage questions, embed YouTube lectures, and monitor content analytics.
  - **Administrator:** Approve creator applications, adjust user roles, and govern platform content.
- **🌓 Light & Dark Theme:** Custom SaaS styling powered by Tailwind CSS v4 and Radix UI.
- **📈 Data Visualization:** Interactive charts powered by Recharts for category distribution, growth, and candidate performance.

---

## 🛠️ Tech Stack

| Domain | Technology |
| :--- | :--- |
| **Framework** | [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) |
| **Styling & Design** | [Tailwind CSS v4](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/) |
| **Routing** | [Wouter](https://github.com/molefrog/wouter) (Ultra-lightweight router) |
| **Voice & Speech** | Native Browser Web Speech API (`SpeechRecognition`) |
| **Charts & Analytics** | [Recharts](https://recharts.org/) |
| **Forms & Validation** | [Formik](https://formik.org/) + [Yup](https://github.com/jquense/yup) |
| **Testing** | [Vitest](https://vitest.dev/) |

---

## 🚀 Quick Start (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/Ali-Alahdal/Interview_AI.git
cd Interview_AI
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run automated tests
```bash
npm test
```

### 5. Build for production
```bash
npm run build
```

---

## 🌐 Deploy to Vercel / Netlify (Free Hosting)

Since this version includes an intelligent client-side simulation store (`mockStore` with `localStorage` persistence), you can deploy it **100% free with zero backend hosting costs** to:

- **[Vercel](https://vercel.com):** Import Git repo, select Vite preset, and click **Deploy**.
- **[Netlify](https://netlify.com):** Build command: `npm run build`, Publish directory: `dist`.
- **[GitHub Pages](https://pages.github.com):** Build and host directly from GitHub Actions.

---

## 📁 Project Architecture

```
Interview_AI/
├── src/
│   ├── components/         # Reusable UI primitives (Radix UI) & Layouts
│   │   ├── DashboardLayout.jsx   # Role-aware sidebar layout
│   │   └── PortfolioBanner.jsx   # Top interactive demo switcher
│   ├── contexts/           # AppState (User, Course, Attempts) & Theme
│   ├── pages/              # Platform views
│   │   ├── Landing.jsx           # Hero & value proposition
│   │   ├── Login.jsx             # 1-Click demo logins & credentials
│   │   ├── DashboardTrainee.jsx  # Student dashboard
│   │   ├── DashboardCreator.jsx  # Course creator studio
│   │   ├── DashboardAdmin.jsx    # System admin portal
│   │   ├── Interview.jsx         # Speech-enabled interview simulator
│   │   ├── Report.jsx            # Score breakdowns & AI feedback
│   │   ├── Attempts.jsx          # Performance history
│   │   ├── Analytics.jsx         # Visual platform charts
│   │   └── Settings.jsx          # Profile, theme & mic test
│   ├── services/
│   │   ├── api.js                # Centralized Axios client with mock fallback
│   │   ├── mockData.js           # Realistic data store with local persistence
│   │   └── mockData.test.js      # Vitest test suite
│   ├── utils/              # Helper utilities & course categories
│   ├── App.jsx             # Role-based protected routing
│   └── main.jsx            # React root entrypoint
├── index.html
├── package.json
└── vite.config.js
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
