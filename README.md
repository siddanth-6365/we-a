# 🗓️ Weekendly - Weekend Planner

**A modern weekend planning application built with Next.js 15, TypeScript, and Tailwind CSS. Design your perfect weekend by choosing activities, moods, and themes with an intuitive drag-and-drop interface.**

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## 🏗️ Architecture & Design Decisions

### Component Design Philosophy

**Modular Component Architecture**: The application follows a clean separation of concerns with distinct layers:

- **UI Components** (`/components/ui/`): Reusable, headless components (Button, Card, Badge)
- **Feature Components** (`/components/`): Business logic components (ActivityBrowser, WeekendSchedule)
- **Layout Components**: Structural components (MainLayout, AppHeader)
- **Custom Hooks** (`/hooks/`): Centralized business logic and state management

**Key Design Trade-offs**:
- **Performance vs. Simplicity**: Removed excessive memoization (`React.memo`, `useMemo`) that was causing UI re-rendering issues
- **Type Safety vs. Flexibility**: Used strict TypeScript types while allowing dynamic activity data for location-based activities
- **State Management**: Chose Zustand over Redux for simplicity, with localStorage persistence for offline functionality

### State Management Strategy

**Centralized Business Logic**: Created `useWeekendPlan` hook to encapsulate all weekend planning logic, separating concerns from UI components.

```typescript
// Custom hook pattern for business logic
export function useWeekendPlan() {
  const { currentPlan, activities, ... } = useWeekendStore();
  
  // Centralized handlers
  const handleAddActivity = useCallback((activity: Activity) => {
    // Smart scheduling logic
    const capacity = checkDayCapacity(dayActivities, activity.duration, targetDay, timeBounds);
    if (!capacity.canFit) {
      alert(`Not enough time in ${targetDay}!`);
      return;
    }
    // Auto-schedule logic
  }, [dependencies]);
}
```

**Data Structure Evolution**: 
- **ScheduledActivity** interface extended to store full `Activity` data for location-based activities
- **Configurable Time Bounds**: Replaced hardcoded 8am-9pm with user-configurable day boundaries
- **Smart Scheduling**: Auto-adjusts subsequent activities when duration or start time changes

### UI Polish & User Experience

**Responsive Design Approach**:
- **Mobile-First**: All components designed for mobile, enhanced for desktop
- **Flexible Layouts**: Used CSS Grid and Flexbox for adaptive layouts
- **Touch-Friendly**: Proper button sizes and spacing for mobile interaction

**Visual Design System**:
- **Category-Based Colors**: Dynamic color assignment for location-based activities
- **Consistent Spacing**: 4px base unit system throughout
- **Smooth Animations**: Framer Motion for drag-and-drop and state transitions

### Creative Features & Integrations

**Location-Based Activities**:
- **Server-Side API Integration**: Moved Geoapify API calls to Next.js API routes for security
- **Dynamic Activity Creation**: Convert location data to Activity objects with custom durations
- **Category-Based Styling**: Automatic color assignment based on activity category

**Smart Time Management**:
- **Conflict Detection**: Validates time overlaps when editing activities
- **Auto-Adjustment**: Automatically reschedules subsequent activities when changes are made
- **Configurable Bounds**: Users can set custom start/end times for each day

**Advanced Scheduling Logic**:
```typescript
// Smart slot finding with capacity checking
const findNextAvailableSlot = (activities, duration, day, timeBounds) => {
  const { start: dayStart, end: dayEnd } = getDayTimeBounds(day, timeBounds);
  // Complex algorithm to find optimal time slots
};

// Time conflict validation
const checkTimeConflicts = (activities, targetId, newStart, newEnd) => {
  // Validates against all other activities
};
```

**Export & Sharing System**:
- **Multi-Format Export**: iCal, print-friendly HTML, and shareable text
- **Location Activity Support**: Ensures all activity types are included in exports
- **Social Integration**: Direct sharing capabilities

### Technical Implementation Highlights

**Performance Optimizations**:
- **Efficient Re-rendering**: Removed unnecessary memoization that was blocking updates
- **Smart State Updates**: Zustand store updates trigger minimal re-renders
- **Lazy Loading**: Components loaded on demand

**Type Safety**:
- **Comprehensive TypeScript**: Strict typing throughout the application
- **Interface Evolution**: Types adapted as features were added (location activities, time bounds)
- **API Type Safety**: Proper interfaces for external API responses

**Error Handling**:
- **Graceful Degradation**: Fallback data for API failures
- **User Feedback**: Clear error messages and validation
- **Conflict Resolution**: Smart suggestions for time conflicts

This architecture prioritizes maintainability, user experience, and extensibility while keeping the codebase clean and performant.
