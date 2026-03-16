'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

export default function FAQItem({ question, answer }: any) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-left"
      >
        <span className="font-medium text-card-foreground">{question}</span>
        <Icon
          name={open ? 'ChevronUpIcon' : 'ChevronDownIcon'}
          size={20}
          className="text-muted-foreground"
        />
      </button>

      {open && (
        <p className="mt-3 text-muted-foreground leading-relaxed">{answer}</p>
      )}
    </div>
  );
}
