/**
 * Resource Card Component
 * Displays individual resource in grid layout
 */

import React from "react";
import { ExternalLink, Tag, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Resource } from "@/lib/tanstack/types";

interface ResourceCardProps {
  resource: Resource;
}

const formatBadges: Record<string, { bg: string; text: string }> = {
  ebook: { bg: "bg-perple-100 text-perple-700", text: "E-Book" },
  guide: { bg: "bg-ohrange-100 text-ohrange-700", text: "Guide" },
  template: { bg: "bg-peenk-100 text-peenk-700", text: "Template" },
};

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const formatBadge = formatBadges[resource.format] || formatBadges.ebook;

  return (
    <div className="group relative flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6">
      {/* Format Badge */}
      <div className="mb-3 flex items-center justify-between">
        <span
          className={cn(
            "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
            formatBadge.bg,
          )}
        >
          {formatBadge.text}
        </span>
        {resource.is_paid ? (
          <div className="flex items-center gap-1 text-grin-600">
            <DollarSign className="h-4 w-4" />
            <span className="text-sm font-semibold">
              ${resource.price.toFixed(2)}
            </span>
          </div>
        ) : (
          <span className="text-sm font-semibold text-grin-600">FREE</span>
        )}
      </div>

      {/* Category */}
      <div className="mb-2">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
          {resource.category}
        </span>
      </div>

      {/* Title */}
      <h3 className="mb-3 font-heading text-xl font-semibold text-gray-900 line-clamp-2">
        {resource.title}
      </h3>

      {/* Description */}
      <p className="mb-4 grow text-sm text-gray-600 line-clamp-3">
        {resource.description}
      </p>

      {/* Tags */}
      {resource.tags && resource.tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {resource.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600"
            >
              <Tag className="h-3 w-3" />
              {tag}
            </span>
          ))}
          {resource.tags.length > 3 && (
            <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600">
              +{resource.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* CTA Button */}

      <Button
        className="mt-auto w-full bg-grin-600 hover:bg-grin-700 text-white transition-all"
        asChild
      >
        <a
          href={resource.external_link}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Access Resource</span>
          <ExternalLink className="ml-2 h-4 w-4" />
        </a>
      </Button>
    </div>
  );
};
