import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileWarning, ArrowLeft, Lock, CheckCircle } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) { toast.error("Passwords don't match"); return; }
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await axios.post(`${API}/auth/reset-password`, { token, password });
      setSuccess(true);
      toast.success("Password reset successfully");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="font-mono text-sm text-[#ef4444]">Invalid reset link</p>
          <Link to="/auth" className="font-mono text-xs text-[#22c55e] hover:underline">Back to login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] relative">
      <div className="noise-overlay" />
      <Toaster theme="dark" position="bottom-right" toastOptions={{ style: { background: "#18181b", border: "1px solid #3f3f46", color: "#f4f4f5", fontFamily: "JetBrains Mono, monospace", fontSize: "12px" } }} />
      <div className="max-w-md mx-auto px-6 py-20 relative z-10">
        <Link to="/auth" className="inline-flex items-center gap-2 font-mono text-xs text-[#a1a1aa] hover:text-[#22c55e] transition-colors mb-12">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to login
        </Link>
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <FileWarning className="w-6 h-6 text-[#22c55e]" />
            <span className="font-oswald text-xl font-bold uppercase tracking-wider text-[#f4f4f5]">Redacted</span>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#22c55e] mb-2">// password reset</p>
            <h1 className="font-oswald text-3xl font-bold uppercase tracking-tight text-[#f4f4f5]">New Password</h1>
          </div>

          {success ? (
            <div className="bg-[#18181b] border border-[#22c55e]/30 p-8 space-y-4 text-center">
              <CheckCircle className="w-10 h-10 text-[#22c55e] mx-auto" />
              <p className="font-mono text-sm text-[#f4f4f5]">Password reset successful</p>
              <Button data-testid="go-to-login-btn" onClick={() => navigate("/auth")} className="font-oswald text-xs uppercase tracking-[0.2em] rounded-none bg-[#22c55e] text-black hover:bg-[#16a34a] px-8 py-4">Go to Login</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label className="font-mono text-xs uppercase tracking-widest text-[#a1a1aa]">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3f3f46]" />
                  <Input data-testid="reset-password-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" required minLength={6} className="pl-10 bg-black/50 border-[#3f3f46] rounded-none font-mono text-sm text-[#f4f4f5] placeholder:text-[#3f3f46] focus:border-[#22c55e] focus:ring-0" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-xs uppercase tracking-widest text-[#a1a1aa]">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3f3f46]" />
                  <Input data-testid="reset-confirm-input" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm password" required minLength={6} className="pl-10 bg-black/50 border-[#3f3f46] rounded-none font-mono text-sm text-[#f4f4f5] placeholder:text-[#3f3f46] focus:border-[#22c55e] focus:ring-0" />
                </div>
              </div>
              <Button data-testid="reset-submit-btn" type="submit" disabled={loading} className="w-full py-5 bg-[#f4f4f5] text-[#09090b] font-oswald text-sm uppercase tracking-[0.2em] rounded-none hover:bg-[#22c55e] hover:text-black disabled:opacity-30 transition-colors">
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
