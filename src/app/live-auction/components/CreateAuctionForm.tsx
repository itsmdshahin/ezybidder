"use client";

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

const CreateAuctionForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<any>({
    vrm: '', make: '', model: '', year: '', mileage: '', fuelType: '', transmission: '', bodyType: '', color: '', description: '',
    startingBid: '', reservePrice: '', buyNowPrice: '', bidIncrement: '', duration: '', startTime: '',
    hasServiceHistory: false, hasWarranty: false, isUlezCompliant: false, hasV5C: false,
    agreeTerms: false, agreeInspection: false,
  });

  const handleChange = (field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Build auction payload
      const user = (typeof window !== 'undefined' && sessionStorage.getItem('user')) ? JSON.parse(sessionStorage.getItem('user') as string) : null;
      const payload = {
        id: `auction-${Date.now()}`,
        vehicle: { id: `vehicle-${Date.now()}`, make: formData.make, model: formData.model, year: Number(formData.year), images: [], mileage: Number(formData.mileage), location: 'UK' },
        currentBid: Number(formData.startingBid) || 0,
        minimumIncrement: Number(formData.bidIncrement) || 250,
        reservePrice: formData.reservePrice ? Number(formData.reservePrice) : null,
        buyNowPrice: formData.buyNowPrice ? Number(formData.buyNowPrice) : null,
        auctionEndTime: new Date(Date.now() + (Number(formData.duration) || 3) * 24 * 60 * 60 * 1000).toISOString(),
        totalBids: 0,
        isAuctionActive: true,
        seller: user ? { id: user.id, name: user.name } : undefined,
      };
      const res = await fetch('/api/auctions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Create auction failed');
      window.location.href = '/live-auction';
    } catch (err) {
      console.error(err);
      alert('Failed to create auction.');
    } finally { setIsSubmitting(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Vehicle Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs">Make</label>
            <input className="input mt-1" value={formData.make} onChange={e => handleChange('make', e.target.value)} />
          </div>
          <div>
            <label className="text-xs">Model</label>
            <input className="input mt-1" value={formData.model} onChange={e => handleChange('model', e.target.value)} />
          </div>
          <div>
            <label className="text-xs">Year</label>
            <input type="number" className="input mt-1" value={formData.year} onChange={e => handleChange('year', e.target.value)} />
          </div>
          <div>
            <label className="text-xs">Mileage</label>
            <input type="number" className="input mt-1" value={formData.mileage} onChange={e => handleChange('mileage', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Auction Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs">Starting Bid</label>
            <input type="number" className="input mt-1" value={formData.startingBid} onChange={e => handleChange('startingBid', e.target.value)} />
          </div>
          <div>
            <label className="text-xs">Reserve Price</label>
            <input type="number" className="input mt-1" value={formData.reservePrice} onChange={e => handleChange('reservePrice', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-6 border-t">
        <button type="button" className="flex-1 border rounded px-4 py-2" onClick={() => window.location.href = '/live-auction'}>Save as Draft</button>
        <button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 text-white rounded px-4 py-2">{isSubmitting ? 'Creating...' : 'Create Auction'}</button>
      </div>
    </form>
  );
};

export default CreateAuctionForm;
