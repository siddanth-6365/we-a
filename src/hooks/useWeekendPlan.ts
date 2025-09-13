'use client';

import { useState, useEffect, useCallback } from 'react';
import { Activity, WeekendTemplate } from '@/types';
import { useWeekendStore } from '@/store/useWeekendStore';
import { findNextAvailableSlot, checkDayCapacity } from '@/lib/utils';

export function useWeekendPlan() {
  const [targetDay, setTargetDay] = useState<'saturday' | 'sunday'>('saturday');
  const [showWelcome, setShowWelcome] = useState(true);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const {
    activities,
    currentPlan,
    createNewPlan,
    addActivityToSchedule,
    removeActivityFromSchedule,
    updateScheduledActivity,
    reorderActivities,
    savePlan,
    clearCurrentPlan,
    getSaturdayActivities,
    getSundayActivities,
    getTotalPlanDuration,
    updateTimeBounds
  } = useWeekendStore();

  // Set client state to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize and check for existing plans
  useEffect(() => {
    if (!isClient) return;

    // Check if we have a saved plan in localStorage
    const savedData = localStorage.getItem('weekendly-storage');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.state?.currentPlan &&
          (parsed.state.currentPlan.saturday?.length > 0 || parsed.state.currentPlan.sunday?.length > 0)) {
          // We have an existing plan with activities, don't show welcome
          setShowWelcome(false);
          return;
        }
      } catch {
        // If parsing fails, continue with normal flow
      }
    }

    if (!currentPlan) {
      createNewPlan();
    }
  }, [isClient, currentPlan, createNewPlan]);

  const handleAddActivity = useCallback((activity: Activity) => {
    if (!currentPlan) {
      createNewPlan();
      return;
    }

    const dayActivities = targetDay === 'saturday' ? getSaturdayActivities() : getSundayActivities();
    const timeBounds = currentPlan.timeBounds[targetDay];
    
    // Check if we can fit this activity in the day
    const capacity = checkDayCapacity(dayActivities, targetDay, timeBounds);
    const activityDuration = activity.duration;
    
    if (!capacity.canFit || capacity.availableTime < activityDuration) {
      const availableHours = Math.floor(capacity.availableTime / 60);
      const availableMinutes = capacity.availableTime % 60;
      const timeStr = availableHours > 0 ? `${availableHours}h ${availableMinutes}m` : `${availableMinutes}m`;
      
      alert(`Not enough time in ${targetDay}! Available time: ${timeStr}, Activity needs: ${Math.floor(activityDuration / 60)}h ${activityDuration % 60}m`);
      return;
    }

    // Find the next available slot
    const nextSlot = findNextAvailableSlot(dayActivities, activityDuration, targetDay, timeBounds);
    
    if (!nextSlot) {
      alert(`No available time slot for this activity in ${targetDay}!`);
      return;
    }

    addActivityToSchedule(activity, targetDay, nextSlot);

    // Hide welcome screen when activities are added
    setShowWelcome(false);
  }, [currentPlan, targetDay, addActivityToSchedule, getSaturdayActivities, getSundayActivities, createNewPlan]);

  const handleActivityBrowserOpen = useCallback((day: 'saturday' | 'sunday') => {
    setTargetDay(day);
    setShowActivityModal(true);
  }, []);

  const handleTemplateApply = useCallback((template: WeekendTemplate) => {
    // Clear current plan first
    clearCurrentPlan();
    createNewPlan();

    // Auto-add suggested activities from template
    const suggestedActivities = activities.filter(activity =>
      template.suggestedActivities.includes(activity.id)
    );

    // Add 2-3 activities to each day
    const saturdayActivities = suggestedActivities.slice(0, 3);
    const sundayActivities = suggestedActivities.slice(3, 6);

    // Use setTimeout to ensure the new plan is created before adding activities
    setTimeout(() => {
      // Add template activities
      saturdayActivities.forEach((activity, index) => {
        const startTime = new Date();
        startTime.setDate(startTime.getDate() + (6 - startTime.getDay())); // Next Saturday
        startTime.setHours(9 + index * 2, 0, 0, 0); // Spread activities throughout the day
        addActivityToSchedule(activity, 'saturday', startTime);
      });

      sundayActivities.forEach((activity, index) => {
        const startTime = new Date();
        startTime.setDate(startTime.getDate() + (7 - startTime.getDay())); // Next Sunday
        startTime.setHours(10 + index * 2, 0, 0, 0); // Spread activities throughout the day
        addActivityToSchedule(activity, 'sunday', startTime);
      });
    }, 100);

    // Hide welcome screen after template is applied
    setShowWelcome(false);
  }, [activities, addActivityToSchedule, clearCurrentPlan, createNewPlan]);

  const handleGetStarted = useCallback(() => {
    clearCurrentPlan();
    createNewPlan();
    setShowWelcome(false);
  }, [clearCurrentPlan, createNewPlan]);

  const handleContinueExisting = useCallback(() => {
    setShowWelcome(false);
  }, []);

  const handleClearSchedule = useCallback(() => {
    if (confirm('Are you sure you want to clear your entire weekend schedule? This action cannot be undone.')) {
      clearCurrentPlan();
      createNewPlan();
    }
  }, [clearCurrentPlan, createNewPlan]);

  const handleClearDay = useCallback((day: 'saturday' | 'sunday') => {
    if (confirm(`Are you sure you want to clear all ${day} activities? This action cannot be undone.`)) {
      const dayActivities = day === 'saturday' ? getSaturdayActivities() : getSundayActivities();
      dayActivities.forEach(activity => {
        removeActivityFromSchedule(activity.id);
      });
    }
  }, [getSaturdayActivities, getSundayActivities, removeActivityFromSchedule]);

  const handleSavePlan = useCallback(() => {
    savePlan();
    alert('✅ Weekend plan saved locally! Your plan will be restored when you return.');
  }, [savePlan]);

  const handleShare = useCallback(() => {
    setShowShareModal(true);
  }, []);

  const handleCloseActivityModal = useCallback(() => {
    setShowActivityModal(false);
  }, []);

  const handleCloseShareModal = useCallback(() => {
    setShowShareModal(false);
  }, []);

  // Get fresh values on every render to ensure UI updates
  const scheduledActivityIds = [
    ...getSaturdayActivities(),
    ...getSundayActivities()
  ].map(scheduled => scheduled.activityId);

  const totalDuration = getTotalPlanDuration();

  const hasExistingPlan = currentPlan && (currentPlan.saturday.length + currentPlan.sunday.length) > 0;

  const hasStoredPlan = (() => {
    if (!isClient) return false;
    try {
      const savedData = localStorage.getItem('weekendly-storage');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        return parsed.state?.currentPlan &&
          (parsed.state.currentPlan.saturday?.length > 0 || parsed.state.currentPlan.sunday?.length > 0);
      }
    } catch {
      // Ignore parsing errors
    }
    return false;
  })();

  const saturdayActivities = getSaturdayActivities();
  const sundayActivities = getSundayActivities();


  return {
    // State
    targetDay,
    showWelcome,
    showActivityModal,
    showShareModal,
    isClient,
    
    // Data
    activities,
    currentPlan,
    saturdayActivities,
    sundayActivities,
    scheduledActivityIds,
    totalDuration,
    hasExistingPlan,
    hasStoredPlan,
    timeBounds: currentPlan?.timeBounds || {
      saturday: { startHour: 8, endHour: 21 },
      sunday: { startHour: 8, endHour: 21 }
    },
    
    // Actions
    handleAddActivity,
    handleActivityBrowserOpen,
    handleTemplateApply,
    handleGetStarted,
    handleContinueExisting,
    handleClearSchedule,
    handleClearDay,
    handleSavePlan,
    handleShare,
    handleCloseActivityModal,
    handleCloseShareModal,
    
    // Store actions
    removeActivityFromSchedule,
    updateScheduledActivity,
    reorderActivities,
    updateTimeBounds,
  };
}
