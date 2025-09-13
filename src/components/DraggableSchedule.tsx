import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ScheduledActivity, Activity } from '@/types';
import { Card, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { formatTime, formatDuration } from '@/lib/utils';
import { Clock, Trash2, Edit3, GripVertical } from 'lucide-react';

interface DraggableScheduleItemProps {
  scheduledActivity: ScheduledActivity;
  activity: Activity;
  onRemove: () => void;
  onUpdate: (updates: Partial<ScheduledActivity>) => void;
  isDragging?: boolean;
}

function DraggableScheduleItem({ 
  scheduledActivity, 
  activity, 
  onRemove, 
  onUpdate,
  isDragging = false
}: DraggableScheduleItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(scheduledActivity.notes || '');

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: scheduledActivity.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  const handleSaveNotes = () => {
    onUpdate({ notes });
    setIsEditing(false);
  };

  const duration = scheduledActivity.customDuration || activity.duration;
  const endTime = new Date(scheduledActivity.startTime.getTime() + duration * 60000);

  return (
    <div ref={setNodeRef} style={style} className="group">
      <Card className={`relative hover:shadow-md transition-all ${isDragging ? 'shadow-lg' : ''}`}>
        <div 
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
          style={{ backgroundColor: activity.color }}
        />
        
        <CardContent className="p-4 pl-6">
          <div className="flex items-start gap-3">
            {/* Drag Handle */}
            <button
              className="opacity-0 group-hover:opacity-100 transition-opacity mt-1 cursor-grab active:cursor-grabbing"
              {...attributes}
              {...listeners}
              aria-label="Drag to reorder"
            >
              <GripVertical className="w-4 h-4 text-gray-400" />
            </button>

            <span className="text-2xl mt-1" role="img" aria-label={activity.name}>
              {activity.icon}
            </span>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 truncate">
                {activity.name}
              </h4>
              
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-700">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>
                    {formatTime(scheduledActivity.startTime)} - {formatTime(endTime)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span>{formatDuration(duration)}</span>
                </div>
              </div>

              {activity.mood.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {activity.mood.slice(0, 2).map(mood => (
                    <Badge key={mood} variant="secondary" className="text-xs">
                      {mood}
                    </Badge>
                  ))}
                  {activity.mood.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{activity.mood.length - 2}
                    </Badge>
                  )}
                </div>
              )}

              {/* Notes section */}
              {isEditing ? (
                <div className="mt-3 space-y-2">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes for this activity..."
                    className="w-full text-sm border border-gray-300 rounded-md px-2 py-1 resize-none"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveNotes}>
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {scheduledActivity.notes && (
                    <p className="mt-2 text-sm text-gray-700 italic">
                      &ldquo;{scheduledActivity.notes}&rdquo;
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(!isEditing)}
                className="w-8 h-8 p-0"
                title="Edit notes"
              >
                <Edit3 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onRemove}
                className="w-8 h-8 p-0 hover:bg-red-50 hover:text-red-600"
                title="Remove activity"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface DraggableScheduleProps {
  activities: ScheduledActivity[];
  allActivities: Activity[];
  onReorder: (newOrder: ScheduledActivity[]) => void;
  onRemoveActivity: (id: string) => void;
  onUpdateActivity: (id: string, updates: Partial<ScheduledActivity>) => void;
}

export function DraggableSchedule({
  activities,
  allActivities,
  onReorder,
  onRemoveActivity,
  onUpdateActivity
}: DraggableScheduleProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const sortedActivities = [...activities].sort(
    (a, b) => a.startTime.getTime() - b.startTime.getTime()
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = sortedActivities.findIndex(item => item.id === active.id);
      const newIndex = sortedActivities.findIndex(item => item.id === over?.id);
      
      const newOrder = arrayMove(sortedActivities, oldIndex, newIndex);
      
      // Update start times based on new order
      const updatedOrder = newOrder.map((activity, index) => {
        const activityData = allActivities.find(a => a.id === activity.activityId);
        const duration = activity.customDuration || activityData?.duration || 60;
        
        let newStartTime: Date;
        if (index === 0) {
          // First activity starts at original time or 9 AM
          newStartTime = new Date(activity.startTime);
        } else {
          // Subsequent activities start after the previous one ends
          const prevActivity = newOrder[index - 1];
          const prevActivityData = allActivities.find(a => a.id === prevActivity.activityId);
          const prevDuration = prevActivity.customDuration || prevActivityData?.duration || 60;
          newStartTime = new Date(prevActivity.startTime.getTime() + prevDuration * 60000);
        }
        
        const newEndTime = new Date(newStartTime.getTime() + duration * 60000);
        
        return {
          ...activity,
          startTime: newStartTime,
          endTime: newEndTime
        };
      });
      
      onReorder(updatedOrder);
    }

    setActiveId(null);
  }

  const activeActivity = activeId ? sortedActivities.find(item => item.id === activeId) : null;
  const activeActivityData = activeActivity ? allActivities.find(a => a.id === activeActivity.activityId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={sortedActivities.map(a => a.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {sortedActivities.map((scheduledActivity) => {
            // First try to get activity data from the scheduled activity itself (for location-based activities)
            let activityData = scheduledActivity.activityData;
            
            // If not available, try to find it in the main activities array
            if (!activityData) {
              activityData = allActivities.find(a => a.id === scheduledActivity.activityId);
            }
            
            // If still not found, create a fallback activity object
            if (!activityData) {
              console.log('Activity not found, creating fallback for:', scheduledActivity.activityId);
              activityData = {
                id: scheduledActivity.activityId,
                name: scheduledActivity.activityId.startsWith('loc-') ? 'Location Activity' : 'Unknown Activity',
                description: 'Location-based activity',
                category: 'outdoor' as Activity['category'],
                duration: 60,
                icon: '📍',
                mood: ['happy'] as Activity['mood'],
                isFlexible: true,
                tags: ['location-based'],
                color: '#3B82F6'
              };
            }

            return (
              <DraggableScheduleItem
                key={scheduledActivity.id}
                scheduledActivity={scheduledActivity}
                activity={activityData}
                onRemove={() => onRemoveActivity(scheduledActivity.id)}
                onUpdate={(updates) => onUpdateActivity(scheduledActivity.id, updates)}
              />
            );
          })}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeActivity && activeActivityData ? (
          <DraggableScheduleItem
            scheduledActivity={activeActivity}
            activity={activeActivityData}
            onRemove={() => {}}
            onUpdate={() => {}}
            isDragging={true}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
