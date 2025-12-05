# Chippr - Personal Finance App

A gamified personal finance application that helps users track spending, manage budgets, and build healthy financial habits through daily challenges and streaks.

## Technology Stack

| Category | Technology |
|----------|------------|
| **Framework** | React Native 0.79.5 |
| **Platform** | Expo SDK 53 |
| **Language** | TypeScript 5.8 |
| **Navigation** | Expo Router (file-based routing) |
| **Styling** | NativeWind 4.x + TailwindCSS 3.4 |
| **Animations** | React Native Reanimated 3.17 |
| **State Management** | React Context API |
| **Authentication** | Expo Auth Session + JWT (jose) |
| **Secure Storage** | Expo Secure Store |
| **Banking Integration** | Plaid Link SDK |
| **UI Components** | React Navigation, Expo Vector Icons |

## Style Guide

See the [Style Guide Documentation](./docs/STYLE_GUIDE.md) for design tokens, color palette, typography, and component patterns.

### Quick Reference

- **Primary Colors**: `#253628` (dark green), `#55B685` (green), `#A5C3D3` (blue)
- **Accent**: `#EDFE66` (yellow)
- **Background**: `#EFEFEF` (light gray)
- **Font**: System default with NativeWind utility classes

## Operation Instructions

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- iOS Simulator (Mac) or Android Emulator
- Expo Go app (for quick testing) or Expo Dev Client

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd chippr/app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install iOS pods (Mac only):
   ```bash
   cd ios && pod install && cd ..
   ```

### Running the App

**Development with Expo Dev Client (recommended):**
```bash
npm start
```

**Run on iOS Simulator:**
```bash
npm run ios
```

**Run on Android Emulator:**
```bash
npm run android
```

**Clear cache and start:**
```bash
npm run start:clear
```

### Environment Setup

The app connects to a backend API. Ensure the `BACKEND_URL` constant in `utils/constants.ts` points to your backend server.

## Limitations

### Incomplete Functionality

1. **Budget Run Feature**
   - Badge unlock modal is implemented but badge earning logic depends on backend
   - Leaderboard shows only user's own stats (no global rankings yet)
   - Custom budget setting UI not fully implemented

2. **Transaction Sync**
   - Relies on Plaid sandbox data for development
   - Real-time transaction updates not implemented (requires manual refresh)

3. **Notifications**
   - Push notifications for streak reminders not implemented
   - In-app notifications system not built

### Hard-coded Values

1. **API Configuration**
   - Backend URL is defined in `utils/constants.ts`
   
2. **Budget Defaults**
   - Default daily budget of $50 when no custom budget is set
   
3. **Date Handling**
   - Week starts on Monday (hard-coded in game board logic)
   - Timezone handling relies on server-side configuration

4. **UI Constants**
   - Progress bar width calculations use fixed padding values (16px)
   - Day labels assume Monday-Sunday ordering from API

### Known Issues

- Progress bar styling requires inline styles due to NativeWind/RN conflicts
- Modal components should be conditionally rendered to avoid layout issues
- Percentage-based widths in inline styles don't work in React Native

## Project Structure

```
app/
├── app/                    # Expo Router pages
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main tab navigation
│   └── _layout.tsx        # Root layout
├── components/            # Reusable UI components
├── context/               # React Context providers
├── features/              # Feature modules
│   └── budgetRun/        # Budget Run game feature
├── services/              # API service functions
└── utils/                 # Utility functions and constants
```

## Contributing

1. Follow the established code patterns and styling conventions
2. Use TypeScript for all new files
3. Prefer NativeWind classes over inline styles when possible
4. Test on both iOS and Android before submitting changes

## License

Private - All rights reserved.
