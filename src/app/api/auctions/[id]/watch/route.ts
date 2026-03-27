import { NextResponse } from 'next/server';
import { watchAuction, getAuction } from '@/lib/auctionsStore';
import notifySocket from '@/lib/socketNotifier';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { userId } = body as { userId?: string };
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    const updated = watchAuction(params.id, userId);
    await notifySocket('watchersUpdated', { id: params.id, watchers: updated.watchers });
    return NextResponse.json({ auction: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to watch auction' }, { status: 500 });
  }
}
