# CairoGO - Technology Stack Summary

## Overview
CairoGO is built as a modern, single-page application (SPA) using React with TypeScript, following current web development best practices.

---

## Core Framework & Language

### React 19.2.0
- **Purpose:** UI library for building user interfaces
- **Version:** 19.2.0 (Latest stable)
- **Usage:** Component-based architecture, hooks for state management
- **Features Used:**
  - Functional components
  - React Hooks (useState, useEffect, useMemo, etc.)
  - Component composition
  - Event handling

### React DOM 19.2.0
- **Purpose:** React renderer for web browsers
- **Version:** 19.2.0
- **Usage:** Renders React components to the DOM

### TypeScript ~5.9.3
- **Purpose:** Typed superset of JavaScript
- **Version:** 5.9.3
- **Usage:** 
  - Type safety throughout the application
  - Interface definitions
  - Type checking at compile time
  - Better IDE support and autocomplete
- **Configuration Files:**
  - `tsconfig.json` - Main TypeScript configuration
  - `tsconfig.app.json` - Application-specific config
  - `tsconfig.node.json` - Node.js-specific config

---

## Build Tools & Development

### Vite 7.3.0
- **Purpose:** Next-generation frontend build tool
- **Version:** 7.3.0
- **Features:**
  - Fast Hot Module Replacement (HMR)
  - Optimized production builds
  - Native ES modules support
  - Fast development server
- **Configuration:** `vite.config.ts`
- **Proxy Setup:** Configured to proxy `/backend` requests to `http://cairogo.runasp.net`

### @vitejs/plugin-react 5.1.0
- **Purpose:** Vite plugin for React support
- **Version:** 5.1.0
- **Usage:** Enables React Fast Refresh and JSX transformation

### Babel Plugin React Compiler 1.0.0
- **Purpose:** React compiler for automatic optimization
- **Version:** 1.0.0
- **Usage:** Automatically optimizes React components during build

---

## State Management

### Redux Toolkit 2.11.0
- **Purpose:** Modern Redux state management
- **Version:** 2.11.0
- **Features Used:**
  - `configureStore` - Store configuration
  - `createApi` - RTK Query for API calls
  - `createSlice` - Reducer creation
  - Middleware configuration
- **Usage:**
  - Global application state
  - Authentication state
  - API state management

### React Redux 9.2.0
- **Purpose:** React bindings for Redux
- **Version:** 9.2.0
- **Usage:**
  - `useSelector` - Access Redux state
  - `useDispatch` - Dispatch actions
  - `Provider` - Redux store provider

### @types/react-redux 7.1.34
- **Purpose:** TypeScript type definitions for React Redux
- **Version:** 7.1.34

---

## Routing

### React Router DOM 7.9.6
- **Purpose:** Client-side routing for React applications
- **Version:** 7.9.6 (Latest)
- **Features Used:**
  - `BrowserRouter` - Router component
  - `Routes` & `Route` - Route definitions
  - `Link` - Navigation links
  - `useNavigate` - Programmatic navigation
  - `useParams` - URL parameters
  - `useSearchParams` - Query string handling
- **Routes Implemented:**
  - Home (`/`)
  - Login/Register (`/login`, `/register`)
  - Quiz (`/quiz`, `/quiz/results`)
  - Browse (`/browse`)
  - Recommendations (`/recommendations`)
  - Trip Planner (`/trip-planner`)
  - Attraction Details (`/attraction/:id`)
  - Favorites (`/favourites`)
  - User Profile (`/profile`) - Protected route
  - Help & Legal pages

### @types/react-router-dom 5.3.3
- **Purpose:** TypeScript types for React Router DOM
- **Version:** 5.3.3

---

## Styling & UI Components

