/**
 * Search and Filters Section for Resources
 * Filters for format, category, tags, and price
 */

"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TextField } from "@/components/ui/text-field";
import { CustomSelect } from "@/components/ui/custom-select";

export interface FilterState {
  search: string;
  format: "ebook" | "guide" | "template" | "";
  category: string;
  tags: string;
  isPaid: "free" | "paid" | "";
}

interface SearchFiltersSectionProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const SearchFiltersSection: React.FC<SearchFiltersSectionProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<FilterState>(filters);

  // Count active filters (excluding search)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (tempFilters.format) count++;
    if (tempFilters.category) count++;
    if (tempFilters.tags) count++;
    if (tempFilters.isPaid) count++;
    return count;
  }, [tempFilters]);

  const updateTempFilter = (key: keyof FilterState, value: string) => {
    setTempFilters({ ...tempFilters, [key]: value });
  };

  const handleApply = () => {
    onFilterChange(tempFilters);
    setIsOpen(false);
  };

  const handleClear = () => {
    const clearedFilters: FilterState = {
      search: tempFilters.search,
      format: "",
      category: "",
      tags: "",
      isPaid: "",
    };
    setTempFilters(clearedFilters);
    onFilterChange(clearedFilters);
    onClearFilters();
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    // Reset temp filters to active filters when closing
    if (!open) {
      setTempFilters(filters);
    }
  };

  // Sync temp filters when filters prop changes
  React.useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  return (
    <section className="w-full py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Search Bar with Filter Button */}
        <div className="relative">
          <TextField
            type="text"
            placeholder="Search resources by title or description..."
            value={filters.search}
            onChange={(e) =>
              onFilterChange({ ...filters, search: e.target.value })
            }
            variant="grin"
            startDecoration={<Search className="size-5" />}
            className="pr-14"
            inputSize="lg"
          />

          {/* Filter Popover Trigger */}
          <Popover open={isOpen} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Open filters"
              >
                <div className="relative">
                  <Filter className="size-5" />
                  {activeFilterCount > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-grin-600 text-[10px] font-semibold text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-4" sideOffset={8}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Filters</h3>
                  {activeFilterCount > 0 && (
                    <span className="text-xs text-gray-500">
                      {activeFilterCount} active
                    </span>
                  )}
                </div>

                {/* Format Filter */}
                <CustomSelect
                  label="Format"
                  value={tempFilters.format}
                  onChange={(e) => updateTempFilter("format", e.target.value)}
                  variant="grin"
                  options={[
                    { value: "", label: "All Formats" },
                    { value: "ebook", label: "E-Book" },
                    { value: "guide", label: "Guide" },
                    { value: "template", label: "Template" },
                  ]}
                />

                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <TextField
                    type="text"
                    placeholder="Enter category"
                    value={tempFilters.category}
                    onChange={(e) =>
                      updateTempFilter("category", e.target.value)
                    }
                    variant="grin"
                  />
                </div>

                {/* Tags Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Tags
                  </label>
                  <TextField
                    type="text"
                    placeholder="Enter tags (comma-separated)"
                    value={tempFilters.tags}
                    onChange={(e) => updateTempFilter("tags", e.target.value)}
                    variant="grin"
                  />
                  <p className="text-xs text-gray-500">
                    Separate multiple tags with commas
                  </p>
                </div>

                {/* Price Filter */}
                <CustomSelect
                  label="Price"
                  value={tempFilters.isPaid}
                  onChange={(e) => updateTempFilter("isPaid", e.target.value)}
                  variant="grin"
                  options={[
                    { value: "", label: "All Resources" },
                    { value: "free", label: "Free Only" },
                    { value: "paid", label: "Paid Only" },
                  ]}
                />

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleClear}
                    variant="outline"
                    size="sm"
                    className={cn(
                      "flex-1",
                      activeFilterCount === 0 &&
                        "opacity-50 cursor-not-allowed",
                    )}
                    disabled={activeFilterCount === 0}
                  >
                    Clear
                  </Button>
                  <Button
                    onClick={handleApply}
                    size="sm"
                    className="flex-1 bg-grin-600 hover:bg-grin-700 text-white"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </section>
  );
};
