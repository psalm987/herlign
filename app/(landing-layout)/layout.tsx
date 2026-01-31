import { Footer } from "@/components/sections/general/footer";
import { Navigation } from "@/components/sections/general/navigation";
import { ChatWidget } from "@/components/chat";
import React from "react";
import { getAuthUser } from "@/lib/auth";

const LandingLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getAuthUser();

  return (
    <div className="min-h-screen bg-white">
      <Navigation isAdmin={!!user} />
      {children}
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default LandingLayout;
