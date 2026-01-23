import { Story, Act, Minigame } from '@/types';

// Helper to create acts
const createAct = (storyId: string, i: number, title: string, content: string, minigame?: Minigame, backgroundImage?: string): Act => ({
    id: `act-${storyId}-${i}`,
    storyId,
    actNumber: i,
    title,
    content,
    isLocked: i > 5, // Lock after Act 5 for all stories initially
    price: i > 5 ? 20 : 0,
    minigame,
    backgroundImage,
});

// ==========================================
// STORY 1: Apollo 11: The Eagle's Shadow
// ==========================================
const story1Acts: Act[] = [];
const s1 = 'story-1';

// --- PHASE 1: THE JOURNEY (Acts 1-10) ---
story1Acts.push(
    createAct(s1, 1, "The Shoulders of Giants", "July 16, 1969. Cape Kennedy. You are Neil Armstrong, commander of Apollo 11. The humidity clings to your flight suit as you stand on the gantry. The Saturn V groans beneath you, fully fueled—7.5 million pounds of explosive potential. Behind you are Buzz Aldrin and Mike Collins. Three men. One mission. The eyes of the world are watching.", undefined, "/images/apollo/act-1.png"),
    createAct(s1, 2, "Ignition", "9:32 AM EDT. The five F-1 engines ignite in sequence, building to 7.6 million pounds of thrust—the most powerful machine ever built. The Saturn V consumes 20 tons of fuel per second. The vibration rattles your teeth; your vision blurs from the 4G acceleration. In 12 minutes, you will be in orbit. In 76 hours, you will be on the Moon.", undefined, "/images/apollo/act-2.png"),
    createAct(s1, 3, "Orbit Insertion", "Silence. Zero G. The engines cut off. But Houston needs a systems check before the TLI burn. The fuel mixture indicators are fluctuating.", {
        id: 'mg-story-1-3',
        type: 'silo',
        question: "Verify Oxygen Mixture",
        instructions: "Adjust the regulator to the optimal percentage (95%).",
        winningCondition: "Stable Atmosphere Achieved"
    }, "/images/apollo/act-3.png"),
    createAct(s1, 4, "Translunar Injection", "The third-stage S-IVB fires for 5 minutes 47 seconds, accelerating you to 24,500 mph—escape velocity. Earth shrinks behind you. The onboard Apollo Guidance Computer, with just 74 kilobytes of memory, needs periodic realignment. You sight through the sextant, finding guide stars like ancient mariners. Navigation in space uses the same principles humans have used for millennia.", {
        id: 'mg-story-1-4',
        type: 'constellation',
        question: "Align Navigation Star",
        instructions: "Trace the constellation path to calibrate the guidance computer.",
        winningCondition: "Guidance Calibrated"
    }, "/images/apollo/act-4.png"),
    createAct(s1, 5, "Passive Thermal Control", "The spacecraft rotates three times per hour—the 'Barbecue Roll'—to prevent the sun-facing side from reaching 250°F while the dark side drops to -250°F. Earth shrinks to the size of a marble held at arm's length. You photograph it through the window. Humanity's entire history fits behind your thumb.", undefined, "/images/apollo/act-5.png"),
    createAct(s1, 6, "Lunar Orbit Insertion", "75 hours into the mission. You pass behind the Moon, losing radio contact with Earth for the first time. For 34 minutes, you are utterly alone. The Service Module engine must fire precisely—too short, you skip off into solar orbit; too long, you crash. At 75:49:50, the engine ignites for 357.5 seconds. When you emerge, Houston's voice crackles: 'Apollo 11, we're reading you.'", undefined, "/images/apollo/act-6.png"),
    createAct(s1, 7, "Undocking", "You and Buzz float through the tunnel into the Lunar Module 'Eagle'. Mike Collins stays behind in Columbia—he will orbit alone for the next 21 hours. 'See you on the flip side,' he says. The separation is smooth, but then the alarms blare. '1202 Alarm'. The computer is overloaded.", {
        id: 'mg-story-1-7',
        type: 'cipher',
        question: "Decode the 1202 Alarm",
        instructions: "Enter the override code: EXECUTIVE OVERFLOW",
        winningCondition: "Buffer Cleared",
        encrypted: "EXE-OVER-FLOW",
        decrypted: "EXECUTIVE OVERFLOW"
    }, "/images/apollo/act-7.png"),
    createAct(s1, 8, "The Descent", "The computer alarm clears—Houston says 'continue.' But the landing zone is strewn with boulders the size of cars. You take semi-manual control, pitching Eagle forward, searching for a clear spot. Fuel drops: 60 seconds... 30 seconds... Charlie Duke's voice from Houston is steady but tense.", {
        id: 'mg-story-1-8',
        type: 'quiz',
        theme: 'apollo',
        question: "Landing Zone Selection",
        instructions: "You have 20 seconds of fuel. Choose wisely.",
        winningCondition: "Clear Zone Selected",
        quizQuestion: "The programmed landing site is full of boulders. Armstrong takes manual control. What should you do?",
        options: ["Land immediately to save fuel", "Fly west to find a clearer area", "Abort and return to orbit", "Hover and wait for instructions"],
        correctAnswer: 1,
        explanation: "Armstrong flew 400 feet west, finding a clear spot in the Sea of Tranquility with just 25 seconds of fuel remaining."
    }, "/images/apollo/act-8.png"),
    createAct(s1, 9, "Touchdown", "A blue light illuminates on the panel. 'Contact light,' Buzz calls—the 67-inch probes beneath the landing pads have touched the surface. You hit the engine stop button. The LM settles with barely a bump. 'Houston, Tranquility Base here. The Eagle has landed.' Charlie Duke's voice breaks: 'Roger, Tranquility. You got a bunch of guys about to turn blue. We're breathing again.'", undefined, "/images/apollo/act-9.png"),
    createAct(s1, 10, "Go/No-Go", "Houston confirms: 'Eagle, you are stay for T1.' A 'Stay' decision means you're cleared for extended surface operations. You and Buzz begin the 2-hour process of donning your PLSS backpacks—the Portable Life Support Systems that will keep you alive outside. The world is waiting.", undefined, "/images/apollo/act-10.png")
);

