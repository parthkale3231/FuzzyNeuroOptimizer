# FNEEO - Fuzzy-Neuro Environmental Equilibrium Optimizer

## Overview

FNEEO is a smart urban climate regulation system that uses fuzzy logic and real-time environmental data to maintain micro-climate balance in urban smart cities. The system monitors temperature, pollution, traffic, energy, and water usage through IoT sensors and automatically executes control actions to optimize city conditions. It provides a real-time dashboard for monitoring environmental metrics, fuzzy rule evaluation, and automated control decisions across multiple city zones.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool. The application follows a component-based architecture with reusable UI components built on top of Radix UI primitives and styled with Tailwind CSS.

**State Management**: Uses TanStack React Query for server state management and WebSocket connections for real-time data streaming. No global state management library is employed; instead, the application relies on React hooks and local component state.

**Styling Approach**: Tailwind CSS with a custom design system based on the "New York" shadcn/ui variant. The design combines Linear's clean minimalism with modern environmental tech aesthetics. Supports both light and dark modes with theme persistence via localStorage.

**Real-time Communication**: WebSocket connection at `/fneeo-ws` endpoint provides continuous streaming of dashboard state including sensor data, fuzzy rule evaluations, control actions, and zone statuses.

### Backend Architecture

**Server Framework**: Express.js with TypeScript running in ESM module mode. The server handles both HTTP API routes and WebSocket connections on the same server instance.

**Real-time Data Flow**: RealDataService fetches real environmental data from Open-Meteo API (temperature, humidity, wind speed, air quality). Weather and air quality data are cached for 5 minutes to optimize API usage. Time-based patterns for traffic, energy, and water usage are calculated based on time of day. The fuzzy logic engine evaluates rules every 2 seconds and broadcasts updates to all connected WebSocket clients.

**Fuzzy Logic Engine**: Implements fuzzy membership functions (low/medium/high) for environmental parameters. Rules are evaluated based on fuzzy logic principles with confidence scores, and active rules trigger automated control actions. The system uses AND/OR logic combinations to determine when to execute specific control strategies.

**Data Persistence**: Currently uses in-memory storage (MemStorage class) for user data. The system is structured to support database integration through the IStorage interface, with Drizzle ORM and PostgreSQL schema already configured but not yet connected.

### Data Storage

**Planned Database**: PostgreSQL configured via Drizzle ORM with schema defined in `shared/schema.ts`. Currently only contains a users table with username/password fields.

**Current Storage**: In-memory Map-based storage for development. The storage layer is abstracted through the IStorage interface, allowing easy swapping to database-backed storage.

**Session Management**: Configured for PostgreSQL session storage using connect-pg-simple, though not actively implemented in the current codebase.

### Design System

**Typography**: Three-font system using Inter for UI/body text, Space Grotesk for headings, and JetBrains Mono for data displays and monospaced content.

**Color Palette**: 
- Primary (Environmental Green): Represents ecological balance
- Secondary (Neural Blue): Represents AI/neural networks  
- Accent (Energy Amber): For alerts and energy indicators
- Custom chart colors for data visualization

**Component Library**: shadcn/ui components with custom modifications. All components support hover and active elevation states for interactive feedback.

### WebSocket Protocol

**Connection Path**: `/fneeo-ws`

**Message Types**:
- Outbound: Complete dashboard state broadcasts every 2 seconds containing current sensor readings, fuzzy rule statuses, control action history, zone data, and time-series chart data
- Inbound: Location update messages to change the monitored zone/sector

**Reconnection Logic**: Automatic reconnection with 3-second delay on connection loss

## External Dependencies

### UI Framework
- **React**: Core UI library
- **Radix UI**: Headless component primitives for accessible UI components
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Recharts**: Charting library for environmental data visualization
- **Lucide React**: Icon library

### Server Infrastructure
- **Express.js**: Web server framework
- **WebSocket (ws)**: Real-time bidirectional communication
- **Vite**: Development server and build tool with HMR support

### Database & ORM (Configured but not actively used)
- **Drizzle ORM**: TypeScript-first ORM with PostgreSQL dialect
- **@neondatabase/serverless**: Neon serverless PostgreSQL driver
- **connect-pg-simple**: PostgreSQL session store

### Development Tools
- **TypeScript**: Type safety across frontend and backend
- **tsx**: TypeScript execution for development server
- **esbuild**: Backend bundler for production builds

### Form Handling & Validation
- **React Hook Form**: Form state management
- **Zod**: Schema validation with Drizzle integration via drizzle-zod

### Third-party APIs
- **Open-Meteo Weather API**: Free real-time weather data (temperature, humidity, wind speed) without API key requirement
- **Open-Meteo Air Quality API**: Free air quality data (PM2.5, carbon monoxide) without API key requirement
- **OpenStreetMap Nominatim API**: Geocoding and reverse geocoding for location search and coordinate-to-address conversion
- **Browser Geolocation API**: User location detection

### Development Platform
- **Replit-specific plugins**: Cartographer, dev banner, and runtime error overlay for Replit environment integration