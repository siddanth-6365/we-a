import { Activity, WeekendTemplate } from '@/types';

export const ACTIVITIES: Activity[] = [
  // Food & Dining
  {
    id: 'brunch-cafe',
    name: 'Brunch at Local Café',
    category: 'food',
    description: 'Enjoy a leisurely brunch with friends at your favorite local spot',
    duration: 120,
    icon: '🥐',
    mood: ['happy', 'relaxed', 'social'],
    isFlexible: true,
    tags: ['social', 'outdoor seating', 'coffee'],
    color: '#F59E0B'
  },
  {
    id: 'cooking-experiment',
    name: 'Try New Recipe',
    category: 'food',
    description: 'Experiment with a new cuisine or cooking technique',
    duration: 90,
    icon: '👨‍🍳',
    mood: ['productive', 'cozy'],
    isFlexible: true,
    tags: ['home', 'creative', 'learning'],
    color: '#F59E0B'
  },
  {
    id: 'farmers-market',
    name: 'Visit Farmers Market',
    category: 'food',
    description: 'Browse fresh produce and local goods',
    duration: 60,
    icon: '🧺',
    mood: ['happy', 'energetic'],
    isFlexible: true,
    tags: ['outdoor', 'social', 'healthy'],
    color: '#F59E0B'
  },

  // Outdoor Activities
  {
    id: 'hiking-trail',
    name: 'Nature Hike',
    category: 'outdoor',
    description: 'Explore scenic trails and connect with nature',
    duration: 180,
    icon: '🥾',
    mood: ['energetic', 'adventurous'],
    isFlexible: true,
    tags: ['exercise', 'nature', 'fresh air'],
    color: '#10B981'
  },
  {
    id: 'park-picnic',
    name: 'Park Picnic',
    category: 'outdoor',
    description: 'Relax in the park with homemade treats',
    duration: 120,
    icon: '🧺',
    mood: ['relaxed', 'happy'],
    isFlexible: true,
    tags: ['food', 'nature', 'social'],
    color: '#10B981'
  },
  {
    id: 'bike-ride',
    name: 'Bike Ride',
    category: 'outdoor',
    description: 'Cycle through the city or countryside',
    duration: 90,
    icon: '🚴‍♀️',
    mood: ['energetic', 'adventurous'],
    isFlexible: true,
    tags: ['exercise', 'exploration'],
    color: '#10B981'
  },
  {
    id: 'beach-day',
    name: 'Beach Day',
    category: 'outdoor',
    description: 'Soak up the sun and enjoy the waves',
    duration: 240,
    icon: '🏖️',
    mood: ['relaxed', 'happy'],
    isFlexible: true,
    tags: ['water', 'sun', 'relaxation'],
    color: '#10B981'
  },

  // Entertainment
  {
    id: 'movie-night',
    name: 'Movie Marathon',
    category: 'entertainment',
    description: 'Binge-watch your favorite series or discover new films',
    duration: 180,
    icon: '🍿',
    mood: ['cozy', 'relaxed'],
    isFlexible: true,
    tags: ['home', 'comfort', 'snacks'],
    color: '#8B5CF6'
  },
  {
    id: 'live-music',
    name: 'Live Music Event',
    category: 'entertainment',
    description: 'Experience live performances at a local venue',
    duration: 150,
    icon: '🎵',
    mood: ['energetic', 'happy'],
    isFlexible: false,
    tags: ['social', 'culture', 'music'],
    color: '#8B5CF6'
  },
  {
    id: 'museum-visit',
    name: 'Museum Visit',
    category: 'entertainment',
    description: 'Explore art, history, or science exhibitions',
    duration: 120,
    icon: '🏛️',
    mood: ['productive', 'happy'],
    isFlexible: true,
    tags: ['culture', 'learning', 'art'],
    color: '#8B5CF6'
  },
  {
    id: 'board-games',
    name: 'Board Game Night',
    category: 'entertainment',
    description: 'Challenge friends to strategic gameplay',
    duration: 120,
    icon: '🎲',
    mood: ['happy', 'social'],
    isFlexible: true,
    tags: ['social', 'home', 'strategy'],
    color: '#8B5CF6'
  },

  // Wellness
  {
    id: 'yoga-session',
    name: 'Yoga Practice',
    category: 'wellness',
    description: 'Center yourself with mindful movement',
    duration: 60,
    icon: '🧘‍♀️',
    mood: ['relaxed', 'productive'],
    isFlexible: true,
    tags: ['exercise', 'mindfulness', 'flexibility'],
    color: '#EC4899'
  },
  {
    id: 'spa-day',
    name: 'Home Spa Day',
    category: 'wellness',
    description: 'Pamper yourself with self-care rituals',
    duration: 150,
    icon: '🛁',
    mood: ['relaxed', 'cozy'],
    isFlexible: true,
    tags: ['self-care', 'home', 'relaxation'],
    color: '#EC4899'
  },
  {
    id: 'meditation',
    name: 'Meditation Session',
    category: 'wellness',
    description: 'Practice mindfulness and inner peace',
    duration: 30,
    icon: '🕯️',
    mood: ['relaxed', 'productive'],
    isFlexible: true,
    tags: ['mindfulness', 'quiet', 'spiritual'],
    color: '#EC4899'
  },
  {
    id: 'gym-workout',
    name: 'Gym Workout',
    category: 'wellness',
    description: 'Energize your body with exercise',
    duration: 90,
    icon: '💪',
    mood: ['energetic', 'productive'],
    isFlexible: true,
    tags: ['exercise', 'strength', 'endurance'],
    color: '#EC4899'
  },

  // Social
  {
    id: 'friend-hangout',
    name: 'Friends Hangout',
    category: 'social',
    description: 'Catch up with friends over coffee or drinks',
    duration: 120,
    icon: '👥',
    mood: ['happy', 'social'],
    isFlexible: true,
    tags: ['friendship', 'conversation', 'bonding'],
    color: '#06B6D4'
  },
  {
    id: 'dinner-party',
    name: 'Host Dinner Party',
    category: 'social',
    description: 'Bring people together for a memorable meal',
    duration: 180,
    icon: '🍽️',
    mood: ['happy', 'social'],
    isFlexible: true,
    tags: ['hosting', 'food', 'gathering'],
    color: '#06B6D4'
  },
  {
    id: 'karaoke-night',
    name: 'Karaoke Night',
    category: 'social',
    description: 'Sing your heart out with friends',
    duration: 150,
    icon: '🎤',
    mood: ['happy', 'energetic'],
    isFlexible: true,
    tags: ['music', 'fun', 'performance'],
    color: '#06B6D4'
  },

  // Creative
  {
    id: 'art-project',
    name: 'Art Project',
    category: 'creative',
    description: 'Express yourself through painting, drawing, or crafts',
    duration: 120,
    icon: '🎨',
    mood: ['productive', 'relaxed'],
    isFlexible: true,
    tags: ['artistic', 'hands-on', 'expression'],
    color: '#EF4444'
  },
  {
    id: 'photography-walk',
    name: 'Photography Walk',
    category: 'creative',
    description: 'Capture beautiful moments around your city',
    duration: 90,
    icon: '📸',
    mood: ['adventurous', 'productive'],
    isFlexible: true,
    tags: ['artistic', 'exploration', 'outdoor'],
    color: '#EF4444'
  },
  {
    id: 'writing-session',
    name: 'Creative Writing',
    category: 'creative',
    description: 'Work on your novel, poetry, or journal',
    duration: 90,
    icon: '✍️',
    mood: ['productive', 'cozy'],
    isFlexible: true,
    tags: ['literary', 'quiet', 'reflection'],
    color: '#EF4444'
  },

  // Learning
  {
    id: 'language-practice',
    name: 'Language Learning',
    category: 'learning',
    description: 'Practice a new language or skill',
    duration: 60,
    icon: '📚',
    mood: ['productive'],
    isFlexible: true,
    tags: ['education', 'skill-building', 'growth'],
    color: '#3B82F6'
  },
  {
    id: 'online-course',
    name: 'Online Course',
    category: 'learning',
    description: 'Take a class on a topic you\'re passionate about',
    duration: 120,
    icon: '💻',
    mood: ['productive'],
    isFlexible: true,
    tags: ['education', 'digital', 'self-improvement'],
    color: '#3B82F6'
  },
  {
    id: 'book-reading',
    name: 'Reading Time',
    category: 'learning',
    description: 'Dive into a good book or audiobook',
    duration: 90,
    icon: '📖',
    mood: ['relaxed', 'productive'],
    isFlexible: true,
    tags: ['literature', 'quiet', 'knowledge'],
    color: '#3B82F6'
  },

  // Home
  {
    id: 'home-organization',
    name: 'Organize Space',
    category: 'home',
    description: 'Declutter and organize your living space',
    duration: 120,
    icon: '🏠',
    mood: ['productive'],
    isFlexible: true,
    tags: ['cleaning', 'organization', 'productivity'],
    color: '#84CC16'
  },
  {
    id: 'gardening',
    name: 'Gardening',
    category: 'home',
    description: 'Tend to plants and create a beautiful garden',
    duration: 90,
    icon: '🌱',
    mood: ['relaxed', 'productive'],
    isFlexible: true,
    tags: ['nature', 'nurturing', 'outdoor'],
    color: '#84CC16'
  },
  {
    id: 'home-improvement',
    name: 'DIY Project',
    category: 'home',
    description: 'Work on home improvement or decoration',
    duration: 180,
    icon: '🔨',
    mood: ['productive'],
    isFlexible: true,
    tags: ['building', 'improvement', 'hands-on'],
    color: '#84CC16'
  }
];

