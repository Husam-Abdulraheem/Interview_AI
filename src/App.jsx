import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, useLocation, Router as WouterRouter } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AppProvider, useApp } from "./contexts/AppContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import PortfolioBanner from "./components/PortfolioBanner";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import RegisterSelection from "./pages/RegisterSelection";
import RegisterTrainee from "./pages/RegisterTrainee";
import RegisterCreator from "./pages/RegisterCreator";
import DashboardTrainee from "./pages/DashboardTrainee";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardCreator from "./pages/DashboardCreator";
import Courses from "./pages/Courses";
import Study from "./pages/Study";
import Interview from "./pages/Interview";
import Loading from "./pages/Loading";
import Report from "./pages/Report";
import Attempts from "./pages/Attempts";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { toast } from "sonner";

// Role-Aware Protected Route Wrapper
function ProtectedRoute({ component: Component, allowedRoles }) {
  const { user } = useApp();
  const [, navigate] = useLocation();

  if (!user) {
    navigate("/login");
    return null;
  }

  // Check role if allowedRoles specified
  if (allowedRoles && allowedRoles.length > 0) {
    const userRoleNum = parseInt(user.role, 10);
    const hasRole = allowedRoles.some(r => {
      if (typeof r === "number") return r === userRoleNum;
      if (typeof r === "string") {
        if (r === "admin") return userRoleNum === 0 || userRoleNum === 1;
        if (r === "creator") return userRoleNum === 2;
        if (r === "trainee") return userRoleNum === 3;
      }
      return false;
    });

    if (!hasRole) {
      toast.warning("هذه الصفحة مخصصة لصلاحية أخرى. يمكنك التبديل من شريط العرض في الأعلى.");
      if (userRoleNum === 0 || userRoleNum === 1) navigate("/dashboard/admin");
      else if (userRoleNum === 2) navigate("/dashboard/creator");
      else navigate("/dashboard/trainee");
      return null;
    }
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={RegisterSelection} />
      <Route path="/register/trainee" component={RegisterTrainee} />
      <Route path="/register/creator" component={RegisterCreator} />

      {/* Trainee Routes */}
      <Route path="/dashboard/trainee" component={() => <ProtectedRoute component={DashboardTrainee} allowedRoles={["trainee", "admin"]} />} />
      <Route path="/courses" component={() => <ProtectedRoute component={Courses} />} />
      <Route path="/study/:courseId" component={() => <ProtectedRoute component={Study} />} />
      <Route path="/interview/:courseId" component={() => <ProtectedRoute component={Interview} />} />
      <Route path="/loading" component={() => <ProtectedRoute component={Loading} />} />
      <Route path="/attempts" component={() => <ProtectedRoute component={Attempts} />} />
      <Route path="/report/:attemptId" component={() => <ProtectedRoute component={Report} />} />

      {/* Creator Routes */}
      <Route path="/dashboard/creator" component={() => <ProtectedRoute component={DashboardCreator} allowedRoles={["creator", "admin"]} />} />
      <Route path="/creator/courses" component={() => <ProtectedRoute component={DashboardCreator} allowedRoles={["creator", "admin"]} />} />
      <Route path="/creator/analytics" component={() => <ProtectedRoute component={Analytics} allowedRoles={["creator", "admin"]} />} />

      {/* Admin Routes */}
      <Route path="/dashboard/admin" component={() => <ProtectedRoute component={DashboardAdmin} allowedRoles={["admin"]} />} />
      <Route path="/admin/users" component={() => <ProtectedRoute component={DashboardAdmin} allowedRoles={["admin"]} />} />
      <Route path="/admin/content" component={() => <ProtectedRoute component={DashboardAdmin} allowedRoles={["admin"]} />} />
      <Route path="/admin/analytics" component={() => <ProtectedRoute component={Analytics} allowedRoles={["admin"]} />} />

      {/* Shared Protected Routes */}
      <Route path="/settings" component={() => <ProtectedRoute component={Settings} />} />

      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Detect if app is hosted under /demo/interview-ai or similar subpath
  const getBasePath = () => {
    if (typeof window === "undefined") return "";
    const pathname = window.location.pathname;
    if (pathname.startsWith("/demo/interview-ai")) return "/demo/interview-ai";
    return "";
  };

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AppProvider>
          <ThemeProvider defaultTheme="light">
            <TooltipProvider>
              <Toaster position="top-right" richColors />
              <WouterRouter base={getBasePath()}>
                <PortfolioBanner />
                <Router />
              </WouterRouter>
            </TooltipProvider>
          </ThemeProvider>
        </AppProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
