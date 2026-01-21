# TimeStories - Minigame Audit Report

## Executive Summary

After reviewing all 28 minigame components and analyzing their usage across the three stories, I've identified several areas needing improvement. The **Alchemist story minigames are the most polished**, while **Apollo 11 and Archimedes have specific games that need work**.

---

## Minigame Inventory by Story

### Apollo 11 (Story 1) - 12 Minigames

| Act | Type | Name | Quality | Issue |
|-----|------|------|---------|-------|
| 3 | silo | Verify Oxygen Mixture | LOW | Trivial slider - no real challenge |
| 4 | constellation | Align Navigation Star | MEDIUM | Works, but strict order frustrating |
| 7 | cipher | Decode 1202 Alarm | GOOD | Functional |
| 8 | silo | Fuel Level Critical | LOW | Same trivial slider |
| 12 | centrifuge | Analyze Regolith | MEDIUM | Hold-to-spin may fail on mobile |
| 18 | diagnosis | Diagnose PLSS | MEDIUM | Unclear failure feedback |
| 19 | scale | Level Seismometer | GOOD | Nice bubble-level mechanic |
| 20 | lens | Align Retro-Reflector | GOOD | Satisfying progression |
| 24 | triage | Select Jettison Items | LOW | Obvious correct answer |
| 28 | silo | Monitor Ascent Thrust | LOW | Same trivial slider (3rd time) |
| 31 | constellation | Align Docking Ports | MEDIUM | Same strict ordering |
| 36 | cipher | Verify Re-entry | GOOD | Functional |

### Archimedes (Story 3) - 9 Minigames

| Act | Type | Name | Quality | Issue |
|-----|------|------|---------|-------|
| 2 | circle | Draw Perfect Circle | GOOD | Satisfying, good algorithm |
| 4 | defense | Defend the Harbor | GOOD | Fun arcade-style gameplay |
| 10 | displacement | Eureka Moment | GOOD | Educational, clear feedback |
| 16 | scale | Balance Buoyancy | GOOD | Nice physics simulation |
| 20 | gears | Engage Mirror | LOW | No puzzle - any gear works |
| 25 | quiz | Geometric Principle | GOOD | Simple but appropriate |
| 28 | sequence | Assemble Screw | GOOD | Clear drag-drop interface |
| 30 | catapult | Calibrate Ballista | GOOD | Satisfying physics |
| 40 | cipher | Cylinder Seal | GOOD | Functional |

### Alchemist (Story 2) - 7 Minigames

| Act | Type | Name | Quality | Issue |
|-----|------|------|---------|-------|
| 5 | mixing | Rehydration Solution | EXCELLENT | Beautiful UI, clear feedback |
| 7 | quiz | Moldy Bread Question | GOOD | Simple, works |
| 12 | ratcatcher | Capture Specimen | GOOD | Fun herding mechanic |
| 16 | grinding | Prepare Mask Filter | GOOD | Satisfying circular motion |
| 19 | lens | Grind Microscope Lens | GOOD | Same component, themed well |
| 28 | quiz | Identify Penicillium | GOOD | Simple, works |
| 36 | sanitation | Teach Protocols | GOOD | Matching game |

---

## Critical Issues (Must Fix Before Launch)

### 1. SiloGame - Used 3x in Apollo 11 (Acts 3, 8, 28)

**Problem:** It's just a slider where you set it to ~75% and click submit. No skill, no challenge, no engagement. Players will do this THREE times in the same story.

**Current Code Pattern:**
```typescript
// Just checking if slider is within 5% of target
const targetFill = 75;
const tolerance = 5;
if (diff <= tolerance) { onComplete(100); }
```

**Recommended Fix:**
- Add time pressure (fuel depleting while you calibrate)
- Add fluctuation (value drifts, player must actively maintain)
- Add multiple gauges to balance simultaneously
- Or: Replace with different minigame types for variety

**Priority:** HIGH - This is 25% of Apollo minigames

---

### 2. GearsGame - Used in Archimedes Act 20

**Problem:** There's no actual puzzle. Any 3 gears in any configuration "works". The win condition is simply `slots.some(s => s === null)` - just fill all slots.

**Current Code:**
```typescript
if (slots.some(s => s === null)) {
    setMessage("Mechanism incomplete...");
    return;
}
// If all slots filled, you win. No validation of which gears.
```

**Recommended Fix:**
- Require specific gear sizes in specific positions (Large-Medium-Small)
- Add gear ratio calculation (show target RPM, require correct ratio)
- Visual feedback showing gears actually meshing/not meshing

**Priority:** HIGH - Breaks the "educational physics" promise

---

### 3. TriageGame - Apollo Act 24

**Problem:** The correct answer is extremely obvious ("Moon Rocks" is marked as "CRITICAL" and "Mission Objective" in the description). No moral dilemma, no thought required.

**Current Design:**
```typescript
const cargo = [
    { id: 3, name: "Moon Rocks", status: "CRITICAL", desc: "Priority Samples. Mission Objective." }
];
// Every other option is marked "Expendable"
```

