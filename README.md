# Multi-tenant Beauty Center Booking System

A Next.js application that enables beauty centers to showcase their services and allow clients to book appointments through a streamlined, intuitive interface.

## 🚀 Technical Assessment Implementation

This project addresses the "React/Next.js Challenge – Multi-tenant Booking System MVP" requirements:

### ✅ Center Landing Pages
- **Dynamic Routes**: `/[center]` (e.g., `/glamour-salon`, `/wellness-spa`) 
- **Features**: Each center displays its logo, name, description, and offered services
- **Implementation**: Server-side rendering for SEO optimization with dynamic data fetching

### ✅ Service Listings
- **Service Display**: Name, duration, price, and description for each service
- **Booking Option**: Each service has a "Book" button that opens the booking form
- **Implementation**: Responsive grid layout with optimized images

### ✅ Booking Form
- **Fields**: Client name, email, date, and time selection
- **Validation**: Date must be in the future, time slots are dynamically generated based on service duration and existing bookings
- **Business Rules**: Bookings only allowed during business hours (9 AM - 6 PM)
- **UX Features**: Loading states, error handling, and form validation

### ✅ Confirmation Process
- **Success Feedback**: Clear confirmation message showing booking details
- **Implementation**: Optimistic UI updates with server-side validation

## 💻 Technical Stack

- **Frontend**: 
  - Next.js 14 (App Router)
  - React (Functional Components & Hooks)
  - TypeScript
  - TailwindCSS
  - React Query (TanStack Query)

- **Backend**: 
  - Next.js Server Actions
  - Supabase (PostgreSQL Database)

- **Architecture**:
  - Server Components for data fetching
  - Client Components for interactivity
  - Optimistic UI updates
  - Server Actions for backend logic

## 🔧 Implementation Details

### Server Actions

Used Next.js server actions to implement backend logic directly in the frontend codebase, eliminating the need for a separate API layer. This provides:

- Type-safe client-server communication
- Reduced API boilerplate
- Better developer experience
- Server-side validation

### State Management

- React Query for server state management with optimized caching strategies to minimize unnecessary requests
- Local React state for UI state
- Transition hooks for loading states

### Database Design

Supabase implementation with the following tables:

- **centers**: Center information (name, description, image_url, slug)
- **services**: Services offered by centers (name, description, duration, price)
- **bookings**: Client bookings (center, service, client details, date/time)

### Timezone Handling

Special care was taken to handle timezones consistently throughout the application:

- All times stored and processed in local timezone
- Booking slots generated in local timezone (9 AM - 6 PM)
- Validation ensures consistent time handling

## 🛠️ Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd booking-system-mvp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase**:
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - After creating your project, navigate to the SQL Editor
   - Copy the contents of the `/supabase/schema.sql` file from this repository
   - Paste it into the SQL Editor and click "Run" to create all necessary tables and seed data
   - This will set up:
     - Tables: `centers`, `services`, and `bookings`
     - Sample data for 3 beauty centers and their services
     - Performance indexes for query optimization

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Access the application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
/app
  /[center]                # Center landing page routes
  /actions                 # Server actions
/components
  /ui                      # Reusable UI components
  /booking-form-simple.tsx # Booking form component
  /booking-modal.tsx       # Modal for booking
/lib
  /hooks                   # Custom React hooks
  /supabase                # Supabase client
  /types.ts                # TypeScript interfaces
  /utils                   # Utility functions
```

## 🤔 Technical Decisions & Rationale

1. **Next.js App Router & Server Actions**:
   - Leveraged the latest Next.js features for optimal performance
   - Server Actions provide a clean architecture for handling server-side logic

2. **Supabase over localStorage**:
   - Chose Supabase for persistence instead of localStorage for scalability
   - Enables potential future features like admin dashboards and multi-user access

3. **React Query**:
   - Implemented for efficient data fetching and cache management
   - Reduced unnecessary API calls with proper caching strategies

4. **TypeScript**:
   - Used throughout for type safety and improved developer experience
   - Created interfaces for all data structures

5. **TailwindCSS**:
   - Rapid UI development with consistent design language
   - Responsive design out of the box

## ⏰ Development Time

Total development time: Approximately 3 hours

## 🚀 Deployed Application

[Link to deployed application](https://booking-system-mvp.vercel.app/)

## 🔮 Future Improvements

With additional time, I would implement:

1. **Admin Dashboard**:
   - Center owners could manage their services and view/manage bookings
   - Analytics and reporting features

2. **Authentication**:
   - User accounts for clients to manage their bookings
   - Admin authentication for center management

3. **Enhanced Booking Experience**:
   - Email notifications for booking confirmations
   - Calendar view for available slots
   - SMS reminders for upcoming appointments

4. **Performance Optimizations**:
   - Implement more efficient caching strategies
   - Add Incremental Static Regeneration for center pages

5. **Additional Features**:
   - Payment processing integration
   - Review and rating system
   - Staff assignment to bookings
   - Recurring appointment booking

## 🤖 AI Tools Usage

AI assistance was used during development for:

- Debugging complex timezone issues
- Refactoring from API routes to Server Actions
- Optimizing React Query configurations

**Pros**:
- Accelerated development of boilerplate code
- Provided insights for optimizing data fetching strategies
- Helped with debugging timezone-related edge cases

**Cons**:
- Some generated code required additional optimization
- Occasional misunderstanding of Next.js Server Actions specifics
- Required careful review to ensure best practices

## 📝 Conclusion

This booking system MVP successfully implements all the required features of the technical assessment while demonstrating modern React and Next.js development practices. The architecture is designed to be scalable and maintainable, with clean separation of concerns and type safety throughout.
