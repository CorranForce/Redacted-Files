import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileWarning, ArrowLeft, Mail, Lock, User } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  if (user) { navigate("/dashboard", { replace: true }); return null; }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const body = isLogin ? { email: formData.email, password: formData.password } : formData;
      const res = await axios.post(`${API}${endpoint}`, body);
      login(res.data.token, res.data.user);
      toast.success(isLogin ? "Access granted" : "Account created");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.detail || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + "/dashboard";
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  return (
    <div className="min-h-screen bg-[#09090b] relative">
      <div className="noise-overlay" />
      <Toaster theme="dark" position="bottom-right" toastOptions={{ style: { background: "#18181b", border: "1px solid #3f3f46", color: "#f4f4f5", fontFamily: "JetBrains Mono, monospace", fontSize: "12px" } }} />
      <div className="max-w-md mx-auto px-6 py-20 relative z-10">
        <Link to="/" data-testid="auth-back-link" className="inline-flex items-center gap-2 font-mono text-xs text-[#a1a1aa] hover:text-[#22c55e] transition-colors mb-12">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to base
        </Link>

        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <FileWarning className="w-6 h-6 text-[#22c55e]" />
            <span className="font-oswald text-xl font-bold uppercase tracking-wider text-[#f4f4f5]">Redacted</span>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#22c55e] mb-2">// access terminal</p>
            <h1 className="font-oswald text-3xl font-bold uppercase tracking-tight text-[#f4f4f5]">
              {isLogin ? "Sign In" : "Create Account"}
            </h1>
          </div>

          <button data-testid="google-auth-btn" onClick={handleGoogleAuth} className="w-full bg-[#18181b] border border-[#3f3f46] py-3.5 px-4 font-mono text-sm text-[#f4f4f5] hover:border-[#22c55e] transition-colors flex items-center justify-center gap-3 active:scale-[0.98]">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-[#3f3f46]" />
            <span className="font-mono text-xs text-[#3f3f46] uppercase">or</span>
            <div className="flex-1 h-px bg-[#3f3f46]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label className="font-mono text-xs uppercase tracking-widest text-[#a1a1aa]">Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3f3f46]" />
                  <Input data-testid="auth-name-input" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} placeholder="Agent name" className="pl-10 bg-black/50 border-[#3f3f46] rounded-none font-mono text-sm text-[#f4f4f5] placeholder:text-[#3f3f46] focus:border-[#22c55e] focus:ring-0" />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label className="font-mono text-xs uppercase tracking-widest text-[#a1a1aa]">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3f3f46]" />
                <Input data-testid="auth-email-input" type="email" value={formData.email} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))} placeholder="agent@redacted.gov" required className="pl-10 bg-black/50 border-[#3f3f46] rounded-none font-mono text-sm text-[#f4f4f5] placeholder:text-[#3f3f46] focus:border-[#22c55e] focus:ring-0" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-xs uppercase tracking-widest text-[#a1a1aa]">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3f3f46]" />
                <Input data-testid="auth-password-input" type="password" value={formData.password} onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))} placeholder="Min 6 characters" required minLength={6} className="pl-10 bg-black/50 border-[#3f3f46] rounded-none font-mono text-sm text-[#f4f4f5] placeholder:text-[#3f3f46] focus:border-[#22c55e] focus:ring-0" />
              </div>
            </div>
            <Button data-testid="auth-submit-btn" type="submit" disabled={loading} className="w-full py-5 bg-[#f4f4f5] text-[#09090b] font-oswald text-sm uppercase tracking-[0.2em] rounded-none border-2 border-transparent hover:bg-[#22c55e] hover:text-black disabled:opacity-30 transition-colors duration-200 active:scale-[0.98]">
              {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <p className="font-mono text-xs text-[#a1a1aa] text-center">
            {isLogin ? "No clearance?" : "Already have access?"}{" "}
            <button data-testid="auth-toggle-btn" onClick={() => setIsLogin(!isLogin)} className="text-[#22c55e] hover:underline">{isLogin ? "Create account" : "Sign in"}</button>
          </p>
        </div>
      </div>
    </div>
  );
}
