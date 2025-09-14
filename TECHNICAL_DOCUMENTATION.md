# 🗓️ Weekendly - Technical Documentation

## Overview

Weekendly is a modern weekend planning application built with Next.js 15, TypeScript, and Tailwind CSS. It enables users to create personalized weekend schedules by selecting activities, managing time slots, and integrating location-based recommendations through external APIs.

## 🏗️ Architecture & Design Decisions

### Component Design Philosophy

**Modular Component Architecture**: The application follows a clean separation of concerns with distinct architectural layers:

- **UI Components** (`/components/ui/`): Reusable, headless components (Button, Card, Badge) with consistent styling
- **Feature Components** (`/components/`): Business logic components (ActivityBrowser, WeekendSchedule, DraggableSchedule)
- **Layout Components**: Structural components (MainLayout, AppHeader) for consistent page structure
- **Custom Hooks** (`/hooks/`): Centralized business logic and state management separation

**Key Design Trade-offs**:

1. **Performance vs. Simplicity**: Initially implemented extensive memoization (`React.memo`, `useMemo`) but removed it due to UI re-rendering issues. The trade-off favored simplicity and reactivity over micro-optimizations.

2. **Type Safety vs. Flexibility**: Implemented strict TypeScript types while allowing dynamic activity data for location-based activities through optional `activityData` field in `ScheduledActivity`.

3. **State Management**: Chose Zustand over Redux for simplicity and developer experience, with localStorage persistence for offline functionality.

### State Management Strategy

**Centralized Business Logic**: Created `useWeekendPlan` custom hook to encapsulate all weekend planning logic, separating concerns from UI components.

```typescript
// Custom hook pattern for business logic
export function useWeekendPlan() {
  const { currentPlan, activities, ... } = useWeekendStore();
  
  // Centralized handlers with smart scheduling
  const handleAddActivity = useCallback((activity: Activity) => {
    const capacity = checkDayCapacity(dayActivities, activity.duration, targetDay, timeBounds);
    if (!capacity.canFit) {
      alert(`Not enough time in ${targetDay}!`);
      return;
    }
    // Auto-schedule logic with conflict detection
  }, [dependencies]);
}
```

**Data Structure Evolution**:
- **ScheduledActivity** interface extended to store full `Activity` data for location-based activities
- **Configurable Time Bounds**: Replaced hardcoded 8am-9pm with user-configurable day boundaries
- **Smart Scheduling**: Auto-adjusts subsequent activities when duration or start time changes

### UI Polish & User Experience

**Responsive Design Approach**:
- **Mobile-First**: All components designed for mobile, enhanced for desktop using Tailwind's responsive utilities
- **Flexible Layouts**: CSS Grid and Flexbox for adaptive layouts with proper touch targets
- **Touch-Friendly**: Proper button sizes (44px minimum) and spacing for mobile interaction

**Visual Design System**:
- **Category-Based Colors**: Dynamic color assignment for location-based activities using `CATEGORY_COLORS` mapping
- **Consistent Spacing**: 4px base unit system throughout the application
- **Smooth Animations**: Framer Motion for drag-and-drop and state transitions

## 🚀 Creative Features & Integrations

### Location-Based Activities Integration

**Server-Side API Integration**: Moved Geoapify API calls to Next.js API routes for security and better error handling.

```typescript
// API Route: /api/location/places/route.ts
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  
  // Secure API key handling
  const apiKey = process.env.GEOAPIFY_API_KEY;
  
  // Category mapping for activity types
  const SUPPORTED_CATEGORIES = {
    restaurant: ["catering.restaurant", "catering.fast_food"],
    cafe: ["catering.cafe", "catering.ice_cream"],
    // ... more categories
  };
}
```

**Dynamic Activity Creation**: Convert location data to Activity objects with custom durations and category-based styling.

**Security Implementation**: API keys stored in environment variables and accessed only through server-side routes, preventing client-side exposure.

### Advanced Time Management System

**Smart Scheduling Algorithm**: Implemented sophisticated time slot management with conflict detection and auto-adjustment.

```typescript
// Smart slot finding with capacity checking
export function findNextAvailableSlot(
  activities: Array<{ startTime: Date; endTime: Date }>,
  duration: number,
  day: 'saturday' | 'sunday',
  timeBounds: { startHour: number; endHour: number }
): Date | null {
  const { start: dayStart, end: dayEnd } = getDayTimeBounds(day, timeBounds);
  
  // Check beginning of day
  const firstSlotEnd = new Date(dayStart.getTime() + duration * 60000);
  if (sortedActivities.length === 0 || firstSlotEnd <= sortedActivities[0].startTime) {
    return dayStart;
  }
  
  // Check gaps between activities
  for (let i = 0; i < sortedActivities.length - 1; i++) {
    const currentEnd = sortedActivities[i].endTime;
    const nextStart = sortedActivities[i + 1].startTime;
    const gapDuration = (nextStart.getTime() - currentEnd.getTime()) / 60000;
    
    if (gapDuration >= duration) {
      return currentEnd;
    }
  }
  
  // Check end of day
  const lastActivity = sortedActivities[sortedActivities.length - 1];
  const lastSlotStart = lastActivity.endTime;
  const lastSlotEnd = new Date(lastSlotStart.getTime() + duration * 60000);
  
  if (lastSlotEnd <= dayEnd) {
    return lastSlotStart;
  }
  
  return null; // No available slot
}
```

