// Regional Design System Themes & Assets for North-East States
export const REGIONAL_THEMES = {
  Assam: {
    name: 'Assam',
    primary: '#BA7517', // Ochre
    secondary: '#3B6D11', // Tea Green
    accent: '#993C1D', // Maroon Accent
    background: '#F9F7F2',
    borderStyle: 'border-t-8 border-[#993C1D]',
    borderPattern: 'repeating-linear-gradient(45deg, #993C1D, #993C1D 10px, #ffffff 10px, #ffffff 20px)',
    localLang: 'Assamese (অসমীয়া)',
    greeting: 'নমস্কাৰ (Nomoskar)',
    motifs: ['🍃 Tea Leaves', '🦏 One-Horned Rhino', '⛵ Brahmaputra Boat', '🥁 Bihu Dhol', '👒 Bamboo Jaapi'],
    gameItems: [
      { id: '1', name: 'Assam Jaapi', symbol: '👒', prompt: 'Assam Traditional Bamboo Jaapi' },
      { id: '2', name: 'Kaziranga Rhino', symbol: '🦏', prompt: 'Kaziranga One-horned Rhino' },
      { id: '3', name: 'Tea Garden', symbol: '🍃', prompt: 'Assam Tea Leaves' },
      { id: '4', name: 'Bihu Dhol', symbol: '🥁', prompt: 'Assam Bihu Drum' }
    ]
  },
  Manipur: {
    name: 'Manipur',
    primary: '#A32D2D', // Deep Red
    secondary: '#2C2C2A', // Black
    accent: '#ffffff', // White Accent
    background: '#FBF8F8',
    borderStyle: 'border-t-8 border-[#A32D2D]',
    borderPattern: 'repeating-linear-gradient(90deg, #A32D2D, #A32D2D 15px, #2C2C2A 15px, #2C2C2A 30px)',
    localLang: 'Meiteilon / Manipuri (মৈতৈলোন্)',
    greeting: 'খুরুমজরী (Khurumjari)',
    motifs: ['🌺 Shirui Lily', '💃 Ras Lila Dance', '🏰 Kangla Fort', '🎋 Bamboo Crafts', '🛶 Loktak Phumdi'],
    gameItems: [
      { id: '1', name: 'Shirui Lily', symbol: '🌺', prompt: 'Rare Shirui Lily Flower' },
      { id: '2', name: 'Ras Lila Dancer', symbol: '💃', prompt: 'Manipuri Classical Dance' },
      { id: '3', name: 'Kangla Fort', symbol: '🏰', prompt: 'Historic Kangla Fort' },
      { id: '4', name: 'Innaphi Shawl', symbol: '🧣', prompt: 'Handwoven Innaphi Shawl' }
    ]
  },
  Meghalaya: {
    name: 'Meghalaya',
    primary: '#27500A', // Forest Green
    secondary: '#5F5E5A', // Misty Blue-Gray
    accent: '#ffffff',
    background: '#F6F8F5',
    borderStyle: 'border-t-8 border-[#27500A]',
    borderPattern: 'repeating-linear-gradient(135deg, #27500A, #27500A 12px, #5F5E5A 12px, #5F5E5A 24px)',
    localLang: 'Khasi / Garo',
    greeting: 'Khublei (Greetings)',
    motifs: ['🌿 Living Root Bridge', '🌧 Cherrapunji Rain', '🌂 Knup Umbrella', '🌲 Pine Forest', '🍯 Honeycomb'],
    gameItems: [
      { id: '1', name: 'Root Bridge', symbol: '🌿', prompt: 'Living Root Bridge' },
      { id: '2', name: 'Knup Umbrella', symbol: '🌂', prompt: 'Traditional Knup Bamboo Shield' },
      { id: '3', name: 'Cherrapunji Rain', symbol: '🌧', prompt: 'Mawsynram Waterfalls' },
      { id: '4', name: 'Pine Forest', symbol: '🌲', prompt: 'Shillong Pine Trees' }
    ]
  },
  Nagaland: {
    name: 'Nagaland',
    primary: '#A32D2D', // Red
    secondary: '#2C2C2A', // Black
    accent: '#FAC775', // Yellow-Gold
    background: '#FAF8F5',
    borderStyle: 'border-t-8 border-[#2C2C2A]',
    borderPattern: 'repeating-linear-gradient(90deg, #2C2C2A, #2C2C2A 10px, #A32D2D 10px, #A32D2D 20px, #FAC775 20px, #FAC775 30px)',
    localLang: 'Nagamese / Ao',
    greeting: 'Imsuren (Welcome)',
    motifs: ['🦅 Hornbill Bird', '🪵 Log Drum', '🐂 Mithun Animal', '🧺 Tribal Basket', '🧣 Ao Shawl'],
    gameItems: [
      { id: '1', name: 'Hornbill Bird', symbol: '🦅', prompt: 'Great Hornbill Feathers' },
      { id: '2', name: 'Mithun Animal', symbol: '🐂', prompt: 'State Animal Mithun' },
      { id: '3', name: 'Naga Log Drum', symbol: '🪵', prompt: 'Traditional Village Log Drum' },
      { id: '4', name: 'Woven Basket', symbol: '🧺', prompt: 'Handcrafted Cane Basket' }
    ]
  },
  Tripura: {
    name: 'Tripura',
    primary: '#993C1D', // Deep Red
    secondary: '#FAC775', // Gold
    accent: '#ffffff',
    background: '#FAF6F4',
    borderStyle: 'border-t-8 border-[#993C1D]',
    borderPattern: 'repeating-linear-gradient(45deg, #993C1D, #993C1D 12px, #FAC775 12px, #FAC775 24px)',
    localLang: 'Kokborok (ককবরক)',
    greeting: 'Khulumkha (Hello)',
    motifs: ['🏰 Ujjayanta Palace', '🪆 Garia Doll', '🪵 Cane Furniture', '🧣 Risa Textile'],
    gameItems: [
      { id: '1', name: 'Ujjayanta Palace', symbol: '🏰', prompt: 'Royal Ujjayanta Palace' },
      { id: '2', name: 'Garia Doll', symbol: '🪆', prompt: 'Festival Garia Doll' },
      { id: '3', name: 'Risa Textile', symbol: '🧣', prompt: 'Traditional Risa Fabric' },
      { id: '4', name: 'Cane Chair', symbol: '🪑', prompt: 'Tripura Cane Handicraft' }
    ]
  },
  Mizoram: {
    name: 'Mizoram',
    primary: '#A32D2D', // Red
    secondary: '#2C2C2A', // Black
    accent: '#ffffff',
    background: '#FAF7F7',
    borderStyle: 'border-t-8 border-[#A32D2D]',
    borderPattern: 'repeating-linear-gradient(90deg, #A32D2D, #A32D2D 10px, #ffffff 10px, #ffffff 15px, #2C2C2A 15px, #2C2C2A 25px)',
    localLang: 'Mizo (Mizo ṭawng)',
    greeting: 'Chibai (Warm Greetings)',
    motifs: ['🎋 Cheraw Bamboo Dance', '🎋 Bamboo Grove', '🪶 Hornbill Feather', '🧣 Puanchei Wrap'],
    gameItems: [
      { id: '1', name: 'Cheraw Dance', symbol: '🎋', prompt: 'Cheraw Bamboo Dance Sticks' },
      { id: '2', name: 'Puanchei Wrap', symbol: '🧣', prompt: 'Geometric Puanchei Pattern' },
      { id: '3', name: 'Mizo Bamboo', symbol: '🎍', prompt: 'Mizoram Lush Bamboo Groves' },
      { id: '4', name: 'Feather Crown', symbol: '🪶', prompt: 'Hornbill Feather Headgear' }
    ]
  },
  Arunachal: {
    name: 'Arunachal Pradesh',
    primary: '#712B13', // Earthy Brown
    secondary: '#3B6D11', // Forest Green
    accent: '#A32D2D', // Red Accent
    background: '#F8F6F3',
    borderStyle: 'border-t-8 border-[#712B13]',
    borderPattern: 'repeating-linear-gradient(45deg, #712B13, #712B13 10px, #3B6D11 10px, #3B6D11 20px, #A32D2D 20px, #A32D2D 30px)',
    localLang: 'Nyishi / Adi / Bhoti',
    greeting: 'Tashi Delek / Kanam (Greetings)',
    motifs: ['👺 Tribal Mask', '⛩ Monastery', '🎋 Apatani Weave', '⛰ Himalayan Peaks'],
    gameItems: [
      { id: '1', name: 'Tribal Mask', symbol: '👺', prompt: 'Hand-carved Wooden Mask' },
      { id: '2', name: 'Monastery Gate', symbol: '⛩', prompt: 'Tawang Monastery Gate' },
      { id: '3', name: 'Apatani Weave', symbol: '🧵', prompt: 'Apatani Tribe Textile' },
      { id: '4', name: 'Himalayan Peak', symbol: '⛰', prompt: 'Snowy Peak of Arunachal' }
    ]
  }
};

