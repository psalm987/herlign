/**
 * Resources List Section
 * Displays paginated grid of resource cards
 */

"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ResourceCard } from "./resource-card";
import type { Resource, PaginatedResponse } from "@/lib/tanstack/types";

interface ResourcesListSectionProps {
  data: PaginatedResponse<Resource>;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const ResourcesListSection: React.FC<ResourcesListSectionProps> = ({
  data,
  currentPage,
  onPageChange,
}) => {
  const { data: resources, pagination } = data;

  if (resources.length === 0) return null;

  const totalPages = pagination.totalPages;
  const hasNext = pagination.hasNext;
  const hasPrevious = currentPage > 1;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <section className="w-full py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Results Count */}
        <div className="mb-6 text-sm text-gray-600">
          Showing <span className="font-medium">{resources.length}</span> of{" "}
          <span className="font-medium">{pagination.total}</span> resources
        </div>

        {/* Resources Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            {/* Previous Button */}
            <Button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={!hasPrevious}
              variant="outline"
              className="disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="ml-1">Previous</span>
            </Button>

            {/* Page Numbers */}
            <div className="flex gap-1">
              {pageNumbers.map((pageNum, idx) => {
                if (pageNum === "...") {
                  return (
                    <span
                      key={`ellipsis-${idx}`}
                      className="flex h-10 w-10 items-center justify-center"
                    >
                      ...
                    </span>
                  );
                }

                const page = pageNum as number;
                const isActive = page === currentPage;

                return (
                  <Button
                    key={page}
                    onClick={() => onPageChange(page)}
                    variant={isActive ? "default" : "outline"}
                    className={cn(
                      "h-10 w-10 p-0",
                      isActive &&
                        "bg-grin-600 text-white hover:bg-grin-700 border-grin-600",
                    )}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>

            {/* Next Button */}
            <Button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!hasNext}
              variant="outline"
              className="disabled:opacity-50"
            >
              <span className="mr-1">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
