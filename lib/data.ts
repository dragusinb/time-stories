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
    createAct(s1, 1, "The Shoulders of Giants", "July 16, 1969. Cape Kennedy. You stand on the gantry beside Neil, the humidity clinging to your flight suit. The Saturn V groans beneath you. 'You ready, kid?' Neil asks. You're the backup specialist, trained for the anomalies.", undefined, "/images/apollo/act-1.png"),
    createAct(s1, 2, "Ignition", "The vibration rattles your teeth as the five F-1 engines ignite. 7.5 million pounds of thrust. The window fills with fire. You are leaving humanity behind, riding a pillar of fire into the void.", undefined, "/images/apollo/act-2.png"),
    createAct(s1, 3, "Orbit Insertion", "Silence. Zero G. The engines cut off. But Houston needs a systems check before the TLI burn. The fuel mixture indicators are fluctuating.", {
        id: 'mg-story-1-3',
        type: 'silo',
        question: "Verify Oxygen Mixture",
        instructions: "Adjust the regulator to the optimal percentage (95%).",
        winningCondition: "Stable Atmosphere Achieved"
    }, "/images/apollo/act-3.png"),
    createAct(s1, 4, "Translunar Injection", "You leave Earth's orbit. The onboard computer is drifting. You grab the sextant to manually realign the Inertial Measurement Unit.", {
        id: 'mg-story-1-4',
        type: 'constellation',
        question: "Align Navigation Star",
        instructions: "Trace the constellation path to calibrate the guidance computer.",
        winningCondition: "Guidance Calibrated"
    }, "/images/apollo/act-4.png"),
    createAct(s1, 5, "Passive Thermal Control", "The ship begins the 'Barbecue Roll' to distribute the sun's heat. Earth is now just a distant marble. You feel the profound scale of the universe.", undefined, "/images/apollo/act-5.png"),
    createAct(s1, 6, "Lunar Orbit Insertion", "You enter the shadow of the moon. Radio silence. You must execute the braking burn perfectly to be captured by the moon's gravity.", undefined, "/images/apollo/act-6.png"),
    createAct(s1, 7, "Undocking", "You join Neil and Buzz in the Lunar Module 'Eagle'. The separation is smooth, but the alarms blare. '1202 Alarm'. The computer is overloaded.", {
        id: 'mg-story-1-7',
        type: 'cipher',
        question: "Decode the 1202 Alarm",
        instructions: "Enter the override code: EXECUTIVE OVERFLOW",
        winningCondition: "Buffer Cleared",
        encrypted: "EXE-OVER-FLOW",
        decrypted: "EXECUTIVE OVERFLOW"
    }, "/images/apollo/act-7.png"),
    createAct(s1, 8, "The Descent", "The computer is clear, but fuel is low. Neil takes manual control. You verify the landing radar readings against the visual landmarks.", {
        id: 'mg-story-1-8',
        type: 'silo',
        question: "Fuel Level Critical",
        instructions: "Monitor the fuel tank pressure. Keep it steady.",
        winningCondition: "Touchdown Achieved"
    }, "/images/apollo/act-8.png"),
    createAct(s1, 9, "Touchdown", "Contact light. Engine stop. 'The Eagle has landed.' The dust settles. You check the systems. Everything is green. We are on the Moon.", undefined, "/images/apollo/act-9.png"),
    createAct(s1, 10, "Go/No-Go", "Mission Control gives the 'Stay' decision. You prepare the PLSS backpacks. It's time to go outside.", undefined, "/images/apollo/act-10.png")
);

