"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "@/components/svg/logo";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useForgotPassword } from "@/lib/tanstack/hooks/useAuth";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [emailSent, setEmailSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { mutate: sendResetEmail, isPending } = useForgotPassword({
    onSuccess: () => {
      toast.success("Password reset email sent!");
      setEmailSent(true);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send reset email");
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    sendResetEmail(data.email);
  };

  if (emailSent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-50 via-peenk-50 to-ohrange-50 px-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg">
              <Logo className="h-10 w-10" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-gray-900">
              Check Your Email
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              We&apos;ve sent password reset instructions to your email address.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-xl text-center">
            <p className="text-sm text-gray-600 mb-6">
              Didn&apos;t receive the email? Check your spam folder or try
              again.
            </p>
            <Link href="/login">
              <Button variant="outline" className="w-full gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-50 via-peenk-50 to-ohrange-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg">
            <Logo className="h-10 w-10" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-gray-900">
            Reset Password
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email to receive reset instructions
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
                placeholder="admin@herlign.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Sending..." : "Send Reset Link"}
            </Button>

            <Link href="/login">
              <Button variant="ghost" className="w-full gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
