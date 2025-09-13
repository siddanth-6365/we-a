# 🗓️ Weekendly - Weekend Planner

**Design your perfect weekend by choosing activities, moods, and themes. Create a personalized Saturday-Sunday schedule that makes every weekend memorable.**

![Weekendly](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-teal?style=for-the-badge&logo=tailwindcss)

## ✨ Features

### Core Functionality
- **🎯 Activity Browser**: Explore 25+ curated activities across 8 categories
- **📅 Interactive Schedule**: Build your weekend timeline with drag-and-drop
- **🎨 Weekend Themes**: Choose from 6 pre-built themes (lazy, adventurous, family, etc.)
- **💾 Persistent Storage**: Save multiple weekend plans locally
- **📤 Share & Export**: Generate calendar files, print-friendly versions, and shareable text

### Enhanced User Experience
- **🏃‍♀️ Drag & Drop**: Reorder activities with smooth animations
- **🎭 Mood Tracking**: Activities tagged with moods (energetic, relaxed, happy, etc.)
- **⏰ Smart Scheduling**: Automatic time slot management
- **📱 Responsive Design**: Works beautifully on all devices
- **🎨 Visual Polish**: Modern UI with smooth animations and micro-interactions

### Advanced Features
- **🔍 Smart Filtering**: Filter by category, mood, and search terms
- **📋 Activity Details**: Rich metadata including duration, flexibility, and descriptions
- **📊 Plan Analytics**: View total duration and activity counts
- **🗒️ Notes Support**: Add personal notes to any activity
- **🎁 Template System**: Quick-start with pre-configured weekend themes

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd weekendly
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Tech Stack

### Core Framework
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling

### State Management & Data
- **Zustand** - Lightweight state management with persistence
- **localStorage** - Client-side data persistence

### UI & Interactions
- **@dnd-kit** - Drag and drop functionality
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful icon system
- **Radix UI** - Accessible headless components

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **Tailwind CSS** - Responsive design system

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main application page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Badge.tsx
│   ├── ActivityBrowser.tsx
│   ├── ActivityCard.tsx
│   ├── WeekendSchedule.tsx
│   ├── DraggableSchedule.tsx
│   ├── ThemeSelector.tsx
│   ├── ShareExport.tsx
│   └── WelcomeScreen.tsx
├── data/                  # Static data and configurations
│   └── activities.ts     # Activity definitions and templates
├── lib/                   # Utility functions
│   └── utils.ts          # Common utilities
├── store/                 # State management
│   └── useWeekendStore.ts # Zustand store
└── types/                 # TypeScript type definitions
    └── index.ts          # Application types
```

## 🎯 Component Architecture

### Core Components
- **ActivityBrowser**: Filterable gallery of activities with search and categorization
- **WeekendSchedule**: Timeline view with day-by-day activity management
- **DraggableSchedule**: Drag-and-drop interface for reordering activities
- **ActivityCard**: Rich activity presentation with metadata and actions
- **ThemeSelector**: Weekend theme picker with template application
- **ShareExport**: Multi-format export functionality (calendar, print, text)
- **WelcomeScreen**: Onboarding experience for new users

### Design System
- **Consistent spacing**: 4px base unit system
- **Color palette**: Semantic color system with category-specific colors
- **Typography**: Clear hierarchy with readable font sizes
- **Responsive breakpoints**: Mobile-first design approach

## 🔧 Key Features Implementation

### State Management
```typescript
// Zustand store with persistence
const useWeekendStore = create()(
  persist(
    (set, get) => ({
      // State and actions
    }),
    { name: 'weekendly-storage' }
  )
)
```

### Drag & Drop
```typescript
// @dnd-kit implementation for smooth reordering
<DndContext
  sensors={sensors}
  collisionDetection={closestCenter}
  onDragEnd={handleDragEnd}
>
  <SortableContext items={activities}>
    {/* Draggable items */}
  </SortableContext>
</DndContext>
```

### Export Functionality
- **iCalendar**: RFC-compliant calendar files for universal compatibility
- **Print**: Styled HTML generation for physical copies
- **Text**: Formatted plain text for messaging and social media
- **Social**: Direct Twitter integration for sharing

## 📊 Performance Optimizations

- **Lazy Loading**: Components loaded on demand
- **Memoization**: Expensive calculations cached
- **Efficient Rendering**: Optimized re-render cycles
- **Local Storage**: Client-side persistence reduces server dependency

## 🎨 Design Principles

1. **User-Centric**: Interface designed around weekend planning workflow
2. **Visual Hierarchy**: Clear information architecture
3. **Accessibility**: Semantic HTML, keyboard navigation, ARIA labels
4. **Mobile-First**: Responsive design for all screen sizes
5. **Delightful Interactions**: Smooth animations and feedback

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Lucide** - For the beautiful icon system
- **@dnd-kit** - For the drag and drop functionality

---

**Built with ❤️ for better weekends**
