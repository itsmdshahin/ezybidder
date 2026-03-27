// /app/vehicle-details/page.tsx
import type { Metadata } from "next";
import Header from "@/components/common/Header";
import BreadcrumbNavigation from "@/components/common/BreadcrumbNavigation";
import VehicleDetailsInteractive from "./components/VehicleDetailsInteractive";

// ⬇️ use your existing Supabase client (no SERVICE_ROLE needed)
import { supabase } from "@/lib/supabaseClient";

export const metadata: Metadata = {
  title: "Vehicle Details - EzyBidder",
  description: "Vehicle details page",
};

// ---- helper: format remaining auction time ----
function formatRemaining(end: string | null | undefined): string | undefined {
  if (!end) return undefined;
  const endDate = new Date(end);
  const now = new Date();
  const diff = endDate.getTime() - now.getTime();
  if (diff <= 0) return "Ended";

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  return `${days}d ${hours % 24}h ${minutes % 60}m`;
}

// ---- 1) Fetch everything for one vehicle from DB ----
async function fetchVehicleWithRelations(id: string) {
  try {
    // 1️⃣ core vehicle
    const { data: vehicle, error: vErr } = await supabase
      .from("vehicles")
      .select("*")
      .eq("id", id)
      .single();

    if (vErr || !vehicle) {
      console.error("vehicles fetch error:", vErr);
      return { error: vErr || new Error("Vehicle not found") };
    }

    // 2️⃣ related data in parallel
    const [
      { data: seller, error: sellerErr },
      { data: images, error: imgErr },
      { data: auction, error: auctionErr },
      { data: bids, error: bidsErr },
      { data: motHistory, error: motErr },
      { data: serviceHistory, error: serviceErr },
    ] = await Promise.all([
      // seller profile
      supabase
        .from("profiles")
        .select("*")
        .eq("id", vehicle.seller_id)
        .single(),
      // extra images
      supabase
        .from("vehicle_images")
        .select("*")
        .eq("vehicle_id", id),
      // auction row
      supabase
        .from("auctions")
        .select("*")
        .eq("vehicle_id", id)
        .single(),
      // bids for this vehicle (highest first)
      supabase
        .from("bids")
        .select("*")
        .eq("vehicle_id", id)
        .order("amount", { ascending: false }),
      // MOT history
      supabase
        .from("mot_history")
        .select("*")
        .eq("vehicle_id", id),
      // service history
      supabase
        .from("service_history")
        .select("*")
        .eq("vehicle_id", id),
    ]);

    if (sellerErr) console.warn("seller fetch error:", sellerErr);
    if (imgErr) console.warn("images fetch error:", imgErr);
    if (auctionErr) console.warn("auction fetch error:", auctionErr);
    if (bidsErr) console.warn("bids fetch error:", bidsErr);
    if (motErr) console.warn("mot_history fetch error:", motErr);
    if (serviceErr) console.warn("service_history fetch error:", serviceErr);

    return {
      vehicle,
      seller: seller ?? null,
      images: images ?? [],
      auction: auction ?? null,
      bids: bids ?? [],
      motHistory: motHistory ?? [],
      serviceHistory: serviceHistory ?? [],
    };
  } catch (err) {
    console.error("fetchVehicleWithRelations exception:", err);
    return { error: err };
  }
}

