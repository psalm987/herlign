/**
 * Event Card Component
 * Displays individual event in list layout
 */

import React from "react";
import {
  Calendar,
  // MapPin,
  Users,
  DollarSign,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
import type { Event } from "@/lib/tanstack/types";
import Image from "next/image";
import Link from "next/link";
import { formatDate, formatTime } from "@/lib/utils/date";

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);
  const isUpcoming = startDate > new Date();
  const isPast = endDate < new Date();

  const soon =
    startDate.getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000;

  const statusBadge = (
    <div className="absolute left-3 top-3">
      <span
        className={cn(
          "rounded-full px-3 py-1 text-xs font-medium",
          isUpcoming && "bg-gray-600/20 text-white",
          isPast && "bg-gray-600 text-white",
          !isUpcoming && !isPast && "bg-perple-600 text-white",
        )}
      >
        {isPast
          ? "Past"
          : isUpcoming
            ? soon
              ? "Soon"
              : "Upcoming"
            : "Ongoing"}
      </span>
    </div>
  );

  return (
    <Link
      href={`/events/${event.slug}`}
      className={cn(
        "group relative flex flex-col py-8 px-0 md:py-2 md:px-8 gap-4 cursor-pointer hover:md:bg-gray-50 md:flex-row md:gap-6",
        isPast && "opacity-60",
      )}
    >
      {/* Event Image */}
      {event.image_url ? (
        <div className="relative h-48 w-full overflow-hidden rounded-lg md:h-auto md:w-64 shrink-0">
          <Image
            fill
            src={event.image_url}
            alt={event.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          {statusBadge}
        </div>
      ) : (
        <div className="relative flex h-48 w-full items-center justify-center rounded-lg bg-linear-to-br from-grin-500 to-grin-600 md:h-auto md:w-64 shrink-0">
          <Calendar className="size-16 text-grin-100" />
          {statusBadge}
        </div>
      )}

      {/* Event Details */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          {/* Type and Mode Badges */}
          <div className="mb-3 flex flex-wrap gap-2">
            <span
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium",
                event.type === "workshop"
                  ? "bg-ohrange-100 text-ohrange-700"
                  : "bg-ohrange-100 text-ohrange-700",
              )}
            >
              {event.type === "workshop" ? "Workshop" : "Event"}
            </span>
            <span
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium",
                event.mode === "online"
                  ? "bg-perple-100 text-perple-700"
                  : "bg-lermorn-100 text-lermorn-700",
              )}
            >
              {event.mode === "online" ? "Online" : "Live"}
            </span>
          </div>

          {/* Title and Description */}
          <h3 className="mb-2 font-heading text-xl font-semibold text-gray-900">
            {event.title}
          </h3>
          <p className="mb-4 line-clamp-2 text-sm text-gray-600">
            {event.description}
          </p>

          {/* Event Meta Information */}
          <div className="grid gap-2 text-sm text-gray-600 sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-ohrange-500" />
              <span>
                {formatDate(startDate)}
                {startDate.toDateString() !== endDate.toDateString() &&
                  ` - ${formatDate(endDate)}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-ohrange-500" />
              <span>
                {formatTime(startDate)} - {formatTime(endDate)}
              </span>
            </div>
            {event.max_attendees && (
              <div className="flex items-center gap-2">
                <Users className="size-4 text-ohrange-500" />
                <span>Max {event.max_attendees} attendees</span>
              </div>
            )}
            {event.is_paid && (
              <div className="flex items-center gap-2">
                <DollarSign className="size-4 text-ohrange-500" />
                <span>${event.price.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        {/* <div className="mt-4 flex items-center justify-between">
          {event.external_link ? (
            <Button
              asChild
              className="bg-ohrange-600 hover:bg-ohrange-700 text-white w-full md:w-auto"
            >
              <a
                href={event.external_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {event.is_paid ? "Register & Pay" : "Register Now"}
              </a>
            </Button>
          ) : (
            <Button disabled className="bg-gray-400 w-full md:w-auto">
              {isUpcoming ? "Anticipate!" : "Registration Closed"}
            </Button>
          )}
        </div> */}
      </div>
    </Link>
  );
};
