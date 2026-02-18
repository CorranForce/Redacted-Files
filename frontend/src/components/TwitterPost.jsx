import React from "react";
import { MessageCircle, Repeat2, Heart, BarChart3, Bookmark, Share, ImagePlus, Loader2 } from "lucide-react";

export const TwitterPost = ({ post, onGenerateImage, imageLoading }) => {
  return (
    <div
      data-testid={`post-card-twitter`}
      className="bg-black border border-[#2F3336] rounded-none overflow-hidden w-full font-sans"
    >
      <div className="p-3 flex gap-3">
        <div className="w-10 h-10 rounded-full bg-[#1D1D1D] flex items-center justify-center shrink-0">
          <span className="text-xs font-bold text-white">R</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-white font-bold text-sm">REDACTED</span>
            <svg className="w-4 h-4 text-[#1D9BF0]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
            </svg>
            <span className="text-[#71767B] text-sm">@declassified</span>
            <span className="text-[#71767B] text-sm">&middot; 1m</span>
          </div>

          <div className="mt-1">
            <p className="text-[#E7E9EA] text-sm whitespace-pre-wrap leading-relaxed">
              {post.post_text}
            </p>
          </div>

          {post.image_base64 ? (
            <img
              src={`data:image/png;base64,${post.image_base64}`}
              alt="Generated visual"
              className="w-full rounded-2xl mt-3 border border-[#2F3336]"
              data-testid="twitter-post-image"
            />
          ) : (
            <button
              data-testid="generate-image-btn-twitter"
              onClick={() => onGenerateImage(post.id, post.post_text, "twitter")}
              disabled={imageLoading}
              className="w-full mt-3 py-6 rounded-2xl bg-[#16181C] border border-[#2F3336] text-[#71767B] hover:bg-[#1D1F23] transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {imageLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ImagePlus className="w-4 h-4" />
              )}
              {imageLoading ? "Generating..." : "Generate Visual"}
            </button>
          )}

          <div className="flex items-center justify-between mt-3 max-w-[420px]">
            <button className="flex items-center gap-1 text-[#71767B] hover:text-[#1D9BF0] transition-colors group">
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs">12</span>
            </button>
            <button className="flex items-center gap-1 text-[#71767B] hover:text-[#00BA7C] transition-colors">
              <Repeat2 className="w-4 h-4" />
              <span className="text-xs">48</span>
            </button>
            <button className="flex items-center gap-1 text-[#71767B] hover:text-[#F91880] transition-colors">
              <Heart className="w-4 h-4" />
              <span className="text-xs">2.4K</span>
            </button>
            <button className="flex items-center gap-1 text-[#71767B] hover:text-[#1D9BF0] transition-colors">
              <BarChart3 className="w-4 h-4" />
              <span className="text-xs">18K</span>
            </button>
            <div className="flex items-center gap-3">
              <Bookmark className="w-4 h-4 text-[#71767B] hover:text-[#1D9BF0] cursor-pointer transition-colors" />
              <Share className="w-4 h-4 text-[#71767B] hover:text-[#1D9BF0] cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
