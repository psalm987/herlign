"use client";

import React, { useState, useMemo } from "react";
import { useResources } from "@/lib/tanstack/hooks/useResources";
import {
  SearchFiltersSection,
  type FilterState,
} from "@/components/sections/resources/search-filters-section";
import { ResourcesListSection } from "@/components/sections/resources/resources-list-section";
import { EmptyStateSection } from "@/components/sections/events/empty-state-section";
import { LoadingResourcesGrid } from "@/components/sections/resources/loading-states";
import { ResourceQuery } from "@/lib/tanstack/types";

const RESOURCES_PER_PAGE = 12;

function ResourcesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    format: "",
    category: "",
    tags: "",
    isPaid: "",
  });

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.search !== "" ||
      filters.format !== "" ||
      filters.category !== "" ||
      filters.tags !== "" ||
      filters.isPaid !== ""
    );
  }, [filters]);

  // Build query params for API
  const queryParams = useMemo(() => {
    const params: ResourceQuery = {
      page: currentPage,
      limit: RESOURCES_PER_PAGE,
    };

    if (filters.format)
      params.format = filters.format as "ebook" | "guide" | "template";
    if (filters.category) params.category = filters.category;
    if (filters.tags) params.tags = filters.tags;
    if (filters.search) params.search = filters.search;

    return params;
  }, [currentPage, filters]);

  // Fetch resources
  const { data, isLoading, error } = useResources(queryParams, {
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Client-side filtering for price only (search is now server-side)
  const filteredData = useMemo(() => {
    if (!data?.data) return data;

    let filtered = [...data.data];

    // Price filter
    if (filters.isPaid === "free") {
      filtered = filtered.filter((resource) => !resource.is_paid);
    } else if (filters.isPaid === "paid") {
      filtered = filtered.filter((resource) => resource.is_paid);
    }

    return {
      ...data,
      data: filtered,
      pagination: {
        ...data.pagination,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / RESOURCES_PER_PAGE),
      },
    };
  }, [data, filters.isPaid]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      format: "",
      category: "",
      tags: "",
      isPaid: "",
    });
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden  py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-heading text-4xl font-semibold text-gray-900 sm:text-5xl lg:text-6xl">
              Growth Resources
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Discover our curated collection of ebooks, guides, and templates
              to accelerate your career growth.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <SearchFiltersSection
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Loading State */}
      {isLoading && <LoadingResourcesGrid />}

      {/* Error State */}
      {error && (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-red-600">
              Failed to load resources. Please try again later.
            </p>
          </div>
        </div>
      )}

      {/* Resources List */}
      {!isLoading && filteredData && filteredData.data.length > 0 && (
        <ResourcesListSection
          data={filteredData}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Empty State */}
      {!isLoading &&
        !error &&
        filteredData &&
        filteredData.data.length === 0 && (
          <EmptyStateSection
            hasFilters={hasActiveFilters}
            onClearFilters={handleClearFilters}
          />
        )}
    </div>
  );
}

export default ResourcesPage;
