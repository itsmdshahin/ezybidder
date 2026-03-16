"use client";

import Link from 'next/link';

export default function CreateAuctionButton() {
  const handleClick = () => {
    const user = (typeof window !== 'undefined' && sessionStorage.getItem('user')) ? JSON.parse(sessionStorage.getItem('user') as string) : null;
    if (!user) {
      window.location.href = '/login';
      return;
    }
    window.location.href = '/create-auction';
  };

  return (
    <button onClick={handleClick} className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors duration-200">
      <span>Create Auction</span>
    </button>
  );
}