// Distinct Local Translations tailored specifically for each North East State!
export const STATE_LOCAL_DICTIONARIES = {
  Assam: {
    welcome: "নমস্কাৰ আৰু স্বাগতম",
    greeting: "নমস্কাৰ",
    reminders: "আজৰ মনত ৰখা কথা",
    cognitiveGames: "মগজুৰ খেল",
    viewAll: "সকলো চাওক",
    check: "পৰীক্ষা কৰক",
    takeYourTime: "ধীৰে ধীৰে কৰক। কোনো ধৰণৰ খৰখেদা নাই।",
    home: "গৃহ",
    family: "পৰিয়াল",
    logout: "প্ৰস্থান",
    voice: "শব্দ",
    memoryMatch: "জোৰা মিলোৱা খেল",
    dailyRoutine: "দৈনন্দিন কাম",
    photoRecall: "ছবি মনত পেলোৱা",
    jigsaw: "টুকুৰা জোৰা খেল"
  },
  Manipur: {
    welcome: "তরাম্না ওকচরী",
    greeting: "খুরুমজরী",
    reminders: "ঙসিগী নিংশিংবা য়াবা",
    cognitiveGames: "মচাক শান্নবা",
    viewAll: "পুম্নমক যেংবা",
    check: "য়েনশিনবা",
    takeYourTime: "তাপ্না তৌবীয়ু। অতৈ অৱাবা লৈতাই।",
    home: "য়ুম",
    family: "ইমুং",
    logout: "থোকপা",
    voice: "খোঞ্জেল",
    memoryMatch: "মানবা থিবা শান্নবা",
    dailyRoutine: "নুমিৎ খুদিংগী থবক",
    photoRecall: "লাইয়েং নিংশিংবা",
    jigsaw: "জিগস পেহেল"
  },
  Meghalaya: {
    welcome: "Pdiang burom",
    greeting: "Khublei",
    reminders: "Kiei kiei ban kynmaw tyngkai",
    cognitiveGames: "Jingialehkai jabieng",
    viewAll: "Peit baroh",
    check: "Peit bniah",
    takeYourTime: "Kynmaw suki suki. Ym don jingpynstep.",
    home: "Ing",
    family: "Kur kapoh",
    logout: "Mih noh",
    voice: "Jingsawa",
    memoryMatch: "Pyniah kiei kiei",
    dailyRoutine: "Jingtrei man ka sngi",
    photoRecall: "Kynmaw dur",
    jigsaw: "Jingpyniasoh dur"
  },
  Nagaland: {
    welcome: "Shalom & Welcome",
    greeting: "Imsuren",
    reminders: "Aji laga Reminder khan",
    cognitiveGames: "Dimag laga Khel",
    viewAll: "Sob Chabi",
    check: "Check Kobi",
    takeYourTime: "Aste aste kobi. Kono Hula gola nai.",
    home: "Ghor",
    family: "Parivar",
    logout: "Out Hobo",
    voice: "Awaj",
    memoryMatch: "Mila laga Khel",
    dailyRoutine: "Rasta laga Kam",
    photoRecall: "Photo Yaad Kobi",
    jigsaw: "Tukra Jora Khel"
  },
  Tripura: {
    welcome: "স্বাগতম ককবরক",
    greeting: "খুলুমখা",
    reminders: "তিনিও রিমাইন্ডার",
    cognitiveGames: "ককবরক খেলা",
    viewAll: "জোবো দেখদি",
    check: "নাইদি",
    takeYourTime: "আস্তে আস্তে খাইদি। কোনো চাপ নাই।",
    home: "নক",
    family: "পরিবার",
    logout: "অনকারদি",
    voice: "খুকবুক",
    memoryMatch: "মিল খাইদি খেলা",
    dailyRoutine: "সানি ককবরক কাম",
    photoRecall: "ছবি সিমান খাইদি",
    jigsaw: "টুকরা জোড়া খেলা"
  },
  Mizoram: {
    welcome: "Chibai leh Lo lut rawh",
    greeting: "Chibai",
    reminders: "Vawiin hriatreng turte",
    cognitiveGames: "Hriatna tihhmasawnna infiamna",
    viewAll: "Chhang zawng zawng",
    check: "Endik rawh",
    takeYourTime: "Muangchangin ti rawh. Hmanhmawh a ngai lo.",
    home: "In",
    family: "Chhungte",
    logout: "Chhuak rawh",
    voice: "Aw",
    memoryMatch: "Inhmeh zawng infiamna",
    dailyRoutine: "Ni tin hnathawhte",
    photoRecall: "Thlalak hriatnawnna",
    jigsaw: "Tibharlapna"
  },
  Arunachal: {
    welcome: "Tashi Delek & Welcome",
    greeting: "Tashi Delek / Kanam",
    reminders: "Today's Reminders",
    cognitiveGames: "Brain Memory Games",
    viewAll: "View All",
    check: "Check",
    takeYourTime: "Take your time gracefully. No pressure.",
    home: "Home",
    family: "Family",
    logout: "Sign Out",
    voice: "Voice",
    memoryMatch: "Memory Pair Match",
    dailyRoutine: "Daily Morning Steps",
    photoRecall: "Heritage Photo Recall",
    jigsaw: "Puzzle Game"
  }
};

