interface GeoapifyProperties {
  name?: string;
  formatted?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  postcode?: string;
  country?: string;
  categories: string[];
  details?: string[];
  facilities?: string[];
  datasource?: {
    sourcename?: string;
    attribution?: string;
    license?: string;
    url?: string;
  };
  place_id?: string;
  opening_hours?: string;
  contact?: {
    phone?: string;
    website?: string;
  };
  website?: string;
  phone?: string;
}

interface GeoapifyGeometry {
  type: string;
  coordinates: [number, number]; // [lng, lat]
}

export interface GeoapifyPlace {
  type: string;
  properties: GeoapifyProperties;
  geometry: GeoapifyGeometry;
}

export interface LocationBasedActivity {
  id: string;
  name: string;
  description: string;
  category: string;
  duration: number;
  mood: string[];
  icon: string;
  location: {
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
  };
  placeId: string;
}

export interface UserLocation {
  lat: number;
  lng: number;
  address?: string;
}

// Supported Geoapify categories for each activity type
const SUPPORTED_CATEGORIES = {
  restaurant: [
    'catering.restaurant', 'catering.fast_food', 'catering.food_court'
  ],
  cafe: [
    'catering.cafe', 'catering.ice_cream'
  ],
  park: [
    'leisure.park', 'natural.water', 'natural.forest'
  ],
  museum: [
    'entertainment.museum', 'entertainment.culture', 'tourism.attraction'
  ],
  fitness: [
    'sport.fitness', 'sport.swimming_pool', 'sport.sports_centre'
  ],
  shopping: [
    'commercial.shopping_mall', 'commercial.marketplace', 'commercial.department_store'
  ],
  entertainment: [
    'entertainment.cinema', 'entertainment', 'entertainment.activity_park'
  ],
  attraction: [
    'tourism.attraction', 'tourism.sights', 'entertainment.zoo'
  ]
};

// Activity type mappings for Geoapify Places (using only supported categories)
const ACTIVITY_TYPE_MAPPINGS = {
  restaurant: {
    categories: ['catering.restaurant', 'catering.fast_food', 'catering.food_court'],
    category: 'Food & Dining',
    icon: '🍽️',
    duration: 90,
    moods: ['happy', 'social']
  },
  cafe: {
    categories: ['catering.cafe', 'catering.ice_cream'],
    category: 'Food & Dining',
    icon: '☕',
    duration: 60,
    moods: ['relaxed', 'cozy']
  },
  park: {
    categories: ['leisure.park', 'natural.water', 'natural.forest'],
    category: 'Outdoor',
    icon: '🌳',
    duration: 120,
    moods: ['relaxed', 'energetic']
  },
  museum: {
    categories: ['entertainment.museum', 'entertainment.culture', 'tourism.attraction'],
    category: 'Culture',
    icon: '🏛️',
    duration: 180,
    moods: ['productive', 'happy']
  },
  fitness: {
    categories: ['sport.fitness', 'sport.swimming_pool', 'sport.sports_centre'],
    category: 'Fitness',
    icon: '💪',
    duration: 90,
    moods: ['energetic', 'productive']
  },
  shopping: {
    categories: ['commercial.shopping_mall', 'commercial.marketplace', 'commercial.department_store'],
    category: 'Shopping',
    icon: '🛍️',
    duration: 120,
    moods: ['happy', 'social']
  },
  entertainment: {
    categories: ['entertainment.cinema', 'entertainment', 'entertainment.activity_park'],
    category: 'Entertainment',
    icon: '🎬',
    duration: 150,
    moods: ['relaxed', 'happy']
  },
  attraction: {
    categories: ['tourism.attraction', 'tourism.sights', 'entertainment.zoo'],
    category: 'Adventure',
    icon: '🎢',
    duration: 240,
    moods: ['adventurous', 'energetic']
  }
};

class LocationService {
  private apiKey: string;
  
  constructor() {
    // Geoapify API key from environment variables or default demo key
    this.apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY || '4d4deba9f4e54a14bb7c4b869ee98b79';
  }

  // Get user's current location
  async getCurrentLocation(): Promise<UserLocation> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location: UserLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          // Try to get address from coordinates
          try {
            const address = await this.reverseGeocode(location.lat, location.lng);
            location.address = address;
          } catch (error) {
            console.warn('Could not get address:', error);
          }
          
