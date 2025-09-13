import { Activity, Mood } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDuration } from '@/lib/utils';
import { Plus, Clock, Sparkles } from 'lucide-react';

interface ActivityCardProps {
  activity: Activity;
  onAdd?: (activity: Activity) => void;
  onRemove?: () => void;
  isSelected?: boolean;
  isScheduled?: boolean;
  showAddButton?: boolean;
  compact?: boolean;
}

const moodEmojis: Record<Mood, string> = {
  energetic: '⚡',
  relaxed: '😌',
  happy: '😊',
  adventurous: '🌟',
  cozy: '🏠',
  productive: '✅',
  social: '👥'
};

const moodColors: Record<Mood, string> = {
  energetic: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  relaxed: 'bg-blue-100 text-blue-800 border-blue-200',
  happy: 'bg-pink-100 text-pink-800 border-pink-200',
  adventurous: 'bg-purple-100 text-purple-800 border-purple-200',
  cozy: 'bg-orange-100 text-orange-800 border-orange-200',
  productive: 'bg-green-100 text-green-800 border-green-200',
  social: 'bg-indigo-100 text-indigo-800 border-indigo-200'
};

export function ActivityCard({
  activity,
  onAdd,
  onRemove,
  isSelected = false,
  isScheduled = false,
  showAddButton = true,
  compact = false
}: ActivityCardProps) {
  const handleAdd = () => {
    onAdd?.(activity);
  };

  return (
    <Card 
      className={`
        relative transition-all duration-200 hover:scale-[1.02] cursor-pointer
        ${isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''}
        ${isScheduled ? 'opacity-75 bg-gray-50' : ''}
        ${compact ? 'p-3' : ''}
      `}
      style={{ borderLeftColor: activity.color, borderLeftWidth: '4px' }}
    >
      <CardHeader className={compact ? 'p-3 pb-2' : 'pb-3'}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl" role="img" aria-label={activity.name}>
              {activity.icon}
            </span>
            <div>
              <CardTitle className={`${compact ? 'text-base' : 'text-lg'} leading-tight`}>
                {activity.name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-3 h-3 text-gray-600" />
                <span className="text-xs text-gray-600">
                  {formatDuration(activity.duration)}
                </span>
                {activity.isFlexible && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                    Flexible
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {showAddButton && !isScheduled && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleAdd}
              className="shrink-0"
              aria-label={`Add ${activity.name} to schedule`}
            >
              <Plus className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      {!compact && (
        <CardContent className="pt-0">
          <p className="text-sm text-gray-600 mb-3 leading-relaxed">
            {activity.description}
          </p>
          
          <div className="space-y-2">
            {/* Mood badges */}
            <div className="flex flex-wrap gap-1">
              {activity.mood.map((mood) => (
                <Badge
                  key={mood}
                  className={`text-xs px-2 py-1 ${moodColors[mood]}`}
                >
                  <span className="mr-1" role="img" aria-label={mood}>
                    {moodEmojis[mood]}
                  </span>
                  {mood}
                </Badge>
              ))}
            </div>
            
            {/* Tags */}
            {activity.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {activity.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {activity.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{activity.tags.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </div>

          {isScheduled && (
            <div className="mt-3 flex items-center gap-2 text-green-600">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Added to schedule!</span>
            </div>
          )}
        </CardContent>
      )}

      {onRemove && (
        <Button
          size="sm"
          variant="destructive"
          onClick={onRemove}
          className="absolute top-2 right-2 w-6 h-6 p-0"
          aria-label={`Remove ${activity.name} from schedule`}
        >
          ×
        </Button>
      )}
    </Card>
  );
}
