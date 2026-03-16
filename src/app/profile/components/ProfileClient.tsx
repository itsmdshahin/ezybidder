// src/app/profile/components/ProfileClient.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ProfileHeader from './ProfileHeader';
import ProfileDetails from './ProfileDetails';

type UserProfile = {
  id: string;
  email: string;
  full_name?: string | null;
  phone?: string | null;
  user_type?: string | null;
  kyc_status?: string | null;
  address?: any | null;       // jsonb
  avatar_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

const ProfileClient: React.FC = () => {
  const [authUser, setAuthUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postcode: '',
    country: '',
  });

  // ----------------- LOAD USER + PROFILE -----------------
  useEffect(() => {
    const loadUserAndProfile = async () => {
      setLoading(true);
      setError(null);

      const { data, error: userErr } = await supabase.auth.getUser();
      if (userErr) {
        console.error('[profile] getUser error:', userErr);
        setError(userErr.message);
        setAuthUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      const user = data?.user ?? (data as any)?.data?.user ?? null;
      console.log('[profile] auth user:', user);

      setAuthUser(user);

      if (user) {
        await fetchOrCreateProfile(user);
      } else {
        setProfile(null);
      }

      setLoading(false);
    };

    loadUserAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const u = session?.user ?? null;
        console.log('[profile] auth state changed, user:', u);
        setAuthUser(u);
        if (u) fetchOrCreateProfile(u);
        else setProfile(null);
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe?.();
    };
  }, []);

  // ----------------- SYNC FORM FROM PROFILE -------------
  useEffect(() => {
    if (!profile) return;
    const addr =
      profile.address && typeof profile.address === 'object'
        ? (profile.address as any)
        : {};

    setForm({
      full_name: profile.full_name ?? '',
      phone: profile.phone ?? '',
      addressLine1: addr.line1 ?? '',
      addressLine2: addr.line2 ?? '',
      city: addr.city ?? '',
      postcode: addr.postcode ?? '',
      country: addr.country ?? '',
    });
  }, [profile]);

  // ----------------- FETCH / CREATE PROFILE -------------
  const fetchOrCreateProfile = async (user: any) => {
    setError(null);
    console.log('[profile] fetchOrCreateProfile for user id:', user.id);

    const { data, error: fetchErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (fetchErr) {
      console.error('[profile] fetch profile error:', fetchErr);
      setError(fetchErr.message);
      setProfile(null);
      return;
    }

    if (data) {
      console.log('[profile] existing profile row:', data);
      setProfile(data as UserProfile);
      return;
    }

    const { data: inserted, error: insertErr } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name ?? null,
      })
      .select('*')
      .single();

    if (insertErr) {
      console.error('[profile] insert profile error:', insertErr);
      setError(insertErr.message);
      setProfile(null);
      return;
    }

    console.log('[profile] created profile row:', inserted);
    setProfile(inserted as UserProfile);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setAuthUser(null);
    setProfile(null);
  };

  // ----------------- AVATAR UPLOAD -----------------
  const handleAvatarUpload = async (file: File | null) => {
    if (!file || !authUser) return;
    setUploading(true);
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar-${Date.now()}.${fileExt}`;
      const filePath = `${authUser.id}/${fileName}`;

      console.log('[avatar] uploading to path:', filePath);

      const { error: uploadErr } = await supabase.storage
        .from('avatars') // bucket name
        .upload(filePath, file, {
          upsert: true,
          cacheControl: '3600',
        });

      if (uploadErr) {
        console.error('[avatar] upload error:', uploadErr);
        throw uploadErr;
      }

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;
      console.log('[avatar] publicUrl:', publicUrl);

      const { error: updateErr } = await supabase
        .from('profiles')
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', authUser.id);

      if (updateErr) {
        console.error('[avatar] profile update error:', updateErr);
        throw updateErr;
      }

      // আবার DB থেকে নতুন profile নিয়ে আসি
      await fetchOrCreateProfile(authUser);
    } catch (err: any) {
      console.error('Avatar upload error (catch):', err);
      setError(err.message || String(err));
    } finally {
      setUploading(false);
    }
  };

  // ----------------- EDIT PROFILE SAVE -----------------
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!authUser) return;
    setSavingProfile(true);
    setError(null);

    try {
      const addressJson = {
        line1: form.addressLine1 || null,
        line2: form.addressLine2 || null,
        city: form.city || null,
        postcode: form.postcode || null,
        country: form.country || null,
      };

      const { error: updateErr } = await supabase
        .from('profiles')
        .update({
          full_name: form.full_name || null,
          phone: form.phone || null,
          address: addressJson,
          updated_at: new Date().toISOString(),
        })
        .eq('id', authUser.id);

      if (updateErr) throw updateErr;

      await fetchOrCreateProfile(authUser);
      setIsEditing(false);
    } catch (err: any) {
      console.error('Profile update error:', err);
      setError(err.message || String(err));
    } finally {
      setSavingProfile(false);
    }
  };

  // ----------------- RENDER -----------------
  if (loading) {
    return (
      <div className="bg-card rounded-lg p-8">
        <p>Loading profile…</p>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="bg-card rounded-lg p-8">
        <h2 className="text-xl font-semibold">Not signed in</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Please sign in to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <ProfileHeader
          profile={profile}
          email={authUser.email}
          onSignOut={handleSignOut}
          uploading={uploading}
          onAvatarUpload={handleAvatarUpload}
        />

        <ProfileDetails profile={profile} />

        {isEditing && (
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold mb-4">Edit profile</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-muted-foreground block mb-1">
                  Full name
                </label>
                <input
                  name="full_name"
                  value={form.full_name}
                  onChange={handleFormChange}
                  className="w-full rounded-md border border-border px-3 py-2 text-sm bg-background"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground block mb-1">
                  Phone
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleFormChange}
                  className="w-full rounded-md border border-border px-3 py-2 text-sm bg-background"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm text-muted-foreground block mb-1">
                  Address line 1
                </label>
                <input
                  name="addressLine1"
                  value={form.addressLine1}
                  onChange={handleFormChange}
                  className="w-full rounded-md border border-border px-3 py-2 text-sm bg-background"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm text-muted-foreground block mb-1">
                  Address line 2
                </label>
                <input
                  name="addressLine2"
                  value={form.addressLine2}
                  onChange={handleFormChange}
                  className="w-full rounded-md border border-border px-3 py-2 text-sm bg-background"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground block mb-1">
                  City
                </label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleFormChange}
                  className="w-full rounded-md border border-border px-3 py-2 text-sm bg-background"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground block mb-1">
                  Postcode
                </label>
                <input
                  name="postcode"
                  value={form.postcode}
                  onChange={handleFormChange}
                  className="w-full rounded-md border border-border px-3 py-2 text-sm bg-background"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground block mb-1">
                  Country
                </label>
                <input
                  name="country"
                  value={form.country}
                  onChange={handleFormChange}
                  className="w-full rounded-md border border-border px-3 py-2 text-sm bg-background"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90 disabled:opacity-70"
              >
                {savingProfile ? 'Saving…' : 'Save changes'}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-md border border-border text-sm bg-background"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <aside className="space-y-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold mb-3">Account</h3>

          <p className="text-sm text-muted-foreground mb-2">Email</p>
          <p className="mb-4">{authUser.email}</p>

          <p className="text-sm text-muted-foreground mb-2">Member since</p>
          <p className="mb-4">
            {profile?.created_at
              ? new Date(profile.created_at).toLocaleString()
              : '—'}
          </p>

          <button
            onClick={handleSignOut}
            className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition"
          >
            Sign out
          </button>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold mb-3">Quick actions</h3>
          <div className="space-y-2">
            <button
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              onClick={() => setIsEditing(true)}
            >
              Edit profile
            </button>
            <button className="w-full px-4 py-2 bg-muted rounded-md">
              Change password
            </button>
            <button className="w-full px-4 py-2 text-error bg-error/10 rounded-md">
              Delete account
            </button>
          </div>
        </div>
      </aside>

      {error && (
        <div className="lg:col-span-3 text-sm text-error">
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  );
};

export default ProfileClient;
