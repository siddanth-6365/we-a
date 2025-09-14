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

## ✨ Features

- **Smart Scheduling**: Intelligent time slot management with conflict detection
- **Location-Based Activities**: Discover nearby places using GPS and Geoapify API
- **Drag & Drop Interface**: Intuitive activity reordering with @dnd-kit
- **Multiple Export Formats**: Share plans via text, iCalendar, or print
- **Responsive Design**: Mobile-first approach with touch-friendly interactions
- **Weekend Templates**: Pre-curated activity collections for different themes
- **Persistent Storage**: Local storage with Zustand for offline functionality

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand with persistence
- **Animations**: Framer Motion
- **Drag & Drop**: @dnd-kit
- **Icons**: Lucide React
- **Location Services**: Geoapify API

## 📁 Project Structure

```
src/
├── app/                 # Next.js app router
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   └── ...             # Feature components
├── hooks/              # Custom React hooks
├── store/              # Zustand store
├── lib/                # Utilities and services
├── types/              # TypeScript definitions
└── data/               # Static data
```

## 🏗️ Architecture

- **Component Design**: Modular architecture with compound components
- **State Management**: Centralized business logic with custom hooks
- **Type Safety**: Comprehensive TypeScript coverage
- **Performance**: Optimized rendering and lazy loading

## 📚 Documentation

For detailed technical information, architecture decisions, and implementation details, see [TECHNICAL_DOCUMENTATION.md](./TECHNICAL_DOCUMENTATION.md).

## 🚀 Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```
