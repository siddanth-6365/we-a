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

//   if (totalActivities === 0) {
//     return (
//       <Card className="border-dashed border-2 border-gray-300 bg-gray-50/50">
//         <CardContent className="p-8 text-center">
//           <div className="text-4xl mb-4">🗓️</div>
//           <h2 className="text-xl font-semibold text-gray-900 mb-2">
//             Your Weekend Awaits!
//           </h2>
//           <p className="text-gray-700 mb-4">
//             Start building your perfect weekend by adding activities or choosing a theme.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-3 justify-center">
//             <Button
//               onClick={() => window.location.reload()}
//               className="flex items-center gap-2"
//             >
//               <RotateCcw className="w-4 h-4" />
//               Get Started
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-3xl">📊</div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Weekend Overview
              </h2>
              <p className="text-gray-700">
                {totalActivities} activities planned • {formatDuration(totalDuration)} total time
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Stats */}
            <div className="hidden sm:flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-gray-700">
                  <strong>Saturday:</strong> {saturdayCount} activities
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">
                  <strong>Sunday:</strong> {sundayCount} activities
                </span>
              </div>
            </div>

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

        {/* Mobile Stats */}
        <div className="sm:hidden mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-gray-700">Saturday: {saturdayCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700">Sunday: {sundayCount}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
