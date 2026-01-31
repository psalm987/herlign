/**
 * Featured Carousel Section
 * Auto-rotating carousel with manual navigation for featured events
 */

"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Event } from "@/lib/tanstack/types";
import Image from "next/image";

interface FeaturedCarouselSectionProps {
  events: Event[];
}

export const FeaturedCarouselSection: React.FC<
  FeaturedCarouselSectionProps
> = ({ events }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-rotation every 5 seconds
  useEffect(() => {
    if (isPaused || events.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, events.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % events.length);
  };

  if (events.length === 0) return null;

  const currentEvent = events[currentIndex];
  const startDate = new Date(currentEvent.start_date);
  const endDate = new Date(currentEvent.end_date);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <section className="relative w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="relative h-[500px] overflow-hidden rounded-xl"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            {currentEvent.image_url ? (
              <Image
                src={currentEvent.image_url}
                alt={currentEvent.title}
                fill
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-linear-to-br from-grin-400 via-perple-500 to-peenk-800" />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-black/20 to-85%" />
          </div>

          {/* Content */}
          <div className="relative flex h-full items-end p-8 md:p-12">
            <div className="w-full max-w-3xl space-y-4">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white border border-white/30">
                  Featured
                </span>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium text-white",
                    currentEvent.type === "workshop"
                      ? "bg-ohrange-500/50"
                      : "bg-peenk-500/50",
                  )}
                >
                  {currentEvent.type === "workshop" ? "Workshop" : "Event"}
                </span>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium text-white",
                    currentEvent.mode === "online"
                      ? "bg-perple-500/50 "
                      : "bg-lermorn-500/50",
                  )}
                >
                  {currentEvent.mode === "online" ? "Online" : "Live"}
                </span>
              </div>

              {/* Title */}
              <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                {currentEvent.title}
              </h2>

              {/* Description */}
              <p className="line-clamp-2 text-base text-white/90 sm:text-lg">
                {currentEvent.description}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 text-sm text-white/90">
                <div className="flex items-center gap-2">
                  <Calendar className="size-4" />
                  <span>{formatDate(startDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-4" />
                  <span>
                    {formatTime(startDate)} - {formatTime(endDate)}
                  </span>
                </div>
                {currentEvent.max_attendees && (
                  <div className="flex items-center gap-2">
                    <Users className="size-4" />
                    <span>Max {currentEvent.max_attendees} attendees</span>
                  </div>
                )}
              </div>

              {/* CTA Button */}
              {currentEvent.external_link && (
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-grin-700 hover:bg-white/90"
                >
                  <a
                    href={currentEvent.external_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {currentEvent.is_paid
                      ? `Register - $${currentEvent.price.toFixed(2)}`
                      : "Register Now"}
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Navigation Arrows */}
          {events.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 backdrop-blur-sm p-2 text-white transition-all hover:bg-white/30 border border-white/30"
                aria-label="Previous event"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 backdrop-blur-sm p-2 text-white transition-all hover:bg-white/30 border border-white/30"
                aria-label="Next event"
              >
                <ChevronRight className="size-6" />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {events.length > 1 && (
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
              {events.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    index === currentIndex
                      ? "w-8 bg-white"
                      : "w-2 bg-white/50 hover:bg-white/70",
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
