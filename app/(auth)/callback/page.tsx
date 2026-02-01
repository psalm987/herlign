"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
// import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/svg/logo";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type CallbackStatus = "loading" | "success" | "error";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<CallbackStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check for error in URL params (from server redirect)
        const error = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");
        const success = searchParams.get("success");

        if (error) {
          setErrorMessage(errorDescription || error);
          setStatus("error");
          return;
        }

        // If success flag is present, server successfully exchanged code and set cookies
        if (success) {
          // Small delay to ensure cookies are fully set
          await new Promise((resolve) => setTimeout(resolve, 100));

          setStatus("success");

          // Redirect to admin - session cookies should now be set
          setTimeout(() => {
            router.push("/admin");
            router.refresh(); // Force router to refresh server components
          }, 300);
          return;
        }

        // Fallback: no success flag, something went wrong
        throw new Error("Invalid callback state");
      } catch (err) {
        console.error("Auth callback error:", err);
        setErrorMessage(
          err instanceof Error ? err.message : "Authentication failed",
        );
        setStatus("error");
      }
    };

    handleCallback();
  }, [router, searchParams]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-50 via-peenk-50 to-ohrange-50 px-4">
        <div className="w-full max-w-md text-center">
          <div className="mb-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg">
              <Logo className="h-10 w-10" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-gray-900">
              Signing you in...
            </h1>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-xl">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-ohrange-600" />
            <p className="mt-4 text-sm text-gray-600">
              Please wait while we verify your credentials.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-50 via-peenk-50 to-ohrange-50 px-4">
        <div className="w-full max-w-md text-center">
          <div className="mb-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg">
              <Logo className="h-10 w-10" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-gray-900">
              Authentication Failed
            </h1>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-xl">
            <p className="text-sm text-red-600 mb-6">{errorMessage}</p>
            <p className="text-sm text-gray-600 mb-6">
              The link may have expired or been used already. Please try again.
            </p>
            <Link href="/login">
              <Button className="w-full">Back to Login</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-50 via-peenk-50 to-ohrange-50 px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg">
            <Logo className="h-10 w-10" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-gray-900">
            Success!
          </h1>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-ohrange-600" />
          <p className="mt-4 text-sm text-gray-600">Redirecting...</p>
        </div>
      </div>
    </div>
  );
}
