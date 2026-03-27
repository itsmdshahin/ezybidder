// src/app/chat/components/ChatConversation.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Icon from "@/components/ui/AppIcon";

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  message_type: string;
  created_at: string;
}

interface ChatConversationProps {
  conversationId: string;
}

const ChatConversation = ({ conversationId }: ChatConversationProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // 🔹 helper: fetch messages from API
  const fetchMessages = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // ❗ FIX: don't require currentUserId here
      if (!session?.access_token) {
        return;
      }

      const res = await fetch(`/api/chat/${conversationId}`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("[ChatConversation] GET /api/chat/:id error:", json);
        setLoadError(json?.error || "Failed to load conversation.");
        return;
      }

      if (Array.isArray(json)) {
        setMessages((prev) => {
          // simple check: if length or last id changed, update
          if (
            prev.length !== json.length ||
            (prev[prev.length - 1]?.id !== json[json.length - 1]?.id)
          ) {
            return json;
          }
          return prev;
        });
      }
    } catch (err) {
      console.error("[ChatConversation] fetchMessages error:", err);
    }
  };

  // 🔹 initial load + set up polling
  useEffect(() => {
    let isMounted = true;
    let intervalId: NodeJS.Timeout | null = null;

    const init = async () => {
      setLoading(true);
      setLoadError(null);

      try {
        const {
          data: { session },
          error: sessionErr,
        } = await supabase.auth.getSession();

        if (sessionErr) {
          console.error("[ChatConversation] getSession error:", sessionErr);
        }

        const user = session?.user ?? null;
        if (!user) {
          if (!isMounted) return;
          setCurrentUserId(null);
          setLoadError("Please sign in to view this conversation.");
          setMessages([]);
          return;
        }

        if (!isMounted) return;

        setCurrentUserId(user.id);

        // initial fetch
        if (session?.access_token) {
          const res = await fetch(`/api/chat/${conversationId}`, {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          });

          const json = await res.json().catch(() => null);

          if (!res.ok) {
            console.error(
              "[ChatConversation] initial GET /api/chat/:id error:",
              json
            );
            setLoadError(json?.error || "Failed to load conversation.");
            setMessages([]);
          } else {
            setMessages(Array.isArray(json) ? json : []);
          }
        }

        // 🔁 start polling every 3s for new messages
        intervalId = setInterval(fetchMessages, 3000);
      } catch (err) {
        console.error("[ChatConversation] init error:", err);
        if (!isMounted) return;
        setLoadError("Something went wrong while loading conversation.");
        setMessages([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    init();

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  // 🔹 auto scroll
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // 🔹 send message
  const handleSend = async () => {
    if (!input.trim() || !currentUserId) return;

    try {
      const { data: conv, error: convErr } = await supabase
        .from("conversations")
        .select("*")
        .eq("id", conversationId)
        .single();

      if (convErr || !conv) {
        console.error("conversation not found", convErr);
        alert("Conversation not found.");
        return;
      }

      const recipientId =
        currentUserId === conv.buyer_id ? conv.seller_id : conv.buyer_id;

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        alert("Please sign in to send messages.");
        return;
      }

      const res = await fetch(`/api/chat/${conversationId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          recipientId,
          content: input.trim(),
        }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("[ChatConversation] POST /api/chat/:id error:", json);
        alert(json?.error || "Failed to send message");
        return;
      }

      const newMsg = json as Message;

      // ✅ optimistic update
      setMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });

      setInput("");

      // force refresh immediately after sending
      fetchMessages();
    } catch (err) {
      console.error("[ChatConversation] handleSend error:", err);
      alert("Something went wrong while sending message");
    }
  };

  if (loading) {
    return (
      <div className="text-sm text-muted-foreground">
        Loading conversation...
      </div>
    );
  }

  if (!currentUserId) {
    return (
      <div className="text-sm text-muted-foreground">
        Please sign in to view messages.
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg bg-card flex flex-col h-[70vh]">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <Icon name="ChatBubbleLeftRightIcon" size={18} />
        <h2 className="text-sm font-semibold text-card-foreground">
          Conversation
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {loadError && (
          <p className="text-xs text-error text-center mb-2">{loadError}</p>
        )}

        {messages.length === 0 && !loadError && (
          <p className="text-xs text-muted-foreground text-center mt-4">
            No messages yet. Say hello!
          </p>
        )}

        {messages.map((m) => {
          const isMe = m.sender_id === currentUserId;
          const isSystem = m.message_type === "system";
          return (
            <div
              key={m.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs rounded-xl px-3 py-2 text-xs ${
                  isMe
                    ? "bg-primary text-primary-foreground"
                    : isSystem
                    ? "bg-muted text-muted-foreground"
                    : "bg-muted/70 text-card-foreground"
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{m.content}</p>
                <p className="mt-1 text-[10px] opacity-70 text-right">
                  {new Date(m.created_at).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      <div className="border-t border-border p-3 flex items-center gap-2">
        <input
          className="flex-1 text-sm px-3 py-2 rounded-md border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          placeholder="Type your message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button
          onClick={handleSend}
          className="inline-flex items-center justify-center rounded-md px-3 py-2 bg-primary text-primary-foreground text-sm hover:bg-primary/90"
        >
          <Icon
            name="PaperAirplaneIcon"
            size={16}
            className="-rotate-45 mr-1"
          />
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatConversation;
