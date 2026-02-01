/**
 * ChatWindow Component
 * Expanding chat window from the FAB
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { X, Info, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessage } from "./ChatMessage";
import { ChatInfoModal } from "./ChatInfoModal";
import {
  useChatHistory,
  useSendChatMessage,
} from "@/lib/tanstack/hooks/useChat";
import { cn } from "@/lib/utils";

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  onNewMessage?: () => void;
}

const WELCOME_MESSAGE =
  "Hey! I'm your AI-powered creative sidekick. Stuck on an idea? Need a pep talk? Ask me anything. This chat is totally anonymous so your secrets are safe with me.";

export function ChatWindow({ isOpen, onClose, onNewMessage }: ChatWindowProps) {
  const [message, setMessage] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: chatHistory, isLoading } = useChatHistory({
    enabled: isOpen,
    refetchInterval: 5000, // Poll for new messages every 5 seconds
  });

  const { mutate: sendMessage, isPending } = useSendChatMessage({
    onSuccess: () => {
      setMessage("");
      setShowWelcome(false);
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory?.messages]);

  // Hide welcome message if there are existing messages
  const hasMessages = chatHistory?.messages && chatHistory.messages.length > 0;
  if (hasMessages && showWelcome) {
    setShowWelcome(false);
  }

  // Notify parent of new messages
  useEffect(() => {
    if (
      chatHistory?.messages &&
      chatHistory.messages.length > 0 &&
      onNewMessage
    ) {
      const lastMessage = chatHistory.messages[chatHistory.messages.length - 1];
      if (lastMessage.sender !== "guest") {
        onNewMessage();
      }
    }
  }, [chatHistory?.messages, onNewMessage]);

  const handleSend = () => {
    if (!message.trim() || isPending) return;
    sendMessage({ message: message.trim() });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className={cn(
          "fixed bottom-4 right-4 z-50 max-w-[380px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300",
          "w-[80vw] sm:w-full sm:max-w-[400px] sm:h-[600px]",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-linear-to-r bg-peenk-500 text-gray-800">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-ohrange-500 animate-pulse" />
            <h3 className="font-semibold">Herligna</h3>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setShowInfo(true)}
              className="text-gray-700 hover:bg-white/20"
            >
              <Info className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              className="text-gray-700 hover:bg-white/20"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {showWelcome && (
            <div className="bg-linear-to-br from-peenk-100 to-perple-100 rounded-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-500">
              <p className="text-sm text-gray-800 font-medium leading-relaxed">
                {WELCOME_MESSAGE}
              </p>
            </div>
          )}

          {isLoading && !chatHistory ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-peenk-500" />
            </div>
          ) : (
            chatHistory?.messages?.map?.((msg) => (
              <ChatMessage
                key={msg.id}
                sender={msg.sender}
                content={msg.content}
                timestamp={msg.timestamp}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              disabled={isPending}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!message.trim() || isPending}
              size="icon"
              className="bg-peenk-500 hover:bg-peenk-600 shrink-0"
            >
              <Send className="size-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Press Enter to send
          </p>
        </div>
      </div>

      <ChatInfoModal open={showInfo} onOpenChange={setShowInfo} />
    </>
  );
}
