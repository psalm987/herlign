"use client";

import { useState } from "react";
import {
  useAdminResources,
  useDeleteResource,
} from "@/lib/tanstack/hooks/admin/useResources";
import {
  DataTable,
  SortableHeader,
  SelectCheckbox,
} from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";

type Resource = {
  id: string;
  title: string;
  format: string;
  category: string;
  tags: string[];
  price: number;
  is_paid: boolean;
  created_at: string;
};

export default function ResourcesListPage() {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: resourcesData, isLoading } = useAdminResources({
    page: 1,
    limit: 100,
  });
  const { mutate: deleteResource } = useDeleteResource({
    onSuccess: () => {
      toast.success("Resource deleted successfully");
      setDeleteId(null);
    },
    onError: (error) => {
      toast.error(`Failed to delete resource: ${error.message}`);
    },
  });

  const columns: ColumnDef<Resource>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <SelectCheckbox
          row={{
            getIsSelected: () => table.getIsAllPageRowsSelected(),
            toggleSelected: (value: boolean) =>
              table.toggleAllPageRowsSelected(value),
          }}
        />
      ),
      cell: ({ row }) => <SelectCheckbox row={row} />,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <SortableHeader column={column}>Title</SortableHeader>
      ),
    },
    {
      accessorKey: "format",
      header: "Format",
      cell: ({ row }) => (
        <span className="capitalize inline-flex items-center rounded-full bg-peenk-100 px-2.5 py-0.5 text-xs font-medium text-peenk-800">
          {row.original.format}
        </span>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <span className="capitalize">{row.original.category}</span>
      ),
    },
    {
      accessorKey: "tags",
      header: "Tags",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.tags?.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
            >
              {tag}
            </span>
          ))}
          {row.original.tags?.length > 2 && (
            <span className="text-xs text-gray-500">
              +{row.original.tags.length - 2}
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) =>
        row.original.price > 0 ? `$${row.original.price}` : "Free",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/admin/resources/${row.original.id}`);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteId(row.original.id);
            }}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-gray-900">
            Resources
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your learning resources
          </p>
        </div>
        <Link href="/admin/resources/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Resource
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-grin-200 border-t-grin-600" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={resourcesData?.data || []}
          searchKey="title"
          searchPlaceholder="Search resources..."
          onRowClick={(row) => router.push(`/admin/resources/${row.id}`)}
          bulkActions={
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </Button>
          }
        />
      )}

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={() => deleteId && deleteResource(deleteId)}
        title="Delete Resource"
        description="Are you sure you want to delete this resource? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
