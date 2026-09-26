export interface MemoryStep {
  step: number;
  title: string;
  action: string;
}

export interface MemoryCommand {
  id: string;
  name: string;
  slash: string;
  aliases: string[];
  category: "Memory Mastery" | "Structure" | "Testing" | "Analogy";
  iconName: string;
  badge: string;
  shortDesc: string;
  fullDesc: string;
  whenToUse: string;
  cognitiveScience: string;
  steps: MemoryStep[];
  proTip: string;
  promptInstruction: string;
  exampleInput: string;
  exampleOutputSnippet: string;
}

export const MEMORY_COMMANDS: MemoryCommand[] = [
  // ==========================================
  // 1. AUTOBIOGRAPHICAL PERSONAL ANCHOR
  // ==========================================
  {
    id: "memory",
    name: "Autobiographical Personal Anchor",
    slash: "/memory",
    aliases: ["/personal", "/life", "/experience", "/self"],
    category: "Memory Mastery",
    iconName: "HeartHandshake",
    badge: "Self-Reference Effect",
    shortDesc: "Connect document concepts directly to your personal life and lived experiences",
    fullDesc:
      "Ties abstract concepts to your own autobiographical memories, childhood moments, and daily habits. Information linked directly to personal identity and emotion achieves up to 400% higher retention compared to passive reading.",
    whenToUse: "Best for dry, abstract, or highly theoretical concepts that feel distant from your everyday reality.",
    cognitiveScience:
      "The medial prefrontal cortex prioritizes self-relevant information. Mapping external data onto existing personal memories activates dense, pre-established neural networks for instant long-term recall.",
    steps: [
      {
        step: 1,
        title: "Identify the Abstract Concept",
        action: "Extract the core mechanism, formula, or principle from the document.",
      },
      {
        step: 2,
        title: "Mine Your Personal Memory Bank",
        action: "Map the concept to an emotional lived experience (learning to drive, a memorable trip, a kitchen mishap).",
      },
      {
        step: 3,
        title: "Forge the Autobiographical Bridge",
        action: "Create a direct story link explaining why this principle works exactly like your lived memory.",
      },
    ],
    proTip: "The stronger the emotional resonance (humor, surprise, nostalgia), the stronger the synaptic consolidation.",
    promptInstruction:
      "AUTOBIOGRAPHICAL PERSONAL MEMORY METHOD: Connect every key concept from the document directly to relatable human life experiences, personal memories, daily routines, and emotional milestones:\n1. Core Concept\n2. Personal Life Analogy (A vivid lived experience or personal memory anchor)\n3. Step-by-Step Connection (Step 1, Step 2, Step 3)\n4. Emotional Memory Hook.",
    exampleInput: "/memory",
    exampleOutputSnippet:
      "Personal Memory Anchor: The Bouncer at Your Favorite Club\n\n• Step 1 (The Crowd): 200 people pushing to enter at once (Client API requests flooding a server).\n• Step 2 (The Velvet Rope): The bouncer only allows 5 people through per minute to prevent overcrowding (Token Bucket Rate Limiting).\n• Step 3 (HTTP 429): If you cut the line, you are told to wait 10 minutes outside (Rate limit cooldown)!\n\nMemory Hook: Whenever you encounter 429 Too Many Requests, picture that 6'4\" bouncer crossing his arms.",
  },

  // ==========================================
  // 2. S.E.E. PRINCIPLE
  // ==========================================
  {
    id: "see",
    name: "S.E.E. Principle (Sensory, Exaggerated, Energized)",
    slash: "/see",
    aliases: ["/sensory", "/visualize", "/exaggerate"],
    category: "Memory Mastery",
    iconName: "Eye",
    badge: "Sensory Cinema",
    shortDesc: "Transform ideas into vivid, exaggerated, high-energy mental movies",
    fullDesc:
      "Converts dry, invisible data into memorable mental cinema using 3 sensory rules: rich physical textures (Sensory), 100x scale multipliers (Exaggerated), and dynamic kinetic motion (Energized).",
    whenToUse: "Ideal for memorizing invisible mechanisms, microscopic processes, complex algorithms, or abstract definitions.",
    cognitiveScience:
      "Visual and spatial processing in the occipital and parietal lobes commands over 50% of the cortex. S.E.E. reroutes text into these high-bandwidth visual processing centers.",
    steps: [
      {
        step: 1,
        title: "Sensory Engagement (S)",
        action: "Layer in rich physical sensations: buzzing electric frequencies, burning smells, vibrant textures.",
      },
      {
        step: 2,
        title: "Exaggeration (E)",
        action: "Multiply proportions by 100x: make objects skyscraper-sized, impossibly heavy, or comically tiny.",
      },
      {
        step: 3,
        title: "Energized Action (E)",
        action: "Inject kinetic velocity, dramatic collisions, and high-speed physical reactions.",
      },
    ],
    proTip: "Bizarre, impossible actions stick 5x better in memory than logical ordinary movements.",
    promptInstruction:
      "S.E.E. PRINCIPLE: Convert the document's core concepts into high-definition mental cinema:\n1. Step 1: S (Sensory Anchor) - Sight, sound, touch, smell.\n2. Step 2: E (Exaggeration) - Scale elements to comic or monumental proportions.\n3. Step 3: E (Energized Action) - Animate objects with kinetic velocity.\nShow the exact encoded concept and its visual key.",
    exampleInput: "/see",
    exampleOutputSnippet:
      "• Step 1: S (Sensory): Golden guitar dials hum with crackling blue electricity and smell of sharp ozone.\n• Step 2: E (Exaggerated): Each dial is 100 feet tall, with glowing numeric gears spinning at supersonic speed.\n• Step 3: E (Energized Action): A tidal wave of glowing purple error sparks rushes backward through the neural layers, violently snapping the giant dials into the millimeter position!",
  },

  // ==========================================
  // 3. METHOD OF LOCI (MEMORY PALACE)
  // ==========================================
  {
    id: "palace",
    name: "Method of Loci (Memory Palace)",
    slash: "/palace",
    aliases: ["/loci", "/journey", "/house", "/room"],
    category: "Memory Mastery",
    iconName: "Castle",
    badge: "Spatial Palace",
    shortDesc: "Map concepts to a 5-room spatial journey in a grand architectural layout",
    fullDesc:
      "The classical memory method used since ancient Greece and Rome by orators and modern memory champions. Encodes complex knowledge into sequential rooms with distinct interactive landmark objects.",
    whenToUse: "Best for comprehensive book chapters, multi-faceted research papers, and complex systems.",
    cognitiveScience:
      "Hippocampal place cells and grid cells generate a high-resolution coordinate grid of physical spaces, allowing effortless navigation forward and backward without missing data.",
    steps: [
      {
        step: 1,
        title: "Establish the Architecture",
        action: "Define 5 distinct rooms in sequence (Front Porch, Living Room, Kitchen, Library, Balcony).",
      },
      {
        step: 2,
        title: "Place Bizarre Landmarks",
        action: "Deposit 1 exaggerated, sensory landmark object in each room representing a key principle.",
      },
      {
        step: 3,
        title: "Perform the Mental Walk",
        action: "Walk through the front door and inspect each landmark in sequence.",
      },
    ],
    proTip: "Limit each room to 1-2 distinct concepts to keep the mental scenery uncluttered.",
    promptInstruction:
      "MEMORY PALACE / METHOD OF LOCI: Create a 5-station journey through a grand house or architectural building:\nFor each station: Room Location, Bizarre Landmark Object, Encoded Fact, Walking Transition to Next Room.",
    exampleInput: "/palace",
    exampleOutputSnippet:
      "Station 1 (Front Porch Gate)\n• Landmark: A giant robotic vacuum cleaner inhaling mountains of raw scattered documents.\n• Concept: Automated Data Ingestion & Preprocessing.\n\nStation 2 (Living Room Fireplace)\n• Landmark: Molten glowing vectors being poured into 1536-dimensional ice cube trays.\n• Concept: High-Dimensional Vector Embeddings.\n\nStation 3 (Kitchen Counter)\n• Landmark: A chef slicing matrices into ultra-fast cache sandwiches.\n• Concept: In-Memory Indexing & Hashing.",
  },

  // ==========================================
  // 4. PERSON-ACTION-OBJECT (PAO SYSTEM)
  // ==========================================
  {
    id: "pao",
    name: "Person-Action-Object (PAO System)",
    slash: "/pao",
    aliases: ["/matrix", "/compression", "/triad"],
    category: "Memory Mastery",
    iconName: "Binary",
    badge: "Matrix Compression",
    shortDesc: "Compress long numeric chains and complex data into 3-part synthetic scenes",
    fullDesc:
      "The competitive memory championship standard. Compresses multi-part data or large digit strings by breaking them into a 3-way composite of a distinct Person, a dynamic Action, and a concrete Object.",
    whenToUse: "Perfect for statistical data tables, multi-variable formulas, encryption keys, and complex coordinate matrices.",
    cognitiveScience:
      "Triple-associative binding in the parietal cortex merges three separate sensory channels into a single working memory slot, tripling storage density.",
    steps: [
      {
        step: 1,
        title: "Segment Variables",
        action: "Break the target data into 3 distinct components (Subject, Dynamic Action, Target Object).",
      },
      {
        step: 2,
        title: "Assign Vivid Entities",
        action: "Map Component 1 to a famous Person, Component 2 to an Action, and Component 3 to an Object.",
      },
      {
        step: 3,
        title: "Fuse the Triad Scene",
        action: "Combine all three into a single bizarre mental scene and anchor it into your memory.",
      },
    ],
    proTip: "Make the Person actively use the Object in an impossible, comical way to reinforce the link.",
    promptInstruction:
      "PERSON-ACTION-OBJECT (PAO) SYSTEM: Break down the target metrics, formulas, or rules into 3-part PAO triads:\n1. Person (Distinct character representing variable 1)\n2. Action (Kinetic motion representing variable 2)\n3. Object (Tangible tool representing variable 3)\n4. Unified Synthetic Mental Image.",
    exampleInput: "/pao",
    exampleOutputSnippet:
      "PAO Triad: Elasticity of Demand Formula (E = %ΔQ / %ΔP)\n• Person (E): Albert Einstein bouncing on a giant trampoline.\n• Action (%ΔQ): Slicing giant quantity watermelons with a laser katana.\n• Object (%ΔP): While dodging flying gold price tag missiles!\n\nUnified Scene: Picture Einstein on a trampoline slicing quantity watermelons while dodging price tags!",
  },

  // ==========================================
  // 5. FOCUSED VS. DIFFUSE MODE SHIFT
  // ==========================================
  {
    id: "diffuse",
    name: "Focused vs. Diffuse Cognitive Shift",
    slash: "/diffuse",
    aliases: ["/breakthrough", "/einstellung", "/incubate"],
    category: "Structure",
    iconName: "Sparkles",
    badge: "Cognitive Shift",
    shortDesc: "Break past mental fixation (Einstellung) and solve complex bottlenecks",
    fullDesc:
      "Oscillates between prefrontal intense analytical focus and Default Mode Network (DMN) diffuse incubation. Breaks cognitive fixation when you hit a mental wall on difficult problems.",
    whenToUse: "When you feel stuck, confused, or hit diminishing returns on a difficult problem or bug.",
    cognitiveScience:
      "Diffuse mode activates wide-range resting state cortical connectivity, allowing the brain to connect distant concepts without the rigid constraints of the focused prefrontal network.",
    steps: [
      {
        step: 1,
        title: "Focused Loading",
        action: "Isolate the exact bottleneck and load the problem parameters intensely into working memory.",
      },
      {
        step: 2,
        title: "Deliberate Disengagement",
        action: "Step away for physical movement, a walk, or switch to an unrelated lightweight task.",
      },
      {
        step: 3,
        title: "Capture Diffuse Insight",
        action: "Record the subconscious breakthrough immediately upon return and verify logically.",
      },
    ],
    proTip: "Never stay stuck on a single line of reasoning for more than 20 minutes without disengaging into diffuse mode.",
    promptInstruction:
      "FOCUSED VS. DIFFUSE COGNITIVE SHIFT: Analyze the conceptual bottleneck from this document:\n1. The Focused Core (The exact technical block)\n2. The Einstellung Trap (The false assumption to discard)\n3. The Diffuse Metaphor (A wide-angle intuitive breakthrough perspective)\n4. The Concrete Resolution.",
    exampleInput: "/diffuse",
    exampleOutputSnippet:
      "1. Focused Bottleneck: Database queries freezing under concurrent write locks.\n2. The Einstellung Trap: Assuming you must buy a bigger server or add complex multi-threading locks.\n3. Diffuse Metaphor: Think of a single highway tollbooth where drivers stop to count coins vs. automated electronic toll sensors.\n4. Concrete Resolution: Switch from pessimistic row locking to an append-only event log with asynchronous batch workers.",
  },

  // ==========================================
  // 6. INTERLEAVED VARIED PRACTICE
  // ==========================================
  {
    id: "interleave",
    name: "Interleaved Varied Practice",
    slash: "/interleave",
    aliases: ["/mix", "/discrimination", "/variety"],
    category: "Testing",
    iconName: "GitFork",
    badge: "Pattern Discrimination",
    shortDesc: "Mix diverse problem types to master conceptual discrimination and transfer",
    fullDesc:
      "Replaces repetitive block study with varied, interleaved problem sets. Forces the brain to continuously select the correct solution strategy rather than relying on automatic autopilot.",
    whenToUse: "When preparing for comprehensive exams, diagnostic decisions, or cross-functional strategy meetings.",
    cognitiveScience:
      "Desirable Difficulties: Interleaving forces the brain to reload distinct retrieval schemas into working memory on every problem, building flexible neural transfer pathways.",
    steps: [
      {
        step: 1,
        title: "Identify Distinct Categories",
        action: "Extract 3-4 distinct problem archetypes or methodologies from the material.",
      },
      {
        step: 2,
        title: "Shuffle the Sequence",
        action: "Interleave problems in an alternating pattern rather than practicing in blocks.",
      },
      {
        step: 3,
        title: "Master the Discrimination Rule",
        action: "Explicitly articulate why Problem A requires Strategy X while Problem B requires Strategy Y.",
      },
    ],
    proTip: "Interleaving feels slower initially, but produces 2x higher long-term retention than blocked repetition.",
    promptInstruction:
      "INTERLEAVED PRACTICE GENERATOR: Create 3 mixed-category challenge scenarios from the text:\nFor each scenario: Problem Context, Strategy Selection Decision, Why Alternative Strategies Fail, Key Discrimination Hallmark.",
    exampleInput: "/interleave",
    exampleOutputSnippet:
      "Scenario 1 (High Read Load / Static Data): Strategy: In-Memory Redis Cache.\n• Discrimination Hallmark: Zero data mutation requirements; sub-millisecond read priority.\n\nScenario 2 (High Write Load / Financial Audit): Strategy: Append-Only Event Sourcing.\n• Discrimination Hallmark: Immutable transaction history required; eventual consistency acceptable.\n\nScenario 3 (Complex Fuzzy Search): Strategy: Vector Embedding Cosine Search.\n• Discrimination Hallmark: Semantic nuance exceeds exact keyword token matching.",
  },

  // ==========================================
  // 7. FASTER LEARNING PROTOCOL
  // ==========================================
  {
    id: "faster",
    name: "FASTER Accelerated Learning Framework",
    slash: "/faster",
    aliases: ["/accelerate", "/kwik", "/meta"],
    category: "Structure",
    iconName: "Zap",
    badge: "Accelerated Study",
    shortDesc: "Comprehensive 6-pillar framework (Forget, Act, State, Teach, Enter, Review)",
    fullDesc:
      "The complete meta-learning framework: Forget limitations, Actively engage, optimize emotional State, learn to Teach, Enter into calendar, and execute Review cycles.",
    whenToUse: "Use at the beginning of any major textbook, technical manual, or onboarding program.",
    cognitiveScience:
      "Neuroplasticity is state-dependent. Emotional engagement paired with deliberate generative teaching accelerates synaptic myelination.",
    steps: [
      {
        step: 1,
        title: "Forget & Clear Buffer",
        action: "Set aside preconceptions and distractions to open cognitive bandwidth.",
      },
      {
        step: 2,
        title: "Active State & Generative Notes",
        action: "Take dual-column notes: Left side for core facts, Right side for creative analogies.",
      },
      {
        step: 3,
        title: "Teach & Rapid Review",
        action: "Synthesize the core takeaways as if instructing a colleague within 24 hours.",
      },
    ],
    proTip: "Always read with the intention of teaching the concept to someone else that evening.",
    promptInstruction:
      "FASTER LEARNING PROTOCOL: Structure the document into the FASTER pillars:\n1. F (Key Misconception to Forget)\n2. A (Active Takeaway & Reflection Question)\n3. S (High-Energy Conceptual Anchor)\n4. T (Teach-Back: 60-second explanation)\n5. R (Spaced Retrieval Checkpoint).",
    exampleInput: "/faster",
    exampleOutputSnippet:
      "• Forget: Discard the belief that AI requires deep matrix calculus before using vector databases.\n• Act: Map your company's core data models into vector coordinates right now.\n• State: Approach this topic with extreme curiosity: 'How can this save 10 hours a week?'\n• Teach: 'Vector search is like Google Maps for meaning instead of street names.'\n• Review: Test the 3 key vector metrics tomorrow morning at 9:00 AM.",
  },

  // ==========================================
  // 8. HIPPOCAMPAL PRIMING & SYNAPTIC LOCK
  // ==========================================
  {
    id: "bdnf",
    name: "Hippocampal Priming & Synaptic Lock",
    slash: "/bdnf",
    aliases: ["/neuro", "/plasticity", "/consolidation"],
    category: "Structure",
    iconName: "HeartHandshake",
    badge: "Neuroplasticity",
    shortDesc: "Optimize biological memory consolidation, BDNF priming, and sleep replay",
    fullDesc:
      "Harnesses neurobiological memory consolidation principles: Brain-Derived Neurotrophic Factor (BDNF) upregulation, cortisol mitigation, and slow-wave sleep synaptic transfer.",
    whenToUse: "Use when planning intensive study periods, multi-day exam prep, or complex skill acquisition.",
    cognitiveScience:
      "Memory traces are initially fragile in the hippocampus. Slow-Wave Sleep (SWS) replays daytime neural firings, transferring memories into the permanent neocortex.",
    steps: [
      {
        step: 1,
        title: "Aerobic Priming",
        action: "Engage in 15-20 minutes of physical movement before study to spike BDNF and cerebral blood flow.",
      },
      {
        step: 2,
        title: "High-Intensity Encoding Block",
        action: "Execute 45 minutes of zero-distraction deep work using active memory frameworks.",
      },
      {
        step: 3,
        title: "Slow-Wave Sleep Consolidation",
        action: "Protect 7-8 hours of sleep to allow nighttime hippocampal replay to lock the synapses.",
      },
    ],
    proTip: "Reviewing key flashcards 10 minutes before sleep enhances nighttime hippocampal replay by 60%.",
    promptInstruction:
      "HIPPOCAMPAL PRIMING PROTOCOL: Generate a neuro-optimized study plan for this document:\n1. Pre-Study Priming Cue\n2. High-Yield 45-Minute Core Focus Targets\n3. Pre-Sleep Consolidation Cards\n4. Day-2 Memory Verification Prompt.",
    exampleInput: "/bdnf",
    exampleOutputSnippet:
      "1. Priming: Review 3 core thesis diagrams before beginning.\n2. 45-Min Focus Target: Master HNSW indexing graph mechanics and cosine distance formulas.\n3. Pre-Sleep Cue: Spend 5 minutes before bed visualizing the 3 memory palace rooms created today.\n4. Day-2 Test: Write down the 3 vector trade-offs from memory before checking notes.",
  },

  // ==========================================
  // 9. BODY LIST PEG SYSTEM
  // ==========================================
  {
    id: "body",
    name: "Body List Peg System",
    slash: "/body",
    aliases: ["/bodylist", "/anatomy", "/physical"],
    category: "Memory Mastery",
    iconName: "User",
    badge: "Anatomical Loci",
    shortDesc: "Anchor key concepts to 10 physical body stations from feet to crown",
    fullDesc:
      "Uses your own anatomical structure as a portable, always-accessible memory filing cabinet. Anchors up to 10 sequential concepts along your physical axis from feet to the crown of your head.",
    whenToUse: "Perfect for speeches, exam checklists, 5-10 step procedures, or presentations where you cannot use notes.",
    cognitiveScience:
      "Proprioception (the nervous system's innate awareness of body position) creates instant somatic retrieval cues requiring zero external tools.",
    steps: [
      {
        step: 1,
        title: "Scan Lower Body (Stations 1-4)",
        action: "Attach base inputs or foundation principles to Feet, Knees, Thighs, and Hips.",
      },
      {
        step: 2,
        title: "Scan Torso & Shoulders (Stations 5-7)",
        action: "Attach processing mechanisms to Stomach, Chest/Heart, and Shoulders.",
      },
      {
        step: 3,
        title: "Scan Head & Crown (Stations 8-10)",
        action: "Attach final outputs and overarching goals to Throat, Face, and Crown.",
      },
    ],
    proTip: "Physically tap each body station while mentally rehearsing the list for dual-motor encoding.",
    promptInstruction:
      "BODY LIST MEMORY SYSTEM: Map the concepts onto the 10 sequential body stations:\n1. Feet (Ground / Base)\n2. Knees\n3. Thighs\n4. Hips / Seat\n5. Stomach\n6. Chest / Heart\n7. Shoulders\n8. Throat / Neck\n9. Face / Eyes\n10. Top of Head (Crown)\nFor each station: Body Part, Document Fact, and Tactile Physical Action.",
    exampleInput: "/body",
    exampleOutputSnippet:
      "1. Feet (Requirements): Standing in heavy concrete molds shaped like client contracts.\n2. Knees (Architecture): Blueprints stapled around your knees, locking them into rigid structural pillars.\n3. Thighs (Development): Pockets shooting out millions of glowing code strands like spiderwebs.\n4. Stomach (Testing): A mini QA robot jumping on your stomach checking for bug vibrations.\n5. Chest (Deployment): A glowing jet engine in your chest launching the build to the cloud.",
  },

  // ==========================================
  // 10. CAR JOURNEY PEG SYSTEM
  // ==========================================
  {
    id: "car",
    name: "Car Journey Peg System",
    slash: "/car",
    aliases: ["/vehicle", "/auto", "/drive"],
    category: "Memory Mastery",
    iconName: "Car",
    badge: "Vehicle Loci",
    shortDesc: "Anchor concepts to familiar stations inside and outside a vehicle",
    fullDesc:
      "Harnesses your instinctive mental model of a car to hold 7 sequential facts in order. Leverages exterior and interior stations (Headlights, Hood, Windshield, Steering Wheel, Glove Box, Trunk, Exhaust).",
    whenToUse: "Great for 5-7 step workflows, pipelines, security protocols, or deployment sequences.",
    cognitiveScience:
      "Spatial familiarity with everyday environments enables zero-fatigue recall because the mental route is already burned into long-term memory.",
    steps: [
      {
        step: 1,
        title: "Front Exterior (Stations 1-2)",
        action: "Anchor the initial input/setup to Headlights and Engine Hood.",
      },
      {
        step: 2,
        title: "Interior Cabin (Stations 3-5)",
        action: "Anchor core logic and processing to Windshield, Steering Wheel, and Glove Box.",
      },
      {
        step: 3,
        title: "Rear & Output (Stations 6-7)",
        action: "Anchor final results and outputs to Trunk and Exhaust Pipe.",
      },
    ],
    proTip: "Picture yourself walking around the vehicle clockwise, touching each station in order.",
    promptInstruction:
      "CAR MEMORY SYSTEM: Map the document facts across 7 car stations:\n1. Front Headlights / Grill\n2. Engine Hood\n3. Windshield & Wipers\n4. Steering Wheel\n5. Glove Box\n6. Trunk / Boot\n7. Exhaust Pipe\nFor each: Station, Encoded Principle, Kinetic Visual Interaction.",
    exampleInput: "/car",
    exampleOutputSnippet:
      "Station 1 (Headlights - Authentication): High-beam laser scanners verifying biometric badges of incoming users.\nStation 2 (Engine Hood - Environment Secrets): Titanium safe welded onto the engine containing private API keys.\nStation 3 (Windshield - Firewall): Bulletproof glass deflecting DDoS missile volleys with electric blue spark deflections.\nStation 4 (Steering Wheel - Load Balancer): A glowing gyro wheel routing incoming traffic across 8 engine pistons.\nStation 5 (Trunk - Database Backup): Encrypted hard drives automatically duplicating every second.",
  },

  // ==========================================
  // 11. RHYMING PEG MEMORY SYSTEM
  // ==========================================
  {
    id: "peg",
    name: "Rhyming Peg Memory System",
    slash: "/peg",
    aliases: ["/pegs", "/rhyme", "/numbersystem"],
    category: "Memory Mastery",
    iconName: "Paperclip",
    badge: "Numerical Pegs",
    shortDesc: "Lock sequential points to standard rhyme pegs (1=Sun, 2=Shoe, 3=Tree...)",
    fullDesc:
      "Uses universal acoustic rhyme pegs to hold items in precise numerical order (1=Sun, 2=Shoe, 3=Tree, 4=Door, 5=Glove, 6=Sticks, 7=Heaven, 8=Gate, 9=Vine, 10=Hen). Allows random-access recall of any numbered item.",
    whenToUse: "When the exact ranked or numbered order of items is critical (e.g. Top 10 lists, ranked priorities, ordered laws).",
    cognitiveScience:
      "Acoustic rhyme structures stimulate phonological loops in the left temporal lobe, creating an unshakeable acoustic scaffolding for working memory.",
    steps: [
      {
        step: 1,
        title: "Acoustic Rhyme Matching",
        action: "Pair the number with its standard rhyme word (1-Sun, 2-Shoe, 3-Tree...).",
      },
      {
        step: 2,
        title: "Violent Interaction",
        action: "Make the document concept physically collide with or wrap around the peg object.",
      },
      {
        step: 3,
        title: "Random Access Recall",
        action: "Test random access: Jump directly to #4 (Door) or #7 (Heaven) to verify instant recall.",
      },
    ],
    proTip: "Use this system whenever you need to recall item #4 or #7 without counting from #1.",
    promptInstruction:
      "RHYMING PEG SYSTEM: Map the top document points to the 1-10 Peg System:\n1 = Sun | 2 = Shoe | 3 = Tree | 4 = Door | 5 = Glove | 6 = Sticks | 7 = Heaven | 8 = Gate | 9 = Vine | 10 = Hen\nFor each: Peg Word, Encoded Concept, Step-by-Step Associative Interaction.",
    exampleInput: "/peg",
    exampleOutputSnippet:
      "1 = Sun (Circuit Breaker Pattern): A scorching supernova sun fries an overloaded power line, instantly tripping a safety shield before the city grid collapses.\n2 = Shoe (Retry with Backoff): A runner in sneakers trips, waits 2 seconds, takes another step, waits 4 seconds, then sprints away smoothly.\n3 = Tree (Hierarchical Routing): A giant oak tree with glowing branch pathways directing messages to the correct leaves instantly.",
  },

  // ==========================================
  // 12. MAJOR PHONETIC NUMBER SYSTEM
  // ==========================================
  {
    id: "numbers",
    name: "Major Phonetic Number System",
    slash: "/numbers",
    aliases: ["/stats", "/dates", "/majorsystem", "/digits"],
    category: "Memory Mastery",
    iconName: "Hash",
    badge: "Phonetic Numbers",
    shortDesc: "Convert dry statistics, dates, formulas, and percentages into vivid words",
    fullDesc:
      "The classic 400-year-old phonetic memory code (0=s/z, 1=t/d, 2=n, 3=m, 4=r, 5=l, 6=j/sh/ch, 7=k/g, 8=f/v, 9=p/b) that transforms abstract numbers into tangible, visual words.",
    whenToUse: "Indispensable for financial figures, historical dates, latency metrics, benchmarks, and statistical findings.",
    cognitiveScience:
      "Abstract numbers have zero evolutionary emotional resonance. Converting digits into phonetic consonant sounds activates visual-linguistic memory networks.",
    steps: [
      {
        step: 1,
        title: "Isolate Key Metrics",
        action: "Extract critical dates, latency benchmarks, percentages, and financial metrics from text.",
      },
      {
        step: 2,
        title: "Phonetic Consonant Translation",
        action: "Convert digits to consonants (e.g. 95 -> P/B + L -> 'BALL' or 'BELL').",
      },
      {
        step: 3,
        title: "Anchor to the Metric",
        action: "Fuse the phonetic word directly with the metric's real-world meaning.",
      },
    ],
    proTip: "Vowels (a, e, i, o, u) and w, h, y have no number value and can be added freely to form catchy words.",
    promptInstruction:
      "MAJOR PHONETIC NUMBER SYSTEM: Extract all key statistics, dates, benchmarks, and percentages from this text:\nFor each metric: Exact Number / Stat, Major Consonant Translation, Phonetic Word & Visual Anchor.",
    exampleInput: "/numbers",
    exampleOutputSnippet:
      "Stat: 95ms latency threshold\n• Phonetic Code: 9 (P/B) + 5 (L) = BELL\n• Visual Anchor: A crystal church BELL ringing at lightning speed every 95 milliseconds whenever an API request arrives!\n\nStat: 1492 Historical Milestone\n• Phonetic Code: 1 (T) + 4 (R) + 9 (P) + 2 (N) = TURBAN\n• Visual Anchor: Columbus wearing a glowing TURBAN as his ship lands on the shore!",
  },

  // ==========================================
  // 13. 4-STEP NAME & TERMINOLOGY RECALL
  // ==========================================
  {
    id: "names",
    name: "4-Step Name & Terminology System",
    slash: "/names",
    aliases: ["/people", "/terms", "/authors", "/who"],
    category: "Memory Mastery",
    iconName: "Contact",
    badge: "Terminology Recall",
    shortDesc: "4-step framework to lock researcher names, authors, and technical jargon",
    fullDesc:
      "Solves the classic name-recall paradox using a 4-step hook: Isolate Name, Sound-Alike Transformation, Core Contribution Extraction, and Action Bond.",
    whenToUse: "Essential when studying academic papers with multiple authors, medical/legal terminology, or foreign language vocabulary.",
    cognitiveScience:
      "Bypasses the Baker/baker paradox (remembering a person's profession effortlessly while forgetting their surname) by converting arbitrary names into tangible concrete objects.",
    steps: [
      {
        step: 1,
        title: "Identify Name or Term",
        action: "Isolate the exact author, scientist, algorithm, or technical term.",
      },
      {
        step: 2,
        title: "Sound-Alike Translation",
        action: "Find words that sound identical (e.g. Dijkstra -> 'Dyke' + 'Straw').",
      },
      {
        step: 3,
        title: "Action Bond",
        action: "Visually link the sound-alike object to their primary thesis or algorithm.",
      },
    ],
    proTip: "Always exaggerate the Sound-Alike object with vivid colors and kinetic motion.",
    promptInstruction:
      "4-STEP NAME & VOCABULARY RECALL: Extract key authors, researchers, algorithms, and technical terms:\nFor each: Name / Term, Sound-Alike Image, Core Contribution, Action Bond Interaction.",
    exampleInput: "/names",
    exampleOutputSnippet:
      "Name: Geoffrey Hinton\n• Sound-Alike: A Chef giving Hints.\n• Contribution: Pioneer of Deep Learning & Backpropagation.\n• Action Bond: A tall Chef in a white apron whispering glowing math hints into a giant computational neural cake!\n\nTerm: Dijkstra's Algorithm\n• Sound-Alike: A Dyke made of Straw.\n• Contribution: Shortest-path graph calculation.\n• Action Bond: A glowing laser car driving over a Straw Dyke finding the fastest road home.",
  },

  // ==========================================
  // 14. CHAIN LINK STORY METHOD
  // ==========================================
  {
    id: "chain",
    name: "Chain Link Story Method",
    slash: "/chain",
    aliases: ["/link", "/storychain", "/domino"],
    category: "Memory Mastery",
    iconName: "Link2",
    badge: "Associative Chain",
    shortDesc: "Domino-link concepts in an unbroken associative narrative chain",
    fullDesc:
      "Creates an associative narrative chain where Idea A physically triggers Idea B, which triggers Idea C like falling dominoes. Eliminates memory gaps during long sequences.",
    whenToUse: "Best for historical timelines, biological cascades, multi-stage legal procedures, and chemical reaction pathways.",
    cognitiveScience:
      "Serial position recall thrives on direct temporal association. When each item acts as the key to unlock the next item, retrieval runs automatically.",
    steps: [
      {
        step: 1,
        title: "Isolate Sequential Milestones",
        action: "Break the material into 5-8 chronological or logical milestone concepts.",
      },
      {
        step: 2,
        title: "Create Domino Collisions",
        action: "Make Item 1 smash directly into Item 2 without intermediate fillers.",
      },
      {
        step: 3,
        title: "Chain to the Finish",
        action: "Ensure Item 2 triggers Item 3 until the narrative chain is complete.",
      },
    ],
    proTip: "Never connect Item 1 to Item 3; always link strictly in pairs (1 to 2, 2 to 3).",
    promptInstruction:
      "CHAIN LINK STORY METHOD: Connect all key concepts into an unbroken domino narrative where Concept A physically collides with Concept B, which triggers Concept C. Show the step-by-step links.",
    exampleInput: "/chain",
    exampleOutputSnippet:
      "• Link 1 ➔ 2: The Declaration of Independence (1) shoots into the sky like a rocket, slamming into a giant floating Tea Crate (2).\n• Link 2 ➔ 3: The Tea Crate explodes into millions of steaming teacups that form an army marching onto Boston Harbor (3).\n• Link 3 ➔ 4: The harbor waters freeze into solid ice bricks that stack into the Constitution Hall (4).",
  },

  // ==========================================
  // 15. ACRONYMS & ACROSTICS
  // ==========================================
  {
    id: "acronym",
    name: "First Letter Acronyms & Acrostics",
    slash: "/acronym",
    aliases: ["/firstletter", "/acrostic", "/mnemonic"],
    category: "Memory Mastery",
    iconName: "SpellCheck",
    badge: "Acrostic Chunking",
    shortDesc: "Condense long lists into punchy acronym words and rhythm sentences",
    fullDesc:
      "Compresses complex multi-step procedures, classifications, and rule sets into catchy acronym words and memorable rhyming acrostic sentences.",
    whenToUse: "Ideal for regulatory guidelines, medical criteria, engineering standards, and taxonomies.",
    cognitiveScience:
      "Cognitive chunking compresses 7+ disparate items down to a single compact unit in working memory.",
    steps: [
      {
        step: 1,
        title: "Extract First Letters",
        action: "Isolate the first letter of each key term in the list.",
      },
      {
        step: 2,
        title: "Form Pronounceable Word",
        action: "Rearrange or select letters to form a catchy word acronym (e.g. ACID, SMART).",
      },
      {
        step: 3,
        title: "Compose Rhythm Acrostic",
        action: "Write a memorable, humorous sentence where each word starts with that letter.",
      },
    ],
    proTip: "A funny or absurd sentence is 3x more memorable than a formal sentence.",
    promptInstruction:
      "FIRST LETTER ACRONYM & ACROSTIC SYSTEM: Build:\n1. Catchy Word Acronym\n2. Memorable Sentence Acrostic\n3. Letter-by-Letter Definition Breakdown.",
    exampleInput: "/acronym",
    exampleOutputSnippet:
      "Acronym: A.C.I.D.\n• A = Atomicity (All or nothing execution)\n• C = Consistency (Valid database states only)\n• I = Isolation (Concurrent transactions do not clash)\n• D = Durability (Persisted on non-volatile disk forever)\n\nSentence Acrostic: 'Always Clean In Database'",
  },

  // ==========================================
  // 16. P.I.C. CONCENTRATION & FOCUS ENGINE
  // ==========================================
  {
    id: "pic",
    name: "P.I.C. Focus & Curiosity Engine",
    slash: "/pic",
    aliases: ["/focus", "/curiosity", "/purpose"],
    category: "Memory Mastery",
    iconName: "Target",
    badge: "Focus Engine",
    shortDesc: "Uncover Purpose, Interest, and Curiosity triggers for effortless focus",
    fullDesc:
      "Memory is effortless when driven by the P.I.C. triad: Purpose (Why do I need this?), Interest (What makes this fascinating?), and Curiosity (What unexpected mystery does this solve?).",
    whenToUse: "Use before starting a dense or tedious paper to instantly spark intense intellectual engagement.",
    cognitiveScience:
      "Dopamine surges triggered by novelty and curiosity prime the hippocampus for long-term synaptic potentiation.",
    steps: [
      {
        step: 1,
        title: "Define Purpose (P)",
        action: "Identify the high-stakes reason this knowledge directly impacts your outcomes.",
      },
      {
        step: 2,
        title: "Ignite Interest (I)",
        action: "Find the most fascinating, counter-intuitive insight hidden in the document.",
      },
      {
        step: 3,
        title: "Awaken Curiosity (C)",
        action: "Formulate 3 provocative mystery questions that challenge standard assumptions.",
      },
    ],
    proTip: "Before reading any section, write down 1 curiosity question you want answered.",
    promptInstruction:
      "P.I.C. FOCUS FRAMEWORK: Analyze the document through the 3 P.I.C. pillars:\n1. Purpose: The high-stakes reason this topic matters.\n2. Interest: The most captivating, non-obvious core insight.\n3. Curiosity: 3 provocative mystery questions this document answers.",
    exampleInput: "/pic",
    exampleOutputSnippet:
      "1. Purpose: Eliminates quadratic computational bottlenecks, allowing models to scale to trillions of tokens without crashing.\n2. Interest: The system does not read sequentially—it sees entire paragraphs simultaneously like human visual perception!\n3. Curiosity: How can basic matrix dot-products mimic human contextual intuition?",
  },

  // ==========================================
  // 17. CONTINUOUS SPACED RETRIEVAL PROTOCOL
  // ==========================================
  {
    id: "spacedrecall",
    name: "Continuous Spaced Retrieval Protocol",
    slash: "/spacedrecall",
    aliases: ["/retrieval", "/schedule", "/spaced", "/review"],
    category: "Memory Mastery",
    iconName: "Calendar",
    badge: "Spaced Retention",
    shortDesc: "1-Hour, Day 1, Day 7, and Day 30 active review schedule",
    fullDesc:
      "Overcomes the Ebbinghaus Forgetting Curve by establishing calibrated active recall checkpoints at expanding intervals (1 Hour, 24 Hours, 7 Days, 30 Days).",
    whenToUse: "Use after completing any major document or book to build a structured retention schedule.",
    cognitiveScience:
      "Synaptic consolidation requires retrieval effort precisely when a memory trace begins to decay, triggering lasting structural myelination.",
    steps: [
      {
        step: 1,
        title: "Immediate Lock (1 Hour)",
        action: "Test recall of the 3 primary anchor concepts immediately after reading.",
      },
      {
        step: 2,
        title: "Consolidation (Day 1 & Day 7)",
        action: "Answer synthesis and application questions without looking at the text.",
      },
      {
        step: 3,
        title: "Permanent Mastery (Day 30)",
        action: "Perform a cold retrieval test to lock knowledge into crystalline memory.",
      },
    ],
    proTip: "Always test yourself before reviewing notes—active retrieval is 3x more effective than passive re-reading.",
    promptInstruction:
      "SPACED RETRIEVAL PROTOCOL: Build a structured memory retention schedule based on the document:\n- 1 Hour Review: 3 core anchor terms to test right away.\n- Day 1 (Consolidation): 3 conceptual synthesis questions.\n- Day 7 (Cold Retrieval): 3 high-yield application problems.\n- Day 30 (Mastery Check): Core principles summary to mentally test.",
    exampleInput: "/spacedrecall",
    exampleOutputSnippet:
      "1-Hour Review: State the central thesis and 3 main mechanisms without opening the document.\nDay 1 Review: How does concept X interact with variable Y under extreme load?\nDay 7 Review: Solve an unannounced edge-case problem using theorem Z.\nDay 30 Review: Explain the entire architecture from memory to a colleague.",
  },

  // ==========================================
  // 18. FIRST PRINCIPLES BREAKDOWN
  // ==========================================
  {
    id: "firstprinciple",
    name: "First Principles Breakdown",
    slash: "/firstprinciple",
    aliases: ["/principles", "/axioms", "/groundup"],
    category: "Structure",
    iconName: "Binary",
    badge: "Axiomatic Logic",
    shortDesc: "Deconstruct into irreducible fundamental truths and rebuild logically",
    fullDesc:
      "Strips away conventional assumptions and industry analogies. Breaks topics down into irreducible foundational axioms, then reconstructs the complete solution step-by-step.",
    whenToUse: "Best for evaluating breakthrough technologies, novel business models, or complex scientific reasoning.",
    cognitiveScience:
      "Eliminates reasoning-by-analogy fallacies by verifying every intermediate premise from empirical ground truth.",
    steps: [
      {
        step: 1,
        title: "Identify Foundational Axioms",
        action: "Strip all industry jargon and list only undeniable physical/logical facts.",
      },
      {
        step: 2,
        title: "Trace the Deduction Chain",
        action: "Build a step-by-step logical chain showing how axioms combine.",
      },
      {
        step: 3,
        title: "Synthesize from Ground Up",
        action: "Reconstruct the system architecture directly from raw principles.",
      },
    ],
    proTip: "Ask 'What is undeniably true here?' to expose hidden legacy assumptions.",
    promptInstruction:
      "DECONSTRUCT FROM FIRST PRINCIPLES: Analyze the document context down to its irreducible fundamental axioms.\n1. Core Fundamental Truths\n2. Logical Deduction Chain\n3. Rebuilt Understanding from ground up.",
    exampleInput: "/firstprinciple",
    exampleOutputSnippet:
      "1. Fundamental Axioms:\n• Any piece of text can be represented as coordinates in high-dimensional geometric space.\n• Geometric distance directly corresponds to semantic similarity.\n\n2. Logical Deduction Chain:\n• If text is converted to vectors, document search becomes a nearest-neighbor geometry problem.\n• High-dimensional indexing structures (HNSW graphs) solve this search in sub-10ms.\n\n3. Ground-Up Synthesis: Vector databases are spatial geometric indexers rather than traditional keyword matchers.",
  },

  // ==========================================
  // 19. ACTIVE RECALL FLASHCARDS
  // ==========================================
  {
    id: "flashcard",
    name: "Active Recall Flashcards",
    slash: "/flashcard",
    aliases: ["/cards", "/deck", "/anki"],
    category: "Testing",
    iconName: "Layers",
    badge: "Active Testing",
    shortDesc: "Generate 5 high-yield Active Recall Q&A cards with mnemonic hooks",
    fullDesc:
      "Extracts the highest-yield distinctions, formulas, and definitions from the material into clear Front/Back retrieval cards primed for spaced repetition.",
    whenToUse: "Perfect for exam preparation, technical certifications, and high-stakes interview prep.",
    cognitiveScience:
      "The Testing Effect proves that retrieving an answer from memory produces significantly stronger synaptic reinforcement than re-reading the answer.",
    steps: [
      {
        step: 1,
        title: "Draft Front Retrieval Prompt",
        action: "Write a challenging question that forces active neural reconstruction.",
      },
      {
        step: 2,
        title: "Formulate Concise Back Answer",
        action: "Provide a crisp, unambiguous answer with key distinctions highlighted.",
      },
      {
        step: 3,
        title: "Attach 1-Sentence Mnemonic Hook",
        action: "Include a memorable sensory anchor on each card for emergency recall.",
      },
    ],
    proTip: "Keep answers under 3 lines so review sessions remain fast and high-frequency.",
    promptInstruction:
      "ACTIVE RECALL FLASHCARDS: Generate 5 high-yield flashcards with:\n- Card #[N]\n- Front / Question: Challenging retrieval prompt\n- Back / Answer: Precise distilled answer\n- Mnemonic Hook: Quick 1-sentence sensory anchor.",
    exampleInput: "/flashcard",
    exampleOutputSnippet:
      "Card 1\n• Front: What is the primary operational difference between Namespaces and Metadata Filtering?\n• Back: Namespaces isolate separate vector indexes entirely; Metadata filters within a single shared index.\n• Mnemonic Hook: Namespaces = Separate Houses; Metadata = Color-coded Room Tags.",
  },

  // ==========================================
  // 20. RETENTION CHALLENGE (QUIZ)
  // ==========================================
  {
    id: "quiz",
    name: "Retention Challenge (Quiz)",
    slash: "/quiz",
    aliases: ["/challenge", "/testme", "/quizme"],
    category: "Testing",
    iconName: "HelpCircle",
    badge: "Conceptual Quiz",
    shortDesc: "3-question retention test with distractor breakdown and explanations",
    fullDesc:
      "Tests deep understanding through challenging conceptual multiple-choice questions. Dissects edge cases and explains why subtle distractors fail.",
    whenToUse: "Use to verify mastery after finishing a chapter or complex technical section.",
    cognitiveScience:
      "Discriminative learning: analyzing why plausible alternatives are incorrect deepens conceptual boundaries in memory.",
    steps: [
      {
        step: 1,
        title: "Conceptual Question Stem",
        action: "Target a core mechanism, trade-off, or failure mode from the document.",
      },
      {
        step: 2,
        title: "Distractor Formulation",
        action: "Create 4 options (A, B, C, D) incorporating common misconceptions.",
      },
      {
        step: 3,
        title: "Detailed Reasoning Breakdown",
        action: "Explain why the correct answer wins and why each distractor is flawed.",
      },
    ],
    proTip: "Attempt to answer the question mentally before looking at options A-D.",
    promptInstruction:
      "INTERACTIVE RETENTION CHALLENGE: Create 3 deep multiple-choice questions testing core concepts from the text. For each: 1. Question stem, 2. Options A-D, 3. Correct Answer, 4. Detailed explanation of why distractors fail, 5. Key takeaway.",
    exampleInput: "/quiz",
    exampleOutputSnippet:
      "Question 1: Which factor limits maximum context window capacity in dense Transformers?\n• A) Vector embedding dimension\n• B) Attention matrix quadratic memory growth (Correct)\n• C) Cosine similarity threshold\n• D) Storage collection depth\n\nExplanation: Self-attention computation scales quadratically (O(N^2)) with token length, consuming GPU VRAM exponentially faster than linear operations.",
  },

  // ==========================================
  // 21. FEYNMAN INTUITION BUILDER
  // ==========================================
  {
    id: "feynman",
    name: "Feynman Intuition Builder",
    slash: "/feynman",
    aliases: ["/simplify", "/eli5", "/plain"],
    category: "Analogy",
    iconName: "Smile",
    badge: "Intuitive Analogy",
    shortDesc: "Explain in plain English with everyday analogies (like I'm 10)",
    fullDesc:
      "Richard Feynman's method: strips away all academic complexity and uses relatable real-life analogies that anyone can immediately visualize.",
    whenToUse: "When introducing complex concepts to non-technical stakeholders or grasping unfamiliar subjects rapidly.",
    cognitiveScience:
      "Analogical mapping transfers structural understanding from familiar everyday domains into complex abstract systems.",
    steps: [
      {
        step: 1,
        title: "Eliminate Technical Jargon",
        action: "Translate specialized buzzwords into plain conversational language.",
      },
      {
        step: 2,
        title: "Find Everyday Physical Analogy",
        action: "Pick a concrete physical metaphor (kitchen recipe, traffic grid, library catalog).",
      },
      {
        step: 3,
        title: "Highlight the 'Aha!' Moment",
        action: "Deliver the simple intuitive insight that makes the concept click instantly.",
      },
    ],
    proTip: "If you cannot explain a concept using simple words, the core mechanism is not yet fully understood.",
    promptInstruction:
      "FEYNMAN TECHNIQUE: Explain this topic without using complex jargon. Use an intuitive real-world analogy (cooking, driving, library) so anyone can grasp the 'aha!' moment in 1-2-3 steps.",
    exampleInput: "/feynman",
    exampleOutputSnippet:
      "The Smoothie Analogy for Cryptographic Hashing:\nImagine throwing strawberries, bananas, and milk into a blender. You get a unique pink smoothie (the hash). Anyone with the recipe can make the exact same smoothie, but nobody on earth can un-blend the smoothie to get the original fruit back!",
  },

  // ==========================================
  // 22. COGNITIVE CONCEPT TREE
  // ==========================================
  {
    id: "mindmap",
    name: "Cognitive Concept Tree",
    slash: "/mindmap",
    aliases: ["/connect", "/tree", "/outline"],
    category: "Structure",
    iconName: "GitFork",
    badge: "Visual Hierarchy",
    shortDesc: "ASCII hierarchy map showing how all ideas interconnect",
    fullDesc:
      "Maps the document into a visual text-based node hierarchy, showing root concepts, primary branches, and leaf evidence.",
    whenToUse: "Best for comprehensive literature reviews, system architectures, and outlining complex documents.",
    cognitiveScience:
      "Hierarchical schema organization enables associative traversal between parent concepts and child details.",
    steps: [
      {
        step: 1,
        title: "Identify Root Node",
        action: "Define the single overarching thesis of the document.",
      },
      {
        step: 2,
        title: "Map Primary Branches",
        action: "Identify the 3-4 major pillars supporting the thesis.",
      },
      {
        step: 3,
        title: "Attach Leaf Evidence",
        action: "Connect formulas, case studies, and citations to each branch.",
      },
    ],
    proTip: "Use concept trees to review big-picture relationships before exams.",
    promptInstruction:
      "COGNITIVE CONCEPT MAP: Generate a clean, structured hierarchical ASCII / Markdown tree map outlining the central thesis, primary branches, supporting concepts, and key inter-relationships.",
    exampleInput: "/mindmap",
    exampleOutputSnippet:
      "[Central Thesis: Semantic Search Architecture]\n├── [Branch 1: Dense Embeddings]\n│    ├── High-Dimensional Geometry\n│    └── Cosine & Dot Product Similarity\n└── [Branch 2: Approximate Nearest Neighbors]\n     ├── HNSW Hierarchical Graphs\n     └── Inverted File Indexing",
  },

  // ==========================================
  // 23. EXECUTIVE 1-PAGE SYNTHESIS
  // ==========================================
  {
    id: "summary",
    name: "Executive 1-Page Synthesis",
    slash: "/summary",
    aliases: ["/tldr", "/brief", "/recap"],
    category: "Structure",
    iconName: "FileCheck",
    badge: "Executive Brief",
    shortDesc: "1-Sentence Thesis, The Big 3 Takeaways, and actionable next steps",
    fullDesc:
      "High-density executive summary focusing strictly on essentials: a 1-sentence core thesis, top 3 findings, and concrete actionable takeaways.",
    whenToUse: "When skimming long reports, executive briefings, or deciding whether to read a full document.",
    cognitiveScience:
      "Information triage prioritizes high-impact executive insights over exhaustive low-priority data.",
    steps: [
      {
        step: 1,
        title: "1-Sentence Thesis",
        action: "Distill the entire document into a single powerful core takeaway.",
      },
      {
        step: 2,
        title: "The Big 3 Takeaways",
        action: "Extract the top 3 highest-impact findings with bulleted data points.",
      },
      {
        step: 3,
        title: "Actionable Next Steps",
        action: "Provide concrete, practical implementation steps.",
      },
    ],
    proTip: "Read the executive summary first before diving into detailed analysis.",
    promptInstruction:
      "EXECUTIVE 1-PAGE SYNTHESIS: Provide a high-density summary containing: 1. Core Thesis (1 sentence), 2. The Big 3 Findings (bullet points with impact), 3. Actionable Takeaways / Next Steps.",
    exampleInput: "/summary",
    exampleOutputSnippet:
      "Core Thesis: Vector databases enable sub-second semantic retrieval across dense embeddings without keyword rigidity.\n\nKey Findings:\n1. Chunk sizes between 500-1000 tokens optimize semantic precision.\n2. Hybrid dense + sparse search outperforms pure vector search by 18%.\n3. Quantization reduces memory footprints by 75% with under 2% recall loss.\n\nActionable Step: Implement HNSW indexing for datasets exceeding 100k vectors.",
  },
];

