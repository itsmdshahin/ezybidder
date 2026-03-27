// src/app/live-auction/components/LiveAuctionInteractive.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AuctionTimer from "./AuctionTimer";
import CurrentBidDisplay from "./CurrentBidDisplay";
import BiddingInterface from "./BiddingInterface";
import BidHistory from "./BidHistory";
import ParticipantsList from "./ParticipantsList";
import Icon from "@/components/ui/AppIcon";
import { useRouter } from "next/navigation";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  image: string;
  alt: string;
  mileage: number;
  fuelType: string;
  transmission: string;
  bodyType: string;
  location?: string | null;
}

interface BidHistoryItem {
  id: string;
  bidder: string;
  amount: number;
  timestamp: string;
  isWinning: boolean;
  isProxy: boolean;
}

interface Participant {
  id: string;
  username: string;
  bidCount: number;
  highestBid: number;
  isActive: boolean;
  joinedAt: string;
}

interface LiveAuctionInteractiveProps {
  vehicle: Vehicle;
  auctionId: string;
  startingPrice: number;
  reservePrice: number | null;
  bidIncrement: number;
  endTime: string;
}

type UserRole = "winner" | "seller" | "viewer" | "unknown";

const LiveAuctionInteractive = ({
  vehicle,
  auctionId,
  startingPrice,
  reservePrice,
  bidIncrement,
  endTime,
}: LiveAuctionInteractiveProps) => {
  const router = useRouter();

  const [isHydrated, setIsHydrated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [currentBid, setCurrentBid] = useState<number>(startingPrice);
  const [minimumIncrement, setMinimumIncrement] = useState<number>(
    bidIncrement || 50
  );
  const [reserveMet, setReserveMet] = useState<boolean>(false);
  const [totalBids, setTotalBids] = useState<number>(0);
  const [isAuctionActive, setIsAuctionActive] = useState<boolean>(true);
  const [auctionEndTime, setAuctionEndTime] = useState<string>(endTime);

  const [bidHistory, setBidHistory] = useState<BidHistoryItem[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);

  const [loadingBids, setLoadingBids] = useState<boolean>(true);
  const [sellerId, setSellerId] = useState<string | null>(null);
  const [winnerId, setWinnerId] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole>("unknown");
  const [conversationId, setConversationId] = useState<string | null>(null);

  // 🔐 new: so we don't spam finalize()
  const [finalizeCalled, setFinalizeCalled] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // current user
  useEffect(() => {
    if (!isHydrated) return;
    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data.user) {
        setCurrentUserId(data.user.id);
      }
    };
    loadUser();
  }, [isHydrated]);

  // Auction + bids + conversation
  useEffect(() => {
    if (!isHydrated || !auctionId) return;

    const loadAuctionState = async () => {
      setLoadingBids(true);
      try {
        // 1) auction meta
        const { data: auction, error: auctionErr } = await supabase
          .from("auctions")
          .select("*")
          .eq("id", auctionId)
          .single();

        let localSellerId: string | null = null;
        let localWinnerId: string | null = null;

        if (!auctionErr && auction) {
          const curr = Number(
            auction.current_bid ?? auction.starting_price ?? startingPrice
          );
          const inc = Number(auction.bid_increment ?? bidIncrement ?? 50);
          const rb =
            auction.reserve_price !== null
              ? Number(auction.reserve_price)
              : reservePrice;

          setCurrentBid(curr);
          setMinimumIncrement(inc);
          setTotalBids(Number(auction.total_bids ?? 0));
          setAuctionEndTime(auction.end_time || endTime);
          setIsAuctionActive(auction.status === "active");
          setReserveMet(rb == null ? true : curr >= rb);

          localSellerId = auction.seller_id || null;
          localWinnerId = auction.winner_id || null;

          setSellerId(localSellerId);
          setWinnerId(localWinnerId);
        }

        // 2) bids
        const { data: bids, error: bidsErr } = await supabase
          .from("bids")
          .select(
            "id, amount, bid_time, is_proxy_bid, is_winning, bidder_id, created_at"
          )
          .eq("auction_id", auctionId)
          .order("bid_time", { ascending: false });

        if (!bidsErr && bids) {
          const mappedHistory: BidHistoryItem[] = bids.map((b: any) => {
            const bidderShort = b.bidder_id
              ? b.bidder_id.slice(0, 8)
              : "Bidder";
            return {
              id: b.id,
              bidder: `Bidder_${bidderShort}`,
              amount: Number(b.amount),
              timestamp: b.bid_time || b.created_at,
              isWinning: !!b.is_winning,
              isProxy: !!b.is_proxy_bid,
            };
          });
          setBidHistory(mappedHistory);

          const participantsMap: Record<string, Participant> = {};
          bids.forEach((b: any) => {
            if (!b.bidder_id) return;
            const bidderId = b.bidder_id;
            const username = `Bidder_${bidderId.slice(0, 8)}`;
            const amountNum = Number(b.amount);

            if (!participantsMap[bidderId]) {
              participantsMap[bidderId] = {
                id: bidderId,
                username,
                bidCount: 0,
                highestBid: amountNum,
                isActive: true,
                joinedAt: b.bid_time || b.created_at,
              };
            }

            const p = participantsMap[bidderId];
            p.bidCount += 1;
            if (amountNum > p.highestBid) p.highestBid = amountNum;
          });

          setParticipants(Object.values(participantsMap));
        }

        // 3) role + conversation
        if (localSellerId && localWinnerId) {
          if (currentUserId === localWinnerId) setRole("winner");
          else if (currentUserId === localSellerId) setRole("seller");
          else setRole("viewer");

          const { data: conv, error: convErr } = await supabase
            .from("conversations")
            .select("id")
            .eq("auction_id", auctionId)
            .eq("buyer_id", localWinnerId)
            .eq("seller_id", localSellerId)
            .maybeSingle();

          if (!convErr && conv) {
            setConversationId(conv.id);
          }
        } else {
          setRole("viewer");
        }
      } catch (err) {
        console.error("[live-auction] loadAuctionState error:", err);
      } finally {
        setLoadingBids(false);
      }
    };

    loadAuctionState();
  }, [
    isHydrated,
    auctionId,
    startingPrice,
    reservePrice,
    bidIncrement,
    endTime,
    currentUserId,
  ]);

  // 🔹 Place bid via API route
  const handlePlaceBid = async (amount: number) => {
    if (!isAuctionActive) return;

    const minAllowed = currentBid + minimumIncrement;
    if (amount < minAllowed) {
      alert(`Minimum bid is £${minAllowed}`);
      return;
    }

    try {
      const {
        data: { session },
        error: sessionErr,
      } = await supabase.auth.getSession();

      if (sessionErr || !session) {
        alert("Please sign in to place a bid.");
        return;
      }

      const res = await fetch("/api/bids/place", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          auction_id: auctionId,
          amount,
        }),
      });

      let json: any = null;
      try {
        json = await res.json();
      } catch (e) {
        console.error(
          "[live-auction] place bid – non-JSON response:",
          await res.text()
        );
        alert("Unexpected response from server while placing your bid.");
        return;
      }

      if (!res.ok || !json?.ok) {
        console.error("[live-auction] place bid error:", json);
        alert(json?.error || "Failed to place bid.");
        return;
      }

      const newBid = json.bid;
      const newCurrentBid = Number(json.currentBid ?? amount);
      const newTotalBids = Number(json.totalBids ?? totalBids + 1);
      const newReserveMet =
        typeof json.reserveMet === "boolean"
          ? json.reserveMet
          : reservePrice == null
          ? true
          : newCurrentBid >= reservePrice;

      const timestamp =
        newBid.bid_time || newBid.created_at || new Date().toISOString();

      const historyItem: BidHistoryItem = {
        id: newBid.id,
        bidder:
          currentUserId && newBid.bidder_id === currentUserId
            ? "You"
            : `Bidder_${(newBid.bidder_id || "").slice(0, 8)}`,
        amount: newCurrentBid,
        timestamp,
        isWinning: true,
        isProxy: !!newBid.is_proxy_bid,
      };

      setBidHistory((prev) => [
        historyItem,
        ...prev.map((b) => ({ ...b, isWinning: false })),
      ]);
      setCurrentBid(newCurrentBid);
      setTotalBids(newTotalBids);
      setReserveMet(newReserveMet);

      const bidderId = newBid.bidder_id;

      if (bidderId) {
        setParticipants((prev) => {
          const existing = prev.find((p) => p.id === bidderId);
          if (existing) {
            return prev.map((p) =>
              p.id === bidderId
                ? {
                    ...p,
                    bidCount: p.bidCount + 1,
                    highestBid: Math.max(p.highestBid, newCurrentBid),
                    isActive: true,
                  }
                : p
            );
          }

          const username =
            currentUserId && bidderId === currentUserId
              ? "You"
              : `Bidder_${bidderId.slice(0, 8)}`;

          return [
            ...prev,
            {
              id: bidderId,
              username,
              bidCount: 1,
              highestBid: newCurrentBid,
              isActive: true,
              joinedAt: timestamp,
            },
          ];
        });
      }

      setWinnerId(bidderId);
      if (currentUserId && bidderId === currentUserId) {
        setRole("winner");
      }
    } catch (err) {
      console.error("[live-auction] handlePlaceBid error:", err);
      alert("Something went wrong while placing your bid.");
    }
  };

  const handleSetProxyBid = async (maxAmount: number) => {
    try {
      const {
        data: { user },
        error: authErr,
      } = await supabase.auth.getUser();

      if (authErr || !user) {
        alert("Please sign in to set a proxy bid.");
        return;
      }

      const { error: bidErr } = await supabase.from("bids").insert({
        auction_id: auctionId,
        bidder_id: user.id,
        amount: maxAmount,
        max_bid: maxAmount,
        is_proxy_bid: true,
        is_winning: false,
      });

      if (bidErr) {
        console.error("[live-auction] proxy bid insert error:", bidErr);
        alert("Failed to set proxy bid.");
        return;
      }

      console.log("Proxy bid saved");
    } catch (err) {
      console.error("[live-auction] handleSetProxyBid error:", err);
      alert("Something went wrong while setting your proxy bid.");
    }
  };

  const handleTimeExpired = async () => {
    // ✅ prevent multiple calls from this tab
    if (finalizeCalled) return;
    setFinalizeCalled(true);

    setIsAuctionActive(false);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        console.error("No session found while finalizing auction");
        return;
      }

      const res = await fetch(`/api/auctions/${auctionId}/finalize`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!res.ok) {
        console.error("Failed to finalize auction", await res.text());
        return;
      }

      const json = await res.json();
      console.log("Auction finalized:", json);

      if (json.winnerId) setWinnerId(json.winnerId);
      if (json.conversationId) setConversationId(json.conversationId);

      if (currentUserId && sellerId && json.winnerId) {
        if (currentUserId === json.winnerId) setRole("winner");
        else if (currentUserId === sellerId) setRole("seller");
        else setRole("viewer");
      }
    } catch (err) {
      console.error("Error calling finalize endpoint", err);
    }
  };

  const goToChat = () => {
    if (!conversationId) return;
    router.push(`/chat/${conversationId}`);
  };

  if (!isHydrated || loadingBids) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-48 bg-muted rounded-lg animate-pulse" />
          <div className="h-48 bg-muted rounded-lg animate-pulse" />
        </div>
        <div className="space-y-6">
          <div className="h-40 bg-muted rounded-lg animate-pulse" />
          <div className="h-40 bg-muted rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  const showPostAuctionBanner = !isAuctionActive;

  return (
    <div className="space-y-6">
      {showPostAuctionBanner && (
        <div className="bg-card border border-border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-start gap-3">
            <Icon
              name={
                role === "winner"
                  ? "TrophyIcon"
                  : role === "seller"
                  ? "CheckCircleIcon"
                  : "ClockIcon"
              }
              size={24}
              className={
                role === "winner"
                  ? "text-success"
                  : role === "seller"
                  ? "text-primary"
                  : "text-muted-foreground"
              }
            />
            <div>
              {role === "winner" && (
                <>
                  <h3 className="text-sm font-semibold text-card-foreground">
                    You won this auction!
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Use the chat to arrange payment and collection with the
                    seller.
                  </p>
                </>
              )}
              {role === "seller" && (
                <>
                  <h3 className="text-sm font-semibold text-card-foreground">
                    Your auction has ended
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Connect with the winning bidder to complete the sale.
                  </p>
                </>
              )}
              {role === "viewer" && (
                <>
                  <h3 className="text-sm font-semibold text-card-foreground">
                    Auction ended
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Bidding is closed for this vehicle.
                  </p>
                </>
              )}
            </div>
          </div>

          {conversationId && (role === "winner" || role === "seller") && (
            <button
              onClick={goToChat}
              className="inline-flex items-center justify-center px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Icon
                name="ChatBubbleLeftRightIcon"
                size={18}
                className="mr-2"
              />
              Open chat
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main area */}
        <div className="lg:col-span-2 space-y-6">
          <CurrentBidDisplay
            currentBid={currentBid}
            minimumIncrement={minimumIncrement}
            reserveMet={reserveMet}
            totalBids={totalBids}
          />
          <AuctionTimer
            endTime={auctionEndTime}
            onTimeExpired={handleTimeExpired}
          />
          <BidHistory bids={bidHistory} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <BiddingInterface
            currentBid={currentBid}
            minimumIncrement={minimumIncrement}
            isAuctionActive={isAuctionActive}
            onPlaceBid={handlePlaceBid}
            onSetProxyBid={handleSetProxyBid}
          />
          <ParticipantsList
            participants={participants}
            currentUserId={currentUserId ?? "current-user"}
          />
        </div>
      </div>
    </div>
  );
};

export default LiveAuctionInteractive;
