"use client";

import { useSession, useLogout } from "@/lib/tanstack/hooks/useAuth";
import { LogOut, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { mutate: logout, isPending } = useLogout({
    onSuccess: () => {
      toast.success("Logged out successfully");
      router.push("/login");
    },
    onError: (error) => {
      toast.error(`Logout failed: ${error.message}`);
    },
  });

  return (
    <div className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6">
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onMenuClick}
        className="md:hidden"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex-1" />

      <div className="flex items-center gap-4">
        {/* User Info */}
        <div className="flex items-center gap-2 text-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-peenk-100 text-peenk-700">
            <User className="h-4 w-4" />
          </div>
          <span className="font-medium text-gray-700">
            {session?.user?.email || "Admin"}
          </span>
        </div>

        {/* Logout Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => logout()}
          disabled={isPending}
          className="gap-2 border-gray-300 hover:bg-gray-100"
        >
          <LogOut className="h-4 w-4" />
          {isPending ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </div>
  );
}
