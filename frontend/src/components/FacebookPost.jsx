import React from "react";
import { ThumbsUp, MessageCircle, Share2, ImagePlus, Loader2 } from "lucide-react";

export const FacebookPost = ({ post, onGenerateImage, imageLoading }) => {
  return (
    <div
      data-testid={`post-card-facebook`}
      className="bg-[#242526] border border-[#3E4042] rounded-lg overflow-hidden w-full font-sans"
    >
      <div className="flex items-center gap-3 p-3">
        <div className="w-10 h-10 rounded-full bg-[#3a3b3c] flex items-center justify-center shrink-0">
          <span className="text-xs font-bold text-[#E4E6EB]">RF</span>
        </div>
        <div>
          <p className="text-[#E4E6EB] font-semibold text-sm">Redacted Files</p>
          <p className="text-[#B0B3B8] text-xs">Just now &middot; Public</p>
        </div>
      </div>

      <div className="px-3 pb-3">
        <p className="text-[#E4E6EB] text-sm whitespace-pre-wrap leading-relaxed">
          {post.post_text}
        </p>
      </div>

      {post.image_base64 ? (
        <img
          src={`data:image/png;base64,${post.image_base64}`}
          alt="Generated visual"
          className="w-full"
          data-testid="facebook-post-image"
        />
      ) : (
        <button
          data-testid="generate-image-btn-facebook"
          onClick={() => onGenerateImage(post.id, post.post_text, "facebook")}
          disabled={imageLoading}
          className="w-full py-8 bg-[#3a3b3c] text-[#B0B3B8] hover:bg-[#4a4b4c] transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
        >
          {imageLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ImagePlus className="w-4 h-4" />
          )}
          {imageLoading ? "Generating..." : "Generate Visual"}
        </button>
      )}

      <div className="border-t border-[#3E4042] flex">
        <button className="flex-1 py-2.5 text-[#B0B3B8] text-sm hover:bg-[#3a3b3c] flex items-center justify-center gap-2 transition-colors">
          <ThumbsUp className="w-4 h-4" /> Like
        </button>
        <button className="flex-1 py-2.5 text-[#B0B3B8] text-sm hover:bg-[#3a3b3c] flex items-center justify-center gap-2 transition-colors">
          <MessageCircle className="w-4 h-4" /> Comment
        </button>
        <button className="flex-1 py-2.5 text-[#B0B3B8] text-sm hover:bg-[#3a3b3c] flex items-center justify-center gap-2 transition-colors">
          <Share2 className="w-4 h-4" /> Share
        </button>
      </div>
    </div>
  );
};
