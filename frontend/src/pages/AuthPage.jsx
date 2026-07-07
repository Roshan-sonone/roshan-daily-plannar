import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AuthPage({ mode = "login" }) {
  const { login, register, error, setError } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isLogin = mode === "login";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const ok = isLogin
      ? await login(email.trim(), password)
      : await register(name.trim(), email.trim(), password);
    setSubmitting(false);
    if (ok) {
      toast.success(isLogin ? "Welcome back!" : "Account created! Time to plan.");
      navigate("/");
    }
  };

  return (
    <div className="paper-bg min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="brand-title text-6xl">Daily Planner</h1>
          <p className="text-ink-muted mt-2 font-nunito">
            Plan your day. Track your life. Feel great.
          </p>
        </div>

        <div className="relative bg-white sticky-note" style={{ transform: "rotate(-0.5deg)" }}>
          <div className="washi-tape bg-washi-yellow" />
          <h2 className="card-title" style={{ transform: "rotate(-2deg)" }}>
            {isLogin ? "Sign In" : "Create Account"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            {!isLogin && (
              <div>
                <Label htmlFor="name" className="text-ink-muted text-xs uppercase tracking-wider">
                  Name
                </Label>
                <Input
                  id="name"
                  data-testid="auth-name-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="mt-1 bg-transparent"
                />
              </div>
            )}
            <div>
              <Label htmlFor="email" className="text-ink-muted text-xs uppercase tracking-wider">
                Email
              </Label>
              <Input
                id="email"
                data-testid="auth-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="mt-1 bg-transparent"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-ink-muted text-xs uppercase tracking-wider">
                Password
              </Label>
              <Input
                id="password"
                data-testid="auth-password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="mt-1 bg-transparent"
              />
            </div>

            {error && (
              <div data-testid="auth-error" className="text-sm text-destructive font-nunito">
                {error}
              </div>
            )}

            <Button
              type="submit"
              data-testid="auth-submit-button"
              disabled={submitting}
              className="w-full bg-ink hover:bg-black text-white font-nunito font-semibold"
            >
              {submitting ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="mt-5 text-center text-sm text-ink-muted">
            {isLogin ? (
              <>
                No account?{" "}
                <Link
                  to="/register"
                  data-testid="auth-switch-register"
                  className="text-ink-red font-semibold underline decoration-dashed underline-offset-4"
                >
                  Create one
                </Link>
              </>
            ) : (
              <>
                Already have one?{" "}
                <Link
                  to="/login"
                  data-testid="auth-switch-login"
                  className="text-ink-red font-semibold underline decoration-dashed underline-offset-4"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-ink-muted mt-6 font-nunito">
          Demo admin: admin@example.com / admin123
        </p>
      </div>
    </div>
  );
}
