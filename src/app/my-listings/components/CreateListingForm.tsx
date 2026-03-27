// src/app/my-listings/components/CreateListingForm.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

type FormState = {
  title: string;
  vrm: string;
  make: string;
  model: string;
  year: string;
  mileage: string;
  fuel_type: string;
  body_type: string;
  transmission: string;
  engine_size: string;
  color: string;
  doors: string;
  seats: string;
  drivetrain: string;
  co2: string;
  engine_power: string;
  price: string;
  reserve_price: string;
  listing_type: string;
  description: string;
  location: string;
  ulez_compliant: boolean;
  motStatus: string;
  motExpiryDate: string;
  motNotes: string;
  serviceHistory: string;
  sellerType: string;
  sellerRating: string;
  dvlaVerified: boolean;
  contactPhone: string;
  contactEmail: string;
  imagesInput: string;
  auctionEndTime: string;
};

export default function CreateListingForm() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState<FormState>({
    title: "",
    vrm: "",
    make: "",
    model: "",
    year: "",
    mileage: "",
    fuel_type: "",
    body_type: "",
    transmission: "",
    engine_size: "",
    color: "",
    doors: "",
    seats: "",
    drivetrain: "",
    co2: "",
    engine_power: "",
    price: "",
    reserve_price: "",
    listing_type: "auction",
    description: "",
    location: "",
    ulez_compliant: false,
    motStatus: "valid",
    motExpiryDate: "",
    motNotes: "",
    serviceHistory: "",
    sellerType: "dealer",
    sellerRating: "0",
    dvlaVerified: false,
    contactPhone: "",
    contactEmail: "",
    imagesInput: "",
    auctionEndTime: "",
  });

  const handleChange = (k: keyof FormState, v: any) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const addFeature = () => {
    const f = newFeature.trim();
    if (!f) return;
    if (!features.includes(f)) setFeatures((s) => [...s, f]);
    setNewFeature("");
  };

  const removeFeature = (f: string) =>
    setFeatures((s) => s.filter((x) => x !== f));

  const handleFileSelect = (list: FileList | null) => {
    if (!list) return;
    setFiles((prev) => [...prev, ...Array.from(list)]);
  };

  const removeFile = (index: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== index));

  async function uploadFilesToStorage(): Promise<string[]> {
    if (files.length === 0) return [];
    setUploading(true);
    const urls: string[] = [];

    for (const file of files) {
      try {
        const ext = (file.name.split(".").pop() || "").replace(/\?.*$/, "");
        const id = uuidv4();
        const path = `vehicles/${id}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("vehicles")
          .upload(path, file, { cacheControl: "3600", upsert: false });

        if (uploadError) {
          console.error("Upload error", uploadError);
          continue;
        }

        const { data } = supabase.storage.from("vehicles").getPublicUrl(path);
        if (data?.publicUrl) urls.push(data.publicUrl);
      } catch (err) {
        console.error("Upload exception", err);
      }
    }

    setUploading(false);
    return urls;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");

    try {
      const uploaded = await uploadFilesToStorage();
      const inputUrls = form.imagesInput
        ? form.imagesInput
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
      const images = [...uploaded, ...inputUrls];

      // Optional: keep this; server uses cookies, not this token
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token ?? null;

      const payload: any = {
        title: form.title || null,
        vrm: form.vrm ? String(form.vrm).toUpperCase() : null,
        make: form.make || null,
        model: form.model || null,
        year: form.year ? Number(form.year) : null,
        mileage: form.mileage ? Number(form.mileage) : null,
        price: form.price ? Number(form.price) : null,
        reserve_price: form.reserve_price
          ? Number(form.reserve_price)
          : null,
        fuel_type: form.fuel_type || null,
        body_type: form.body_type || null,
        transmission: form.transmission || null,
        engine_size: form.engine_size || null,
        engine_power: form.engine_power || null,
        drivetrain: form.drivetrain || null,
        co2: form.co2 || null,
        color: form.color || null,
        doors: form.doors ? Number(form.doors) : null,
        seats: form.seats ? Number(form.seats) : null,
        description: form.description || null,
        images,
        mot_status: form.motStatus || null,
        mot_expiry_date: form.motExpiryDate || null,
        mot_notes: form.motNotes || null,
        service_history_text: form.serviceHistory || null,
        seller_type: form.sellerType || null,
        seller_rating: form.sellerRating
          ? Number(form.sellerRating)
          : null,
        dvla_verified: !!form.dvlaVerified,
        contact_phone: form.contactPhone || null,
        contact_email: form.contactEmail || null,
        location: form.location || null,
        ulez_compliant: !!form.ulez_compliant,
        features,

        // Normalize listing type for API
        listing_type:
          form.listing_type === "fixed-price"
            ? "fixed_price"
            : form.listing_type === "both"
            ? "both"
            : form.listing_type,

        auction_end_time: form.auctionEndTime || null,
      };

      const res = await fetch("/api/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error("Create failed", json);
        setStatus("error");
        alert("Create failed: " + (json?.error ?? res.statusText));
        setIsSubmitting(false);
        return;
      }

      setStatus("success");
      setTimeout(() => {
        router.push("/my-listings");
      }, 800);
    } catch (err) {
      console.error(err);
      setStatus("error");
      alert("Save failed: " + String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded shadow"
    >
      <h2 className="text-xl font-semibold">Create vehicle listing</h2>

      {status === "success" && (
        <div className="p-3 bg-green-100 text-green-800 rounded">
          Listing created — redirecting...
        </div>
      )}
      {status === "error" && (
        <div className="p-3 bg-red-100 text-red-800 rounded">
          There was an error creating the listing.
        </div>
      )}

      {/* Images */}
      <div>
        <label className="block text-sm font-medium mb-1">Upload images</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          className="mb-2"
        />
        {files.length > 0 && (
          <div className="space-y-1 mb-2">
            {files.map((f, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-gray-50 p-2 rounded"
              >
                <span className="truncate">{f.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="text-sm text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
        <label className="block text-sm font-medium mb-1">
          Or enter image URLs (comma separated)
        </label>
        <input
          value={form.imagesInput}
          onChange={(e) => handleChange("imagesInput", e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="https://..., https://..."
        />
        {uploading && (
          <div className="text-sm text-gray-500 mt-1">
            Uploading images...
          </div>
        )}
      </div>

      {/* Basic details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Price (£)</label>
          <input
            value={form.price}
            onChange={(e) => handleChange("price", e.target.value)}
            required
            type="number"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Make</label>
          <input
            value={form.make}
            onChange={(e) => handleChange("make", e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Model</label>
          <input
            value={form.model}
            onChange={(e) => handleChange("model", e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Year</label>
          <input
            value={form.year}
            onChange={(e) => handleChange("year", e.target.value)}
            type="number"
            min="1900"
            max={new Date().getFullYear()}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Mileage</label>
          <input
            value={form.mileage}
            onChange={(e) => handleChange("mileage", e.target.value)}
            type="number"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Color</label>
          <input
            value={form.color}
            onChange={(e) => handleChange("color", e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">VRM</label>
          <input
            value={form.vrm}
            onChange={(e) =>
              handleChange("vrm", e.target.value.toUpperCase())
            }
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      {/* Specs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Fuel type</label>
          <select
            value={form.fuel_type}
            onChange={(e) => handleChange("fuel_type", e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select</option>
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="hybrid">Hybrid</option>
            <option value="electric">Electric</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Transmission
          </label>
          <select
            value={form.transmission}
            onChange={(e) => handleChange("transmission", e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select</option>
            <option value="manual">Manual</option>
            <option value="automatic">Automatic</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Body type</label>
          <select
            value={form.body_type}
            onChange={(e) => handleChange("body_type", e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select</option>
            <option value="saloon">Saloon</option>
            <option value="hatchback">Hatchback</option>
            <option value="estate">Estate</option>
            <option value="suv">SUV</option>
            <option value="coupe">Coupe</option>
            <option value="convertible">Convertible</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Engine size (e.g. 2.0)
          </label>
          <input
            value={form.engine_size}
            onChange={(e) => handleChange("engine_size", e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Power / BHP</label>
          <input
            value={form.engine_power}
            onChange={(e) => handleChange("engine_power", e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Doors</label>
          <input
            value={form.doors}
            onChange={(e) => handleChange("doors", e.target.value)}
            type="number"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Seats</label>
          <input
            value={form.seats}
            onChange={(e) => handleChange("seats", e.target.value)}
            type="number"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Drivetrain</label>
          <input
            value={form.drivetrain}
            onChange={(e) => handleChange("drivetrain", e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">CO₂ (g/km)</label>
          <input
            value={form.co2}
            onChange={(e) => handleChange("co2", e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Location</label>
        <input
          value={form.location}
          onChange={(e) => handleChange("location", e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className="w-full p-2 border rounded h-32"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">MOT status</label>
          <select
            value={form.motStatus}
            onChange={(e) => handleChange("motStatus", e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="valid">Valid</option>
            <option value="due-soon">Due soon</option>
            <option value="expired">Expired</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            MOT expiry date
          </label>
          <input
            type="date"
            value={form.motExpiryDate}
            onChange={(e) =>
              handleChange("motExpiryDate", e.target.value)
            }
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Service history (brief)
          </label>
          <input
            value={form.serviceHistory}
            onChange={(e) =>
              handleChange("serviceHistory", e.target.value)
            }
            className="w-full p-2 border rounded"
            placeholder="e.g. Full service history, cambelt replaced 2023..."
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          MOT notes / advisories (optional)
        </label>
        <textarea
          value={form.motNotes}
          onChange={(e) => handleChange("motNotes", e.target.value)}
          className="w-full p-2 border rounded h-20"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Features</label>
        <div className="flex gap-2 mb-2">
          <input
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), addFeature())
            }
            className="p-2 border rounded flex-1"
            placeholder="Add a feature and press Enter"
          />
          <button
            type="button"
            onClick={addFeature}
            className="px-3 py-2 bg-gray-200 rounded"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {features.map((f) => (
            <div
              key={f}
              className="px-2 py-1 bg-gray-100 border rounded flex items-center gap-2"
            >
              <span className="text-sm">{f}</span>
              <button
                type="button"
                onClick={() => removeFeature(f)}
                className="text-red-600 text-xs"
              >
                x
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Listing type
          </label>
          <select
            value={form.listing_type}
            onChange={(e) => handleChange("listing_type", e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="auction">Auction</option>
            <option value="fixed-price">Fixed price</option>
            <option value="both">Both</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Auction end time
          </label>
          <input
            type="datetime-local"
            value={form.auctionEndTime}
            onChange={(e) =>
              handleChange("auctionEndTime", e.target.value)
            }
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Seller type
          </label>
          <select
            value={form.sellerType}
            onChange={(e) => handleChange("sellerType", e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="dealer">Dealer</option>
            <option value="showroom">Showroom</option>
            <option value="private">Private</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Seller rating (optional)
          </label>
          <input
            value={form.sellerRating}
            onChange={(e) =>
              handleChange("sellerRating", e.target.value)
            }
            type="number"
            min="0"
            max="5"
            step="0.1"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Contact phone
          </label>
          <input
            value={form.contactPhone}
            onChange={(e) =>
              handleChange("contactPhone", e.target.value)
            }
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Contact email
          </label>
          <input
            value={form.contactEmail}
            onChange={(e) =>
              handleChange("contactEmail", e.target.value)
            }
            type="email"
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={!!form.dvlaVerified}
            onChange={(e) =>
              handleChange("dvlaVerified", e.target.checked)
            }
          />
          <span className="text-sm">DVLA verified</span>
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={!!form.ulez_compliant}
            onChange={(e) =>
              handleChange("ulez_compliant", e.target.checked)
            }
          />
          <span className="text-sm">ULEZ compliant</span>
        </label>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border rounded bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || uploading}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {isSubmitting ? "Saving..." : uploading ? "Uploading..." : "Create listing"}
        </button>
      </div>
    </form>
  );
}
