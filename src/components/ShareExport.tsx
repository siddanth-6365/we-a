import { useState } from 'react';
import { WeekendPlan, Activity, ScheduledActivity } from '@/types';
import { Button } from './ui/Button';
import { formatTime, formatDuration } from '@/lib/utils';
import { Share2, Download, Copy, Printer, Calendar, Clock, MapPin } from 'lucide-react';

interface ShareExportProps {
  plan: WeekendPlan;
  activities: Activity[];
  onClose?: () => void;
}

export function ShareExport({ plan, activities, onClose }: ShareExportProps) {
  const [copied, setCopied] = useState(false);

  const generateShareableText = () => {
    const saturdayActivities = plan.saturday.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    const sundayActivities = plan.sunday.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    let text = `🗓️ ${plan.name}`;
    if (plan.theme) {
      text += ` (${plan.theme} weekend)`;
    }
    text += '\n\n';

    if (saturdayActivities.length > 0) {
      text += '🌅 SATURDAY\n';
      saturdayActivities.forEach(scheduled => {
        // First try to get activity data from the scheduled activity itself (for location-based activities)
        let activity = scheduled.activityData;
        
        // If not available, try to find it in the main activities array
        if (!activity) {
          activity = activities.find(a => a.id === scheduled.activityId);
        }
        
        if (activity) {
          const duration = scheduled.customDuration || activity.duration;
          const endTime = new Date(scheduled.startTime.getTime() + duration * 60000);
          text += `${formatTime(scheduled.startTime)} - ${formatTime(endTime)} | ${activity.icon} ${activity.name}`;
          if (scheduled.notes) {
            text += ` (${scheduled.notes})`;
          }
          text += '\n';
        }
      });
      text += '\n';
    }

    if (sundayActivities.length > 0) {
      text += '🌇 SUNDAY\n';
      sundayActivities.forEach(scheduled => {
        // First try to get activity data from the scheduled activity itself (for location-based activities)
        let activity = scheduled.activityData;
        
        // If not available, try to find it in the main activities array
        if (!activity) {
          activity = activities.find(a => a.id === scheduled.activityId);
        }
        
        if (activity) {
          const duration = scheduled.customDuration || activity.duration;
          const endTime = new Date(scheduled.startTime.getTime() + duration * 60000);
          text += `${formatTime(scheduled.startTime)} - ${formatTime(endTime)} | ${activity.icon} ${activity.name}`;
          if (scheduled.notes) {
            text += ` (${scheduled.notes})`;
          }
          text += '\n';
        }
      });
    }

    text += '\n✨ Created with Weekendly - Plan your perfect weekend!';
    return text;
  };

  const generateICalEvent = (scheduledActivity: ScheduledActivity) => {
    // First try to get activity data from the scheduled activity itself (for location-based activities)
    let activity = scheduledActivity.activityData;
    
    // If not available, try to find it in the main activities array
    if (!activity) {
      activity = activities.find(a => a.id === scheduledActivity.activityId);
    }
    
    if (!activity) return '';

    const duration = scheduledActivity.customDuration || activity.duration;
    const endTime = new Date(scheduledActivity.startTime.getTime() + duration * 60000);

    const formatICalDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    return `BEGIN:VEVENT
UID:weekendly-${scheduledActivity.id}@weekendly.app
DTSTART:${formatICalDate(scheduledActivity.startTime)}
DTEND:${formatICalDate(endTime)}
SUMMARY:${activity.icon} ${activity.name}
DESCRIPTION:${activity.description}${scheduledActivity.notes ? '\\n\\nNotes: ' + scheduledActivity.notes : ''}
CATEGORIES:${activity.category}
STATUS:CONFIRMED
END:VEVENT
`;
  };

  const generateICalFile = () => {
    const allActivities = [...plan.saturday, ...plan.sunday];
    
    let ical = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Weekendly//Weekend Planner//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:${plan.name}
X-WR-CALDESC:Weekend plan created with Weekendly
`;

    allActivities.forEach(scheduled => {
      ical += generateICalEvent(scheduled);
    });

    ical += 'END:VCALENDAR';
    return ical;
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateShareableText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDownloadICalendar = () => {
    const icalContent = generateICalFile();
    const blob = new Blob([icalContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${plan.name.replace(/\s+/g, '_')}_weekend_plan.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const saturdayActivities = plan.saturday.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    const sundayActivities = plan.sunday.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${plan.name} - Weekend Plan</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 20px; line-height: 1.6; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #ccc; padding-bottom: 20px; }
            .day { margin-bottom: 30px; }
            .day-title { font-size: 24px; font-weight: bold; margin-bottom: 15px; color: #333; }
            .activity { margin-bottom: 15px; padding: 10px; border-left: 4px solid #007bff; background: #f8f9fa; }
            .activity-header { font-weight: bold; font-size: 18px; margin-bottom: 5px; }
            .activity-time { color: #666; margin-bottom: 5px; }
            .activity-notes { font-style: italic; color: #555; }
            .footer { margin-top: 40px; text-align: center; color: #666; font-size: 14px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🗓️ ${plan.name}</h1>
            ${plan.theme ? `<p>Theme: ${plan.theme} weekend</p>` : ''}
            <p>Created: ${plan.createdAt.toLocaleDateString()}</p>
          </div>
          
          ${saturdayActivities.length > 0 ? `
            <div class="day">
              <div class="day-title">🌅 Saturday</div>
              ${saturdayActivities.map(scheduled => {
                // First try to get activity data from the scheduled activity itself (for location-based activities)
                let activity = scheduled.activityData;
                
                // If not available, try to find it in the main activities array
                if (!activity) {
                  activity = activities.find(a => a.id === scheduled.activityId);
                }
                
                if (!activity) return '';
                const duration = scheduled.customDuration || activity.duration;
                const endTime = new Date(scheduled.startTime.getTime() + duration * 60000);
                return `
                  <div class="activity">
                    <div class="activity-header">${activity.icon} ${activity.name}</div>
                    <div class="activity-time">⏰ ${formatTime(scheduled.startTime)} - ${formatTime(endTime)} (${formatDuration(duration)})</div>
                    <div>${activity.description}</div>
                    ${scheduled.notes ? `<div class="activity-notes">Notes: ${scheduled.notes}</div>` : ''}
                  </div>
                `;
              }).join('')}
            </div>
          ` : ''}
          
          ${sundayActivities.length > 0 ? `
            <div class="day">
              <div class="day-title">🌇 Sunday</div>
              ${sundayActivities.map(scheduled => {
                // First try to get activity data from the scheduled activity itself (for location-based activities)
                let activity = scheduled.activityData;
                
                // If not available, try to find it in the main activities array
                if (!activity) {
                  activity = activities.find(a => a.id === scheduled.activityId);
                }
                
                if (!activity) return '';
                const duration = scheduled.customDuration || activity.duration;
                const endTime = new Date(scheduled.startTime.getTime() + duration * 60000);
                return `
                  <div class="activity">
                    <div class="activity-header">${activity.icon} ${activity.name}</div>
                    <div class="activity-time">⏰ ${formatTime(scheduled.startTime)} - ${formatTime(endTime)} (${formatDuration(duration)})</div>
                    <div>${activity.description}</div>
                    ${scheduled.notes ? `<div class="activity-notes">Notes: ${scheduled.notes}</div>` : ''}
                  </div>
                `;
              }).join('')}
            </div>
          ` : ''}
          
          <div class="footer">
            <p>✨ Created with Weekendly - Plan your perfect weekend!</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const totalActivities = plan.saturday.length + plan.sunday.length;
  const totalDuration = [...plan.saturday, ...plan.sunday].reduce((total, scheduled) => {
    // First try to get activity data from the scheduled activity itself (for location-based activities)
    let activity = scheduled.activityData;
    
    // If not available, try to find it in the main activities array
    if (!activity) {
      activity = activities.find(a => a.id === scheduled.activityId);
    }
    
    return total + (scheduled.customDuration || activity?.duration || 0);
  }, 0);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-blue-600" />
              Share Your Weekend Plan
            </h2>
            <p className="text-sm text-gray-700 mt-1">
              Export your plan to share with friends or add to your calendar
            </p>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Plan Preview */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
          <h3 className="font-semibold text-xl mb-3 text-gray-900">📋 {plan.name}</h3>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-gray-700">{totalActivities} activities</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
              <Clock className="w-4 h-4 text-green-600" />
              <span className="font-medium text-gray-700">{formatDuration(totalDuration)} total</span>
            </div>
            {plan.theme && (
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                <MapPin className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-gray-700 capitalize">{plan.theme} theme</span>
              </div>
            )}
          </div>
        </div>

        {/* Export Options */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              onClick={handleCopyToClipboard}
              variant="outline"
              className="flex items-center gap-3 h-auto p-5 hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Copy className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left flex-1">
                <div className="font-semibold text-gray-900">
                  {copied ? '✅ Copied!' : 'Copy as Text'}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Share via message or social media
                </div>
              </div>
            </Button>

            <Button
              onClick={handleDownloadICalendar}
              variant="outline"
              className="flex items-center gap-3 h-auto p-5 hover:bg-green-50 hover:border-green-300 transition-colors"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-left flex-1">
                <div className="font-semibold text-gray-900">Download Calendar</div>
                <div className="text-sm text-gray-600 mt-1">
                  Import to Google, Apple, or Outlook
                </div>
              </div>
            </Button>

            <Button
              onClick={handlePrint}
              variant="outline"
              className="flex items-center gap-3 h-auto p-5 hover:bg-purple-50 hover:border-purple-300 transition-colors"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Printer className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-left flex-1">
                <div className="font-semibold text-gray-900">Print Plan</div>
                <div className="text-sm text-gray-600 mt-1">
                  Create a physical copy
                </div>
              </div>
            </Button>

            <Button
              onClick={() => {
                const text = generateShareableText();
                const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
                window.open(url, '_blank');
              }}
              variant="outline"
              className="flex items-center gap-3 h-auto p-5 hover:bg-sky-50 hover:border-sky-300 transition-colors"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                <Share2 className="w-5 h-5 text-sky-600" />
              </div>
              <div className="text-left flex-1">
                <div className="font-semibold text-gray-900">Share on Twitter</div>
                <div className="text-sm text-gray-600 mt-1">
                  Post your weekend plans
                </div>
              </div>
            </Button>
          </div>
        </div>

        {/* Preview Text */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Preview</h3>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-mono max-h-48 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-gray-700">{generateShareableText()}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