export const WEEKEND_TEMPLATES: WeekendTemplate[] = [
  {
    id: 'lazy-weekend',
    name: 'Lazy Weekend',
    description: 'Perfect for recharging and taking it slow',
    theme: 'lazy',
    icon: '😴',
    suggestedActivities: [
      'movie-night', 'spa-day', 'book-reading', 'meditation', 
      'brunch-cafe', 'home-organization'
    ]
  },
  {
    id: 'adventurous-weekend',
    name: 'Adventure Time',
    description: 'For thrill-seekers and explorers',
    theme: 'adventurous',
    icon: '🗻',
    suggestedActivities: [
      'hiking-trail', 'bike-ride', 'photography-walk', 
      'beach-day', 'live-music', 'farmers-market'
    ]
  },
  {
    id: 'family-weekend',
    name: 'Family Fun',
    description: 'Quality time with loved ones',
    theme: 'family',
    icon: '👨‍👩‍👧‍👦',
    suggestedActivities: [
      'park-picnic', 'board-games', 'cooking-experiment',
      'museum-visit', 'gardening', 'movie-night'
    ]
  },
  {
    id: 'wellness-weekend',
    name: 'Wellness Focus',
    description: 'Prioritize your mental and physical health',
    theme: 'wellness',
    icon: '🧘‍♀️',
    suggestedActivities: [
      'yoga-session', 'meditation', 'spa-day', 'hiking-trail',
      'gym-workout', 'book-reading'
    ]
  },
  {
    id: 'social-weekend',
    name: 'Social Butterfly',
    description: 'Connect and have fun with friends',
    theme: 'social',
    icon: '🎉',
    suggestedActivities: [
      'friend-hangout', 'dinner-party', 'karaoke-night',
      'brunch-cafe', 'live-music', 'board-games'
    ]
  },
  {
    id: 'productive-weekend',
    name: 'Get Things Done',
    description: 'Accomplish goals and learn new skills',
    theme: 'productive',
    icon: '✅',
    suggestedActivities: [
      'language-practice', 'online-course', 'art-project',
      'home-improvement', 'writing-session', 'home-organization'
    ]
  }
];

export const CATEGORY_COLORS = {
  food: '#F59E0B',
  outdoor: '#10B981',
  entertainment: '#8B5CF6',
  wellness: '#EC4899',
  social: '#06B6D4',
  creative: '#EF4444',
  learning: '#3B82F6',
  home: '#84CC16',
  'Food & Dining': '#F59E0B',
  Culture: '#3B82F6',
  Fitness: '#EC4899',
  Shopping: '#8B5CF6',
  Adventure: '#EF4444',
  Outdoor: '#10B981'
} as const;
