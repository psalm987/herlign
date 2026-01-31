/**
 * ChatWidget Component
 * Main container managing chat state and notifications
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { ChatFAB } from "./ChatFAB";
import { ChatWindow } from "./ChatWindow";
import { useChatHistory } from "@/lib/tanstack/hooks/useChat";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const lastSeenMessageCountRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { data: chatHistory } = useChatHistory({
    enabled: !isOpen, // Only poll when closed to detect new messages
    refetchInterval: 5000,
  });

  // Initialize audio on mount (client-side only)
  useEffect(() => {
    // Create a simple notification sound using Web Audio API
    const createNotificationSound = () => {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const audioContext = new AudioContextClass();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.5,
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    };

    audioRef.current = {
      play: createNotificationSound,
    } as HTMLAudioElement;
  }, []);

  // Detect new messages from bot/admin using ref pattern
  useEffect(() => {
    if (!chatHistory?.messages || isOpen) return;

    const currentMessageCount = chatHistory.messages.length;
    const previousCount = lastSeenMessageCountRef.current;

    // Check if there are new messages since we last checked
    if (currentMessageCount > previousCount && previousCount > 0) {
      const newMessages = chatHistory.messages.slice(previousCount);
      const hasNewBotOrAdminMessage = newMessages.some(
        (msg) => msg.sender === "bot" || msg.sender === "admin",
      );

      if (hasNewBotOrAdminMessage && !hasUnread) {
        // Schedule notification for next tick to satisfy React Compiler
        setTimeout(() => {
          setHasUnread(true);
        }, 0);
        // Play notification sound
        if (audioRef.current) {
          try {
            audioRef.current.play();
          } catch (error) {
            console.error("Failed to play notification sound:", error);
          }
        }
      }
    }

    // Update ref (doesn't cause re-renders)
    lastSeenMessageCountRef.current = currentMessageCount;
  }, [chatHistory?.messages, isOpen, hasUnread]);

  const handleOpen = () => {
    setIsOpen(true);
    setHasUnread(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleNewMessage = () => {
    if (!isOpen) {
      setHasUnread(true);
    }
  };

  return (
    <>
      <ChatFAB onClick={handleOpen} hasUnread={hasUnread} />
      <ChatWindow
        isOpen={isOpen}
        onClose={handleClose}
        onNewMessage={handleNewMessage}
      />
    </>
  );
}
