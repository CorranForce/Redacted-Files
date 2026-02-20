import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { VideoGenSection } from "@/components/VideoGenSection";
import { FileWarning, ArrowRight, Upload, Sparkles, Share2, MessageCircle, Heart, Repeat2, ThumbsUp, Bookmark, Send, MoreHorizontal, BarChart3 } from "lucide-react";

const SAMPLE_TWITTER = "THREAD: The CIA literally dosed unwitting Americans with LSD for 20 YEARS.\n\nProject MKUltra wasn't just \"mind control research\" \u2014 it was state-sponsored psychedelic terrorism on US citizens.\n\nHere's what the declassified files reveal \u{1F9F5}\n\n#MKUltra #Declassified #CIA";
const SAMPLE_FACEBOOK = "You won't believe what I found buried in the declassified CIA files...\n\nProject MKUltra was a TOP SECRET mind control program that ran for TWO DECADES. The CIA used LSD, electroshock therapy, and psychological torture on unwitting American citizens.\n\nThe most disturbing part? When Congress investigated in 1977, the CIA had already destroyed most of the evidence. Only 20,000 documents survived by accident.\n\nWhat else are they hiding?\n\n#Declassified #MKUltra #GovernmentSecrets";
const SAMPLE_INSTAGRAM = "THE CIA DOSED AMERICANS WITH LSD FOR 20 YEARS.\n\nNot a conspiracy theory. Not a movie plot. This is from actual declassified government documents.\n\nProject MKUltra (1953-1973): The CIA's mind control program that used LSD, torture, and psychological manipulation on unwitting US citizens.\n\nSave this. Share this.";

const TwitterMockup = () => (
  <div data-testid="landing-twitter-preview" className="bg-black border border-[#2F3336] overflow-hidden w-full font-sans">
    <div className="p-4 flex gap-3">
      <div className="w-10 h-10 rounded-full bg-[#1D1D1D] flex items-center justify-center shrink-0"><span className="text-xs font-bold text-white">R</span></div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1"><span className="text-white font-bold text-sm">REDACTED</span><svg className="w-4 h-4 text-[#1D9BF0]" viewBox="0 0 24 24" fill="currentColor"><path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"/></svg><span className="text-[#71767B] text-sm">@declassified &middot; 2m</span></div>
        <p className="text-[#E7E9EA] text-sm whitespace-pre-wrap leading-relaxed mt-1">{SAMPLE_TWITTER}</p>
        <div className="flex items-center justify-between mt-3 max-w-[380px]">
          <span className="flex items-center gap-1 text-[#71767B] text-xs"><MessageCircle className="w-4 h-4"/>142</span>
          <span className="flex items-center gap-1 text-[#71767B] text-xs"><Repeat2 className="w-4 h-4"/>1.2K</span>
          <span className="flex items-center gap-1 text-[#71767B] text-xs"><Heart className="w-4 h-4"/>8.4K</span>
          <span className="flex items-center gap-1 text-[#71767B] text-xs"><BarChart3 className="w-4 h-4"/>124K</span>
          <span className="flex items-center gap-2 text-[#71767B]"><Bookmark className="w-4 h-4"/><Share2 className="w-4 h-4"/></span>
        </div>
      </div>
    </div>
  </div>
);

const FacebookMockup = () => (
  <div data-testid="landing-facebook-preview" className="bg-[#242526] border border-[#3E4042] rounded-lg overflow-hidden w-full font-sans">
    <div className="flex items-center gap-3 p-3">
      <div className="w-10 h-10 rounded-full bg-[#3a3b3c] flex items-center justify-center shrink-0"><span className="text-xs font-bold text-[#E4E6EB]">RF</span></div>
      <div><p className="text-[#E4E6EB] font-semibold text-sm">Redacted Files</p><p className="text-[#B0B3B8] text-xs">Just now &middot; Public</p></div>
    </div>
    <div className="px-3 pb-3"><p className="text-[#E4E6EB] text-sm whitespace-pre-wrap leading-relaxed">{SAMPLE_FACEBOOK}</p></div>
    <div className="border-t border-[#3E4042] flex">
      <button className="flex-1 py-2.5 text-[#B0B3B8] text-sm flex items-center justify-center gap-2"><ThumbsUp className="w-4 h-4"/>Like</button>
      <button className="flex-1 py-2.5 text-[#B0B3B8] text-sm flex items-center justify-center gap-2"><MessageCircle className="w-4 h-4"/>Comment</button>
      <button className="flex-1 py-2.5 text-[#B0B3B8] text-sm flex items-center justify-center gap-2"><Share2 className="w-4 h-4"/>Share</button>
    </div>
  </div>
);

const InstagramMockup = () => (
  <div data-testid="landing-instagram-preview" className="bg-black border border-[#262626] rounded-sm overflow-hidden w-full font-sans">
    <div className="flex items-center justify-between px-3 py-2.5">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] p-[2px]"><div className="w-full h-full rounded-full bg-black flex items-center justify-center"><span className="text-[9px] font-bold text-white">R</span></div></div>
        <span className="text-white text-sm font-semibold">redacted_files</span>
      </div>
      <MoreHorizontal className="w-5 h-5 text-white" />
    </div>
    <div className="w-full aspect-[4/3] bg-[#121212] flex items-center justify-center"><span className="font-oswald text-2xl uppercase tracking-wider text-[#22c55e]/20">classified</span></div>
    <div className="px-3 py-2 flex items-center justify-between">
      <div className="flex items-center gap-4"><Heart className="w-6 h-6 text-white"/><MessageCircle className="w-6 h-6 text-white"/><Send className="w-6 h-6 text-white"/></div>
      <Bookmark className="w-6 h-6 text-white"/>
    </div>
    <div className="px-3 pb-1"><p className="text-white text-sm font-semibold">12,459 likes</p></div>
    <div className="px-3 pb-3"><p className="text-white text-sm"><span className="font-semibold mr-1">redacted_files</span><span className="whitespace-pre-wrap leading-relaxed">{SAMPLE_INSTAGRAM}</span></p></div>
  </div>
);

