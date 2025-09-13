export type ActivityCategory = 
  | 'food' 
  | 'outdoor' 
  | 'entertainment' 
  | 'wellness' 
  | 'social' 
  | 'creative' 
  | 'learning' 
  | 'home'
  | 'Food & Dining'
  | 'Culture'
  | 'Fitness'
  | 'Shopping'
  | 'Adventure'
  | 'Outdoor';

export type Mood = 'energetic' | 'relaxed' | 'happy' | 'adventurous' | 'cozy' | 'productive' | 'social';

export type WeekendTheme = 
  | 'lazy' 
  | 'adventurous' 
  | 'family' 
  | 'romantic' 
  | 'productive' 
  | 'social' 
  | 'wellness' 
  | 'cultural';

export interface LocationData {
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  rating?: number;
  priceLevel?: number;
  isOpen?: boolean;
  photoUrl?: string;
}

export interface Activity {
  id: string;
  name: string;
  category: ActivityCategory;
  description: string;
  duration: number; // in minutes
  icon: string;
  mood: Mood[];
  isFlexible?: boolean; // can duration be adjusted?
  tags?: string[];
  color?: string;
  isLocationBased?: boolean;
  locationData?: LocationData;
}

export interface ScheduledActivity {
  id: string;
  activityId: string;
  startTime: Date;
  endTime: Date;
  day: 'saturday' | 'sunday';
  customDuration?: number;
  notes?: string;
  mood?: Mood;
  activityData?: Activity; // Store full activity data for location-based activities
}

export interface DayTimeBounds {
  startHour: number; // 0-23
  endHour: number;   // 0-23
}

export interface WeekendPlan {
  id: string;
  name: string;
  theme?: WeekendTheme;
  saturday: ScheduledActivity[];
  sunday: ScheduledActivity[];
  timeBounds: {
    saturday: DayTimeBounds;
    sunday: DayTimeBounds;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface WeekendTemplate {
  id: string;
  name: string;
  description: string;
  theme: WeekendTheme;
  suggestedActivities: string[]; // activity IDs
  icon: string;
}

export interface TimeSlot {
  start: Date;
  end: Date;
  isAvailable: boolean;
}
