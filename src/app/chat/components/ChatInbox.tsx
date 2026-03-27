"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/ui/AppIcon";
import { supabase } from "@/lib/supabaseClient";

interface MessagePreview {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  read_at: string | null;
}

interface VehicleInfo {
  id: string;
  make: string | null;
  model: string | null;
  year: number | null;
  images: string[] | null;
}

interface Conversation {
  id: string;
  buyer_id: string;
  seller_id: string;
  vehicle_id: string | null;
  auction_id: string | null;
  created_at: string;
  messages?: MessagePreview[];
  vehicles?: VehicleInfo;
}

const ChatInbox = () => {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      // 🔹 Get session + current user
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("[ChatInbox] getSession error:", error);
      }

      const user = session?.user ?? null;
      if (!user) {
        setCurrentUserId(null);
        setLoading(false);
        return;
      }

      setCurrentUserId(user.id);

      // 🔹 Fetch conversations from API with bearer token
      const headers: HeadersInit = {};
      if (session?.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`;
      }

      const res = await fetch("/api/chat", { headers });
      const json = await res.json().catch(() => null);

      setConversations(Array.isArray(json) ? json : []);
      setLoading(false);
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="text-muted-foreground text-sm">
        Loading conversations...
      </div>
    );
  }

  if (!currentUserId) {
    return (
      <div className="border border-border rounded-lg p-6 bg-card text-center text-sm text-muted-foreground">
        Please sign in to view your messages.
      </div>
    );
  }

  if (!conversations.length) {
    return (
      <div className="border border-border rounded-lg p-6 bg-card text-center text-sm text-muted-foreground">
        No conversations yet. Win or sell an auction to start chatting.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {conversations.map((c) => {
        const isBuyer = c.buyer_id === currentUserId;
        const label = isBuyer ? "Seller" : "Buyer";

        const vehicle = (c as any).vehicles as VehicleInfo | undefined;
        const last =
          c.messages && c.messages.length
            ? c.messages[c.messages.length - 1]
            : null;

        const title = vehicle
          ? `${vehicle.make ?? ""} ${vehicle.model ?? ""} ${
              vehicle.year ?? ""
            }`.trim()
          : `Conversation with ${label}`;

        return (
          <button
            key={c.id}
            onClick={() => router.push(`/chat/${c.id}`)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors text-left"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                <Icon name="ChatBubbleLeftRightIcon" size={18} />
              </div>
              <div>
                <p className="text-sm font-medium text-card-foreground">
                  {title || `Conversation with ${label}`}
                </p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                  {last?.content || "No messages yet"}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Auction: {c.auction_id ?? "N/A"} • Vehicle:{" "}
                  {c.vehicle_id ?? "N/A"}
                </p>
              </div>
            </div>
            <Icon
              name="ChevronRightIcon"
              size={18}
              className="text-muted-foreground"
            />
          </button>
        );
      })}
    </div>
  );
};

export default ChatInbox;