// ---- 2) Map DB result → VehicleDetailsInteractive props ----
function mapVehicleToClient(raw: {
  vehicle: any;
  seller: any;
  images: any[];
  auction: any | null;
  bids: any[];
  motHistory: any[];
  serviceHistory: any[];
}) {
  const { vehicle, seller, images, auction, bids, motHistory, serviceHistory } =
    raw;

  // images: combine vehicles.images[] JSON + vehicle_images table
  const jsonImages: string[] = Array.isArray(vehicle.images) ? vehicle.images : [];
  const tableImages: any[] = Array.isArray(images) ? images : [];

  const combinedImages = [
    ...jsonImages.map((url, index) => ({
      id: `json-${index}`,
      url,
      thumbnail: url,
      alt: `${vehicle.make} ${vehicle.model}`,
    })),
    ...tableImages.map((img) => ({
      id: String(img.id),
      url: img.url,
      thumbnail: img.thumbnail ?? img.url,
      alt: img.alt ?? `${vehicle.make} ${vehicle.model}`,
    })),
  ];

  // listing type / auction logic
  const listingType = (vehicle.listing_type || "").toLowerCase();
  const isAuction = listingType === "auction" || listingType === "both";

  // highest bid from bids table, fallback to vehicle.price
  const highestBid = bids && bids.length > 0 ? bids[0].amount : null;

  // seller type
  let sellerType: "Private" | "Dealer" | "Showroom" = "Private";
  if (seller?.user_type === "dealer") sellerType = "Dealer";
  if (seller?.user_type === "showroom") sellerType = "Showroom";

  return {
    // VehicleData shape (matches your VehicleDetailsInteractive file)
    id: String(vehicle.id),
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    price: vehicle.price,
    mileage: vehicle.mileage,
    fuelType: vehicle.fuel_type ?? "—",
    transmission: vehicle.transmission ?? "—",
    bodyType: vehicle.body_type ?? "—",
    color: vehicle.color ?? "—",
    doors: vehicle.doors ?? 0,
    engine: vehicle.engine_size ?? vehicle.engine ?? "—",
    isAuction,
    currentBid: isAuction ? (highestBid ?? vehicle.price) : undefined,
    timeRemaining: isAuction
      ? formatRemaining(auction?.end_time ?? null)
      : undefined,
    description: vehicle.description ?? "",

    images: combinedImages,

    specifications: [
      { label: "Fuel Type", value: vehicle.fuel_type ?? "—" },
      { label: "Transmission", value: vehicle.transmission ?? "—" },
      { label: "Body Type", value: vehicle.body_type ?? "—" },
      { label: "Engine Size", value: vehicle.engine_size ?? "—" },
      { label: "Doors", value: String(vehicle.doors ?? "—") },
      { label: "Seats", value: String(vehicle.seats ?? "—") },
      { label: "Color", value: vehicle.color ?? "—" },
      { label: "CO2", value: vehicle.co2 ?? "—" },
      { label: "ULEZ Compliant", value: vehicle.ulez_compliant ? "Yes" : "No" },
      { label: "Location", value: vehicle.location ?? "—" },
      { label: "VRM", value: vehicle.vrm ?? "—" },
    ],

    motHistory: (motHistory || []).map((row: any) => ({
      id: row.id,
      date: row.date,
      result: row.result,
      mileage: row.mileage,
      expiryDate: row.expiry_date ?? row.expiryDate ?? "",
      advisories: row.advisories ?? [],
    })),

    serviceHistory: (serviceHistory || []).map((row: any) => ({
      id: row.id,
      date: row.date,
      type: row.type,
      garage: row.garage,
      mileage: row.mileage,
      cost: row.cost,
    })),

    // 🔥 seller name / username / rating / etc, all from DB
    seller: {
      id: seller?.id ?? "",
      name:
        seller?.full_name ??
        seller?.username ??
        seller?.name ??
        "Unknown Seller",
      type: sellerType,
      rating: seller?.rating ?? vehicle.seller_rating ?? 0,
      reviewCount: seller?.review_count ?? 0,
      location: seller?.location ?? vehicle.location ?? "Unknown",
      verified: seller?.verified ?? !!vehicle.dvla_verified,
      memberSince: seller?.created_at
        ? new Date(seller.created_at).toLocaleDateString("en-GB", {
            month: "long",
            year: "numeric",
          })
        : "",
      responseTime: seller?.response_time ?? "1 hour",
      avatar: seller?.avatar_url ?? "/default-avatar.png",
      avatarAlt: seller?.full_name ?? "Seller avatar",
    },

    priceAnalysis: {
      marketAverage: vehicle.market_average ?? vehicle.price ?? 0,
      priceScore: vehicle.price_score ?? 70,
      priceHistory: vehicle.price_history ?? [],
      similarVehicles: vehicle.similar_vehicles ?? [],
    },
  };
}

// ---- 3) Page component ------------------------------------------------------
export default async function VehicleDetailsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const idParam = searchParams?.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        No vehicle id provided
      </div>
    );
  }

  const res = await fetchVehicleWithRelations(id);
  if ("error" in res && res.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Error fetching vehicle details
      </div>
    );
  }

  const clientVehicle = mapVehicleToClient(res as any);

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Marketplace", path: "/vehicle-marketplace" },
    {
      label: `${clientVehicle.make} ${clientVehicle.model}`,
      path: `/vehicle-details?id=${id}`,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <BreadcrumbNavigation
            customItems={breadcrumbItems}
            className="mb-6"
          />
          <VehicleDetailsInteractive vehicleData={clientVehicle} />
        </div>
      </main>
    </div>
  );
}
