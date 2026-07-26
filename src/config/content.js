/**
 * ====================================================================
 * CENTRALIZED PERSONAL CONTENT CONFIGURATION (CLEAN ELEGANT)
 * ====================================================================
 * All text and personal details are configured here without raw text emojis.
 * ====================================================================
 */

export const CONFIG = {
  // 0. PASSCODE PIN GATE SCREEN
  pinGateConfig: {
    pinCode: "2628",
    title: "For You, My Love",
    subtitle: "Enter our 4-digit secret code to unlock your birthday surprise",
    hint: "Hint: Our special date (Default PIN: 2628)"
  },



  // 1B. HERO BANNER LANDING
  heroConfig: {
    subtitle: "a love letter in bloom",
    title: "For You, My Everything",
    message: "Every petal holds a whisper of how much you mean to me.",
    daysTogetherText: "1,259 days with you",
    scrollHint: "Scroll down to explore your surprise"
  },

  // 1C. DIGITAL BOUQUET (Interactive Flower Messages)
  digitalBouquet: {
    title: "A Digital Bouquet",
    subtitle: "Each flower holds a little message just for you",
    defaultMessage: "Tap any flower in the bouquet below to reveal its secret message",
    flowers: [
      {
        id: 1,
        flowerSymbol: "🌸",
        name: "Cherry Blossom",
        message: "You are as beautiful as cherry blossoms — lovely and bringing joy wherever you go."
      },
      {
        id: 2,
        flowerSymbol: "🌺",
        name: "Hibiscus",
        message: "Your warmth and vibrant smile brightens even my busiest days."
      },
      {
        id: 3,
        flowerSymbol: "🌷",
        name: "Tulip",
        message: "With you, the simplest everyday moments feel gentle and precious."
      },
      {
        id: 4,
        flowerSymbol: "🌻",
        name: "Sunflower",
        message: "You are the brightest light in my life, always guiding me towards joy."
      },
      {
        id: 5,
        flowerSymbol: "🌹",
        name: "Rose",
        message: "Loving you is the easiest and most beautiful choice I make every single day."
      },
      {
        id: 6,
        flowerSymbol: "💐",
        name: "Blossom Bouquet",
        message: "You are my favorite person, my safest place, and my greatest blessing."
      },
      {
        id: 7,
        flowerSymbol: "🌼",
        name: "Daisy",
        message: "Your gentle and pure heart is what I love the most."
      }
    ]
  },

  // 2. PHOTO GALLERY MEMORIES
  fotoGallery: [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
      title: "Our First Date",
      caption: "Grabbing coffee together and talking for hours without realizing the time",
      date: "Our First Encounter"
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
      title: "Weekend Getaway",
      caption: "Watching the golden sunset together by the ocean",
      date: "A Sunny Day"
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80",
      title: "Laughing Together",
      caption: "That hilarious moment when we couldn't stop laughing",
      date: "Joyful Times"
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=800&q=80",
      title: "Celebrating You",
      caption: "So grateful for every milestone we celebrate side by side",
      date: "Your Special Day"
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
      title: "Sweet Quiet Moments",
      caption: "Just relaxing together on a cozy evening",
      date: "Quiet Evenings"
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
      title: "Holding Hands",
      caption: "Whatever comes next, I'm glad we're in this together",
      date: "Always"
    }
  ],

  // 3. OUR JOURNEY TIMELINE
  timelineJourney: [
    {
      id: 1,
      stepNumber: "01",
      date: "The Beginning",
      title: "First Time We Met",
      description: "Where our story quietly started, and a simple conversation changed everything."
    },
    {
      id: 2,
      stepNumber: "02",
      date: "Late Night Talks",
      title: "Our First Long Conversation",
      description: "Talking until the stars faded, realizing how effortlessly we connected."
    },
    {
      id: 3,
      stepNumber: "03",
      date: "First Adventure",
      title: "Our First Special Outing",
      description: "Exploring new places together and making our very first shared memories."
    },
    {
      id: 4,
      stepNumber: "04",
      date: "Countless Smiles",
      title: "Laughter That Never Ended",
      description: "Moments filled with pure joy, inside jokes, and silly laughter."
    },
    {
      id: 5,
      stepNumber: "05",
      date: "Quiet Comfort",
      title: "Beautiful Silence Together",
      description: "Finding peace in just being in each other's presence without needing words."
    },
    {
      id: 6,
      stepNumber: "06",
      date: "Today",
      title: "Your Special Birthday",
      description: "Celebrating you today and looking forward to all the chapters yet to come."
    }
  ],

  // 4. LOVE LETTER
  loveLetter: {
    title: "A Letter For You",
    subtitle: "On Your Birthday",
    salutation: "Dearest Citra Mutia,",
    paragraphs: [
      "Happy birthday! I wanted to put together something truly personal for you today to celebrate the person you are.",
      
      "Looking back at all our favorite memories, I'm constantly reminded of how lucky I am to share life with you. From late-night conversations to simple everyday moments, everything feels warmer with you.",
      
      "Thank you for your warmth, your laughter, and the genuine care you give so effortlessly. You bring so much comfort and joy into my life.",
      
      "Wishing you a fantastic year ahead filled with happiness, good health, and all the things you love. I'll always be right here cheering you on."
    ],
    closing: "With all my love,",
    signature: "Yours always,"
  },

  // 5. REASONS WHY I LOVE YOU (Love Envelope Deck)
  alasanCinta: [
    {
      id: 1,
      number: "01",
      title: "Your Genuine Smile",
      description: "How your smile brightens even the busiest days and instantly lifts my mood."
    },
    {
      id: 2,
      number: "02",
      title: "Your Kind Heart",
      description: "The quiet empathy and care you show to everyone around you."
    },
    {
      id: 3,
      number: "03",
      title: "How You Listen",
      description: "You always make me feel truly heard, understood, and comfortable."
    },
    {
      id: 4,
      number: "04",
      title: "Your Infectious Laugh",
      description: "The sound of your laugh is my absolute favorite sound in the world."
    },
    {
      id: 5,
      number: "05",
      title: "Your Constant Support",
      description: "Believing in me even when I feel unsure of myself."
    },
    {
      id: 6,
      number: "06",
      title: "Being Yourself",
      description: "Because with you, I can be 100% genuine without pretense."
    }
  ],

  // 6. LOVE NOTES JAR (Shake the Jar Feature)
  loveJarNotes: [
    "Your laugh is my absolute favorite sound in the whole world.",
    "You make the simplest everyday things feel incredibly special.",
    "Thank you for always being my safe place to land.",
    "I'm so proud of everything you are and everything you do.",
    "Every moment spent with you is a memory I treasure.",
    "You bring out the best, happiest version of me."
  ],

  // 7. MULTI-TRACK PLAYLIST
  playlistConfig: [
    {
      id: 1,
      title: "Shape of My Heart",
      artist: "Sting",
      audioUrl: "/songs/shape of my heart.mp3" // File musik utama yang baru saja Anda download
    },
    {
      id: 2,
      title: "Until I Found You",
      artist: "Stephen Sanchez",
      audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=piano-romantic-love-112199.mp3"
    },
    {
      id: 3,
      title: "Angel Baby",
      artist: "Troye Sivan",
      audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8b417c8.mp3?filename=romantic-ambient-10287.mp3"
    }
  ],

  // 8. CLOSING SECTION & WISHES
  pesanPenutup: {
    title: "Happy Birthday, Citra Mutia!",
    message: "I hope today brings you as much happiness as you bring into my life every day. Loving you today, tomorrow, and always.",
    subtext: "Tap the button below to send a warm hug!",
    tombolPelukText: "Send Hugs & Love"
  }
};
