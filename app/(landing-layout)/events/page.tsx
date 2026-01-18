"use client";

import React, { useState, useMemo } from "react";
import { useEvents } from "@/lib/tanstack/hooks/useEvents";
import { FeaturedCarouselSection } from "@/components/sections/events/featured-carousel-section";
import {
  SearchFiltersSection,
  type FilterState,
} from "@/components/sections/events/search-filters-section";
import { EventsListSection } from "@/components/sections/events/events-list-section";
import { EmptyStateSection } from "@/components/sections/events/empty-state-section";
import {
  FeaturedCarouselSkeleton,
  LoadingEventsGrid,
} from "@/components/sections/events/loading-states";
import { EventQuery } from "@/lib/tanstack/types";

const EVENTS_PER_PAGE = 5;

function EventsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    type: "",
    mode: "",
    dateFrom: "",
    dateTo: "",
  });

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.search !== "" ||
      filters.type !== "" ||
      filters.mode !== "" ||
      filters.dateFrom !== "" ||
      filters.dateTo !== ""
    );
  }, [filters]);

  // Build query params for API
  const queryParams = useMemo(() => {
    const params: EventQuery = {
      page: currentPage,
      limit: EVENTS_PER_PAGE,
      status: "published",
    };

    if (filters.type) params.type = filters.type;
    if (filters.mode) params.mode = filters.mode;
    if (filters.search) params.search = filters.search;

    // Convert date strings to ISO datetime format for API
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      params.dateFrom = fromDate.toISOString();
    }
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      params.dateTo = toDate.toISOString();
    }

    return params;
  }, [
    currentPage,
    filters.type,
    filters.mode,
    filters.search,
    filters.dateFrom,
    filters.dateTo,
  ]);

  // Fetch regular events using TanStack Query
  const { data, isLoading, error } = useEvents(queryParams, {
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch featured events for carousel separately
  const featuredQueryParams: EventQuery = {
    featured: true,
    status: "published",
    page: 1,
    limit: 5,
  };

  const { data: featuredData, isLoading: featuredLoading } = useEvents(
    featuredQueryParams,
    { staleTime: 5 * 60 * 1000 },
  );

  // Use data directly from API (filtering now handled server-side)
  const filteredEvents = useMemo(() => {
    return data?.data || [];
  }, [data?.data]);

  // Get featured events (from API with featured: true filter)
  const featuredEvents = useMemo(() => {
    if (!featuredData?.data) return [];

    // Sort by start date and take first 5
    return featuredData?.data
      .filter((event) => new Date(event.start_date) > new Date())
      .sort(
        (a, b) =>
          new Date(a.start_date).getTime() - new Date(b.start_date).getTime(),
      )
      .slice(0, 5);
  }, [featuredData?.data]);

  // Handle filter changes
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      type: "",
      mode: "",
      dateFrom: "",
      dateTo: "",
    });
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of events list
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  // Use pagination data directly from API
  const filteredData = data || null;

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-4xl  md:text-6xl font-semibold text-gray-900 mb-4">
          Events/Workshops
        </h2>
      </div>
      {/* Featured Carousel */}
      <div className="">
        {featuredLoading ? (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FeaturedCarouselSkeleton />
          </div>
        ) : (
          featuredEvents.length > 0 && (
            <FeaturedCarouselSection events={featuredEvents} />
          )
        )}
      </div>

      {/* Search and Filters */}
      <SearchFiltersSection
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Events List */}
      {isLoading ? (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <LoadingEventsGrid count={EVENTS_PER_PAGE} />
        </div>
      ) : filteredData && filteredEvents.length > 0 ? (
        <EventsListSection
          data={filteredData}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      ) : (
        <EmptyStateSection
          hasFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />
      )}
    </div>
  );
}

export default EventsPage;
