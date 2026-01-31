"use client";

import {
  Calendar,
  BookOpen,
  MessageSquare,
  // Link2,
  Image as ImageIcon,
  MessagesSquare,
} from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStats } from "@/lib/tanstack/hooks/admin/useDashboard";

const statConfig = [
  {
    key: "events" as const,
    name: "Events",
    icon: Calendar,
    href: "/admin/events",
    color: "text-grin-600 bg-grin-100",
  },
  {
    key: "resources" as const,
    name: "Resources",
    icon: BookOpen,
    href: "/admin/resources",
    color: "text-peenk-600 bg-peenk-100",
  },
  // {
  // key: "testimonials" as const,
  // name: "Testimonials",
  // icon: MessageSquare,
  // href: "/admin/testimonials",
  // color: "text-ohrange-600 bg-ohrange-100",
  // },
  // {
  //   key: "links" as const,
  //   name: "Links",
  //   icon: Link2,
  //   href: "/admin/links",
  //   color: "text-perple-600 bg-perple-100",
  // },
  {
    key: "media" as const,
    name: "Media Files",
    icon: ImageIcon,
    href: "/admin/media",
    color: "text-lermorn-600 bg-lermorn-100",
  },
  {
    key: "chats" as const,
    name: "Chat Sessions",
    icon: MessagesSquare,
    href: "/admin/chat",
    color: "text-grin-600 bg-grin-100",
  },
];

function StatCardSkeleton() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Skeleton className="h-4 w-24 mb-3" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-3 w-28 mt-2" />
        </div>
        <Skeleton className="h-12 w-12 rounded-lg" />
      </div>
    </Card>
  );
}

export default function AdminDashboard() {
  const { data, isLoading, error } = useDashboardStats();

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome back! Here&apos;s an overview of your platform.
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-sm text-red-800">
            <strong>Error:</strong> Failed to load dashboard statistics.{" "}
            {error.message}
          </p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: statConfig?.length }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))
          : statConfig.map((stat) => {
              const stats = data?.data?.[stat.key];
              const total = stats?.total ?? 0;
              const active = stats?.active ?? 0;

              return (
                <Link key={stat.name} href={stat.href}>
                  <Card className="p-6 transition-shadow hover:shadow-lg cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          {stat.name}
                        </p>
                        <p className="mt-2  text-3xl font-bold text-gray-900">
                          {active}{" "}
                          <span className="text-gray-500 text-base">
                            / {total}
                          </span>
                        </p>
                      </div>
                      <div className={`rounded-lg p-3 ${stat.color}`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="font-heading text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/admin/events/new">
            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <Calendar className="h-5 w-5 text-grin-600 mb-2" />
              <p className="text-sm font-medium">Create Event</p>
            </Card>
          </Link>
          <Link href="/admin/resources/new">
            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <BookOpen className="h-5 w-5 text-peenk-600 mb-2" />
              <p className="text-sm font-medium">Add Resource</p>
            </Card>
          </Link>
          <Link href="/admin/testimonials">
            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <MessageSquare className="h-5 w-5 text-ohrange-600 mb-2" />
              <p className="text-sm font-medium">Review Testimonials</p>
            </Card>
          </Link>
          <Link href="/admin/media">
            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <ImageIcon className="h-5 w-5 text-perple-600 mb-2" />
              <p className="text-sm font-medium">Upload Media</p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
