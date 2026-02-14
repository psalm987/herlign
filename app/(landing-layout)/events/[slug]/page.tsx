import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { serialize } from "next-mdx-remote/serialize";
import { type MDXRemoteSerializeResult } from "next-mdx-remote";
import MdxRemoteClient from "@/components/ui/editor/mdx-remote-client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  ArrowLeftIcon,
  ExternalLinkIcon,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Event } from "@/lib/tanstack/types";
import EventDateTimeClient from "@/components/sections/events/event-date-time-client";

/**
 * Generate metadata for event page
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: event }: { data: Event | null } = await supabase
    .from("events")
    .select("title, description, type, mode, start_date, image_url")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!event) {
    return {
      title: "Event Not Found | Herlign FC",
      description: "The event you are looking for could not be found.",
    };
  }

  const eventType = event.type === "event" ? "Event" : "Workshop";
  const eventMode = event.mode === "live" ? "In-Person" : "Online";
  const eventDate = new Date(event.start_date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return {
    title: `${event.title} | Herlign FC ${eventType}`,
    description: `${event.description.slice(0, 155)}... Join us for this ${eventMode.toLowerCase()} ${eventType.toLowerCase()} on ${eventDate}.`,
    openGraph: {
      title: event.title,
      description: event.description,
      type: "website",
      images: event.image_url ? [{ url: event.image_url }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description: event.description,
      images: event.image_url ? [event.image_url] : [],
    },
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: event, error }: { data: Event | null; error: Error | null } =
    await supabase
      .from("events")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

  console.log("Fetched event for slug:", slug, "Event found:", event);

  // Serialize description to MDX so we can render rich content
  const mdxSource: MDXRemoteSerializeResult<
    Record<string, unknown>,
    Record<string, unknown>
  > = await serialize(event?.description || "");

  // Handle error or not found
  if (error || !event) {
    return notFound();
  }

  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-gray-700 hover:font-semibold mb-8 group"
        >
          <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="font-medium">Back to Events</span>
        </Link>

        {/* Event Image */}
        {event.image_url && (
          <div className="relative w-full h-96 rounded-xl overflow-hidden mb-8">
            <Image
              src={event.image_url}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
            {event.featured && (
              <div className="absolute top-4 right-4 bg-black/20 text-white px-4 py-2 rounded-full font-semibold text-sm">
                Featured
              </div>
            )}
          </div>
        )}

        {/* Event Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-grin-100 text-ohrange-800 rounded-full text-sm font-medium">
              {event.type === "event" ? "Event" : "Workshop"}
            </span>
            <span className="px-3 py-1 bg-ohrange-100 text-ohrange-800 rounded-full text-sm font-medium">
              {event.mode === "live" ? "In-Person" : "Online"}
            </span>
            {event.is_paid && (
              <span className="px-3 py-1 bg-ohrange-100 text-ohrange-800 rounded-full text-sm font-medium">
                ${event.price.toFixed(2)}
              </span>
            )}
          </div>

          <h1 className="font-heading text-4xl md:text-5xl text-gray-900 mb-4">
            {event.title}
          </h1>
        </div>
        {/* Event Details Card */}
        <Card className="p-6 mb-8  bg-lermorn-50 shadow-none border border-grin-100">
          <div className="grid gap-4">
            {/* Date & Time */}
            <div className="flex items-start gap-3">
              <CalendarIcon className="w-5 h-5 text-ohrange-600 mt-1 shrink-0" />
              <EventDateTimeClient startDate={startDate} endDate={endDate} />
            </div>

            {/* Location/Mode */}
            <div className="flex items-start gap-3">
              <MapPinIcon className="w-5 h-5 text-ohrange-600 mt-1 shrink-0" />
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
                <UsersIcon className="w-5 h-5 text-ohrange-600 mt-1 shrink-0" />
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
          <h2 className="font-heading text-2xl text-gray-900 mb-4">
            About This {event.type === "event" ? "Event" : "Workshop"}
          </h2>
          <div className="text-gray-700 leading-loose">
            <MdxRemoteClient source={mdxSource} />
          </div>
        </div>

        {/* Registration Button */}
        {event.external_link && (
          <div className="flex justify-center">
            <Button
              asChild
              size="2xl"
              className="bg-ohrange-600 hover:bg-ohrange-700 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all w-full md:w-auto"
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
          <div className="mt-8 p-4 bg-ohrange-50 border border-ohrange-200 rounded-lg">
            <p className="text-center text-ohrange-900">
              <span className="font-semibold">Registration Fee:</span> $
              {event.price.toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
