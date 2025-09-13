import { WeekendTheme } from '@/types';
import { WeekendTemplate } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { WEEKEND_TEMPLATES } from '@/data/activities';
import { Sparkles, Check } from 'lucide-react';

interface ThemeSelectorProps {
  selectedTheme: WeekendTheme | null;
  onThemeSelect: (theme: WeekendTheme | null) => void;
  onTemplateApply?: (template: WeekendTemplate) => void;
}

const themeColors: Record<WeekendTheme, string> = {
  lazy: 'bg-blue-100 border-blue-300 text-blue-800',
  adventurous: 'bg-green-100 border-green-300 text-green-800',
  family: 'bg-purple-100 border-purple-300 text-purple-800',
  romantic: 'bg-pink-100 border-pink-300 text-pink-800',
  productive: 'bg-yellow-100 border-yellow-300 text-yellow-800',
  social: 'bg-orange-100 border-orange-300 text-orange-800',
  wellness: 'bg-emerald-100 border-emerald-300 text-emerald-800',
  cultural: 'bg-indigo-100 border-indigo-300 text-indigo-800'
};

export function ThemeSelector({ 
  selectedTheme, 
  onThemeSelect, 
  onTemplateApply 
}: ThemeSelectorProps) {
  const handleTemplateSelect = (template: WeekendTemplate) => {
    onThemeSelect(template.theme);
    onTemplateApply?.(template);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          Weekend Themes
        </CardTitle>
        <p className="text-sm text-gray-700">
          Choose a theme to get personalized activity suggestions
        </p>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Clear theme option */}
          <div className="text-center">
            <Button
              variant={selectedTheme === null ? 'default' : 'outline'}
              onClick={() => onThemeSelect(null)}
              className="w-full justify-center py-3 px-4"
            >
              {selectedTheme === null && <Check className="w-4 h-4 mr-2" />}
              🎭 Custom Mix (No Theme)
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500 font-medium">or choose a theme</span>
            </div>
          </div>

          {/* Theme templates */}
          <div className="grid grid-cols-1 gap-4">
            {WEEKEND_TEMPLATES.map((template) => (
              <div
                key={template.id}
                className={`
                  relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg group
                  ${selectedTheme === template.theme 
                    ? themeColors[template.theme] 
                    : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                  }
                `}
                onClick={() => handleTemplateSelect(template)}
              >
                {selectedTheme === template.theme && (
                  <div className="absolute top-3 right-3">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <Check className="w-4 h-4 text-current" />
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <span className="text-3xl" role="img" aria-label={template.name}>
                      {template.icon}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base text-gray-900 mb-1">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                      {template.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs px-2.5 py-1">
                        {template.suggestedActivities.length} activities
                      </Badge>
                      
                      {onTemplateApply && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTemplateSelect(template);
                          }}
                          className="text-xs px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Apply
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedTheme && (
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-purple-900">Theme Active</span>
                  <p className="text-xs text-purple-700">
                    {selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)} weekend
                  </p>
                </div>
              </div>
              <p className="text-sm text-purple-800 leading-relaxed">
                Activities are filtered to match your theme. You can still add any activity you want!
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
