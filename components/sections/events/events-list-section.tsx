/**
 * Events List Section
 * Displays paginated list of event cards
 */

"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EventCard } from "./event-card";
import type { Event, PaginatedResponse } from "@/lib/tanstack/types";

interface EventsListSectionProps {
  data: PaginatedResponse<Event>;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const EventsListSection: React.FC<EventsListSectionProps> = ({
  data,
  currentPage,
  onPageChange,
}) => {
  const { data: events, pagination } = data;

  if (events.length === 0) return null;

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
          Showing <span className="font-medium">{events.length}</span> of{" "}
          <span className="font-medium">{pagination.total}</span> events
        </div>

        {/* Events List */}
        <div className="space-y-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
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
              size="icon"
              className={cn(!hasPrevious && "cursor-not-allowed opacity-50")}
            >
              <ChevronLeft className="size-4" />
            </Button>

            {/* Page Numbers */}
            {pageNumbers.map((page, index) => {
              if (page === "...") {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-2 text-gray-500"
                  >
                    ...
                  </span>
                );
              }

              const pageNum = page as number;
              const isActive = pageNum === currentPage;

              return (
                <Button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  variant={isActive ? "default" : "outline"}
                  size="icon"
                  className={cn(
                    isActive && "bg-grin-600 hover:bg-grin-700 text-white",
                  )}
                >
                  {pageNum}
                </Button>
              );
            })}

            {/* Next Button */}
            <Button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!hasNext}
              variant="outline"
              size="icon"
              className={cn(!hasNext && "cursor-not-allowed opacity-50")}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