// --- PHASE 2: SURFACE OPERATIONS (Acts 11-20) ---
story1Acts.push(
    createAct(s1, 11, "One Small Step", "109:24:15 mission time. You stand on the LM's porch, gripping the handrails. The ladder is just nine rungs. You descend slowly, testing each step. At the bottom, you pause. Then you place your left boot on the lunar surface. The dust compresses silently. 'That's one small step for man, one giant leap for mankind.' You have 2.5 hours. Make them count.", undefined, "/images/apollo/act-11.png"),
    createAct(s1, 12, "Contingency Sample", "First rule: get a sample. If the engine explodes now, at least we bring something home. You grab the scoop and contingency sample bags. Each sample must be carefully collected and sealed to preserve the lunar vacuum. The bag seals with a satisfying snap.", {
        id: 'mg-story-1-12',
        type: 'sample',
        question: "Collect Lunar Samples",
        instructions: "Gather rock and soil samples, then seal the container for return to Earth.",
        winningCondition: "Samples Secured"
    }, "/images/apollo/act-12.png"),
    createAct(s1, 13, "Magnificent Desolation", "Buzz joins you on the surface. The horizon is too close—only 1.5 miles away on this small world. The colors are absolute: black sky, grey-white ground, no atmosphere to blur the line. 'Magnificent desolation,' Buzz says. Above you, invisible beyond the sunlit surface, Mike Collins passes overhead in Columbia every two hours, the loneliest man in history.", undefined, "/images/apollo/act-13.png"),
    createAct(s1, 14, "Mobility", "Walking is impossible in the bulky A7L suit. You weigh 360 pounds on Earth with full gear; here, just 60. You learn to 'lope'—a bounding gait that covers ground efficiently. But momentum still applies. If you fall, you must roll onto all fours to stand; the suit can't bend at the waist. A suit breach at -250°F in vacuum gives you 15 seconds of consciousness.", undefined, "/images/apollo/act-14.png"),
    createAct(s1, 15, "The Flag", "The telescoping rod jams—the latch mechanism fails. You and Buzz hammer the pole in using rock hammers, but only manage 8 inches into the surprisingly hard regolith. A horizontal rod keeps the flag extended since there's no wind. Congress mandated an American flag, but NASA insisted on no territorial claim: international law forbids any nation from owning celestial bodies.", undefined, "/images/apollo/act-15.png"),
    createAct(s1, 16, "The Call", "'Hello Neil and Buzz, I am talking to you by telephone from the Oval Office.' President Nixon's voice arrives 1.3 seconds after he speaks—the time for radio waves to cross 238,855 miles. 'For one priceless moment, all the people on this Earth are truly one.' Speech writer William Safire had also prepared a different speech, in case you never came home.", undefined, "/images/apollo/act-16.png"),
    createAct(s1, 17, "EASEP Deployment", "The Early Apollo Scientific Experiments Package—EASEP—is surprisingly heavy even in 1/6th gravity. You carry the two instruments to a flat spot 50 feet from Eagle: the Passive Seismic Experiment to detect moonquakes, and the Laser Ranging Retroreflector. Future missions will deploy the full ALSEP suite, but you are the first. You are proving it can be done.", undefined, "/images/apollo/act-17.png"),
    createAct(s1, 18, "Suit Integrity", "Your PLSS warning light flickers. Pressure fluctuation? You stop breathing for a second. The sound of the pumps is your only companion. You must diagnose the loop. Is it a sensor error or a leak?", {
        id: 'mg-story-1-18',
        type: 'diagnosis',
        theme: 'apollo',
        question: "Diagnose PLSS Pressure Loop.",
        instructions: "Check the telemetry signals. Isolate the noise from the data.",
        winningCondition: "System Green"
    }, "/images/apollo/act-18.png"),
    createAct(s1, 19, "Seismometer Leveling", "The Passive Seismic Experiment (PSEP) must be perfectly level. You check the bubble. It dances in the low gravity. You adjust the legs, fighting the stiffness of your gloves. This device will listen to the moon's heartbeat long after you leave.", {
        id: 'mg-story-1-19',
        type: 'scale',
        theme: 'apollo',
        question: "Level the Seismometer.",
        instructions: "Adjust the leveling legs until the bubble is centered. Account for lunar dust settling.",
        winningCondition: "Level < 0.1 degrees"
    }, "/images/apollo/act-19.png"),
    createAct(s1, 20, "Laser Ranging", "The Lunar Ranging Retroreflector. A grid of 100 corner-cube prisms that will reflect laser beams back to Earth. You position it on the surface, adjusting the tilt until it points toward home. Scientists will bounce lasers off this for the next 50 years.", {
        id: 'mg-story-1-20',
        type: 'alignment',
        question: "Position the Retroreflector",
        instructions: "Adjust the reflector's tilt until Earth is centered in the alignment scope.",
        winningCondition: "Reflector Aligned"
    }, "/images/apollo/act-20.png")
);

