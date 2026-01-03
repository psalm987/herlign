import { Footer } from "@/components/sections/general/footer";
import { Navigation } from "@/components/sections/general/navigation";
import React from "react";

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      {children}
      <Footer />
    </div>
  );
};

export default LandingLayout;
