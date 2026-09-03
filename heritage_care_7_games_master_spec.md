# 🌺 Heritage Care — 7 North East India Culturally Unified Cognitive Games Master Specification

> **Target Platform:** Heritage Care — Dementia Care & AI Cognitive Gaming Platform  
> **Core Objective:** Provide 7 culturally immersive, non-pharmacological cognitive games designed specifically for elderly dementia patients across North-Eastern India.  
> **Unified Design System:** All 7 games share identical design tokens, high contrast tactile minimal UI, adaptive difficulty, voice narration, and telemetry integration.

---

## 🎨 1. Unified Cultural & Architectural Design System

To ensure all 7 games feel part of a single cohesive ecosystem ("Same Theme on All Bases"):

1. **Unified Design Aesthetic (Tactile Minimalism & Cultural Weave Borders):**
   - **Base Palette:** Warm Soft Cream background (`#FDFBF7`), Natural Wood / Ivory card containers (`#FFFFFF`), Warm Soil Brown structural borders (`#4A3728`).
   - **Regional Motif Accent Engine (`regionalThemes.js`):** Dynamic border weave motifs based on state context (*Gamosa, Puanchei, Risa, Innaphi, Apatani*).
   - **Non-Punitive Mechanics:** NO countdown timers, NO "Game Over" sound effects, and NO score penalties. Feedback is always warm, encouraging, and supportive.

2. **Core AI Adaptive Scaffolding:**
   - Evaluates decision latency, accuracy, and prompt counts to auto-adjust grid sizes, rhythmic tempos, or prompt frequencies via `gameStorage.js`.

3. **Accessibility Standard:**
   - Minimum target sizes $\ge 64\times64\text{px}$, voice-first narration button on every screen, and slowed speech rate ($0.85\times$ rate, `en-IN` / local dialect).

---

## 🎮 2. Master Specification of the 7 Cognitive Games

### 🧵 Game 1: Khasi Jainsem Loom Weave (Pattern & Visual Working Memory)
- **State & Cultural Motif:** Meghalaya (Khasi Traditional *Jainsem* Textile Weaving).
- **Gameplay Concept:**
  - The screen displays a traditional loom with a half-woven *Jainsem* pattern on top and a blank grid below.
  - The player studies the target pattern for **8–10 seconds**.
  - The top pattern is gently covered with a woven cloth curtain.
  - The player recreates the pattern by tapping colored thread cells in the correct order and position.
- **Cognitive Domain:** Visual-spatial working memory, pattern recognition, and fine motor precision.
- **Adaptive Dynamics:**
  - *Standard:* 3x3 grid with 3 colors.
  - *Easier:* 2x2 grid with 2 high-contrast colors (Silk Gold & Indigo).
  - *Harder:* 4x4 grid with complex floral weave motifs.

---

### 🎋 Game 2: Cheraw Bamboo Rhythm Tap (Divided Attention & Temporal Coordination)
- **State & Cultural Motif:** Mizoram (Cheraw Bamboo Dance).
- **Gameplay Concept:**
  - Two animated bamboo poles open and close horizontally in steady rhythm.
  - A gentle traditional Mizo folk melody (*Cheraw* rhythm) sets the timing.
  - The player taps the central gap when the poles open.
  - As the player succeeds, a **second pair of intersecting bamboo poles** is introduced, requiring divided attention across two staggered rhythms.
- **Cognitive Domain:** Motor timing, executive inhibition, divided attention, and rhythm processing.
- **Adaptive Dynamics:**
  - *Easier:* Single pair of poles, slower tempo (50 BPM), visual pulse highlight on the tap zone.
  - *Harder:* Dual pole pairs with variable rhythmic intervals (75 BPM).

---

### 👴 Game 3: Village Elder Morung Storytelling (Voice Reminiscence & Semantic Memory)
- **State & Cultural Motif:** Nagaland (Morung Village Elder Oral Tradition).
- **Gameplay Concept:**
  - An animated village elder character seated inside a traditional *Morung* (longhouse) narrates regional folk tales (*Ao, Angami, Sumi*).
  - The elder pauses at key narrative junctures: *"And what did the tiger say to the boy?"*
  - Players respond by **voice** in Nagamese, English, or local dialect.
  - Partial or approximate answers are warmly accepted and built upon.
  - **Family Memory Archive:** Allows patients to record personal family anecdotes, saved as custom narrative chapters for future recall.
- **Cognitive Domain:** Semantic memory, narrative sequencing, language production, and reminiscence therapy.
- **Adaptive Dynamics:**
  - Analyzes speech latency and coherence. If the patient struggles, the system gently transitions from recall mode to full narrative storytelling without friction.

---

