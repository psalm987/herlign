/**
 * ChatInfoModal Component
 * Displays information about the chatbot
 */

"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ChatInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatInfoModal({ open, onOpenChange }: ChatInfoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[80vw] sm:max-w-md max-h-[80vh] rounded-2xl overflow-y-scroll">
        <DialogHeader className="h-full flex flex-col">
          <DialogTitle className="text-2xl font-heading text-peenk-600">
            About Herligna
          </DialogTitle>
          <DialogDescription className="space-y-4 pt-4 text-left">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                What I Can Do
              </h3>
              <p className="text-sm text-gray-600">
                Hi, I&apos;m Herligna (short for Herlign FC Assistant). I&apos;m
                your AI-powered career coaching assistant, designed to help you
                navigate your professional journey. I can provide guidance on
                career transitions, skill development, networking strategies,
                and work-life balance.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Privacy & Anonymity
              </h3>
              <p className="text-sm text-gray-600">
                Your conversations are completely anonymous. We don&apos;t
                collect personal information, and your chat history is
                automatically deleted after 30 days. Your privacy is our
                priority.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Live Support</h3>
              <p className="text-sm text-gray-600">
                While I handle most inquiries, our team may join the
                conversation for more complex questions. We&apos;re here to
                provide the best support possible.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                How to Get Started
              </h3>
              <p className="text-sm text-gray-600">
                Simply type your question or concern in the chat box. Whether
                you&apos;re stuck on a career decision, need motivation, or want
                advice on professional development, I&apos;m here to help!
              </p>
            </div>

            <div className="pt-2 border-t">
              <p className="text-xs text-gray-500 italic">
                Note: I&apos;m an AI assistant and my responses should be
                considered as guidance, not professional advice. For critical
                decisions, please consult with qualified professionals.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
