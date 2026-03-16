'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface AuctionTimerProps {
  endTime: string;
  onTimeExpired: () => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const AuctionTimer = ({ endTime, onTimeExpired }: AuctionTimerProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const difference = end - now;

      if (difference <= 0) {
        setIsExpired(true);
        onTimeExpired();
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      };
    };

    const updateTimer = () => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [endTime, onTimeExpired, isHydrated]);

  if (!isHydrated) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="ClockIcon" size={24} className="text-primary" />
            <h3 className="text-lg font-semibold text-card-foreground">Time Remaining</h3>
          </div>
          <div className="text-2xl font-mono font-bold text-card-foreground">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  const isEndingSoon = timeRemaining.days === 0 && timeRemaining.hours === 0 && timeRemaining.minutes < 10;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="ClockIcon" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">Time Remaining</h3>
        </div>
        {isEndingSoon && !isExpired && (
          <div className="flex items-center space-x-2 bg-warning/10 text-warning px-3 py-1 rounded-full">
            <Icon name="ExclamationTriangleIcon" size={16} />
            <span className="text-sm font-medium">Ending Soon</span>
          </div>
        )}
      </div>

      {isExpired ? (
        <div className="text-center py-8">
          <Icon name="ClockIcon" size={48} className="text-error mx-auto mb-4" />
          <p className="text-xl font-bold text-error">Auction Ended</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`text-3xl font-mono font-bold ${isEndingSoon ? 'text-warning' : 'text-card-foreground'}`}>
              {timeRemaining.days.toString().padStart(2, '0')}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Days</p>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-mono font-bold ${isEndingSoon ? 'text-warning' : 'text-card-foreground'}`}>
              {timeRemaining.hours.toString().padStart(2, '0')}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Hours</p>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-mono font-bold ${isEndingSoon ? 'text-warning' : 'text-card-foreground'}`}>
              {timeRemaining.minutes.toString().padStart(2, '0')}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Minutes</p>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-mono font-bold ${isEndingSoon ? 'text-warning animate-pulse' : 'text-card-foreground'}`}>
              {timeRemaining.seconds.toString().padStart(2, '0')}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Seconds</p>
          </div>
        </div>
      )}

      {isEndingSoon && !isExpired && (
        <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
          <p className="text-sm text-warning font-medium">
            <Icon name="InformationCircleIcon" size={16} className="inline mr-2" />
            Anti-sniping protection: Auction time may extend if bids are placed in the final minutes.
          </p>
        </div>
      )}
    </div>
  );
};

export default AuctionTimer;