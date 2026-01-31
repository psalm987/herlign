/**
 * ChatMessage Component
 * Displays individual chat messages with proper styling
 */

import { cn } from "@/lib/utils";

interface ChatMessageProps {
  sender: "guest" | "admin" | "bot";
  content: string;
  timestamp: string;
}

export function ChatMessage({ sender, content, timestamp }: ChatMessageProps) {
  const isGuest = sender === "guest";

  return (
    <div className={cn("flex", isGuest ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm animate-in fade-in slide-in-from-bottom-2 duration-300",
          isGuest
            ? "bg-peenk-500 text-gray-800 rounded-br-sm"
            : "bg-gray-100 text-gray-800 rounded-bl-sm",
        )}
      >
        <p className="whitespace-pre-wrap wrap-break-word">{content}</p>
        <span
          className={cn(
            "text-xs mt-1 block",
            isGuest ? "text-gray-800/70" : "text-gray-500",
          )}
        >
          {new Date(timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}