const TypewriterDemo = () => {
  const fullText = "THREAD: The CIA literally dosed unwitting Americans with LSD for 20 YEARS.\n\nProject MKUltra wasn't just \"mind control research\" \u2014 it was state-sponsored psychedelic terrorism.\n\n#MKUltra #Declassified";
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    let timer;

    const type = () => {
      if (i <= fullText.length) {
        setDisplayed(fullText.slice(0, i));
        i++;
        timer = setTimeout(type, 35);
      } else {
        timer = setTimeout(() => {
          i = 0;
          setDisplayed("");
          timer = setTimeout(type, 600);
        }, 4000);
      }
    };

    type();
    return () => clearTimeout(timer);
  }, []);

  return (
    <div data-testid="landing-demo-section" className="bg-black border border-[#2F3336] p-4 font-sans">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-[#1D1D1D] flex items-center justify-center shrink-0"><span className="text-xs font-bold text-white">R</span></div>
        <div className="flex-1">
          <div className="flex items-center gap-1"><span className="text-white font-bold text-sm">REDACTED</span><span className="text-[#71767B] text-sm">@declassified</span></div>
          <p className="text-[#E7E9EA] text-sm whitespace-pre-wrap leading-relaxed mt-1 min-h-[120px]">{displayed}<span className="terminal-cursor" /></p>
        </div>
      </div>
    </div>
  );
};

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const goToAuth = () => navigate(user ? "/dashboard" : "/auth");

  return (
    <div className="min-h-screen bg-[#09090b] relative overflow-x-hidden">
      <div className="noise-overlay" />

      {/* Nav */}
      <nav data-testid="landing-nav" className="sticky top-0 z-40 border-b border-[#3f3f46] bg-[#09090b]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileWarning className="w-5 h-5 text-[#22c55e]" />
            <span className="font-oswald text-lg font-bold uppercase tracking-wider text-[#f4f4f5]">Redacted</span>
          </div>
          <div className="flex items-center gap-4">
            <Button data-testid="landing-login-btn" variant="ghost" onClick={() => navigate("/auth")} className="font-mono text-xs uppercase tracking-widest text-[#a1a1aa] hover:text-[#22c55e] hover:bg-transparent">Login</Button>
            <Button data-testid="landing-get-started-btn" onClick={goToAuth} className="font-oswald text-xs uppercase tracking-[0.15em] rounded-none bg-[#f4f4f5] text-[#09090b] hover:bg-[#22c55e] hover:text-black px-5 py-2 active:scale-[0.98] transition-colors duration-200">Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section data-testid="landing-hero" className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-32">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#22c55e] mb-6 animate-fadeIn">// classification: beyond top secret</p>
        <h1 className="font-oswald text-5xl sm:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-[#f4f4f5] leading-[0.95] max-w-4xl animate-fadeIn">
          What Are They<br /><span className="text-[#22c55e]">Hiding?</span>
        </h1>
        <p className="font-mono text-sm text-[#a1a1aa] max-w-2xl leading-relaxed mt-8 animate-fadeIn-delay-1">
          Every classified document has secrets the government doesn't want you to share. Our AI reads through declassified files, extracts the most mind-blowing revelations, and turns them into viral social media posts — ready for X, Facebook, and Instagram.
        </p>
        <div className="flex flex-wrap gap-4 mt-10 animate-fadeIn-delay-2">
          <Button data-testid="hero-cta-btn" onClick={goToAuth} className="font-oswald text-sm uppercase tracking-[0.2em] rounded-none bg-[#f4f4f5] text-[#09090b] hover:bg-[#22c55e] hover:text-black px-10 py-6 active:scale-[0.98] transition-colors duration-200 gap-2">
            Get Access — Free <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="ghost" onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })} className="font-mono text-xs uppercase tracking-widest text-[#a1a1aa] hover:text-[#22c55e] hover:bg-transparent border border-[#3f3f46] rounded-none px-8 py-6">
            See Demo
          </Button>
        </div>
      </section>

      {/* How It Works */}
      <section data-testid="landing-how-it-works" className="relative z-10 border-t border-[#3f3f46] py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#a1a1aa] mb-4">// how it works</p>
          <h2 className="font-oswald text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#f4f4f5] mb-16">Three Steps to Viral Truth</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Upload, num: "01", title: "Upload", desc: "Drop any declassified PDF or paste the document text. Our system accepts all file formats." },
              { icon: Sparkles, num: "02", title: "AI Analyzes", desc: "GPT-5.2 reads thousands of pages and extracts the 5 most shocking, mind-blowing revelations." },
              { icon: Share2, num: "03", title: "Go Viral", desc: "Get platform-optimized posts for X, Facebook, and Instagram — plus AI-generated visual cards." },
            ].map((step) => (
              <div key={step.num} className="bg-[#18181b] border border-[#3f3f46] p-8 group hover:border-[#22c55e]/50 transition-colors corner-cut">
                <span className="font-oswald text-4xl font-bold text-[#22c55e]/20 group-hover:text-[#22c55e]/40 transition-colors">{step.num}</span>
                <step.icon className="w-6 h-6 text-[#22c55e] mt-4 mb-3" />
                <h3 className="font-oswald text-lg font-bold uppercase tracking-wider text-[#f4f4f5] mb-2">{step.title}</h3>
                <p className="font-mono text-xs text-[#a1a1aa] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Previews */}
      <section data-testid="landing-previews" className="relative z-10 border-t border-[#3f3f46] py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#a1a1aa] mb-4">// platform previews</p>
          <h2 className="font-oswald text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#f4f4f5] mb-6">See How It Looks on Each Platform</h2>
          <p className="font-mono text-sm text-[#a1a1aa] mb-16 max-w-2xl">Real example: We fed the declassified MKUltra files into REDACTED. Here's what came out.</p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-3">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#a1a1aa]">// x / twitter</p>
              <TwitterMockup />
            </div>
            <div className="space-y-3">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#a1a1aa]">// facebook</p>
              <FacebookMockup />
            </div>
            <div className="space-y-3">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#a1a1aa]">// instagram</p>
              <InstagramMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Demo */}
      <section id="demo" data-testid="landing-demo" className="relative z-10 border-t border-[#3f3f46] py-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#a1a1aa] mb-4">// live demo</p>
          <h2 className="font-oswald text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#f4f4f5] mb-6">Watch It Generate in Real Time</h2>
          <p className="font-mono text-sm text-[#a1a1aa] mb-10">This is what happens when our AI processes a declassified CIA document and generates an X/Twitter post.</p>
          <TypewriterDemo />
        </div>
      </section>

      {/* Final CTA */}
      <section data-testid="landing-final-cta" className="relative z-10 border-t border-[#3f3f46] py-32">
        <div className="max-w-3xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="font-oswald text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-[#f4f4f5] leading-tight mb-6">
            The Truth is Declassified.<br /><span className="text-[#22c55e]">Make It Go Viral.</span>
          </h2>
          <p className="font-mono text-sm text-[#a1a1aa] mb-10 max-w-lg mx-auto">Join thousands of truth-seekers turning government secrets into viral social media content. It's completely free.</p>
          <Button data-testid="final-cta-btn" onClick={goToAuth} className="font-oswald text-sm uppercase tracking-[0.2em] rounded-none bg-[#f4f4f5] text-[#09090b] hover:bg-[#22c55e] hover:text-black px-12 py-6 active:scale-[0.98] transition-colors duration-200 gap-2">
            Create Your Free Account <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#3f3f46] py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileWarning className="w-4 h-4 text-[#22c55e]" />
            <span className="font-oswald text-sm font-bold uppercase tracking-wider text-[#a1a1aa]">Redacted</span>
          </div>
          <p className="font-mono text-[10px] text-[#3f3f46]">Declassify responsibly.</p>
        </div>
      </footer>
    </div>
  );
}
