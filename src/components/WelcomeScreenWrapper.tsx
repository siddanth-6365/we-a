'use client';

import { memo } from 'react';
import { WelcomeScreen } from './WelcomeScreen';

interface WelcomeScreenWrapperProps {
  onGetStarted: () => void;
  onTemplateSelect: (template: any) => void;
  hasExistingPlan: boolean;
  onContinueExisting: () => void;
}

export const WelcomeScreenWrapper = memo(function WelcomeScreenWrapper({
  onGetStarted,
  onTemplateSelect,
  hasExistingPlan,
  onContinueExisting
}: WelcomeScreenWrapperProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <WelcomeScreen
        onGetStarted={onGetStarted}
        onTemplateSelect={onTemplateSelect}
        hasExistingPlan={hasExistingPlan}
        onContinueExisting={onContinueExisting}
      />
    </div>
  );
});
