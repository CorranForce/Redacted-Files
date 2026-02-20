import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileWarning, ArrowLeft, Mail, CheckCircle } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/auth/forgot-password`, { email });
      setSent(true);
      toast.success("Check your email for reset instructions");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] relative">
      <div className="noise-overlay" />
      <Toaster theme="dark" position="bottom-right" toastOptions={{ style: { background: "#18181b", border: "1px solid #3f3f46", color: "#f4f4f5", fontFamily: "JetBrains Mono, monospace", fontSize: "12px" } }} />
      <div className="max-w-md mx-auto px-6 py-20 relative z-10">
        <Link to="/auth" data-testid="forgot-back-link" className="inline-flex items-center gap-2 font-mono text-xs text-[#a1a1aa] hover:text-[#22c55e] transition-colors mb-12">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to login
        </Link>

        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <FileWarning className="w-6 h-6 text-[#22c55e]" />
            <span className="font-oswald text-xl font-bold uppercase tracking-wider text-[#f4f4f5]">Redacted</span>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#22c55e] mb-2">// password recovery</p>
            <h1 className="font-oswald text-3xl font-bold uppercase tracking-tight text-[#f4f4f5]">Forgot Password</h1>
          </div>

          {sent ? (
            <div className="bg-[#18181b] border border-[#22c55e]/30 p-8 space-y-4 text-center">
              <CheckCircle className="w-10 h-10 text-[#22c55e] mx-auto" />
              <p className="font-mono text-sm text-[#f4f4f5]">Reset email sent</p>
              <p className="font-mono text-xs text-[#a1a1aa]">If an account with that email exists, you'll receive a password reset link.</p>
              <Link to="/auth" data-testid="back-to-login-link" className="inline-block font-mono text-xs text-[#22c55e] hover:underline mt-4">Back to login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label className="font-mono text-xs uppercase tracking-widest text-[#a1a1aa]">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3f3f46]" />
                  <Input data-testid="forgot-email-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="agent@redacted.gov" required className="pl-10 bg-black/50 border-[#3f3f46] rounded-none font-mono text-sm text-[#f4f4f5] placeholder:text-[#3f3f46] focus:border-[#22c55e] focus:ring-0" />
                </div>
              </div>
              <Button data-testid="forgot-submit-btn" type="submit" disabled={loading} className="w-full py-5 bg-[#f4f4f5] text-[#09090b] font-oswald text-sm uppercase tracking-[0.2em] rounded-none hover:bg-[#22c55e] hover:text-black disabled:opacity-30 transition-colors">
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
