import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/theme-context";
import { AuthProvider } from "./contexts/auth-context";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "sonner";

// Pages
import LandingPage from "./pages/landing-page";
import LoginPage from "./pages/login-page";
import RegisterPage from "./pages/register-page";
import MFAVerifyPage from "./pages/mfa-verify";
import NotFound from "./pages/not-found";

// Dashboards
import StudentDashboard from "./pages/dashboards/student-dashboard";
import FacultyDashboard from "./pages/dashboards/faculty-dashboard";
import AdminDashboard from "./pages/dashboards/admin-dashboard";

// Security Pages
import AccessMatrixPage from "./pages/security/access-matrix-page";
import KeyExchangePage from "./pages/security/key-exchange-pair";
import HashingPage from "./pages/security/hashing-page";
import DigitalSignaturePage from "./pages/security/digital-signature";
import EncodingPage from "./pages/security/encoding-page";
import SecurityRisksPage from "./pages/security/security-risks";
import SecurityInfoPage from "./pages/security/security-info";



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster richColors position="bottom-right" />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/mfa-verify" element={<MFAVerifyPage />} />

              {/* Dashboard Routes */}
              <Route path="/dashboard/student" element={<StudentDashboard />} />
              <Route path="/dashboard/faculty" element={<FacultyDashboard />} />
              <Route path="/dashboard/admin" element={<AdminDashboard />} />

              {/* Security Pages */}
              <Route path="/dashboard/admin/access-matrix" element={<AccessMatrixPage />} />
              <Route path="/dashboard/admin/keys" element={<KeyExchangePage />} />
              <Route path="/dashboard/faculty/sign-results" element={<DigitalSignaturePage />} />
              <Route path="/security/info" element={<SecurityInfoPage />} />
              <Route path="/security/keys" element={<KeyExchangePage />} />
              <Route path="/security/hashing" element={<HashingPage />} />
              <Route path="/security/signatures" element={<DigitalSignaturePage />} />
              <Route path="/security/encoding" element={<EncodingPage />} />
              <Route path="/security/risks" element={<SecurityRisksPage />} />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
