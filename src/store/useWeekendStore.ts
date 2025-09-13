import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Activity, ScheduledActivity, WeekendPlan, WeekendTheme } from '@/types';
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

        const updateDay = (activities: ScheduledActivity[]) =>
          activities.map(activity =>
            activity.id === scheduledActivityId
              ? { ...activity, ...updates }
              : activity
          );

        const updatedPlan = {
          ...currentPlan,
          saturday: updateDay(currentPlan.saturday),
          sunday: updateDay(currentPlan.sunday),
          updatedAt: new Date()
        };

        set({ currentPlan: updatedPlan });
      },

      reorderActivities: (day, newOrder) => {
        const { currentPlan } = get();
        if (!currentPlan) return;

        const updatedPlan = {
          ...currentPlan,
          [day]: newOrder,
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
        return allScheduled.reduce((total, scheduled) => {
          const activity = activities.find(a => a.id === scheduled.activityId);
          return total + (activity?.duration || 0);
        }, 0);
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
