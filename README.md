# Mess Management Next.js

A comprehensive mess management system built with Next.js and Tailwind CSS for tracking meals, expenses, and member contributions with full authentication, mess-specific data management, and dark mode support.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

4. **Sign in with demo credentials:**
   - **Admin:** john@example.com / password123
   - **Member:** mike@example.com / password123

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Features

### 🔐 Authentication System
- **Sign Up** (`/auth/signup`) - Create account with role selection (Member/Admin)
  - Members can join existing messes
  - Admins can create new messes
- **Sign In** (`/auth/signin`) - Secure user authentication
- **Sign Out** - Logout functionality with session management
- **Persistent Sessions** - Login state preserved across browser sessions

### 🌙 Dark Mode Support
- **Theme Toggle** - Switch between light and dark modes
- **Persistent Theme** - Theme preference saved in localStorage
- **System Integration** - Automatic theme switching
- **Beautiful UI** - Optimized colors for both themes
- **Accessibility** - High contrast and readable text in both modes

### 🏠 Mess Management
- **Multi-Mess Support** - Multiple messes with separate data
- **Mess Selection** - Users join specific messes during registration
- **Mess-Specific Data** - All data is filtered by selected mess
- **Role-Based Access** - Different permissions for admins and members

### 📊 Dashboard (`/dashboard`)
- **Real-time Statistics** - Live data from mess-specific information
- **Total Meals** - Monthly meal count for the mess
- **Total Deposits** - Total member contributions
- **Total Bazaar Cost** - Total shopping expenses
- **Mess Current Balance** - Available balance calculation
- **Member Summary** - All mess members with balances and meal counts
- **Recent Activities** - Latest meals and bazaar items
- **Daily Meal Statistics** - 7-day meal consumption chart
- **Member Balances Graph** - Visual balance distribution

### 🍽️ Meal Management (`/meals`)
- **Add Meals** - Record meals for mess members
- **Member Selection** - Dropdown with mess members
- **Meal Types** - Breakfast, Lunch, Dinner tracking
- **Date & Time** - Precise meal timing
- **Real-time Updates** - Immediate data reflection

### 🛒 Bazaar Management (`/bazaar`)
- **Add Shopping Items** - Record mess expenses
- **Category System** - Grains, Vegetables, Protein, Cooking, Spices, Others
- **Buyer Tracking** - Track who made purchases
- **Cost Management** - Total cost calculations
- **Category Breakdown** - Expense analysis by category

### 💰 Deposits Management (`/deposits`)
- **Member Contributions** - Record member payments
- **Payment Methods** - Cash, Bank Transfer, Mobile Banking, Check
- **Balance Updates** - Automatic member balance calculations
- **Payment Summary** - Breakdown by payment method
- **Real-time Balances** - Live balance updates

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   │   ├── signin/        # Sign in page
│   │   └── signup/        # Sign up page with mess selection
│   ├── dashboard/         # Main dashboard with real data
│   ├── meals/             # Meal management
│   ├── bazaar/            # Bazaar cost tracking
│   ├── deposits/          # Deposit management
│   ├── layout.js          # Root layout with providers
│   ├── page.js            # Home page (redirects to dashboard)
│   └── globals.css        # Global styles with dark mode
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── navigation.js     # Sidebar navigation with auth
│   └── ThemeToggle.js    # Dark/light mode toggle
├── contexts/             # React contexts
│   ├── AuthContext.js    # Authentication and data management
│   └── ThemeContext.js   # Theme management
├── data/                 # Central data storage
│   └── mess-data.json    # JSON data for messes, users, meals, etc.
public/                   # Static assets
```

## Tech Stack

- **Next.js 15** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework with dark mode
- **shadcn/ui** - Beautiful, accessible UI components
- **JavaScript** - No TypeScript (as requested)
- **React Context** - State management for authentication and themes
- **Local Storage** - Session and theme persistence
- **JSON Data** - Central data storage (simulates database)

## Data Management

### Central JSON Structure
- **Messes** - Mess information and settings
- **Users** - Member profiles with roles and balances
- **Meals** - Meal entries linked to users and messes
- **Deposits** - Payment records with balance updates
- **Bazaar** - Shopping expenses with categories

### Authentication Flow
1. **Registration** - Users sign up and select/join a mess
2. **Login** - Users authenticate and access their mess
3. **Session Management** - Persistent login state
4. **Data Filtering** - All data filtered by user's mess
5. **Logout** - Clear session and redirect to login

## Theme System

### Dark Mode Features
- **Automatic Switching** - Toggle between light and dark themes
- **Persistent Preference** - Theme choice saved across sessions
- **System Integration** - Respects user's system preference
- **Smooth Transitions** - Elegant theme switching animations
- **Accessibility** - High contrast and readable in both modes

### Theme Toggle
- **Location** - Top-right corner of the navigation header
- **Icons** - Sun icon for light mode, moon icon for dark mode
- **Functionality** - Click to switch themes instantly
- **Visual Feedback** - Clear indication of current theme

## UI Components Used

- Button, Card, Input, Label, Form
- Table, Badge, Avatar, Dropdown Menu
- ThemeToggle with sun/moon icons
- Responsive design with mobile-first approach
- Loading states and error handling
- Dark mode compatible styling

## Layout Features

- **Sidebar Navigation** - Fixed sidebar with user info and balance
- **Dynamic Headers** - Page-specific headers with descriptions
- **User Profile** - Display user name, role, and current balance
- **Theme Toggle** - Easy access to dark/light mode switching
- **Responsive Design** - Works on desktop and mobile devices
- **Clean Interface** - Modern, professional appearance

## Role-Based Features

- **Admin Role**: 
  - Can create new messes
  - Manage all mess members
  - View all mess data and statistics
  - Full access to all features

- **Member Role**: 
  - Can join existing messes
  - View personal data and mess statistics
  - Add meals and deposits
  - Limited access based on permissions

## Demo Data

The system includes pre-populated demo data:
- **2 Messes**: Student Mess Alpha, Office Mess Beta
- **4 Users**: 2 admins, 2 members with different balances
- **Sample Meals**: Various meal entries across different dates
- **Sample Deposits**: Different payment methods and amounts
- **Sample Bazaar**: Categorized shopping expenses

## Development

The project uses:
- Next.js App Router for routing
- shadcn/ui for consistent UI components
- Tailwind CSS for styling with dark mode support
- React Context for state management
- Import aliases (`@/*` for src directory)
- Source directory structure
- Responsive design patterns
- Sidebar layout for better navigation
- Central JSON data management
- Authentication and session handling
- Theme management with localStorage persistence