// --- PHASE 3: CLOSEOUT & ASCENT (Acts 21-30) ---
story1Acts.push(
    createAct(s1, 21, "The Core", "Houston warns: 'Fifteen minutes to closeout.' The timeline is tight. You push the core tube into the regolith—the lunar soil is harder than expected, almost like wet sand frozen solid. You can only push it in a few inches. The sample will still tell us about billions of years of solar wind bombardment. Every grain is a time capsule.", undefined, "/images/apollo/act-21.png"),
    createAct(s1, 22, "Solar Wind", "You roll up the Swiss-built Solar Wind Composition experiment—a sheet of aluminum foil that has collected particles streaming from the sun for 77 minutes. On Earth, the atmosphere blocks this solar wind. Here, particles traveling 400 km/sec embed directly in the foil. Analysis will reveal helium-3, neon, and argon—materials that may one day fuel fusion reactors.", undefined, "/images/apollo/act-22.png"),
    createAct(s1, 23, "Contamination", "You hoist the rock boxes up the conveyor. Dust is everywhere. It is in the treads, on the suits, in the cabin. It smells like gunpowder. It is the smell of a dead world.", undefined, "/images/apollo/act-23.png"),
    createAct(s1, 24, "Weight Limits", "Before closeout, the computer calculates: you are heavy. The ascent engine has no margin for error. You must jettison the non-essentials through the hatch: the overshoes, the empty PLSS backpacks, the armrests. The moon rocks stay—that's the whole point. The boots are expendable; the science is priceless.", {
        id: 'mg-story-1-24',
        type: 'sequence',
        theme: 'apollo',
        question: "Closeout Procedure",
        instructions: "Arrange the closeout steps in correct order.",
        winningCondition: "Closeout complete.",
        items: ["Seal rock boxes", "Jettison equipment", "Verify cabin pressure", "Close hatch"],
        correctOrder: ["Seal rock boxes", "Jettison equipment", "Close hatch", "Verify cabin pressure"]
    }, "/images/apollo/act-24.png"),
    createAct(s1, 25, "The Broken Switch", "Before the rest period, you notice it: the Engine Arm circuit breaker is broken. Buzz's PLSS backpack struck it while maneuvering in the cramped cabin. The plastic switch snapped clean off. Without it, the ascent engine cannot be armed. Without the engine, you die here. Eagle becomes a tomb.", undefined, "/images/apollo/act-25.png"),
    createAct(s1, 26, "The Pen Solution", "Aldrin finds a solution. A felt-tipped pen fits perfectly into the hole. It works. The engine is armed. It is a moment of pure, ridiculous human ingenuity.", undefined, "/images/apollo/act-26.png"),
    createAct(s1, 27, "Rest Period", "Mission Control orders a rest period. You try to sleep in hammocks strung across the tiny cabin—Buzz on the floor, you curled up on the ascent engine cover. It's 61°F, the pumps drone constantly, and earthlight streams through the window. Neither of you sleeps more than a few fitful hours. In seven hours, you launch.", undefined, "/images/apollo/act-27.png"),
    createAct(s1, 28, "Ascent Ignition", "T-minus ten seconds. Houston confirms: 'You're GO for liftoff.' Your finger hovers over the PROCEED button. The computer displays 'PRO' — the final authorization code. One button press and the ascent engine fires, carrying you off the Moon. There is no abort. The descent stage stays behind forever—along with the flag, the experiments, and your footprints.", {
        id: 'mg-story-1-28',
        type: 'memory',
        theme: 'apollo',
        question: "Ignition Sequence Memory",
        instructions: "Remember and repeat the ignition sequence callouts.",
        winningCondition: "Engine ignition confirmed."
    }, "/images/apollo/act-28.png"),
    createAct(s1, 29, "Orbit Insertion", "The engine cuts off. You are in lunar orbit. The silence returns. Now begins the needle-in-a-haystack search for Columbia.", undefined, "/images/apollo/act-29.png"),
    createAct(s1, 30, "The Rendezvous", "A bright star appears on the horizon—Columbia. Mike Collins, who has been alone for 21 hours, orbiting while you walked on another world. 'I got you, Eagle,' his voice crackles with relief. He photographed the moon, tracked your progress, and prepared for this moment. Two spacecraft, three men, reuniting 60 miles above the lunar surface.", undefined, "/images/apollo/act-30.png")
);

// --- PHASE 4: RETURN (Acts 31-40) ---
story1Acts.push(
    createAct(s1, 31, "Docking", "Eagle approaches Columbia. Mike Collins watches through Columbia's window, calling out corrections. 'A little left... steady... you're looking good.' The approach must be perfectly timed—too fast and you'll damage both spacecraft, too slow and you'll miss the window.", {
        id: 'mg-story-1-31',
        type: 'centrifuge',
        theme: 'apollo',
        question: "Docking Approach",
        instructions: "Time your approach rhythm. Hit the beats to close the distance smoothly.",
        winningCondition: "Hard dock confirmed."
    }, "/images/apollo/act-31.png"),
    createAct(s1, 32, "Jettison Eagle", "You transfer all the cargo to Columbia. You jettison the faithful lander. It drifts away, a golden spider against the black. Goodbye, old friend.", undefined, "/images/apollo/act-32.png"),
    createAct(s1, 33, "TEI Burn", "Trans-Earth Injection: the most critical burn of the mission. At 135:23:42, behind the Moon with no radio contact, the Service Propulsion System engine fires for 2 minutes 28 seconds. It accelerates you to 5,800 mph relative to the Moon—escape velocity. If the engine fails, there is no rescue possible. The engine burns perfectly. You're going home.", undefined, "/images/apollo/act-33.png"),
    createAct(s1, 34, "Earthrise", "As you orbit one last time, Earth rises over the lunar horizon—a blue and white marble suspended in infinite black. Apollo 8's 'Earthrise' photo helped spark the environmental movement. Now you see it yourself. All of human history, every war, every love, every invention, everything anyone has ever known—visible from here at arm's length. You feel a profound shift in perspective.", undefined, "/images/apollo/act-34.png"),
    createAct(s1, 35, "Coasting", "The trip back is quiet. You shave. You stow the gear. The spacecraft is spinning slowly in the BBQ roll. You are three men in a can, falling towards home.", undefined, "/images/apollo/act-35.png"),
    createAct(s1, 36, "Re-entry Prep", "You approach Earth at 25,000 mph. You jettison the Service Module—goodbye, faithful companion. The Command Module rotates, pointing its heat shield toward the atmosphere. Time for the final checklist.", {
        id: 'mg-story-1-36',
        type: 'checklist',
        theme: 'apollo',
        question: "Verify Re-entry Systems",
        instructions: "Confirm all systems are GO for atmospheric re-entry.",
        winningCondition: "All Systems GO"
    }, "/images/apollo/act-36.png"),
    createAct(s1, 37, "Blackout", "You hit the atmosphere at 24,677 mph—faster than a rifle bullet. The heat shield reaches 5,000°F as air molecules compress and ionize. For 3 minutes, this ionized plasma blocks all radio signals. Houston sees only silence. Inside, you're pushed into your couch at 6.5 Gs while fire streams past the windows. The AVCO heat shield ablates away, carrying the heat with it.", undefined, "/images/apollo/act-37.png"),
    createAct(s1, 38, "Drogues Deployed", "The radio crackles. 'We hear you!' The drogue chutes pop out, jerking the capsule violent. The spin stops. You are falling through the clouds.", undefined, "/images/apollo/act-38.png"),
    createAct(s1, 39, "Splashdown", "The three main chutes open. Orange flowers in the blue sky. You hit the water with a massive jolt. The capsule flips over, then rights itself. You are home.", undefined, "/images/apollo/act-39.png"),
    createAct(s1, 40, "Hornet + 3", "Navy divers attach the flotation collar. You climb out, don biological isolation garments—NASA isn't taking chances with unknown lunar microbes. Helicopter 66 delivers you to the USS Hornet. President Nixon watches through the window of the Mobile Quarantine Facility. You'll spend 21 days in isolation. But you made it. Three men went to the Moon. Three men came home.", undefined, "/images/apollo/act-40.png")
);

