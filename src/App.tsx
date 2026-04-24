import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy } from "react";
import type { Location } from "react-router-dom";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import { ToastContainer } from "./components/core/Toast";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { GlobalNotificationListener } from "./components/shared/GlobalNotificationListener";
import { SessionWatcher } from "./components/shared/SessionWatcher";

const queryClient = new QueryClient();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lazyNamed = (factory: () => Promise<Record<string, any>>, name: string) =>
  lazy(async () => {
    const module = await factory();
    return { default: module[name] };
  });

const AuthLayout = lazyNamed(
  () => import("./components/layout/AuthLayout"),
  "AuthLayout",
);
const AuthModalLayout = lazyNamed(
  () => import("./components/layout/AuthModalLayout"),
  "AuthModalLayout",
);
const PatientLayout = lazyNamed(
  () => import("./components/layout/PatientLayout"),
  "PatientLayout",
);

const PatientLogin = lazyNamed(
  () => import("./pages/auth/PatientLogin"),
  "PatientLogin",
);
const PatientRegister = lazyNamed(
  () => import("./pages/auth/PatientRegister"),
  "PatientRegister",
);

const Dashboard = lazyNamed(
  () => import("./pages/patient/Dashboard"),
  "Dashboard",
);
const UploadFlow = lazyNamed(
  () => import("./pages/patient/UploadFlow"),
  "UploadFlow",
);
const EducationView = lazyNamed(
  () => import("./pages/patient/EducationView"),
  "EducationView",
);
const ScanHistory = lazyNamed(
  () => import("./pages/patient/ScanHistory"),
  "ScanHistory",
);

const LandingPage = lazyNamed(
  () => import("./pages/patient/LandingPage"),
  "LandingPage",
);
const PrivacyPolicy = lazyNamed(
  () => import("./pages/public/LegalPages"),
  "PrivacyPolicy",
);
const MedicalDisclaimer = lazyNamed(
  () => import("./pages/public/LegalPages"),
  "MedicalDisclaimer",
);
const TermsOfUse = lazyNamed(
  () => import("./pages/public/LegalPages"),
  "TermsOfUse",
);
const ContactPage = lazyNamed(
  () => import("./pages/public/ContactPage"),
  "ContactPage",
);
const AboutPage = lazyNamed(
  () => import("./pages/public/AboutPage"),
  "AboutPage",
);


function AppRoutes() {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location } | null;

  return (
    <>
      <Routes location={state?.backgroundLocation || location}>
        {/* Public Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<PatientLogin />} />
          <Route path="/register" element={<PatientRegister />} />
        </Route>

        {/* Secure Patient Routing */}
        <Route element={<ProtectedRoute />}>
          <Route path="/patient" element={<PatientLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="upload" element={<UploadFlow />} />
            <Route path="scan/:id" element={<ScanHistory />} />
            <Route path="history" element={<ScanHistory />} />
            <Route path="education" element={<EducationView />} />
          </Route>
        </Route>

        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/disclaimer" element={<MedicalDisclaimer />} />
        <Route path="/terms" element={<TermsOfUse />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {state?.backgroundLocation && (
        <Routes>
          <Route element={<AuthModalLayout />}>
            <Route path="/login" element={<PatientLogin />} />
            <Route path="/register" element={<PatientRegister />} />
          </Route>
        </Routes>
      )}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* session timeout watcher */}
        <SessionWatcher />

        {/* Global UI listeners */}
        <ToastContainer />
        <GlobalNotificationListener />

        <Suspense
          fallback={
            <div className="min-h-[100dvh] flex items-center justify-center bg-surface-dark">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500" />
            </div>
          }
        >
          <AppRoutes />
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
