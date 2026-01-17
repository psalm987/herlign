import { cleanupExpiredSessions } from "@/lib/chat/session";

export async function GET() {
    const deleted = await cleanupExpiredSessions();
    return Response.json({ deleted });
}