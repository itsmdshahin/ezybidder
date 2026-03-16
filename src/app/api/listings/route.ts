// src/app/api/listings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase env vars (URL / ANON KEY)');
}

function createSupabaseForRequest(req: NextRequest) {
  const authHeader =
    req.headers.get('authorization') || req.headers.get('Authorization');

  const headers: Record<string, string> = {};
  if (authHeader) headers['Authorization'] = authHeader;

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers },
  });
}

// ============================================================================
// GET /api/listings  → current user-এর সব listing (auction + fixed price)
// ============================================================================
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number.parseInt(searchParams.get('page') || '1', 10);
    const limit = Number.parseInt(searchParams.get('limit') || '8', 10);
    const offset = (page - 1) * limit;

    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const listingType = searchParams.get('listingType') || '';

    const supabase = createSupabaseForRequest(req);

    // current user বের করি
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    // vehicles root + auctions left join
    let query = supabase
      .from('vehicles')
      .select(
        `
        id,
        seller_id,
        title,
        vrm,
        make,
        model,
        year,
        mileage,
        price,
        reserve_price,
        fuel_type,
        body_type,
        transmission,
        engine_size,
        color,
        status,
        listing_type,
        images,
        description,
        location,
        created_at,
        updated_at,
        auctions (
          id,
          starting_price,
          reserve_price,
          current_bid,
          bid_increment,
          start_time,
          end_time,
          status,
          total_bids,
          watchers
        )
      `,
        { count: 'exact' }
      )
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (listingType) {
      query = query.eq('listing_type', listingType);
    }

    if (search) {
      query = query.or(
        `make.ilike.%${search}%,model.ilike.%${search}%,vrm.ilike.%${search}%`
      );
    }

    const { data, error, count } = await query.range(
      offset,
      offset + limit - 1
    );

    if (error) {
      console.error('[listings][GET] error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch listings' },
        { status: 500 }
      );
    }

    const total = count || 0;

    // 🔥 এখানে আমরা vehicles + auctions থেকে তোমার পুরনো AuctionRow শেপে map করছি
    const listings = (data || []).map((v: any) => {
      const a =
        Array.isArray(v.auctions) && v.auctions.length ? v.auctions[0] : null;

      return {
        // auction থাকলে auction id, না থাকলে null
        id: a?.id ?? null,
        vehicle_id: v.id,
        seller_id: v.seller_id,
        starting_price: a?.starting_price ?? v.price ?? 0,
        reserve_price: a?.reserve_price ?? v.reserve_price ?? null,
        current_bid: a?.current_bid ?? v.price ?? 0,
        bid_increment: a?.bid_increment ?? 50,
        start_time: a?.start_time ?? null,
        end_time: a?.end_time ?? null,
        status: a?.status ?? v.status ?? 'draft',
        total_bids: a?.total_bids ?? 0,
        watchers: a?.watchers ?? 0,
        created_at: v.created_at,
        updated_at: v.updated_at,
        // তোমার ListingCard / ListingFormModal এর জন্য vehicles শেপে গাড়িটা।
        vehicles: {
          id: v.id,
          title: v.title,
          vrm: v.vrm,
          make: v.make,
          model: v.model,
          year: v.year,
          mileage: v.mileage,
          price: v.price,
          reserve_price: v.reserve_price,
          fuel_type: v.fuel_type,
          body_type: v.body_type,
          transmission: v.transmission,
          engine_size: v.engine_size,
          color: v.color,
          status: v.status,
          listing_type: v.listing_type,
          images: v.images,
          description: v.description,
          location: v.location,
        },
      };
    });

    return NextResponse.json({
      listings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err: any) {
    console.error('[listings][GET] exception:', err);
    return NextResponse.json(
      { error: err.message ?? 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST /api/listings  → পুরোনো কোড (vehicle insert)। চাইলে after, /api/vehicles ব্যবহার করতে পারো
// ============================================================================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = createSupabaseForRequest(req);

    // owner id: support owner_id, seller_id, or ownerId
    const seller_id = body.owner_id ?? body.seller_id ?? body.ownerId ?? null;

    // ensure images is an array (strings)
    const images = Array.isArray(body.images)
      ? body.images
      : body.images
      ? [body.images]
      : [];

    const payload: any = {
      seller_id,
      title: body.title ?? null,
      make: body.make ?? null,
      model: body.model ?? null,
      year: body.year ? Number(body.year) : null,
      mileage: body.mileage ? Number(body.mileage) : null,
      price: body.price ? Number(body.price) : null,
      reserve_price: body.reserve_price ? Number(body.reserve_price) : null,
      fuel_type: body.fuel_type ?? body.fuelType ?? null,
      body_type: body.body_type ?? body.bodyType ?? null,
      transmission: body.transmission ?? null,
      engine_size: body.engine_size ?? body.engineSize ?? null,
      color: body.color ?? null,
      doors: body.doors ? Number(body.doors) : null,
      vrm: body.vrm ?? null,
      stock_no: body.stock_no ?? body.stockNo ?? null,
      description: body.description ?? null,
      images: images, // json/jsonb column
      mot_status: body.mot_status ?? body.motStatus ?? null,
      mot_expiry_date: body.mot_expiry_date ?? body.motExpiryDate ?? null,
      seller_type: body.seller_type ?? body.sellerType ?? null,
      seller_rating: body.seller_rating
        ? Number(body.seller_rating)
        : body.sellerRating
        ? Number(body.sellerRating)
        : null,
      dvla_verified: body.dvla_verified ?? body.dvlaVerified ?? false,
      location: body.location ?? null,
      listing_type: body.listing_type ?? body.listingType ?? 'fixed-price',
      auction_end_time: body.auction_end_time ?? body.auctionEndTime ?? null,
      features: Array.isArray(body.features) ? body.features : [],
      ulez_compliant: body.ulez_compliant ?? false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('vehicles')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('Insert error', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err: any) {
    console.error('API error', err);
    return NextResponse.json(
      { error: err.message ?? 'Unknown error' },
      { status: 500 }
    );
  }
}
