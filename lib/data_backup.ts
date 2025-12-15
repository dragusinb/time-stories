import { Story, Act, Minigame } from '@/types';

const alchemistActs: Act[] = [];

// Helper to create acts
const createAct = (i: number, title: string, content: string, minigame?: Minigame, backgroundImage?: string): Act => ({
    id: `act-story-1-${i}`,
    storyId: 'story-1',
    actNumber: i,
    title,
    content,
    isLocked: i > 15,
    price: i > 15 ? 20 : 0,
    minigame,
    backgroundImage,
});

// ACT 1-5: The Awakening & The First Slap
alchemistActs.push(
    createAct(1, "Waking Up in Filth", "Pain. That's the first thing you feel. You open your eyes, expecting your sterile lab in 2050. Instead, you're lying on a straw mat in a damp, stone room. The smell of rot and sulfur is overwhelming. You look at your hands—they are calloused, dirty, and smaller. You catch your reflection in a bucket of water. You are a boy, no older than 16. A flood of memories that aren't yours hits you: You are 'Luca', the lowest apprentice to Master Ghiberti, the most arrogant physician in Florence. The year is 1348. The Black Death is knocking at the gates. And you... you have nothing. No stabilizer. No med-kit. Just your mind.", undefined, "/images/act-1.png"),
    createAct(2, "The Quack's Decree", "Master Ghiberti kicks you awake. 'Get up, you lazy rat! The Contessa de Medici has summoned us. Carry my bags!' He throws a heavy leather satchel at you. As you walk through the terrified city, Ghiberti lectures you on his 'treatments'—leeches, mercury, and prayer. You know these will kill the patients faster than the plague. You clench your fists. You are a Chief Virologist. Carrying bags for a murderer.", undefined, "/images/act-2.png"),
    createAct(3, "The Contessa's Chamber", "The Medici palace is somber. The Contessa Isabella lies in bed, burning with fever. Ghiberti puffs out his chest. 'It is an imbalance of humors! We must bleed her!' The Contessa's eyes are wide with fear. She looks at you, the quiet apprentice in the corner. You see the signs: it's not the plague yet. It's acute food poisoning from the feast last night. Bleeding her will stop her heart. You must speak up.", undefined, "/images/act-3.png"),
    createAct(4, "The Diagnosis", "You step forward, interrupting Ghiberti. 'Silence, boy!' he roars. But you ignore him. You look at the Contessa. 'My Lady, did you eat the shellfish at the banquet?' She nods weakly. Ghiberti laughs. 'Shellfish? Absurd! It is the alignment of Mars!' You need to prepare the correct remedy immediately.", {
        id: 'mg-story-1-4',
        type: 'mixing',
        question: "Prepare a rehydration solution to treat the Contessa's acute food poisoning.",
        instructions: "Add Water and Salt to the cauldron, then Ignite the fire to Boil it.",
        winningCondition: "Combine: Water + Salt + Boil",
        ingredients: ["Water", "Salt", "Mercury", "Leeches", "Boil", "Prayer"],
        correctCombination: ["Water", "Salt"]
    }, "/images/act-4.png"),
    createAct(5, "The First Slap", "You mix a simple saline solution with boiled water. Ghiberti tries to stop you, but the Contessa's guard holds him back. 'Let the boy try,' the Captain says. You feed her the solution spoon by spoon. Hours pass. The fever breaks. She sleeps peacefully. Ghiberti turns purple with rage. 'Luck! Witchcraft!' he sputters. You look him in the eye. 'No, Master. It is science.' The Contessa wakes and smiles at you. 'Thank you, Luca.' You have survived day one. But you have made a powerful enemy.", undefined, "/images/act-5.png")
);

