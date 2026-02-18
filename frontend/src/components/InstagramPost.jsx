import React from "react";
import { Heart, MessageCircle, Send, Bookmark, ImagePlus, Loader2, MoreHorizontal } from "lucide-react";

export const InstagramPost = ({ post, onGenerateImage, imageLoading }) => {
  return (
    <div
      data-testid={`post-card-instagram`}
      className="bg-black border border-[#262626] rounded-sm overflow-hidden w-full font-sans"
    >
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] p-[2px]">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
              <span className="text-[9px] font-bold text-white">R</span>
            </div>
          </div>
          <span className="text-white text-sm font-semibold">redacted_files</span>
        </div>
        <MoreHorizontal className="w-5 h-5 text-white" />
      </div>

      {post.image_base64 ? (
        <img
          src={`data:image/png;base64,${post.image_base64}`}
          alt="Generated visual"
          className="w-full aspect-square object-cover"
          data-testid="instagram-post-image"
        />
      ) : (
        <button
          data-testid="generate-image-btn-instagram"
          onClick={() => onGenerateImage(post.id, post.post_text, "instagram")}
          disabled={imageLoading}
          className="w-full aspect-square bg-[#121212] text-[#8E8E8E] hover:bg-[#1a1a1a] transition-colors flex flex-col items-center justify-center gap-3 disabled:opacity-50"
        >
          {imageLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <ImagePlus className="w-6 h-6" />
          )}
          <span className="text-xs">{imageLoading ? "Generating..." : "Generate Visual"}</span>
        </button>
      )}

      <div className="px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Heart className="w-6 h-6 text-white hover:text-[#ED4956] cursor-pointer transition-colors" />
          <MessageCircle className="w-6 h-6 text-white cursor-pointer" />
          <Send className="w-6 h-6 text-white cursor-pointer" />
        </div>
        <Bookmark className="w-6 h-6 text-white cursor-pointer" />
      </div>

      <div className="px-3 pb-1">
        <p className="text-white text-sm font-semibold">2,459 likes</p>
      </div>

      <div className="px-3 pb-3">
        <p className="text-white text-sm">
          <span className="font-semibold mr-1">redacted_files</span>
          <span className="whitespace-pre-wrap leading-relaxed">{post.post_text}</span>
        </p>
      </div>

      <div className="px-3 pb-2">
        <p className="text-[#8E8E8E] text-[10px] uppercase tracking-wider">1 hour ago</p>
      </div>
    </div>
  );
};
