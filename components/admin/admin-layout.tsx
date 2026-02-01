"use client";

import { ReactNode, useState } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auth is checked server-side in app/admin/layout.tsx
  // This component just handles the UI layout
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-auto bg-white">{children}</main>
      </div>
    </div>
  );
}
