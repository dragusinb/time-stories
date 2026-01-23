# Claude Quick Reference

**Full guide: See STORY_GUIDE.md**

---

## CRITICAL RULES

### Images
```
16-bit pixel art style, [scene], limited color palette, retro game aesthetic, no text
```

### Acts
- Present tense, second person ("You stand...")
- 50-100 words
- Specific numbers and details
- Historically accurate - verify everything

### Minigames
- ~1 per 4-5 acts
- NO DUPLICATES within same story
- Must fit narrative moment

---

## MINIGAME TYPES (Pick unique per story)

**Timing:** silo, centrifuge
**Puzzle:** cipher, sequence, tangram, displacement
**Skill:** alignment, scale, circle, catapult, defense
**Collection:** sample, ratcatcher
**Knowledge:** quiz, diagnosis
**Memory:** memory, symbolmatching
**Crafting:** mixing, grinding, lens, microscope
**Procedure:** checklist, sanitation
**Navigation:** constellation, gears, timeline

---

## IMAGE COMMAND

```powershell
.\generate-image.ps1 -Prompt "16-bit pixel art style, [scene], limited color palette, retro game aesthetic, no text" -OutputPath "public/images/[story]/act-[N].png"
```

---

## STORY THEMES

| Story | Theme | Era |
|-------|-------|-----|
| Apollo (s1) | apollo | 1969 Moon landing |
| Alchemist (s2) | medieval | 1348 Black Death |
| Archimedes (s3) | ancient | 212 BC Syracuse |

---

## BEFORE COMMITTING

- [ ] All facts verified
- [ ] No duplicate minigame types
- [ ] Images are pixel art
- [ ] No text in images
- [ ] Present tense, second person
- [ ] Theme prop passed to minigames