          resolve(location);
        },
        (error) => {
          reject(new Error(`Location error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  // Reverse geocode coordinates to address using Geoapify
  private async reverseGeocode(lat: number, lng: number): Promise<string> {
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${this.apiKey}`
      );
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        return feature.properties.formatted || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      }
      
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  }

  // Search for places near a location using Geoapify
  async searchNearbyPlaces(
    location: UserLocation,
    radius: number = 5000,
    categories?: string[]
  ): Promise<GeoapifyPlace[]> {
    try {
      // Create bounding box around location (Geoapify uses rect filter)
      const radiusInDegrees = radius / 111320; // Convert meters to degrees (rough approximation)
      const minLat = location.lat - radiusInDegrees;
      const maxLat = location.lat + radiusInDegrees;
      const minLng = location.lng - radiusInDegrees;
      const maxLng = location.lng + radiusInDegrees;
      
      // Build category filter - Geoapify requires either 'type' or 'categories' parameter
      let categoryFilter = '';
      if (categories && categories.length > 0) {
        // Convert our activity types to supported Geoapify categories
        const geoapifyCategories = categories.flatMap(category => {
          return SUPPORTED_CATEGORIES[category as keyof typeof SUPPORTED_CATEGORIES] || [];
        });
        
        if (geoapifyCategories.length > 0) {
          categoryFilter = `&categories=${geoapifyCategories.join(',')}`;
        }
      } else {
        // If no specific categories, use a broad set of supported categories for general places
        const defaultCategories = [
          'catering.restaurant',
          'catering.cafe', 
          'leisure.park',
          'entertainment.museum',
          'sport.fitness',
          'commercial.shopping_mall',
          'entertainment.cinema',
          'tourism.attraction'
        ];
        categoryFilter = `&categories=${defaultCategories.join(',')}`;
      }
      
      const response = await fetch(
        `https://api.geoapify.com/v2/places?` +
        `filter=rect:${minLng},${minLat},${maxLng},${maxLat}` +
        `${categoryFilter}&limit=50&apiKey=${this.apiKey}`
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Geoapify API error:', errorData);
        throw new Error(`API request failed: ${errorData.message || response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.features && Array.isArray(data.features)) {
        // Filter by actual distance and sort by proximity
        const placesWithDistance = data.features.map((place: GeoapifyPlace) => {
          const [lng, lat] = place.geometry.coordinates;
          const distance = this.calculateDistance(location.lat, location.lng, lat, lng);
          return { place, distance };
        }).filter((item: { place: GeoapifyPlace; distance: number }) => item.distance <= radius / 1000) // Filter by radius in km
          .sort((a: { place: GeoapifyPlace; distance: number }, b: { place: GeoapifyPlace; distance: number }) => a.distance - b.distance) // Sort by distance
          .slice(0, 20) // Limit to 20 results
          .map((item: { place: GeoapifyPlace; distance: number }) => item.place);
        
        return placesWithDistance;
      } else {
        console.warn('No places found, using mock data');
        return this.getMockPlaces(location);
      }
    } catch (error) {
      console.error('Geoapify places search failed:', error);
      return this.getMockPlaces(location);
    }
  }

  // Convert Geoapify Places to our activity format
  convertPlacesToActivities(places: GeoapifyPlace[]): LocationBasedActivity[] {
    return places.map((place, index) => {
      const activityType = this.determineActivityType(place.properties.categories);
      const mapping = ACTIVITY_TYPE_MAPPINGS[activityType] || ACTIVITY_TYPE_MAPPINGS.restaurant;
      
      const [lng, lat] = place.geometry.coordinates;
      const placeId = place.properties.place_id || `geoapify-${Math.round(lat * 1000)}-${Math.round(lng * 1000)}-${index}`;
      
      return {
        id: `loc-${placeId}`,
        name: place.properties.name || 'Unnamed Location',
        description: this.generateDescription(place, activityType),
        category: mapping.category,
        duration: mapping.duration,
        mood: mapping.moods,
        icon: mapping.icon,
        location: {
          name: place.properties.name || 'Unnamed Location',
          address: this.formatAddress(place.properties),
          coordinates: { lat, lng },
          rating: undefined, // Geoapify doesn't provide ratings in basic response
          priceLevel: undefined, // Would need place details for this
          isOpen: undefined, // Would need to parse opening_hours
          photoUrl: undefined // Geoapify doesn't provide photos in basic response
        },
        placeId
      };
    });
  }

  // Determine activity type from Geoapify categories
  private determineActivityType(categories: string[]): keyof typeof ACTIVITY_TYPE_MAPPINGS {
    for (const [activityType, mapping] of Object.entries(ACTIVITY_TYPE_MAPPINGS)) {
      if (mapping.categories.some(category => categories.includes(category))) {
        return activityType as keyof typeof ACTIVITY_TYPE_MAPPINGS;
      }
    }
    return 'restaurant'; // default
  }

  // Calculate distance between two coordinates in kilometers
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Format address from Geoapify properties
  private formatAddress(properties: GeoapifyProperties): string {
    if (properties.formatted) {
      return properties.formatted;
    }
    
    const parts = [
      properties.address_line1,
      properties.address_line2,
      properties.city,
      properties.postcode,
      properties.country
    ].filter(Boolean);
    
    return parts.length > 0 ? parts.join(', ') : 'Address not available';
  }

  // Generate description based on place data
  private generateDescription(place: GeoapifyPlace, activityType: string): string {
    let description = '';
    
    // Add categories as description
    if (place.properties.categories && place.properties.categories.length > 0) {
      const readableCategories = place.properties.categories
        .map(cat => cat.split('.').pop()?.replace('_', ' '))
        .filter(Boolean)
        .slice(0, 2); // Take first 2 categories
      
      if (readableCategories.length > 0) {
        description = readableCategories.join(', ');
      }
    }
    
    // Add contact info if available
    if (place.properties.website || place.properties.phone) {
      const contactInfo = [];
      if (place.properties.phone) contactInfo.push('📞');
      if (place.properties.website) contactInfo.push('🌐');
      if (contactInfo.length > 0) {
        description += description ? ` • ${contactInfo.join(' ')}` : contactInfo.join(' ');
      }
    }
    
    // Add opening hours if available
    if (place.properties.opening_hours) {
      // Basic parsing of opening hours - this could be enhanced
      const hasHours = place.properties.opening_hours.toLowerCase().includes('24');
      if (hasHours) {
        description += description ? ' • 24h' : '24h';
      }
    }
    
    if (!description) {
      description = this.getDefaultDescription(activityType);
    }
    
    return description;
  }


  // Default descriptions for activity types
  private getDefaultDescription(activityType: string): string {
    const descriptions: Record<string, string> = {
      restaurant: 'Enjoy a delicious meal at this local restaurant',
      cafe: 'Relax with coffee and treats at this cozy spot',
      park: 'Spend time outdoors in this beautiful park',
      museum: 'Explore culture and history at this museum',
      fitness: 'Stay active with a workout session',
      shopping: 'Browse shops and discover new finds',
      entertainment: 'Enjoy entertainment and activities',
      attraction: 'Experience this popular local attraction'
    };
    
    return descriptions[activityType] || 'Discover this interesting local spot';
  }

  // Mock data for development/demo purposes
  private getMockPlaces(location: UserLocation): GeoapifyPlace[] {
    const mockPlaces: GeoapifyPlace[] = [
      {
        type: 'Feature',
        properties: {
          name: 'Blue Bottle Coffee',
          formatted: '123 Main St, Your City',
          address_line1: '123 Main St',
          city: 'Your City',
          categories: ['catering.cafe'],
          phone: '+1-555-0123',
          website: 'https://bluebottlecoffee.com',
          place_id: 'mock_cafe_1'
        },
        geometry: {
          type: 'Point',
          coordinates: [location.lng + 0.001, location.lat + 0.001]
        }
      },
      {
        type: 'Feature',
        properties: {
          name: 'The Garden Bistro',
          formatted: '456 Oak Ave, Your City',
          address_line1: '456 Oak Ave',
          city: 'Your City',
          categories: ['catering.restaurant'],
          phone: '+1-555-0456',
          place_id: 'mock_restaurant_1'
        },
        geometry: {
          type: 'Point',
          coordinates: [location.lng + 0.003, location.lat - 0.002]
        }
      },
      {
        type: 'Feature',
        properties: {
          name: 'Central Park',
          formatted: '789 Park Rd, Your City',
          address_line1: '789 Park Rd',
          city: 'Your City',
          categories: ['leisure.park'],
          place_id: 'mock_park_1'
        },
        geometry: {
          type: 'Point',
          coordinates: [location.lng - 0.002, location.lat + 0.005]
        }
      },
      {
        type: 'Feature',
        properties: {
          name: 'City Art Museum',
          formatted: '321 Culture St, Your City',
          address_line1: '321 Culture St',
          city: 'Your City',
          categories: ['entertainment.museum'],
          website: 'https://cityartmuseum.org',
          place_id: 'mock_museum_1'
        },
        geometry: {
          type: 'Point',
          coordinates: [location.lng - 0.004, location.lat - 0.003]
        }
      },
      {
        type: 'Feature',
        properties: {
          name: 'Fitness First Gym',
          formatted: '555 Health Ave, Your City',
          address_line1: '555 Health Ave',
          city: 'Your City',
          categories: ['sport.fitness'],
          phone: '+1-555-0789',
          place_id: 'mock_gym_1'
        },
        geometry: {
          type: 'Point',
          coordinates: [location.lng + 0.002, location.lat + 0.003]
        }
      },
      {
        type: 'Feature',
        properties: {
          name: 'Downtown Shopping Center',
          formatted: '100 Commerce Blvd, Your City',
          address_line1: '100 Commerce Blvd',
          city: 'Your City',
          categories: ['commercial.shopping_mall'],
          website: 'https://downtownshopping.com',
          place_id: 'mock_shopping_1'
        },
        geometry: {
          type: 'Point',
          coordinates: [location.lng - 0.001, location.lat + 0.002]
        }
      }
    ];
    
    return mockPlaces;
  }
}

export const locationService = new LocationService();
