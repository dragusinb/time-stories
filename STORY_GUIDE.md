# TimeStories - Story Generation Guide

This guide provides templates and rules for creating historically accurate, engaging interactive stories.

---

## CORE PRINCIPLES

### 1. Historical Accuracy
- **Research first**: Verify all facts before writing
- **Use primary sources**: NASA transcripts, historical documents, academic papers
- **No anachronisms**: Technology, language, and culture must match the era
- **Real events only**: Drama comes from actual historical moments, not fiction

### 2. Drama Without Fiction
- Find the natural tension in real events
- Use actual quotes when possible
- Highlight genuine life-or-death moments
- Let the reader experience real decisions historical figures faced

### 3. Educational Value
- Each act should teach something
- Include specific numbers, dates, and details
- Explain the "why" behind actions
- Connect to broader historical significance

---

## ACT STRUCTURE

### Act Template
```typescript
createAct(
    storyRef,           // Story reference (s1, s2, s3)
    actNumber,          // Sequential number (1-40)
    "Title",            // Short, evocative (2-4 words)
    "Description",      // 50-100 words, present tense, second person
    minigame,           // Optional: minigame object or undefined
    "/images/path.png"  // Image path
)
```

### Description Guidelines
- **Present tense**: "You stand..." not "You stood..."
- **Second person**: "You" not "He/She"
- **Sensory details**: What do you see, hear, feel, smell?
- **Specific numbers**: "7.6 million pounds of thrust" not "enormous thrust"
- **Historical context**: Why this moment matters

### Example - Good Act:
```typescript
createAct(s1, 9, "Touchdown",
    "A blue light illuminates on the panel. 'Contact light,' Buzz calls—the 67-inch probes beneath the landing pads have touched the surface. You hit the engine stop button. The LM settles with barely a bump. 'Houston, Tranquility Base here. The Eagle has landed.' Charlie Duke's voice breaks: 'Roger, Tranquility. You got a bunch of guys about to turn blue. We're breathing again.'",
    undefined,
    "/images/apollo/act-9.png"
)
```

