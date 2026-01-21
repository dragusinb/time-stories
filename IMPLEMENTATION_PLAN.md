# TimeStories - Implementation Plan

## Overview

This document outlines the complete roadmap to transform TimeStories from a working prototype into a monetizable product on Web, iOS, and Google Play.

---

## Phase 1: Foundation (Critical Path to Beta)

**Goal:** Make the app functional enough for paid beta testing.

### 1.1 Billing Infrastructure

| Task | Priority | Effort | Notes |
|------|----------|--------|-------|
| Create RevenueCat account | P0 | 1hr | https://app.revenuecat.com |
| Create Google Play Developer account ($25) | P0 | 1hr | Required for Android |
| Create Apple Developer account ($99/yr) | P0 | 1hr | Required for iOS |
| Set up RevenueCat project | P0 | 2hr | Configure both platforms |
| Create Products in Play Console | P0 | 2hr | Coin packs as consumables |
| Create Products in App Store Connect | P0 | 2hr | Same products, Apple format |
| Link products to RevenueCat Offerings | P0 | 1hr | Map SKUs to offerings |
| Replace placeholder API key in `lib/billing.ts` | P0 | 15min | Line 16 |
| Wire store page to real billing | P0 | 4hr | See Section 5.1 |
| Add "Restore Purchases" button | P0 | 1hr | Required by Apple |
| Test sandbox purchases | P0 | 2hr | Both platforms |

**RevenueCat Product Configuration:**
```
Offering: "default"
├── Package: "starter" → $4.99 consumable (100 coins)
├── Package: "apprentice" → $29.99 consumable (550 coins)
├── Package: "master" → $49.99 consumable (1150 coins)
└── Package: "grand" → $99.99 consumable (3000 coins)
```

### 1.2 iOS Platform Setup

| Task | Priority | Effort | Notes |
|------|----------|--------|-------|
| Run `npx cap add ios` | P0 | 5min | Creates ios/ folder |
| Configure `capacitor.config.ts` for iOS | P0 | 30min | Bundle ID, app name |
| Set up Xcode signing | P0 | 1hr | Certificates, provisioning |
| Add iOS splash screens | P1 | 2hr | Required assets |
| Add iOS app icons | P1 | 1hr | All required sizes |
| Test on iOS Simulator | P0 | 1hr | Verify everything works |
| Test on physical iPhone | P0 | 2hr | IAP only works on device |

### 1.3 Minigame Polish (Apollo & Archimedes)

See **Phase 1.3 Minigame Audit** section below for detailed findings.

| Story | Minigame | Issue | Fix Effort |
|-------|----------|-------|------------|
| Apollo | TBD | TBD | TBD |
| Archimedes | TBD | TBD | TBD |

### 1.4 Critical Bug Fixes

| Task | Priority | Notes |
|------|----------|-------|
| Fix any SSR/hydration errors | P0 | Check console on load |
| Ensure all images load (no 404s) | P0 | Check network tab |
| Test localStorage persistence | P0 | Progress must survive reload |
| Verify minigame completion detection | P0 | Score >= 50 triggers advance |

---

## Phase 2: Launch Readiness

**Goal:** Meet app store requirements and ensure quality.

### 2.1 App Store Requirements

| Platform | Requirement | Status |
|----------|-------------|--------|
| **Both** | Privacy Policy URL | Needed |
| **Both** | Terms of Service URL | Needed |
| **Both** | Support email/URL | Needed |
| **iOS** | App Privacy labels | Needed |
| **iOS** | Age rating questionnaire | Needed |
| **Android** | Content rating questionnaire | Needed |
| **Android** | Data safety section | Needed |

### 2.2 Store Listings

**Screenshots needed (per platform):**
- 6.7" iPhone (1290 x 2796) - at least 3
- 6.5" iPhone (1284 x 2778) - at least 3
- 12.9" iPad Pro (2048 x 2732) - at least 3
- Android Phone (1080 x 1920 or 1080 x 2340) - at least 4
- Android Tablet (1920 x 1200) - optional but recommended

**Metadata:**
```
App Name: TimeStories - Learn History
Subtitle: Interactive Time Travel Adventures
Keywords: history, education, games, science, apollo, medieval, ancient
Category: Education / Games (Trivia)
```