// --- PHASE 2: SURFACE OPERATIONS (Acts 11-20) ---
story1Acts.push(
    createAct(s1, 11, "One Small Step", "You stand on the porch. The ladder is just a few rungs, but it spans a billion years of evolution. You drop the last three feet. The dust puffs silently. The world watches, but you are alone. 'That's one small step for man...'", undefined, "/images/apollo/act-11.png"),
    createAct(s1, 12, "Contingency Sample", "First rule: get a sample. If the engine explodes now, at least we bring something home. You scoop the regolith blindly. It's like wet sand, yet dry as bone. The bag seals with a satisfying snap.", {
        id: 'mg-story-1-12',
        type: 'centrifuge',
        question: "Analyze the Regolith Sample.",
        instructions: "Hold SPIN to separate isotopes. Keep RPM in the green zone.",
        winningCondition: "Sample Isolated"
    }, "/images/apollo/act-12.png"),
    createAct(s1, 13, "Magnificent Desolation", "Aldrin joins you. You look out at the horizon. It's too close. The curvature is wrong. The colors are absolute—black sky, white ground. 'Magnificent desolation,' Buzz says. It is beautiful because it is dead.", undefined, "/images/apollo/act-13.png"),
    createAct(s1, 14, "Mobility", "Walking is impossible. You learn to skip, to hop like a kangaroo in slow motion. The 1/6th gravity is a seductive mistress; she lets you fly, but momentum is still a cruel master. You stumble, heart racing. A tear in the suit means death.", undefined, "/images/apollo/act-14.png"),
    createAct(s1, 15, "The Flag", "The kit is annoying. The telescoping rod jams. You hammer it in, but the soil is hard, resisting like frozen rubber. The flag hangs from its wire support, stiff and eternal in the vacuum. It does not wave; it poses.", undefined, "/images/apollo/act-15.png"),
    createAct(s1, 16, "The Call", "Nixon is on the line. The signal travels 240,000 miles, digitized and reassembled. His voice sounds ghostly. You stand at attention, saluting a voice from the sky. The irony is not lost on you.", undefined, "/images/apollo/act-16.png"),
    createAct(s1, 17, "EASEP Deployment", "The scientific package is heavy. You lug the pallets out to a flat spot. The passive seismometer and the laser reflector. They look like foil toys, but they are the reason you are here. Science, not just flags.", undefined, "/images/apollo/act-17.png"),
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
    createAct(s1, 20, "Laser Ranging", "The Retro-Reflector (LRRR). A grid of 100 prisms. You aim it towards Earth, invisible in the sky. If you get this right, astronomers will shoot lasers at it for decades, measuring the moon's distance to the millimeter.", {
        id: 'mg-story-1-20',
        type: 'lens',
        question: "Align the Retro-Reflector Array.",
        instructions: "Clean the dust off the prism faces. Align the optical axis with the Earth vector.",
        winningCondition: "Signal Path Clear"
    }, "/images/apollo/act-20.png")
);