### Tailwind CSS 3.4.18
- **Purpose:** Utility-first CSS framework
- **Version:** 3.4.18
- **Usage:**
  - Responsive design utilities
  - Color system (orange #FF6B35 as primary)
  - Spacing, typography, layout utilities
  - Custom theme configuration
- **Configuration:** `tailwind.config.js`
- **Custom Extensions:**
  - Custom font family (Outfit)
  - Extended theme configuration

### DaisyUI 4.12.24
- **Purpose:** Component library built on Tailwind CSS
- **Version:** 4.12.24
- **Components Used:**
  - Buttons (`btn`)
  - Cards
  - Forms (`input`, `select`)
  - Modals
  - Navigation components
- **Themes:** Light, Dark, Cupcake
- **Configuration:** Integrated in `tailwind.config.js`

### PostCSS 8.5.6
- **Purpose:** CSS processing tool
- **Version:** 8.5.6
- **Usage:** Processes Tailwind CSS

### Autoprefixer 10.4.22
- **Purpose:** Automatically adds vendor prefixes to CSS
- **Version:** 10.4.22
- **Usage:** Browser compatibility for CSS

---

## HTTP Client & API

### Axios 1.13.2
- **Purpose:** HTTP client for making API requests
- **Version:** 1.13.2
- **Usage:**
  - API calls to backend
  - Request/response interceptors
  - Error handling
  - Authentication headers

### RTK Query (via Redux Toolkit)
- **Purpose:** Data fetching and caching solution
- **Usage:**
  - `createApi` - API slice creation
  - `fetchBaseQuery` - Base query configuration
  - Automatic caching
  - Tag-based cache invalidation
- **Features:**
  - Automatic token refresh
  - Request retry logic
  - Error handling
  - Loading states

---

## Icons & Assets

### React Icons 5.5.0
- **Purpose:** Popular icon library for React
- **Version:** 5.5.0
- **Icon Libraries Used:**
  - `react-icons/fa` - Font Awesome icons
  - `react-icons/md` - Material Design icons
  - `react-icons/hi2` - Heroicons v2
  - `react-icons/ci` - Circum Icons
  - `react-icons/go` - GitHub Octicons
  - `react-icons/lu` - Lucide icons
  - `react-icons/tb` - Tabler icons
  - `react-icons/io5` - Ionicons 5

---

## Code Quality & Linting

### ESLint 9.39.1
- **Purpose:** JavaScript/TypeScript linter
- **Version:** 9.39.1
- **Configuration:** `eslint.config.js`
- **Plugins:**
  - `@eslint/js` - ESLint JavaScript rules
  - `eslint-plugin-react-hooks` - React Hooks rules
  - `eslint-plugin-react-refresh` - React Fast Refresh rules
  - `typescript-eslint` - TypeScript-specific rules

### @eslint/js 9.39.1
- **Purpose:** ESLint JavaScript rules
- **Version:** 9.39.1

### ESLint Plugin React Hooks 7.0.1
- **Purpose:** Enforces React Hooks rules
- **Version:** 7.0.1

### ESLint Plugin React Refresh 0.4.24
- **Purpose:** React Fast Refresh linting rules
- **Version:** 0.4.24

### TypeScript ESLint 8.46.3
- **Purpose:** TypeScript-specific ESLint rules
- **Version:** 8.46.3

### Globals 16.5.0
- **Purpose:** Global variable definitions for ESLint
- **Version:** 16.5.0

---

## Type Definitions

### @types/node 24.10.0
- **Purpose:** TypeScript types for Node.js
- **Version:** 24.10.0

### @types/react 19.2.2
- **Purpose:** TypeScript types for React
- **Version:** 19.2.2

### @types/react-dom 19.2.2
- **Purpose:** TypeScript types for React DOM
- **Version:** 19.2.2

---

## Backend Integration

### API Base URL
- **Development:** Configured via environment variable `VITE_API`
- **Production:** `https://cairogo.runasp.net`
- **Proxy:** Vite dev server proxies `/backend` requests

### API Endpoints Used:
- **Authentication:**
  - `/api/Auth/me` - Get current user
  - `/api/Auth/login` - User login
  - `/api/Auth/register` - User registration
  - `/api/Auth/refresh-token` - Token refresh

- **Places:**
  - `/api/Places/` - Get attractions
  - `/api/Places/cost` - Filter by cost
  - `/api/Places/category` - Filter by category
  - `/api/Places/weather` - Filter by indoor/outdoor

- **Vibe Tags:**
  - `/api/PlaceVibeTag/place/{placeId}` - Get vibe tags for place

- **Trip Planning:**
  - `/api/TripPlane/user/{userId}` - Get user trip plans
  - `/api/TripPlane/day/{tripId}` - Get trip days
  - `/api/TripDay/trip/{tripId}` - Get trip day details

---

## Storage & Data Management

### LocalStorage
- **Purpose:** Client-side persistent storage
- **Usage:**
  - User authentication tokens
  - User profile data
  - Favorites list
  - User preferences

### SessionStorage
- **Purpose:** Session-based storage
- **Usage:**
  - Quiz results (temporary)
  - Search queries
  - Temporary form data

---

## Development Scripts

### Available Commands:
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

---

## Architecture Patterns

### Component Architecture
- **Functional Components:** All components use function syntax
- **Hooks:** Extensive use of React Hooks
- **Component Composition:** Reusable component patterns
- **Props Typing:** TypeScript interfaces for props

### State Management Pattern
- **Redux Toolkit:** Global state (auth, API)
- **Local State:** Component-level state with useState
- **Derived State:** useMemo for computed values
- **Side Effects:** useEffect for API calls and subscriptions

### Routing Pattern
- **Protected Routes:** Authentication-based route guards
- **Dynamic Routes:** Parameter-based routes (`/attraction/:id`)
- **Query Parameters:** Search and filter state in URL
- **Scroll Management:** ScrollToTop component

### API Integration Pattern
- **RTK Query:** Centralized API management
- **Automatic Caching:** Tag-based cache invalidation
- **Token Management:** Automatic token refresh
- **Error Handling:** Centralized error handling

---

## Key Features & Technologies

### Responsive Design
- **Tailwind CSS:** Mobile-first responsive utilities
- **Breakpoints:** sm, md, lg, xl (default Tailwind breakpoints)
- **Flexible Layouts:** Grid and Flexbox utilities

### Performance Optimizations
- **Code Splitting:** Route-based code splitting (React Router)
- **Memoization:** useMemo for expensive computations
- **Lazy Loading:** Component lazy loading where applicable
- **Image Optimization:** Efficient image handling

### Accessibility
- **Semantic HTML:** Proper HTML elements
- **ARIA Labels:** Accessibility attributes
- **Keyboard Navigation:** Full keyboard support
- **Screen Reader Support:** Proper labeling

### Browser Support
- **Modern Browsers:** Chrome, Firefox, Safari, Edge (latest versions)
- **ES Modules:** Native ES module support
- **Autoprefixer:** Vendor prefix support for older browsers

---

## Project Structure

```
src/
├── app/
│   └── api/          # Redux store and API slice
├── components/       # React components
├── features/        # Feature modules (auth)
├── pages/           # Page components
├── services/        # Service layer (API calls)
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── data/            # Data fetching logic
└── media/           # Static assets (images, logos)
```

---

## Environment Variables

### Required Variables:
- `VITE_API` - Backend API base URL

### Example:
```env
VITE_API=https://cairogo.runasp.net/api
```

---

## Summary Statistics

### Total Dependencies: 21
- **Production Dependencies:** 9
- **Development Dependencies:** 12

### Technology Categories:
- **Core Framework:** React 19.2.0
- **Language:** TypeScript 5.9.3
- **Build Tool:** Vite 7.3.0
- **State Management:** Redux Toolkit 2.11.0
- **Routing:** React Router DOM 7.9.6
- **Styling:** Tailwind CSS 3.4.18 + DaisyUI 4.12.24
- **HTTP Client:** Axios 1.13.2
- **Icons:** React Icons 5.5.0
- **Linting:** ESLint 9.39.1

### Modern Features:
✅ Latest React (19.2.0)
✅ TypeScript for type safety
✅ Modern build tool (Vite)
✅ Component-based architecture
✅ State management (Redux Toolkit)
✅ Responsive design
✅ Code quality tools (ESLint)
✅ Fast development experience (HMR)

---

## Technology Highlights

### Why These Technologies?

**React 19.2.0:**
- Industry standard for modern web UIs
- Large ecosystem and community
- Excellent performance
- Component reusability

**TypeScript:**
- Type safety reduces bugs
- Better IDE support
- Improved code maintainability
- Self-documenting code

**Vite:**
- Fastest development experience
- Optimized production builds
- Native ES modules
- Excellent developer experience

**Redux Toolkit:**
- Predictable state management
- Excellent DevTools
- RTK Query for API management
- Industry standard

**Tailwind CSS:**
- Rapid UI development
- Consistent design system
- Small bundle size
- Highly customizable

**React Router:**
- Industry standard routing
- Excellent TypeScript support
- Flexible routing patterns
- Active development

---

## Future Technology Considerations

### Potential Additions:
- **Testing:** Jest, React Testing Library
- **E2E Testing:** Playwright, Cypress
- **State Management:** Consider React Query as alternative
- **Form Handling:** React Hook Form
- **Animation:** Framer Motion
- **Charts:** Recharts, Chart.js
- **Maps:** Google Maps API, Mapbox
- **PWA:** Service Workers, Workbox

---

## Conclusion

CairoGO is built with a modern, production-ready technology stack that emphasizes:
- **Developer Experience:** Fast development with Vite and TypeScript
- **User Experience:** Fast, responsive, accessible interface
- **Maintainability:** Type safety, code quality tools, organized structure
- **Scalability:** Modular architecture, efficient state management
- **Performance:** Optimized builds, code splitting, efficient rendering

The technology choices reflect current best practices in modern web development, ensuring the application is maintainable, performant, and provides an excellent user experience.



