# Smart City & Air Quality Dashboard

## Overview

This is a client-side web application that visualizes NASA Earth observation data including air quality (AQI), temperature, and vegetation indices (NDVI) for major cities worldwide. The dashboard provides an interactive map-based interface with time-series visualizations and city-specific analytics spanning 2020-2024. Built with vanilla JavaScript, the application uses Leaflet.js for mapping and Chart.js/Plotly.js for data visualization, featuring a modern glassmorphism design with a futuristic aesthetic.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Single-Page Application (SPA) Pattern**
- Pure vanilla JavaScript implementation without frameworks
- DOM manipulation for dynamic content updates
- Event-driven architecture for user interactions
- Rationale: Minimizes complexity and dependencies while maintaining full control over performance and behavior

**Component Structure**
- Modular JavaScript with separation of concerns:
  - Map initialization and management
  - Chart rendering and updates
  - Data filtering and transformation
  - UI state management
- Each major feature (map, charts, filters) encapsulated in dedicated functions
- Pros: Easy to maintain and debug; straightforward for additions
- Cons: May become unwieldy as application scales; no built-in state management

**Data Management**
- Static in-memory data storage via `cityData` object in `data.js`
- Structure: Nested objects with city → year → metrics hierarchy
- Metrics tracked: AQI (Air Quality Index), temperature, NDVI (vegetation), temperature change
- Current approach: Client-side data only, no persistence layer
- Design decision: Suitable for prototype/demo; would need backend for production scale

### UI/UX Design Patterns

**Glassmorphism Design System**
- Semi-transparent panels with backdrop blur effects
- CSS custom properties for consistent theming (blue-green-white palette)
- Rationale: Modern aesthetic that aligns with data visualization and "smart city" theme
- Implementation: CSS variables in `:root` for easy theme customization

**Three-Column Dashboard Layout**
- Left sidebar: Control panel with filters and settings
- Center: Primary interactive map view (Leaflet.js)
- Right sidebar: Analytics charts and statistics
- Responsive design: Grid/flexbox layout adapts to screen sizes
- Trade-off: Rich desktop experience may require simplified mobile layout

**Real-time Visual Feedback**
- Loading screens during initialization
- Alert banners for air quality warnings
- Smooth CSS transitions on interactions
- Hover tooltips on map markers
- Design principle: Keep users informed of system state

### Mapping Solution

**Leaflet.js Integration**
- Open-source mapping library for interactive city visualization
- CartoDB dark theme tiles for modern appearance
- Custom marker system for city locations
- Alternatives considered: Mapbox.js (more features but requires API key), Google Maps (licensing concerns)
- Chosen approach pros: Free, lightweight, highly customizable
- Chosen approach cons: More manual work for advanced features

**Marker Management**
- Dynamic marker creation based on filtered data
- Color-coding by AQI levels
- Popup/tooltip system for detailed city information
- Global marker array for efficient updates when filters change

### Data Visualization

**Chart.js/Plotly.js Implementation**
- Multiple chart types: line graphs (AQI trends), bar charts (temperature/NDVI)
- Time-series analysis from 2020-2024
- Interactive legends and hover states
- Problem solved: Complex data needs visual representation for pattern recognition
- Why dual library mention: Project allows flexibility; Chart.js is simpler, Plotly.js more powerful

**Dashboard Metrics**
- Real-time calculated statistics (averages, changes over time)
- Quick-view stat cards for at-a-glance information
- Updates synchronized with filter changes (year slider, city selection)

### State Management

**Client-Side State Variables**
- `currentYear`: Tracks selected year for filtering
- `currentCity`: Tracks selected city or "all cities" view
- `markers`: Array maintaining map marker references
- `charts`: Object storing chart instances for updates
- Rationale: Simple global state sufficient for small application scope
- Limitation: Would need proper state management library (Redux, MobX) for larger scale

### Performance Considerations

**Lazy Loading Strategy**
- Loading screen hides complexity during initialization
- Charts and map tiles load progressively
- Design decision: Prioritize perceived performance over actual load time

**DOM Manipulation Efficiency**
- Direct DOM access via `getElementById`
- Minimal re-renders by updating only changed elements
- Chart updates use library-specific update methods rather than full re-initialization
- Trade-off: More manual optimization vs. framework virtual DOM automation

## External Dependencies

### Mapping Services
- **Leaflet.js v1.9.4** - Core mapping library (CDN: unpkg.com)
- **CartoDB Basemaps** - Dark-themed map tiles (basemaps.cartocdn.com)
- Purpose: Interactive geographic visualization of city data
- API requirements: None (public tile service)

### Data Visualization
- **Chart.js or Plotly.js** - Time-series and statistical charting
- Usage: AQI trends, temperature/NDVI bar charts, comparative analytics
- Integration: Script tag inclusion, programmatic chart instantiation

### UI Components
- **Font Awesome v6.4.0** - Icon library for UI elements (CDN: cdnjs.cloudflare.com)
- **Google Fonts (Poppins)** - Primary typography
- Purpose: Consistent visual language and modern aesthetics

### Data Sources
- **NASA Earth Observation Data** - Conceptual data source (MODIS, LANDSAT, TEMPO satellites)
- Current implementation: Hardcoded sample data in `data.js`
- Future consideration: Would integrate with NASA APIs (e.g., NASA EarthData API) for real-time data
- Metrics: Air Quality Index, temperature readings, NDVI vegetation indices

### Browser APIs
- **DOM API** - Core manipulation and event handling
- **CSS Custom Properties** - Dynamic theming
- **localStorage** - Potential future use for user preferences persistence

### Development Dependencies
None currently - pure client-side application with CDN resources only. No build process, package manager, or bundler required.