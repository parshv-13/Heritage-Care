# 📊 Caregiver Analytics Dashboard & Game Report Specification

> **Target Platform:** Heritage Care — Cognitive Gaming & Dementia Care Platform  
> **Audience:** Caregivers, Family Members, and Healthcare/Clinical Monitors  
> **Design Philosophy:** Tactile Minimalism, High Contrast, Accessible Data Visualization  

---

## 📐 1. Visual Wireframe Hierarchy & Layout Architecture

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ 🌺 Heritage Care — Caregiver Analytics & Clinical Insights Header              │
├──────────────────────────────────────────────────────────────────────────────────┤
│ [ Filter Toolbar: Date Range | Patient Select | Game Mode | State Theme ]       │
├────────────────────────────────────────────────────────┬─────────────────────────┤
│ 🟢 CORE KPI WIDGET ROW                                 │ 👤 PATIENT PROFILE      │
│ ┌──────────────┬──────────────┬──────────────┬───────┐ │ Name: Azo Naga          │
│ │ Avg Accuracy │ Play Duration│ Completion   │ Mood  │ │ Stage: Mild Dementia    │
│ │   78.4% ↑    │ 24 min/day   │  92% Rate    │ CalmL │ │ Preferred: Nagamese     │
│ └──────────────┴──────────────┴──────────────┴───────┘ └─────────────────────────┘
├──────────────────────────────────────────────────────────────────────────────────┤
│ 📅 MODULE 1: DAILY ANALYSIS & PROGRESSION                                         │
│ ┌────────────────────────────────────────┬─────────────────────────────────────┐ │
│ │ 📈 Day-by-Day Accuracy & Cognitive Drift │ ⏱️ Play Time & Session Frequency     │ │
│ │   [ Line Chart: 7-Day / 30-Day Trend ]   │   [ Bar Chart: Morning/Eve Split ]  │ │
│ ├────────────────────────────────────────┴─────────────────────────────────────┤ │
│ │ 🕒 Peak Activity & Latency Heatmap                                           │ │
│ │   [ Hour-of-Day vs Reaction Time Matrix ]                                    │ │
│ └──────────────────────────────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────────────────────┤
│ 🎮 MODULE 2: GAME REPORT & AI CLINICAL INSIGHTS                                  │
│ ┌────────────────────────────────────────┬─────────────────────────────────────┐ │
│ │ 🎯 Game-Specific Performance Breakdown │ 🧠 AI Diagnostic & Feedback Panel   │ │
│ │   - Memory Match: 57.1% (Grid 3x3)     │   - Itemized Strengths               │ │
│ │   - Daily Routine: 83.3%               │   - Itemized Weaknesses / Fatigue   │ │
│ │   - Village Elder Story: 75.0%         │   - Tactical & Caregiver Actions     │ │
│ └────────────────────────────────────────┴─────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📅 2. Module 1: Daily Analysis Module

### 2.1 Core Data Widgets & Visualizations

1. **Day-by-Day Progression Chart (`ProgressTrendChart.jsx`)**
   - **Type:** Dual-axis interactive Line / Area Chart (Recharts / Chart.js).
   - **Metrics:**
     - Primary Axis: Overall Accuracy (%) over selected window (7 / 14 / 30 days).
     - Secondary Axis: Mean Decision Latency (seconds).
   - **Cognitive Alert Threshold:** Visual markers highlight dips $>20\%$ below baseline, flagging potential fatigue or bad days.

2. **Play Time & Session Frequency Trends (`PlayTimeBarChart.jsx`)**
   - **Type:** Stacked Bar Chart.
   - **Metrics:** Total active minutes broken down by game type (`memory-match`, `daily-routine`, `photo-recall`, `jigsaw`, `naga-storytelling`).
   - **Goal:** Tracks daily engagement consistency without imposing strict timers on the user.

3. **Peak Activity & Cognitive Latency Matrix (`PeakActivityHeatmap.jsx`)**
   - **Type:** Time-of-Day Heatmap (Morning 8am–12pm | Afternoon 12pm–4pm | Evening 4pm–8pm | Night 8pm–12am).
   - **Metrics:** Maps reaction times and accuracy against time slots.
   - **Clinical Insight:** Identifies the patient's "golden hours" (optimal cognitive clarity window) for scheduling therapy and medication.

---

## 🎮 3. Module 2: Game Report & AI Clinical Insights

### 3.1 Itemized AI Feedback Engine (`GameReportPanel.jsx`)

Provides automated, plain-language clinical synthesis generated from Firebase session telemetry:

#### 🟢 Itemized Strengths (Preserved Skills)
- **Procedural Routine Mastery:** Excellent recall in sequential tasks (*Daily Routine accuracy 83.3%*), indicating strong procedural memory retention.
- **Auditory Story Engagement:** Responds effectively to voice prompts in the *Village Elder Morung Storytelling* module with high semantic coherence (75%).
- **Steady Touch Precision:** Low tactile misclick rate during morning sessions.

#### ⚠️ Itemized Weaknesses & Cognitive Fatigue
- **Visual-Spatial Working Memory Overload:** Accuracy drops from 85% on 2x2 grids down to 57.1% on 3x3 grids in *Memory Match*.
- **Evening Reaction Latency:** Mean decision latency increases by $+1.6\text{s}$ after 6:00 PM, signaling evening sundowning/fatigue.
- **Unprompted Semantic Pause:** Response delay spikes to $7.4\text{s}$ during unguided story continuation.

#### 💡 Tactical & Caregiver Recommendations
1. **Adaptive Grid Scaling:** Maintain *Memory Match* on 2x2 grids during evening play sessions to prevent agitation.
2. **Optimal Therapy Window:** Schedule interactive storytelling between **9:30 AM and 11:30 AM** when decision latency is at its lowest (1.8s).
3. **Voice Prompt Sensitivity:** Set AI Elder prompt scaffolding trigger to 3.5s latency instead of 5.0s to gently support verbal retrieval.

---

## 🎛️ 4. Interactive Filters & Controls

- **Date Range Selector:** `Today` | `Last 7 Days` | `Last 30 Days` | `Custom Range`
- **Game Filter Dropdown:** `All Games` | `Memory Match` | `Daily Routine` | `Photo Recall` | `Naga Storytelling`
- **Cultural State Context Switcher:** Dynamically formats motifs and state-specific icons (*Assam Gamosa, Nagaland Hornbill, Manipur Innaphi*).
- **Export & Share Action:** PDF Clinical Summary download for doctor consultations.

---

## 🎨 5. Component Design Guidelines

### 5.1 Color Palette & Tokens (Tactile Minimalism)
- **Primary Background:** Warm Cream / Off-White (`#FDFBF7`)
- **Card Surfaces:** Soft Ivory (`#FFFFFF`) with subtle shadow (`0 2px 8px rgba(0,0,0,0.06)`)
- **Accent - Positive / Progress:** Sage Forest Green (`#27500A` / `#3B7A11`)
- **Accent - Warning / Friction:** Terracotta Ochre (`#BA7517` / `#D97706`)
- **Accent - Calm Focus:** Soft Indigo / Slate (`#3730A3`)

### 5.2 Accessibility & Typography
- **Font Family:** `Inter`, `Roboto`, or system sans-serif with high legibility.
- **Font Sizes:** Base headers $\ge 20\text{px}$, Metric Values $\ge 32\text{px}$ bold, Body Text $\ge 16\text{px}$.
- **Contrast Ratio:** Minimum **4.5:1 (WCAG AA)** across all chart labels and metric cards.
- **Screen Reader Support:** Full ARIA labels for chart data points and KPI cards.