// Multi-language UI Dictionaries (English, Hindi, State-Specific Local)
export const getTranslation = (language, state = 'Assam') => {
  if (language === 'Hindi') {
    return {
      welcome: "स्वागत है",
      greeting: "नमस्ते",
      reminders: "आज के रिमाइंडर",
      cognitiveGames: "दिमागी खेल",
      viewAll: "सभी देखें",
      check: "देखें",
      takeYourTime: "अपना समय लें। यहाँ कोई समय सीमा या दबाव नहीं है।",
      home: "होम",
      family: "परिवार",
      logout: "लॉग आउट",
      voice: "आवाज़",
      memoryMatch: "मेमोरी मैच",
      dailyRoutine: "दैनिक दिनचर्या",
      photoRecall: "फोटो याददाश्त",
      jigsaw: "जिगसॉ पहेली"
    };
  }

  if (language === 'Local') {
    return STATE_LOCAL_DICTIONARIES[state] || STATE_LOCAL_DICTIONARIES['Assam'];
  }

  // English default
  return {
    welcome: "Welcome",
    greeting: "Namaste",
    reminders: "Today's Reminders",
    cognitiveGames: "Cognitive Games",
    viewAll: "View All",
    check: "Check",
    takeYourTime: "Take your time. There are no timers or pressure here.",
    home: "Home",
    family: "Family",
    logout: "Sign Out",
    voice: "Voice",
    memoryMatch: "Memory Match",
    dailyRoutine: "Daily Routine",
    photoRecall: "Photo Recall",
    jigsaw: "Jigsaw Puzzle"
  };
};