// ACT 6-10: Rising from the Mud
alchemistActs.push(
    createAct(6, "The Rumor", "News spreads. The 'Apprentice' saved the Contessa when the Master could not. The servants whisper. Ghiberti assigns you to the stables, trying to hide you. But you use the time to gather resources. You find moldy bread (Penicillin source? No, too risky yet) and clean water sources. You start building a mental map of the infection vectors.", {
        id: 'mg-story-1-6',
        type: 'quiz',
        question: "You found moldy bread, a potential source of Penicillin. Why is it too dangerous to use on patients right now?",
        instructions: "Recall your knowledge of antibiotics and their risks.",
        options: [
            "It contains toxic molds alongside Penicillin",
            "It attracts plague rats",
            "The Church forbids using bread for medicine",
            "It causes immediate blindness"
        ],
        correctOption: 0
    }, "/images/act-6.png")
);

// ACT 6-10 (Continued)
alchemistActs.push(
    createAct(7, "The Library", "You sneak into the Medici library at night. You need knowledge. You find Galen's texts, but they are wrong. You need to write your own.", undefined, "/images/act-7.png"),
    createAct(8, "The Rival", "Ghiberti's senior apprentice, Marco, suspects you. He corners you in the alley. 'You are using dark magic,' he sneers. You show him your clean hands. 'No, Marco. Just soap.'", undefined, "/images/act-8.png"),
    createAct(9, "The Betrayal", "You cure a wealthy merchant. Ghiberti takes the credit and the gold. He gives you a single copper coin. 'For your trouble, boy.' You say nothing. You are playing the long game.", undefined, "/images/act-9.png"),
    createAct(10, "The Promotion", "The Guild notices your work. Despite Ghiberti's lies, they grant you the rank of Journeyman. You can now treat patients on your own.", undefined, "/images/act-10.png")
);

// ACT 11-20: The Discovery
alchemistActs.push(
    createAct(11, "The First Patient", "A servant collapses. The buboes are black. You isolate him immediately, despite Ghiberti's protests.", undefined, "/images/act-11.png"),
    createAct(12, "The Spread", "It is moving faster than you remember from history books. The heat is accelerating the flea breeding cycle.", undefined, "/images/act-12.png"),
    createAct(13, "The Mask", "You design a mask with a long beak to hold herbs. It looks terrifying, but it filters the air. The 'Plague Doctor' is born.", undefined, "/images/act-13.png"),
    createAct(14, "The Herbs", "You stuff the beak with mint, rose petals, and camphor. It won't stop the bacteria, but it helps with the smell of death.", undefined, "/images/act-14.png"),
    createAct(15, "The Vector", "You notice the rats dying before the people. It's the fleas. You need a proof.", undefined, "/images/act-15.png"),
    createAct(16, "The Microscope", "You grind a lens from a piece of broken glass. It's crude, but it might be enough to see the enemy.", {
        id: 'mg-story-1-16',
        type: 'microscope',
        question: "Adjust the focus to identify the pathogen.",
        targetName: "Yersinia pestis",
        instructions: "Use the coarse and fine knobs to focus the image."
    }, "/images/act-16.png"),
    createAct(17, "The Observation", "You see them. Rod-shaped bacteria. Yersinia pestis. You are the first human in 1348 to see the face of death.", undefined, "/images/act-17.png"),
    createAct(18, "The Quarantine", "You rush to the Council. 'We must close the gates! Isolate the sick!' They ask how long.", {
        id: 'mg-story-1-18',
        type: 'timeline',
        question: "Set the quarantine duration. (Hint: The word comes from the Italian 'Quaranta')",
        instructions: "Drag the slider to the correct number of days.",
        minVal: 10,
        maxVal: 60,
        correctVal: 40,
        unit: "days"
    }, "/images/act-18.png"),
    createAct(19, "The Synthesis", "You need to distill a purer alcohol for disinfection. You assemble your glassware.", {
        id: 'mg-story-1-19',
        type: 'sequence',
        question: "Assemble the distillation apparatus in the correct order.",
        instructions: "Click items to add them to the assembly.",
        items: ["Burner", "Flask", "Condenser", "Receiver"],
        correctOrder: ["Burner", "Flask", "Condenser", "Receiver"]
    }, "/images/act-19.png"),
    createAct(20, "Chemical Safety", "You are working with dangerous acids. One slip could blind you. You must remember the safety symbols.", {
        id: 'mg-story-1-20',
        type: 'memory',
        question: "Match the safety symbol to its meaning.",
        options: ["Flammable", "Fire", "Toxic", "Skull", "Corrosive", "Hand", "Biohazard", "Circle"]
    }, "/images/act-20.png")
);