**Recommended Fix:**
- Make choices more ambiguous (all have pros/cons)
- Add weight calculations (player must calculate)
- Remove obvious status hints
- Add consequences shown after choice

**Priority:** MEDIUM

---

### 4. CentrifugeGame - Mobile Usability

**Problem:** Uses `onMouseDown`/`onMouseUp` for hold-to-spin. This works on desktop but is awkward on mobile where users expect tap, not hold.

**Current Code:**
```typescript
onMouseDown={handleMouseDown}
onMouseUp={handleMouseUp}
onMouseLeave={handleMouseUp}
// No touch event handlers
```

**Recommended Fix:**
- Add `onTouchStart`/`onTouchEnd` handlers
- Or redesign as tap-to-boost (each tap adds momentum)
- Test on actual mobile devices

**Priority:** HIGH - Mobile is a target platform

---

### 5. ConstellationGame - Strict Ordering Frustration

**Problem:** Stars must be clicked in exact order (0, 1, 2, 3, 4). One wrong click resets nothing but shows error. Player has to guess the intended order which isn't visually obvious.

**Current Logic:**
```typescript
if (id === connected.length) {
    // Only accepts the next star in sequence
} else {
    setShaking(true);
    setMessage("ALIGNMENT ERROR. RESET.");
}
```

**Recommended Fix:**
- Show numbered hints after first failure
- Or show dashed "projected path" to next target
- Or allow any valid path between stars (multiple solutions)

**Priority:** MEDIUM - Used 2x in Apollo

---

### 6. DiagnosisGame - Unclear Failure State

**Problem:** When focus/magnification aren't correct, clicking "Analyze" does nothing. No feedback about what's wrong.

**Current Code:**
```typescript
const handleIdentify = () => {
    if (Math.abs(focus - targetFocus) <= tolerance && magnification === 4) {
        setIdentified(true);
        // Success
    } else {
        // Nothing happens! No feedback!
    }
};
```

**Recommended Fix:**
```typescript
} else {
    if (magnification !== 4) {
        setMessage("Increase magnification to 4x");
    } else {
        setMessage("Adjust focus - image is blurry");
    }
}
```

**Priority:** MEDIUM

---

## Minor Issues (Polish Items)

### 7. Repetitive SiloGame Theme
The same SiloGame is used 3 times with nearly identical appearance. Even if mechanics improve, consider visual variety (different tank shapes, different substances, etc.)

### 8. ScaleGame Medieval Visual Complexity
The medieval scale visual has many nested transforms that can cause jitter on lower-end devices. Consider simplifying the CSS.

### 9. LensCraftingGame Stage Progression
The blur calculation is complex and can sometimes show negative blur values. Add `Math.max(0, ...)` guard (partially there but edge cases exist).

### 10. Missing Touch Events in Multiple Games
Several games rely on mouse events only:
- CentrifugeGame
- CircleGame (has touch, good)
- GrindingGame (check)
- LensCraftingGame (uses click, OK)

---

## Recommendations Summary

### Immediate Fixes (Before Beta)

| Game | Fix | Effort |
|------|-----|--------|
| SiloGame | Add dynamic challenge (drifting values, time pressure) | 4hr |
| GearsGame | Add actual gear validation logic | 2hr |
| CentrifugeGame | Add touch event handlers | 1hr |
| DiagnosisGame | Add failure feedback messages | 30min |

### Short-Term Improvements (Before Launch)

| Game | Fix | Effort |
|------|-----|--------|
| TriageGame | Redesign choices to be more ambiguous | 2hr |
| ConstellationGame | Add visual hints for sequence | 2hr |
| SiloGame | Create 2 additional variants for Acts 8/28 | 8hr |

### Nice-to-Have (Post-Launch)

| Game | Fix | Effort |
|------|-----|--------|
| All games | Add sound effects | 8hr |
| All games | Add haptic feedback (vibration) | 4hr |
| ScaleGame | Simplify CSS transforms | 2hr |

---

## Game Quality Scores

| Story | Minigame Count | Good+ | Needs Work | Score |
|-------|----------------|-------|------------|-------|
| Apollo 11 | 12 | 5 | 7 | 42% |
| Archimedes | 9 | 8 | 1 | 89% |
| Alchemist | 7 | 7 | 0 | 100% |

**Overall Assessment:** Apollo 11 needs the most work. Archimedes is nearly ready. Alchemist is launch-ready.

---

## Testing Checklist

Before considering minigames "done":

- [ ] Play through each minigame on desktop Chrome
- [ ] Play through each minigame on mobile Safari (iOS)
- [ ] Play through each minigame on mobile Chrome (Android)
- [ ] Verify all success/failure states trigger correctly
- [ ] Verify progress saves after completion
- [ ] Check for console errors during gameplay
- [ ] Test with slow network (images loading)
- [ ] Test rapid clicking/interaction edge cases

---

*Generated: January 2026*
