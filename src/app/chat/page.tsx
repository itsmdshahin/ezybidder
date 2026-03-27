// src/app/chat/page.tsx
import type { Metadata } from "next";
import Header from "@/components/common/Header";
import BreadcrumbNavigation from "@/components/common/BreadcrumbNavigation";
import ChatInbox from "./components/ChatInbox";

export const metadata: Metadata = {
  title: "Messages - EzyBidder",
  description: "View and manage your auction conversations.",
};

export default function ChatPage() {
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Messages</h1>
                <p className="text-sm text-muted-foreground">
                  Chat between buyers and sellers after an auction has a winner.
                </p>
              </div>
            </div>
          </div>
        </div>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ChatInbox />
        </section>
      </main>
    </div>
  );
}