// ACT 21-50: The Great Plague & The Legacy
// ACT 21-25: The Peak of the Wave
alchemistActs.push(
    createAct(21, "The Surge", "The death toll hits its peak. The carts are full. You are working 20 hours a day, triaging patients. The smell of death is everywhere.", undefined, "/images/act-21.png"),
    createAct(22, "The Collapse", "The hospitals are overwhelmed. You have to turn people away. It breaks your heart, but you must focus on those who can be saved.", undefined, "/images/act-22.png"),
    createAct(23, "The Sleepless Night", "You haven't slept in three days. Your hands shake as you mix medicines. You drink strong coffee (an anachronism you introduced) to keep going.", undefined, "/images/act-23.png"),
    createAct(24, "The Despair", "Even the priests are dying. The people are losing hope. You stand in the piazza and give a speech about hygiene and hope. They listen.", undefined, "/images/act-24.png"),
    createAct(25, "The Hard Choice", "You have one dose of experimental medicine left. A wealthy merchant offers you gold for it. A young baker needs it to survive. You must choose.", {
        id: 'mg-story-1-25',
        type: 'quiz',
        question: "Triage Decision: You have one dose of experimental medicine. Who gets it?",
        options: ["The Wealthy Merchant (Funds the hospital)", "The Young Baker (Feeds the poor)", "The Old Priest (Comforts the dying)", "Yourself (To keep working)"],
        correctOption: 1
    }, "/images/act-25.png")
);

// ACT 26-30: The Shortage
alchemistActs.push(
    createAct(26, "Running Dry", "Supplies are running low. The alcohol for disinfectant is gone. You need to find alternatives quickly.", undefined, "/images/act-26.png"),
    createAct(27, "The Fungi", "You remember that certain fungi can produce antibiotics. You search the damp cellars for specific molds. It's a long shot.", undefined, "/images/act-27.png"),
    createAct(28, "The Experiment", "You try to extract the mold essence. It's crude, but it might work on infected wounds. You test it on a rat.", undefined, "/images/act-28.png"),
    createAct(29, "The Result", "The rat survives! You have a primitive antibiotic. It's not perfect, but it's better than nothing. You start production.", undefined, "/images/act-29.png"),
    createAct(30, "Sanitation Protocol", "You enforce strict isolation and boiling of all water. The people resist, but you show them the clear water vs the muddy well water.", {
        id: 'mg-story-1-30',
        type: 'memory',
        question: "Match the Sanitation Protocol to the Disease it Prevents.",
        options: ["Boil Water", "Cholera", "Kill Rats", "Plague", "Wash Hands", "Flu", "Cook Meat", "E. Coli"]
    }, "/images/act-30.png")
);

// ACT 31-35: The Revolt
alchemistActs.push(
    createAct(31, "The Accusation", "A radical religious sect claims you are a demon because you don't get sick. They gather outside the palace.", undefined, "/images/act-2.png"),
    createAct(32, "The Mob", "They march on the gates, torches in hand. 'Burn the Witch Doctor!' they chant. You need a distraction.", undefined, "/images/act-7.png"),
    createAct(33, "Chemistry Magic", "You mix magnesium powder and sulfur. You need a flash to scare them, not a bomb to kill them.", undefined, "/images/act-6.png"),
    createAct(34, "The Flash", "You throw the powder into a brazier. A blinding white light erupts. The mob falls back, terrified of your 'divine' power.", undefined, "/images/act-3.png"),
    createAct(35, "The Formula", "The Contessa asks how you did it. You write down the chemical formula, disguising it as an alchemical symbol to protect the secret.", {
        id: 'mg-story-1-35',
        type: 'cipher',
        question: "Decode the formula for the Flash Powder (Magnesium).",
        encrypted: "NBHOFTJVN", // MAGNESIUM
        decrypted: "MAGNESIUM"
    }, "/images/act-3.png")
);

