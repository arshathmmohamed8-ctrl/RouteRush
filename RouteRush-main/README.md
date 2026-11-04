# RouteRush

RouteRush is a production-ready, smart intercity bus reservation platform built with modern web technologies. 
It provides a seamless experience for travelers to discover, compare, and reserve bus journeys, alongside dedicated unified dashboards for Operators and Administrators.

## Features

- **For Travelers:**
  - Modern, glassmorphism-inspired UI with Framer Motion transitions.
  - Interactive Search with dynamic filtering by Price, AC/Non-AC, Bus Type, Time slots, and Ratings.
  - Interactive Seat Selection (2+2 layout, Ladies, Premium seats).
  - Booking Flow with Mock Payment Gateways & Coupon validation.
  - Light/Dark mode toggle built-in.
  - Manage trips through the unified User Profile and My Bookings pages.

- **For Operators:**
  - Unified tab-based Operator Dashboard.
  - Manage fleet of buses (Add, Edit, Activate).
  - Schedule and manage trips/routes.
  - Track real-time bookings and revenue analytics via Recharts.

- **For Administrators:**
  - Unified Admin Dashboard for platform-wide metrics.
  - Manage users, verifying operators, and overseeing all platform buses and routes.
  - Issue system-wide promotional offers (e.g. `RUSH10`, `FLAT100`).

## 🛠️ Technology Stack

- **Frontend:** React 19, Vite 8, Tailwind CSS (Custom Design System)
- **State Management:** React Context (Auth, Theme, Booking)
- **UI Components:** Radix UI primitives, Lucide React icons, Framer Motion
- **Data Fetching / Forms:** React Hook Form, Zod validation
- **Charts:** Recharts
- **Backend / Database:** Supabase (PostgreSQL, Auth, RLS)

## Local Setup Guide

1. **Clone & Install**
   ```bash
   git clone <repository_url>
   cd RouteRush
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   *Note: The platform features robust mock fallbacks allowing you to explore the UI immediately even if Supabase is offline or misconfigured.*

3. **Start the Development Server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

4. **Database Initialization (Optional)**
   If you wish to host your own backend:
   - Create a project on [Supabase](https://supabase.com).
   - Execute the SQL from `supabase/schema.sql` (if you extracted it) to create the tables.
   - Execute the SQL from `supabase/seed.sql` to populate sample cities, routes, and initial users.

## Project Architecture

- `src/components/common/` - Reusable UI elements (Buttons, Cards, Modals, Spinners, Skeletons)
- `src/components/layout/` - Page wrapper, Navbar, and Footer
- `src/context/` - Auth, Booking, and Theme providers
- `src/pages/` - All route pages modularized by feature (Auth, Home, Search, Bus, Booking, Account, Admin, Operator, Contact)
- `src/constants/` - App-wide constants (Cities, Bus Types, Icons mapping)
- `src/services/` - Supabase data-fetching abstraction layer with integrated mock fallbacks

## License

MIT License. Built as a portfolio demonstration for Full Stack Development.
