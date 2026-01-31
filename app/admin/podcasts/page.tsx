"use client";

import { useState } from "react";
import {
  useAdminPodcasts,
  useDeletePodcast,
  useSyncPodcasts,
} from "@/lib/tanstack/hooks/admin/usePodcasts";
import {
  DataTable,
  SortableHeader,
  SelectCheckbox,
} from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, RefreshCw, Eye, EyeOff } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import type { Podcast } from "@/lib/actions/podcasts";

export default function PodcastsListPage() {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedRows] = useState<Podcast[]>([]);

  const { data: podcastsData } = useAdminPodcasts({
    page: 1,
    limit: 100,
  });

  const { mutate: deletePodcast } = useDeletePodcast({
    onSuccess: () => {
      toast.success("Podcast deleted successfully");
      setDeleteId(null);
    },
    onError: (error) => {
      toast.error(`Failed to delete podcast: ${error.message}`);
    },
  });

  const { mutate: syncPodcasts, isPending: isSyncing } = useSyncPodcasts({
    onSuccess: (response) => {
      const { added, updated, removed } = response.data || {};
      toast.success(
        `Sync complete: ${added} added, ${updated} updated, ${removed} removed`,
      );
    },
    onError: (error) => {
      toast.error(`Failed to sync podcasts: ${error.message}`);
    },
  });

  const columns: ColumnDef<Podcast>[] = [
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
        <div className="max-w-md">
          <p className="font-medium text-gray-900 line-clamp-2">
            {row.original.title}
          </p>
          <a
            href={`https://youtube.com/watch?v=${row.original.youtube_video_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-perple-600"
          >
            {row.original.youtube_video_id}
          </a>
        </div>
      ),
    },
    {
      accessorKey: "is_visible",
      header: "Visibility",
      cell: ({ row }) =>
        row.original.is_visible ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-grin-100 px-2.5 py-0.5 text-xs font-medium text-grin-800">
            <Eye className="size-3" />
            Visible
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            <EyeOff className="size-3" />
            Hidden
          </span>
        ),
    },
    {
      accessorKey: "view_count",
      header: ({ column }) => (
        <SortableHeader column={column}>Views</SortableHeader>
      ),
      cell: ({ row }) => row.original.view_count.toLocaleString(),
    },
    {
      accessorKey: "like_count",
      header: ({ column }) => (
        <SortableHeader column={column}>Likes</SortableHeader>
      ),
      cell: ({ row }) => row.original.like_count.toLocaleString(),
    },
    {
      accessorKey: "published_at",
      header: ({ column }) => (
        <SortableHeader column={column}>Published</SortableHeader>
      ),
      cell: ({ row }) =>
        format(new Date(row.original.published_at), "MMM d, yyyy"),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              router.push(`/admin/podcasts/${row.original.id}/edit`)
            }
          >
            <Edit className="size-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setDeleteId(row.original.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900">
            Podcasts
          </h1>
          <p className="text-gray-600 mt-1">
            Manage podcast videos synced from YouTube
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => syncPodcasts()}
            disabled={true}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw
              className={`size-4 ${isSyncing ? "animate-spin" : ""}`}
            />
            {isSyncing ? "Syncing..." : "Sync from YouTube"}
          </Button>
          <Button asChild className="gap-2 bg-grin-600 hover:bg-grin-700">
            <Link href="/admin/podcasts/create">
              <Plus className="size-4" />
              Add Podcast
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      {podcastsData && (
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border bg-white p-4">
            <p className="text-sm text-gray-600">Total Podcasts</p>
            <p className="text-2xl font-bold text-gray-900">
              {podcastsData.pagination.total}
            </p>
          </div>
          <div className="rounded-lg border bg-white p-4">
            <p className="text-sm text-gray-600">Visible</p>
            <p className="text-2xl font-bold text-grin-600">
              {podcastsData.data.filter((p) => p.is_visible).length}
            </p>
          </div>
          <div className="rounded-lg border bg-white p-4">
            <p className="text-sm text-gray-600">Hidden</p>
            <p className="text-2xl font-bold text-gray-600">
              {podcastsData.data.filter((p) => !p.is_visible).length}
            </p>
          </div>
          <div className="rounded-lg border bg-white p-4">
            <p className="text-sm text-gray-600">Total Views</p>
            <p className="text-2xl font-bold text-perple-600">
              {podcastsData.data
                .reduce((sum, p) => sum + p.view_count, 0)
                .toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="rounded-lg border bg-white">
        <DataTable
          columns={columns}
          data={podcastsData?.data || []}
          //   isLoading={isLoading}
          selectedRows={selectedRows}
          //   onRowSelectionChange={() => {}}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={() => deleteId && deletePodcast(deleteId)}
        title="Delete Podcast"
        description="Are you sure you want to delete this podcast? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
