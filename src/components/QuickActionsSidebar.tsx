import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { formatDuration } from '@/lib/utils';
import { 
  Plus, 
  Calendar, 
  Clock, 
  Target, 
  Sparkles, 
  Download, 
  Share2, 
  RotateCcw,
  BarChart3
} from 'lucide-react';

interface QuickActionsSidebarProps {
  totalDuration: number;
  saturdayCount: number;
  sundayCount: number;
  onAddActivity: (day: 'saturday' | 'sunday') => void;
  onClearSchedule: () => void;
  onShare: () => void;
  onSave: () => void;
}

export function QuickActionsSidebar({
  totalDuration,
  saturdayCount,
  sundayCount,
  onAddActivity,
  onClearSchedule,
  onShare,
  onSave
}: QuickActionsSidebarProps) {
  const totalActivities = saturdayCount + sundayCount;

  return (
    <div className="space-y-6">
      {/* Plan Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Plan Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-600">{saturdayCount}</div>
              <div className="text-xs text-orange-700 font-medium">Saturday</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">{sundayCount}</div>
              <div className="text-xs text-blue-700 font-medium">Sunday</div>
            </div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Total Time</span>
            </div>
            <div className="text-lg font-bold text-gray-900">
              {formatDuration(totalDuration)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Add */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Plus className="w-5 h-5 text-green-600" />
            Quick Add
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            onClick={() => onAddActivity('saturday')}
            className="w-full flex items-center gap-3 justify-start h-12"
          >
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <Calendar className="w-4 h-4 text-orange-600" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium">Add to Saturday</div>
              <div className="text-xs text-gray-600">
                {saturdayCount} activities planned
              </div>
            </div>
            <Badge variant="secondary" className="ml-auto">
              {saturdayCount}
            </Badge>
          </Button>
          
          <Button
            variant="outline"
            onClick={() => onAddActivity('sunday')}
            className="w-full flex items-center gap-3 justify-start h-12"
          >
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium">Add to Sunday</div>
              <div className="text-xs text-gray-600">
                {sundayCount} activities planned
              </div>
            </div>
            <Badge variant="secondary" className="ml-auto">
              {sundayCount}
            </Badge>
          </Button>
        </CardContent>
      </Card>

      {/* Plan Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="w-5 h-5 text-purple-600" />
            Plan Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={onSave}
            className="w-full flex items-center gap-2 justify-center"
          >
            <Download className="w-4 h-4" />
            Save Plan
          </Button>
          
          {totalActivities > 0 && (
            <>
              <Button
                variant="outline"
                onClick={onShare}
                className="w-full flex items-center gap-2 justify-center"
              >
                <Share2 className="w-4 h-4" />
                Share Plan
              </Button>
              
              <Button
                variant="outline"
                onClick={onClearSchedule}
                className="w-full flex items-center gap-2 justify-center text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
              >
                <RotateCcw className="w-4 h-4" />
                Clear All
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Tips & Tricks */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700">
                Drag activities to reorder them in your schedule
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700">
                Add notes to activities for personal reminders
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700">
                Use the share feature to send plans to friends
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
