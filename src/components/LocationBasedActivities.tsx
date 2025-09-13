import { useState, useEffect } from 'react';
import { MapPin, Navigation, Search, Star, DollarSign, Clock, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';
import { locationService, LocationBasedActivity, UserLocation } from '@/lib/locationService';
import { Activity } from '@/types';

interface LocationBasedActivitiesProps {
  onAddActivity: (activity: Activity) => void;
  scheduledActivityIds: string[];
}

export function LocationBasedActivities({ onAddActivity, scheduledActivityIds }: LocationBasedActivitiesProps) {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [activities, setActivities] = useState<LocationBasedActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchRadius, setSearchRadius] = useState(5000); // 5km default
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showDurationModal, setShowDurationModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<LocationBasedActivity | null>(null);
  const [customDuration, setCustomDuration] = useState(120); // Default 2 hours

  const categories = [
    { key: 'restaurant', label: 'Restaurants', icon: '🍽️' },
    { key: 'cafe', label: 'Cafes', icon: '☕' },
    { key: 'park', label: 'Parks', icon: '🌳' },
    { key: 'museum', label: 'Museums', icon: '🏛️' },
    { key: 'fitness', label: 'Fitness', icon: '💪' },
    { key: 'shopping', label: 'Shopping', icon: '🛍️' },
    { key: 'entertainment', label: 'Entertainment', icon: '🎬' },
    { key: 'attraction', label: 'Attractions', icon: '🎢' }
  ];

  // Get user location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Search for activities when location or filters change
  useEffect(() => {
    if (userLocation) {
      searchNearbyActivities();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation, searchRadius, selectedCategories]);

  const getCurrentLocation = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const location = await locationService.getCurrentLocation();
      setUserLocation(location);
    } catch (err) {
      console.error('Location error:', err);
      setError(err instanceof Error ? err.message : 'Could not get your location');
      // Provide a default location for demo purposes
      setUserLocation({
        lat: 37.7749, // San Francisco
        lng: -122.4194,
        address: 'San Francisco, CA (Demo Location)'
      });
    } finally {
      setLoading(false);
    }
  };

  const searchNearbyActivities = async () => {
    if (!userLocation) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const categories = selectedCategories.length > 0 ? selectedCategories : undefined;
      const places = await locationService.searchNearbyPlaces(userLocation, searchRadius, categories);
      const locationActivities = locationService.convertPlacesToActivities(places);
      setActivities(locationActivities);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search for nearby activities');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryToggle = (categoryKey: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryKey)
        ? prev.filter(c => c !== categoryKey)
        : [...prev, categoryKey]
    );
  };

  const convertToActivity = (locationActivity: LocationBasedActivity, duration?: number): Activity => {
    return {
      id: locationActivity.id,
      name: locationActivity.name,
      description: locationActivity.description,
      category: locationActivity.category as Activity['category'],
      duration: duration || locationActivity.duration,
      mood: locationActivity.mood as Activity['mood'],
      icon: locationActivity.icon,
      isLocationBased: true,
      locationData: locationActivity.location
    };
  };

  const handleAddClick = (activity: LocationBasedActivity) => {
    setSelectedActivity(activity);
    setCustomDuration(activity.duration);
    setShowDurationModal(true);
  };

  const handleConfirmAdd = () => {
    if (selectedActivity) {
      onAddActivity(convertToActivity(selectedActivity, customDuration));
      setShowDurationModal(false);
      setSelectedActivity(null);
    }
  };

  const getPriceDisplay = (priceLevel?: number) => {
    if (priceLevel === undefined) return null;
    return '$'.repeat(priceLevel + 1);
  };

  const getDistanceDisplay = (activityLat: number, activityLng: number) => {
    if (!userLocation) return null;
    
    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      activityLat,
      activityLng
    );
    
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    } else {
      return `${distance.toFixed(1)}km`;
    }
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-green-600" />
          Discover Nearby Activities
        </CardTitle>
        <p className="text-sm text-gray-700">
          Find real places and activities near your location
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Location Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-blue-600" />
            <div>
              <div className="font-medium text-sm">Your Location</div>
              <div className="text-xs text-gray-600">
                {userLocation?.address || 'Getting location...'}
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={getCurrentLocation}
            disabled={loading}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Search Controls */}
        <div className="space-y-4">
          {/* Search Radius */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Radius: {searchRadius / 1000}km
            </label>
            <input
              type="range"
              min="1000"
              max="10000"
              step="1000"
              value={searchRadius}
              onChange={(e) => setSearchRadius(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1km</span>
              <span>10km</span>
            </div>
          </div>

          {/* Category Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categories (leave empty for all)
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => handleCategoryToggle(category.key)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedCategories.includes(category.key)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.icon} {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Button */}
          <Button
            onClick={searchNearbyActivities}
            disabled={loading || !userLocation}
            className="w-full flex items-center gap-2"
          >
            <Search className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Searching...' : 'Search Nearby Activities'}
          </Button>
        </div>

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Activities List */}
        <div className="space-y-3">
          {activities.length > 0 && (
            <h4 className="font-medium text-gray-900">
              Found {activities.length} activities nearby
            </h4>
          )}
          
          {activities.map((activity) => {
            const isScheduled = scheduledActivityIds.includes(activity.id);
            const distance = getDistanceDisplay(
              activity.location.coordinates.lat,
              activity.location.coordinates.lng
            );
            
            return (
              <div
                key={activity.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{activity.icon}</span>
                      <h5 className="font-semibold text-gray-900">{activity.name}</h5>
                      {distance && (
                      <Badge variant="secondary" className="text-xs">
                        {distance}
                      </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{activity.duration}m</span>
                      </div>
                      
                      {activity.location.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{activity.location.rating}</span>
                        </div>
                      )}
                      
                      {activity.location.priceLevel !== undefined && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          <span>{getPriceDisplay(activity.location.priceLevel)}</span>
                        </div>
                      )}
                      
                      {activity.location.isOpen !== undefined && (
                        <span className={activity.location.isOpen ? 'text-green-600' : 'text-red-600'}>
                          {activity.location.isOpen ? 'Open' : 'Closed'}
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-500">
                      📍 {activity.location.address}
                    </div>
                  </div>
                  
                  <Button
                    variant={isScheduled ? "secondary" : "default"}
                    size="sm"
                    onClick={() => handleAddClick(activity)}
                    disabled={isScheduled}
                    className="flex-shrink-0"
                  >
                    {isScheduled ? 'Added' : 'Add'}
                  </Button>
                </div>
              </div>
            );
          })}
          
          {!loading && activities.length === 0 && userLocation && (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>No activities found in this area.</p>
              <p className="text-sm">Try expanding your search radius or changing categories.</p>
            </div>
          )}
        </div>
      </CardContent>

      {/* Duration Modal */}
      {showDurationModal && selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDurationModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Set Duration for {selectedActivity.name}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How long will you spend here? (minutes)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    min="15"
                    max="480"
                    step="15"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(parseInt(e.target.value) || 60)}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="text-sm text-gray-600">
                    ({Math.floor(customDuration / 60)}h {customDuration % 60}m)
                  </span>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowDurationModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmAdd}
                  className="flex-1"
                >
                  Add to Schedule
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
