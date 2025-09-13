import { useState, useMemo } from 'react';
import { Activity, ActivityCategory, Mood } from '@/types';
import { ActivityCard } from './ActivityCard';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Search, Filter, Grid, List } from 'lucide-react';
import { CATEGORY_COLORS } from '@/data/activities';

interface ActivityBrowserProps {
  activities: Activity[];
  scheduledActivityIds: string[];
  onAddActivity: (activity: Activity) => void;
}

const categoryLabels: Record<ActivityCategory, string> = {
  food: 'Food & Dining',
  outdoor: 'Outdoor',
  entertainment: 'Entertainment', 
  wellness: 'Wellness',
  social: 'Social',
  creative: 'Creative',
  learning: 'Learning',
  home: 'Home',
  'Food & Dining': 'Food & Dining',
  'Culture': 'Culture',
  'Fitness': 'Fitness',
  'Shopping': 'Shopping',
  'Adventure': 'Adventure',
  'Outdoor': 'Outdoor'
};

const moodLabels: Record<Mood, string> = {
  energetic: '⚡ Energetic',
  relaxed: '😌 Relaxed',
  happy: '😊 Happy',
  adventurous: '🌟 Adventurous',
  cozy: '🏠 Cozy',
  productive: '✅ Productive',
  social: '👥 Social'
};

export function ActivityBrowser({ 
  activities, 
  scheduledActivityIds, 
  onAddActivity 
}: ActivityBrowserProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<ActivityCategory[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<Mood[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      // Search filter
      const matchesSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (activity.tags && activity.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));

      // Category filter
      const matchesCategory = selectedCategories.length === 0 || 
                             selectedCategories.includes(activity.category);

      // Mood filter
      const matchesMood = selectedMoods.length === 0 || 
                         selectedMoods.some(mood => activity.mood.includes(mood));

      return matchesSearch && matchesCategory && matchesMood;
    });
  }, [activities, searchTerm, selectedCategories, selectedMoods]);

  const categorizedActivities = useMemo(() => {
    const grouped = filteredActivities.reduce((acc, activity) => {
      if (!acc[activity.category]) {
        acc[activity.category] = [];
      }
      acc[activity.category].push(activity);
      return acc;
    }, {} as Record<ActivityCategory, Activity[]>);

    return grouped;
  }, [filteredActivities]);

  const toggleCategory = (category: ActivityCategory) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleMood = (mood: Mood) => {
    setSelectedMoods(prev => 
      prev.includes(mood) 
        ? prev.filter(m => m !== mood)
        : [...prev, mood]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedMoods([]);
    setSearchTerm('');
  };

  const totalFiltersActive = selectedCategories.length + selectedMoods.length + (searchTerm ? 1 : 0);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            Choose Activities
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={totalFiltersActive > 0 ? 'bg-blue-50 border-blue-200' : ''}
            >
              <Filter className="w-4 h-4 mr-1" />
              Filters
              {totalFiltersActive > 0 && (
                <Badge variant="default" className="ml-1 px-1.5 py-0.5 text-xs">
                  {totalFiltersActive}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Filters</h4>
              {totalFiltersActive > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear all
                </Button>
              )}
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(categoryLabels).map(([key, label]) => {
                  const category = key as ActivityCategory;
                  const isSelected = selectedCategories.includes(category);
                  return (
                    <button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className={`
                        px-3 py-1.5 text-sm rounded-full border transition-colors
                        ${isSelected 
                          ? 'border-transparent text-white' 
                          : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                        }
                      `}
                      style={isSelected ? { backgroundColor: CATEGORY_COLORS[category] } : {}}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Moods */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mood
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(moodLabels).map(([key, label]) => {
                  const mood = key as Mood;
                  const isSelected = selectedMoods.includes(mood);
                  return (
                    <Button
                      key={mood}
                      variant={isSelected ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleMood(mood)}
                      className="text-sm"
                    >
                      {label}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 overflow-auto">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No activities found</h3>
            <p className="text-gray-700">Try adjusting your search or filters</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="space-y-6">
            {Object.entries(categorizedActivities).map(([category, categoryActivities]) => (
              <div key={category}>
                <h3 
                  className="text-lg font-semibold mb-3 flex items-center gap-2"
                  style={{ color: CATEGORY_COLORS[category as ActivityCategory] }}
                >
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[category as ActivityCategory] }}
                  />
                  {categoryLabels[category as ActivityCategory]} ({categoryActivities.length})
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {categoryActivities.map(activity => (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                      onAdd={onAddActivity}
                      isScheduled={scheduledActivityIds.includes(activity.id)}
                      showAddButton={true}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredActivities.map(activity => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onAdd={onAddActivity}
                isScheduled={scheduledActivityIds.includes(activity.id)}
                showAddButton={true}
                compact={true}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
