/**
 * Search and Filters Section
 * Filters for event type, mode, date range, and text search
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
  type: "event" | "workshop" | "";
  mode: "live" | "online" | "";
  dateFrom: string;
  dateTo: string;
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
  //   hasActiveFilters,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<FilterState>(filters);

  // Count active filters (excluding search)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (tempFilters.type) count++;
    if (tempFilters.mode) count++;
    if (tempFilters.dateFrom) count++;
    if (tempFilters.dateTo) count++;
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
      type: "",
      mode: "",
      dateFrom: "",
      dateTo: "",
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
            placeholder="Search events by title or description..."
            value={filters.search}
            onChange={(e) =>
              onFilterChange({ ...filters, search: e.target.value })
            }
            variant="gray"
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
                <span className="relative">
                  <Filter className="size-5" />
                  {activeFilterCount > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gray-700 text-[10px] font-semibold text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </span>
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

                {/* Event Type Filter */}
                <CustomSelect
                  label="Type"
                  value={tempFilters.type}
                  onChange={(e) => updateTempFilter("type", e.target.value)}
                  variant="gray"
                  options={[
                    { value: "", label: "All" },
                    { value: "event", label: "Events" },
                    { value: "workshop", label: "Workshops" },
                  ]}
                />

                {/* Mode Filter */}
                <CustomSelect
                  label="Mode"
                  value={tempFilters.mode}
                  onChange={(e) => updateTempFilter("mode", e.target.value)}
                  variant="gray"
                  options={[
                    { value: "", label: "All" },
                    { value: "live", label: "Live" },
                    { value: "online", label: "Online" },
                  ]}
                />

                {/* Date Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Date Range
                  </label>
                  <div className="space-y-2">
                    <TextField
                      type="date"
                      placeholder="From"
                      value={tempFilters.dateFrom}
                      onChange={(e) =>
                        updateTempFilter("dateFrom", e.target.value)
                      }
                      variant="gray"
                    />
                    <TextField
                      type="date"
                      placeholder="To"
                      value={tempFilters.dateTo}
                      onChange={(e) =>
                        updateTempFilter("dateTo", e.target.value)
                      }
                      variant="gray"
                    />
                  </div>
                </div>

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
                    className="flex-1 bg-gray-800 hover:bg-gray-900 text-white"
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
