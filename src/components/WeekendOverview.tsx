import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { formatDuration } from '@/lib/utils';
import { Trash2 } from 'lucide-react';

interface WeekendOverviewProps {
  totalDuration: number;
  saturdayCount: number;
  sundayCount: number;
  onClearSchedule: () => void;
}

export function WeekendOverview({
  totalDuration,
  saturdayCount,
  sundayCount,
  onClearSchedule
}: WeekendOverviewProps) {
  const totalActivities = saturdayCount + sundayCount;

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            {/* <div className="text-3xl">📊</div> */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
              <h2 className="text-xl font-bold text-gray-900">
                Weekend Overview :
              </h2>
              <p className="text-gray-700">
                {totalActivities} activities planned | {formatDuration(totalDuration)} total time
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">


            {/* Clear Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onClearSchedule}
              className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </Button>
          </div>
        </div>


      </CardContent>
    </Card>
  );
}