**Description (Draft):**
```
Travel through time and live history's greatest moments!

TimeStories combines gripping interactive fiction with scientifically-accurate
minigames. Experience the Apollo 11 moon landing, survive the Black Death as
an alchemist's apprentice, or defend Syracuse alongside Archimedes.

FEATURES:
- 3 complete historical adventures (120+ chapters)
- 28 unique minigames based on real physics and science
- Beautiful themed visuals for each era
- Earn trophies for completing each timeline
- Learn real history while having fun

FREE TO START:
- First 5 acts of each story free
- 100 bonus coins included
- Unlock more with in-app purchases

Perfect for history buffs, students, and anyone who loves a good story!
```

### 2.3 Analytics Integration

| Tool | Purpose | Priority |
|------|---------|----------|
| **Mixpanel** or **Amplitude** | User behavior | P1 |
| **RevenueCat Dashboard** | Revenue metrics | P0 (built-in) |
| **Sentry** | Crash reporting | P1 |
| **Firebase Analytics** | Basic events | P2 (alternative) |

**Key Events to Track:**
```javascript
// User Journey
track('story_started', { story_id, source })
track('act_completed', { story_id, act_number, time_spent })
track('act_unlocked', { story_id, act_number, coins_spent })
track('story_completed', { story_id, total_time })

// Minigames
track('minigame_started', { minigame_type, story_id, act_number })
track('minigame_completed', { minigame_type, score, attempts })
track('minigame_failed', { minigame_type, score })

// Monetization
track('store_viewed', { source, coins_balance })
track('purchase_started', { package_id, price })
track('purchase_completed', { package_id, price, coins_added })
track('purchase_failed', { package_id, error })

// Engagement
track('app_opened', { session_number })
track('trophy_room_viewed', { trophies_earned })
```

### 2.4 Quality Assurance

| Test Type | Coverage | Notes |
|-----------|----------|-------|
| Full playthrough - Apollo | All 40 acts | Note any bugs |
| Full playthrough - Alchemist | All 40 acts | Note any bugs |
| Full playthrough - Archimedes | All 50 acts | Note any bugs |
| Purchase flow - Android | All 4 packs | Sandbox mode |
| Purchase flow - iOS | All 4 packs | Sandbox mode |
| Offline behavior | Disable wifi | Should work |
| Low memory | Background apps | No crashes |
| Screen sizes | 4" to 12.9" | Responsive |

---

## Phase 3: Growth Features (Post-Launch)

### 3.1 User Accounts & Cloud Sync

**Recommended: Firebase Authentication + Firestore**

| Feature | Effort | Notes |
|---------|--------|-------|
| Email/password auth | 4hr | Basic signup/login |
| Google Sign-In | 2hr | One-tap on Android |
| Apple Sign-In | 2hr | Required if other social logins |
| Cloud save system | 8hr | Sync UserState to Firestore |
| Conflict resolution | 4hr | Handle offline edits |
| Migration from localStorage | 2hr | Don't lose existing progress |

**Data Schema:**
```typescript
interface CloudUserState {
  odId: string;          // Firebase UID
  coins: number;
  unlockedActs: string[];
  completedMinigames: string[];
  completedStories: string[];
  lastUpdated: Timestamp;
  deviceId: string;      // For conflict detection
}
```

### 3.2 Engagement Features

| Feature | Effort | Impact |
|---------|--------|--------|
| Daily login reward | 4hr | +15% DAU |
| Push notifications | 8hr | "Continue your story" |
| Achievement system | 8hr | 20+ achievements |
| Leaderboards (minigame scores) | 8hr | Social competition |
| Share to social media | 4hr | Viral growth |

### 3.3 Monetization Optimization

| Experiment | Hypothesis | Metric |
|------------|------------|--------|
| Lower act unlock cost (10 coins) | More progression = more engagement | Retention D7 |
| Add "Watch ad for 5 coins" | Non-payers can still progress | ARPDAU |
| Story bundles ($4.99/story) | Clearer value proposition | Conversion rate |
| Premium subscription ($2.99/mo) | Predictable revenue | LTV |
| First purchase discount (50% off) | Lower barrier to entry | First purchase rate |

---

## Phase 4: Content Expansion

### 4.1 New Stories (Prioritized)

| Story Concept | Era | Scientific Focus | Appeal |
|---------------|-----|------------------|--------|
| **Silk Road Merchant** | Tang Dynasty | Geography, economics, astronomy | Chinese market |
| **Leonardo's Workshop** | Renaissance | Engineering, art, anatomy | Universal |
| **Marie Curie's Lab** | 1900s Paris | Radiation, chemistry | Women in STEM |
| **Pompeii's Last Day** | 79 AD | Volcanology, Roman life | Drama |
| **Darwin's Voyage** | 1830s | Evolution, biology | Science education |

### 4.2 Minigame Templates

