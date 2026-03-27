// src/app/profile/components/ProfileDetails.tsx
'use client';

import React from 'react';

type Profile = {
  id?: string;
  email?: string | null;
  full_name?: string | null;
  phone?: string | null;
  user_type?: string | null;
  kyc_status?: string | null;
  address?: any | null;           // jsonb
  created_at?: string | null;
  updated_at?: string | null;
  avatar_url?: string | null;
};

interface Props {
  profile?: Profile | null;
}

const ProfileDetails: React.FC<Props> = ({ profile }) => {
  // Format address JSON → string
  let addressText = '—';
  if (profile?.address) {
    if (typeof profile.address === 'string') {
      addressText = profile.address;
    } else if (typeof profile.address === 'object') {
      const addr = profile.address as any;
      const parts = [
        addr.line1,
        addr.line2,
        addr.city,
        addr.postcode,
        addr.country,
      ].filter(Boolean);
      addressText = parts.length ? parts.join(', ') : '—';
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold mb-4">Personal information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Full name</p>
            <p className="font-medium">{profile?.full_name ?? '—'}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{profile?.email ?? '—'}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Phone</p>
            <p className="font-medium">{profile?.phone ?? '—'}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">User type</p>
            <p className="font-medium">{profile?.user_type ?? '—'}</p>
          </div>

          <div className="md:col-span-2">
            <p className="text-sm text-muted-foreground">Address</p>
            <p className="font-medium">{addressText}</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold mb-4">Account activity</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Member since</p>
            <p className="font-medium">
              {profile?.created_at
                ? new Date(profile.created_at).toLocaleString()
                : '—'}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Last updated</p>
            <p className="font-medium">
              {profile?.updated_at
                ? new Date(profile.updated_at).toLocaleString()
                : '—'}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">KYC status</p>
            <p className="font-medium">{profile?.kyc_status ?? '—'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
