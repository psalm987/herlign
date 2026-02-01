"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Upload,
  Search,
  Check,
  // X
} from "lucide-react";
import {
  //   useAdminMedia,
  useInfiniteAdminMedia,
  useUploadMedia,
} from "@/lib/tanstack/hooks/admin/useMedia";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface MediaPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (media: {
    id: string;
    url: string;
    filename: string;
    alt_text?: string | null;
  }) => void;
  selectedId?: string;
}

export function MediaPickerModal({
  open,
  onOpenChange,
  onSelect,
  selectedId,
}: MediaPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [page, setPage] = useState(1);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Fetch media with pagination
  const {
    data: mediaData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteAdminMedia(
    {
      //   page,
      limit: 20,
      //  search: searchQuery
    },
    {
      enabled: open,
    },
  );

  // Upload media mutation
  const { mutate: uploadMedia, isPending: isUploading } = useUploadMedia({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSuccess: (response) => {
      toast.success("File uploaded successfully!");
      // The query will auto-refetch
    },
    onError: (error) => {
      toast.error(`Upload failed: ${error.message}`);
    },
  });

  // Handle file upload
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error("File size must be less than 5MB");
          return;
        }

        // Validate file type
        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/svg+xml",
        ];
        if (!allowedTypes.includes(file.type)) {
          toast.error("Invalid file type. Allowed: JPG, PNG, WebP, SVG");
          return;
        }

        uploadMedia({ file, alt_text: file.name });
      }
    },
    [uploadMedia],
  );

  // Infinite scroll observer
  useEffect(() => {
    if (!observerTarget.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(observerTarget.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const mediaItems = mediaData?.pages?.flatMap((page) => page.data) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Media Library</DialogTitle>
        </DialogHeader>

        {/* Upload and Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search media..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <label htmlFor="media-upload">
            <Button type="button" disabled={isUploading} asChild>
              <span className="gap-2 cursor-pointer">
                <Upload className="h-4 w-4" />
                {isUploading ? "Uploading..." : "Upload"}
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
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full" />
              ))}
            </div>
          ) : mediaItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-500">No media found</p>
              <p className="text-xs text-gray-400">
                Upload your first file to get started
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-4 gap-4">
                {mediaItems.map((media) => (
                  <button
                    key={media.id}
                    onClick={() => {
                      onSelect(media);
                      onOpenChange(false);
                    }}
                    className={cn(
                      "group relative aspect-square overflow-hidden rounded-lg border-2 transition-all hover:border-ohrange-500",
                      selectedId === media.id
                        ? "border-ohrange-600 ring-2 ring-ohrange-600 ring-offset-2"
                        : "border-gray-200",
                    )}
                  >
                    <Image
                      fill
                      src={media.url}
                      alt={media.alt_text || media.filename}
                      className="h-full w-full object-cover"
                    />
                    {selectedId === media.id && (
                      <div className="absolute inset-0 flex items-center justify-center bg-ohrange-600/20">
                        <div className="rounded-full bg-ohrange-600 p-2">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <p className="truncate text-xs text-white">
                        {media.filename}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Infinite Scroll Trigger */}
              {hasNextPage && (
                <div ref={observerTarget} className="py-4">
                  {isFetchingNextPage && (
                    <div className="grid grid-cols-4 gap-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="aspect-square w-full" />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center border-t pt-4">
          <p className="text-xs text-gray-500">
            Allowed: JPG, PNG, WebP, SVG • Max 5MB
          </p>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
