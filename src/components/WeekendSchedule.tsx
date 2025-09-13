import { ScheduledActivity, Activity, DayTimeBounds } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { DraggableSchedule } from './DraggableSchedule';
import { DayTimeSettings } from './DayTimeSettings';
import { formatDuration } from '@/lib/utils';
import { Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WeekendScheduleProps {
  saturdayActivities: ScheduledActivity[];
  sundayActivities: ScheduledActivity[];
  activities: Activity[];
  timeBounds: {
    saturday: DayTimeBounds;
    sunday: DayTimeBounds;
  };
  onRemoveActivity: (scheduledActivityId: string) => void;
  onUpdateActivity: (scheduledActivityId: string, updates: Partial<ScheduledActivity>) => void;
  onReorderActivities: (day: 'saturday' | 'sunday', newOrder: ScheduledActivity[]) => void;
  onAddActivity: (day: 'saturday' | 'sunday') => void;
  onClearDay: (day: 'saturday' | 'sunday') => void;
  onUpdateTimeBounds: (day: 'saturday' | 'sunday', timeBounds: DayTimeBounds) => void;
}


interface DayScheduleProps {
  day: 'saturday' | 'sunday';
  activities: ScheduledActivity[];
  allActivities: Activity[];
  onRemoveActivity: (id: string) => void;
  onUpdateActivity: (id: string, updates: Partial<ScheduledActivity>) => void;
  onReorderActivities: (newOrder: ScheduledActivity[]) => void;
  onAddActivity: () => void;
  onClearDay: () => void;
}

function DaySchedule({ 
  day, 
  activities, 
  allActivities, 
  onRemoveActivity, 
  onUpdateActivity, 
  onReorderActivities,
  onAddActivity,
  onClearDay
}: DayScheduleProps) {
  const sortedActivities = [...activities].sort(
    (a, b) => a.startTime.getTime() - b.startTime.getTime()
  );

  const totalDuration = sortedActivities.reduce((total, scheduled) => {
    const activity = allActivities.find(a => a.id === scheduled.activityId);
    return total + (scheduled.customDuration || activity?.duration || 0);
  }, 0);

  const dayName = day === 'saturday' ? 'Saturday' : 'Sunday';
  const dayEmoji = day === 'saturday' ? '🌅' : '🌇';

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">{dayEmoji}</span>
            {dayName}
            {sortedActivities.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {sortedActivities.length} activities
              </Badge>
            )}
          </CardTitle>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm text-gray-700">
                Total: {formatDuration(totalDuration)}
              </div>
            </div>
            
            {sortedActivities.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearDay}
                className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto">
        <AnimatePresence mode="popLayout">
          {sortedActivities.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 text-gray-600"
            >
              <div className="text-4xl mb-3">🗓️</div>
              <h3 className="text-lg font-medium mb-1">No activities planned</h3>
              <p className="text-sm text-center mb-4">
                Add some activities to create your perfect {dayName.toLowerCase()}!
              </p>
              <Button onClick={onAddActivity} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Activity
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-3">
              <DraggableSchedule
                activities={sortedActivities}
                allActivities={allActivities}
                onReorder={onReorderActivities}
                onRemoveActivity={onRemoveActivity}
                onUpdateActivity={onUpdateActivity}
              />
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="pt-2"
              >
                <Button
                  variant="outline"
                  onClick={onAddActivity}
                  className="w-full flex items-center gap-2 border-dashed"
                >
                  <Plus className="w-4 h-4" />
                  Add Another Activity
                </Button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

export function WeekendSchedule({
  saturdayActivities,
  sundayActivities,
  activities,
  timeBounds,
  onRemoveActivity,
  onUpdateActivity,
  onReorderActivities,
  onAddActivity,
  onClearDay,
  onUpdateTimeBounds
}: WeekendScheduleProps) {
  return (
    <div className="space-y-2">
      {/* Time Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DayTimeSettings
          day="saturday"
          timeBounds={timeBounds.saturday}
          onUpdate={(bounds) => onUpdateTimeBounds('saturday', bounds)}
        />
        <DayTimeSettings
          day="sunday"
          timeBounds={timeBounds.sunday}
          onUpdate={(bounds) => onUpdateTimeBounds('sunday', bounds)}
        />
      </div>

      {/* Schedule Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[600px]">
        <DaySchedule
          day="saturday"
          activities={saturdayActivities}
          allActivities={activities}
          onRemoveActivity={onRemoveActivity}
          onUpdateActivity={onUpdateActivity}
          onReorderActivities={(newOrder) => onReorderActivities('saturday', newOrder)}
          onAddActivity={() => onAddActivity('saturday')}
          onClearDay={() => onClearDay('saturday')}
        />
        
        <DaySchedule
          day="sunday"
          activities={sundayActivities}
          allActivities={activities}
          onRemoveActivity={onRemoveActivity}
          onUpdateActivity={onUpdateActivity}
          onReorderActivities={(newOrder) => onReorderActivities('sunday', newOrder)}
          onAddActivity={() => onAddActivity('sunday')}
          onClearDay={() => onClearDay('sunday')}
        />
      </div>
    </div>
  );
}
