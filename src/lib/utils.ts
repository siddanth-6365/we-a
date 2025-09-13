import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Smart scheduling utilities
export function getDayTimeBounds(
  day: 'saturday' | 'sunday', 
  timeBounds: { startHour: number; endHour: number }
): { start: Date; end: Date } {
  const baseDate = new Date();
  const targetDate = new Date(baseDate);
  
  if (day === 'saturday') {
    targetDate.setDate(baseDate.getDate() + (6 - baseDate.getDay()));
  } else {
    targetDate.setDate(baseDate.getDate() + (7 - baseDate.getDay()));
  }
  
  const startTime = new Date(targetDate);
  startTime.setHours(timeBounds.startHour, 0, 0, 0);
  
  const endTime = new Date(targetDate);
  endTime.setHours(timeBounds.endHour, 0, 0, 0);
  
  return { start: startTime, end: endTime };
}

export function findNextAvailableSlot(
  activities: Array<{ startTime: Date; endTime: Date }>,
  duration: number,
  day: 'saturday' | 'sunday',
  timeBounds: { startHour: number; endHour: number }
): Date | null {
  const { start: dayStart, end: dayEnd } = getDayTimeBounds(day, timeBounds);
  
  // Sort activities by start time
  const sortedActivities = [...activities].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  
  // Check if we can fit at the beginning of the day
  const firstSlotEnd = new Date(dayStart.getTime() + duration * 60000);
  if (sortedActivities.length === 0 || firstSlotEnd <= sortedActivities[0].startTime) {
    return dayStart;
  }
  
  // Check gaps between activities
  for (let i = 0; i < sortedActivities.length - 1; i++) {
    const currentEnd = sortedActivities[i].endTime;
    const nextStart = sortedActivities[i + 1].startTime;
    const gapDuration = (nextStart.getTime() - currentEnd.getTime()) / 60000;
    
    if (gapDuration >= duration) {
      return currentEnd;
    }
  }
  
  // Check if we can fit at the end of the day
  const lastActivity = sortedActivities[sortedActivities.length - 1];
  const lastSlotStart = lastActivity.endTime;
  const lastSlotEnd = new Date(lastSlotStart.getTime() + duration * 60000);
  
  if (lastSlotEnd <= dayEnd) {
    return lastSlotStart;
  }
  
  return null; // No available slot
}

export function checkDayCapacity(
  activities: Array<{ startTime: Date; endTime: Date }>,
  day: 'saturday' | 'sunday',
  timeBounds: { startHour: number; endHour: number }
): { canFit: boolean; totalDuration: number; availableTime: number } {
  const { start: dayStart, end: dayEnd } = getDayTimeBounds(day, timeBounds);
  const dayDuration = (dayEnd.getTime() - dayStart.getTime()) / 60000; // minutes
  
  const totalDuration = activities.reduce((total, activity) => {
    return total + (activity.endTime.getTime() - activity.startTime.getTime()) / 60000;
  }, 0);
  
  const availableTime = dayDuration - totalDuration;
  
  return {
    canFit: availableTime > 0,
    totalDuration,
    availableTime
  };
}

// Time conflict validation utilities
export function checkTimeConflicts(
  activities: Array<{ id: string; startTime: Date; endTime: Date }>,
  targetActivityId: string,
  newStartTime: Date,
  newEndTime: Date
): { hasConflict: boolean; conflictingActivity?: { id: string; name: string }; conflictType: 'start' | 'end' | 'overlap' } {
  const otherActivities = activities.filter(a => a.id !== targetActivityId);
  
  for (const activity of otherActivities) {
    // Check if new start time conflicts with any activity
    if (newStartTime.getTime() < activity.endTime.getTime() && newStartTime.getTime() >= activity.startTime.getTime()) {
      return {
        hasConflict: true,
        conflictingActivity: { id: activity.id, name: 'Previous Activity' },
        conflictType: 'start'
      };
    }
    
    // Check if new end time conflicts with any activity
    if (newEndTime.getTime() > activity.startTime.getTime() && newEndTime.getTime() <= activity.endTime.getTime()) {
      return {
        hasConflict: true,
        conflictingActivity: { id: activity.id, name: 'Next Activity' },
        conflictType: 'end'
      };
    }
    
    // Check if new activity completely overlaps with any activity
    if (newStartTime.getTime() < activity.startTime.getTime() && newEndTime.getTime() > activity.endTime.getTime()) {
      return {
        hasConflict: true,
        conflictingActivity: { id: activity.id, name: 'Overlapping Activity' },
        conflictType: 'overlap'
      };
    }
  }
  
  return { hasConflict: false, conflictType: 'start' };
}

export function getTimeConflictMessage(
  conflictType: 'start' | 'end' | 'overlap'
): string {
  switch (conflictType) {
    case 'start':
      return `Start time conflicts with the previous activity. Try dragging the activity to a different position or adjust the previous activity's end time.`;
    case 'end':
      return `End time conflicts with the next activity. Try dragging the activity to a different position or adjust the next activity's start time.`;
    case 'overlap':
      return `This time range overlaps with another activity. Try dragging the activity to a different position or adjust the overlapping activity's time.`;
    default:
      return 'Time conflict detected. Try dragging the activity to a different position.';
  }
}