// ==========================================
// STORY 2: Alchemist's Apprentice
// ==========================================
const story2Acts: Act[] = [];
const s2 = 'story-2';

story2Acts.push(
    createAct(s2, 1, "Waking Up in Filth", "Pain is the first thing that registers. You open your eyes in a damp, stone room. You are 'Luca', the lowest apprentice to Master Ghiberti. The year is 1348, and the Black Death is at the gates.", undefined, "/images/alchemist/act-1.png"),
    createAct(s2, 2, "The Quack's Decree", "Master Ghiberti kicks you awake. 'Get up! The Contessa de Medici has summoned us.' He lectures you on his 'treatments'—leeches and mercury. You bite your tongue.", undefined, "/images/alchemist/act-2.png"),
    createAct(s2, 3, "The Contessa's Chamber", "The Contessa Isabella lies in her bed, burning with fever. Ghiberti wants to bleed her. You see the signs: it's not the plague. It's food poisoning.", undefined, "/images/alchemist/act-3.png"),
    createAct(s2, 4, "The Diagnosis", "You step forward. 'Stop!' Ghiberti roars. You address the Contessa. 'Did you eat the shellfish?' She nods. You need to prepare a rehydration solution.", undefined, "/images/alchemist/act-4.png"),
    createAct(s2, 5, "The First Slap", "You mix the solution. Ghiberti turns purple with rage. 'Let the boy try,' the Captain orders. The fever breaks. You survived day one.", {
        id: 'mg-story-2-5',
        type: 'mixing',
        question: "Prepare a rehydration solution to treat the Contessa's acute food poisoning.",
        instructions: "Add Water and Salt to the cauldron to create a saline base, then Ignite the fire to Boil and sterilize it.",
        winningCondition: "Combine: Water + Salt + Boil",
        ingredients: ["Water", "Salt", "Mercury", "Leeches", "Boil", "Prayer"],
        correctCombination: ["Water", "Salt"]
    }, "/images/alchemist/act-5.png")
);
story2Acts.push(
    createAct(s2, 6, "The Rumor", "News spreads through the servant networks like wildfire. The 'Apprentice' saved the Contessa when the Master failed. The city whispers. Ghiberti, furious and humiliated, assigns you to the stables to keep you out of sight. But you use the isolation to your advantage, gathering resources. You find moldy bread in the feed bins—a potential source of Penicillin—but you hesitate. Without purification, it is deadly. You must differentiate between medicine and poison.", undefined, "/images/alchemist/act-6.png"),
    createAct(s2, 7, "The Library", "You sneak into the Medici library at night, the oil lamp casting long shadows. You need knowledge of the era. You find Galen's texts, filled with errors and superstitions about 'miasmas'. They are useless. You realize you cannot rely on the past; you must write the future. You look out the window at the stars, finding comfort in the logical patterns of the constellations, the only thing that hasn't changed in 700 years.", {
        id: 'mg-story-2-7',
        type: 'quiz',
        question: "You found moldy bread, a potential source of Penicillin. Why is it too dangerous to use natively right now?",
        instructions: "Recall your knowledge of microbiology and potential toxins.",
        options: [
            "It contains toxic molds alongside Penicillin",
            "It attracts plague rats",
            "The Church forbids using bread for medicine",
            "It causes immediate blindness"
        ],
        correctOption: 0
    }, "/images/alchemist/act-7.png"),
    createAct(s2, 8, "The Market Run", "Ghiberti sends you to the market for herbs. The city is quieter now. Carts pile up with bodies. You see people buying 'unicorn horns' and 'holy water' from charlatans. Desperation makes them easy targets. You spot a stall selling lemons from the coast—expensive, but potent sources of acid. An idea forms. Acidic environments can kill certain bacteria. It's primitive, but it's chemistry.", undefined, "/images/alchemist/act-8.png"),
    createAct(s2, 9, "The First Experiment", "Back in the cellar, hidden from Ghiberti, you set up a makeshift lab. Lemons, salt, sulfur. You test the mixtures on samples of spoiled meat. It's not perfect science—no petri dishes, no microscope—but you observe the rates of decay. One mixture slows the rot significantly. You feel a thrill of discovery, the first spark of hope in this dark age.", undefined, "/images/alchemist/act-9.png"),
    createAct(s2, 10, "The Sick Girl", "A woman begs at the door. Her daughter is sick. Ghiberti spots them and waves them away. 'She has no coin! Be gone!' he sneers. You see the girl's flushed face. It's not the plague; it's a simple infection from a cut. You slip out the back with your lemon-salt mixture. You clean the wound and bind it. 'Keep it clean,' you whisper. The mother looks at you as if you were an angel. 'What is your name?' she asks. 'Luca,' you say. 'Just Luca.'", undefined, "/images/alchemist/act-10.png")
);

