import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Activity, ScheduledActivity, WeekendPlan, WeekendTheme, DayTimeBounds } from '@/types';
import { ACTIVITIES } from '@/data/activities';
import { generateId } from '@/lib/utils';

interface WeekendStore {
  // Current state
  activities: Activity[];
  currentPlan: WeekendPlan | null;
  savedPlans: WeekendPlan[];
  selectedTheme: WeekendTheme | null;
  
  // Actions
  createNewPlan: (name?: string, theme?: WeekendTheme) => void;
  addActivityToSchedule: (activity: Activity, day: 'saturday' | 'sunday', startTime: Date) => void;
  removeActivityFromSchedule: (scheduledActivityId: string) => void;
  updateScheduledActivity: (scheduledActivityId: string, updates: Partial<ScheduledActivity>) => void;
  reorderActivities: (day: 'saturday' | 'sunday', newOrder: ScheduledActivity[]) => void;
  savePlan: () => void;
  loadPlan: (planId: string) => void;
  deletePlan: (planId: string) => void;
  setTheme: (theme: WeekendTheme | null) => void;
  clearCurrentPlan: () => void;
  updateTimeBounds: (day: 'saturday' | 'sunday', timeBounds: DayTimeBounds) => void;
  
  // Computed getters
  getSaturdayActivities: () => ScheduledActivity[];
  getSundayActivities: () => ScheduledActivity[];
  getTotalPlanDuration: () => number;
  getAvailableTimeSlots: (day: 'saturday' | 'sunday') => { start: Date; end: Date }[];
}

const createDefaultPlan = (name: string = 'My Weekend Plan', theme?: WeekendTheme): WeekendPlan => {
  const now = new Date();
  return {
    id: generateId(),
    name,
    theme,
    saturday: [],
    sunday: [],
    timeBounds: {
      saturday: { startHour: 8, endHour: 21 }, // 8am to 9pm
      sunday: { startHour: 8, endHour: 21 }    // 8am to 9pm
    },
    createdAt: now,
    updatedAt: now
  };
};

