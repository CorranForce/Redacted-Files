import React, { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";

const MESSAGES = [
  "ACCESSING CLASSIFIED DATABASE",
  "DECRYPTING DOCUMENT CONTENTS",
  "BYPASSING SECURITY CLEARANCE",
  "ANALYZING TOP SECRET INTEL",
  "EXTRACTING MIND-BLOWING SECRETS",
  "GENERATING SOCIAL MEDIA ASSETS",
  "COMPILING VIRAL CONTENT",
];

export const LoadingState = ({ progress = 0 }) => {
  const [msgIndex, setMsgIndex] = useState(0);
  const [dots, setDots] = useState("");

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2200);
    return () => clearInterval(msgInterval);
  }, []);

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);
    return () => clearInterval(dotInterval);
  }, []);

  return (
    <div data-testid="loading-state" className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-fadeIn">
      <div className="w-full max-w-md space-y-6">
        <div className="bg-[#18181b] border border-[#3f3f46] p-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#ef4444]" />
            <div className="w-2 h-2 rounded-full bg-[#ffb000]" />
            <div className="w-2 h-2 rounded-full bg-[#22c55e]" />
            <span className="ml-2 font-mono text-[10px] text-[#a1a1aa] uppercase tracking-widest">
              terminal
            </span>
          </div>

          <div className="font-mono text-sm text-[#22c55e] min-h-[24px]">
            <span className="text-[#a1a1aa]">&gt; </span>
            {MESSAGES[msgIndex]}{dots}
            <span className="terminal-cursor" />
          </div>

          <Progress
            value={progress}
            className="h-1 bg-[#27272a] rounded-none [&>div]:bg-[#22c55e] [&>div]:rounded-none [&>div]:transition-all [&>div]:duration-500"
          />

          <p className="font-mono text-[10px] text-[#a1a1aa] uppercase tracking-widest text-right">
            {Math.round(progress)}% complete
          </p>
        </div>

        <p className="font-mono text-xs text-[#3f3f46] text-center">
          This may take up to a minute depending on document complexity
        </p>
      </div>
    </div>
  );
};
