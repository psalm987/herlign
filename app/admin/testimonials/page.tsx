"use client";

import { useState } from "react";
import {
  useAdminTestimonials,
  useDeleteTestimonial,
  useApproveTestimonial,
} from "@/lib/tanstack/hooks/admin/useTestimonials";
import {
  DataTable,
  SortableHeader,
  SelectCheckbox,
} from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, CheckCircle } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";

type Testimonial = {
  id: string;
  reviewer_name: string;
  reviewer_title: string | null;
  rating: number | null;
  review: string;
  is_approved: boolean;
  created_at: string;
};

export default function TestimonialsListPage() {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: testimonialsData, isLoading } = useAdminTestimonials({
    page: 1,
    limit: 100,
  });
  const { mutate: deleteTestimonial } = useDeleteTestimonial({
    onSuccess: () => {
      toast.success("Testimonial deleted");
      setDeleteId(null);
    },
  });
  const { mutate: approveTestimonial } = useApproveTestimonial({
    onSuccess: () => toast.success("Testimonial approved"),
  });

  const columns: ColumnDef<Testimonial>[] = [
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
      accessorKey: "reviewer_name",
      header: ({ column }) => (
        <SortableHeader column={column}>Reviewer</SortableHeader>
      ),
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.reviewer_name}</p>
          {row.original.reviewer_title && (
            <p className="text-xs text-gray-500">
              {row.original.reviewer_title}
            </p>
          )}
        </div>
      ),
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => (
        <div className="flex gap-0.5">
          {Array.from({ length: row.original.rating || 0 }).map((_, i) => (
            <span key={i} className="text-yellow-400">
              ★
            </span>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "review",
      header: "Review",
      cell: ({ row }) => (
        <p className="truncate max-w-md text-sm text-gray-600">
          {row.original.review}
        </p>
      ),
    },
    {
      accessorKey: "is_approved",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            row.original.is_approved
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {row.original.is_approved ? "Approved" : "Pending"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {!row.original.is_approved && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                approveTestimonial(row.original.id);
              }}
              className="text-green-600 hover:text-green-700"
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/admin/testimonials/${row.original.id}`);
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
            Testimonials
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage and approve testimonials
          </p>
        </div>
        <Link href="/admin/testimonials/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Testimonial
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
          data={testimonialsData?.data || []}
          searchKey="reviewer_name"
          searchPlaceholder="Search testimonials..."
          onRowClick={(row) => router.push(`/admin/testimonials/${row.id}`)}
        />
      )}

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={() => deleteId && deleteTestimonial(deleteId)}
        title="Delete Testimonial"
        description="Are you sure you want to delete this testimonial?"
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
