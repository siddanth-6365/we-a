import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

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

    const geoapifyUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${apiKey}`;
    
    const response = await fetch(geoapifyUrl);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Geoapify reverse geocoding error:', errorData);
      return NextResponse.json(
        { error: `Reverse geocoding failed: ${errorData.message || response.statusText}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      const address = feature.properties.formatted || `${lat}, ${lng}`;
      return NextResponse.json({ address });
    }
    
    return NextResponse.json({ address: `${lat}, ${lng}` });
  } catch (error) {
    console.error('Reverse geocoding API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
