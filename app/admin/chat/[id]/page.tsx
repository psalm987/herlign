"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  useAdminChatSession,
  useSendAdminChatMessage,
  useSwitchChatMode,
} from "@/lib/tanstack/hooks/admin/useChat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Send, Bot, User, Shield } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function ChatSessionPage() {
  const { id } = useParams() as { id: string };
  const [message, setMessage] = useState("");

  const { data: sessionData, isLoading } = useAdminChatSession(id);
  const { mutate: sendMessage, isPending } = useSendAdminChatMessage({
    onSuccess: () => {
      toast.success("Message sent");
      setMessage("");
    },
  });
  const { mutate: switchMode } = useSwitchChatMode({
    onSuccess: () => toast.success("Chat mode switched"),
  });

  const handleSend = () => {
    if (!message.trim()) return;
    sendMessage({ sessionId: id, message });
  };

  if (isLoading || !sessionData) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-ohrange-200 border-t-ohrange-600" />
        </div>
      </div>
    );
  }

  const session = sessionData.session;
  const messages = sessionData.messages || [];

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href="/admin/chat"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Chat Sessions
        </Link>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-gray-900">
              Chat Session
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Session ID: {session.id}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={session.current_mode === "auto" ? "default" : "outline"}
              onClick={() => switchMode({ sessionId: id, mode: "auto" })}
              className="gap-2"
              disabled={session.current_mode === "auto"}
            >
              <Bot className="h-4 w-4" />
              Auto Mode
            </Button>
            <Button
              variant={session.current_mode === "live" ? "default" : "outline"}
              onClick={() => switchMode({ sessionId: id, mode: "live" })}
              className="gap-2"
              disabled={session.current_mode === "live"}
            >
              <Shield className="h-4 w-4" />
              Live Mode
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <Card className="p-6 mb-4 max-h-[60vh] overflow-y-auto">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No messages yet. Start the conversation!
            </p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3",
                  msg.sender === "admin" && "flex-row-reverse",
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    msg.sender === "guest" && "bg-peenk-100",
                    msg.sender === "bot" && "bg-gray-100",
                    msg.sender === "admin" && "bg-ohrange-100",
                  )}
                >
                  {msg.sender === "guest" && (
                    <User className="h-4 w-4 text-peenk-600" />
                  )}
                  {msg.sender === "bot" && (
                    <Bot className="h-4 w-4 text-gray-600" />
                  )}
                  {msg.sender === "admin" && (
                    <Shield className="h-4 w-4 text-ohrange-600" />
                  )}
                </div>
                <div
                  className={cn(
                    "flex-1",
                    msg.sender === "admin" && "text-right",
                  )}
                >
                  <div
                    className={cn(
                      "inline-block rounded-lg px-4 py-2 max-w-lg",
                      msg.sender === "guest" && "bg-gray-100",
                      msg.sender === "bot" && "bg-peenk-50",
                      msg.sender === "admin" && "bg-ohrange-600 text-white",
                    )}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {format(new Date(msg.timestamp), "HH:mm")}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Message Input */}
      <div className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
          disabled={isPending}
        />
        <Button
          onClick={handleSend}
          disabled={isPending || !message.trim()}
          className="gap-2"
        >
          <Send className="h-4 w-4" />
          Send
        </Button>
      </div>
    </div>
  );
}
