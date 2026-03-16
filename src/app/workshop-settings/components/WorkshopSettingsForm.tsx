"use client";

import { useEffect, useState } from 'react';
import WorkshopInfo from '@/app/service-booking/components/WorkshopInfo';

const WorkshopSettingsForm = () => {
  const [workshop, setWorkshop] = useState<any | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadWorkshop = async () => {
      const ownerId = (typeof window !== 'undefined' && sessionStorage.getItem('user')) ? JSON.parse(sessionStorage.getItem('user') as string).id : 'user_001';
      setLoading(true);
      try {
        const res = await fetch(`/api/workshops?owner=${ownerId}`);
        const json = await res.json();
        setWorkshop(json.workshop);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadWorkshop();
  }, []);

  const handleSave = async () => {
    if (!workshop) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/workshops/${workshop.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(workshop) });
      if (!res.ok) throw new Error('Update failed');
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save workshop');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !workshop) return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-muted rounded w-1/4"></div>
        <div className="h-64 bg-muted rounded-lg"></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Workshop Settings</h1>
          <p className="text-sm text-muted-foreground">Edit your business details, contact info and opening hours.</p>
        </div>
        <div>
          {!editing ? (
            <button onClick={() => setEditing(true)} className="px-4 py-2 bg-primary text-primary-foreground rounded-md">Edit</button>
          ) : (
            <div className="flex items-center space-x-2">
              <button onClick={() => setEditing(false)} className="px-3 py-1 border border-border rounded-md">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-success text-success-foreground rounded-md">Save</button>
            </div>
          )}
        </div>
      </div>

      {editing ? (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground">Name</label>
              <input value={workshop.name} onChange={(e) => setWorkshop({ ...workshop, name: e.target.value })} className="mt-1 input" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Phone</label>
              <input value={workshop.phone} onChange={(e) => setWorkshop({ ...workshop, phone: e.target.value })} className="mt-1 input" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-muted-foreground">Address</label>
              <input value={workshop.address} onChange={(e) => setWorkshop({ ...workshop, address: e.target.value })} className="mt-1 input" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-muted-foreground">Description</label>
              <textarea value={workshop.description} onChange={(e) => setWorkshop({ ...workshop, description: e.target.value })} className="mt-1 input h-24" />
            </div>
          </div>
        </div>
      ) : (
        <WorkshopInfo workshop={workshop} />
      )}
    </div>
  );
};

export default WorkshopSettingsForm;
