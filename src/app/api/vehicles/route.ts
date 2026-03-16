// src/app/api/vehicles/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase env vars (URL / ANON KEY)");
}

function createSupabaseForRequest(req: NextRequest) {
  const authHeader =
    req.headers.get("authorization") || req.headers.get("Authorization");

  const headers: Record<string, string> = {};
  if (authHeader) headers["Authorization"] = authHeader;

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers },
  });
}

// === GET /api/vehicles =======================================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1", 10);
    const limit = Number.parseInt(searchParams.get("limit") || "12", 10);
    const offset = (page - 1) * limit;

    const make = searchParams.get("make");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const minMileage = searchParams.get("minMileage");
    const maxMileage = searchParams.get("maxMileage");
    const fuelType = searchParams.get("fuelType");
    const bodyType = searchParams.get("bodyType");
    const minYear = searchParams.get("minYear");
    const maxYear = searchParams.get("maxYear");
    const listingType = searchParams.get("listingType");
    const search = searchParams.get("search");

    const supabase = createSupabaseForRequest(request);

    let query = supabase
      .from("vehicles")
      .select(
        `
        *,
        profiles:seller_id (
          id,
          full_name,
          email
        ),
        auctions (
          id,
          current_bid,
          start_time,
          end_time,
          status,
          total_bids,
          watchers
        )
      `,
        { count: "exact" }
      )
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (make) query = query.ilike("make", `%${make}%`);
    if (minPrice) query = query.gte("price", minPrice);
    if (maxPrice) query = query.lte("price", maxPrice);
    if (minMileage) query = query.gte("mileage", minMileage);
    if (maxMileage) query = query.lte("mileage", maxMileage);
    if (fuelType) query = query.eq("fuel_type", fuelType);
    if (bodyType) query = query.eq("body_type", bodyType);
    if (minYear) query = query.gte("year", minYear);
    if (maxYear) query = query.lte("year", maxYear);
    if (listingType) query = query.eq("listing_type", listingType);
    if (search) {
      query = query.or(
        `make.ilike.%${search}%,model.ilike.%${search}%,vrm.ilike.%${search}%`
      );
    }

    const { data: vehicles, error, count } = await query.range(
      offset,
      offset + limit - 1
    );

    if (error) {
      console.error("Error fetching vehicles:", error);
      return NextResponse.json(
        { error: "Failed to fetch vehicles" },
        { status: 500 }
      );
    }

    const total = count || 0;

    return NextResponse.json({
      vehicles: vehicles || [],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("GET /api/vehicles error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// === POST /api/vehicles ======================================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      title,
      vrm,
      make,
      model,
      year,
      mileage,
      fuel_type,
      body_type,
      transmission,
      engine_size,
      engine_power,
      drivetrain,
      co2,
      color,
      doors,
      seats,
      price,
      reserve_price,
      listing_type,
      description,
      features,
      images,
      location,
      ulez_compliant,
      mot_status,
      mot_expiry_date,
      mot_notes,
      service_history_text,
      seller_type,
      seller_rating,
      contact_phone,
      contact_email,
      dvla_verified,
      auction_end_time,
    } = body;

    // basic required validation
    if (!vrm || !make || !model || !year || !price || !listing_type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = createSupabaseForRequest(request);

    // get logged in user (uses Authorization header we attached on client)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("Auth error:", authError);
      return NextResponse.json(
        { error: "Unauthorized - Please log in" },
        { status: 401 }
      );
    }

    // validation for enums
    const validFuelTypes = ["petrol", "diesel", "electric", "hybrid"];
    if (fuel_type && !validFuelTypes.includes(String(fuel_type))) {
      return NextResponse.json(
        {
          error: `Invalid fuel type. Must be one of: ${validFuelTypes.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    const validTransmissions = ["manual", "automatic"];
    if (transmission && !validTransmissions.includes(String(transmission))) {
      return NextResponse.json(
        {
          error: `Invalid transmission. Must be one of: ${validTransmissions.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    // normalise listing_type ("fixed-price" from UI => "fixed_price" in DB)
    const listingTypeNormalized =
      String(listing_type) === "fixed-price"
        ? "fixed_price"
        : String(listing_type);

    const validListingTypes = ["auction", "fixed_price", "both"];
    if (!validListingTypes.includes(listingTypeNormalized)) {
      return NextResponse.json(
        {
          error: `Invalid listing type. Must be one of: ${validListingTypes.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    console.log("[vehicles] Creating vehicle:", {
      vrm: String(vrm).toUpperCase(),
      make,
      model,
      seller_id: user.id,
      listing_type: listingTypeNormalized,
    });

    const nowIso = new Date().toISOString();

    const { data: vehicle, error: insertError } = await supabase
      .from("vehicles")
      .insert({
        seller_id: user.id,
        title: title ?? null,
        vrm: String(vrm).toUpperCase(),
        make,
        model,
        year: Number.parseInt(String(year), 10),
        mileage: mileage ? Number.parseInt(String(mileage), 10) : null,
        fuel_type: fuel_type ?? null,
        body_type: body_type ?? null,
        transmission: transmission ?? null,
        engine_size: engine_size
          ? Number.parseFloat(String(engine_size))
          : null,
        engine_power: engine_power ?? null,
        drivetrain: drivetrain ?? null,
        co2: co2 ?? null,
        color: color ?? null,
        doors: doors ? Number.parseInt(String(doors), 10) : null,
        seats: seats ? Number.parseInt(String(seats), 10) : null,
        price: Number.parseFloat(String(price)),
        reserve_price: reserve_price
          ? Number.parseFloat(String(reserve_price))
          : null,
        listing_type: listingTypeNormalized,
        description: description ?? null,
        features: Array.isArray(features) ? features : [],
        images: Array.isArray(images) ? images : [],
        location: location ?? null,
        ulez_compliant: !!(ulez_compliant ?? false),
        mot_status: mot_status ?? null,
        mot_expiry_date: mot_expiry_date ?? null,
        mot_notes: mot_notes ?? null,
        service_history_text: service_history_text ?? null,
        seller_type: seller_type ?? null,
        seller_rating: seller_rating ? Number(seller_rating) : null,
        contact_phone: contact_phone ?? null,
        contact_email: contact_email ?? null,
        dvla_verified: !!dvla_verified,
        status: "active",
        created_at: nowIso,
        updated_at: nowIso,
      })
      .select()
      .single();

        if (insertError) {
      console.error("[vehicles] Insert error:", insertError);
      const msg = (insertError.message || "").toLowerCase();

      if (msg.includes("fuel_type") || msg.includes("fuel_type_check")) {
        return NextResponse.json(
          {
            error: `Invalid fuel type. Must be one of: ${validFuelTypes.join(
              ", "
            )}`,
          },
          { status: 400 }
        );
      }

      if (msg.includes("transmission")) {
        return NextResponse.json(
          { error: "Invalid transmission. Must be manual or automatic" },
          { status: 400 }
        );
      }

      // 👇 CHANGE THIS PART
      return NextResponse.json(
        { error: insertError.message || "Failed to create vehicle listing" },
        { status: 500 }
      );
    }


    // create auction row (non-fatal if it fails)
    if (listingTypeNormalized === "auction" || listingTypeNormalized === "both") {
      try {
        const startTime = new Date();
        const endTime = auction_end_time
          ? new Date(auction_end_time)
          : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // +7 days

        const { error: auctionError } = await supabase.from("auctions").insert({
          vehicle_id: vehicle.id,
          seller_id: user.id,
          starting_price: Number.parseFloat(String(price)),
          reserve_price: reserve_price
            ? Number.parseFloat(String(reserve_price))
            : null,
          current_bid: Number.parseFloat(String(price)),
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          status: "active",
          total_bids: 0,
          watchers: 0,
        });

        if (auctionError) {
          console.error("[vehicles] Auction create non-fatal error:", auctionError);
        }
      } catch (auctionErr) {
        console.error("[vehicles] Auction create exception:", auctionErr);
      }
    }

    return NextResponse.json({ vehicle }, { status: 201 });
  } catch (err) {
    console.error("[vehicles] API error:", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
