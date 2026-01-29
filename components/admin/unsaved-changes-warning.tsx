"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface UnsavedChangesWarningProps {
  isDirty: boolean;
  message?: string;
}

export function UnsavedChangesWarning({
  isDirty,
  message = "You have unsaved changes. Are you sure you want to leave?",
}: UnsavedChangesWarningProps) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty, message]);

  return null;
}

// Hook for programmatic navigation warning
export function useUnsavedChangesWarning(isDirty: boolean) {
  const router = useRouter();

  useEffect(() => {
    const originalPush = router.push;
    const originalReplace = router.replace;

    if (isDirty) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const confirmNavigation = (url: string) => {
        const confirmed = window.confirm(
          "You have unsaved changes. Are you sure you want to leave?",
        );
        return confirmed;
      };

      // eslint-disable-next-line react-hooks/immutability
      router.push = (...args: Parameters<typeof router.push>) => {
        if (confirmNavigation(args[0] as string)) {
          return originalPush(...args);
        }
        return Promise.resolve(false);
      };

      router.replace = (...args: Parameters<typeof router.replace>) => {
        if (confirmNavigation(args[0] as string)) {
          return originalReplace(...args);
        }
        return Promise.resolve(false);
      };
    }

    return () => {
      router.push = originalPush;
      router.replace = originalReplace;
    };
  }, [isDirty, router]);
}
