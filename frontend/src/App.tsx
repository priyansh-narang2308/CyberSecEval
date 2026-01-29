import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/theme-context";
import { AuthProvider } from "./contexts/auth-context";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "sonner";

import LandingPage from "./pages/landing-page";
import LoginPage from "./pages/login-page";
import RegisterPage from "./pages/register-page";
import MFAVerifyPage from "./pages/mfa-verify";
import NotFound from "./pages/not-found";


import StudentDashboard from "./pages/dashboards/student-dashboard";
import FacultyDashboard from "./pages/dashboards/faculty-dashboard";
import AdminDashboard from "./pages/dashboards/admin-dashboard";


import SecurityLab from "./pages/security/security-lab";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster richColors position="bottom-right" />
          <BrowserRouter>
            <Routes>

              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/mfa-verify" element={<MFAVerifyPage />} />

              <Route path="/dashboard/student" element={<StudentDashboard />} />
              <Route path="/dashboard/faculty" element={<FacultyDashboard />} />
              <Route path="/dashboard/admin" element={<AdminDashboard />} />


              <Route path="/security/lab" element={<SecurityLab />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
