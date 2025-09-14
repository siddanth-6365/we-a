# Weekendly - Technical Documentation

## Overview

Weekendly is a modern weekend planning application built with Next.js 15, React 19, and TypeScript. It enables users to create, manage, and share personalized weekend schedules with intelligent scheduling features and location-based activity discovery.

## Major Design Decisions and Trade-offs

### 1. Architecture & Framework Choice

**Decision**: Next.js 15 with App Router and React 19
- **Rationale**: Leverages the latest React Server Components and streaming capabilities for optimal performance

### 2. State Management Strategy

**Decision**: Zustand with persistence middleware
- **Rationale**: Lightweight, TypeScript-first state management with built-in persistence
- **Key Features**:
  - Automatic localStorage persistence with date serialization
  - Computed getters for derived state

### 3. Component Architecture

**Decision**: Compound component pattern with custom hooks
- **Rationale**: Reusable, composable components with clear separation of concerns
- **Structure**:
  - **Layout Components**: `MainLayout`, `AppHeader` for consistent UI structure
  - **Feature Components**: `ActivityBrowser`, `DraggableSchedule` for specific functionality
  - **UI Components**: Custom design system with `Button`, `Card`, `Badge`
  - **Custom Hooks**: `useWeekendPlan` for business logic abstraction

### 4. Data Flow Architecture

**Decision**: Unidirectional data flow with centralized state
- **Pattern**: Store → Hook → Component → Actions → Store
- **Benefits**: Predictable state updates, easy debugging, clear data lineage
- **Implementation**: Zustand store provides actions, hooks orchestrate UI state, components handle presentation

## Component Design Patterns

### 1. Compound Component Pattern

```typescript
// MainLayout acts as a container for consistent structure
<MainLayout currentPlan={plan} totalDuration={duration}>
  <WeekendSchedule />
  <ActivityModal />
</MainLayout>
```

### 2. Custom Hook Pattern

```typescript
// useWeekendPlan encapsulates complex business logic
const {
  activities,
  currentPlan,
  handleAddActivity,
  handleTemplateApply
} = useWeekendPlan();
```

### 3. Render Props & Children Pattern

```typescript
// Flexible component composition
<DraggableSchedule
  activities={saturdayActivities}
  onReorder={handleReorder}
  onRemoveActivity={handleRemove}
/>
```

### 4. Controlled vs Uncontrolled Components

**Decision**: Primarily controlled components for predictable state
- **Benefits**: Centralized state management, easier testing, better validation
- **Exception**: Form inputs with local state for performance optimization

## State Management Architecture

### 1. Store Structure

```typescript
interface WeekendStore {
  // Core state
  activities: Activity[];
  currentPlan: WeekendPlan | null;
  savedPlans: WeekendPlan[];
  selectedTheme: WeekendTheme | null;
  
  // Actions (business logic)
  createNewPlan: (name?, theme?) => void;
  addActivityToSchedule: (activity, day, startTime) => void;
  reorderActivities: (day, newOrder) => void;
  
  // Computed getters
  getSaturdayActivities: () => ScheduledActivity[];
  getTotalPlanDuration: () => number;
}
```

### 2. Smart Scheduling Logic

**Key Innovation**: Intelligent time slot management
- **Conflict Detection**: Prevents overlapping activities
- **Auto-scheduling**: Finds optimal time slots automatically
- **Drag & Drop**: Recalculates times when activities are reordered
- **Time Bounds**: Respects user-defined day start/end times

### 3. Persistence Strategy

```typescript
// Zustand persist middleware with custom serialization
persist(
  store,
  {
    name: 'weekendly-storage',
    partialize: (state) => ({
      currentPlan: state.currentPlan,
      savedPlans: state.savedPlans,
      selectedTheme: state.selectedTheme
    }),
    onRehydrateStorage: () => (state) => {
      // Convert string dates back to Date objects
      state.currentPlan?.saturday.forEach(activity => {
        activity.startTime = new Date(activity.startTime);
        activity.endTime = new Date(activity.endTime);
      });
    }
  }
)
```

## UI Polish & Design System

### 1. Design System

**Decision**: Custom component library with Tailwind CSS
- **Components**: `Button`, `Card`, `Badge`, `Modal` with consistent variants
- **Styling**: Tailwind with `clsx` and `tailwind-merge` for conditional classes
- **Responsive**: Mobile-first design with breakpoint-specific layouts

### 2. Animation & Interaction

