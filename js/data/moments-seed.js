/**
 * DAM HIKES - Authentic Thru-Hike Dataset (2,150 Miles)
 * Daniel Armando Martinez (DAM) - Southbound Pacific Crest Trail
 * 
 * Scripture Sources Exclusively From: https://prabhupadabooks.com/
 * (Bhagavad-gītā As It Is, Śrī Īśopaniṣad, and Authorized BBT Works by A.C. Bhaktivedanta Swami Prabhupada)
 * 
 * Title + Words entries are kept direct, evocative, and punchy.
 */

export const MOMENTS_SEED = [
  {
    id: "the-gorge",
    date: "2026-08-14",
    dayNumber: 1,
    type: "words",
    title: "Bridge of the Gods: The Southbound Step",
    location: "Cascade Locks, OR",
    mile: 2150.0,
    soboMile: 0.0,
    section: "oregon",
    elevationFt: 180,
    category: "milestone",
    photos: [
      { src: "photos/bridge-gods.jpg", alt: "Bridge of the Gods over the Columbia River" },
      { src: "photos/town-waterfront.jpg", alt: "Cascade Locks waterfront in late summer" }
    ],
    body: "Washington on one bank, Oregon on the other. Look down through the diamond steel grating and the river churns two hundred feet below. I only need the southern bank."
  },
  {
    id: "columbia-river-scripture",
    date: "2026-08-15",
    dayNumber: 2,
    type: "scripture",
    title: "Accepting One's Quota on the Trail",
    location: "Eagle Creek Junction, OR",
    mile: 2142.0,
    soboMile: 8.0,
    section: "oregon",
    elevationFt: 1420,
    category: "reflection",
    photos: [
      { src: "photos/river-dusk.jpg", alt: "Misty river gorge flowing over smooth river stones" }
    ],
    scripture: {
      source: "Śrī Īśopaniṣad",
      citation: "Mantra 1",
      transliteration: "īśāvāsyam idaṁ sarvaṁ yat kiñca jagatyāṁ jagat / tena tyaktena bhuñjīthā mā gṛdhaḥ kasya svid dhanam",
      translation: "Everything animate or inanimate that is within the universe is controlled and owned by the Lord. One should therefore accept only those things necessary for himself, which are set aside as his quota, and one should not accept other things, knowing well to whom they belong.",
      purport: "The root of all trouble is that man claims proprietary rights over the resources of nature. God is the proprietor of everything, and human beings are entitled only to the necessities of life allotted to them by the Lord. The arrangement of the Lord is that we should be satisfied with those things that have been kindly set aside for us by Him."
    }
  },
  {
    id: "looking-south",
    date: "2026-08-17",
    dayNumber: 4,
    type: "words",
    title: "Looking South Through the Green Hallway",
    location: "Mt Hood Wilderness, OR",
    mile: 2128.0,
    soboMile: 22.0,
    section: "oregon",
    elevationFt: 3400,
    category: "reflection",
    photos: [
      { src: "photos/mt-hood.jpg", alt: "Mount Hood peak emerging above the fir canopy" },
      { src: "photos/canopy.jpg", alt: "Dense old-growth Douglas fir canopy with filtered morning light" }
    ],
    body: "Hood is the first mountain I have to walk around. After that the trail is a long green cathedral."
  },
  {
    id: "hood-rim-voice",
    date: "2026-08-19",
    dayNumber: 6,
    type: "voice",
    title: "Wind and Glacial Melt at Timberline Ridge",
    location: "Timberline Trail, OR",
    mile: 2098.5,
    soboMile: 51.5,
    section: "oregon",
    elevationFt: 6020,
    category: "campsite",
    photos: [
      { src: "photos/gorge-trail.jpg", alt: "Alpine ridge trail overlooking glacial canyon" }
    ],
    voice: {
      audioSrc: "ambient-ridge-wind",
      duration: "02:44",
      transcript: "It's 6:15 in the evening... just crested the ridge above the Zigzag canyon. You can hear the roar of the glacial runoff below. The wind is whipping off the Palmer Snowfield, probably 45 degrees right now. Setting up the X-Mid on sandy pumice before the temperature drops into the thirties."
    }
  },
  {
    id: "timberline-waffles",
    date: "2026-08-20",
    dayNumber: 7,
    type: "statistics",
    title: "Timberline Lodge Resupply & Breakfast Push",
    location: "Timberline Lodge, OR",
    mile: 2095.0,
    soboMile: 55.0,
    section: "oregon",
    elevationFt: 6000,
    category: "resupply",
    photos: [
      { src: "photos/pack-table.jpg", alt: "Backpack rested against the stone foundation of Timberline Lodge" }
    ],
    metrics: {
      tempF: 52,
      condition: "Alpine Morning Sun",
      waterSource: "Timberline Lodge water tap",
      packWeightLbs: 26.5,
      dayMileage: 24.5,
      ascentFt: 3850,
      descentFt: 1920,
      movingTime: "6h 45m",
      gearNotes: "Resupplied with 5 days oats, peanut butter, tortillas, and electrolyte tabs."
    }
  },
  {
    id: "jefferson-park-gita",
    date: "2026-08-26",
    dayNumber: 13,
    type: "scripture",
    title: "Step by Step with Fixed Conviction",
    location: "Jefferson Park, OR",
    mile: 2045.0,
    soboMile: 105.0,
    section: "oregon",
    elevationFt: 5800,
    category: "reflection",
    photos: [
      { src: "photos/hiker-back.jpg", alt: "Hiker sitting in meditation on a granite boulder facing alpine lake" }
    ],
    scripture: {
      source: "Bhagavad-gītā As It Is",
      citation: "Chapter 6, Verse 25",
      transliteration: "śanaiḥ śanair uparamed buddhyā dhṛti-gṛhītayā / ātma-saṁsthaṁ manaḥ kṛtvā na kiñcid api cintayet",
      translation: "Gradually, step by step, one should become situated in trance by means of intelligence sustained by full conviction, and thus the mind should be fixed on the Self alone and should think of nothing else.",
      purport: "By proper conviction and intelligence one should gradually cease sense activities. This is called pratyāhāra. The mind, being restrained from all sense activities, should be fixed in trance, thinking of nothing else. In yoga practice, the mind is controlled by determination and intelligence and is situated in the Self."
    }
  },
  {
    id: "dusk-kirtan-river",
    date: "2026-09-02",
    dayNumber: 20,
    type: "kirtan",
    title: "Maha-Mantra & Campfire Japa at North Santiam",
    location: "North Santiam River, OR",
    mile: 2005.2,
    soboMile: 144.8,
    section: "oregon",
    elevationFt: 3620,
    category: "reflection",
    photos: [
      { src: "photos/river-dusk.jpg", alt: "Golden evening light filtering through pines onto river pebbles" }
    ],
    kirtan: {
      streamUrl: "kirtan-santiam-stream",
      artist: "DAM & Trail Sangha",
      mantra: "Hare Kṛṣṇa, Hare Kṛṣṇa, Kṛṣṇa Kṛṣṇa, Hare Hare\nHare Rāma, Hare Rāma, Rāma Rāma, Hare Hare",
      translation: "O all-attractive Supreme Lord, O spiritual energy of the Lord (Harā), please engage me in Your transcendental loving service.",
      ragaOrMood: "Evening Japa Meditation · Acoustic drone by the running mountain stream"
    }
  },
  {
    id: "obsidian-glass",
    date: "2026-09-08",
    dayNumber: 26,
    type: "words",
    title: "Walking Over Volcanic Glass",
    location: "Obsidian Limited Entry Area, OR",
    mile: 1980.0,
    soboMile: 170.0,
    section: "oregon",
    elevationFt: 6200,
    category: "milestone",
    photos: [
      { src: "photos/canopy.jpg", alt: "Obsidian flakes glistening along the rocky trail" }
    ],
    body: "The entire mountain is razor-sharp black volcanic mirror. Every step chimes beneath the Vibram soles like walking across shattered cathedral stained glass."
  },
  {
    id: "crater-lake-voice",
    date: "2026-09-14",
    dayNumber: 32,
    type: "voice",
    title: "Wind Over the Caldera Rim at Dusk",
    location: "Crater Lake Caldera Rim, OR",
    mile: 1845.2,
    soboMile: 304.8,
    section: "oregon",
    elevationFt: 7100,
    category: "campsite",
    photos: [
      { src: "photos/gorge-trail.jpg", alt: "Deep indigo waters of Crater Lake enclosed in sheer caldera cliffs" }
    ],
    voice: {
      audioSrc: "crater-lake-wind",
      duration: "03:12",
      transcript: "Looking straight down into two thousand feet of sheer cobalt blue... There are no incoming rivers; this is purely trapped rain and melted snow over thousands of years. The wind is picking up from the southwest. Wizard Island looks like a toy in a giant bowl of sapphire ink."
    }
  },
  {
    id: "california-border-stats",
    date: "2026-09-24",
    dayNumber: 42,
    type: "statistics",
    title: "Mile 1691.7: Oregon Complete, California Bound",
    location: "Oregon / California Border",
    mile: 1691.7,
    soboMile: 458.3,
    section: "norcal",
    elevationFt: 4500,
    category: "milestone",
    photos: [
      { src: "photos/trail-post.jpg", alt: "Wooden state line marker nailed to a cedar tree" }
    ],
    metrics: {
      tempF: 62,
      condition: "Crisp High Elevation Sun",
      waterSource: "Cook & Green Spring",
      packWeightLbs: 24.0,
      dayMileage: 28.2,
      ascentFt: 4620,
      descentFt: 3950,
      movingTime: "7h 35m",
      gearNotes: "Replaced worn Darn Tough socks. Shoes have 458 miles, tread holding strong."
    }
  },
  {
    id: "marble-mountain-bear",
    date: "2026-09-29",
    dayNumber: 47,
    type: "voice",
    title: "Black Bear Encounter in Marble Valley",
    location: "Marble Mountain Wilderness, CA",
    mile: 1620.0,
    soboMile: 530.0,
    section: "norcal",
    elevationFt: 5400,
    category: "wildlife",
    photos: [
      { src: "photos/canopy.jpg", alt: "Marble Mountain valley meadow surrounded by white marble outcrops" }
    ],
    voice: {
      audioSrc: "marble-bear-dispatch",
      duration: "01:58",
      transcript: "Just had a big cinnamon-phase black bear cross the trail maybe forty yards ahead of me in the huckleberry patches. Stood up on his hind legs, sniffed the wind, gave me a calm look, and ambled down into the creek drainage. Heart is pounding, but what a majestic creature."
    }
  },
  {
    id: "castle-crags-gita",
    date: "2026-10-04",
    dayNumber: 52,
    type: "scripture",
    title: "Unshakable Like the Ocean Amidst the Storm",
    location: "Castle Crags Granite Ridge, CA",
    mile: 1500.0,
    soboMile: 650.0,
    section: "norcal",
    elevationFt: 5800,
    category: "reflection",
    photos: [
      { src: "photos/mt-hood.jpg", alt: "Sheer granite towers of Castle Crags rising dramatically against thunderheads" }
    ],
    scripture: {
      source: "Bhagavad-gītā As It Is",
      citation: "Chapter 2, Verse 70",
      transliteration: "āpūryamāṇam acala-pratiṣṭhaṁ samudram āpaḥ praviśanti yadvat / tadvat kāmā yaṁ praviśanti sarve sa śāntim āpnoti na kāma-kāmī",
      translation: "A person who is not disturbed by the incessant flow of desires — that enter like rivers into the ocean, which is ever being filled but is always still — can alone achieve peace, and not the man who strives to satisfy such desires.",
      purport: "Although the vast ocean is always filled with water, it is continually being filled by rivers, yet the ocean remains steady; it is not agitated. Similarly, a person fixed in Kṛṣṇa consciousness is never agitated by the flow of desires. A Kṛṣṇa conscious person does not strive to satisfy desires, yet he is never lacking anything because he is satisfied in Kṛṣṇa."
    }
  },
  {
    id: "hat-creek-stats",
    date: "2026-10-09",
    dayNumber: 57,
    type: "statistics",
    title: "Hat Creek Rim: 29-Mile Waterless Furnace",
    location: "Hat Creek Rim, CA",
    mile: 1400.0,
    soboMile: 750.0,
    section: "norcal",
    elevationFt: 4600,
    category: "hardship",
    photos: [
      { src: "photos/pack-table.jpg", alt: "6 liters of water bottles strapped to backpack harness" }
    ],
    metrics: {
      tempF: 89,
      condition: "Dry Scorching Desert Wind",
      waterSource: "Cache 22 (carried 6.5 Liters from Subway Cave)",
      packWeightLbs: 33.5,
      dayMileage: 29.4,
      ascentFt: 2150,
      descentFt: 2800,
      movingTime: "8h 15m",
      gearNotes: "Carried extra 2L CNOC bladder. Total water carry: 14.3 lbs."
    }
  },
  {
    id: "lake-aloha",
    date: "2026-10-15",
    dayNumber: 63,
    type: "words",
    title: "Granite Islands in the Desolation Wilderness",
    location: "Desolation Wilderness, CA",
    mile: 1100.0,
    soboMile: 1050.0,
    section: "sierra",
    elevationFt: 8100,
    category: "campsite",
    photos: [
      { src: "photos/river-dusk.jpg", alt: "Glacial lake with dozens of white granite islands under clear sky" }
    ],
    body: "Desolation is a misnomer. There are a thousand tiny white granite archipelagos here, each holding its own solitary dwarf juniper against the sky."
  },
  {
    id: "thousand-island-kirtan",
    date: "2026-10-20",
    dayNumber: 68,
    type: "kirtan",
    title: "Dawn Maha-Mantra Before Banner Peak",
    location: "Thousand Island Lake, CA",
    mile: 920.0,
    soboMile: 1230.0,
    section: "sierra",
    elevationFt: 9830,
    category: "reflection",
    photos: [
      { src: "photos/mt-hood.jpg", alt: "Jagged needle of Banner Peak mirrored perfectly in still alpine waters" }
    ],
    kirtan: {
      streamUrl: "thousand-island-dawn",
      artist: "DAM & Mountain Solitude",
      mantra: "Hare Kṛṣṇa, Hare Kṛṣṇa, Kṛṣṇa Kṛṣṇa, Hare Hare\nHare Rāma, Hare Rāma, Rāma Rāma, Hare Hare",
      translation: "O all-attractive Supreme Lord, O spiritual energy of devotion, please connect me in loving service to all living beings.",
      ragaOrMood: "Rāga Bhūpālī · Morning stillness at 9,800 ft as the first pink alpenglow touches Banner Peak"
    }
  },
  {
    id: "muir-pass-scripture",
    date: "2026-10-24",
    dayNumber: 72,
    type: "scripture",
    title: "Duty Without Attachment to the Fruits",
    location: "Muir Pass Stone Shelter, CA",
    mile: 838.0,
    soboMile: 1312.0,
    section: "sierra",
    elevationFt: 11955,
    category: "milestone",
    photos: [
      { src: "photos/trail-post.jpg", alt: "Historic stone dome hut built by the Sierra Club at nearly 12,000 feet" }
    ],
    scripture: {
      source: "Bhagavad-gītā As It Is",
      citation: "Chapter 2, Verse 47",
      transliteration: "karmaṇy evādhikāras te mā phaleṣu kadācana / mā karma-phala-hetur bhūr mā te saṅgo 'stvakarmaṇi",
      translation: "You have a right to perform your prescribed duty, but you are not entitled to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty.",
      purport: "The Lord advised that Arjuna should perform his prescribed duty without attachment to the result. One who is attached to the result of his work is also the cause of the action, and is thus the enjoyer or sufferer of the result of such action."
    }
  },
  {
    id: "forester-pass-stats",
    date: "2026-10-28",
    dayNumber: 76,
    type: "statistics",
    title: "Forester Pass Zenith: Highest Point on the PCT",
    location: "Forester Pass Summit, CA",
    mile: 779.5,
    soboMile: 1370.5,
    section: "sierra",
    elevationFt: 13200,
    category: "milestone",
    photos: [
      { src: "photos/mt-hood.jpg", alt: "The narrow notch blasted into the granite wall at 13,200 feet" }
    ],
    metrics: {
      tempF: 28,
      condition: "Freezing Alpine Gale & Light Flurries",
      waterSource: "Frozen tarns (melted snow on stove)",
      packWeightLbs: 28.5,
      dayMileage: 21.4,
      ascentFt: 4820,
      descentFt: 2150,
      movingTime: "7h 42m",
      gearNotes: "Microspikes used on north chute switchbacks. Ice axe carried across Kings-Kern divide."
    }
  },
  {
    id: "forester-pass-voice",
    date: "2026-10-28",
    dayNumber: 76,
    type: "voice",
    title: "Summit Dispatch from 13,200 Feet",
    location: "Forester Pass Summit, CA",
    mile: 779.5,
    soboMile: 1370.5,
    section: "sierra",
    elevationFt: 13200,
    category: "milestone",
    photos: [
      { src: "photos/gorge-trail.jpg", alt: "Looking south into the vast Kern River basin from the 13,200 foot summit" }
    ],
    voice: {
      audioSrc: "forester-summit-voice",
      duration: "02:18",
      transcript: "Standing on the crest... 13,200 feet. The highest point on the entire 2,150 miles. To the north is the frozen Kings Canyon watershed we climbed all morning; to the south is the massive expanse of the Kern Canyon opening into sunny granite basins. Fingers are numb, but the spirit is soaring."
    }
  },
  {
    id: "tehachapi-words",
    date: "2026-11-06",
    dayNumber: 85,
    type: "words",
    title: "The Singing Wind Turbines of Tehachapi",
    location: "Tehachapi Wind Pass, CA",
    mile: 566.0,
    soboMile: 1584.0,
    section: "socal",
    elevationFt: 4100,
    category: "reflection",
    photos: [
      { src: "photos/canopy.jpg", alt: "Endless rows of giant white wind turbines spanning golden desert hills" }
    ],
    body: "Giant three-bladed white monoliths sweeping the desert sky with a low, deep aerodynamic thrum that vibrates straight through the trekking poles."
  },
  {
    id: "la-aqueduct-stats",
    date: "2026-11-10",
    dayNumber: 89,
    type: "statistics",
    title: "LA Aqueduct Night Hike: Concrete in the Moonlight",
    location: "Mojave Desert Basin, CA",
    mile: 518.0,
    soboMile: 1632.0,
    section: "socal",
    elevationFt: 2900,
    category: "hardship",
    photos: [
      { src: "photos/pack-table.jpg", alt: "Red headlamp beam illuminating the steel pipe of the Los Angeles Aqueduct" }
    ],
    metrics: {
      tempF: 44,
      condition: "Starry Mojave Desert Night",
      waterSource: "Hikertown faucet (next water 24 miles)",
      packWeightLbs: 23.5,
      dayMileage: 34.8,
      ascentFt: 620,
      descentFt: 850,
      movingTime: "9h 10m",
      gearNotes: "Night hike to escape 95°F daytime heat. Headlamp ran on low for 6 hours."
    }
  },
  {
    id: "vasquez-rocks-words",
    date: "2026-11-15",
    dayNumber: 94,
    type: "words",
    title: "Tilted Sandstone of Vasquez Rocks",
    location: "Vasquez Rocks Natural Area, CA",
    mile: 451.0,
    soboMile: 1699.0,
    section: "socal",
    elevationFt: 2600,
    category: "milestone",
    photos: [
      { src: "photos/town-waterfront.jpg", alt: "Dramatic jagged sandstone formations angled toward the sky" }
    ],
    body: "Sharply angled yellow sandstone slabs thrusting 150 feet out of the Mojave floor, carved by 25 million years of tectonic faulting."
  },
  {
    id: "mount-laguna-scripture",
    date: "2026-11-22",
    dayNumber: 101,
    type: "scripture",
    title: "Carrying What They Lack & Preserving What They Have",
    location: "Mount Laguna Pine Ridge, CA",
    mile: 42.0,
    soboMile: 2108.0,
    section: "socal",
    elevationFt: 5900,
    category: "reflection",
    photos: [
      { src: "photos/river-dusk.jpg", alt: "Golden sunset over the coastal mountains looking toward the Pacific" }
    ],
    scripture: {
      source: "Bhagavad-gītā As It Is",
      citation: "Chapter 9, Verse 22",
      transliteration: "ananyāś cintayanto māṁ ye janāḥ paryupāsate / teṣāṁ nityābhiyuktānāṁ yoga-kṣemaṁ vahāmy aham",
      translation: "But those who always worship Me with exclusive devotion, meditating on My transcendental form — to them I carry what they lack, and I preserve what they have.",
      purport: "One who is unable to live for a moment without Kṛṣṇa consciousness cannot think of anything else. Twenty-four hours a day, he is engaged in Kṛṣṇa consciousness by chanting, hearing, remembering and offering prayers. The Lord helps such a devotee to achieve Kṛṣṇa consciousness by yoga, and when he becomes fully situated, the Lord protects him from falling down (kṣema)."
    }
  },
  {
    id: "campo-terminus",
    date: "2026-11-25",
    dayNumber: 104,
    type: "words",
    title: "Campo Southern Terminus: 2,150 Miles Complete",
    location: "Campo, CA (US / Mexico Border)",
    mile: 0.0,
    soboMile: 2150.0,
    section: "socal",
    elevationFt: 2900,
    category: "milestone",
    photos: [
      { src: "photos/bridge-gods.jpg", alt: "The wooden five-column Southern Terminus monument at the border wall" },
      { src: "photos/trail-post.jpg", alt: "Daniel's hands resting on the final wooden monument marker" }
    ],
    body: "2,150 miles from the Bridge of the Gods, both hands rest against the cedar monument at the border wall. The southbound journey rests."
  }
];
