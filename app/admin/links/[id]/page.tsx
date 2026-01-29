"use client";

import { use } from "react";
import { LinkForm } from "@/components/admin/forms/link-form";
import {
  useAdminLinks,
  useUpdateLink,
} from "@/lib/tanstack/hooks/admin/useLinks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditLinkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const { data: linksData } = useAdminLinks({ page: 1, limit: 100 });
  const link = linksData?.data?.find((l) => l.id === id);

  const { mutate: updateLink, isPending } = useUpdateLink({
    onSuccess: () => {
      toast.success("Link updated successfully!");
      router.push("/admin/links");
    },
    onError: (error) => {
      toast.error(`Failed to update link: ${error.message}`);
    },
  });

  if (!link) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-gray-600">Link not found</p>
            <Link
              href="/admin/links"
              className="mt-4 inline-block text-grin-600"
            >
              Back to Links
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
          Edit Link
        </h1>
      </div>

      <LinkForm
        defaultValues={link}
        onSubmit={(data) => updateLink({ id, data })}
        isSubmitting={isPending}
        submitText="Update Link"
      />
    </div>
  );
}
