import React from "react";
import { useNavigate } from "react-router-dom";
import { FileWarning, Clock, UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const Header = ({ history = [], onLoadSession, user, onLogout }) => {
  const navigate = useNavigate();
  return (
    <header
      data-testid="header"
      className="sticky top-0 z-40 border-b border-[#3f3f46] bg-[#09090b]/90 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileWarning className="w-5 h-5 text-[#22c55e]" />
          <span className="font-oswald text-lg font-bold uppercase tracking-wider text-[#f4f4f5]">
            Redacted
          </span>
          <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-widest text-[#a1a1aa] border border-[#3f3f46] px-2 py-0.5">
            v1.0
          </span>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                data-testid="history-dropdown"
                variant="ghost"
                className="font-mono text-xs uppercase tracking-widest text-[#a1a1aa] hover:text-[#22c55e] hover:bg-transparent gap-2"
              >
                <Clock className="w-3.5 h-3.5" />
                History
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-72 bg-[#18181b] border-[#3f3f46] rounded-none"
            >
              <DropdownMenuLabel className="font-mono text-xs uppercase tracking-widest text-[#a1a1aa]">
                Recent Sessions
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#3f3f46]" />
              {history.length === 0 ? (
                <DropdownMenuItem
                  disabled
                  className="font-mono text-xs text-[#a1a1aa]"
                >
                  No sessions yet
                </DropdownMenuItem>
              ) : (
                history.slice(0, 8).map((s) => (
                  <DropdownMenuItem
                    key={s.id}
                    data-testid={`history-item-${s.id}`}
                    onClick={() => onLoadSession(s.id)}
                    className="font-mono text-xs text-[#f4f4f5] cursor-pointer hover:bg-[#27272a] focus:bg-[#27272a]"
                  >
                    <div className="truncate">
                      <span className="text-[#22c55e] mr-2">&gt;</span>
                      {s.document_name}
                    </div>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {user && (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline font-mono text-xs text-[#a1a1aa]">{user.name || user.email}</span>
              <Button
                data-testid="profile-btn"
                variant="ghost"
                onClick={() => navigate("/profile")}
                className="font-mono text-xs uppercase tracking-widest text-[#a1a1aa] hover:text-[#22c55e] hover:bg-transparent h-7 w-7 p-0"
              >
                <UserCircle className="w-4 h-4" />
              </Button>
              <Button
                data-testid="logout-btn"
                variant="ghost"
                onClick={onLogout}
                className="font-mono text-xs uppercase tracking-widest text-[#a1a1aa] hover:text-[#ef4444] hover:bg-transparent"
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
