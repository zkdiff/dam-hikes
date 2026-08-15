/**
 * DAM HIKES - Authentic Thru-Hike Dataset (2,150 Miles)
 * Daniel Armando Martinez (DAM) - Southbound Pacific Crest Trail
 * Featuring 5 Update Types: Statistics, Title + Words, Title + Voice, Scripture Reading, Kirtan Streaming
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
    quote: "Washington on one bank, Oregon on the other. I only need the Oregon one.",
    photos: [
      { src: "photos/bridge-gods.jpg", alt: "Bridge of the Gods over the Columbia River" },
      { src: "photos/town-waterfront.jpg", alt: "Cascade Locks waterfront in late summer" },
      { src: "photos/river-dusk.jpg", alt: "Columbia River at dusk" }
    ],
    body: `The metal grating vibrates under every passing log truck. Look down through the diamond grid and the Columbia River churns slate-gray and fast two hundred feet below.

Behind me sits Washington and the cold North Cascades. In front of me: the green wall of Oregon, three thousand vertical feet of volcanic basalt rising straight up into the clouds.

I adjust the hip belt, tap the southern terminus sign, and take the first step.`
  },
  {
    id: "columbia-river-scripture",
    date: "2026-08-15",
    dayNumber: 2,
    type: "scripture",
    title: "The River Finds the Low Ground",
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
      source: "Tao Te Ching",
      citation: "Chapter 8",
      transliteration: "Shang shan ruo shui. Shui shan li wan wu er bu zheng, chu zhong ren zhi suo wu, gu ji yu dao.",
      translation: "The supreme good is like water, which nourishes all things without trying to. It is content with the low places that people disdain. Thus it is like the Tao.",
      purport: "Climbing out of the gorge with a full food carry, my instinct was to fight the gradient. But watching the creek drop effortlessly through the canyon showed me the rhythm of walking: yield to the grade, stay supple in the knees, let gravity do what it will while the breath stays calm."
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
    quote: "Hood is the first mountain I have to walk around. After that the trail is a long green cathedral.",
    photos: [
      { src: "photos/mt-hood.jpg", alt: "Mount Hood peak emerging above the fir canopy" },
      { src: "photos/canopy.jpg", alt: "Dense old-growth Douglas fir canopy with filtered morning light" }
    ],
    body: `The firs here are four hundred years old. Their needles muffle footsteps until the only sound is the rhythmic slide of nylon shorts and the tap of carbon trekking pole tips on soft loam.

Through a break in the canopy, Mount Hood looms white and massive. It feels impossible that in four days I will be on the opposite side looking back at its southern glaciers.`
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
    title: "Trance by Intelligence Under Mount Jefferson",
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
      source: "Bhagavad Gita",
      citation: "Chapter 6, Verse 25",
      transliteration: "śanaiḥ śanair uparamed buddhyā dhṛti-gṛhītayā / ātma-saṁsthaṁ manaḥ kṛtvā na kiñcid api cintayet",
      translation: "Gradually, step by step, one should become situated in trance by means of intelligence sustained by full conviction, and thus the mind should be fixed on the Self alone and should think of nothing else.",
      purport: "Sitting by Scout Lake at dawn with Mount Jefferson reflected like polished glass on the water. 'Śanaiḥ śanaiḥ' — step by step. Thru-hiking is not conquered in great leaps; it is 2,150 miles of single conscious steps. When the mind wants to rush forward to the Sierra, the verse pulls consciousness back to this immediate footfall."
    }
  },
  {
    id: "dusk-kirtan-river",
    date: "2026-09-02",
    dayNumber: 20,
    type: "kirtan",
    title: "Radhe Govinda & Campfire Japa at North Santiam",
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
      mantra: "Hare Krishna Hare Krishna Krishna Krishna Hare Hare\nHare Rama Hare Rama Rama Rama Hare Hare\n\nRadhe Govinda Radhe Gopal\nShri Krishna Govinda Hare Murare",
      translation: "O Lord, O Energy of the Lord, please engage me in Your devotional service. O protector of cows, O reservoir of all transcendental pleasure.",
      ragaOrMood: "Bhairavi Evening Meditation · Acoustic drone by the running stream"
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
    quote: "The whole mountain is razor-sharp black mirror. Every step sounds like broken china.",
    photos: [
      { src: "photos/canopy.jpg", alt: "Obsidian flakes glistening along the rocky trail" }
    ],
    body: `Tens of thousands of years ago, a rhyolite lava flow cooled so quickly the silica formed natural volcanic glass instead of crystalline rock.

Today the trail climbs right through the black flows. Black razor fragments chime beneath the Vibram soles of my Altras like stepping on shattered cathedral stained glass.`
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
    title: "Steadiness in the Storm Under Granite Spires",
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
      source: "Bhagavad Gita",
      citation: "Chapter 2, Verse 70",
      transliteration: "āpūryamāṇam acala-pratiṣṭhaṁ samudram āpaḥ praviśanti yadvat / tadvat kāmā yaṁ praviśanti sarve sa śāntim āpnoti na kāma-kāmī",
      translation: "A person who is not disturbed by the incessant flow of desires — that enter like rivers into the ocean, which is ever being filled but is always still — can alone achieve peace, and not the man who strives to satisfy such desires.",
      purport: "Watching storm clouds swirl around the 6,000-foot granite horn of Castle Dome. Rain lashed the tent for four hours, but the bedrock beneath never trembled. The verse teaches that true peace is not the absence of external storms, but internal anchor in the unmoving consciousness."
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
    quote: "Desolation is a misnomer. There are a thousand tiny granite archipelagos here, each with its own dwarf juniper.",
    photos: [
      { src: "photos/river-dusk.jpg", alt: "Glacial lake with dozens of white granite islands under clear sky" }
    ],
    body: `The trail here is pure white granodiorite scoured smooth by Pleistocene ice sheets.

At sunset, the lake becomes a shallow basin of molten copper. I pitch the tent on a flat slab of granite anchored by four heavy stones instead of stakes, watching the reflection of Pyramid Peak turn violet in the freezing air.`
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
      mantra: "Hare Krishna Hare Krishna Krishna Krishna Hare Hare\nHare Rama Hare Rama Rama Rama Hare Hare",
      translation: "O all-attractive Supreme Lord, O spiritual energy of devotion, please connect me in loving service to all living beings.",
      ragaOrMood: "Raga Bhupali · Morning stillness at 9,800 ft as the first pink alpenglow touches Banner Peak"
    }
  },
  {
    id: "muir-pass-scripture",
    date: "2026-10-24",
    dayNumber: 72,
    type: "scripture",
    title: "Duty Without Attachment at Muir Pass Hut",
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
      source: "Bhagavad Gita",
      citation: "Chapter 2, Verse 47",
      transliteration: "karmaṇy evādhikāras te mā phaleṣu kadācana / mā karma-phala-hetur bhūr mā te saṅgo 'stvakarmaṇi",
      translation: "You have a right to perform your prescribed duty, but you are not entitled to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty.",
      purport: "Climbing through frozen talus up to 12,000 feet in freezing sleet. If you hike for the 'reward' of comfort, you will quit in twenty minutes. When you hike simply as pure duty — step following step without resentment or expectation — the stone shelter appears like a palace built by grace."
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
    quote: "Giant three-bladed white monoliths sweeping the sky with a low, deep aerodynamic thrum.",
    photos: [
      { src: "photos/canopy.jpg", alt: "Endless rows of giant white wind turbines spanning golden desert hills" }
    ],
    body: `Walking out of the high mountains and into the Mojave borderlands is a shock to the senses.

The wind here blows a relentless 40 miles per hour. Hundreds of wind turbines stand like guardian giants on the ridges, their carbon fiber blades spinning in synchronized harmony, generating clean power while we grind out desert miles.`
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
    quote: "Sharply angled yellow slabs thrusting 150 feet out of the desert floor.",
    photos: [
      { src: "photos/town-waterfront.jpg", alt: "Dramatic jagged sandstone formations angled toward the sky" }
    ],
    body: `These geologic rock formations were created by the San Andreas Fault Zone over 25 million years of tectonic compression.

Walking through the narrow sand washes between the tilted slabs feels like wandering through the set of an ancient sci-fi film. The desert sun is warm on the shoulders.`
  },
  {
    id: "mount-laguna-kirtan",
    date: "2026-11-22",
    dayNumber: 101,
    type: "kirtan",
    title: "Pacific Ocean Horizon & Gratitude Kirtan",
    location: "Mount Laguna Pine Ridge, CA",
    mile: 42.0,
    soboMile: 2108.0,
    section: "socal",
    elevationFt: 5900,
    category: "reflection",
    photos: [
      { src: "photos/river-dusk.jpg", alt: "Golden sunset over the coastal mountains looking toward the Pacific" }
    ],
    kirtan: {
      streamUrl: "laguna-sunset-stream",
      artist: "DAM & The Open Sky",
      mantra: "Govinda Jaya Jaya Gopala Jaya Jaya\nRadha Ramana Hari Govinda Jaya Jaya\n\nHare Krishna Hare Krishna Krishna Krishna Hare Hare\nHare Rama Hare Rama Rama Rama Hare Hare",
      translation: "All glories to Govinda, the giver of pleasure! All glories to Gopala, the protector of all souls!",
      ragaOrMood: "Raga Yaman Sunset Chant · Pine scent and Pacific ocean sea breeze 40 miles from the Mexican border"
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
    quote: "The border fence stands tall in the desert sun. 2,150 miles from the Bridge of the Gods, the southbound journey rests.",
    photos: [
      { src: "photos/bridge-gods.jpg", alt: "The wooden five-column Southern Terminus monument at the border wall" },
      { src: "photos/trail-post.jpg", alt: "Daniel's hands resting on the final wooden monument marker" }
    ],
    body: `One hundred and four days ago, I stepped off the metal grating of the Bridge of the Gods into Oregon.

Through the rain of the Columbia Gorge, the volcanic fields of the Three Sisters, the granite spires of the High Sierra at 13,200 feet, and the long Mojave night hikes — every single step brought me to this wooden monument.

I place both hands against the cedar post, close my eyes, and say a prayer of profound gratitude for the trail, the mountains, and the strength that carried me.`
  }
];
