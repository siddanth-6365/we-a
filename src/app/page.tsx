'use client';

import { useState, useEffect } from 'react';
import { Activity, WeekendTemplate } from '@/types';
import { useWeekendStore } from '@/store/useWeekendStore';
import { WeekendSchedule } from '@/components/WeekendSchedule';
import { ShareExport } from '@/components/ShareExport';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { WeekendOverview } from '@/components/WeekendOverview';
import { ActivityModal } from '@/components/ActivityModal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CalendarDays, Save, Share2 } from 'lucide-react';

export default function Home() {
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
    getTotalPlanDuration
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

  const handleAddActivity = (activity: Activity) => {
    if (!currentPlan) return;

    // Default to 9 AM start time for Saturday, adjust based on existing activities
    const baseDate = new Date();
    if (targetDay === 'saturday') {
      baseDate.setDate(baseDate.getDate() + (6 - baseDate.getDay())); // Next Saturday
    } else {
      baseDate.setDate(baseDate.getDate() + (7 - baseDate.getDay())); // Next Sunday
    }

    const dayActivities = targetDay === 'saturday' ? getSaturdayActivities() : getSundayActivities();

    let startTime: Date;
    if (dayActivities.length === 0) {
      // First activity of the day - start at 9 AM
      startTime = new Date(baseDate);
      startTime.setHours(9, 0, 0, 0);
    } else {
      // Add after the last activity
      const sortedActivities = [...dayActivities].sort(
        (a, b) => a.startTime.getTime() - b.startTime.getTime()
      );
      const lastActivity = sortedActivities[sortedActivities.length - 1];

      if (lastActivity) {
        const lastActivityData = activities.find(a => a.id === lastActivity.activityId);
        const duration = lastActivity.customDuration || lastActivityData?.duration || 60;
        startTime = new Date(lastActivity.startTime.getTime() + duration * 60000);
      } else {
        startTime = new Date(baseDate);
        startTime.setHours(9, 0, 0, 0);
      }
    }

    addActivityToSchedule(activity, targetDay, startTime);

    // Hide welcome screen when activities are added
    setShowWelcome(false);
  };

  const handleActivityBrowserOpen = (day: 'saturday' | 'sunday') => {
    setTargetDay(day);
    setShowActivityModal(true);
  };

  const handleTemplateApply = (template: WeekendTemplate) => {
    // Auto-add suggested activities from template
    const suggestedActivities = activities.filter(activity =>
      template.suggestedActivities.includes(activity.id)
    );

    // Add 2-3 activities to each day
    const saturdayActivities = suggestedActivities.slice(0, 3);
    const sundayActivities = suggestedActivities.slice(3, 6);

    // Clear current plan and add template activities
    // For demo purposes, we'll just add to existing plan
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

    // Hide welcome screen after template is applied
    setShowWelcome(false);
  };

  const handleGetStarted = () => {
    clearCurrentPlan();
    createNewPlan();
    setShowWelcome(false);
  };

  const handleContinueExisting = () => {
    setShowWelcome(false);
  };

  const handleClearSchedule = () => {
    if (confirm('Are you sure you want to clear your entire weekend schedule? This action cannot be undone.')) {
      clearCurrentPlan();
      createNewPlan();
    }
  };

  const handleClearDay = (day: 'saturday' | 'sunday') => {
    if (confirm(`Are you sure you want to clear all ${day} activities? This action cannot be undone.`)) {
      const dayActivities = day === 'saturday' ? getSaturdayActivities() : getSundayActivities();
      dayActivities.forEach(activity => {
        removeActivityFromSchedule(activity.id);
      });
    }
  };

  const handleSavePlan = () => {
    savePlan();
    alert('✅ Weekend plan saved locally! Your plan will be restored when you return.');
  };

  const scheduledActivityIds = [
    ...getSaturdayActivities(),
    ...getSundayActivities()
  ].map(scheduled => scheduled.activityId);


  const totalDuration = getTotalPlanDuration();
  const hasExistingPlan = currentPlan && (currentPlan.saturday.length + currentPlan.sunday.length) > 0;

  // Also check localStorage for existing plans (client-side only)
  const hasStoredPlan = isClient && (() => {
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

  // Show welcome screen for new users
  if (showWelcome) {
    return (
      <div className="min-h-screen bg-gray-50">
        <WelcomeScreen
          onGetStarted={handleGetStarted}
          onTemplateSelect={handleTemplateApply}
          hasExistingPlan={hasExistingPlan || hasStoredPlan}
          onContinueExisting={handleContinueExisting}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🗓️</div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Weekendly</h1>
                <p className="text-sm text-gray-700">Plan your perfect weekend</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {currentPlan && (
                <div className="hidden sm:flex items-center gap-3 text-sm text-gray-700">
                  <div className="flex items-center gap-1">
                    <CalendarDays className="w-4 h-4" />
                    <span>{currentPlan.name}</span>
                  </div>
                  {totalDuration > 0 && (
                    <Badge variant="secondary">
                      {Math.floor(totalDuration / 60)}h {totalDuration % 60}m planned
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2">
                {/* <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowActivityModal(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Browse Activities
                </Button> */}

                {totalDuration > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowShareModal(true)}
                    className="flex items-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                )}

                <Button size="sm" onClick={handleSavePlan} className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Plan
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Weekend Overview - Moved to top */}
          <WeekendOverview
            totalDuration={totalDuration}
            saturdayCount={getSaturdayActivities().length}
            sundayCount={getSundayActivities().length}
            onClearSchedule={handleClearSchedule}
          />

          {/* Weekend Schedule */}
          <WeekendSchedule
            saturdayActivities={getSaturdayActivities()}
            sundayActivities={getSundayActivities()}
            activities={activities}
            onRemoveActivity={removeActivityFromSchedule}
            onUpdateActivity={updateScheduledActivity}
            onReorderActivities={reorderActivities}
            onAddActivity={handleActivityBrowserOpen}
            onClearDay={handleClearDay}
          />
        </div>

        {/* Activity Modal */}
        <ActivityModal
          isOpen={showActivityModal}
          onClose={() => setShowActivityModal(false)}
          activities={activities}
          scheduledActivityIds={scheduledActivityIds}
          onAddActivity={handleAddActivity}
          targetDay={targetDay}
        />

        {/* Share Modal */}
        {showShareModal && currentPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowShareModal(false)}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <ShareExport
                plan={currentPlan}
                activities={activities}
                onClose={() => setShowShareModal(false)}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
