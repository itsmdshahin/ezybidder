'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface CalendarDay {
  date: Date;
  available: boolean;
  timeSlots: TimeSlot[];
}

interface BookingCalendarProps {
  selectedDate: Date | null;
  selectedTime: string | null;
  onDateSelect: (date: Date) => void;
  onTimeSelect: (time: string) => void;
}

const BookingCalendar = ({ selectedDate, selectedTime, onDateSelect, onTimeSelect }: BookingCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: CalendarDay[] = [];
    const currentDate = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      const isCurrentMonth = currentDate.getMonth() === month;
      const isPast = currentDate < new Date(new Date().setHours(0, 0, 0, 0));
      const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
      
      days.push({
        date: new Date(currentDate),
        available: isCurrentMonth && !isPast && !isWeekend,
        timeSlots: generateTimeSlots(currentDate)
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  const generateTimeSlots = (date: Date): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startHour = 9;
    const endHour = 17;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 60) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const isAvailable = Math.random() > 0.3; // Mock availability
        
        slots.push({
          time,
          available: isAvailable
        });
      }
    }

    return slots;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const calendarDays = generateCalendarDays();
  const selectedDaySlots = selectedDate 
    ? calendarDays.find(day => 
        day.date.toDateString() === selectedDate.toDateString()
      )?.timeSlots || []
    : [];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <h2 className="text-xl font-semibold text-card-foreground mb-6">Select Date & Time</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-card-foreground">
              {currentMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
              >
                <Icon name="ChevronLeftIcon" size={16} className="text-muted-foreground" />
              </button>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
              >
                <Icon name="ChevronRightIcon" size={16} className="text-muted-foreground" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const isSelected = selectedDate?.toDateString() === day.date.toDateString();
              const isCurrentMonth = day.date.getMonth() === currentMonth.getMonth();
              
              return (
                <button
                  key={index}
                  onClick={() => day.available && onDateSelect(day.date)}
                  disabled={!day.available}
                  className={`p-2 text-sm rounded-lg transition-colors duration-200 ${
                    !isCurrentMonth
                      ? 'text-muted-foreground/50'
                      : !day.available
                      ? 'text-muted-foreground cursor-not-allowed'
                      : isSelected
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted text-card-foreground'
                  }`}
                >
                  {day.date.getDate()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Slots */}
        <div>
          <h3 className="font-medium text-card-foreground mb-4">
            {selectedDate ? `Available Times - ${formatDate(selectedDate)}` : 'Select a date first'}
          </h3>
          
          {selectedDate ? (
            <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
              {selectedDaySlots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => slot.available && onTimeSelect(slot.time)}
                  disabled={!slot.available}
                  className={`p-2 text-sm rounded-lg border transition-colors duration-200 ${
                    !slot.available
                      ? 'border-border text-muted-foreground cursor-not-allowed bg-muted/50'
                      : selectedTime === slot.time
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border hover:border-primary hover:bg-muted text-card-foreground'
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              <div className="text-center">
                <Icon name="CalendarIcon" size={32} className="mx-auto mb-2" />
                <p className="text-sm">Please select a date to view available times</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;