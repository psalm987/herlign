"use client";

import { useState } from "react";
import {
  useAdminMedia,
  useUploadMedia,
  useDeleteMedia,
  useUnusedMedia,
} from "@/lib/tanstack/hooks/admin/useMedia";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Trash2, Search, AlertTriangle } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export default function MediaPage() {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUnused, setShowUnused] = useState(false);

  const { data: mediaData, isLoading } = useAdminMedia({ page: 1, limit: 100 });
  const { data: unusedData } = useUnusedMedia({ enabled: showUnused });

  const { mutate: uploadMedia, isPending: isUploading } = useUploadMedia({
    onSuccess: () => toast.success("File uploaded successfully!"),
    onError: (error) => toast.error(`Upload failed: ${error.message}`),
  });

  const { mutate: deleteMedia } = useDeleteMedia({
    onSuccess: () => {
      toast.success("Media deleted");
      setDeleteId(null);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      uploadMedia({ file, alt_text: file.name });
    }
  };

  const displayMedia = showUnused ? unusedData?.data : mediaData?.data;
  const filteredMedia = displayMedia?.filter((media) =>
    media.filename.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold text-gray-900">
          Media Library
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Upload and manage your media files
        </p>
      </div>

      {/* Actions */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant={showUnused ? "default" : "outline"}
          onClick={() => setShowUnused(!showUnused)}
          className="gap-2"
        >
          <AlertTriangle className="h-4 w-4" />
          {showUnused ? "Show All" : "Show Unused"}
        </Button>
        <label htmlFor="media-upload">
          <Button disabled={isUploading} asChild>
            <span className="gap-2 cursor-pointer">
              <Upload className="h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload Media"}
            </span>
          </Button>
          <input
            id="media-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
        </label>
      </div>

      {/* Media Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full" />
          ))}
        </div>
      ) : filteredMedia && filteredMedia.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredMedia.map((media) => (
            <div
              key={media.id}
              className="group relative aspect-square overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-50 hover:border-grin-500 transition-all"
            >
              <Image
                src={media.url}
                alt={media.alt_text || media.filename}
                className="h-full w-full object-cover"
                fill
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="truncate text-xs text-white mb-2">
                    {media.filename}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleteId(media.id)}
                      className="flex-1"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
              {!media.is_used && (
                <div className="absolute top-2 right-2 rounded-full bg-yellow-500 p-1">
                  <AlertTriangle className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Upload className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-500">No media found</p>
          <p className="text-xs text-gray-400">
            Upload your first file to get started
          </p>
        </div>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={() => deleteId && deleteMedia(deleteId)}
        title="Delete Media"
        description="Are you sure you want to delete this file? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
