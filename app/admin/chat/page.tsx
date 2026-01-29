"use client";

// import { useState } from 'react';
import { useAdminChatSessions } from "@/lib/tanstack/hooks/admin/useChat";
import { DataTable, SortableHeader } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { MessageSquare, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { format, formatDistanceToNow } from "date-fns";

type ChatSession = {
  id: string;
  guest_ip_hash: string;
  current_mode: string;
  last_message_at: string;
  created_at: string;
  expires_at: string;
};

export default function ChatSessionsPage() {
  const router = useRouter();
  const { data: sessionsData, isLoading } = useAdminChatSessions({
    page: 1,
    limit: 100,
  });

  const columns: ColumnDef<ChatSession>[] = [
    {
      accessorKey: "id",
      header: "Session ID",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-gray-600">
          {row.original.id.slice(0, 8)}...
        </span>
      ),
    },
    {
      accessorKey: "current_mode",
      header: "Mode",
      cell: ({ row }) => (
        <span
          className={`capitalize inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            row.original.current_mode === "live"
              ? "bg-green-100 text-green-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {row.original.current_mode}
        </span>
      ),
    },
    {
      accessorKey: "last_message_at",
      header: ({ column }) => (
        <SortableHeader column={column}>Last Message</SortableHeader>
      ),
      cell: ({ row }) => (
        <div className="text-sm">
          <p className="text-gray-900">
            {formatDistanceToNow(new Date(row.original.last_message_at), {
              addSuffix: true,
            })}
          </p>
          <p className="text-xs text-gray-500">
            {format(
              new Date(row.original.last_message_at),
              "MMM dd, yyyy HH:mm",
            )}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) =>
        format(new Date(row.original.created_at), "MMM dd, yyyy"),
    },
    {
      accessorKey: "expires_at",
      header: "Expires",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-3 w-3 text-gray-400" />
          {formatDistanceToNow(new Date(row.original.expires_at), {
            addSuffix: true,
          })}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/admin/chat/${row.original.id}`);
          }}
          className="gap-2"
        >
          <MessageSquare className="h-4 w-4" />
          View Chat
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold text-gray-900">
          Chat Sessions
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage and respond to guest chat sessions
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-grin-200 border-t-grin-600" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={sessionsData?.data || []}
          onRowClick={(row) => router.push(`/admin/chat/${row.id}`)}
        />
      )}
    </div>
  );
}
