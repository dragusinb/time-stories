# TimeStories Product Roadmap

## Current State Assessment

**Product Readiness: 4/10**

| Area | Status | Notes |
|------|--------|-------|
| Core Gameplay | Strong (9/10) | 3 stories, 30+ minigames, solid content |
| Monetization | Implemented (8/10) | RevenueCat, coin system, tiered packages |
| Lab Metagame | New (7/10) | Idle game loop, prestige system |
| Engagement | Partial (5/10) | Trophies only, no daily rewards |
| Analytics | Missing (0/10) | No tracking beyond RevenueCat |
| Onboarding | Missing (0/10) | Users thrown into app cold |
| Audio/Haptics | Missing (0/10) | Silent experience |
| Social | Missing (0/10) | No accounts, sharing, or leaderboards |

---

## Phase 1: Launch Ready (2-3 weeks)

### 1.1 Critical Fixes
- [ ] **Error Boundary** - Prevent white screen crashes
- [ ] **Loading States** - Skeleton loaders for all async content
- [ ] **Environment Variables** - Move RevenueCat API key out of code
- [ ] **Privacy Policy / Terms** - Required for app stores

### 1.2 Onboarding Flow
- [ ] **First-Run Tutorial**
  - Welcome screen with app overview
  - Guided first story selection
  - Minigame controls tutorial overlay
  - Coin system explanation
  - Trophy Room / Lab introduction
- [ ] **Contextual Hints**
  - Tooltips on first visit to each section
  - "First time?" prompts that can be dismissed

### 1.3 Basic Analytics
- [ ] **Event Tracking** (Firebase Analytics or Mixpanel)
  - App open / session start
  - Story started / completed
  - Act unlocked (paid vs free)
  - Minigame started / completed / failed
  - Store visited / purchase attempted / purchase completed
  - Lab interactions (artifact unlock, upgrade, prestige)
- [ ] **Crash Reporting** (Sentry or Firebase Crashlytics)

### 1.4 Audio Foundation
- [ ] **Background Music**
  - Main menu ambient track
  - Per-story theme music (space synth, medieval lute, Greek lyre)
  - Lab ambient track
- [ ] **Sound Effects**
  - Minigame success/failure sounds
  - UI interaction sounds (taps, transitions)
  - Coin earned sound
  - Trophy unlock fanfare
- [ ] **Audio Settings**
  - Music volume slider
  - SFX volume slider
  - Mute toggle

### 1.5 Haptic Feedback (Mobile)
- [ ] **Capacitor Haptics Plugin**
  - Light tap on button press
  - Medium impact on minigame success
  - Error vibration on failure
  - Strong impact on trophy/artifact unlock

---

## Phase 2: Retention & Engagement (3-4 weeks)

### 2.1 Daily Rewards System
- [ ] **Daily Login Bonus**
  - Day 1: 10 coins
  - Day 2: 15 coins
  - Day 3: 20 coins
  - Day 4: 25 coins
  - Day 5: 30 coins
  - Day 6: 40 coins
  - Day 7: 50 coins + bonus spin
- [ ] **Streak System**
  - Streak counter with multiplier
  - Streak protection (1 free miss per week)
  - Visual streak flame/badge
- [ ] **Calendar UI**
  - Visual calendar showing claimed/unclaimed days
  - Upcoming rewards preview

### 2.2 Achievement System
- [ ] **Achievement Categories**
  - Story Achievements (complete story, complete without hints)
  - Minigame Achievements (perfect score, speed run, combo master)
  - Collection Achievements (unlock all artifacts, max all upgrades)
  - Social Achievements (share first trophy, invite friend)
  - Dedication Achievements (7-day streak, 30-day streak)
- [ ] **Achievement Rewards**
  - Coins for each achievement
  - Special badges/icons
  - Lab production bonuses

### 2.3 Push Notifications (Capacitor)
- [ ] **Notification Types**
  - Daily reminder (if no session in 24h)
  - Streak warning ("Don't lose your streak!")
  - New content announcement
  - Lab milestone ("Your lab produced 1000 energy!")
  - Idle progress ("Welcome back! You earned X energy")