// ACT 11-20
story2Acts.push(
    createAct(s2, 11, "The Plague Pit", "You are forced to help dispose of bodies. The smell is unbearable. You notice the gravediggers washing their hands in vinegar. It keeps them safe? Acid again. The concept of pH starts to form in your mind.", undefined, "/images/alchemist/act-11.png"),
    createAct(s2, 12, "The Rat Catcher", "You meet Marco, a rat catcher. He knows the rats are the source, but no one believes him. 'They dance before they die,' he says. You trade him a bottle of your saline mix for three live rats. You need to study the enemy.", {
        id: 'mg-story-2-12',
        type: 'ratcatcher',
        question: "Capture the Specimen",
        instructions: "Herd the rats into the CAGE using your mouse repulsor.",
        winningCondition: "All Rats Secured"
    }, "/images/alchemist/act-12.png"),
    createAct(s2, 13, "The Flea", "Under a crude magnifying glass you ground from a broken bottle, you examine the rats. You see them—fleas. Gorged with blood. The vector. It's not the air; it's the bite.", undefined, "/images/alchemist/act-13.png"),
    createAct(s2, 14, "The Theory", "You try to explain the flea theory to Ghiberti. He strikes you. 'Heresy! It is God's wrath, you insolent fool!' You learn a valuable lesson: Truth without authority is dangerous. You must keep your mouth shut and your eyes open.", undefined, "/images/alchemist/act-14.png"),
    createAct(s2, 15, "The Mixture", "You refine your lemon-sulfur mix, adding vinegar and garlic. You call it 'Four Thieves Vinegar'. It kills the fleas on the rats instantly. You have a weapon.", undefined, "/images/alchemist/act-15.png"),
    createAct(s2, 16, "The Mask", "You design a mask with a long beak to hold vinegar-soaked sponges. It looks terrifying, like a demon bird, but it filters the air and repels fleas. You are the first 'Beak Doctor'.", {
        id: 'mg-story-2-16',
        type: 'grinding',
        question: "Prepare the Mask Filter.",
        instructions: "Grind the herbs by circling your mouse until the paste is smooth. Crush any chunks!",
        winningCondition: "Paste Consistency 100%"
    }, "/images/alchemist/act-16.png"),
    createAct(s2, 17, "The Patrol", "You walk the streets in your mask. People flee from you, crossing themselves. You are a symbol of death, but you are bringing life. You spray the vinegar in the alleys where the rats gather.", undefined, "/images/alchemist/act-17.png"),
    createAct(s2, 18, "The Survivor", "You find a man who survived the Buboes. His blood... it might hold the key. Antibodies? You take a sample, paying him with bread. Ghiberti would have bled him dry.", undefined, "/images/alchemist/act-18.png"),
    createAct(s2, 19, "The Microscope", "You construct a primitive microscope from layered glass beads. You see the bacteria in the rat's blood. Yersinia pestis. The enemy has a face. It is small, rod-shaped, and deadly.", {
        id: 'mg-story-2-19',
        type: 'lens',
        question: "Grind the lenses for the microscope.",
        instructions: "Tap to spin the grinding wheel. Keep the RPM in the green zone to polish the glass. Avoid overheating!",
        winningCondition: "Polish the Lens (100%)"
    }, "/images/alchemist/act-19.png"),
    createAct(s2, 20, "The Journal", "You document everything. 'The Book of Shadows', Ghiberti calls it, threatening to burn it. You hide it under your floorboards. This knowledge must survive, even if you don't.", undefined, "/images/alchemist/act-20.png")
);

// ACT 21-30
story2Acts.push(
    createAct(s2, 21, "Ghiberti's Fall", "Ghiberti falls ill. He begs you for the 'unicorn horn' powder. You know it's useless. You have the vinegar. You save him, not out of love, but because a dead Master draws too much attention.", undefined, "/images/alchemist/act-21.png"),
    createAct(s2, 22, "The Promotion", "The City Council notices Ghiberti's 'miraculous' recovery. They appoint him Chief Physician. He takes the credit, of course. 'My prayers were answered,' he boasts. You stay in the shadows, grinding herbs.", undefined, "/images/alchemist/act-22.png"),
    createAct(s2, 23, "The Quarantine", "The port is the city's open wound. You know the plague arrives by ship. Late at night, you forge Ghiberti's signature on a decree: 'Seal the harbor. No ship docks under penalty of death.' The Captain of the Guard studies the paper. He knows it's a forgery, but he looks at the fear in his men's eyes, then at you. He nods. He trusts your science more than the Master's politics.", undefined, "/images/alchemist/act-23.png"),
    createAct(s2, 24, "The Ships", "A ship arrives from Genoa. They have the sickness. The Captain prevents them from docking. They scream and curse, but the city remains sealed. You saved thousands today.", undefined, "/images/alchemist/act-24.png"),
    createAct(s2, 25, "The Riot", "The wealthy merchants are angry. The quarantine is costing them money. They incite a mob. 'The doctors are poisoning us!' they shout. They attack Ghiberti's house.", undefined, "/images/alchemist/act-25.png"),
    createAct(s2, 26, "The Hideout", "You drag the terrifyingly useless Ghiberti to safety in the catacombs. It's cool and dry here. No rats. You set up a new lab among the tombs of the old saints.", undefined, "/images/alchemist/act-26.png"),
    createAct(s2, 27, "The Mold", "The bread in your hideout goes moldy. Blue mold. Penicillium. You remember Fleming. You have the cure. It was growing on your lunch all along.", undefined, "/images/alchemist/act-27.png"),
    createAct(s2, 28, "The Culture", "You grow the mold on broths. It smells earthy. You peer through your primitive microscope, searching for the strands that produce the healing compound. You test it on a sick dog the Captain brought you. The dog recovers. You have an antibiotic.", {
        id: 'mg-story-2-28',
        type: 'microscope',
        question: "Identify the Penicillium Culture",
        instructions: "Find the correct mold structure under the microscope.",
        winningCondition: "Penicillium identified"
    }, "/images/alchemist/act-28.png"),
    createAct(s2, 29, "Patient Zero", "The Contessa is sick again. Not food poisoning this time. The Plague. Ghiberti is too afraid to go. You wear your mask and take your mold 'juice'.", undefined, "/images/alchemist/act-29.png"),
    createAct(s2, 30, "The Return", "You emerge from the catacombs in your mask. Use the tunnels to reach the palace unseen. The guards let you pass. They know the Beak Doctor is their only hope.", undefined, "/images/alchemist/act-30.png")
);

