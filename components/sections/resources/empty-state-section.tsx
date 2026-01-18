/**
 * Empty State Section for Resources
 * Displays when no resources match filters
 */

import React from "react";
import Empty from "@/components/svg/empty";
import { Button } from "@/components/ui/button";

interface EmptyStateSectionProps {
  hasFilters?: boolean;
  onClearFilters?: () => void;
}

export const EmptyStateSection: React.FC<EmptyStateSectionProps> = ({
  hasFilters = false,
  onClearFilters,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <Empty size={300} />
      <h3 className="mt-6 font-heading text-2xl font-semibold text-gray-900">
        {hasFilters ? "No resources found" : "No resources yet"}
      </h3>
      <p className="mt-2 max-w-md text-center text-gray-600">
        {hasFilters
          ? "We couldn't find any resources matching your filters. Try adjusting your search criteria."
          : "There are no resources available at the moment. Check back soon for new ebooks, guides, and templates!"}
      </p>
      {hasFilters && onClearFilters && (
        <Button
          onClick={onClearFilters}
          className="mt-6 bg-grin-600 hover:bg-grin-700 text-white"
        >
          Clear All Filters
        </Button>
      )}
    </div>
  );
};
