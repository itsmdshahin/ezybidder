// src/app/live-auction/from-vehicle/[vehicleId]/page.tsx
import { redirect, notFound } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

// No UI here – just find auction for this vehicle and redirect
export default async function LiveAuctionFromVehiclePage({
  params,
}: {
  params: { vehicleId: string };
}) {
  const { vehicleId } = params;

  const { data, error } = await supabase
    .from('auctions')
    .select('id, status, created_at')
    .eq('vehicle_id', vehicleId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    console.error('[live-auction/from-vehicle] no auction for vehicle', {
      vehicleId,
      error,
    });
    notFound();
  }

  // Go to the real individual auction page
  redirect(`/live-auction/${data.id}`);
}