export function getMatchingCommands(query: string): MemoryCommand[] {
  const cleanQuery = query.toLowerCase().trim();
  if (!cleanQuery || cleanQuery === "/") {
    return MEMORY_COMMANDS;
  }

  const searchTerm = cleanQuery.startsWith("/") ? cleanQuery : `/${cleanQuery}`;

  return MEMORY_COMMANDS.filter((cmd) => {
    if (cmd.slash.startsWith(searchTerm)) return true;
    if (cmd.aliases.some((alias) => alias.startsWith(searchTerm))) return true;
    if (cmd.name.toLowerCase().includes(searchTerm.replace("/", ""))) return true;
    return false;
  });
}

export function detectAndInjectMemoryPrompt(userQuestion: string): {
  processedQuestion: string;
  detectedCommand: MemoryCommand | null;
} {
  const words = userQuestion.trim().split(/\s+/);
  const firstWord = words[0]?.toLowerCase() || "";

  for (const cmd of MEMORY_COMMANDS) {
    if (cmd.slash === firstWord || cmd.aliases.includes(firstWord)) {
      const remainingQuestion = words.slice(1).join(" ").trim();
      const promptToUse =
        remainingQuestion || `Analyze the document using ${cmd.name}.`;

      const augmentedQuestion = `${cmd.promptInstruction}\n\nUser Topic: ${promptToUse}`;
      return {
        processedQuestion: augmentedQuestion,
        detectedCommand: cmd,
      };
    }
  }

  return {
    processedQuestion: userQuestion,
    detectedCommand: null,
  };
}
