'use client';

import { useState } from 'react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { DayTimeBounds } from '@/types';
import { Clock, Settings } from 'lucide-react';

interface DayTimeSettingsProps {
  day: 'saturday' | 'sunday';
  timeBounds: DayTimeBounds;
  onUpdate: (timeBounds: DayTimeBounds) => void;
}

export function DayTimeSettings({ day, timeBounds, onUpdate }: DayTimeSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [startHour, setStartHour] = useState(timeBounds.startHour);
  const [endHour, setEndHour] = useState(timeBounds.endHour);

  const handleSave = () => {
    if (startHour >= endHour) {
      alert('Start time must be before end time!');
      return;
    }
    
    onUpdate({ startHour, endHour });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setStartHour(timeBounds.startHour);
    setEndHour(timeBounds.endHour);
    setIsEditing(false);
  };

  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  };

  const dayName = day === 'saturday' ? 'Saturday' : 'Sunday';

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-600" />
            <span className="font-medium text-gray-900">{dayName} Schedule</span>
            <span className="text-sm text-gray-600">
              {formatHour(timeBounds.startHour)} - {formatHour(timeBounds.endHour)}
            </span>
          </div>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1"
          >
            <Settings className="w-3 h-3" />
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </div>

        {isEditing && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <select
                  value={startHour}
                  onChange={(e) => setStartHour(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>
                      {formatHour(i)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <select
                  value={endHour}
                  onChange={(e) => setEndHour(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>
                      {formatHour(i)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