### 🥁 Game 4: Wangala Drumbeat Echo (Auditory Sequential Memory / "Simon Says")
- **State & Cultural Motif:** Meghalaya (Garo 100-Drums Wangala Festival).
- **Gameplay Concept:**
  - Set on a festive Garo village stage with traditional *Kram* drums.
  - An animated drummer plays a rhythmic sound sequence (e.g., Drum A $\rightarrow$ Drum B $\rightarrow$ Drum A).
  - The player repeats the sequence by tapping the drums back in exact order.
- **Cognitive Domain:** Auditory short-term memory, sequential processing, and sensorimotor integration.
- **Adaptive Dynamics:**
  - *Easier:* 2 drums, short sequence length (2 to 3 beats), visual glow on active drums.
  - *Harder:* 4 drums, unguided sequence length (5 to 6 beats).

---

### 🍲 Game 5: Traditional Kitchen Master (Procedural Memory & Sequential Tasking)
- **State & Cultural Motif:** Assam / Multi-NE State Cuisine (e.g., Preparing *Masor Tenga* or *Pitha*).
- **Gameplay Concept:**
  - The player prepares a traditional regional dish step-by-step in proper culinary order.
  - **Phase 1 (Guided):** Steps are shown as clear, tactile image cards with audio narration explaining each step (e.g., *1. Wash Fish $\rightarrow$ 2. Fry Mustard Seeds $\rightarrow$ 3. Add Elephant Apple*).
  - **Phase 2 (Memory Recall):** As proficiency grows, visual image prompts are hidden, leaving only audio step names.
- **Cognitive Domain:** Procedural memory, sequential planning, and daily living activity (ADL) stimulation.
- **Adaptive Dynamics:**
  - Automatically reverts to Phase 1 (visual prompts enabled) if misorder errors occur.

---

### ☸️ Game 6: Monastery Prayer Wheel Walk (Calming / Low-Stimulation Sensory Therapy)
- **State & Cultural Motif:** Arunachal Pradesh / Sikkim (Buddhist Monastery Path).
- **Gameplay Concept:**
  - A slow-paced, tranquil walk along a mist-covered monastery path lined with golden prayer wheels.
  - Ambient audio includes authentic monastery chants, gentle wind chimes, and distant temple bells.
  - The player walks the path and spins prayer wheels in a simple sequence shown briefly at the start.
  - **Purpose:** Designed as the lowest-stimulation game in the suit, specifically tailored for **evening agitation (sundowning)** or pre-sleep relaxation.
- **Cognitive Domain:** Mild spatial recall, sensory regulation, anxiety reduction, and calm focus.
- **Adaptive Dynamics:**
  - Zero pressure; no timers or failure conditions. Incorrect wheel spins trigger a soft chime and gentle visual guide arrow.

---

### 🦏 Game 7: Kaziranga Grassland Recall (Visual Observation & Memory Search)
- **State & Cultural Motif:** Assam (Kaziranga National Park Grassland).
- **Gameplay Concept:**
  - The player observes a peaceful Kaziranga landscape featuring regional wildlife (*One-Horned Rhino, Wild Water Buffalo, Swamp Deer, Hornbill*).
  - **Phase 1 (Spot-the-Change):** The scene transitions slightly (an animal moves or disappears), and the player taps/voices what changed.
  - **Phase 2 (Delayed Recall):** Later in the session, the player is asked to recall from memory which animals were present in the earlier scene without viewing it again.
- **Cognitive Domain:** Visual attention, detail retention, and delayed recall.
- **Adaptive Dynamics:**
  - *Easier:* 2 animals in scene, immediate change prompt.
  - *Harder:* 5 animals in scene, delayed recall after 2 minutes.

---

## 📊 3. Unified Cross-Game Summary Matrix

| Game # | Title | Cultural Theme | Cognitive Focus | Input Method | Primary Metric |
|---|---|---|---|---|---|
| **1** | Khasi Jainsem Loom | Meghalaya Weave | Visual Pattern Memory | Tactile Tap | Pattern Accuracy % |
| **2** | Cheraw Bamboo Tap | Mizoram Dance | Divided Attention & Timing | Rhythmic Tap | Timing Delta (ms) |
| **3** | Village Elder Story | Nagaland Morung | Semantic & Language | Voice / TTS | Coherence & Latency |
| **4** | Wangala Drumbeat | Garo Festival | Auditory Sequential Memory | Tactile Tap | Sequence Depth |
| **5** | Kitchen Master | Assam / NE Cuisine | Procedural Sequential ADL | Tactile Drag/Tap | Order Accuracy % |
| **6** | Monastery Wheel Walk | Arunachal / Sikkim | Sensory Calm & Low Stim | Slow Tap / Spin | Relaxation Index |
| **7** | Kaziranga Recall | Assam National Park | Visual Detail & Delayed Recall | Voice / Tap | Recall Accuracy % |
