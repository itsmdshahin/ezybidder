"use client";

import { useEffect, useState } from 'react';
import useSocket from '@/hooks/useSocket';
import AuctionFilters from './AuctionFilters';
import AuctionCard from './AuctionCard';
import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';

export default function LiveAuctions() {
  const [auctions, setAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('ending-soon');
  const [filters, setFilters] = useState<any>({});

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/auctions?status=active');
      const json = await res.json();
      setAuctions(json.auctions || []);
      setError(null);
    } catch (e) {
      console.error(e);
      setError('Failed to load auctions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  // Socket real-time updates and sync (socket events will update list live; refresh once on connect to ensure full sync)
  const { socket, connected } = useSocket();
  useEffect(() => {
    if (!socket) return;
    const handleAuctionCreated = (data: any) => setAuctions(prev => [data, ...prev]);
    const handleAuctionUpdated = (data: any) => setAuctions(prev => prev.map(a => a.id === data.id ? data : a));
    const handleAuctionDeleted = (data: any) => setAuctions(prev => prev.filter(a => a.id !== data.id));
    const handleWatchersUpdated = (data: any) => setAuctions(prev => prev.map(a => a.id === data.id ? { ...a, watchers: data.watchers } : a));

    socket.on('auctionCreated', handleAuctionCreated);
    socket.on('auctionUpdated', handleAuctionUpdated);
    socket.on('auctionDeleted', handleAuctionDeleted);
    socket.on('watchersUpdated', handleWatchersUpdated);
    const handleConnect = () => fetchAuctions();
    socket.on('connect', handleConnect);
    return () => {
      socket.off('auctionCreated', handleAuctionCreated);
      socket.off('auctionUpdated', handleAuctionUpdated);
      socket.off('auctionDeleted', handleAuctionDeleted);
      socket.off('watchersUpdated', handleWatchersUpdated);
      socket.off('connect', handleConnect);
    };
  }, [socket]);

  const transformed = auctions.map(a => ({
    id: a.id,
    vehicle: a.vehicle,
    currentBid: a.currentBid,
    reservePrice: a.reservePrice,
    reserveMet: a.reserveMet,
    totalBids: a.totalBids,
    watchers: a.watchers || 0,
    auctionEndTime: a.auctionEndTime,
    buyNowPrice: a.buyNowPrice,
    isExtended: a.isExtended || false,
  }));

  const sorted = [...transformed].sort((a, b) => {
    switch (sortBy) {
      case 'ending-soon': return new Date(a.auctionEndTime).getTime() - new Date(b.auctionEndTime).getTime();
      case 'highest-bid': return b.currentBid - a.currentBid;
      case 'most-watched': return b.watchers - a.watchers;
      default: return 0;
    }
  });

  const filtered = sorted.filter(a => {
    if (filters.reserveMet && !a.reserveMet) return false;
    if (filters.buyNow && !a.buyNowPrice) return false;
    if (filters.endingSoon) {
      const remaining = new Date(a.auctionEndTime).getTime() - Date.now();
      if (remaining > 24 * 60 * 60 * 1000) return false;
    }
    if (filters.minBid && a.currentBid < filters.minBid) return false;
    if (filters.maxBid && a.currentBid > filters.maxBid) return false;
    return true;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <aside className="lg:col-span-1">
        <AuctionFilters onChange={(f) => setFilters(f)} />
      </aside>

        <div className="lg:col-span-3 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">Live Auctions</h1>
            <p className="text-sm text-muted-foreground">Bidding happening now — updated in real-time</p>
          </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-medium text-foreground">{filtered.length} live auction{filtered.length !== 1 && 's'}</p>
            <p className="text-sm text-muted-foreground">Updated in real-time</p>
          </div>
          <div className="flex items-center gap-3">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input">
              <option value="ending-soon">Ending Soon</option>
              <option value="highest-bid">Highest Bid</option>
              <option value="most-watched">Most Watched</option>
            </select>
            <div className="flex items-center border rounded">
              <button className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : ''}`} onClick={() => setViewMode('grid')} aria-label="Grid"><Icon name="Squares2X2Icon" size={18} /></button>
              <button className={`px-3 py-2 ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : ''}`} onClick={() => setViewMode('list')} aria-label="List"><Icon name="Bars3Icon" size={18} /></button>
            </div>
          </div>
        </div>

        {loading && <div className="py-12 text-center text-muted-foreground">Loading live auctions...</div>}
        {error && <div className="bg-error/10 border border-error p-4 rounded text-error">{error}</div>}

        {filtered.length === 0 && !loading ? (
          <div className="bg-card border border-border p-12 text-center rounded">No live auctions</div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}>
            {filtered.map(au => <AuctionCard key={au.id} auction={au} viewMode={viewMode} />)}
          </div>
        )}
        </div>
  );
}
