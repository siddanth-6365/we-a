'use client';

import { ReactNode } from 'react';
import { AppHeader } from './AppHeader';
import { WeekendPlan } from '@/types';

interface MainLayoutProps {
  currentPlan: WeekendPlan | null;
  totalDuration: number;
  onSavePlan: () => void;
  onShare: () => void;
  children: ReactNode;
}

export function MainLayout({
  currentPlan,
  totalDuration,
  onSavePlan,
  onShare,
  children
}: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader
        currentPlan={currentPlan}
        totalDuration={totalDuration}
        onSavePlan={onSavePlan}
        onShare={onShare}
      />
      
      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="space-y-4 sm:space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}
