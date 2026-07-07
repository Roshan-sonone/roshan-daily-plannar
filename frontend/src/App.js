import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import AuthPage from "@/pages/AuthPage";
import DashboardPage from "@/pages/DashboardPage";
import { Toaster } from "sonner";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (user === null) {
    return (
      <div className="paper-bg min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-ink-red" />
      </div>
    );
  }
  if (user === false) return <Navigate to="/login" replace />;
  return children;
};

const PublicOnly = ({ children }) => {
  const { user } = useAuth();
  if (user === null) {
    return (
      <div className="paper-bg min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-ink-red" />
      </div>
    );
  }
  if (user && typeof user === "object") return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            className: "font-nunito",
          }}
        />
        <Routes>
          <Route
            path="/login"
            element={
              <PublicOnly>
                <AuthPage mode="login" />
              </PublicOnly>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnly>
                <AuthPage mode="register" />
              </PublicOnly>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