**Libraries**: Framer Motion for complex animations, CSS transitions for micro-interactions
- **Drag & Drop**: @dnd-kit for accessible, performant drag interactions
- **Visual Feedback**: Hover states, loading indicators, smooth transitions
- **Accessibility**: Keyboard navigation, screen reader support, focus management


## Creative Features & Integrations

### 1. Location-Based Activity Discovery

**Innovation**: Real-time location services with Geoapify API integration
- **Features**:
  - GPS-based activity suggestions
  - Distance calculation and sorting
  - Category filtering (restaurants, parks, museums, etc.)
  - Custom duration setting for location activities
- **Implementation**:
  - Server-side API routes for secure API key management
  - Client-side geolocation with fallback handling
  - Mock data for development/demo purposes

```typescript
// Location service with fallbacks
class LocationService {
  async searchNearbyPlaces(location, radius, categories) {
    try {
      const response = await fetch(`/api/location/places?${params}`);
      return response.json();
    } catch (error) {
      return this.getMockPlaces(location);
    }
  }
}
```

### 2. Intelligent Scheduling Engine

**Key Features**:
- **Smart Time Slot Detection**: Automatically finds available time slots
- **Conflict Prevention**: Validates time overlaps before scheduling
- **Auto-adjustment**: Recalculates subsequent activities when times change
- **Capacity Management**: Prevents over-scheduling beyond day bounds

```typescript
// scheduling algorithm
function findNextAvailableSlot(activities, duration, day, timeBounds) {
  const { start: dayStart, end: dayEnd } = getDayTimeBounds(day, timeBounds);
  const sortedActivities = [...activities].sort((a, b) => 
    a.startTime.getTime() - b.startTime.getTime()
  );
  
  // Check gaps between activities
  for (let i = 0; i < sortedActivities.length - 1; i++) {
    const gapDuration = (nextStart - currentEnd) / 60000;
    if (gapDuration >= duration) return currentEnd;
  }
  
  return null; // No available slot
}
```

### 3. Sharing & Export

**Multi-format Export System**:
- **Text Format**: Shareable social media text with emojis
- **iCalendar**: Standard calendar import (.ics files)
- **Print Format**: Clean, printable weekend plans
- **Social Integration**: Direct Twitter sharing

### 4. Drag & Drop Scheduling

**Implementation**: @dnd-kit with accessibility features
- **Features**:
  - Visual drag feedback with drag overlay
  - Keyboard navigation support
  - Automatic time recalculation on reorder
  - Collision detection and smart positioning

### 5. Template System

**Weekend Templates**: Pre-curated activity collections
- **Themes**: Lazy, Adventurous, Family, Wellness, Social, Productive
- **Smart Application**: Auto-schedules template activities with optimal timing
- **Customization**: Users can modify template activities after application

### 6. Responsive Design Excellence

**Mobile-First Approach**:
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch Optimization**: Large touch targets, swipe gestures
- **Adaptive Layouts**: Grid to list view switching, collapsible sections
- **Performance**: Optimized images, lazy loading, minimal bundle size

## Technical Integrations

### 1. External APIs

**Geoapify Places API**:
- **Purpose**: Location-based activity discovery
- **Implementation**: Server-side API routes for security
- **Fallback**: Mock data for development and API failures
- **Rate Limiting**: Built-in request throttling

### 2. Browser APIs

**Geolocation API**: User location detection
**Clipboard API**: Copy-to-clipboard functionality
**Print API**: Custom print formatting
**LocalStorage**: Persistent state management

### 3. Performance Optimizations

**Code Splitting**: Dynamic imports for heavy components
**Memoization**: React.memo for expensive components
**Lazy Loading**: Deferred component loading
**Bundle Optimization**: Tree shaking and minimal dependencies

## Future Enhancements

### 1. Planned Features

**Weather Integration**: Activity suggestions based on weather
**Social Features**: Share plans with friends, collaborative planning
**Analytics**: Usage insights and activity recommendations
**Offline Support**: Service worker for offline functionality

### 2. Technical Improvements

**Database Integration**: Persistent storage beyond localStorage
**Real-time Sync**: Multi-device synchronization
**Performance**: Virtual scrolling for large activity lists
**Accessibility**: Enhanced screen reader support

## Conclusion

Weekendly demonstrates modern React development practices with a focus on user experience, performance, and maintainability. The architecture balances simplicity with functionality, providing a solid foundation for future enhancements while delivering immediate value to users planning their weekends.

The combination of intelligent scheduling, location-based discovery, and seamless sharing creates a comprehensive weekend planning experience that goes beyond simple task management to provide genuine utility and delight.
