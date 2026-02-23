# 📱 Cell-o v2 - Proje Özeti

## 🎯 Proje Tanımı
**Cell-o v2**, 4-12 yaş arası çocuklar için haftalık bilimsel deneyleri sunan interaktif bir web uygulamasıdır. Çocuklar profil oluşturduktan sonra deneyleri adım adım gerçekleştirerek XP kazanır ve başarı rozetleri toplayabilirler.

---

## 🏗️ Proje Mimarisi

### Teknoloji Stack
- **Frontend Framework:** React 19.2.0 + TypeScript
- **Build Tool:** Vite 7.2.4 (ES2017 target - legacy browser support)
- **UI Framework:** Tailwind CSS 3.4.1
- **Styling:** PostCSS + Autoprefixer
- **Routing:** React Router DOM 7.12.0
- **State Management:** React Hooks + localStorage (no backend)
- **Icons:** Lucide React + Emojis
- **UI Components:** Headless UI

### Klasör Yapısı
```
src/
├── pages/              # Ana sayfalar (5 sayfa)
│   ├── Onboarding.tsx
│   ├── ProfileSetup.tsx
│   ├── Home.tsx
│   ├── Experiments.tsx
│   ├── ExperimentDetail.tsx
│   └── Progress.tsx
├── components/         # Reusable bileşenler
│   ├── TabNavigation.tsx    # Alt sekme navigasyonu
│   ├── AppFooter.tsx
├── hooks/              # React hooks
│   └── useWeeklyExperiment.ts
├── services/           # API/veri servisleri
│   └── iNaturalistAPI.ts
├── engine/             # İş mantığı
│   └── experimentEngine.ts
├── data/               # Mock data
│   └── weeklyExperiments.ts
├── types/              # TypeScript tipler
│   └── experimentTypes.ts
├── assets/             # Statik dosyalar
├── App.tsx             # Root component + routing
├── main.tsx            # Entry point
└── index.css           # Global stiller
```

---

## 🎨 Tasarım Sistemi

### Renk Paleti
```
Primary:
- Teal (#14B8A6) - Ana vurgu rengi
- Light Green Background (#F8FEFB)

Secondary (Gradient):
- Orange (#F59E42)
- Pink (#F472B6)
- Blue (#3B82F6)

Text Colors:
- Dark (#0F172A)
- Gray (#475569)
- Light Gray (#6B7280)
```

### Tasarım Özellikleri
- **BorderRadius:** rounded-2xl, rounded-3xl
- **Shadows:** shadow-xl, shadow-lg, shadow-sm
- **Animations:**
  - `animate-gradient`: 6s ease infinite (background gradient)
  - `hover:scale-105`: Hover efektleri
  - `animate-bounce`: Başarı rozetleri
  - `animate-pulse`: Loading durumları

### Fontlar
- **Fredoka:** Başlıklar ve bold metinler
- **Baloo 2:** Kurumsal yazılar
- **System Font:** Body text

---

## 📄 Sayfa Detayları

### 1. **Onboarding** (`/onboarding`)
- Uygulamaya giriş sayfası
- Renkli "Cell-o" logotexti
- Açıklayıcı bilgi ve başlat butonu
- LocalStorage'a `onboarding_completed: true` kaydeder
- → Profil kurulumuna yönlendirir

### 2. **Profile Setup** (`/profile-setup`)
- İki panel layout (sol: preview, sağ: form)
- **Girdiler:**
  - Takma ad (max 20 char, renkli render)
  - Avatar seçimi (6 emoji seçeneği)
  - Yaş grubu (4-5, 6-7, 8-9, 10-12)
- **LocalStorage kayıtları:**
  ```json
  {
    "nickname": "...",
    "avatar": "unicorn|butterfly|...",
    "ageGroup": "4-5|6-7|8-9|10-12",
    "createdAt": "ISO string",
    "totalPoints": 0,
    "completedExperiments": [],
    "badges": [],
    "currentStreak": 0
  }
  ```
- → Home sayfasına yönlendirir

### 3. **Home** (`/home`)
- Hoşgeldin mesajı (renkli nickname)
- **Haftalık Deney Kartı:**
  - Başlık, açıklama
  - Zorluk seviyesi, tahmini süre, XP
  - "Deneye Başla" butonu
- **Başarı Rozetleri:**
  - 6 rozet (kilitli/açık gösterimi)
- **Bilim İnsanları Bölümü:**
  - Rassgele bilim insanı (isim, alıntı, bilgi)
  - Arka plan: Mor gradient

### 4. **Experiments** (`/experiments`)
- **Sol Panel:**
  - Başlık, açıklama
  - İlerleme göstergesi (XP bar)
- **Sağ Panel:**
  - Deney kartları grid'i
  - Her kartta: kategori badge, başlık, açıklama, zorluk, XP
  - 3 zorluk seviyesi (kolay/orta/zor) - renkli
