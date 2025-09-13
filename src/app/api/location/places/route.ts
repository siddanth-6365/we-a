import { NextRequest, NextResponse } from 'next/server';

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = searchParams.get('radius') || '5000';
    const categories = searchParams.get('categories');

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEOAPIFY_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Geoapify API key not configured' },
        { status: 500 }
      );
    }

    // Create bounding box around location
    const radiusInDegrees = parseInt(radius) / 111320; // Convert meters to degrees
    const minLat = parseFloat(lat) - radiusInDegrees;
    const maxLat = parseFloat(lat) + radiusInDegrees;
    const minLng = parseFloat(lng) - radiusInDegrees;
    const maxLng = parseFloat(lng) + radiusInDegrees;
    
    // Build category filter
    let categoryFilter = '';
    if (categories) {
      const categoryList = categories.split(',');
      const geoapifyCategories = categoryList.flatMap(category => {
        return SUPPORTED_CATEGORIES[category as keyof typeof SUPPORTED_CATEGORIES] || [];
      });
      
      if (geoapifyCategories.length > 0) {
        categoryFilter = `&categories=${geoapifyCategories.join(',')}`;
      }
    } else {
      // Default categories if none specified
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
    
    const geoapifyUrl = `https://api.geoapify.com/v2/places?` +
      `filter=rect:${minLng},${minLat},${maxLng},${maxLat}` +
      `${categoryFilter}&limit=50&apiKey=${apiKey}`;

    const response = await fetch(geoapifyUrl);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Geoapify API error:', errorData);
      return NextResponse.json(
        { error: `API request failed: ${errorData.message || response.statusText}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    if (data.features && Array.isArray(data.features)) {
      // Filter by actual distance and sort by proximity
      const placesWithDistance = data.features.map((place: any) => {
        const [placeLng, placeLat] = place.geometry.coordinates;
        const distance = calculateDistance(parseFloat(lat), parseFloat(lng), placeLat, placeLng);
        return { place, distance };
      }).filter((item: { place: any; distance: number }) => item.distance <= parseInt(radius) / 1000)
        .sort((a: { place: any; distance: number }, b: { place: any; distance: number }) => a.distance - b.distance)
        .slice(0, 20)
        .map((item: { place: any; distance: number }) => item.place);
      
      return NextResponse.json({ places: placesWithDistance });
    } else {
      return NextResponse.json({ places: [] });
    }
  } catch (error) {
    console.error('Location API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Calculate distance between two coordinates in kilometers
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
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
