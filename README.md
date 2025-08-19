# Carni Kridi App

A comprehensive client management and kridi tracking application built with React Native and Expo.

## Latest Updates
- ✅ Automated CI/CD pipeline with GitHub Actions
- ✅ APK building with EAS Build
- ✅ Crash reporting with Sentry integration

## Environments

The app reads API base URL from `EXPO_PUBLIC_API_URL`.

- Local dev: `.env` -> `http://localhost:5000/api`
- Preview/Production: `.env.preview` / `.env.production` -> `http://82.29.178.228:5000/api`

Health check: `http://82.29.178.228:5000/api/health`

You can also override per EAS profile via `eas.json > build.*.env`.

## Features
- Client management
- Kridi tracking
- Store management
- User authentication
- Real-time statistics

## Getting Started

```bash
npm install
npm run dev
```

## Building APK

```bash
npm run build:preview
```

## Version Management

```bash
# Patch version (1.0.0 → 1.0.1)
npm run bump:patch

# Minor version (1.0.0 → 1.1.0)  
npm run bump:minor

# Major version (1.0.0 → 2.0.0)
npm run bump:major
```
