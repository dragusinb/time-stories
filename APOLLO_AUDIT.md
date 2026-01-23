# Apollo Story Audit

Based on STORY_GUIDE.md rules. Generated 2024-01-23.

---

## SUMMARY

| Category | Issues Found | Priority |
|----------|--------------|----------|
| Images | 10 acts need pixel art | HIGH |
| Minigames | 5 missing theme prop | MEDIUM |
| Text | 3 minor issues | LOW |

---

## IMAGES TO REGENERATE

These images are from December and likely NOT pixel art style:

| Act | Title | Status | Issue |
|-----|-------|--------|-------|
| 1 | The Shoulders of Giants | ❌ REDO | Dec 8 - Not pixel art |
| 2 | Ignition | ❌ REDO | Dec 8 - Not pixel art |
| 3 | Orbit Insertion | ❌ REDO | Dec 8 - Not pixel art |
| 4 | Translunar Injection | ⚠️ CHECK | Verify style |
| 5 | Passive Thermal Control | ⚠️ CHECK | Verify style |
| 6 | Lunar Orbit Insertion | ⚠️ CHECK | Verify style |
| 7 | Undocking | ⚠️ CHECK | Verify style |
| 8 | The Descent | ⚠️ CHECK | Verify style |
| 9 | Touchdown | ⚠️ CHECK | Verify style |
| 10 | Go/No-Go | ❌ REDO | Dec 8 - Not pixel art |
| 16 | The Call | ❌ REDO | Dec 19 - Not pixel art |
| 17 | EASEP Deployment | ❌ REDO | Dec 19 - Not pixel art |
| 18 | Suit Integrity | ❌ REDO | Dec 22 - Verify style |
| 19 | Seismometer Leveling | ❌ REDO | Dec 22 - Verify style |
| 20 | Laser Ranging | ❌ REDO | Dec 22 - Verify style |
| 25 | The Broken Switch | ❌ REDO | Dec 11 - Not pixel art |

### Image Prompts for Regeneration

**Act 1 - The Shoulders of Giants:**
```
16-bit pixel art style, three astronauts in white spacesuits standing on launch tower gantry, massive Saturn V rocket beside them, Cape Kennedy launch pad, humid summer morning, retro game aesthetic, limited color palette, no text
```

**Act 2 - Ignition:**
```
16-bit pixel art style, Saturn V rocket lifting off from launch pad, massive orange flames and smoke clouds, five F-1 engines firing, Cape Kennedy, dramatic launch moment, retro game aesthetic, limited color palette, no text
```

**Act 3 - Orbit Insertion:**
```
16-bit pixel art style, Apollo spacecraft interior cockpit view, astronaut checking instrument panels, Earth visible through window, zero gravity, retro game aesthetic, limited color palette, no text
```

**Act 10 - Go/No-Go:**
```
16-bit pixel art style, two astronauts inside cramped Lunar Module cabin putting on spacesuits, equipment and controls visible, preparing for moonwalk, retro game aesthetic, limited color palette, no text
```

**Act 16 - The Call:**
```
16-bit pixel art style, Apollo astronaut on lunar surface holding American flag, talking to President Nixon, Earth visible in black sky, historic phone call, retro game aesthetic, limited color palette, no text
```

**Act 17 - EASEP Deployment:**
```
16-bit pixel art style, Apollo astronaut deploying scientific equipment on lunar surface, seismometer and retroreflector visible, gray moon dust, black sky, retro game aesthetic, limited color palette, no text
```

**Act 18 - Suit Integrity:**
```
16-bit pixel art style, close view of Apollo spacesuit PLSS backpack, warning lights on control panel, astronaut checking life support system, lunar surface background, retro game aesthetic, limited color palette, no text
```

**Act 19 - Seismometer Leveling:**
```
16-bit pixel art style, Apollo astronaut kneeling to level seismometer instrument on lunar surface, bubble level visible, scientific equipment deployment, retro game aesthetic, limited color palette, no text
```

**Act 20 - Laser Ranging:**
```
16-bit pixel art style, Apollo astronaut positioning laser retroreflector on lunar surface, grid of reflective prisms visible, pointing toward Earth in black sky, retro game aesthetic, limited color palette, no text
```

**Act 25 - The Broken Switch:**
```
16-bit pixel art style, interior of Apollo Lunar Module, broken circuit breaker switch on panel, astronaut looking concerned, cramped cabin with equipment, retro game aesthetic, limited color palette, no text
```

---

## MINIGAMES TO FIX

Missing `theme: 'apollo'` prop:

| Act | Type | Fix Required |
|-----|------|--------------|
| 3 | silo | Add `theme: 'apollo'` |
| 4 | constellation | Add `theme: 'apollo'` |
| 7 | cipher | Add `theme: 'apollo'` |
| 12 | sample | Add `theme: 'apollo'` |
| 20 | alignment | Add `theme: 'apollo'` |

### Code Fixes

**Act 3:**
```typescript
{
    id: 'mg-story-1-3',
    type: 'silo',
    theme: 'apollo',  // ADD THIS
    question: "Verify Oxygen Mixture",
    ...
}
```

**Act 4:**
```typescript
{
    id: 'mg-story-1-4',
    type: 'constellation',
    theme: 'apollo',  // ADD THIS
    question: "Align Navigation Star",
    ...
}
```

**Act 7:**
```typescript
{
    id: 'mg-story-1-7',
    type: 'cipher',
    theme: 'apollo',  // ADD THIS (for sci-fi theme)
    question: "Decode the 1202 Alarm",
    ...
}
```

**Act 12:**
```typescript
{
    id: 'mg-story-1-12',
    type: 'sample',
    theme: 'apollo',  // ADD THIS
    question: "Collect Lunar Samples",
    ...
}
```

**Act 20:**
```typescript
{
    id: 'mg-story-1-20',
    type: 'alignment',
    theme: 'apollo',  // ADD THIS
    question: "Position the Retroreflector",
    ...
}
```

---

## TEXT ISSUES

| Act | Issue | Severity |
|-----|-------|----------|
| 17 | "1/6th" should be "one-sixth" for consistency | LOW |
| 38 | "violent" should be "violently" (grammar) | LOW |
| 31 | Text doesn't mention successful docking conclusion | LOW |

### Text Fixes

**Act 17:** Change "1/6th gravity" to "one-sixth gravity"

**Act 38:** Change "jerking the capsule violent" to "jerking the capsule violently"

**Act 31:** Add conclusion after minigame context: current text ends abruptly with "too slow and you'll miss the window" - should mention successful docking after the minigame challenge.

---

## HISTORICAL ACCURACY CHECK

| Act | Claim | Status | Source |
|-----|-------|--------|--------|
| 1 | "7.5 million pounds" | ⚠️ | Should be ~6.2M lbs at launch |
| 2 | "7.6 million pounds of thrust" | ✅ | Correct |
| 4 | "74 kilobytes of memory" | ✅ | Correct (72KB RAM + 2KB) |
| 6 | "357.5 seconds" burn | ✅ | Correct |
| 9 | "67-inch probes" | ✅ | Correct |
| 11 | "109:24:15 mission time" | ✅ | Correct |
| 33 | "135:23:42" TEI burn | ⚠️ | Verify exact time |
| 37 | "24,677 mph" | ✅ | Approximately correct |

### Correction Needed

**Act 1:** "7.5 million pounds of explosive potential"
- The fully fueled Saturn V weighed about 6.2 million pounds
- Could rephrase to "over six million pounds of rocket and fuel"

---

## EXECUTION ORDER

### Phase 1: Fix Minigame Theme Props (5 changes)
1. Add theme: 'apollo' to Acts 3, 4, 7, 12, 20

### Phase 2: Fix Text Issues (3 changes)
1. Act 1: Fix weight claim
2. Act 17: Fix fraction format
3. Act 38: Fix grammar

### Phase 3: Regenerate Images (10 images)
1. Act 1, 2, 3, 10 (launch sequence)
2. Act 16, 17 (surface operations)
3. Act 18, 19, 20 (equipment deployment)
4. Act 25 (broken switch)

---

## CHECKLIST

### Minigames
- [ ] Act 3: Add theme prop
- [ ] Act 4: Add theme prop
- [ ] Act 7: Add theme prop
- [ ] Act 12: Add theme prop
- [ ] Act 20: Add theme prop

### Text
- [ ] Act 1: Fix weight (6.2M not 7.5M)
- [ ] Act 17: "one-sixth" not "1/6th"
- [ ] Act 38: "violently" not "violent"

### Images
- [ ] Act 1: Regenerate pixel art
- [ ] Act 2: Regenerate pixel art
- [ ] Act 3: Regenerate pixel art
- [ ] Act 10: Regenerate pixel art
- [ ] Act 16: Regenerate pixel art
- [ ] Act 17: Regenerate pixel art
- [ ] Act 18: Regenerate pixel art
- [ ] Act 19: Regenerate pixel art
- [ ] Act 20: Regenerate pixel art
- [ ] Act 25: Regenerate pixel art

---

## NOTES

- Acts 11-15, 21-24, 26 were regenerated Jan 22 - verify they are pixel art
- Acts 27-40 were regenerated Jan 23 - confirmed pixel art
- CipherGame (Act 7) uses 'sci-fi' theme internally, but 'apollo' should work