// --- PHASE 3: CLOSEOUT & ASCENT (Acts 21-30) ---
story1Acts.push(
    createAct(s1, 21, "The Core", "The timeline is tight. You hammer two core tubes into the ground. The soil fights back. It grasps the metal like a vice. You are gasping for air, sweat stinging your eyes. Just one more inch. For science.", undefined, "/images/apollo/act-21.png"),
    createAct(s1, 22, "Solar Wind", "Time to pack up. You retrieve the Solar Wind Composition foil. It has been soaking up the sun's breath for an hour. Helium, Neon, Argon. The building blocks of stars, trapped in a sheet of aluminum.", undefined, "/images/apollo/act-22.png"),
    createAct(s1, 23, "Contamination", "You hoist the rock boxes up the conveyor. Dust is everywhere. It is in the treads, on the suits, in the cabin. It smells like gunpowder. It is the smell of a dead world.", undefined, "/images/apollo/act-23.png"),
    createAct(s1, 24, "Weight Limits", "Computer says we are heavy. The ascent engine has no margin for error. We must jettison the non-essentials. The view is priceless; the boots are expendable. You toss them out the hatch.", {
        id: 'mg-story-1-24',
        type: 'triage',
        theme: 'apollo',
        question: "Select Items for Jettison.",
        instructions: "Keep the Moon Rocks. Jettison the PLSS and Overshoes.",
        winningCondition: "Ascent Weight Cleared"
    }, "/images/apollo/act-24.png"),
    createAct(s1, 25, "The Broken Switch", "Panic in the silence. As you crawled back in, a backpack struck a circuit breaker. It snapped off. The 'Engine Arm' switch. Without it, you are stranded forever. A tomb of aluminum.", undefined, "/images/apollo/act-25.png"),
    createAct(s1, 26, "The Pen Solution", "Aldrin finds a solution. A felt-tipped pen fits perfectly into the hole. It works. The engine is armed. It is a moment of pure, ridiculous human ingenuity.", undefined, "/images/apollo/act-26.png"),
    createAct(s1, 27, "Rest Period", "Mission Control orders you to sleep. It's cold, noisy, and light leaks in. You sleep fitfully on the engine cover, dreaming of blue skies and gravity.", undefined, "/images/apollo/act-27.png"),
    createAct(s1, 28, "Ascent Ignition", "T-minus zero. The ascent engine fires. You climb vertically on a pillar of flame, leaving the descent stage—and the flag—behind. The acceleration pushes you into your seat.", {
        id: 'mg-story-1-28',
        type: 'silo',
        question: "Monitor Ascent Thrust.",
        instructions: "Keep the thrust vector centered to reach orbit.",
        winningCondition: "Orbit achieved."
    }, "/images/apollo/act-28.png"),
    createAct(s1, 29, "Orbit Insertion", "The engine cuts off. You are in lunar orbit. The silence returns. Now begins the needle-in-a-haystack search for Columbia.", undefined, "/images/apollo/act-29.png"),
    createAct(s1, 30, "The Rendezvous", "You see a bright star. It's Mike Collins in Columbia. You use the radar to close the distance. Two tiny metal cans meeting in the dark.", undefined, "/images/apollo/act-30.png")
);

