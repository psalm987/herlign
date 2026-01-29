"use client";

import { use } from "react";
import { ResourceForm } from "@/components/admin/forms/resource-form";
import {
  useAdminResources,
  useUpdateResource,
} from "@/lib/tanstack/hooks/admin/useResources";
// import { type ResourceInput } from '@/lib/validators/resources';
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditResourcePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const { data: resourcesData } = useAdminResources({ page: 1, limit: 100 });
  const resource = resourcesData?.data?.find((r) => r.id === id);

  const { mutate: updateResource, isPending } = useUpdateResource({
    onSuccess: () => {
      toast.success("Resource updated successfully!");
      router.push("/admin/resources");
    },
    onError: (error) => {
      toast.error(`Failed to update resource: ${error.message}`);
    },
  });

  if (!resource) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-gray-600">Resource not found</p>
            <Link
              href="/admin/resources"
              className="mt-4 inline-block text-grin-600"
            >
              Back to Resources
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
          href="/admin/resources"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Resources
        </Link>
        <h1 className="mt-4 font-heading text-3xl font-bold text-gray-900">
          Edit Resource
        </h1>
      </div>

      <ResourceForm
        defaultValues={resource}
        onSubmit={(data) => updateResource({ id, data })}
        isSubmitting={isPending}
        submitText="Update Resource"
      />
    </div>
  );
}
