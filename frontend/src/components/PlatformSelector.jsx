import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const PLATFORMS = [
  { key: "twitter", label: "X / Twitter", color: "#f4f4f5" },
  { key: "facebook", label: "Facebook", color: "#1877F2" },
  { key: "instagram", label: "Instagram", color: "#E1306C" },
];

export const PlatformSelector = ({ platforms, setPlatforms }) => {
  const allSelected = Object.values(platforms).every(Boolean);

  const toggleAll = () => {
    const val = !allSelected;
    setPlatforms({ twitter: val, facebook: val, instagram: val });
  };

  const toggle = (key) => {
    setPlatforms((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-4">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#a1a1aa]">
        // target platforms
      </p>
      <div className="flex flex-wrap items-center gap-6">
        {PLATFORMS.map((p) => (
          <label
            key={p.key}
            data-testid={`platform-${p.key}`}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <Checkbox
              checked={platforms[p.key]}
              onCheckedChange={() => toggle(p.key)}
              className="rounded-none border-[#3f3f46] data-[state=checked]:bg-[#22c55e] data-[state=checked]:border-[#22c55e]"
            />
            <span className="font-mono text-sm text-[#a1a1aa] group-hover:text-[#f4f4f5] transition-colors">
              {p.label}
            </span>
          </label>
        ))}

        <Button
          data-testid="platform-all"
          variant="ghost"
          onClick={toggleAll}
          className="font-mono text-xs uppercase tracking-widest text-[#a1a1aa] hover:text-[#22c55e] hover:bg-transparent border border-[#3f3f46] rounded-none px-4 py-1 h-auto"
        >
          {allSelected ? "Deselect All" : "Select All"}
        </Button>
      </div>
    </div>
  );
};
