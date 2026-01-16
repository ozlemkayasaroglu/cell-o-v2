# 🌍 Nature Explorer - Comprehensive Project Specification

## 📌 Proje Kimliği ve Amacı

**Proje Adı:** Nature Explorer (Doğa Keşfedicisi)
**Kategori:** Eğitim Oyunu / Web Uygulaması
**Hedef Kullanıcı:** 4-12 yaş arası çocuklar
**Platform:** Web (React/TypeScript - Mobil responsive)

**Ana Amaç:**
- Çocuklara bilimsel düşünce ve deneysel yöntem öğretme
- Doğa ve canlıları gözlemleme becerisi kazandırma
- İnteraktif ve eğlenceli öğrenme ortamı oluşturma
- 52 haftalık yapılandırılmış bilim müfredatı sunum
- Oyunlaştırma ile motivasyon artırma (XP, Rozet, Streak)

---

## ��️ Mimari Yapı (Frontend Stack)

**Frontend:**
- React 18 + TypeScript
- Next.js 13+
- React Native Web
- Tailwind CSS / RNW Styling

**Storage:**
- AsyncStorage (Web: localStorage)
- Service Worker (offline support)

**External APIs:**
- iNaturalist API (organism data)

---

## 🎯 Core Features & Logic

### 1. Onboarding & Profile Setup
- Tek sayfalı Onboarding ekranı
- Age group seçimi (4-5, 6-7, 8-9, 10-12)
- Nickname + Avatar seçimi
- Verileri AsyncStorage'a kaydetme

### 2. Weekly Experiments
- 52 haftalık deney database (12 haftalık döngü)
- Yaş grubuna göre otomatik zorluk filtreleme
- Kategori-based (Hücre, Bitki, Kristal, Mikroorganizmaları)
- Material lista, adım adım talimatlar
- XP: kolay=50, orta=100, zor=150
- Child-friendly text generation (yaş-uygun metin)

### 3. Observation Tasks
- Günde 5 görev (template-based, dynamic taxon)
- Kategori: Bitkiler, Kuşlar, Böcekler, Manzara
- Zorluk: easy, medium, hard, expert
- Task history ve streak tracking

### 4. Gamification
- XP & Level system
- Badge milestones (1st exp, 5 exp, 10 exp, etc.)
- Streak counter (consecutive days)
- Category completion progress

---

## 📱 Screen Architecture (5 Main Screens)

1. **Onboarding:** "Keşfe Başla" button
2. **Profile Setup:** Age, nickname, avatar
3. **Home:** Current experiment + level/XP
4. **Experiments:** List (filtered by age) + modal with steps
5. **Progress:** Stats, badges, streaks

---

## 🎨 UI Design System

**Colors:**
- Primary: #10B981 (Emerald)
- Secondary: #0D9488 (Teal)
- Chemistry: #6BCB77
- Biology: #4D96FF
- XP Gold: #FFD700

**Components:**
- ScienceButton, ScienceCard, BadgeCircle, ProgressBar, StepCard

---

## 💾 Data Management

**AsyncStorage Keys:**
- onboarding_completed
- profile_completed
- user_profile
- experiment_weekly_progress
- experiment_completed
- observation_active_tasks

---

## 🔄 Navigation Flow

1. Load app → Check flags
2. onboarding_completed NOT set → /onboarding
3. profile_completed NOT set → /profile-setup
4. Both set → /(tabs) [Home]

---

## 📊 Data Models

**User Profile:**
- nickname, ageGroup, avatar, points, badges

**Weekly Progress:**
- currentWeek (1-12 cycles), totalPoints, streak, badges

**Weekly Experiment:**
- id, weekNumber, title, difficulty, materials, steps, ageGroups

**Observation Task:**
- id, title, category, difficulty, hints, targetTaxon

---

## 🚀 Development Workflow

**Key Files:**
- engine/experimentEngine.ts (⭐ core logic)
- data/weeklyExperiments.ts (52-week database)
- app/(tabs)/experiments.tsx (experiment UI)
- theme/science.ts (design tokens)

---

## ✅ Success Criteria

- ✓ Onboarding → Profile → Home flow seamless
- ✓ Age-filtering works (4-5 sees only "kolay")
- ✓ XP/Badge system functional
- ✓ Daily tasks generate (5 per day)
- ✓ Responsive on mobile/tablet/web
- ✓ No console errors
- ✓ Service Worker offline support