export const useWeekendStore = create<WeekendStore>()(
  persist(
    (set, get) => ({
      activities: ACTIVITIES,
      currentPlan: null,
      savedPlans: [],
      selectedTheme: null,

      createNewPlan: (name, theme) => {
        const newPlan = createDefaultPlan(name, theme);
        set({ 
          currentPlan: newPlan,
          selectedTheme: theme || null
        });
      },

      addActivityToSchedule: (activity, day, startTime) => {
        const { currentPlan } = get();
        if (!currentPlan) return;

        const endTime = new Date(startTime.getTime() + activity.duration * 60000);
        
        const scheduledActivity: ScheduledActivity = {
          id: generateId(),
          activityId: activity.id,
          startTime,
          endTime,
          day,
          // Store the full activity data for location-based activities
          activityData: activity.isLocationBased ? activity : undefined
        };

        const updatedPlan = {
          ...currentPlan,
          [day]: [...currentPlan[day], scheduledActivity].sort(
            (a, b) => a.startTime.getTime() - b.startTime.getTime()
          ),
          updatedAt: new Date()
        };

        set({ currentPlan: updatedPlan });
      },

      removeActivityFromSchedule: (scheduledActivityId) => {
        const { currentPlan } = get();
        if (!currentPlan) return;

        const updatedPlan = {
          ...currentPlan,
          saturday: currentPlan.saturday.filter(a => a.id !== scheduledActivityId),
          sunday: currentPlan.sunday.filter(a => a.id !== scheduledActivityId),
          updatedAt: new Date()
        };

        set({ currentPlan: updatedPlan });
      },

      updateScheduledActivity: (scheduledActivityId, updates) => {
        const { currentPlan } = get();
        if (!currentPlan) return;

        // Find which day contains this activity
        let targetDay: 'saturday' | 'sunday' | null = null;
        let dayActivities: ScheduledActivity[] = [];
        
        if (currentPlan.saturday.some(a => a.id === scheduledActivityId)) {
          targetDay = 'saturday';
          dayActivities = currentPlan.saturday;
        } else if (currentPlan.sunday.some(a => a.id === scheduledActivityId)) {
          targetDay = 'sunday';
          dayActivities = currentPlan.sunday;
        }

        if (!targetDay) return;

        // Update the specific activity
        let updatedDayActivities = dayActivities.map(activity =>
          activity.id === scheduledActivityId
            ? { ...activity, ...updates }
            : activity
        );

        // If duration or start time changed, auto-adjust subsequent activities
        if (updates.customDuration !== undefined || updates.startTime) {
          const sortedActivities = [...updatedDayActivities].sort(
            (a, b) => a.startTime.getTime() - b.startTime.getTime()
          );
          
          const updatedActivityIndex = sortedActivities.findIndex(a => a.id === scheduledActivityId);
          const updatedActivity = sortedActivities[updatedActivityIndex];
          
          if (updatedActivity) {
            const newEndTime = new Date(updatedActivity.startTime.getTime() + (updates.customDuration || updatedActivity.customDuration || 60) * 60000);
            
            // Adjust all subsequent activities
            for (let i = updatedActivityIndex + 1; i < sortedActivities.length; i++) {
              const currentActivity = sortedActivities[i];
              const newStartTime = new Date(newEndTime.getTime());
              
              // Check if this would push the activity beyond day bounds
              const dayEnd = new Date(newStartTime);
              dayEnd.setHours(currentPlan.timeBounds[targetDay].endHour, 0, 0, 0);
              
              if (newStartTime.getTime() >= dayEnd.getTime()) {
                // Remove activities that would go beyond day bounds
                sortedActivities.splice(i);
                break;
              }
              
              const activityDuration = currentActivity.customDuration || 60;
              const newEndTimeForThis = new Date(newStartTime.getTime() + activityDuration * 60000);
              
              if (newEndTimeForThis.getTime() > dayEnd.getTime()) {
                // Remove this activity if it would go beyond day bounds
                sortedActivities.splice(i, 1);
                i--; // Adjust index since we removed an item
                continue;
              }
              
              currentActivity.startTime = newStartTime;
              currentActivity.endTime = newEndTimeForThis;
              newEndTime.setTime(newEndTimeForThis.getTime());
            }
            
            // Update the day activities with the sorted and adjusted activities
            updatedDayActivities = sortedActivities;
          }
        }

        const updatedPlan = {
          ...currentPlan,
          [targetDay]: updatedDayActivities,
          updatedAt: new Date()
        };

        set({ currentPlan: updatedPlan });
      },

      reorderActivities: (day, newOrder) => {
        const { currentPlan } = get();
        if (!currentPlan) return;

        // Recalculate start and end times based on new order
        const recalculatedOrder = [...newOrder];
        const timeBounds = currentPlan.timeBounds[day];
        const dayStart = new Date();
        dayStart.setDate(dayStart.getDate() + (day === 'saturday' ? (6 - dayStart.getDay()) : (7 - dayStart.getDay())));
        dayStart.setHours(timeBounds.startHour, 0, 0, 0);

        let currentTime = new Date(dayStart);

        for (let i = 0; i < recalculatedOrder.length; i++) {
          const activity = recalculatedOrder[i];
          
          // Get the duration from the activity's customDuration or calculate from existing times
          let duration;
          if (activity.customDuration) {
            duration = activity.customDuration;
          } else {
            // Calculate duration from existing start and end times
            duration = (activity.endTime.getTime() - activity.startTime.getTime()) / 60000;
          }
          
          // Set new start time
          activity.startTime = new Date(currentTime);
          
          // Calculate new end time
          activity.endTime = new Date(currentTime.getTime() + duration * 60000);
          
          // Move current time to the end of this activity
          currentTime = new Date(activity.endTime);
        }

        const updatedPlan = {
          ...currentPlan,
          [day]: recalculatedOrder,
          updatedAt: new Date()
        };

        set({ currentPlan: updatedPlan });
      },

      savePlan: () => {
        const { currentPlan, savedPlans } = get();
        if (!currentPlan) return;

        const existingPlanIndex = savedPlans.findIndex(p => p.id === currentPlan.id);
        
        if (existingPlanIndex >= 0) {
          const updatedPlans = [...savedPlans];
          updatedPlans[existingPlanIndex] = { ...currentPlan, updatedAt: new Date() };
          set({ savedPlans: updatedPlans });
        } else {
          set({ savedPlans: [...savedPlans, { ...currentPlan, updatedAt: new Date() }] });
        }
      },

      loadPlan: (planId) => {
        const { savedPlans } = get();
        const plan = savedPlans.find(p => p.id === planId);
        if (plan) {
          set({ 
            currentPlan: plan,
            selectedTheme: plan.theme || null
          });
        }
      },

      deletePlan: (planId) => {
        const { savedPlans, currentPlan } = get();
        const updatedPlans = savedPlans.filter(p => p.id !== planId);
        
        set({ 
          savedPlans: updatedPlans,
          currentPlan: currentPlan?.id === planId ? null : currentPlan
        });
      },

      setTheme: (theme) => {
        const { currentPlan } = get();
        set({ 
          selectedTheme: theme,
          currentPlan: currentPlan ? { ...currentPlan, theme: theme || undefined, updatedAt: new Date() } : currentPlan
        });
      },

      clearCurrentPlan: () => {
        set({ currentPlan: null, selectedTheme: null });
      },

      // Computed getters
      getSaturdayActivities: () => {
        const { currentPlan } = get();
        return currentPlan?.saturday || [];
      },

      getSundayActivities: () => {
        const { currentPlan } = get();
        return currentPlan?.sunday || [];
      },

      getTotalPlanDuration: () => {
        const { currentPlan, activities } = get();
        if (!currentPlan) return 0;

        const allScheduled = [...currentPlan.saturday, ...currentPlan.sunday];
        
        const total = allScheduled.reduce((total, scheduled) => {
          // First try to get duration from activityData (for location-based activities)
          if (scheduled.activityData) {
            const duration = scheduled.customDuration || scheduled.activityData.duration || 0;
            return total + duration;
          }
          
          // Fallback to main activities array
          const activity = activities.find(a => a.id === scheduled.activityId);
          const duration = scheduled.customDuration || activity?.duration || 0;
          return total + duration;
        }, 0);
        
        return total;
      },

      getAvailableTimeSlots: (day) => {
        const { currentPlan } = get();
        if (!currentPlan) return [];

        const dayActivities = currentPlan[day].sort(
          (a, b) => a.startTime.getTime() - b.startTime.getTime()
        );

        const slots: { start: Date; end: Date }[] = [];
        const dayStart = new Date();
        dayStart.setHours(6, 0, 0, 0); // Start at 6 AM
        const dayEnd = new Date();
        dayEnd.setHours(23, 59, 59, 999); // End at 11:59 PM

        if (dayActivities.length === 0) {
          return [{ start: dayStart, end: dayEnd }];
        }

        // Add slot before first activity
        if (dayActivities[0].startTime > dayStart) {
          slots.push({ start: dayStart, end: dayActivities[0].startTime });
        }

        // Add slots between activities
        for (let i = 0; i < dayActivities.length - 1; i++) {
          const currentEnd = dayActivities[i].endTime;
          const nextStart = dayActivities[i + 1].startTime;
          
          if (nextStart > currentEnd) {
            slots.push({ start: currentEnd, end: nextStart });
          }
        }

        // Add slot after last activity
        const lastActivity = dayActivities[dayActivities.length - 1];
        if (lastActivity.endTime < dayEnd) {
          slots.push({ start: lastActivity.endTime, end: dayEnd });
        }

        return slots;
      },

      updateTimeBounds: (day, timeBounds) => {
        const { currentPlan } = get();
        if (!currentPlan) return;

        const updatedPlan = {
          ...currentPlan,
          timeBounds: {
            ...currentPlan.timeBounds,
            [day]: timeBounds
          },
          updatedAt: new Date()
        };

        set({ currentPlan: updatedPlan });
      }
    }),
    {
      name: 'weekendly-storage',
      partialize: (state) => ({
        currentPlan: state.currentPlan,
        savedPlans: state.savedPlans,
        selectedTheme: state.selectedTheme
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.currentPlan) {
          // Convert string dates back to Date objects
          state.currentPlan.saturday = state.currentPlan.saturday.map(activity => ({
            ...activity,
            startTime: new Date(activity.startTime),
            endTime: new Date(activity.endTime)
          }));
          state.currentPlan.sunday = state.currentPlan.sunday.map(activity => ({
            ...activity,
            startTime: new Date(activity.startTime),
            endTime: new Date(activity.endTime)
          }));
        }
        
        if (state?.savedPlans) {
          state.savedPlans = state.savedPlans.map(plan => ({
            ...plan,
            saturday: plan.saturday.map(activity => ({
              ...activity,
              startTime: new Date(activity.startTime),
              endTime: new Date(activity.endTime)
            })),
            sunday: plan.sunday.map(activity => ({
              ...activity,
              startTime: new Date(activity.startTime),
              endTime: new Date(activity.endTime)
            }))
          }));
        }
      }
    }
  )
);
