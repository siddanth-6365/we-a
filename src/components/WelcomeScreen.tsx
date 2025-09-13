import { WeekendTemplate } from '@/types';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';
import { WEEKEND_TEMPLATES } from '@/data/activities';
import { Sparkles, Calendar, Heart, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onTemplateSelect: (template: WeekendTemplate) => void;
  hasExistingPlan?: boolean;
  onContinueExisting?: () => void;
}

export function WelcomeScreen({ onGetStarted, onTemplateSelect, hasExistingPlan, onContinueExisting }: WelcomeScreenProps) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center space-y-8"
      >
        {/* Hero Section */}
        <div className="space-y-4">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-6xl mb-4"
          >
            🗓️
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Welcome to <span className="text-blue-600">Weekendly</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed"
          >
            Design your perfect weekend by choosing activities, moods, and themes. 
            Create a personalized Saturday-Sunday schedule that makes every weekend memorable.
          </motion.p>
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12"
        >
          <Card className="border-2 border-blue-100 bg-blue-50/50">
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2">Smart Planning</h3>
              <p className="text-gray-700 text-sm">
                Browse curated activities and build your ideal weekend schedule
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-100 bg-purple-50/50">
            <CardContent className="p-6 text-center">
              <Heart className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2">Mood-Based</h3>
              <p className="text-gray-700 text-sm">
                Choose activities that match your energy and desired vibe
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-100 bg-green-50/50">
            <CardContent className="p-6 text-center">
              <Zap className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2">Easy Sharing</h3>
              <p className="text-gray-700 text-sm">
                Export to calendar, print, or share with friends and family
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Start Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="space-y-6"
        >
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              How would you like to start?
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {hasExistingPlan && onContinueExisting && (
                <Button
                  size="lg"
                  onClick={onContinueExisting}
                  className="flex items-center gap-2 px-8 py-3 text-lg bg-green-600 hover:bg-green-700"
                >
                  <Calendar className="w-5 h-5" />
                  Continue Previous Plan
                </Button>
              )}
              
              <Button
                size="lg"
                onClick={onGetStarted}
                variant={hasExistingPlan ? "outline" : "default"}
                className="flex items-center gap-2 px-8 py-3 text-lg"
              >
                <Sparkles className="w-5 h-5" />
                Start From Scratch
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-600">or choose a theme</span>
            </div>
          </div>

          {/* Weekend Templates */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
            {WEEKEND_TEMPLATES.map((template) => (
              <motion.button
                key={template.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onTemplateSelect(template)}
                className="p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                  {template.icon}
                </div>
                <div className="text-sm font-medium text-gray-900 mb-1">
                  {template.name}
                </div>
                <div className="text-xs text-gray-700 leading-tight">
                  {template.description}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="pt-8 text-center"
        >
          <p className="text-gray-600 text-sm">
            ✨ Your perfect weekend is just a few clicks away
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
