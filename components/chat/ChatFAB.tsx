/**
 * ChatFAB Component
 * Floating Action Button for chat with notification badge
 */

"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatFABProps {
  onClick: () => void;
  hasUnread: boolean;
}

export function ChatFAB({ onClick, hasUnread }: ChatFABProps) {
  return (
    <Button
      onClick={onClick}
      size="icon"
      className={cn(
        "fixed bottom-4 right-4 z-40 size-14 md:size-20 rounded-full shadow-2xl",
        "bg-linear-to-br from-peenk-500 to-peenk-600 hover:from-peenk-600 hover:to-peenk-700",
        "transition-all duration-300 hover:scale-110 active:scale-95",
        "animate-in slide-in-from-bottom-4 fade-in",
      )}
    >
      <div className="relative">
        <MessageCircle className="size-6 text-white" />
        {hasUnread && (
          <span className="absolute -top-1 -right-1 size-3 bg-ohrange-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </div>
    </Button>
  );
}
