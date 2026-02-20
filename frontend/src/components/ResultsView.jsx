import React from "react";
import { Copy, Download, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FacebookPost } from "@/components/FacebookPost";
import { InstagramPost } from "@/components/InstagramPost";
import { TwitterPost } from "@/components/TwitterPost";
import { VideoGenSection } from "@/components/VideoGenSection";

const PostWrapper = ({ platform, post, imageLoading, onGenerateImage }) => {
  const platformLabels = { twitter: "X / Twitter", facebook: "Facebook", instagram: "Instagram" };

  const copyText = async () => {
    await navigator.clipboard.writeText(post.post_text);
    toast.success("Post text copied to clipboard");
  };

  const downloadImage = () => {
    if (!post.image_base64) return;
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${post.image_base64}`;
    link.download = `redacted-${platform}-visual.png`;
    link.click();
    toast.success("Image downloaded");
  };

  const PostComponent = {
    facebook: FacebookPost,
    instagram: InstagramPost,
    twitter: TwitterPost,
  }[platform];

  if (!PostComponent) return null;

  return (
    <div className="space-y-3 post-card-enter" style={{ animationDelay: `${["twitter", "facebook", "instagram"].indexOf(platform) * 150}ms` }}>
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#a1a1aa]">
          // {platformLabels[platform]}
        </p>
        <TooltipProvider>
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  data-testid={`copy-text-btn-${platform}`}
                  variant="ghost"
                  size="sm"
                  onClick={copyText}
                  className="text-[#a1a1aa] hover:text-[#22c55e] hover:bg-transparent h-7 w-7 p-0"
                >
                  <Copy className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-[#18181b] border-[#3f3f46] text-[#f4f4f5] font-mono text-xs rounded-none">
                Copy post text
              </TooltipContent>
            </Tooltip>

            {post.image_base64 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    data-testid={`download-image-btn-${platform}`}
                    variant="ghost"
                    size="sm"
                    onClick={downloadImage}
                    className="text-[#a1a1aa] hover:text-[#22c55e] hover:bg-transparent h-7 w-7 p-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-[#18181b] border-[#3f3f46] text-[#f4f4f5] font-mono text-xs rounded-none">
                  Download image
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </TooltipProvider>
      </div>

      <PostComponent
        post={post}
        onGenerateImage={onGenerateImage}
        imageLoading={imageLoading[post.id]}
      />
    </div>
  );
};

export const ResultsView = ({ findings, posts, imageLoading, onGenerateImage, onReset }) => {
  return (
    <div data-testid="results-section" className="space-y-16 animate-fadeIn">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#22c55e] mb-3">
            // classified findings extracted
          </p>
          <h2 className="font-oswald text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#f4f4f5]">
            Mind-Blowing Intel
          </h2>
        </div>
        <Button
          data-testid="new-document-btn"
          onClick={onReset}
          variant="ghost"
          className="font-mono text-xs uppercase tracking-widest text-[#a1a1aa] hover:text-[#22c55e] hover:bg-transparent border border-[#3f3f46] rounded-none gap-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          New Document
        </Button>
      </div>

      <div className="bg-[#18181b] border border-[#3f3f46] p-6 lg:p-8 space-y-4">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#a1a1aa] mb-4">
          // key revelations
        </p>
        <ul data-testid="findings-list" className="space-y-3">
          {findings.map((f, i) => (
            <li key={i} className="finding-item font-mono text-sm text-[#f4f4f5] leading-relaxed">
              {f}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#a1a1aa] mb-8">
          // generated posts
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostWrapper
              key={post.id}
              platform={post.platform}
              post={post}
              imageLoading={imageLoading}
              onGenerateImage={onGenerateImage}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#a1a1aa] mb-4">
          // generate video
        </p>
        <p className="font-mono text-sm text-[#a1a1aa] mb-4 max-w-2xl">
          Turn your declassified findings into a cinematic AI-generated video powered by Sora 2.
        </p>
        <VideoGenSection
          promptText={findings.join(" ")}
          label="Generate Declassified Video"
        />
      </div>
    </div>
  );
};
