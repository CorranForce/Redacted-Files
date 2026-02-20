import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Video, Loader2, RefreshCw, Download } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const VideoGenSection = ({ promptText, label = "Generate Video", sessionId = null }) => {
  const [status, setStatus] = useState("idle");
  const [videoUrl, setVideoUrl] = useState(null);
  const pollRef = useRef(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  const startGeneration = useCallback(async () => {
    setStatus("generating");
    setElapsed(0);
    try {
      const res = await axios.post(`${API}/generate-video`, {
        prompt_text: promptText,
        session_id: sessionId,
      });
      const vid = res.data.video_id;

      const timer = setInterval(() => setElapsed((p) => p + 1), 1000);

      pollRef.current = setInterval(async () => {
        try {
          const s = await axios.get(`${API}/video-status/${vid}`);
          if (s.data.status === "ready") {
            clearInterval(pollRef.current);
            clearInterval(timer);
            setVideoUrl(`${API}/videos/${vid}`);
            setStatus("ready");
            toast.success("Video generated");
          } else if (s.data.status === "failed") {
            clearInterval(pollRef.current);
            clearInterval(timer);
            setStatus("failed");
            toast.error("Video generation failed");
          }
        } catch { /* keep polling */ }
      }, 5000);
    } catch {
      setStatus("failed");
      toast.error("Failed to start video generation");
    }
  }, [promptText, sessionId]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  if (status === "ready" && videoUrl) {
    return (
      <div className="space-y-3">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#22c55e]">// ai-generated video</p>
        <video
          src={videoUrl}
          controls
          autoPlay
          loop
          muted
          playsInline
          className="w-full border border-[#3f3f46]"
          data-testid="generated-video-player"
        />
      </div>
    );
  }

  if (status === "generating") {
    return (
      <div data-testid="video-generating-state" className="bg-[#18181b] border border-[#3f3f46] p-8 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#ef4444]" />
          <div className="w-2 h-2 rounded-full bg-[#ffb000]" />
          <div className="w-2 h-2 rounded-full bg-[#22c55e]" />
          <span className="ml-2 font-mono text-[10px] text-[#a1a1aa] uppercase tracking-widest">sora-2</span>
        </div>
        <Loader2 className="w-8 h-8 text-[#22c55e] animate-spin" />
        <p className="font-mono text-sm text-[#22c55e]">
          <span className="text-[#a1a1aa]">&gt; </span>RENDERING VIDEO<span className="terminal-cursor" />
        </p>
        <p className="font-mono text-xs text-[#a1a1aa]">Elapsed: {formatTime(elapsed)} — typically takes 2-5 minutes</p>
        <div className="w-full max-w-xs h-1 bg-[#27272a] overflow-hidden">
          <div className="h-full bg-[#22c55e] transition-all duration-1000" style={{ width: `${Math.min(95, (elapsed / 240) * 100)}%` }} />
        </div>
      </div>
    );
  }

  return (
    <Button
      data-testid="generate-video-btn"
      onClick={startGeneration}
      variant="ghost"
      className="font-mono text-xs uppercase tracking-widest text-[#a1a1aa] hover:text-[#22c55e] hover:bg-transparent border border-[#3f3f46] rounded-none gap-2"
    >
      {status === "failed" ? <RefreshCw className="w-4 h-4" /> : <Video className="w-4 h-4" />}
      {status === "failed" ? "Retry Video Generation" : label}
    </Button>
  );
};
