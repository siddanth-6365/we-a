'use client';

import { CalendarDays, Save, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { WeekendPlan } from '@/types';

interface AppHeaderProps {
  currentPlan: WeekendPlan | null;
  totalDuration: number;
  onSavePlan: () => void;
  onShare: () => void;
}

export function AppHeader({
  currentPlan,
  totalDuration,
  onSavePlan,
  onShare
}: AppHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="text-xl sm:text-2xl">🗓️</div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Weekendly</h1>
              <p className="text-xs sm:text-sm text-gray-700 hidden sm:block">Plan your perfect weekend</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {currentPlan && (
              <>
                {/* Mobile plan info */}
                {/* <div className="flex md:hidden items-center gap-2 text-xs text-gray-600">
                  {totalDuration > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
                    </Badge>
                  )}
                </div> */}
                
                {/* Desktop plan info */}
                <div className="hidden md:flex items-center gap-3 text-sm text-gray-700">
                  <div className="flex items-center gap-1">
                    <CalendarDays className="w-4 h-4" />
                    <span className="truncate max-w-[200px]">{currentPlan.name}</span>
                  </div>
                  {/* {totalDuration > 0 && (
                    <Badge variant="secondary">
                      {Math.floor(totalDuration / 60)}h {totalDuration % 60}m planned
                    </Badge>
                  )} */}
                </div>
              </>
            )}

            <div className="flex items-center gap-1 sm:gap-2">
              {totalDuration > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onShare}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
              )}

              {/* <Button 
                size="sm" 
                onClick={onSavePlan} 
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3"
              >
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Save Plan</span>
              </Button> */}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