- [ ] **Notification Settings**
  - Per-category toggles
  - Quiet hours setting

### 2.4 Lab Improvements
- [ ] **Daily Lab Bonus**
  - Tap to collect bonus energy once per day
  - Bonus scales with timeline stability
- [ ] **Events System**
  - Weekend 2x production events
  - Holiday-themed temporary boosts
- [ ] **More Upgrades**
  - Global upgrades (affect all artifacts)
  - Automation upgrades (auto-collect bonuses)

---

## Phase 3: Monetization Optimization (2-3 weeks)

### 3.1 Watch Ads for Rewards
- [ ] **Ad Integration** (AdMob or Unity Ads via Capacitor)
  - Watch ad for 5 bonus coins (3x per day limit)
  - Watch ad to double minigame score
  - Watch ad for 30-min production boost in Lab
  - Watch ad to revive failed minigame attempt
- [ ] **Ad Settings**
  - Optional (never forced)
  - Clear value exchange shown

### 3.2 Subscription Tier
- [ ] **"Time Traveler Pass"** ($4.99/month)
  - All stories unlocked
  - 2x Lab production
  - No ads
  - Exclusive avatar border
  - Early access to new stories
- [ ] **UI Integration**
  - Badge/indicator for subscribers
  - Subscription management page
  - Restore subscription button

### 3.3 Limited-Time Offers
- [ ] **Starter Pack** (one-time, first 48h)
  - 500 coins + unlock story 2 for $2.99
- [ ] **Weekend Sale**
  - 20% bonus coins on all packages
- [ ] **Event Packs**
  - Themed bundles during holidays

### 3.4 Purchase Flow Optimization
- [ ] **Store Page Improvements**
  - Before/after preview (what coins unlock)
  - Social proof ("50,000+ time travelers")
  - "Best Value" and "Most Popular" tags
- [ ] **Abandoned Cart Recovery**
  - If user visits store but doesn't buy, show discount later

---

## Phase 4: Social & Virality (4-5 weeks)

### 4.1 User Accounts
- [ ] **Anonymous Accounts** (Firebase Auth)
  - Auto-created on first launch
  - Upgrade to email/social later
- [ ] **Social Login**
  - Sign in with Google
  - Sign in with Apple
- [ ] **Cloud Save**
  - Sync progress across devices
  - Conflict resolution UI

### 4.2 Social Sharing
- [ ] **Share Triggers**
  - Story completion card (shareable image)
  - Trophy unlock announcement
  - Achievement unlock
  - Lab milestone
- [ ] **Share Targets**
  - Native share sheet (iOS/Android)
  - Copy link to clipboard
  - Direct to Instagram Stories

### 4.3 Leaderboards
- [ ] **Minigame Leaderboards**
  - Daily/Weekly/All-time
  - Friends-only view
  - Score breakdown (time, accuracy, combo)
- [ ] **Lab Leaderboards**
  - Total energy produced
  - Timeline stability speed run
  - Prestige count
- [ ] **Story Leaderboards**
  - Completion time
  - Minigame average score

### 4.4 Referral System
- [ ] **Invite Friends**
  - Unique referral code
  - 50 coins for inviter when friend completes first story
  - 25 coins for new user
- [ ] **Referral Tracking**
  - Dashboard showing invites sent/accepted
  - Leaderboard for top referrers

---

## Phase 5: Content & Replayability (Ongoing)

### 5.1 Story Enhancements
- [ ] **Branching Paths**
  - Choice points in story that affect narrative
  - Multiple endings per story
  - Replay value through different choices
- [ ] **Difficulty Modes**
  - Easy (hints available, longer timers)
  - Normal (current)
  - Hard (no hints, shorter timers, stricter scoring)
- [ ] **Story Modifiers**
  - "Ironman" mode (no failures allowed)
  - "Speedrun" mode (timer for whole story)

