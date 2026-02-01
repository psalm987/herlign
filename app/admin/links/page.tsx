"use client";

import { useState } from "react";
import {
  useAdminLinks,
  useDeleteLink,
} from "@/lib/tanstack/hooks/admin/useLinks";
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

type LinkType = {
  id: string;
  name: string;
  href: string;
  category: string;
  created_at: string;
};

export default function LinksListPage() {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: linksData, isLoading } = useAdminLinks({ page: 1, limit: 100 });
  const { mutate: deleteLink } = useDeleteLink({
    onSuccess: () => {
      toast.success("Link deleted");
      setDeleteId(null);
    },
  });

  const columns: ColumnDef<LinkType>[] = [
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
      accessorKey: "name",
      header: ({ column }) => (
        <SortableHeader column={column}>Name</SortableHeader>
      ),
    },
    {
      accessorKey: "href",
      header: "URL",
      cell: ({ row }) => (
        <a
          href={row.original.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-ohrange-600 hover:underline truncate max-w-md block"
          onClick={(e) => e.stopPropagation()}
        >
          {row.original.href}
        </a>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <span className="capitalize inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
          {row.original.category}
        </span>
      ),
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
              router.push(`/admin/links/${row.original.id}`);
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
            className="text-red-600"
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
            Links
          </h1>
          <p className="mt-1 text-sm text-gray-600">Manage external links</p>
        </div>
        <Link href="/admin/links/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Link
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
          data={linksData?.data || []}
          searchKey="name"
          searchPlaceholder="Search links..."
          onRowClick={(row) => router.push(`/admin/links/${row.id}`)}
        />
      )}

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={() => deleteId && deleteLink(deleteId)}
        title="Delete Link"
        description="Are you sure you want to delete this link?"
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
