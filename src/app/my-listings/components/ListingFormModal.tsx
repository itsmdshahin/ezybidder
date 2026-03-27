'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Props = {
  initialData?: any | null;
  onClose: () => void;
  onSave: (values: any) => Promise<any>;
};

export default function ListingFormModal({ initialData = null, onClose, onSave }: Props) {
  const [vehicle, setVehicle] = useState<any>(
    initialData?.vehicles ?? {
      make: '',
      model: '',
      year: '',
      mileage: '',
      price: '',
      vrm: '',
      description: '',
      images: [],
    }
  );

  const [startingPrice, setStartingPrice] = useState(initialData?.starting_price ?? 0);
  const [reservePrice, setReservePrice] = useState(initialData?.reserve_price ?? 0);
  const [bidIncrement, setBidIncrement] = useState(initialData?.bid_increment ?? 50);
  const [startTime, setStartTime] = useState(initialData?.start_time ?? '');
  const [endTime, setEndTime] = useState(initialData?.end_time ?? '');
  const [status, setStatus] = useState(initialData?.status ?? 'draft');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setVehicle(initialData.vehicles ?? vehicle);
    }
    // eslint-disable-next-line
  }, [initialData]);

  const uploadImage = async (file: File) => {
    // store in bucket 'vehicles' under user folder / vehicle-uuid if you want
    const fileExt = file.name.split('.').pop();
    const filePath = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;
    const { error: upErr } = await supabase.storage.from('vehicles').upload(filePath, file, { upsert: true });
    if (upErr) throw upErr;
    const { data } = supabase.storage.from('vehicles').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      setLoading(true);
      const url = await uploadImage(f);
      setVehicle((v: any) => ({ ...v, images: [...(v.images || []), url] }));
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Basic validation
      if (!vehicle.make || !vehicle.model) {
        setError('Make and model are required.');
        setLoading(false);
        return;
      }

      // Build the upsert payload. If editing, pass id.
      const payload: any = {
        id: initialData?.id,
        starting_price: Number(startingPrice),
        reserve_price: Number(reservePrice),
        bid_increment: Number(bidIncrement),
        start_time: startTime || new Date().toISOString(),
        end_time: endTime || null,
        status,
        vehicle: {
          ...vehicle,
          year: vehicle.year ? Number(vehicle.year) : null,
          mileage: vehicle.mileage ? Number(vehicle.mileage) : null,
        },
      };

      const result = await onSave(payload);
      if (result?.error) {
        setError(result.error.message || String(result.error));
      } else {
        onClose();
      }
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/60 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-card rounded-lg border border-border p-6 overflow-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{initialData ? 'Edit listing' : 'Add listing'}</h3>
          <button onClick={onClose} className="text-sm px-2 py-1">Close</button>
        </div>

        {error && <div className="text-error mb-3">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="Make"
              value={vehicle.make}
              onChange={(e) => setVehicle({ ...vehicle, make: e.target.value })}
              className="p-2 border border-border rounded-md"
            />
            <input
              placeholder="Model"
              value={vehicle.model}
              onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })}
              className="p-2 border border-border rounded-md"
            />
            <input
              placeholder="Year"
              value={vehicle.year}
              onChange={(e) => setVehicle({ ...vehicle, year: e.target.value })}
              className="p-2 border border-border rounded-md"
            />
            <input
              placeholder="Mileage"
              value={vehicle.mileage}
              onChange={(e) => setVehicle({ ...vehicle, mileage: e.target.value })}
              className="p-2 border border-border rounded-md"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="VRM"
              value={vehicle.vrm}
              onChange={(e) => setVehicle({ ...vehicle, vrm: e.target.value })}
              className="p-2 border border-border rounded-md"
            />
            <input
              placeholder="Listing price"
              value={vehicle.price}
              onChange={(e) => setVehicle({ ...vehicle, price: e.target.value })}
              className="p-2 border border-border rounded-md"
            />
          </div>

          <div>
            <textarea
              placeholder="Description"
              value={vehicle.description}
              onChange={(e) => setVehicle({ ...vehicle, description: e.target.value })}
              className="w-full p-2 border border-border rounded-md min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Starting price"
              value={startingPrice}
              onChange={(e) => setStartingPrice(Number(e.target.value))}
              className="p-2 border border-border rounded-md"
            />
            <input
              type="number"
              placeholder="Reserve price"
              value={reservePrice}
              onChange={(e) => setReservePrice(Number(e.target.value))}
              className="p-2 border border-border rounded-md"
            />
            <input
              type="number"
              placeholder="Bid increment"
              value={bidIncrement}
              onChange={(e) => setBidIncrement(Number(e.target.value))}
              className="p-2 border border-border rounded-md"
            />
            <input type="datetime-local" value={startTime ? new Date(startTime).toISOString().slice(0,16) : ''} onChange={(e) => setStartTime(new Date(e.target.value).toISOString())} className="p-2 border border-border rounded-md"/>
            <input type="datetime-local" value={endTime ? new Date(endTime).toISOString().slice(0,16) : ''} onChange={(e) => setEndTime(new Date(e.target.value).toISOString())} className="p-2 border border-border rounded-md"/>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="p-2 border border-border rounded-md">
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="ended">Ended</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Images</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <div className="mt-2 flex space-x-2 overflow-x-auto">
              {(vehicle.images || []).map((img: string, idx: number) => (
                <div key={idx} className="w-20 h-14 rounded overflow-hidden border">
                  <img src={img} alt={`img-${idx}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-muted rounded-md">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
              {initialData ? 'Save changes' : 'Create listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
