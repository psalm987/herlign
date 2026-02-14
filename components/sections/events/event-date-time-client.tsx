"use client";
import { browserTimeZone, formatDate, formatTime } from "@/lib/utils/date";
import React from "react";
interface EventDateTimeClientProps {
  startDate: Date;
  endDate: Date;
}

const EventDateTimeClient = ({
  startDate,
  endDate,
}: EventDateTimeClientProps) => {
  return (
    <div>
      <p className="font-semibold text-gray-900">
        {formatDate(startDate, browserTimeZone)}
      </p>
      <p className="text-gray-600 text-sm">
        {formatTime(startDate, browserTimeZone)} -{" "}
        {formatTime(endDate, browserTimeZone)}
      </p>
    </div>
  );
};

export default EventDateTimeClient;
