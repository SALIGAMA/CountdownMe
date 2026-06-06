# CountdownMe 🎉

A colorful React Native countdown app — track birthdays, anniversaries, trips, and any event that matters. Each event gets a unique vibrant gradient card with a live ticking DD:HH:MM:SS countdown.

## Features

- **Multiple events** — Track as many events as you like
- **Live countdown** — Days, hours, minutes, and seconds tick every second
- **Vibrant gradients** — 12 unique vivid gradient themes, one per event card
- **Categories** — Birthday, Anniversary, Trip, Holiday, Goal, Other
- **Emoji icons** — 48 emoji choices to personalize each event
- **Celebration screen** — Confetti animation when your event day arrives!
- **Notifications** — Optional reminder on the event day (9am)
- **Persistence** — Events saved locally, survive app restarts
- **Dark theme** — Deep dark background with glowing colorful cards

## Screenshots

> _Add screenshots here after running the app_

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Expo Go](https://expo.dev/go) app on your iOS or Android device

### Run

```bash
# 1. Clone
git clone https://github.com/YOUR_USERNAME/CountdownMe.git
cd CountdownMe

# 2. Install dependencies
npm install

# 3. Start the dev server
npx expo start

# 4. Scan the QR code with Expo Go (iOS/Android)
```

### Run on Simulator/Emulator

```bash
# iOS (Mac only, requires Xcode)
npx expo start --ios

# Android (requires Android Studio)
npx expo start --android
```

## Tech Stack

| Tool | Purpose |
|------|---------|
| [Expo](https://expo.dev) (SDK 51) | React Native platform |
| [expo-router](https://expo.github.io/router) | File-based navigation |
| [expo-linear-gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/) | Vivid gradient cards |
| [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/) | Smooth animations |
| [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/) | Local persistence |
| [@react-native-community/datetimepicker](https://github.com/react-native-datetimepicker/datetimepicker) | Date & time picker |
| [expo-notifications](https://docs.expo.dev/versions/latest/sdk/notifications/) | Event day reminders |
| [expo-haptics](https://docs.expo.dev/versions/latest/sdk/haptics/) | Touch feedback |
| TypeScript | Type safety |

## Project Structure

```
app/                  # Screens (expo-router file-based routing)
  _layout.tsx         # Stack navigator
  index.tsx           # Home — event grid
  add.tsx             # Add event form
  edit/[id].tsx       # Edit/delete event
  celebrate/[id].tsx  # Celebration screen
components/           # Reusable UI components
hooks/                # useEvents, useCountdown, useNotifications
constants/            # Gradients, categories, theme
types/                # TypeScript interfaces
utils/                # Date utilities
```

## Contributing

Pull requests are welcome! For major changes, please open an issue first.

## License

[MIT](./LICENSE)
