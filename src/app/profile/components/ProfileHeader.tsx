// src/app/profile/components/ProfileHeader.tsx
'use client';

import React, { useRef } from 'react';
import AppImage from '@/components/ui/AppImage';

type Profile = {
  id?: string;
  full_name?: string | null;
  avatar_url?: string | null;
  kyc_status?: string | null;
  phone?: string | null;
  address?: any | null;
  updated_at?: string | null;
};

interface Props {
  profile?: Profile | null;
  email?: string | null;
  onSignOut?: () => void;
  onAvatarUpload?: (file: File | null) => void;
  uploading?: boolean;
}

const PLACEHOLDER = 'https://via.placeholder.com/200x200?text=Avatar';

const ProfileHeader: React.FC<Props> = ({
  profile,
  email,
  onAvatarUpload,
  uploading,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (onAvatarUpload) onAvatarUpload(file);
  };

  const imgSrc =
    profile?.avatar_url
      ? `${profile.avatar_url}?t=${profile.updated_at ?? Date.now()}`
      : PLACEHOLDER;

  return (
    <div className="bg-card rounded-lg border border-border p-6 flex items-center space-x-6">
      <div className="w-28">
        <div className="w-28 h-28 rounded-full overflow-hidden bg-muted">
          <AppImage
            src={imgSrc}
            alt={profile?.full_name ?? email ?? 'User avatar'}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="mt-3 flex items-center space-x-2">
          <label
            htmlFor="avatar-upload"
            className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm cursor-pointer"
          >
            {uploading ? 'Uploading...' : 'Change'}
          </label>
          <input
            ref={inputRef}
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => inputRef.current?.click()}
            className="px-3 py-1 rounded-md bg-background border border-border text-sm"
          >
            Browse
          </button>
        </div>
      </div>

      <div className="flex-1">
        <h2 className="text-2xl font-semibold">
          {profile?.full_name ?? 'Unnamed user'}
        </h2>
        <p className="text-sm text-muted-foreground">{email}</p>

        <div className="mt-3 flex items-center space-x-3">
          <span className="px-2 py-1 rounded-md bg-muted text-xs">
            {profile?.kyc_status
              ? profile.kyc_status.toUpperCase()
              : 'KYC UNKNOWN'}
          </span>
          {profile?.phone && (
            <span className="text-sm text-muted-foreground">
              {profile.phone}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
