"use client";

import { useState } from "react";
import {
  useAdminEvents,
  useDeleteEvent,
} from "@/lib/tanstack/hooks/admin/useEvents";
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
import { format } from "date-fns";

type Event = {
  id: string;
  title: string;
  type: string;
  mode: string;
  status: string;
  start_date: string;
  end_date: string;
  featured: boolean;
  price: number;
  created_at: string;
};

export default function EventsListPage() {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [
    selectedRows,
    // setSelectedRows
  ] = useState<Event[]>([]);

  const { data: eventsData, isLoading } = useAdminEvents({
    page: 1,
    limit: 100,
  });
  const { mutate: deleteEvent } = useDeleteEvent({
    onSuccess: () => {
      toast.success("Event deleted successfully");
      setDeleteId(null);
    },
    onError: (error) => {
      toast.error(`Failed to delete event: ${error.message}`);
    },
  });

  const columns: ColumnDef<Event>[] = [
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
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-gray-900">{row.original.title}</p>
          {row.original.featured && (
            <span className="text-xs text-ohrange-600 font-medium">
              Featured
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <span className="capitalize inline-flex items-center rounded-full bg-ohrange-100 px-2.5 py-0.5 text-xs font-medium text-ohrange-800">
          {row.original.type}
        </span>
      ),
    },
    {
      accessorKey: "mode",
      header: "Mode",
      cell: ({ row }) => (
        <span className="capitalize inline-flex items-center rounded-full bg-peenk-100 px-2.5 py-0.5 text-xs font-medium text-peenk-800">
          {row.original.mode}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const statusColors = {
          draft: "bg-gray-100 text-gray-800",
          published: "bg-ohrange-100 text-ohrange-800",
          cancelled: "bg-peenk-100 text-peenk-800",
        };
        return (
          <span
            className={`capitalize inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              statusColors[row.original.status as keyof typeof statusColors]
            }`}
          >
            {row.original.status}
          </span>
        );
      },
    },
    {
      accessorKey: "start_date",
      header: ({ column }) => (
        <SortableHeader column={column}>Start Date</SortableHeader>
      ),
      cell: ({ row }) =>
        format(new Date(row.original.start_date), "MMM dd, yyyy"),
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
              router.push(`/admin/events/${row.original.id}`);
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

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) return;

    toast.info("Bulk delete API not yet implemented");
    // TODO: Implement bulk delete API
    // selectedRows.forEach(row => deleteEvent({ id: row.id }));
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-gray-900">
            Events
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your events and workshops
          </p>
        </div>
        <Link href="/admin/events/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Event
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-ohrange-200 border-t-ohrange-600" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={eventsData?.data || []}
          searchKey="title"
          searchPlaceholder="Search events..."
          onRowClick={(row) => router.push(`/admin/events/${row.id}`)}
          bulkActions={
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkDelete}
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
        onConfirm={() => deleteId && deleteEvent(deleteId)}
        title="Delete Event"
        description="Are you sure you want to delete this event? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