**Conflict Detection System**: Validates time overlaps when editing activities with user-friendly error messages.

```typescript
export function checkTimeConflicts(
  activities: Array<{ id: string; startTime: Date; endTime: Date }>,
  targetActivityId: string,
  newStartTime: Date,
  newEndTime: Date
): { hasConflict: boolean; conflictingActivity?: { id: string; name: string }; conflictType: 'start' | 'end' | 'overlap' } {
  // Comprehensive conflict detection logic
  // Checks for start time, end time, and complete overlap conflicts
}
```

**Configurable Day Bounds**: Users can set custom start/end times for each day, replacing hardcoded 8am-9pm constraints.

### Drag & Drop System

**@dnd-kit Integration**: Implemented smooth drag-and-drop functionality with proper accessibility support.

```typescript
// Drag and drop with time recalculation
<DndContext
  sensors={sensors}
  collisionDetection={closestCenter}
  onDragEnd={handleDragEnd}
>
  <SortableContext items={activities} strategy={verticalListSortingStrategy}>
    {/* Draggable items with time conflict validation */}
  </SortableContext>
</DndContext>
```

**Smart Reordering**: When activities are reordered, all subsequent activities are automatically recalculated to maintain proper time sequences.

### Export & Sharing System

**Multi-Format Export**: Comprehensive export system supporting multiple formats:

- **iCalendar**: RFC-compliant calendar files for universal compatibility
- **Print-Friendly HTML**: Styled HTML generation for physical copies
- **Shareable Text**: Formatted plain text for messaging and social media
- **Social Integration**: Direct sharing capabilities

**Location Activity Support**: Ensures all activity types (curated and location-based) are properly included in exports with correct duration calculations.

## 🔧 Technical Implementation Highlights

### Performance Optimizations

**Efficient Re-rendering**: Removed unnecessary memoization that was blocking UI updates, prioritizing reactivity over micro-optimizations.

**Smart State Updates**: Zustand store updates trigger minimal re-renders through selective state updates.

**Lazy Loading**: Components loaded on demand to reduce initial bundle size.

### Type Safety & Error Handling

**Comprehensive TypeScript**: Strict typing throughout the application with proper interface definitions.

```typescript
interface ScheduledActivity {
  id: string;
  activityId: string;
  startTime: Date;
  endTime: Date;
  day: 'saturday' | 'sunday';
  notes?: string;
  customDuration?: number;
  activityData?: Activity; // For location-based activities
}

interface DayTimeBounds {
  startHour: number;
  endHour: number;
}
```

**Interface Evolution**: Types adapted as features were added (location activities, time bounds, conflict detection).

**API Type Safety**: Proper interfaces for external API responses with error handling.

**Graceful Degradation**: Fallback data for API failures with clear user feedback.

### Data Flow Architecture

**Unidirectional Data Flow**: Clear data flow from store → hooks → components with proper separation of concerns.

**Event Handling**: Centralized event handling through custom hooks with proper dependency management.

**State Persistence**: localStorage integration with Zustand persist middleware for offline functionality.

## 🎯 Key Technical Challenges Solved

### 1. Location-Based Activity Integration
**Challenge**: Integrating external location data with internal activity system while maintaining type safety.

**Solution**: Created `activityData` field in `ScheduledActivity` to store full activity details for location-based items, with proper type guards and fallback handling.

### 2. Time Conflict Management
**Challenge**: Preventing time overlaps while allowing flexible editing and drag-and-drop reordering.

**Solution**: Implemented comprehensive conflict detection system with user-friendly error messages and smart reordering algorithms.

### 3. Responsive Drag & Drop
**Challenge**: Making drag-and-drop work smoothly on both desktop and mobile devices.

**Solution**: Used @dnd-kit with proper touch sensor configuration and responsive design patterns.

### 4. State Management Complexity
**Challenge**: Managing complex state with multiple interdependent updates (time changes, reordering, conflict detection).

**Solution**: Centralized business logic in custom hooks with proper separation of concerns and efficient state updates.

## 📊 Performance Metrics

- **Bundle Size**: Optimized with lazy loading and tree shaking
- **Re-render Efficiency**: Minimal re-renders through selective state updates
- **Mobile Performance**: Touch-friendly interactions with proper gesture handling
- **Offline Support**: Full functionality with localStorage persistence

## 🔮 Future Enhancements

- **Real-time Collaboration**: Multi-user weekend planning
- **AI-Powered Suggestions**: Machine learning for activity recommendations
- **Calendar Integration**: Direct sync with Google Calendar, Outlook
- **Advanced Analytics**: Usage patterns and optimization suggestions
- **Voice Interface**: Voice commands for activity management

This architecture prioritizes maintainability, user experience, and extensibility while keeping the codebase clean and performant. The modular design allows for easy feature additions and modifications without affecting existing functionality.
