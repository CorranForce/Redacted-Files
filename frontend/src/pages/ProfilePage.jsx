import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { FileWarning, ArrowLeft, Lock, User, Mail, Shield } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ProfilePage() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/auth/change-password`, {
        current_password: currentPassword,
        new_password: newPassword,
      });
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] relative">
      <div className="noise-overlay" />
      <Toaster theme="dark" position="bottom-right" toastOptions={{ style: { background: "#18181b", border: "1px solid #3f3f46", color: "#f4f4f5", fontFamily: "JetBrains Mono, monospace", fontSize: "12px" } }} />
      <div className="max-w-lg mx-auto px-6 py-20 relative z-10">
        <Link to="/dashboard" data-testid="profile-back-link" className="inline-flex items-center gap-2 font-mono text-xs text-[#a1a1aa] hover:text-[#22c55e] transition-colors mb-12">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to dashboard
        </Link>

        <div className="space-y-10">
          <div className="flex items-center gap-3">
            <FileWarning className="w-6 h-6 text-[#22c55e]" />
            <span className="font-oswald text-xl font-bold uppercase tracking-wider text-[#f4f4f5]">Redacted</span>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#22c55e] mb-2">// agent profile</p>
            <h1 className="font-oswald text-3xl font-bold uppercase tracking-tight text-[#f4f4f5]">Profile</h1>
          </div>

          {/* User Info */}
          <div data-testid="profile-info" className="bg-[#18181b] border border-[#3f3f46] p-6 space-y-4">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#a1a1aa] mb-2">// account details</p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#27272a] border border-[#3f3f46] flex items-center justify-center">
                {user?.picture ? (
                  <img src={user.picture} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-[#22c55e]" />
                )}
              </div>
              <div>
                <p className="font-mono text-sm text-[#f4f4f5]">{user?.name || "Agent"}</p>
                <p className="font-mono text-xs text-[#a1a1aa] flex items-center gap-1.5">
                  <Mail className="w-3 h-3" /> {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-[#18181b] border border-[#3f3f46] p-6 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-[#22c55e]" />
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#a1a1aa]">// update password</p>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label className="font-mono text-xs uppercase tracking-widest text-[#a1a1aa]">Current Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3f3f46]" />
                  <Input data-testid="profile-current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current password" required className="pl-10 bg-black/50 border-[#3f3f46] rounded-none font-mono text-sm text-[#f4f4f5] placeholder:text-[#3f3f46] focus:border-[#22c55e] focus:ring-0" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-xs uppercase tracking-widest text-[#a1a1aa]">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3f3f46]" />
                  <Input data-testid="profile-new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min 6 characters" required minLength={6} className="pl-10 bg-black/50 border-[#3f3f46] rounded-none font-mono text-sm text-[#f4f4f5] placeholder:text-[#3f3f46] focus:border-[#22c55e] focus:ring-0" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-xs uppercase tracking-widest text-[#a1a1aa]">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3f3f46]" />
                  <Input data-testid="profile-confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" required minLength={6} className="pl-10 bg-black/50 border-[#3f3f46] rounded-none font-mono text-sm text-[#f4f4f5] placeholder:text-[#3f3f46] focus:border-[#22c55e] focus:ring-0" />
                </div>
              </div>
              <Button data-testid="profile-update-password-btn" type="submit" disabled={loading} className="w-full py-5 bg-[#f4f4f5] text-[#09090b] font-oswald text-sm uppercase tracking-[0.2em] rounded-none hover:bg-[#22c55e] hover:text-black disabled:opacity-30 transition-colors">
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