// --- PHASE 4: RETURN (Acts 31-40) ---
story1Acts.push(
    createAct(s1, 31, "Docking", "The two ships align. There's a thud, then the latches snap shut. You open the hatch. Collins is there, grinning. The smell of moon dust fills the Columbia.", {
        id: 'mg-story-1-31',
        type: 'constellation',
        theme: 'apollo',
        question: "Align Docking Ports.",
        instructions: "Match the rotation of the Eagle to Columbia.",
        winningCondition: "Hard dock confirmed."
    }, "/images/apollo/act-31.png"),
    createAct(s1, 32, "Jettison Eagle", "You transfer all the cargo to Columbia. You jettison the faithful lander. It drifts away, a golden spider against the black. Goodbye, old friend.", undefined, "/images/apollo/act-32.png"),
    createAct(s1, 33, "TEI Burn", "Trans-Earth Injection. The big engine fires on the far side of the moon. This is the push home. If it fails, you die here. It burns true.", undefined, "/images/apollo/act-33.png"),
    createAct(s1, 34, "Earthrise", "You come around the moon one last time. You see Earth rising, a blue marble in the void. It looks fragile. You realize you haven't just explored the moon; you've discovered the Earth.", undefined, "/images/apollo/act-34.png"),
    createAct(s1, 35, "Coasting", "The trip back is quiet. You shave. You stow the gear. The spacecraft is spinning slowly in the BBQ roll. You are three men in a can, falling towards home.", undefined, "/images/apollo/act-35.png"),
    createAct(s1, 36, "Re-entry Prep", "You approach Earth. Speed: 25,000 mph. You jettison the Service Module. The Command Module turns its heat shield towards the atmosphere.", {
        id: 'mg-story-1-36',
        type: 'cipher',
        theme: 'apollo',
        question: "Verify Re-entry Checklist.",
        instructions: "Confirm Heat Shield, Parachutes, and Attitude inputs.",
        winningCondition: "All systems GO.",
        encrypted: "HEAT-PARA-ATT",
        decrypted: "HEAT SHIELD GREEN"
    }, "/images/apollo/act-36.png"),
    createAct(s1, 37, "Blackout", "You hit the atmosphere. Fire surrounds the windows. Ionized plasma blocks all radio signals. You are alone in the fireball. Gravity returns, crushing you into your couch.", undefined, "/images/apollo/act-37.png"),
    createAct(s1, 38, "Drogues Deployed", "The radio crackles. 'We hear you!' The drogue chutes pop out, jerking the capsule violent. The spin stops. You are falling through the clouds.", undefined, "/images/apollo/act-38.png"),
    createAct(s1, 39, "Splashdown", "The three main chutes open. Orange flowers in the blue sky. You hit the water with a massive jolt. The capsule flips over, then rights itself. You are home.", undefined, "/images/apollo/act-39.png"),
    createAct(s1, 40, "Hornet + 3", "Divers attach the collar. You are hoisted into the helicopter. You land on the USS Hornet. The President is there. But all you want is the sweet taste of Earth air.", undefined, "/images/apollo/act-40.png")
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
    createAct(s2, 28, "The Culture", "You grow the mold on broths. It smells earthy. You test it on a sick dog the Captain brought you. The dog recovers. You have an antibiotic.", {
        id: 'mg-story-2-28',
        type: 'quiz',
        question: "Identify the correct Penicillium mold culture.",
        instructions: "Select the mold that inhibits bacterial growth.",
        options: [
            "Green/Blue mold with a white edge",
            "Black furry mold",
            "Yellow slime mold",
            "Red spotted mold"
        ],
        correctOption: 0
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
    createAct(s3, 1, "Syracuse", "You step out of the portal into the blinding Mediterranean sun. The year is 212 BC. Syracuse. A city under siege. The smell of salt and anxiety hangs in the air.", undefined, "/images/archimedes/act-1.png"),
    createAct(s3, 2, "The Old Man", "You find him drawing circles in the sand near the harbor. Archimedes. The greatest mind of antiquity. He doesn't even look up as you approach. 'Do not disturb my circles,' he mutters.", {
        id: 'mg-story-3-2',
        type: 'circle',
        question: "Draw a Perfect Circle",
        instructions: "Trace a perfect circle in the sand with your finger or mouse. Aim for >80% accuracy.",
        winningCondition: "Roundness > 80%"
    }, "/images/archimedes/act-2.png"),
    createAct(s3, 3, "The Roman Fleet", "Ships approach the harbor. General Marcellus leads the Roman fleet. 'They are coming,' you say. Archimedes smiles, wiping the sand from his hands. 'Let them come. I have a surprise.'", undefined, "/images/archimedes/act-3.png"),
    createAct(s3, 4, "The Iron Hand", "He points to a massive crane on the wall. 'The Claw,' he whispers. 'It will lift their ships like toys. But it needs a precise operator.' He looks at you.", {
        id: 'mg-story-3-4',
        type: 'defense',
        question: "Defend the Harbor",
        instructions: "Tap the Roman ships to deploy the Iron Hand and smash them!",
        winningCondition: "Sink 5 Ships"
    }, "/images/archimedes/act-4.png"),
    createAct(s3, 5, "The Capsize", "The claw descends, hooking the Roman galley. With a groan of timber, the ship is lifted out of the water. Men scream. The ship flips. The Romans retreat in terror.", undefined, "/images/archimedes/act-5.png"),
    createAct(s3, 6, "The Panic", "The Roman fleet retreats in confusion. They think the gods are fighting against them. Archimedes chuckles. 'Physics, my friend. Just physics.'", undefined, "/images/archimedes/act-6.png"),
    createAct(s3, 7, "The Workshop", "He takes you to his workshop. It's a chaotic mess of scrolls, models, and bronze gears. 'You are not from here,' he states. It's not a question.", undefined, "/images/archimedes/act-7.png"),
    createAct(s3, 8, "The Lever", "'Give me a place to stand, and I will move the earth.' He demonstrates the law of the lever. You realize he understands the fundamental laws of the universe better than most modern engineers.", undefined, "/images/archimedes/act-8.png"),
    createAct(s3, 9, "The King's Problem", "King Hiero II summons Archimedes. He suspects his new crown is not pure gold. 'Solve this without melting it,' the King commands. Archimedes looks troubled.", undefined, "/images/archimedes/act-9.png"),
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
    createAct(s3, 12, "Density", "He explains the principle breathlessly. 'Density is mass divided by volume.' Gold is dense. Silver is light. A mixed crown will betray itself by its volume. It is elegant. It is irrefutable.", undefined, "/images/archimedes/act-12.png"),
    createAct(s3, 13, "The Test", "You set up the experiment in the palace. The King watches, his face unreadable. The goldsmith sweats. You lower the crown into the water. The level rises too high.", undefined, "/images/archimedes/act-13.png"),
    createAct(s3, 14, "The Result", "The King nods. 'Fake.' The goldsmith is dragged away to a fate you do not wish to witness. Archimedes has proven the power of the mind over matter.", undefined, "/images/archimedes/act-14.png"),
    createAct(s3, 15, "The Blockade", "The Romans return, stinging from their defeat. This time, they blockade the harbor. They will not fight; they will starve you out. The city walls become a prison.", undefined, "/images/archimedes/act-15.png"),
    createAct(s3, 16, "The Balance", "Archimedes designs a new defense. Underwater mines. 'We must balance them,' he says. 'Neutral buoyancy. They must float, but not be seen.' He tasks you with the calibration.", {
        id: 'mg-story-3-16',
        type: 'scale',
        theme: 'ancient',
        question: "Balance the buoyancy mechanism.",
        instructions: "Add weights to the left side to balance the Mine.",
        winningCondition: "Balance the scale"
    }, "/images/archimedes/act-16.png"),
    createAct(s3, 17, "The Sabotage", "Nightfall. You swim out to the Roman pontoon bridges. The water is cold and black. You attach the mines. The explosion shatters the silence. Wood splinters. Romans drown in their armor.", undefined, "/images/archimedes/act-17.png"),
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
    createAct(s3, 21, "The Mirror Plan", "He wants to build a hexagonal array of polished bronze shields. A 'burning glass'. It sounds impossible. 'Geometry,' he says, tapping his temple. 'All rays must meet at the focus.'", undefined, "/images/archimedes/act-21.png"),
    createAct(s3, 22, "Polishing", "You mobilize the soldiers. 'Put down your swords,' you order. 'Polish your shields.' They grumble, but they obey. You need a surface like water.", undefined, "/images/archimedes/act-22.png"),
    createAct(s3, 23, "The Geometry", "Parabolic focus. You help him calculate the curvature. If the angle is off by a degree, the light scatters. It must be perfect.", undefined, "/images/archimedes/act-23.png"),
    createAct(s3, 24, "The Attack", "The Roman fleet approaches at noon. The sun is at its zenith. Archimedes stands on the wall, a conductor of light. 'Hold...' he commands.", undefined, "/images/archimedes/act-24.png"),
    createAct(s3, 25, "The Death Ray", "You align the mirrors. A beam of pure white light cuts through the air. It hits the lead ship's sail. Smoke. Then, distinct flame. The Romans scream as their ships turn into pyres.", {
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
    createAct(s3, 28, "The Screw", "You construct the device. A massive wooden spiral inside a tube. You turn the crank. Water defies gravity, climbing the spiral. The 'Archimedes Screw'. Simple. Genius.", {
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

// ACT 36-50: The Legacy & Extraction
story3Acts.push(
    createAct(s3, 36, "Do Not Disturb", "Archimedes looks up, annoyed. 'Do not disturb my circles!' he barks. The soldier raises his sword. You have a split second to change history.", undefined, "/images/archimedes/act-36.png"),
    createAct(s3, 37, "The Intervention", "You tackle the soldier. The sword clatters. 'Run!' you scream. Archimedes grabs his scrolls. He is confused, but he runs.", undefined, "/images/archimedes/act-37.png"),
    createAct(s3, 38, "The Rooftops", "You flee across the rooftops. The city is burning. The Great Library of the West is falling. You must save the mind, if not the body.", undefined, "/images/archimedes/act-38.png"),
    createAct(s3, 39, "The Harbor", "The harbor is blocked. You find a small fishing boat. The Roman fleet is distracted by the looting. Just one chance.", undefined, "/images/archimedes/act-39.png"),
    createAct(s3, 40, "The Encryption", "You need to lock the scroll case. If the Romans find it, they destroy it. You set a cipher only a scholar would know.", {
        id: 'mg-story-3-40',
        type: 'cipher',
        theme: 'ancient',
        question: "Set the Cylinder Seal Combination.",
        instructions: "Decode the sequence: Alpha, Delta, Pi, Omega.",
        winningCondition: "Lock Secured",
        encrypted: "ADPO",
        decrypted: "ADPO"
    }, "/images/archimedes/act-40.png"),
    createAct(s3, 41, "The Escape", "You row out into the dark. Syracuse burns. Archimedes watches his home die. A single tear tracks through the dust on his face.", undefined, "/images/archimedes/act-41.png"),
    createAct(s3, 42, "Alexandria", "Weeks later. Alexandria. The Great Library. Eratosthenes meets you at the docks. He embraces Archimedes like a brother returned from the dead.", undefined, "/images/archimedes/act-42.png"),
    createAct(s3, 43, "The Deposit", "Archimedes unravels his scrolls. Calculus. Hydrostatics. Physics. He begins to teach. The timeline ripples.", undefined, "/images/archimedes/act-43.png"),
    createAct(s3, 44, "The Acceleration", "With Archimedes alive, the Industrial Revolution begins in 200 BC. Steam engines power ships. The Romans reach the moon in 400 AD.", undefined, "/images/archimedes/act-44.png"),
    createAct(s3, 45, "The Paradox", "The simulation shudders. The sky turns static. 'Paradox Detected,' the system warns. You pushed it too far.", undefined, "/images/archimedes/act-45.png"),
    createAct(s3, 46, "The Steam Engine", "You watch a steam locomotive chug past the Parthenon. It is beautiful, but it is wrong. The code is unraveling.", undefined, "/images/archimedes/act-46.png"),
    createAct(s3, 47, "Stabilization", "You must stabilize the timeline. You convince Archimedes to hide his most advanced work in the Secret Archives. 'For a future age,' you say.", undefined, "/images/archimedes/act-47.png"),
    createAct(s3, 48, "The Farewell", "He looks at you. He knows. 'You are the traveler,' he says. 'Thank you for the extra time.' He shakes your hand. A connection across millennia.", undefined, "/images/archimedes/act-48.png"),
    createAct(s3, 49, "Extraction", "The white light returns. Mission Complete. Entity Saved. Timeline: Divergent but Stable.", undefined, "/images/archimedes/act-49.png"),
    createAct(s3, 50, "Debrief", "Subject: Agent. Performance: Legendary. You saved the mind that moved the world. Welcome home.", undefined, "/images/archimedes/act-50.png")
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
        title: "Archimedes' Sidekick",
        description: "Syracuse, 212 BC. Join the legendary mathematician Archimedes. Defend the city from the Romans using the power of physics and geometry.",
        coverImage: '/images/covers/archimedes.png',
        period: 'Antiquity',
        location: 'Syracuse',
        totalActs: 50,
        acts: story3Acts,
    },
];

export const getStory = (id: string) => stories.find(s => s.id === id);
