'use client';

import { memo } from 'react';
import { ShareExport } from './ShareExport';
import { WeekendPlan, Activity } from '@/types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: WeekendPlan;
  activities: Activity[];
}

export const ShareModal = memo(function ShareModal({
  isOpen,
  onClose,
  plan,
  activities
}: ShareModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <ShareExport
          plan={plan}
          activities={activities}
          onClose={onClose}
        />
      </div>
    </div>
  );
});
