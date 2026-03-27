'use client';

import { useState } from 'react';
import FAQItem from './FAQItem';
import Icon from '@/components/ui/AppIcon';

export default function HelpCenterClient() {
  const [activeCategory, setActiveCategory] = useState('general');

  const faqData: any = {
    general: [
      {
        q: 'What is EzyBidder?',
        a: 'EzyBidder is an online marketplace for buying, selling, and auctioning vehicles securely and transparently.',
      },
      {
        q: 'How do I create an account?',
        a: 'Click the Sign Up button at the top right of the website. You can register with your email or social login options.',
      },
    ],
    buying: [
      {
        q: 'How do I place a bid?',
        a: 'Go to any auction listing and click “Place Bid.” Enter your bid amount and confirm.',
      },
      {
        q: 'How do I know if I won an auction?',
        a: 'Winners receive an email, dashboard notification, and the auction will appear in your “Bid History” as “Won”.',
      },
    ],
    selling: [
      {
        q: 'How do I create a listing?',
        a: 'Visit the “My Listings” page and click Add Listing. Fill in vehicle details, upload images, and choose fixed price or auction.',
      },
      {
        q: 'Can I edit or delete my listing?',
        a: 'Yes. From the My Listings page, click Edit or Delete on any listing you own.',
      },
    ],
    payments: [
      {
        q: 'What payment methods are supported?',
        a: 'EzyBidder supports secure card payments, escrow payments, and protected transactions.',
      },
      {
        q: 'Is there a platform fee?',
        a: 'Yes, a small platform fee is included for secure payment processing and buyer protection.',
      },
    ],
  };

  const categories = [
    { key: 'general', label: 'General' },
    { key: 'buying', label: 'Buying' },
    { key: 'selling', label: 'Selling' },
    { key: 'payments', label: 'Payments' },
  ];

  return (
    <div className="space-y-12">

      {/* HERO */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-3">Help & Support</h1>
        <p className="text-muted-foreground">
          Need help? Find answers or contact our friendly support team.
        </p>
      </div>

      {/* QUICK SUPPORT OPTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contact Support */}
        <div className="bg-card border border-border rounded-lg p-6 flex items-start space-x-4">
          <Icon name="ChatBubbleBottomCenterTextIcon" size={32} className="text-primary" />
          <div>
            <h3 className="font-semibold text-card-foreground">Contact Support</h3>
            <p className="text-muted-foreground text-sm">
              Our support team is here 24/7 to help you.
            </p>
            <button className="mt-3 px-3 py-2 bg-primary text-primary-foreground rounded-md">
              Send Message
            </button>
          </div>
        </div>

        {/* Report a Problem */}
        <div className="bg-card border border-border rounded-lg p-6 flex items-start space-x-4">
          <Icon name="ExclamationTriangleIcon" size={32} className="text-warning" />
          <div>
            <h3 className="font-semibold text-card-foreground">Report an Issue</h3>
            <p className="text-muted-foreground text-sm">
              Found something not working? Let us know.
            </p>
            <button className="mt-3 px-3 py-2 bg-warning text-white rounded-md">
              Report Now
            </button>
          </div>
        </div>

        {/* Live Chat */}
        <div className="bg-card border border-border rounded-lg p-6 flex items-start space-x-4">
          <Icon name="PhoneIcon" size={32} className="text-success" />
          <div>
            <h3 className="font-semibold text-card-foreground">Live Chat</h3>
            <p className="text-muted-foreground text-sm">
              Chat live with our support team.
            </p>
            <button className="mt-3 px-3 py-2 bg-success text-success-foreground rounded-md">
              Start Chat
            </button>
          </div>
        </div>
      </div>

      {/* CATEGORIES NAV */}
      <div className="flex items-center space-x-4 border-b border-border pb-2">
        {categories.map((c) => (
          <button
            key={c.key}
            onClick={() => setActiveCategory(c.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeCategory === c.key
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* FAQ LIST */}
      <div className="space-y-4">
        {faqData[activeCategory].map((f: any, idx: number) => (
          <FAQItem key={idx} question={f.q} answer={f.a} />
        ))}
      </div>

      {/* CONTACT SUPPORT FORM */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Still Need Help?</h3>
        <p className="text-muted-foreground mb-6">
          Send us a message and our support team will get back to you within a few hours.
        </p>

        <form className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full px-4 py-3 bg-input border border-border rounded-md"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full px-4 py-3 bg-input border border-border rounded-md"
          />
          <textarea
            rows={5}
            placeholder="How can we help?"
            className="w-full px-4 py-3 bg-input border border-border rounded-md"
          ></textarea>

          <button className="px-6 py-3 bg-primary text-primary-foreground rounded-md">
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
}