// ACT 31-40
story2Acts.push(
    createAct(s2, 31, "The Bedside", "The Contessa's breath is shallow, a rattle in her chest. You administer the mold broth, your hand trembling not from fear, but from the weight of the moment. Ghiberti bursts in, guards at his heels. 'Poisoner!' he shrieks. The Captain's sword leaves its sheath with a hiss. 'Silence,' he commands. 'We wait.'", undefined, "/images/alchemist/act-31.png"),
    createAct(s2, 32, "The Stand", "Hours bleed into the night. Shadows stretch and recoil on the stone walls. Ghiberti paces like a caged wolf. You sit still, watching the rise and fall of her chest. It is the only rhythm that matters. Then, the fever breaks. Like a storm passing, her skin cools. She opens her eyes.", undefined, "/images/alchemist/act-32.png"),
    createAct(s2, 33, "The Revelation", "She looks at the room, then at you. 'The bird man,' she whispers, her voice brittle as dried leaves. 'I saw you in the dark.' She points a trembling finger at your mask. 'You walked where death walked, and you did not flinch.' Ghiberti protests, but the truth is a heavy stone; it cannot be moved.", undefined, "/images/alchemist/act-33.png"),
    createAct(s2, 34, "The Arrest", "Ghiberti is dragged away, his screams echoing in the courtyard. He falls not because he was evil, but because he was obsolete. You feel no triumph. Only a quiet exhaustion. You have cut out a cancer, but the body is still weak.", undefined, "/images/alchemist/act-34.png"),
    createAct(s2, 35, "The New Master", "At sixteen, you are named Chief Physician to the Medici. The robe is heavy on your shoulders. You do not want power; you want cleanliness. You look at the filth in the streets, the rats in the gutters. The city is a patient, and it is rotting.", undefined, "/images/alchemist/act-35.png"),
    createAct(s2, 36, "The New Protocols", "You open a school, but not for Latin or Astrology. You teach the 'New Medicine'. Observation over superstition. You show them the invisible enemy. You drill them on the protocols until their hands are raw from scrubbing.", {
        id: 'mg-story-2-36',
        type: 'sanitation',
        question: "Teach the Sanitation Protocols.",
        instructions: "Match the correct action to neutralize the threat.",
        winningCondition: "Protocols Established"
    }, "/images/alchemist/act-36.png"),
    createAct(s2, 37, "The Legacy", "Decades pass. The Plague returns, as it must. But the fires do not burn as high. Fewer mothers weep in the streets. You have built a wall of knowledge against the dark. It is invisible, but it holds.", undefined, "/images/alchemist/act-37.png"),
    createAct(s2, 38, "The Old Man", "You are old. Your hands, once steady, now shake like leaves in the wind. You look out at Florence. The Duomo rises, a testament to God, but the clean streets are a testament to Man. You have saved more lives than any conqueror has taken.", undefined, "/images/alchemist/act-38.png"),
    createAct(s2, 39, "The Timekeeper", "The world begins to fray at the edges. The stone dissolves into pixels. The simulation is ending. You feel a pang of loss. You loved this life. You loved the struggle. But you are not Luca. You are a traveler, and it is time to go home.", undefined, "/images/alchemist/act-39.png"),
    createAct(s2, 40, "Debrief", "Subject: Luca. Mission: Complete. Analysis: By introducing germ theory in 1348, you accelerated the Renaissance by 150 years. Human population projection: +2 Billion. Well done, agent.", undefined, "/images/alchemist/act-40.png")
);

// ==========================================
// STORY 3: Archimedes (New)
// ==========================================
const story3Acts: Act[] = [];
const s3 = 'story-3';

// ACT 1-10: The Arrival & The Lever
story3Acts.push(
    createAct(s3, 1, "Syracuse", "212 BC. You are Demetrios, a young student of mathematics from Alexandria. You have traveled to Syracuse to study under the greatest mind of the age: Archimedes. But you arrive to find a city under siege. Roman ships darken the harbor. The smell of salt and anxiety hangs in the air.", undefined, "/images/archimedes/act-1.png"),
    createAct(s3, 2, "The Old Man", "You find him near the harbor, drawing circles in the sand with a stick. Archimedes of Syracuse—75 years old, kinsman to King Hiero II, and the greatest mathematician since Euclid. He has calculated pi, discovered the laws of buoyancy, and invented machines that seem like magic. He doesn't look up as you approach. 'Do not disturb my circles,' he mutters.", {
        id: 'mg-story-3-2',
        type: 'circle',
        question: "Draw a Perfect Circle",
        instructions: "Trace a perfect circle in the sand with your finger or mouse. Aim for >80% accuracy.",
        winningCondition: "Roundness > 80%"
    }, "/images/archimedes/act-2.png"),
    createAct(s3, 3, "The Roman Fleet", "Ships approach the harbor—sixty quinqueremes carrying 30,000 men. General Marcus Claudius Marcellus commands the Roman assault, part of the Second Punic War. Rome seeks to punish Syracuse for allying with Carthage. 'They are coming,' you say. Archimedes smiles, wiping the sand from his hands. 'Let them come. I have prepared.'", undefined, "/images/archimedes/act-3.png"),
    createAct(s3, 4, "The Iron Hand", "He points to a massive crane mounted on the seawall. The Romans will call it 'Manus Ferrea'—the Iron Hand. A compound lever system with bronze claws that can grip a ship's bow, lift it from the water, and drop it. The principle is simple: a small force at the end of a long arm becomes an enormous force at the short end. 'It needs a precise operator,' he says, looking at you.", {
        id: 'mg-story-3-4',
        type: 'defense',
        question: "Defend the Harbor",
        instructions: "Tap the Roman ships to deploy the Iron Hand and smash them!",
        winningCondition: "Sink 5 Ships"
    }, "/images/archimedes/act-4.png"),
    createAct(s3, 5, "The Capsize", "The claw descends, hooking the Roman galley. With a groan of timber, the ship is lifted out of the water. Men scream. The ship flips. The Romans retreat in terror.", undefined, "/images/archimedes/act-5.png"),
    createAct(s3, 6, "The Panic", "The Roman fleet retreats in confusion. They think the gods are fighting against them. Archimedes chuckles. 'Physics, my friend. Just physics.'", undefined, "/images/archimedes/act-6.png"),
    createAct(s3, 7, "The Workshop", "He takes you to his workshop. It's a chaotic mess of scrolls, models, and bronze gears. Star charts compete with mechanical diagrams. 'You studied at the Mouseion in Alexandria,' he observes, noting your accent. 'Good. Then you understand rigor.'", undefined, "/images/archimedes/act-7.png"),
    createAct(s3, 8, "The Lever", "'Give me a lever long enough and a fulcrum on which to place it, and I shall move the world.' He demonstrates with a bronze bar and a stone. A child could lift a boulder. Force multiplied by distance equals force multiplied by distance. It is elegant. It is true. It is the language of nature.", undefined, "/images/archimedes/act-8.png"),
    createAct(s3, 9, "The King's Problem", "King Hiero II, who has ruled Syracuse for 54 years and made it the wealthiest Greek city in the west, summons Archimedes. He commissioned a golden crown to honor the gods, but suspects the goldsmith substituted silver. 'Prove it without damaging the crown,' the King commands. The problem seems impossible—until Archimedes takes a bath.", undefined, "/images/archimedes/act-9.png"),
    createAct(s3, 10, "The Bath", "Archimedes decides to take a bath to think. As he lowers himself in, the water rises. He stares at the spilling water. His eyes go wide.", {
        id: 'mg-story-3-10',
        type: 'displacement',
        question: "The Eureka Moment",
        instructions: "Drop both items in the water. Which one makes the water rise higher?",
        winningCondition: "Identify the Fake Crown"
    }, "/images/archimedes/act-10.png")
);

