// src/app/chat/[conversationId]/page.tsx
"use client";

import { useParams } from "next/navigation";
import Header from "@/components/common/Header";
import BreadcrumbNavigation from "@/components/common/BreadcrumbNavigation";
import ChatConversation from "../components/ChatConversation";

export default function ConversationPage() {
  const params = useParams<{ conversationId: string }>();
  const conversationId = params.conversationId;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16">
        <div className="bg-muted/30 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <BreadcrumbNavigation />
          </div>
        </div>

        <div className="bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-xl font-semibold text-foreground">
              Conversation
            </h1>
          </div>
        </div>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ChatConversation conversationId={conversationId} />
        </section>
      </main>
    </div>
  );
}
