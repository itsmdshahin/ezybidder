// src/app/my-listings/components/ListingForm.tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  onSave: (values: any) => Promise<void> | void;
  onCancel?: () => void;
  initialValues?: any;
}

const ListingForm = ({ onSave, onCancel, initialValues = {} }: Props) => {
  const [values, setValues] = useState({
    title: initialValues.title ?? '',
    description: initialValues.description ?? '',
    make: initialValues.make ?? '',
    model: initialValues.model ?? '',
    year: initialValues.year ?? '',
    mileage: initialValues.mileage ?? '',
    price: initialValues.price ?? '',
    fuelType: initialValues.fuelType ?? '',
    bodyType: initialValues.bodyType ?? '',
    transmission: initialValues.transmission ?? '',
    engineSize: initialValues.engineSize ?? '',
    color: initialValues.color ?? '',
    doors: initialValues.doors ?? '',
    vrm: initialValues.vrm ?? '',
    stockNo: initialValues.stockNo ?? '',
    imagesInput: initialValues.images ? (Array.isArray(initialValues.images) ? initialValues.images.join(', ') : initialValues.images) : '',
    motStatus: initialValues.motStatus ?? 'valid',
    motExpiryDate: initialValues.motExpiryDate ?? '',
    sellerType: initialValues.sellerType ?? 'dealer',
    sellerRating: initialValues.sellerRating ?? 0,
    dvlaVerified: !!initialValues.dvlaVerified,
    location: initialValues.location ?? '',
    listingType: initialValues.listingType ?? 'fixed-price',
    auctionEndTime: initialValues.auctionEndTime ?? ''
  });

  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (key: string, v: any) => setValues((p) => ({ ...p, [key]: v }));

  const handleFiles = (fList: FileList | null) => {
    if (!fList) return;
    setFiles((prev) => [...prev, ...Array.from(fList)]);
  };

  const removeFile = (index: number) => setFiles((prev) => prev.filter((_, i) => i !== index));

  // Upload files to Supabase Storage folder vehicles/{uuid}-{filename}
  const uploadFilesToStorage = async (): Promise<string[]> => {
    if (files.length === 0) return [];

    setUploading(true);
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const ext = file.name.split('.').pop();
      const id = uuidv4();
      const filePath = `vehicles/${id}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('vehicles')  // BUCKET NAME: create 'vehicles' in Supabase Storage
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        console.error('Upload error', uploadError);
        // continue—I choose to not abort all uploads on single failure
        continue;
      }

      const { data } = supabase.storage.from('vehicles').getPublicUrl(filePath);
      if (data?.publicUrl) uploadedUrls.push(data.publicUrl);
    }

    setUploading(false);
    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // 1) upload files (if any)
      const uploaded = await uploadFilesToStorage();

      // 2) combine image sources: uploaded + imagesInput (comma-separated)
      const fromInput = values.imagesInput
        ? values.imagesInput.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [];

      const images = [...uploaded, ...fromInput];

      // 3) Build payload for server
      const payload = {
        ...values,
        images,
        imagesInput: undefined // we already transformed it
      };

      await onSave(payload);
    } catch (err) {
      console.error(err);
      alert('Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg border border-border">
      <h2 className="text-lg font-semibold">Add a vehicle listing</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input value={values.title} onChange={(e) => handleChange('title', e.target.value)} className="w-full p-2 border rounded" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Price (GBP)</label>
          <input type="number" value={values.price} onChange={(e) => handleChange('price', e.target.value)} className="w-full p-2 border rounded" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Make</label>
          <input value={values.make} onChange={(e) => handleChange('make', e.target.value)} className="w-full p-2 border rounded" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Model</label>
          <input value={values.model} onChange={(e) => handleChange('model', e.target.value)} className="w-full p-2 border rounded" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Year</label>
          <input type="number" value={values.year} onChange={(e) => handleChange('year', e.target.value)} className="w-full p-2 border rounded" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mileage</label>
          <input type="number" value={values.mileage} onChange={(e) => handleChange('mileage', e.target.value)} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Fuel Type</label>
          <input value={values.fuelType} onChange={(e) => handleChange('fuelType', e.target.value)} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Body Type</label>
          <input value={values.bodyType} onChange={(e) => handleChange('bodyType', e.target.value)} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Transmission</label>
          <input value={values.transmission} onChange={(e) => handleChange('transmission', e.target.value)} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Engine Size</label>
          <input value={values.engineSize} onChange={(e) => handleChange('engineSize', e.target.value)} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Color</label>
          <input value={values.color} onChange={(e) => handleChange('color', e.target.value)} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Doors</label>
          <input type="number" value={values.doors} onChange={(e) => handleChange('doors', e.target.value)} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">VRM (registration)</label>
          <input value={values.vrm} onChange={(e) => handleChange('vrm', e.target.value)} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Stock No</label>
          <input value={values.stockNo} onChange={(e) => handleChange('stockNo', e.target.value)} className="w-full p-2 border rounded" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Location (City or postcode)</label>
        <input value={values.location} onChange={(e) => handleChange('location', e.target.value)} className="w-full p-2 border rounded" required />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea value={values.description} onChange={(e) => handleChange('description', e.target.value)} className="w-full p-2 border rounded h-28" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Image URLs (comma separated)</label>
          <input value={values.imagesInput} onChange={(e) => handleChange('imagesInput', e.target.value)} className="w-full p-2 border rounded" placeholder="https://... , https://..." />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Or upload images (files)</label>
          <input type="file" accept="image/*" multiple onChange={(e) => handleFiles(e.target.files)} className="w-full" />
          {files.length > 0 && (
            <div className="mt-2 space-y-1">
              {files.map((f, idx) => (
                <div key={idx} className="flex items-center justify-between bg-muted p-2 rounded">
                  <span className="truncate">{f.name}</span>
                  <button type="button" onClick={() => removeFile(idx)} className="text-sm text-error">Remove</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">MOT status</label>
          <select value={values.motStatus} onChange={(e) => handleChange('motStatus', e.target.value)} className="w-full p-2 border rounded">
            <option value="valid">Valid</option>
            <option value="due-soon">Due soon</option>
            <option value="expired">Expired</option>
          </select>

          <div className="mt-2">
            <label className="block text-sm font-medium mb-1">MOT expiry</label>
            <input type="date" value={values.motExpiryDate} onChange={(e) => handleChange('motExpiryDate', e.target.value)} className="w-full p-2 border rounded" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Seller Type</label>
          <select value={values.sellerType} onChange={(e) => handleChange('sellerType', e.target.value)} className="w-full p-2 border rounded">
            <option value="dealer">Dealer</option>
            <option value="showroom">Showroom</option>
            <option value="private">Private</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Seller rating</label>
          <input type="number" min="0" max="5" step="0.1" value={values.sellerRating} onChange={(e) => handleChange('sellerRating', e.target.value)} className="w-full p-2 border rounded" />
        </div>

        <div className="flex items-end">
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={values.dvlaVerified} onChange={(e) => handleChange('dvlaVerified', e.target.checked)} />
            <span className="text-sm">DVLA verified</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Listing type</label>
          <select value={values.listingType} onChange={(e) => handleChange('listingType', e.target.value)} className="w-full p-2 border rounded">
            <option value="fixed-price">Fixed price</option>
            <option value="auction">Auction</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Auction end time</label>
          <input type="datetime-local" value={values.auctionEndTime} onChange={(e) => handleChange('auctionEndTime', e.target.value)} className="w-full p-2 border rounded" />
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button disabled={saving || uploading} type="submit" className="px-4 py-2 bg-primary text-white rounded">
          {saving ? 'Saving...' : uploading ? 'Uploading images...' : 'Save Listing'}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
      </div>
    </form>
  );
};

export default ListingForm;