// ACT 11-20: The Siege & Buoyancy
story3Acts.push(
    createAct(s3, 11, "Eureka!", "Water sloshes over the marble floor. Archimedes bursts from the water, running through the streets naked, eyes wide with a terrifying clarity. 'Eureka!' he screams. He doesn't see the city; he only sees the math.", undefined, "/images/archimedes/act-11.png"),
    createAct(s3, 12, "Density", "He explains the principle breathlessly. Gold has a density of 19.3 grams per cubic centimeter—nearly twice that of silver at 10.5. A crown mixed with silver must be larger to weigh the same. When submerged, it displaces more water. The difference is measurable, mathematical, undeniable. This principle will one day be called Archimedes' Principle—the foundation of hydrostatics.", undefined, "/images/archimedes/act-12.png"),
    createAct(s3, 13, "The Test", "You set up the experiment in the palace. The King watches, his face unreadable. The goldsmith sweats. You lower the crown into the water. The level rises too high.", undefined, "/images/archimedes/act-13.png"),
    createAct(s3, 14, "The Result", "The King nods. 'Fake.' The goldsmith is dragged away to a fate you do not wish to witness. Archimedes has proven the power of the mind over matter.", undefined, "/images/archimedes/act-14.png"),
    createAct(s3, 15, "The Blockade", "The Romans return, stinging from their defeat. This time, they blockade the harbor. They will not fight; they will starve you out. The city walls become a prison.", undefined, "/images/archimedes/act-15.png"),
    createAct(s3, 16, "The Fire Ships", "Archimedes designs a new defense: fire ships. Old hulls filled with pitch, sulfur, and dry wood. 'They must float low,' he explains, 'barely visible, then ignite on contact.' You help calculate the ballast—too heavy and they sink, too light and the Romans spot them.", {
        id: 'mg-story-3-16',
        type: 'scale',
        theme: 'ancient',
        question: "Balance the fire ship's buoyancy.",
        instructions: "Add ballast weights until the ship floats at the waterline—low but not sunk.",
        winningCondition: "Balance achieved"
    }, "/images/archimedes/act-16.png"),
    createAct(s3, 17, "The Night Attack", "Nightfall. You release the fire ships into the current. They drift silently toward the Roman fleet, dark shapes on darker water. Then the pitch ignites. Flames leap from ship to ship. The Romans scramble, but fire on water cannot be fought. Half their fleet burns that night.", undefined, "/images/archimedes/act-17.png"),
    createAct(s3, 18, "The Hunger", "Months bleed by. Food strains. You help ration the grain using precise measurements. Every grain counts. The people are thin, their eyes hollow.", undefined, "/images/archimedes/act-18.png"),
    createAct(s3, 19, "The Traitor", "You spot a guard signaling a Roman ship with a mirror. You confront him. He draws a knife. 'We are starving!' he hisses. He vanishes into the shadows before you can stop him.", undefined, "/images/archimedes/act-19.png"),
    createAct(s3, 20, "The Sun", "Summer arrives. The heat is oppressive. Archimedes looks at the sun, then at the Roman sails. 'We can use this,' he whispers. 'The sun is not our enemy. It is our artillery.'", {
        id: 'mg-story-3-20',
        type: 'gears',
        theme: 'ancient',
        question: "Engage the Mirror Mechanism",
        instructions: "Place gears to connect the drive shaft to the mirror mount. Large -> Medium -> Small.",
        winningCondition: "Engage Mechanism"
    }, "/images/archimedes/act-20.png")
);

// ACT 21-30: The Mirrors & Optics
story3Acts.push(
    createAct(s3, 21, "The Mirror Plan", "He wants to use soldiers' polished bronze shields as mirrors. 'If we focus the sun's rays on a single point...' The theory is sound—parabolic reflection. Whether it will work at this distance, against moving ships, is uncertain. But the Romans don't know that. Sometimes fear is the weapon.", undefined, "/images/archimedes/act-21.png"),
    createAct(s3, 22, "Polishing", "You mobilize the soldiers. 'Put down your swords,' you order. 'Polish your shields.' They grumble, but they obey. You need a surface like water.", undefined, "/images/archimedes/act-22.png"),
    createAct(s3, 23, "The Geometry", "Parabolic focus. You help him calculate the curvature. If the angle is off by a degree, the light scatters. It must be perfect.", undefined, "/images/archimedes/act-23.png"),
    createAct(s3, 24, "The Attack", "The Roman fleet approaches at noon. The sun is at its zenith. Archimedes stands on the wall, a conductor of light. 'Hold...' he commands.", undefined, "/images/archimedes/act-24.png"),
    createAct(s3, 25, "The Burning Light", "You align the mirrors. The reflected light converges on the Roman flagship. Does it truly ignite? Later generations will debate this for millennia. But the Romans see the blinding flash, feel the heat. They panic. They retreat. Whether the sails burned or only the sailors' courage, the result is the same: Syracuse stands another day.", {
        id: 'mg-story-3-25',
        type: 'quiz',
        theme: 'ancient',
        question: "Which geometric principle is used to focus the sunlight?",
        instructions: "Identify the correct shape.",
        options: ["The Lever", "The Parabola", "The Sphere", "The Claw"],
        correctOption: 1
    }, "/images/archimedes/act-25.png")
);

