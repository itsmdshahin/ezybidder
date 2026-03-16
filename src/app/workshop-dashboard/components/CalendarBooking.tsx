'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface BookingEvent {
  id: string;
  title: string;
  customer: string;
  service: string;
  time: string;
  duration: number;
  status: 'confirmed' | 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

interface CalendarBookingProps {
  className?: string;
}

const CalendarBooking = ({ className = '' }: CalendarBookingProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');

  const mockBookings: BookingEvent[] = [
    {
      id: '1',
      title: 'Full Service',
      customer: 'John Smith',
      service: 'Oil Change + MOT',
      time: '09:00',
      duration: 120,
      status: 'confirmed',
      priority: 'medium'
    },
    {
      id: '2',
      title: 'Brake Repair',
      customer: 'Sarah Johnson',
      service: 'Brake Pad Replacement',
      time: '11:30',
      duration: 90,
      status: 'in-progress',
      priority: 'high'
    },
    {
      id: '3',
      title: 'Dent Repair',
      customer: 'Mike Wilson',
      service: 'Panel Beating',
      time: '14:00',
      duration: 180,
      status: 'pending',
      priority: 'low'
    },
    {
      id: '4',
      title: 'Paint Touch-up',
      customer: 'Emma Davis',
      service: 'Scratch Repair',
      time: '16:30',
      duration: 60,
      status: 'confirmed',
      priority: 'medium'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success/10 text-success border-success/20';
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'in-progress':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'completed':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-error';
      case 'medium':
        return 'border-l-warning';
      case 'low':
        return 'border-l-success';
      default:
        return 'border-l-border';
    }
  };

  const timeSlots = Array.from({ length: 10 }, (_, i) => {
    const hour = 8 + i;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-card-foreground">Service Calendar</h3>
          <div className="flex items-center space-x-2">
            <div className="flex bg-muted rounded-md p-1">
              {(['day', 'week', 'month'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1 text-sm font-medium rounded transition-colors duration-200 ${
                    viewMode === mode
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
            <button className="p-2 hover:bg-muted rounded-md transition-colors duration-200">
              <Icon name="CalendarDaysIcon" size={20} className="text-foreground" />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-4">
            <button className="p-1 hover:bg-muted rounded transition-colors duration-200">
              <Icon name="ChevronLeftIcon" size={20} className="text-foreground" />
            </button>
            <h4 className="text-base font-medium text-card-foreground">
              {selectedDate.toLocaleDateString('en-GB', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h4>
            <button className="p-1 hover:bg-muted rounded transition-colors duration-200">
              <Icon name="ChevronRightIcon" size={20} className="text-foreground" />
            </button>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-200">
            <Icon name="PlusIcon" size={16} />
            <span className="text-sm font-medium">New Booking</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Time Slots */}
          <div className="lg:col-span-2">
            <div className="space-y-2">
              {timeSlots.map((time) => (
                <div key={time} className="h-16 flex items-center justify-center text-sm text-muted-foreground border-r border-border">
                  {time}
                </div>
              ))}
            </div>
          </div>

          {/* Booking Grid */}
          <div className="lg:col-span-10">
            <div className="relative">
              <div className="space-y-2">
                {timeSlots.map((time) => (
                  <div key={time} className="h-16 border-b border-border/50 relative">
                    {mockBookings
                      .filter(booking => booking.time === time)
                      .map((booking) => (
                        <div
                          key={booking.id}
                          className={`absolute left-0 right-0 mx-2 p-3 rounded-md border-l-4 ${getPriorityColor(booking.priority)} ${getStatusColor(booking.status)} cursor-pointer hover:shadow-sm transition-shadow duration-200`}
                          style={{ height: `${(booking.duration / 60) * 64 - 8}px` }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{booking.title}</p>
                              <p className="text-xs opacity-80 truncate">{booking.customer}</p>
                              <p className="text-xs opacity-70 truncate">{booking.service}</p>
                            </div>
                            <div className="flex items-center space-x-1 ml-2">
                              <Icon name="ClockIcon" size={12} className="opacity-60" />
                              <span className="text-xs opacity-80">{booking.duration}m</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success/20 border border-success/40 rounded"></div>
              <span className="text-muted-foreground">Confirmed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-warning/20 border border-warning/40 rounded"></div>
              <span className="text-muted-foreground">Pending</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary/20 border border-primary/40 rounded"></div>
              <span className="text-muted-foreground">In Progress</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 border-l-4 border-l-error bg-muted rounded"></div>
              <span className="text-muted-foreground">High Priority</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarBooking;