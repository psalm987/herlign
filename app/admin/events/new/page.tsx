"use client";

import { EventForm } from "@/components/admin/forms/event-form";
import { useCreateEvent } from "@/lib/tanstack/hooks/admin/useEvents";
import { type EventInput } from "@/lib/validators/events";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewEventPage() {
  const router = useRouter();
  const { mutate: createEvent, isPending } = useCreateEvent({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSuccess: (response) => {
      toast.success("Event created successfully!");
      router.push("/admin/events");
    },
    onError: (error) => {
      toast.error(`Failed to create event: ${error.message}`);
    },
  });

  const handleSubmit = (data: EventInput) => {
    createEvent(data);
  };

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
          Create New Event
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Fill in the details below to create a new event or workshop
        </p>
      </div>

      <EventForm
        onSubmit={handleSubmit}
        isSubmitting={isPending}
        submitText="Create Event"
      />
    </div>
  );
}