- **Bottom Nav:** Tab navigasyonu

### 5. **Experiment Detail** (`/experiment/:id`)
- **Sol Panel (Gradient bg):**
  - Deney başlığı
  - İlerleme bar (adım/toplam adım)
- **Sağ Panel:**
  - Gerekli Malzemeler (grid view)
  - Adım-Adım Talimatlar
  - İpucu kutusu (sarı bg)
  - Önceki/Sonraki butonları
- **Survey (Son Adım):**
  - Observation guide soruları
  - Text input alanları (8+ yaş için)
  - "Deneyi Tamamla" butonu

### 6. **Progress** (`/progress`)
- **Sol Panel:**
  - XP progress bar (0-100 per level)
  - Deney tamamlama oranı
- **Sağ Panel:**
  - Stats Cards (Level, Deney #, Total XP, Badge #)
  - **Başarılar:** 12 rozet grid'i
  - **Parent Summary:**
    - Son tamamlanan deney
    - Son 3 deney kartı (status gösterimi)

---

## 🔄 Yaş Grubu Özelleştirmesi

### 4-5 ve 6-7 Yaş ("isYoung")
- ✅ Sesli okuma mevcut (Speaker component)
- ✅ Basitleştirilmiş dil
- ✅ Daha büyük yazı tipleri
- ✅ Survey'de input alanı YOK (sesle cevaplar)

### 8-9 ve 10-12 Yaş
- ❌ Sesli okuma yok
- ✅ Survey'de yazı girişi
- ✅ Daha detaylı açıklamalar
- ✅ Daha karmaşık eksperimentler

---

## 🎯 Veri Yapıları

### WeeklyExperiment (Type)
```typescript
{
  id: string;
  weekNumber: number;
  title: string;
  description: string;
  category: "biology" | "chemistry" | "physics";
  difficulty: "kolay" | "orta" | "zor";
  points: number;
  estimatedTime: string;
  materials: RequiredMaterial[];
  steps: ExperimentStep[];
  observationGuide: string[] | { text: string }[];
  expectedResults: string[];
  status: "locked" | "available" | "in_progress" | "completed";
  userObservation?: string;
  childFriendly?: { title: string; description: string };
}
```

### User Profile (localStorage)
```typescript
{
  nickname: string;
  avatar: string;
  ageGroup: "4-5" | "6-7" | "8-9" | "10-12";
  createdAt: string;
  totalPoints: number;
  completedExperiments: string[];
  badges: Badge[];
  currentStreak: number;
}
```

### WeeklyProgress
```typescript
{
  totalPoints: number;
  totalExperimentsCompleted: number;
  currentWeek: number;
  streak: number;
  badges: Badge[];
}
```

---

## 🎤 Sesli Okuma (Text-to-Speech)

### Aktif Olduğu Yerler (4-5 ve 6-7 yaş)
1. **Deney Kartlarında:** Başlık + Açıklama
2. **Deney Detayında:** Başlık + Malzemeler + Adım talimatları
3. **Survey'de:** Sorular + Tebrik mesajı
4. **Progress'te:** Son deney özeti + Son 3 deney
5. **Home'da:** Bilim insanı alıntısı + Haftalık deney

### Implementation
- `window.SpeechSynthesis` API
- Türkçe dil (`lang: "tr-TR"`)
- Rate: 0.9 (normale yakın hız)
- Speaker component: Hoparlör ikonu (🔊)

---

## 🎮 Başarı Sistemi

### 12 Rozet Türleri
1. **İlk Keşif** (1 deney) - 🔬
2. **Meraklı Minik** (2 deney) - 🧸
3. **Doğa Kaşifi** (4 deney) - 🦋
4. **Deneyci Çocuk** (6 deney) - 🧪
5. **Yıldız Bilimci** (8 deney) - 🌟
6. **Başarı Rozeti** (10 deney) - 🏅
7. **Seri Kaşif** (3 hafta seri) - 🔥
8. **Hızlı Başlangıç** (1 hafta 2 deney) - ⚡
9. **Zihin Açıcı** (300 XP) - 💡
10. **Hedefe Yakın** (%50 tamamlama) - 🎯
11. **Roket Çocuk** (600 XP) - 🚀
12. **Bilim Kahramanı** (12 deney) - 👑

### XP Sistemi
- Zorluk seviyesine göre puan: kolay=10, orta=20, zor=30
- Seviye: Her 100 XP'de seviye atla
- Streak: Gün seri deney sayısı

---

## 🧮 Veri Mock Kaynağı

**52 haftalık deney müfredatı** (`weeklyExperiments.ts`)
- **Hafta 1-4:** Başlangıç (Kolay)
- **Hafta 5-8:** İleri (Orta)
- **Hafta 9-12:** İleri (Zor)
- Kategoriler: Biology, Chemistry, Physics
- Herbir deneyde: malzemeler, adımlar, gözlem rehberi, beklenen sonuçlar

---

## 🔄 Navigation Flow

```
/ → Onboarding (if not profile_completed)
         ↓
    /profile-setup (form)
         ↓
    /home (main hub)
    ├─→ /experiments (grid view)
    │   └─→ /experiment/:id (detail + survey)
    ├─→ /progress (stats + achievements)
    └─→ TabNav: Ana Sayfa, Deneyler, İlerleme
```

---

## ⚙️ Build & Deployment

### Build Config
- **Target:** ES2017 (eski Android cihazlar için)
- **Output:** `dist/` klasörü
- **Deploy:** Netlify (`_redirects` SPA routing)
- **Redirects:** `/* /index.html 200` (React Router uyumluluğu)

### npm Scripts
```bash
npm run dev       # Vite dev server
npm run build     # tsc check + vite build
npm run lint      # ESLint
npm run preview   # Build preview
```

---

## 🌐 Önemli Dosyalar

| Dosya | Amaç |
|-------|------|
| `src/App.tsx` | Root router, profile kontrolü |
| `src/hooks/useWeeklyExperiment.ts` | Deney ve ilerleme yönetimi |
| `src/engine/experimentEngine.ts` | İş mantığı motoru |
| `src/data/weeklyExperiments.ts` | 52 hafta deney veri |
| `src/types/experimentTypes.ts` | TypeScript arayüzleri |
| `public/_redirects` | Netlify SPA routing |
| `tailwind.config.js` | Renkler, animasyonlar, tema |
| `vite.config.ts` | Vite build ayarları |

---

## 📦 Dependencies

### Production
- `react@19.2.0` - UI library
- `react-dom@19.2.0` - DOM rendering
- `react-router-dom@7.12.0` - Routing
- `@headlessui/react@2.2.9` - UI components
- `lucide-react@0.562.0` - Icons
- `@tanstack/react-query@5.90.17` - Data fetching

### Development
- `vite@7.2.4` - Build tool
- `typescript~5.9.3` - Type checking
- `tailwindcss@3.4.1` - Utility CSS
- `eslint` + `typescript-eslint` - Linting

---

## ✨ Özel Özellikler

1. **Renkli Nickname Render:** Her karakter döngüdeki rengine boyanıyor
2. **Gradient Butonlar:** Animasyonlu 4-renk gradient
3. **Responsive Design:** Mobile-first, md breakpoints
4. **LocalStorage State:** Profil ve ilerleme kalıcı
5. **Sesli Okuma:** 4-7 yaş için tam Turkish Text-to-Speech
6. **Badge Popup:** Yeni rozet kazanıldığında üst sağ animasyonu
7. **Bilim İnsanları:** Tarihsel ve çağdaş bilim insanları
8. **Survey Dinamik:** Gözlem soruları deney bazında

---

## 🚀 Mobil Uygulama Hazırlığı

### Bu Özet Kullanılacak Yer
Eğer bu projeyi **React Native** veya başka mobil framework'e taşımak istersen:
1. **Compat Layer:** Tüm tasarım vektörü yukarıdaki palet ve layout'a uyacak
2. **Component Mapping:** TabNavigation → BottomTabNavigator, etc.
3. **Data Model:** WeeklyExperiment, WeeklyProgress tipleri aynı kalır
4. **API:** Mock veri yerine gerçek API eklenebilir

---

## 📝 Lisans & Yazı
Kızı Ozlemkayasaroglu tarafından, sevgiyle yapılmıştır 💜

**Versiyon:** 1.0.0

---

# 🤖 Mobil Uygulama İçin Komut Seti

Eğer bu özeti bana verse ve mobil versiyon istersen, şu komut setini kullan:

```
"Cell-o Web projesinin bu özeti doğrultusunda, 
aynı tasarım ve işlevsellikle REACT NATIVE / FLUTTER uygulaması oluştur. 
Tüm sayfalar, tasarım sistemi, renk paleti, başarı sistemi, 
yaş grubu özelleştirmesi ve sesli okuma aynı şekilde çalışmalı."
```

Veya daha spesifik:

```
"Cell-o mobil uygulaması yap. 
Teknoloji: [React Native veya Flutter seç]
Tasarım: Web versiyonundaki renk paleti ve layout'u koru
Sayfalar: Onboarding → Profile Setup → Home → Experiments → Experiment Detail → Progress
Sesli Okuma: 4-7 yaş için Turkish TTS
Başarı Sistemi: 12 rozet, XP sistemi
Veri: LocalStorage yerine sqLite/provider
TabNavigation: Bottom tab bar"
```

---

**Hazır mısın? Bu özeti kullanarak mobil versiyona başlayabiliriz! 🚀**
