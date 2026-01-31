import { Footer } from "@/components/sections/general/footer";
import { Navigation } from "@/components/sections/general/navigation";
import { ChatWidget } from "@/components/chat";
import React from "react";

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      {children}
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default LandingLayout;
