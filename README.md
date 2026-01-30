# Typing Platform

A modern, feature-rich typing test web application inspired by Monkeytype, built with **React**, **TypeScript**, **Vite**, and **SCSS**.

![Typing Platform](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## ✨ Features

- 🎯 **Real-time WPM & Accuracy** - Live metrics as you type
- ⌨️ **Multiple Test Modes** - Time-based (15s, 30s, 60s, 120s) and word-based (10, 25, 50, 100 words)
- 🎨 **8 Beautiful Themes** - Dark/Light modes with popular color schemes (Dracula, Nord, Monokai, Solarized, Gruvbox)
- 🔤 **Keyboard Layouts** - Support for QWERTY, Dvorak, and Colemak
- ✨ **Smooth Caret Animation** - Customizable caret styles (line, block, underline)
- 📊 **Test History** - Track your progress with personal bests
- 🎭 **Focus Mode** - Distraction-free typing experience
- ♿ **Accessibility** - Keyboard-first navigation with ARIA support
- 💾 **Persistent Settings** - All preferences saved to localStorage
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** or **pnpm**

### Installation

```bash
# Clone the repository (or use your own directory)
cd d:/monkeytype

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at **http://localhost:5173**

### Build for Production

```bash
# Build the project
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
typing-platform/
├── public/
│   └── wordlists/          # JSON word lists
│       ├── english_1k.json
│       ├── english_5k.json
│       └── custom_words.json
│
├── src/
│   ├── components/         # React components
│   │   ├── Common/        # Reusable UI components
│   │   ├── TypingArea/    # Main typing interface
│   │   ├── Caret/         # Animated caret
│   │   └── Metrics/       # WPM, Accuracy, Timer
│   │
│   ├── hooks/             # Custom React hooks
│   │   ├── useTypingEngine.ts
│   │   ├── useCaretPosition.ts
│   │   ├── useTimer.ts
│   │   └── useMetrics.ts
│   │
│   ├── store/             # Zustand state management
│   │   ├── settings.store.ts
│   │   ├── test.store.ts
│   │   └── user.store.ts
│   │
│   ├── services/          # Business logic services
│   │   ├── wordlist.service.ts
│   │   ├── storage.service.ts
│   │   └── analytics.service.ts
│   │
│   ├── utils/             # Utility functions
│   │   ├── calculateWPM.ts
│   │   ├── calculateAccuracy.ts
│   │   └── generateTestWords.ts
│   │
│   ├── types/             # TypeScript definitions
│   ├── constants/         # App constants (themes, modes, layouts)
│   ├── styles/            # Global SCSS styles
│   ├── pages/             # Page components
│   └── routes/            # Routing configuration
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎮 Usage

### Starting a Test

1. **Select a mode**: Time-based or word-based (default: 30s)
2. **Start typing**: Focus is automatic, just start typing
3. **View metrics**: Real-time WPM and accuracy updates
4. **Complete test**: Finish or wait for timer to expire
5. **Review results**: See your final stats and try again

### Keyboard Shortcuts

- **Type** - Start test automatically
- **Backspace** - Delete last character
- **Space** - Move to next word
- **Escape** - Reset test (when available)
- **Tab** - Navigate UI elements

### Customization

Access settings to customize:
- **Theme** - Choose from 8 pre-built themes
- **Test Mode** - Time or word-based tests
- **Caret Style** - Line, block, or underline
- **Font Size** - Adjust typing text size
- **Punctuation & Numbers** - Toggle for harder tests

## 🏗️ Architecture

### Component-Based Design

The application follows a clean, component-based architecture:

- **Separation of Concerns**: UI components separate from business logic
- **Custom Hooks**: Reusable logic (typing engine, metrics, timer)
- **State Management**: Zustand for global state (settings, user data)
- **Type Safety**: Full TypeScript coverage

### Key Components

#### `useTypingEngine` Hook
Core typing logic handling:
- Character-by-character validation
- Error and backspace tracking
- Test completion detection
- Real-time metrics calculation

#### `TypingArea` Component
Main typing interface:
- Word and character rendering
- Status highlighting (correct/incorrect/extra)
- Keyboard event handling
- Caret positioning

#### State Stores
- **Settings Store**: Theme, test mode, preferences
- **Test Store**: Active test state
- **User Store**: Test history, personal bests

## 🎨 Theming

Themes are defined in `src/constants/themes.ts`. To add a new theme:

```typescript
export const THEMES: Record<string, Theme> = {
  'my-theme': {
    id: 'my-theme',
    name: 'My Theme',
    colors: {
      background: '#...',
      text: '#...',
      primary: '#...',
      // ... other colors
    },
  },
};
```

Theme colors are applied via CSS variables in `src/styles/themes.scss`.

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

### Environment Variables

No environment variables required for the basic version. For backend integration, add:

```env
VITE_API_URL=your-backend-api-url
```

## 🔌 Backend Integration (Optional)

The app is designed to work standalone with localStorage, but can be extended with a backend:

1. **API Layer**: Update `src/services/analytics.service.ts` to send data to your backend
2. **Authentication**: Add a user authentication service
3. **Database**: Store test results and user profiles
4. **Sync**: Synchronize localStorage with backend

### Suggested Backend Stack

- **Firebase**: Easy setup for auth + database
- **Supabase**: Open-source Firebase alternative
- **Custom REST/GraphQL API**: Full control

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run lint         # Lint code
npm run lint:fix     # Fix linting issues
npm run format       # Format code with Prettier
npm run type-check   # TypeScript type checking
```

## 🤝 Contributing

Contributions welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by [Monkeytype](https://monkeytype.com)
- Built with [Vite](https://vitejs.dev/), [React](https://react.dev/), and [TypeScript](https://www.typescriptlang.org/)
- UI components use [SCSS](https://sass-lang.com/) for styling
- State management with [Zustand](https://github.com/pmndrs/zustand)

## 📧 Support

For issues, questions, or suggestions, please [open an issue](https://github.com/yourusername/typing-platform/issues).

---

**Happy Typing! ⌨️✨**
