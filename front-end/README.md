# PocketPilot - Professional Fintech SaaS Dashboard

A professional, production-ready fintech dashboard UI inspired by Stripe Dashboard, Horizon UI, and Revolut. Built with React 18, TypeScript, Vite, and Chakra UI, PocketPilot provides a premium interface for personal finance management with comprehensive pages for tracking transactions, analyzing spending patterns, managing budgets, and planning financial objectives. **Now featuring professional SaaS-level design with complete French localization.**

## 🎯 Features

### Pages & Sections

- **Dashboard**: Overview of monthly income, expenses, savings, and budget usage with placeholder charts
- **Transactions**: Search and filter transactions with a responsive data table showing income and expenses
- **Analysis**: Statistics cards displaying total balance, average spending, and YTD savings with chart placeholders
- **Budget**: Category-based budget tracking with progress bars showing spending vs. planned amounts
- **Objectives**: Financial goals with progress tracking and priority badges
- **Financial Planning**: Detailed plan view for objectives with recommendations and savings timeline

### Design Features

- ✅ **Professional SaaS Design**: Premium fintech-grade aesthetic inspired by industry leaders
- ✅ **Advanced Color System**: 5-color purple-based palette (#756AB6 primary) with sophisticated gradients
- ✅ **Premium Typography**: Carefully optimized Inter font with proper hierarchy, weights, and letter-spacing
- ✅ **Enhanced Spacing**: Consistent spacing scale with modern 14px border radius and soft shadows
- ✅ **Dark/Light Themes**: Complete theme system with smooth transitions and optimized colors for both modes
- ✅ **French Localization**: Full UI translated to French for European fintech experience
- ✅ **Interactive Elements**: Smooth hover effects, elevation changes, and micro-interactions throughout
- ✅ **Responsive Design**: Mobile-first layout optimized for all devices (mobile, tablet, desktop)

### Component Features

- ✅ **Enhanced StatCard**: KPI cards with trend indicators, icon backgrounds, and hover effects
- ✅ **Smart ProgressCard**: Color-coded progress tracking (green/orange/red) with animated bars
- ✅ **Modern ChartPlaceholder**: Styled chart placeholders with emoji icons and dashed borders
- ✅ **Sidebar Navigation**: Gradient logo, French labels, active state styling with smooth transitions
- ✅ **Top Navbar**: Refined typography, icon buttons with hover states, notification badge styling
- ✅ **Reusable Components**: Fully composable UI components following React best practices
- ✅ **Accessible**: Semantic HTML, ARIA labels, keyboard navigation, high contrast ratios
- ✅ **Production Ready**: Zero breaking changes, full backwards compatibility

## 🛠️ Tech Stack

- **Framework**: React 18.2 + TypeScript 5
- **Build Tool**: Vite 4.5
- **UI Library**: Chakra UI 2.8 with Emotion
- **Routing**: React Router v6
- **Styling**: Tailwind-inspired Chakra theming system

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── StatCard.tsx    # Statistics card component
│   ├── ProgressCard.tsx # Budget/progress tracking card
│   └── ChartPlaceholder.tsx # Chart placeholder component
├── layouts/             # Layout components
│   └── DashboardLayout.tsx # Main layout with sidebar & navbar
├── pages/              # Page components
│   ├── Dashboard.tsx
│   ├── Transactions.tsx
│   ├── Analysis.tsx
│   ├── Budget.tsx
│   ├── Objectives.tsx
│   └── ObjectivePlan.tsx
├── theme/              # Chakra UI theme configuration
│   └── index.ts
├── App.tsx             # Router setup
├── main.tsx            # Entry point
└── vite.config.ts      # Vite configuration
```

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Start the dev server
pnpm dev

# App will be available at http://localhost:5173
```

### Build

```bash
# Create production build
pnpm build

# Preview production build
pnpm preview
```

## 🎨 Design System

### Colors

- **Brand Blue**: #60a5fa (primary actions and highlights)
- **Dark Blue**: #1e40af (darker brand shade)
- **Gray Palette**: Comprehensive gray scale from 50-900
- **Accent Colors**: Green for income, Red for expenses

### Typography

- **Font**: Inter (Single font family for both headings and body)
- **Sizes**: Responsive typography scaling from mobile to desktop
- **Line Height**: 1.4-1.6 for optimal readability

### Spacing

- Uses Chakra's spacing scale (4px base unit)
- Responsive padding and margins
- Consistent gap spacing between components

## 🔧 Customization

### Theme

Edit `src/theme/index.ts` to customize:
- Brand colors
- Typography
- Component styling
- Dark mode colors

### Pages

Each page is a standalone component that can be easily modified:
- Add real data by replacing mock data arrays
- Connect API endpoints by updating fetch calls
- Customize card layouts and grid structures

### Navigation

Update sidebar navigation in `src/layouts/DashboardLayout.tsx`:
- Modify `navItems` array to add/remove pages
- Update route paths as needed

## 📊 Mock Data

The application includes comprehensive mock data for:
- Monthly income/expenses statistics
- Transaction history with categories
- Budget categories with spending progress
- Financial objectives with timeline

Replace mock data with real API calls to connect to your backend.

## ♿ Accessibility

- Semantic HTML elements
- ARIA labels on interactive components
- Keyboard navigation support
- Color contrast compliance
- Screen reader friendly

## 📱 Responsive Breakpoints

- **Mobile**: 0px - 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: 1024px+

All components adapt seamlessly across breakpoints.

## 🌙 Dark Mode

Toggle dark mode using the moon/sun icon in the navbar. Theme preference is managed by Chakra UI's useColorMode hook.

## 📝 Notes

- This is a UI-only dashboard with placeholder data
- No backend integration or authentication implemented
- Charts are placeholder components (ready to integrate with Recharts or similar)
- All navigation is client-side routing with React Router

## 🔒 Future Enhancements

- Backend API integration
- User authentication
- Real chart libraries (Recharts, Chart.js)
- Data persistence
- Export functionality
- Advanced filtering and search

## 📄 License

Open source - feel free to use for your projects!
