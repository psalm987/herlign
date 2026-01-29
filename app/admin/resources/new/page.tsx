"use client";

import { ResourceForm } from "@/components/admin/forms/resource-form";
import { useCreateResource } from "@/lib/tanstack/hooks/admin/useResources";
// import { type ResourceInput } from '@/lib/validators/resources';
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewResourcePage() {
  const router = useRouter();
  const { mutate: createResource, isPending } = useCreateResource({
    onSuccess: () => {
      toast.success("Resource created successfully!");
      router.push("/admin/resources");
    },
    onError: (error) => {
      toast.error(`Failed to create resource: ${error.message}`);
    },
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href="/admin/resources"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Resources
        </Link>
        <h1 className="mt-4 font-heading text-3xl font-bold text-gray-900">
          Add New Resource
        </h1>
      </div>

      <ResourceForm
        onSubmit={createResource}
        isSubmitting={isPending}
        submitText="Create Resource"
      />
    </div>
  );
}
