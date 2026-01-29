"use client";

import { LinkForm } from "@/components/admin/forms/link-form";
import { useCreateLink } from "@/lib/tanstack/hooks/admin/useLinks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewLinkPage() {
  const router = useRouter();
  const { mutate: createLink, isPending } = useCreateLink({
    onSuccess: () => {
      toast.success("Link created successfully!");
      router.push("/admin/links");
    },
    onError: (error) => {
      toast.error(`Failed to create link: ${error.message}`);
    },
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href="/admin/links"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Links
        </Link>
        <h1 className="mt-4 font-heading text-3xl font-bold text-gray-900">
          Add New Link
        </h1>
      </div>

      <LinkForm onSubmit={createLink} isSubmitting={isPending} />
    </div>
  );
}