**Why it works:**
- Specific detail (67-inch probes, blue contact light)
- Actual quote from the mission
- Emotional moment (Charlie Duke's voice breaking)
- Present tense, second person

---

## MINIGAME DESIGN

### Placement Rules
- **Density**: ~1 minigame per 4-5 acts
- **No duplicates**: Each minigame type used only ONCE per story
- **Narrative fit**: Minigame must match the story moment
- **Variety**: Mix timing, puzzle, skill, and knowledge games

### Available Minigame Types

| Type | Mechanic | Best For |
|------|----------|----------|
| silo | Timing needle in zone | Pressure monitoring, fuel levels |
| constellation | Connect stars/points | Navigation, mapping |
| cipher | Type decoded message | Computer commands, codes |
| quiz | Multiple choice question | Decisions, knowledge checks |
| sample | Collection mechanic | Gathering items |
| diagnosis | Identify problem | Medical, technical troubleshooting |
| scale | Balance/leveling | Weight distribution, calibration |
| alignment | Position target | Aiming, positioning equipment |
| sequence | Order steps correctly | Procedures, checklists |
| memory | Remember pattern | Recall sequences |
| centrifuge | Rhythm/timing beats | Approach timing, spinning |
| checklist | Verify items with issues | Pre-flight checks |
| mixing | Combine ingredients | Chemistry, cooking |
| grinding | Circular motion | Preparation, crafting |
| lens | Focus/grind lens | Optics, precision work |
| microscope | Find target in view | Identification, research |
| ratcatcher | Catch moving targets | Hunting, capturing |
| sanitation | Clean/organize | Hygiene, protocols |
| circle | Draw perfect circle | Geometry, precision |
| defense | Protect from attacks | Combat, tower defense |
| displacement | Water/volume puzzle | Physics, measurement |
| gears | Rotate mechanisms | Engineering, machines |
| catapult | Aim and launch | Projectiles, targeting |
| timeline | Select correct value | Dates, durations |
| tangram | Fit shapes together | Construction, puzzles |
| symbolmatching | Match pairs | Memory, pattern recognition |

### Minigame Template
```typescript
{
    id: 'mg-story-X-Y',        // Unique ID
    type: 'minigameType',       // From list above
    theme: 'apollo',            // 'apollo' | 'medieval' | 'ancient'
    question: "Task Title",     // What player must do
    instructions: "Details",    // How to do it
    winningCondition: "Success" // What success looks like
    // Additional props depend on minigame type
}
```

### Type-Specific Props

**quiz:**
```typescript
quizQuestion: "The actual question?",
options: ["Option A", "Option B", "Option C", "Option D"],
correctAnswer: 0,  // Index of correct option
explanation: "Why this is correct..."
```

**sequence:**
```typescript
items: ["Step 1", "Step 2", "Step 3", "Step 4"],
correctOrder: ["Step 2", "Step 1", "Step 4", "Step 3"]
```

**cipher:**
```typescript
encrypted: "ABC-DEF",      // What player sees
decrypted: "FULL PHRASE"   // What player must type
```

---

## IMAGE GENERATION

### Style Requirements
- **16-bit pixel art** - Always
- **Limited color palette** - Retro aesthetic
- **No text in images** - Text breaks immersion
- **No photorealistic** - Game aesthetic only

### Prompt Template
```
16-bit pixel art style, [scene description], [key elements], [mood/lighting], limited color palette, retro game aesthetic, no text
```

### Examples by Theme

**Apollo (Space/1960s):**
```
16-bit pixel art style, Apollo astronaut on lunar surface collecting rock samples, gray moon dust, black starry sky, Earth visible in distance, retro game aesthetic, limited color palette, no text
```

**Medieval (1300s Europe):**
```
16-bit pixel art style, medieval alchemist laboratory with bubbling potions, stone walls, candles, wooden shelves with bottles, dark atmospheric lighting, retro game aesthetic, limited color palette, no text
```

**Ancient (Classical Greece/Rome):**
```
16-bit pixel art style, ancient Greek mathematician drawing in sand on beach, Mediterranean sea, white robes, geometric tools, warm sunlight, retro game aesthetic, limited color palette, no text
```

### Image Command
```powershell
.\generate-image.ps1 -Prompt "[prompt]" -OutputPath "public/images/[story]/act-[N].png"
```

---

## STORY STRUCTURE

### 40-Act Framework

| Phase | Acts | Focus |
|-------|------|-------|
| Setup | 1-10 | Introduction, world-building, initial challenge |
| Rising Action | 11-20 | Complications, skill development, discoveries |
| Climax | 21-30 | Peak tension, critical decisions, major events |
| Resolution | 31-40 | Consequences, return, legacy |

### Pacing Guidelines
- **Every 4-5 acts**: Include a minigame
- **Every 8-10 acts**: Major dramatic moment
- **Acts 1-3**: Hook the reader, establish stakes
- **Acts 38-40**: Satisfying conclusion, historical significance

---

## RESEARCH CHECKLIST

Before writing any act, verify:

- [ ] Date and time accuracy
- [ ] Technical specifications (dimensions, weights, speeds)
- [ ] Actual quotes from participants
- [ ] Sequence of events
- [ ] Environmental conditions
- [ ] Equipment and technology available
- [ ] Cultural/social context
- [ ] What was known vs. unknown at the time

### Trusted Sources by Theme

**Apollo/Space:**
- NASA History Office (history.nasa.gov)
- Apollo Lunar Surface Journal
- NASA Technical Reports Server
- Astronaut memoirs and interviews

**Medieval/Plague:**
- Primary sources: Boccaccio, chronicles
- Academic journals on medieval medicine
- Museum collections and catalogs

**Ancient Greece/Rome:**
- Classical texts (Plutarch, Archimedes' writings)
- Archaeological findings
- Academic histories

---

## QUALITY CHECKLIST

Before finalizing any act:

### Content
- [ ] Historically accurate (verified with sources)
- [ ] No anachronisms (technology, language, concepts)
- [ ] Specific details (numbers, names, dates)
- [ ] Present tense, second person
- [ ] 50-100 words
- [ ] Sensory details included
- [ ] Educational value present

### Minigame (if applicable)
- [ ] Type not used elsewhere in story
- [ ] Fits narrative moment
- [ ] Clear instructions
- [ ] Achievable but challenging
- [ ] Theme prop matches story

### Image
- [ ] Pixel art style
- [ ] Matches act description
- [ ] No text in image
- [ ] Correct file path
- [ ] Limited color palette

---

## CREATING A NEW STORY

### Step 1: Research Phase
1. Choose historical period/event
2. Gather primary sources
3. Create timeline of key events
4. Identify dramatic moments
5. Note specific details (quotes, numbers, sensory info)

### Step 2: Outline Phase
1. Map 40 acts to timeline
2. Identify minigame placement (~8-10 per story)
3. Assign unique minigame types
4. Note image needs for each act

### Step 3: Writing Phase
1. Write acts in sequence
2. Verify each fact as you write
3. Add minigame configs where planned
4. Review for voice consistency

### Step 4: Image Phase
1. Generate pixel art for each act
2. Review for style consistency
3. Ensure no text in images
4. Verify file paths

### Step 5: Testing Phase
1. Play through entire story
2. Test each minigame
3. Check image loading
4. Verify narrative flow

---

## COMMON MISTAKES TO AVOID

1. **Fictional drama**: Don't invent dangers that didn't exist
2. **Anachronistic knowledge**: Characters shouldn't know future events
3. **Vague descriptions**: Always use specific numbers and details
4. **Duplicate minigames**: Each type only once per story
5. **Realistic images**: Always use pixel art style
6. **Text in images**: Never include text overlays
7. **Past tense**: Always write in present tense
8. **Third person**: Always use "you" not "he/she"
9. **Modern idioms**: Language should fit the era
10. **Skipping research**: Every detail must be verified

---

## EXAMPLE: COMPLETE ACT WITH MINIGAME

```typescript
createAct(s1, 20, "Laser Ranging",
    "The Lunar Ranging Retroreflector. A grid of 100 corner-cube prisms that will reflect laser beams back to Earth. You position it on the surface, adjusting the tilt until it points toward home. Scientists will bounce lasers off this for the next 50 years.",
    {
        id: 'mg-story-1-20',
        type: 'alignment',
        theme: 'apollo',
        question: "Position the Retroreflector",
        instructions: "Adjust the reflector's tilt until Earth is centered in the alignment scope.",
        winningCondition: "Reflector Aligned"
    },
    "/images/apollo/act-20.png"
)
```

**Image prompt for this act:**
```
16-bit pixel art style, Apollo astronaut positioning laser retroreflector on lunar surface, grid of reflective prisms visible, gray moon surface, Earth visible in black sky, scientific equipment, retro game aesthetic, limited color palette, no text
```

---

## FILE STRUCTURE

```
/lib/data.ts           - All story content
/components/minigames/ - Minigame components
/public/images/
  /apollo/            - Apollo story images (act-1.png to act-40.png)
  /alchemist/         - Alchemist story images
  /archimedes/        - Archimedes story images
/STORY_GUIDE.md       - This file
/TASKS.md             - Progress tracking
/CLAUDE.md            - Quick reference
```
