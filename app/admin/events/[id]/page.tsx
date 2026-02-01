"use client";

import { useParams } from "next/navigation";
import { EventForm } from "@/components/admin/forms/event-form";
import {
  useAdminEvents,
  useUpdateEvent,
} from "@/lib/tanstack/hooks/admin/useEvents";
import { type EventInput } from "@/lib/validators/events";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditEventPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const { data: eventsData } = useAdminEvents({ page: 1, limit: 100 });
  const event = eventsData?.data?.find((e) => e.id === id);

  const { mutate: updateEvent, isPending } = useUpdateEvent({
    onSuccess: () => {
      toast.success("Event updated successfully!");
      router.push("/admin/events");
    },
    onError: (error) => {
      toast.error(`Failed to update event: ${error.message}`);
    },
  });

  const handleSubmit = (data: EventInput) => {
    updateEvent({ id, data });
  };

  if (!event) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-gray-600">Event not found</p>
            <Link
              href="/admin/events"
              className="mt-4 inline-block text-ohrange-600 hover:text-ohrange-700"
            >
              Back to Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href="/admin/events"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Link>
        <h1 className="mt-4 font-heading text-3xl font-bold text-gray-900">
          Edit Event
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Update the event details below
        </p>
      </div>

      <EventForm
        defaultValues={event}
        onSubmit={handleSubmit}
        isSubmitting={isPending}
        submitText="Update Event"
      />
    </div>
  );
}
