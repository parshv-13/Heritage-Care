# 🌺 Heritage Care — North East India Dementia Care & AI Cognitive Gaming Platform

> **Smart India Hackathon (SIH) MVP Submission**  
> **Target Audience:** Elderly dementia patients & caregivers across 7 North-Eastern Indian States (*Assam, Manipur, Meghalaya, Nagaland, Tripura, Mizoram, Arunachal Pradesh*).

---

## 🎯 Alignment with SIH Problem Statement Checklist

| Problem Statement Requirement | MVP Feature Implemented | Technical Details |
|---|---|---|
| **a. Interactive Cognitive Games** | 4 Tactile & Dementia-Friendly Games: Memory Match, Daily Routine, Photo Recall, Jigsaw | Large touch targets, high contrast, non-judgmental feedback, no timers or pressure |
| **b. AI/ML Adaptive Difficulty** | Adaptive Performance Engine (`gameStorage.js`) | Dynamically adjusts grid sizes (2x2 → 3x3) and hints based on historical score & reaction metrics |
| **c. Multilingual & Voice Assistant** | Web Speech Synthesis + 3 Language Modes (English, Hindi, Native Script) | High-contrast TTS audio button on every screen; state-specific native scripts (*Assamese, Manipuri, Khasi, Nagamese, Kokborok, Mizo, Nyishi*) |
| **d. Culturally Familiar Themes** | 7 Regional State Design Systems (`regionalThemes.js`) | Dynamic color themes, woven border motifs (*Gamosa, Innaphi, Puanchei*), and state symbols (*Kaziranga Rhino, Shirui Lily, Root Bridge, Hornbill*) |
| **e. Patient Care Reminders** | Daily Health Schedule (`/reminders`) | Medicine 💊, Hydration 💧, Walk/Activity 👟, Doctor Appointments 🩺 with full Add/Edit/Delete & status tracking |
| **f. Caregiver Dashboard & Contacts** | Caregiver Contact Hub (`/family`) | Direct phone calling, caregiver emergency network, and Firestore user session logging |
| **g. Offline Functionality** | Progressive Web App (PWA Service Worker `sw.js`) | Full offline caching of app, games, themes, and audio prompts for remote/low-connectivity areas |
| **h. Accessible Mobile UI/UX** | Tactile Minimalism & PWA Download Banner (`PWAInstallPrompt.jsx`) | Installable on mobile/tablet devices via single tap; no navigation clutter |

---

## 🚀 Key Standout Features for SIH Presentation

### 1. 📍 Regional Cultural Localization (7 NE States)
The app dynamically changes theme colors, traditional woven borders, audio greetings, and game symbols based on the user's home state selected during onboarding:
* **Assam**: Ochre `#BA7517` | Gamosa woven border | Jaapi 👒, One-Horned Rhino 🦏, Tea Leaves 🍃, Bihu Dhol 🥁
* **Manipur**: Deep Red `#A32D2D` | Innaphi temple border | Shirui Lily 🌺, Ras Lila 💃, Kangla Fort 🏰
* **Meghalaya**: Forest Green `#27500A` | Khasi weave | Living Root Bridge 🌿, Knup Umbrella 🌂, Rain 🌧
* **Nagaland**: Tribal Red & Gold | Naga tribal band | Hornbill 🦅, Mithun 🐂, Log Drum 🪵
* **Tripura**: Deep Red `#993C1D` | Risa weave | Ujjayanta Palace 🏰, Garia Doll 🪆, Risa Textile 🧣
* **Mizoram**: Red & White `#A32D2D` | Puanchei band | Cheraw Bamboo Dance 🎋, Puanchei Wrap 🧣
* **Arunachal Pradesh**: Earthy Brown `#712B13` | Apatani weave | Tribal Mask 👺, Monastery Gate ⛩

### 2. 🔐 Full Authentication & Onboarding Pipeline
* **Firebase Real Auth**: Google Sign-In & Phone Number OTP with Recaptcha verification.
* **First-Time User Onboarding**: Mandatory wizard asking for **Patient Name**, **Home State**, **Preferred Language**, and **Caregiver Phone Number**.
* **Cloud Sync**: All user settings, active reminders, family contacts, and game scores sync instantly to **Firebase Firestore**.

### 3. 📱 Installable PWA with Offline Support
* **App Download Banner**: Custom install prompt allowing elderly patients or caregivers to add the app directly to their phone's home screen.
* **Offline Service Worker**: Game states and assets are stored locally, guaranteeing functionality even in rural NE areas without internet.

---

## 🛠️ Technology Stack

* **Frontend Framework**: React 18 + Vite
* **Styling**: Tailwind CSS (Tactile Minimalism design tokens)
* **Icons & UI**: Lucide React
* **State Management & Context**: React Context API (`AppContext.jsx`)
* **Backend Database & Auth**: Firebase Auth + Firestore Cloud Database
* **Voice & Accessibility**: Web Speech API (`speakText`)
* **PWA Engine**: Service Worker (`public/sw.js`) + Web App Manifest (`public/manifest.json`)
* **Deployment**: Netlify (`netlify.toml` SPA rewrite rules)

---

## 🛠️ Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/Victorraj020/Cognitive-Gaming5.git
cd Cognitive-Gaming5

# 2. Install dependencies
npm install

# 3. Create .env file (copy from .env.example)
cp .env.example .env

# 4. Start development server
npm run dev

# 5. Build production bundle
npm run build
```

---

## 🌐 Live Deployment
* **GitHub Repository**: [https://github.com/Victorraj020/Cognitive-Gaming5](https://github.com/Victorraj020/Cognitive-Gaming5)
* **Netlify Configuration**: Pre-configured with `netlify.toml` for Single Page Application client-side routing.