// ACT 26-35: The Siege Breaker & The Screw
story3Acts.push(
    createAct(s3, 26, "The Standoff", "The Roman fleet lies in ruins. But Marcellus is stubborn. He blockades the land route. The siege drags on. It becomes a test of will.", undefined, "/images/archimedes/act-26.png"),
    createAct(s3, 27, "Thirst", "The cisterns run dry. The people look at the sea—water everywhere, but not a drop to drink. Archimedes points to the lower aquifers. 'The water is there. We just need to lift it.'", undefined, "/images/archimedes/act-27.png"),
    createAct(s3, 28, "The Screw", "You construct the device: a helical blade wound around a cylinder, tilted at 30 degrees. As the screw rotates, water is trapped between blade sections and carried upward. Archimedes may have invented this in Egypt to irrigate the Nile delta. Simple, requiring no valves or seals, it will still be used 2,200 years later in wastewater treatment plants.", {
        id: 'mg-story-3-28',
        type: 'sequence',
        theme: 'ancient',
        question: "Assemble the Archimedes Screw.",
        instructions: "Order the components: Handle -> Shaft -> Spiral -> Casing.",
        options: ["Shaft", "Spiral", "Casing", "Handle"],
        correctCombination: ["Handle", "Shaft", "Spiral", "Casing"]
    }, "/images/archimedes/act-28.png"),
    createAct(s3, 29, "Thirst Quenched", "Fresh water flows into the trough. The people cheer. You drink. It tastes like life. You have beaten nature itself.", undefined, "/images/archimedes/act-29.png"),
    createAct(s3, 30, "The Scorpion", "To keep the Romans at bay, you improve the 'Scorpion' ballistas. You apply math to the tension. Precision targeting. You pick off centurions from 300 yards.", {
        id: 'mg-story-3-30',
        type: 'catapult',
        theme: 'ancient',
        question: "Calibrate the Scorpion Ballista.",
        instructions: "Adjust the Tension (Force) and Elevation (Angle) to hit the Roman target.",
        winningCondition: "Direct Hit"
    }, "/images/archimedes/act-30.png"),
    createAct(s3, 31, "The Festival", "A year passes. The city grows complacent. Tonight is the festival of Artemis. Wine flows. Guards leave their posts. You feel a chill that has nothing to do with the wind.", undefined, "/images/archimedes/act-31.png"),
    createAct(s3, 32, "The Betrayal", "A disgruntled noble opens a side gate. No noise. Just a shadow moving in the dark. A Roman helmet glints. The end has begun.", undefined, "/images/archimedes/act-32.png"),
    createAct(s3, 33, "The Breach", "The alarm sounds too late. Romans pour into the city. Chaos. Fire. Screams. History is happening. The fall of Syracuse.", undefined, "/images/archimedes/act-33.png"),
    createAct(s3, 34, "The Workshop", "You run to Archimedes' house. He is there, working by candlelight. Ignoring the screams outside. 'I am close,' he mutters. 'The method of mechanical theorems. It changes everything.'", undefined, "/images/archimedes/act-34.png"),
    createAct(s3, 35, "The Intruder", "The door splinters. A Roman soldier stands there, sword dripping. He sees an old man. He does not see a genius. He sees a target.", undefined, "/images/archimedes/act-35.png")
);

// ACT 36-40: The Death & The Legacy
story3Acts.push(
    createAct(s3, 36, "Do Not Disturb", "Archimedes looks up, annoyed at the interruption. 'Noli turbare circulos meos!' he barks—Do not disturb my circles! The soldier does not speak Greek. He does not care. He sees only an old man who refuses to move. The sword falls.", undefined, "/images/archimedes/act-36.png"),
    createAct(s3, 37, "The Silence", "You arrive too late. Archimedes lies still, his blood mixing with the sand of his diagrams. The greatest mind of the ancient world, extinguished by a common soldier who never knew what he destroyed. General Marcellus, when he learns, will weep. He had ordered Archimedes spared.", undefined, "/images/archimedes/act-37.png"),
    createAct(s3, 38, "The Scrolls", "In the chaos, you gather what you can—scrolls, diagrams, half-finished proofs. The Romans are too busy looting gold to notice paper. You stuff them into a leather satchel. This is what matters now. Not the man. The ideas.", undefined, "/images/archimedes/act-38.png"),
    createAct(s3, 39, "The Escape", "You flee through the burning streets to the harbor. A fishing boat, abandoned in the panic. You row into the darkness as Syracuse falls. Behind you, flames reach toward the stars. Ahead, the sea is black and endless.", undefined, "/images/archimedes/act-39.png"),
    createAct(s3, 40, "Alexandria", "Weeks later, you arrive at Alexandria's Great Library—the largest collection of knowledge in the ancient world. Eratosthenes, the chief librarian who calculated the Earth's circumference, examines the scrolls with trembling hands. 'On Floating Bodies. On the Sphere and Cylinder. The Method.' Works that anticipated calculus by 1,800 years. 'His body is gone,' Eratosthenes whispers, 'but his mind will outlive Rome itself.'", undefined, "/images/archimedes/act-40.png")
);

export const stories: Story[] = [
    {
        id: 'story-1',
        title: "Apollo 11: The Eagle's Shadow",
        description: "July, 1969. Join Neil Armstrong on the voyage that defined a century. Survive the launch, land on the moon, and uncover the secrets in the lunar dust.",
        coverImage: '/images/covers/moon_landing.png',
        period: '1969',
        location: 'Moon',
        totalActs: 40,
        acts: story1Acts,
    },
    {
        id: 'story-2',
        title: "The Alchemist's Apprentice",
        description: "Florence, 1348. You wake up as a lowly apprentice. Survive the Black Death, outsmart your arrogant master, and rise to power.",
        coverImage: '/images/covers/alchemist.png',
        period: 'Middle Ages',
        location: 'Florence',
        totalActs: 40,
        acts: story2Acts,
    },
    {
        id: 'story-3',
        title: "The Student of Archimedes",
        description: "Syracuse, 212 BC. As a young scholar from Alexandria, you study under the legendary Archimedes. Defend the city from Rome using physics and geometry—and preserve his legacy for the ages.",
        coverImage: '/images/covers/archimedes.png',
        period: 'Antiquity',
        location: 'Syracuse',
        totalActs: 40,
        acts: story3Acts,
    },
];

export const getStory = (id: string) => stories.find(s => s.id === id);