Reusable minigame types for new stories:
- Quiz (already universal)
- Memory (already universal)
- Mixing/Crafting (medieval → any lab setting)
- Physics sims (catapult → any projectile)
- Drawing accuracy (circle → any shape)

---

## Phase 5: Technical Debt & Scale

### 5.1 Code Quality

| Task | Priority | Notes |
|------|----------|-------|
| Add TypeScript strict mode | P2 | Catch bugs early |
| Add unit tests for minigame scoring | P1 | Prevent regressions |
| Add E2E tests (Playwright) | P2 | Critical user flows |
| Extract minigame base component | P2 | Reduce duplication |
| Document story data format | P1 | For content team |

### 5.2 Performance

| Task | Priority | Notes |
|------|----------|-------|
| Lazy load minigame components | P1 | Reduce initial bundle |
| Optimize images (WebP) | P1 | Faster load times |
| Add service worker (PWA) | P2 | Offline support on web |
| Profile and fix memory leaks | P1 | Long sessions |

### 5.3 Infrastructure

| Task | Priority | Notes |
|------|----------|-------|
| Set up CI/CD (GitHub Actions) | P1 | Automated builds |
| Automated app store deployment | P2 | Fastlane |
| Staging environment | P1 | Test before prod |
| Feature flags | P2 | A/B testing |

---

## Timeline Estimate

| Phase | Duration | Milestone |
|-------|----------|-----------|
| Phase 1 | 2-3 weeks | Beta ready |
| Phase 2 | 1-2 weeks | Store submission |
| Review | 1-2 weeks | Apple/Google approval |
| Phase 3 | 4-6 weeks | Growth features |
| Phase 4 | Ongoing | New content |

**Target Launch:** 6-8 weeks from today

---

## Budget Estimate

| Item | Cost | Frequency |
|------|------|-----------|
| Apple Developer Program | $99 | Annual |
| Google Play Developer | $25 | One-time |
| RevenueCat | Free | Up to $2.5k MTR |
| Firebase | Free | Spark plan |
| Sentry | Free | 5k errors/mo |
| Domain + Hosting | ~$20 | Annual |
| **Total Year 1** | **~$150** | |

---

## Success Metrics

### North Star
- **Monthly Active Users (MAU)**
- **Monthly Recurring Revenue (MRR)**

### Leading Indicators
| Metric | Target (Month 1) | Target (Month 6) |
|--------|------------------|------------------|
| Daily Active Users | 100 | 1,000 |
| D1 Retention | 40% | 50% |
| D7 Retention | 15% | 25% |
| Story Completion Rate | 10% | 20% |
| Purchase Conversion | 2% | 5% |
| ARPU | $0.50 | $1.00 |

---

## Appendix A: RevenueCat Setup Guide

1. **Create Account:** https://app.revenuecat.com/signup
2. **Create Project:** Name it "TimeStories"
3. **Add Apps:**
   - Android: Enter package name (`com.timestories.app`)
   - iOS: Enter bundle ID (same or similar)
4. **Configure Products:**
   - Go to Products → Add New
   - Create each coin pack as a consumable
5. **Create Offering:**
   - Go to Offerings → Create New
   - Name: "default"
   - Add all products as packages
6. **Get API Keys:**
   - Android: Project Settings → API Keys → Google Play
   - iOS: Project Settings → API Keys → App Store
7. **Update Code:**
   ```typescript
   // lib/billing.ts line 16
   const REVENUECAT_API_KEY = Platform.select({
     android: 'goog_YOUR_REAL_KEY',
     ios: 'appl_YOUR_REAL_KEY',
   });
   ```

---

## Appendix B: File Structure Reference

```
TimeStories/
├── app/                    # Next.js pages
│   ├── page.tsx           # Home (story list + trophy room)
│   ├── store/page.tsx     # Coin store
│   └── story/[id]/        # Story routes
├── components/
│   ├── minigames/         # 28 minigame components
│   ├── ui/                # Reusable UI components
│   ├── StoryReader.tsx    # Main reading experience
│   ├── Navbar.tsx         # Navigation
│   └── BillingProvider.tsx# RevenueCat wrapper
├── lib/
│   ├── data.ts            # Story content (40-50 acts each)
│   ├── store.ts           # Zustand state (coins, progress)
│   └── billing.ts         # RevenueCat integration
├── types/
│   └── index.ts           # TypeScript interfaces
├── android/               # Capacitor Android project
├── ios/                   # Capacitor iOS project (TODO)
└── capacitor.config.ts    # Capacitor configuration
```

---

*Last Updated: January 2026*
