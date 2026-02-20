import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const AuthCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const hash = window.location.hash;
    const sessionId = new URLSearchParams(hash.substring(1)).get("session_id");

    if (!sessionId) {
      navigate("/auth", { replace: true });
      return;
    }

    const exchangeSession = async () => {
      try {
        const res = await axios.post(`${API}/auth/google-session`, { session_id: sessionId });
        login(res.data.token, res.data.user);
        navigate("/dashboard", { replace: true });
      } catch {
        navigate("/auth", { replace: true });
      }
    };

    exchangeSession();
  }, [navigate, login]);

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
      <div className="font-mono text-sm text-[#22c55e]">
        <span className="text-[#a1a1aa]">&gt; </span>
        AUTHENTICATING<span className="terminal-cursor" />
      </div>
    </div>
  );
};