### 5.2 New Content Pipeline
- [ ] **Story 4: "The Plague Doctor" (Medieval Europe)**
  - 40+ acts, 15+ minigames
  - New minigame types: Patient diagnosis, herb mixing
- [ ] **Story 5: "Samurai's Honor" (Feudal Japan)**
  - 45+ acts, 18+ minigames
  - New minigame types: Calligraphy, strategy
- [ ] **Seasonal Stories**
  - Limited-time holiday-themed mini-stories
  - Halloween: "The Witch Trials"
  - Christmas: "A Victorian Carol"

### 5.3 Daily Challenges
- [ ] **Challenge Types**
  - Play minigame X with modifier Y
  - Complete act without any mistakes
  - Reach X energy in Lab within 24h
- [ ] **Rewards**
  - Daily: 15 coins
  - Weekly (complete 5/7): 100 coins
  - Monthly (complete 20/30): 500 coins + exclusive badge

### 5.4 Minigame Standalone Mode
- [ ] **Arcade Mode**
  - Play any unlocked minigame anytime
  - High score tracking
  - Endless/survival variants
- [ ] **Daily Minigame**
  - Featured minigame each day
  - Global leaderboard for daily minigame

---

## Phase 6: Technical Excellence (Ongoing)

### 6.1 Performance
- [ ] **Monitoring** (Vercel Analytics or custom)
  - Page load times
  - Interaction latency
  - Minigame frame rates
- [ ] **Optimization**
  - Image optimization (next/image)
  - Code splitting improvements
  - Service worker for offline

### 6.2 A/B Testing
- [ ] **Framework Setup** (GrowthBook or LaunchDarkly)
- [ ] **Initial Tests**
  - Store page layout variations
  - Pricing experiments
  - Onboarding flow variations
  - Daily reward amounts

### 6.3 Accessibility
- [ ] **WCAG 2.1 Audit**
  - Color contrast verification
  - Keyboard navigation
  - Screen reader compatibility
- [ ] **Accessibility Features**
  - Reduced motion option
  - High contrast mode
  - Font size adjustment

### 6.4 Localization
- [ ] **i18n Framework** (next-intl)
- [ ] **Priority Languages**
  - Spanish
  - French
  - German
  - Portuguese
  - Japanese
- [ ] **Content Translation**
  - UI strings
  - Story content
  - Minigame instructions

---

## Priority Matrix

### Must Have (MVP)
1. Error handling & crash reporting
2. Basic onboarding
3. Analytics foundation
4. Audio (at least music)
5. Daily rewards

### Should Have (Launch)
1. Achievements
2. Push notifications
3. Haptics
4. Ad integration
5. Cloud save

### Nice to Have (Post-Launch)
1. Subscription tier
2. Leaderboards
3. Social sharing
4. Referrals
5. Localization

---

## Estimated Timeline

| Phase | Duration | Focus |
|-------|----------|-------|
| Phase 1 | 2-3 weeks | Launch Ready |
| Phase 2 | 3-4 weeks | Retention |
| Phase 3 | 2-3 weeks | Monetization |
| Phase 4 | 4-5 weeks | Social |
| Phase 5 | Ongoing | Content |
| Phase 6 | Ongoing | Technical |

**Soft Launch Target**: End of Phase 1
**Full Launch Target**: End of Phase 2
**Sustainable Growth**: Phase 3+

---

## Success Metrics

### Engagement
- DAU/MAU ratio > 20%
- Day 1 retention > 40%
- Day 7 retention > 15%
- Day 30 retention > 8%
- Average session length > 8 minutes

### Monetization
- ARPU > $0.50
- Paying user conversion > 3%
- LTV/CAC ratio > 3:1

### Growth
- Organic installs > 30% of total
- Referral rate > 5%
- App store rating > 4.5

---

## Next Steps

1. **Immediate**: Set up Firebase project for analytics + auth
2. **This Week**: Implement error boundary and basic loading states
3. **Next Week**: Build onboarding flow
4. **Week 3**: Add audio system with placeholder sounds
5. **Week 4**: Daily rewards system

---

*Last Updated: January 2026*
