"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin, useMagicLink } from "@/lib/tanstack/hooks/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Logo from "@/components/svg/logo";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";

const magicLinkSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type MagicLinkFormData = z.infer<typeof magicLinkSchema>;
type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  // Magic Link Form
  const {
    register: registerMagicLink,
    handleSubmit: handleSubmitMagicLink,
    formState: { errors: magicLinkErrors },
  } = useForm<MagicLinkFormData>({
    resolver: zodResolver(magicLinkSchema),
  });

  // Password Login Form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate: sendMagicLink, isPending: isSendingMagicLink } = useMagicLink(
    {
      onSuccess: () => {
        setMagicLinkSent(true);
        toast.success("Magic link sent! Check your email.");
      },
      onError: (error) => {
        toast.error(`Failed to send magic link: ${error.message}`);
      },
    },
  );

  const { mutate: login, isPending: isLoggingIn } = useLogin({
    onSuccess: () => {
      toast.success("Login successful!");
      router.push("/admin");
    },
    onError: (error) => {
      toast.error(`Login failed: ${error.message}`);
    },
  });

  const onSubmitMagicLink = (data: MagicLinkFormData) => {
    sendMagicLink(data.email);
  };

  const onSubmitPassword = (data: LoginFormData) => {
    login(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-grin-50 via-peenk-50 to-perple-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-white shadow-lg">
            <Logo className="size-10" animate />
          </div>
          <h1 className="font-heading text-3xl font-bold text-grin-900">
            Herlign Admin
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to manage your platform
          </p>
        </div>

        {/* Login Tabs */}
        <div className="rounded-2xl bg-white p-8 shadow-xl border border-gray-100">
          <Tabs defaultValue="magic-link" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger
                value="magic-link"
                className="flex items-center gap-2"
              >
                <Mail className="size-4" />
                Magic Link
              </TabsTrigger>
              <TabsTrigger value="password" className="flex items-center gap-2">
                <Lock className="size-4" />
                Password
              </TabsTrigger>
            </TabsList>

            {/* Magic Link Tab */}
            <TabsContent value="magic-link" className="mt-0">
              {!magicLinkSent ? (
                <form
                  onSubmit={handleSubmitMagicLink(onSubmitMagicLink)}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Enter your email address and we&apos;ll send you a secure
                      login link.
                    </p>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label
                      htmlFor="magic-email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <Input
                      id="magic-email"
                      type="email"
                      autoComplete="email"
                      {...registerMagicLink("email")}
                      className={magicLinkErrors.email ? "border-red-500" : ""}
                      placeholder="admin@herlign.com"
                    />
                    {magicLinkErrors.email && (
                      <p className="mt-1 text-xs text-red-600">
                        {magicLinkErrors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSendingMagicLink}
                  >
                    {isSendingMagicLink ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin">⏳</span>
                        Sending...
                      </span>
                    ) : (
                      "Send Magic Link"
                    )}
                  </Button>
                </form>
              ) : (
                <div className="space-y-4 py-6">
                  <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-grin-100">
                    <Mail className="size-8 text-grin-600" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="font-heading text-lg font-semibold text-gray-900">
                      Check your email
                    </h3>
                    <p className="text-sm text-gray-600">
                      We&apos;ve sent a magic link to your email address. Click
                      the link to sign in instantly.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => setMagicLinkSent(false)}
                  >
                    Send another link
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Password Tab */}
            <TabsContent value="password" className="mt-0">
              <form
                onSubmit={handleSubmitPassword(onSubmitPassword)}
                className="space-y-6"
              >
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="password-email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <Input
                    id="password-email"
                    type="email"
                    autoComplete="email"
                    {...registerPassword("email")}
                    className={passwordErrors.email ? "border-red-500" : ""}
                    placeholder="admin@herlign.com"
                  />
                  {passwordErrors.email && (
                    <p className="mt-1 text-xs text-red-600">
                      {passwordErrors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-grin-600 hover:text-grin-700 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    {...registerPassword("password")}
                    className={passwordErrors.password ? "border-red-500" : ""}
                    placeholder="••••••••"
                  />
                  {passwordErrors.password && (
                    <p className="mt-1 text-xs text-red-600">
                      {passwordErrors.password.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={isLoggingIn}>
                  {isLoggingIn ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-500">
          © 2026 Herlign FC. All rights reserved.
        </p>
      </div>
    </div>
  );
}
