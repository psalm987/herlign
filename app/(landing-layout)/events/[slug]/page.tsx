"use client";
import React from "react";
import { useEventBySlug } from "@/lib/tanstack/hooks/useEvents";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CalendarIcon,
  // Clock,ßßß
  MapPinIcon,
  UsersIcon,
  ArrowLeftIcon,
  ExternalLinkIcon,
} from "lucide-react";
import Link from "next/link";

export default function EventDetailPage() {
  const { slug } = useParams();
  const { data, isLoading, error } = useEventBySlug(slug as string);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-grin-50 to-white py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-grin-200 rounded mb-8" />
            <div className="h-96 bg-grin-100 rounded-lg mb-6" />
            <div className="h-12 w-3/4 bg-grin-200 rounded mb-4" />
            <div className="h-6 w-1/2 bg-grin-100 rounded mb-8" />
            <div className="space-y-3">
              <div className="h-4 bg-grin-100 rounded w-full" />
              <div className="h-4 bg-grin-100 rounded w-5/6" />
              <div className="h-4 bg-grin-100 rounded w-4/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle error or not found
  if (error || !data?.data) {
    notFound();
  }

  const event = data.data;

  // Format dates
  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-grin-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-grin-700 hover:text-grin-800 mb-8 group"
        >
          <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="font-medium">Back to Events</span>
        </Link>

        {/* Event Image */}
        {event.image_url && (
          <div className="relative w-full h-96 rounded-xl overflow-hidden mb-8 shadow-lg">
            <Image
              src={event.image_url}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
            {event.featured && (
              <div className="absolute top-4 right-4 bg-perple-500 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-md">
                Featured
              </div>
            )}
          </div>
        )}

        {/* Event Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-grin-100 text-grin-800 rounded-full text-sm font-medium">
              {event.type === "event" ? "Event" : "Workshop"}
            </span>
            <span className="px-3 py-1 bg-ohrange-100 text-ohrange-800 rounded-full text-sm font-medium">
              {event.mode === "live" ? "In-Person" : "Online"}
            </span>
            {event.is_paid && (
              <span className="px-3 py-1 bg-peenk-100 text-peenk-800 rounded-full text-sm font-medium">
                ${event.price.toFixed(2)}
              </span>
            )}
          </div>

          <h1 className="font-heading text-4xl md:text-5xl text-grin-900 mb-4">
            {event.title}
          </h1>
        </div>

        {/* Event Details Card */}
        <Card className="p-6 mb-8  bg-lermorn-50 shadow-none border border-grin-100">
          <div className="grid gap-4">
            {/* Date & Time */}
            <div className="flex items-start gap-3">
              <CalendarIcon className="w-5 h-5 text-grin-600 mt-1 shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">
                  {formatDate(startDate)}
                </p>
                <p className="text-gray-600 text-sm">
                  {formatTime(startDate)} - {formatTime(endDate)}
                </p>
              </div>
            </div>

            {/* Location/Mode */}
            <div className="flex items-start gap-3">
              <MapPinIcon className="w-5 h-5 text-grin-600 mt-1 shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">
                  {event.mode === "live" ? "In-Person Event" : "Online Event"}
                </p>
                <p className="text-gray-600 text-sm">
                  {event.mode === "live"
                    ? "Location details will be shared with registered attendees"
                    : "Meeting link will be shared with registered attendees"}
                </p>
              </div>
            </div>

            {/* Max Attendees */}
            {event.max_attendees && (
              <div className="flex items-start gap-3">
                <UsersIcon className="w-5 h-5 text-grin-600 mt-1 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">
                    Limited to {event.max_attendees} attendees
                  </p>
                  <p className="text-gray-600 text-sm">
                    Register early to secure your spot
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Description */}
        <div className="prose prose-lg max-w-none mb-8">
          <h2 className="font-heading text-2xl text-grin-900 mb-4">
            About This {event.type === "event" ? "Event" : "Workshop"}
          </h2>
          <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {event.description}
          </div>
        </div>

        {/* Registration Button */}
        {event.external_link && (
          <div className="flex justify-center">
            <Button
              asChild
              size="lg"
              className="bg-grin-600 hover:bg-grin-700 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <a
                href={event.external_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                Register Now
                <ExternalLinkIcon className="w-5 h-5" />
              </a>
            </Button>
          </div>
        )}

        {/* Additional Info */}
        {event.is_paid && (
          <div className="mt-8 p-4 bg-peenk-50 border border-peenk-200 rounded-lg">
            <p className="text-center text-peenk-900">
              <span className="font-semibold">Registration Fee:</span> $
              {event.price.toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
