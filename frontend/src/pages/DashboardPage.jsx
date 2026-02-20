import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { DocumentInput } from "@/components/DocumentInput";
import { PlatformSelector } from "@/components/PlatformSelector";
import { LoadingState } from "@/components/LoadingState";
import { ResultsView } from "@/components/ResultsView";
import { useAuth } from "@/context/AuthContext";
import "@/App.css";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [step, setStep] = useState("input");
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentText, setDocumentText] = useState("");
  const [documentDate, setDocumentDate] = useState(null);
  const [platforms, setPlatforms] = useState({ twitter: true, facebook: true, instagram: true });
  const [findings, setFindings] = useState([]);
  const [posts, setPosts] = useState([]);
  const [imageLoading, setImageLoading] = useState({});
  const [history, setHistory] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    axios.get(`${API}/history`).then((r) => setHistory(r.data.sessions || [])).catch(() => {});
  }, []);

  const handleDeclassify = useCallback(async () => {
    const active = Object.keys(platforms).filter((p) => platforms[p]);
    if (!active.length) { toast.error("Select at least one platform"); return; }
    if (!selectedFile && !documentText.trim()) { toast.error("Upload a document or paste text"); return; }

    setStep("loading");
    setLoadingProgress(10);
    try {
      const formData = new FormData();
      if (selectedFile) formData.append("file", selectedFile);
      else formData.append("text", documentText);

      setLoadingProgress(25);
      const analyzeRes = await axios.post(`${API}/analyze`, formData);
      const { id, findings: f } = analyzeRes.data;
      setFindings(f);
      setLoadingProgress(50);

      const stepInc = 40 / active.length;
      const generatedPosts = [];
      for (let i = 0; i < active.length; i++) {
        const res = await axios.post(`${API}/generate-post`, { session_id: id, platform: active[i], findings: f });
        generatedPosts.push(res.data);
        setLoadingProgress(50 + stepInc * (i + 1));
      }

      setPosts(generatedPosts);
      setLoadingProgress(100);
      setStep("results");
      toast.success("Document declassified successfully");
      axios.get(`${API}/history`).then((r) => setHistory(r.data.sessions || [])).catch(() => {});
    } catch (err) {
      toast.error(err.response?.data?.detail || "Declassification failed");
      setStep("input");
    }
  }, [selectedFile, documentText, platforms]);

  const handleGenerateImage = useCallback(async (postId, postText, platform) => {
    setImageLoading((prev) => ({ ...prev, [postId]: true }));
    try {
      const res = await axios.post(`${API}/generate-image`, { post_id: postId, post_text: postText, platform });
      setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, image_base64: res.data.image_base64 } : p)));
      toast.success("Visual generated");
    } catch { toast.error("Image generation failed"); }
    finally { setImageLoading((prev) => ({ ...prev, [postId]: false })); }
  }, []);

  const handleLoadSession = useCallback(async (sessionId) => {
    try {
      const res = await axios.get(`${API}/session/${sessionId}`);
      setFindings(res.data.session.findings || []);
      setPosts(res.data.posts || []);
      setStep("results");
    } catch { toast.error("Failed to load session"); }
  }, []);

  const handleReset = useCallback(() => {
    setStep("input");
    setSelectedFile(null);
    setDocumentText("");
    setDocumentDate(null);
    setFindings([]);
    setPosts([]);
    setLoadingProgress(0);
  }, []);

  const canDeclassify = (selectedFile || documentText.trim()) && Object.values(platforms).some(Boolean);

  return (
    <div className="min-h-screen bg-[#09090b] relative">
      <div className="noise-overlay" />
      <Toaster theme="dark" position="bottom-right" toastOptions={{ style: { background: "#18181b", border: "1px solid #3f3f46", color: "#f4f4f5", fontFamily: "JetBrains Mono, monospace", fontSize: "12px" } }} />

      <Header history={history} onLoadSession={handleLoadSession} user={user} onLogout={logout} />

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12 relative z-10">
        {step === "input" && (
          <div className="space-y-16">
            <div className="space-y-4 animate-fadeIn">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#22c55e]" data-testid="classification-label">// classification: top secret</p>
              <h1 className="font-oswald text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-[#f4f4f5] leading-none">
                Declassify the Truth.<br /><span className="text-[#22c55e]">Viralize the Secrets.</span>
              </h1>
              <p className="font-mono text-sm text-[#a1a1aa] max-w-2xl leading-relaxed">
                Upload any declassified government document and all other files. Our AI extracts the most mind-blowing revelations and packages them into viral social media posts.
              </p>
            </div>
            <div className="animate-fadeIn-delay-1"><DocumentInput selectedFile={selectedFile} setSelectedFile={setSelectedFile} documentText={documentText} setDocumentText={setDocumentText} documentDate={documentDate} setDocumentDate={setDocumentDate} /></div>
            <div className="animate-fadeIn-delay-2"><PlatformSelector platforms={platforms} setPlatforms={setPlatforms} /></div>
            <div className="animate-fadeIn-delay-3">
              <Button data-testid="declassify-btn" disabled={!canDeclassify} onClick={handleDeclassify} className="px-16 py-6 bg-[#f4f4f5] text-[#09090b] font-oswald text-base uppercase tracking-[0.2em] rounded-none border-2 border-transparent hover:bg-[#22c55e] hover:text-black disabled:opacity-20 disabled:cursor-not-allowed transition-colors duration-200 active:scale-[0.98]">Declassify</Button>
            </div>
          </div>
        )}
        {step === "loading" && <LoadingState progress={loadingProgress} />}
        {step === "results" && <ResultsView findings={findings} posts={posts} imageLoading={imageLoading} onGenerateImage={handleGenerateImage} onReset={handleReset} />}
      </main>
    </div>
  );
}