// ACT 36-40: The Turning Point
alchemistActs.push(
    createAct(36, "The Decline", "The numbers are dropping. Your quarantine worked. The West District is clear. The city breathes a sigh of relief.", undefined, "/images/act-2.png"),
    createAct(37, "The Council", "The City Council looks at you with awe. You are not just a physician anymore; you are the Savior of Florence.", undefined, "/images/act-3.png"),
    createAct(38, "The Feast", "A feast is held in your honor. You are careful to ensure the food is safe. You sit at the Contessa's right hand.", undefined, "/images/act-3.png"),
    createAct(39, "The Trade", "Merchants want to reopen the gates. You hesitate. Is it too soon? You review the data one last time.", undefined, "/images/act-7.png"),
    createAct(40, "The Decision", "The Council wants to reopen the trade routes immediately. What is the risk?", {
        id: 'mg-story-1-40',
        type: 'quiz',
        question: "The Council wants to reopen the trade routes immediately. What is the risk?",
        options: ["Economic collapse", "Second Wave of Infection", "Angering the Pope", "Running out of wine"],
        correctOption: 1
    }, "/images/act-3.png")
);

// ACT 41-45: The Reconstruction
alchemistActs.push(
    createAct(41, "Rebuilding", "The plague has passed, but the city is broken. You start designing a new sanitation system—sewers, clean water.", undefined, "/images/act-2.png"),
    createAct(42, "The Aqueduct", "You map out a new aqueduct system to bring fresh water from the mountains, bypassing the polluted river.", undefined, "/images/act-2.png"),
    createAct(43, "The Hospital", "You design a new hospital with separate wards for different diseases. A revolutionary concept for 1348.", undefined, "/images/act-4.png"),
    createAct(44, "The School", "You start a school to teach the next generation about hygiene and biology. Knowledge is the best defense.", undefined, "/images/act-3.png"),
    createAct(45, "Infrastructure", "You need to prioritize the building projects. What comes first?", {
        id: 'mg-story-1-45',
        type: 'memory',
        question: "Match the Infrastructure to its Benefit.",
        options: ["Sewers", "Waste Removal", "Aqueducts", "Clean Water", "Hospitals", "Isolation", "Schools", "Education"]
    }, "/images/act-2.png")
);

// ACT 46-50: The Legacy
alchemistActs.push(
    createAct(46, "Years Later", "Years have passed. Florence is cleaner, healthier, more advanced than it should be. You have changed history.", undefined, "/images/act-5.png"),
    createAct(47, "The Reflection", "You look in the mirror. You are older now. You never found a way home to 2050. But maybe this is your home now.", undefined, "/images/act-5.png"),
    createAct(48, "The Discovery", "You find your old time-stabilizer in the ruins of Ghiberti's lab. It's blinking. It has enough power for one jump.", undefined, "/images/act-6.png"),
    createAct(49, "The Rift", "A portal opens. You can see the sterile white lab of 2050. Your colleagues are there, frozen in time.", undefined, "/images/act-1.png"),
    createAct(50, "The Final Choice", "You stand between two worlds. The future you came from, or the future you built.", {
        id: 'mg-story-1-50',
        type: 'quiz',
        question: "Final Choice: A time rift opens. You can go home to 2050, or stay and guide the Renaissance. What do you do?",
        options: ["Go Home (The timeline corrects itself)", "Stay (Lead humanity to a new Golden Age)", "Send a message to the future", "Destroy the rift"],
        correctOption: 1
    }, "/images/act-5.png")
);

export const stories: Story[] = [
    {
        id: 'story-1',
        title: "The Alchemist's Apprentice",
        description: "Florence, 1348. You wake up as a lowly apprentice with no tools, only your modern mind. Survive the Black Death, outsmart your arrogant master, and rise to power in the Medici court.",
        coverImage: '/images/alchemist-cover.jpg',
        period: 'Middle Ages',
        location: 'Europe',
        totalActs: 50,
        acts: alchemistActs,
    },
];

export const getStory = (id: string) => stories.find(s => s.id === id);
