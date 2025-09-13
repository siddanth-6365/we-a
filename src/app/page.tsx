'use client';

import { useWeekendPlan } from '@/hooks/useWeekendPlan';
import { MainLayout } from '@/components/MainLayout';
import { WelcomeScreenWrapper } from '@/components/WelcomeScreenWrapper';
import { WeekendSchedule } from '@/components/WeekendSchedule';
import { WeekendOverview } from '@/components/WeekendOverview';
import { ActivityModal } from '@/components/ActivityModal';
import { ShareModal } from '@/components/ShareModal';

export default function Home() {
  const {
    // State
    targetDay,
    showWelcome,
    showActivityModal,
    showShareModal,
    
    // Data
    activities,
    currentPlan,
    saturdayActivities,
    sundayActivities,
    scheduledActivityIds,
    totalDuration,
    hasExistingPlan,
    hasStoredPlan,
    timeBounds,
    
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
  } = useWeekendPlan();

  // Show welcome screen for new users
  if (showWelcome) {
    return (
      <WelcomeScreenWrapper
        onGetStarted={handleGetStarted}
        onTemplateSelect={handleTemplateApply}
        hasExistingPlan={hasExistingPlan || hasStoredPlan}
        onContinueExisting={handleContinueExisting}
      />
    );
  }

  return (
    <MainLayout
      currentPlan={currentPlan}
      totalDuration={totalDuration}
      onSavePlan={handleSavePlan}
      onShare={handleShare}
    >
      {/* Weekend Overview */}
      <WeekendOverview
        key={`overview-${totalDuration}-${saturdayActivities.length}-${sundayActivities.length}`}
        totalDuration={totalDuration}
        saturdayCount={saturdayActivities.length}
        sundayCount={sundayActivities.length}
        onClearSchedule={handleClearSchedule}
      />

      {/* Weekend Schedule */}
      <WeekendSchedule
        saturdayActivities={saturdayActivities}
        sundayActivities={sundayActivities}
        activities={activities}
        timeBounds={timeBounds}
        onRemoveActivity={removeActivityFromSchedule}
        onUpdateActivity={updateScheduledActivity}
        onReorderActivities={reorderActivities}
        onAddActivity={handleActivityBrowserOpen}
        onClearDay={handleClearDay}
        onUpdateTimeBounds={updateTimeBounds}
      />

      {/* Activity Modal */}
      <ActivityModal
        isOpen={showActivityModal}
        onClose={handleCloseActivityModal}
        activities={activities}
        scheduledActivityIds={scheduledActivityIds}
        onAddActivity={handleAddActivity}
        targetDay={targetDay}
      />

      {/* Share Modal */}
      {currentPlan && (
        <ShareModal
          isOpen={showShareModal}
          onClose={handleCloseShareModal}
          plan={currentPlan}
          activities={activities}
        />
      )}
    </MainLayout>
  );
}
