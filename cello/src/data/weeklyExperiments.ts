/**
 * Haftalık Deney Şablonları
 * 52 haftalık deney programı
 */

import type {
  WeeklyExperiment,
  ExperimentCategory,
  ExperimentDifficulty,
} from "../types/experimentTypes";
import { difficultyPoints } from "../types/experimentTypes";

// Tüm haftalık deneyler
export const weeklyExperiments: Omit<
  WeeklyExperiment,
  "status" | "userObservation"
>[] = [
  // HAFTA 1-4: Başlangıç - Kolay Deneyler
  {
    id: "week-1-onion",
    weekNumber: 1,
    title: "Soğan Zarı Hücrelerini Keşfet",
    titleKey: "week-1-onion.title",
    description:
      "İlk mikroskop macerana soğan zarı hücrelerini inceleyerek başla! Bitki hücrelerinin temel yapısını öğreneceksin.",
    descriptionKey: "week-1-onion.description",
    category: "Hücre Biyolojisi",
    difficulty: "kolay",
    estimatedTime: "30-45 dakika",
    points: difficultyPoints["kolay"],
    scientificName: "Allium cepa",
    taxonId: 56541, // iNaturalist onion taxon ID
    learningObjectives: [
      "Bitki hücresinin temel yapısını tanıma",
      "Hücre duvarını gözlemleme",
      "Çekirdek (nükleus) belirleme",
      "Mikroskop kullanımını öğrenme",
    ],
    materials: [
      { name: "Soğan", icon: "🧅" },
      { name: "Mikroskop", icon: "🔬" },
      { name: "Lam ve lamel", icon: "🔲" },
      { name: "İyot çözeltisi", icon: "💧", optional: true },
      { name: "Damlalık", icon: "💉" },
      { name: "Cımbız", icon: "🔧" },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: "Soğanı ikiye kes ve bir katman ayır.",
        instructionKey: "week-1-onion.steps.1.instruction",
        tip: "İç kısımdaki ince zarı kullanmak daha kolay.",
        tipKey: "week-1-onion.steps.1.tip",
      },
      {
        stepNumber: 2,
        instruction: "Cımbız yardımıyla ince, saydam zarı dikkatlice soy.",
        instructionKey: "week-1-onion.steps.2.instruction",
        duration: "2-3 dakika",
      },
      {
        stepNumber: 3,
        instruction: "Zarı lamın üzerine düzgünce yerleştir.",
        instructionKey: "week-1-onion.steps.3.instruction",
      },
      {
        stepNumber: 4,
        instruction: "Bir damla su (veya iyot çözeltisi) ekle.",
        instructionKey: "week-1-onion.steps.4.instruction",
        tip: "İyot, hücreleri daha görünür yapar.",
        tipKey: "week-1-onion.steps.4.tip",
      },
      {
        stepNumber: 5,
        instruction: "Lameli 45 derece açıyla yavaşça indir.",
        instructionKey: "week-1-onion.steps.5.instruction",
        tip: "Hava kabarcığı oluşmamasına dikkat et.",
        tipKey: "week-1-onion.steps.5.tip",
      },
      {
        stepNumber: 6,
        instruction: "Mikroskobun en düşük büyütmesiyle başla, sonra artır.",
        instructionKey: "week-1-onion.steps.6.instruction",
      },
    ],
    safetyNotes: [
      "Bıçakla dikkatli ol, büyüklerin yardımını al.",
      "İyot çözeltisi leke yapabilir, önlük giy.",
    ],
    observationGuide: [
      "Hücrelerin şekli nasıl? (dikdörtgen, kare, düzensiz)",
      "Hücre duvarını görebiliyor musun?",
      "Koyu renkli çekirdekleri (nükleus) bul.",
      "Hücrelerin boyutu yaklaşık ne kadar?",
      "Hücreler nasıl dizilmiş? (düzenli, rastgele)",
    ],
    expectedResults: [
      "Dikdörtgen şekilli hücreler göreceksin.",
      "Her hücrenin ortasında koyu bir çekirdek olacak.",
      "Hücreler tuğla duvarı gibi düzenli dizilmiş olacak.",
      "Hücre duvarı ince çizgi olarak görünecek.",
    ],
    expectedResultsKey: "week-1-onion.expectedResults",
  },

  {
    id: "week-2-salt-crystal",
    weekNumber: 2,
    title: "Tuz Kristalleri Oluştur",
    titleKey: "week-2-salt-crystal.title",
    description:
      "Tuzlu sudan kristaller büyüt ve kristal yapısını incele. Kimyanın büyülü dünyasına adım at!",
    descriptionKey: "week-2-salt-crystal.description",
    category: "Kristal Oluşumu",
    ageGroups: ["6-7", "8-9", "10-12"],
    difficulty: "kolay",
    estimatedTime: "20 dakika hazırlık + 2-3 gün bekleme",
    points: difficultyPoints["kolay"],
    parentRequired: true,
    variants: {
      simple: {
        // Küçük yaşlar için kısa ve görsel versiyon
        steps: [
          {
            stepNumber: 1,
            instruction:
              "Yarım bardak ılık su hazırla (büyükler yardım etsin).",
            instructionKey:
              "week-2-salt-crystal.variants.simple.steps.1.instruction",
          },
          {
            stepNumber: 2,
            instruction: "3 kaşık tuz ekle ve karıştır.",
            instructionKey:
              "week-2-salt-crystal.variants.simple.steps.2.instruction",
          },
          {
            stepNumber: 3,
            instruction: "Çözeltiyi küçük kaplara dök ve birini güneşe koy.",
            instructionKey:
              "week-2-salt-crystal.variants.simple.steps.3.instruction",
          },
          {
            stepNumber: 4,
            instruction:
              "Her gün kristalleri gözlemle ve büyüme fotoğrafı çek.",
            instructionKey:
              "week-2-salt-crystal.variants.simple.steps.4.instruction",
          },
        ],
        estimatedTime: "1-2 gün",
      },
      extended: {
        // Orta yaş grubu için renkli ve varyasyonlu versiyon
        steps: [
          {
            stepNumber: 1,
            instruction:
              "Yarım bardak sıcak suya 3-4 kaşık tuz ekle ve karıştır.",
            instructionKey:
              "week-2-salt-crystal.variants.extended.steps.1.instruction",
          },
          {
            stepNumber: 2,
            instruction: "Karışımı 3 küçük kaba eşit paylaştır.",
            instructionKey:
              "week-2-salt-crystal.variants.extended.steps.2.instruction",
          },
          {
            stepNumber: 3,
            instruction: "Her kaba farklı renk gıda boyası ekle.",
            instructionKey:
              "week-2-salt-crystal.variants.extended.steps.3.instruction",
          },
          {
            stepNumber: 4,
            instruction:
              "Bir kabı ip asarak kristalin ip üzerinde büyümesini dene.",
            instructionKey:
              "week-2-salt-crystal.variants.extended.steps.4.instruction",
          },
          {
            stepNumber: 5,
            instruction: "Güneşli ve sabit bir yere koy, her gün fotoğraf çek.",
            instructionKey:
              "week-2-salt-crystal.variants.extended.steps.5.instruction",
          },
          {
            stepNumber: 6,
            instruction: "Büyüyen kristalleri büyüteç veya mikroskopla incele.",
            instructionKey:
              "week-2-salt-crystal.variants.extended.steps.6.instruction",
          },
        ],
        estimatedTime: "2-4 gün",
      },
      advanced: {
        // Büyük çocuklar için daha deneysel/ölçüm odaklı versiyon
        steps: [
          {
            stepNumber: 1,
            instruction:
              "Farklı tuz konsantrasyonları hazırla (ör: düşük, orta, yüksek).",
            instructionKey:
              "week-2-salt-crystal.variants.advanced.steps.1.instruction",
          },
          {
            stepNumber: 2,
            instruction:
              "Her çözeltiyi ayrı bir kaba koy ve not al (hacim, kaşık sayısı).",
            instructionKey:
              "week-2-salt-crystal.variants.advanced.steps.2.instruction",
          },
          {
            stepNumber: 3,
            instruction:
              "Farklı kaplarda ip ve düz yüzey deneyleri yaparak şekil farklarını gözlemle.",
            instructionKey:
              "week-2-salt-crystal.variants.advanced.steps.3.instruction",
          },
          {
            stepNumber: 4,
            instruction: "Her gün kristal boyutlarını ölç ve tablo oluştur.",
            instructionKey:
              "week-2-salt-crystal.variants.advanced.steps.4.instruction",
          },
          {
            stepNumber: 5,
            instruction:
              "Fotoğraf çek ve mikroskop görüntüsü al, bulgularını raporla.",
            instructionKey:
              "week-2-salt-crystal.variants.advanced.steps.5.instruction",
          },
          {
            stepNumber: 6,
            instruction:
              "Sonuçları karşılaştır ve hangi koşul daha büyük kristal verdiğini analiz et.",
            instructionKey:
              "week-2-salt-crystal.variants.advanced.steps.6.instruction",
          },
        ],
        estimatedTime: "3-7 gün",
      },
    },
    learningObjectives: [
      "Kristal oluşumunu anlama",
      "Buharlaşma sürecini gözlemleme",
      "Düzenli geometrik yapıları tanıma",
      "Sabırlı gözlem yapma",
    ],
    materials: [
      { name: "Sofra tuzu", icon: "🧂" },
      { name: "Sıcak su", icon: "💧" },
      { name: "Cam bardak", icon: "🥛" },
      { name: "Kaşık", icon: "🥄" },
      { name: "Siyah kağıt veya tabak", icon: "📄" },
      { name: "Büyüteç", icon: "🔍" },
    ],
    // Güvenlik notu: sıcak su kullanımı, ebeveyn gözetimi vurgulanmalı
    steps: [
      {
        stepNumber: 1,
        instruction: "Yarım bardak sıcak suya 3-4 kaşık tuz ekle.",
        tip: "Su ne kadar sıcaksa, o kadar çok tuz çözer.",
        instructionKey: "week-2-salt-crystal.steps.1.instruction",
        tipKey: "week-2-salt-crystal.steps.1.tip",
      },
      {
        stepNumber: 2,
        instruction: "Tuz tamamen çözülene kadar karıştır.",
        duration: "2-3 dakika",
        instructionKey: "week-2-salt-crystal.steps.2.instruction",
      },
      {
        stepNumber: 3,
        instruction:
          "Çözeltiyi siyah kağıt üzerine ince bir tabaka halinde dök.",
        instructionKey: "week-2-salt-crystal.steps.3.instruction",
      },
      {
        stepNumber: 4,
        instruction: "Güneşli veya sıcak bir yere koy ve bekle.",
        duration: "2-3 gün",
        instructionKey: "week-2-salt-crystal.steps.4.instruction",
      },
      {
        stepNumber: 5,
        instruction: "Her gün kristallerin büyümesini gözlemle.",
        instructionKey: "week-2-salt-crystal.steps.5.instruction",
      },
      {
        stepNumber: 6,
        instruction: "Kristaller oluştuktan sonra büyüteçle incele.",
        instructionKey: "week-2-salt-crystal.steps.6.instruction",
      },
    ],
    safetyNotes: [
      "Sıcak su kullanırken dikkatli ol; küçük çocuklar mutlaka bir yetişkin gözetiminde yapmalı.",
      "Kristalleri yeme, kirli veya keskin kenarlı olabilir.",
      "Ebeveyn gözetimi önerilir: kaynar su, keskin kaplar veya uzun bekleme gerektiren adımlar olabilir.",
    ],
    observationGuide: [
      "Kristallerin şekli nasıl? (küp, dikdörtgen)",
      "Kristaller ne renk?",
      "En büyük kristal ne kadar?",
      "Kristaller nerede daha çok oluşmuş?",
      "Günden güne nasıl değişti?",
    ],
    expectedResults: [
      "Küp şeklinde kristaller göreceksin.",
      "Kristaller şeffaf veya beyaz olacak.",
      "Kenarlar düz ve düzgün olacak.",
      "Su buharlaştıkça kristaller büyüyecek.",
    ],
    expectedResultsKey: "week-2-salt-crystal.expectedResults",
  },

  {
    id: "week-3-cheek-cells",
    weekNumber: 3,
    title: "Kendi Yanak Hücrelerini İncele",
    titleKey: "week-3-cheek-cells.title",
    description:
      "Kendi vücudundaki hücreleri keşfet! Hayvan hücreleri ile bitki hücrelerinin farkını öğren.",
    descriptionKey: "week-3-cheek-cells.description",
    category: "Hücre Biyolojisi",
    difficulty: "kolay",
    estimatedTime: "25-35 dakika",
    points: difficultyPoints["kolay"],
    learningObjectives: [
      "Hayvan hücresi yapısını tanıma",
      "Bitki ve hayvan hücresi farkını anlama",
      "Hücre zarını gözlemleme",
      "Kendini bilimsel olarak keşfetme",
    ],
    materials: [
      { name: "Mikroskop", icon: "🔬" },
      { name: "Lam ve lamel", icon: "🔲" },
      { name: "Pamuklu çubuk veya temiz kaşık", icon: "🥄" },
      { name: "Metilen mavisi (veya iyot)", icon: "💧" },
      { name: "Su", icon: "💧" },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: "Ağzını suyla çalkala.",
        tip: "Yemek artıkları gözlemi zorlaştırır.",
        instructionKey: "week-3-cheek-cells.steps.1.instruction",
        tipKey: "week-3-cheek-cells.steps.1.tip",
      },
      {
        stepNumber: 2,
        instruction: "Pamuklu çubukla yanağının iç kısmını hafifçe ovala.",
        duration: "10-15 saniye",
        instructionKey: "week-3-cheek-cells.steps.2.instruction",
      },
      {
        stepNumber: 3,
        instruction: "Çubuğu lamın üzerine hafifçe sür.",
        instructionKey: "week-3-cheek-cells.steps.3.instruction",
      },
      {
        stepNumber: 4,
        instruction: "Bir damla metilen mavisi veya iyot ekle.",
        instructionKey: "week-3-cheek-cells.steps.4.instruction",
        tip: "Boya hücreleri görünür yapar.",
        tipKey: "week-3-cheek-cells.steps.4.tip",
      },
      {
        stepNumber: 5,
        instruction: "Lameli yavaşça kapat.",
        instructionKey: "week-3-cheek-cells.steps.5.instruction",
      },
      {
        stepNumber: 6,
        instruction: "Düşük büyütmeyle başla, sonra 40x veya 100x kullan.",
        instructionKey: "week-3-cheek-cells.steps.6.instruction",
      },
    ],
    safetyNotes: [
      "Çubuğu sert bastırma, yanağını incitme.",
      "Metilen mavisi leke yapar, dikkatli ol.",
      "Kullanılan malzemeleri paylaşma.",
    ],
    observationGuide: [
      "Hücrelerin şekli nasıl? (yuvarlak, düzensiz)",
      "Hücre duvarı var mı? (Hayvan hücresinde olmaz!)",
      "Çekirdeği bulabildin mi?",
      "Soğan hücresinden farkı ne?",
    ],
    expectedResults: [
      "Düzensiz şekilli, yassı hücreler göreceksin.",
      "Hücre duvarı YOK, sadece ince zar var.",
      "Her hücrede bir çekirdek olacak.",
      "Hücreler soğan hücresinden daha küçük.",
    ],
    expectedResultsKey: "week-3-cheek-cells.expectedResults",
  },

  {
    id: "week-4-elodea",
    weekNumber: 4,
    title: "Su Bitkisinde Kloroplast Hareketi",
    titleKey: "week-4-elodea.title",
    description:
      "Elodea (su yosunu) yaprağında kloroplastların hareketini gözlemle. Canlı hücrelerdeki aktiviteyi gör!",
    descriptionKey: "week-4-elodea.description",
    category: "Bitki Anatomisi",
    difficulty: "kolay",
    estimatedTime: "30-40 dakika",
    points: difficultyPoints["kolay"],
    scientificName: "Elodea canadensis",
    taxonId: 50436, // iNaturalist Elodea taxon ID
    learningObjectives: [
      "Kloroplastları tanıma",
      "Sitoplazmik akışı gözlemleme",
      "Fotosentez organellerini anlama",
      "Canlı hücre dinamiklerini görme",
    ],
    materials: [
      { name: "Elodea (su bitkisi)", icon: "🌿" },
      { name: "Mikroskop", icon: "🔬" },
      { name: "Lam ve lamel", icon: "🔲" },
      { name: "Su", icon: "💧" },
      { name: "Lamba (ışık kaynağı)", icon: "💡", optional: true },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: "Elodea bitkisinden taze, yeşil bir yaprak kopar.",
        tip: "Genç yapraklar daha iyi sonuç verir.",
        instructionKey: "week-4-elodea.steps.1.instruction",
        tipKey: "week-4-elodea.steps.1.tip",
      },
      {
        stepNumber: 2,
        instruction: "Yaprağı bir damla su içinde lama yerleştir.",
        instructionKey: "week-4-elodea.steps.2.instruction",
      },
      {
        stepNumber: 3,
        instruction: "Lameli kapat.",
        instructionKey: "week-4-elodea.steps.3.instruction",
      },
      {
        stepNumber: 4,
        instruction: "10x büyütmeyle başla, sonra 40x kullan.",
        instructionKey: "week-4-elodea.steps.4.instruction",
      },
      {
        stepNumber: 5,
        instruction: "Yeşil noktacıkları (kloroplastlar) bul.",
        instructionKey: "week-4-elodea.steps.5.instruction",
      },
      {
        stepNumber: 6,
        instruction: "5-10 dakika bekle ve hareketi gözlemle.",
        tip: "Işık altında hareket daha belirgin olur.",
        instructionKey: "week-4-elodea.steps.6.instruction",
        tipKey: "week-4-elodea.steps.6.tip",
      },
    ],
    safetyNotes: [
      "Elodea akvaryum mağazalarından alınabilir.",
      "Bitki zehirli değildir ama yenmemeli.",
    ],
    observationGuide: [
      "Yeşil kloroplastları görebiliyor musun?",
      "Kloroplastlar hareket ediyor mu?",
      "Hareketin yönü ne?",
      "Hücrelerin şekli nasıl?",
      "Hücre duvarını görebiliyor musun?",
    ],
    expectedResults: [
      "Dikdörtgen hücreler göreceksin.",
      "İçlerinde yeşil noktalar (kloroplastlar) olacak.",
      "Kloroplastlar hücre kenarı boyunca hareket edecek.",
      'Bu harekete "sitoplazmik akış" denir.',
    ],
    expectedResultsKey: "week-4-elodea.expectedResults",
  },

  // HAFTA 5-8: Orta Seviye Deneyler
  {
    id: "week-5-pond-water",
    weekNumber: 5,
    title: "Havuz Suyunda Mikroskobik Yaşam",
    titleKey: "week-5-pond-water.title",
    description:
      "Bir damla havuz suyunda saklı olan mikroskobik canlıları keşfet! Paramecium, amoeba ve rotifer avına çık.",
    descriptionKey: "week-5-pond-water.description",
    category: "Mikroorganizmalar",
    difficulty: "orta",
    estimatedTime: "45-60 dakika",
    points: difficultyPoints["orta"],
    learningObjectives: [
      "Tek hücreli canlıları tanıma",
      "Mikroorganizma çeşitliliğini anlama",
      "Hareket biçimlerini gözlemleme",
      "Doğal yaşam alanlarını keşfetme",
    ],
    materials: [
      { name: "Havuz/gölet suyu", icon: "💧" },
      { name: "Mikroskop", icon: "🔬" },
      { name: "Lam ve lamel", icon: "🔲" },
      { name: "Damlalık", icon: "💉" },
      { name: "Kavanoz", icon: "🫙" },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction:
          "Havuz veya gölet kenarından su topla. Yosunlu alanlar daha iyi.",
        tip: "Biraz yaprak ve tortu da al.",
        instructionKey: "week-5-pond-water.steps.1.instruction",
        tipKey: "week-5-pond-water.steps.1.tip",
      },
      {
        stepNumber: 2,
        instruction: "Suyu birkaç saat veya gece boyunca beklet.",
        instructionKey: "week-5-pond-water.steps.2.instruction",
      },
      {
        stepNumber: 3,
        instruction: "Damlalıkla dipten ve yüzeyden örnek al.",
        instructionKey: "week-5-pond-water.steps.3.instruction",
      },
      {
        stepNumber: 4,
        instruction: "Bir damla suyu lama koy, lameli kapat.",
        instructionKey: "week-5-pond-water.steps.4.instruction",
      },
      {
        stepNumber: 5,
        instruction: "Düşük büyütmeyle tarama yap, sonra yakınlaş.",
        instructionKey: "week-5-pond-water.steps.5.instruction",
      },
      {
        stepNumber: 6,
        instruction: "Hareketli canlıları bul ve takip et!",
        instructionKey: "week-5-pond-water.steps.6.instruction",
      },
    ],
    safetyNotes: [
      "Havuz suyu içme!",
      "Ellerini yıka.",
      "Güvenli yerlerden su topla.",
    ],
    observationGuide: [
      "Kaç farklı canlı türü gördün?",
      "Nasıl hareket ediyorlar? (yüzme, sürünme, zıplama)",
      "Boyutları ne kadar farklı?",
      "Hangileri tek hücreli, hangileri çok hücreli?",
    ],
    expectedResults: [
      "Paramecium: Terlik şeklinde, hızlı yüzer.",
      "Amoeba: Şekilsiz, yavaş hareket eder.",
      "Rotifer: Dönen kirpikleri vardır.",
      "Algler: Yeşil, genellikle hareketsiz.",
    ],
    expectedResultsKey: "week-5-pond-water.expectedResults",
  },

  {
    id: "week-6-yeast",
    weekNumber: 6,
    title: "Maya Hücrelerini Gözlemle",
    titleKey: "week-6-yeast.title",
    description:
      "Ekmek mayasının sırrını keşfet! Tek hücreli mantarların tomurcuklanarak çoğalmasını gör.",
    descriptionKey: "week-6-yeast.description",
    category: "Mantarlar",
    difficulty: "orta",
    estimatedTime: "40-50 dakika",
    points: difficultyPoints["orta"],
    scientificName: "Saccharomyces cerevisiae",
    taxonId: 175541,
    learningObjectives: [
      "Mantarların hücre yapısını tanıma",
      "Tomurcuklanma ile üreme",
      "Fermantasyonu anlama",
      "Canlı gözlem yapma",
    ],
    materials: [
      { name: "Kuru maya (instant)", icon: "🧫" },
      { name: "Ilık su", icon: "💧" },
      { name: "Şeker", icon: "🍬" },
      { name: "Mikroskop", icon: "🔬" },
      { name: "Lam ve lamel", icon: "🔲" },
      { name: "Metilen mavisi", icon: "💧", optional: true },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: "Yarım bardak ılık suya 1 çay kaşığı şeker ekle.",
        tip: "Su çok sıcak olmasın (40°C ideal).",
        instructionKey: "week-6-yeast.steps.1.instruction",
        tipKey: "week-6-yeast.steps.1.tip",
      },
      {
        stepNumber: 2,
        instruction: "Bir tutam kuru maya ekle ve karıştır.",
        instructionKey: "week-6-yeast.steps.2.instruction",
      },
      {
        stepNumber: 3,
        instruction: "10-15 dakika bekle.",
        duration: "10-15 dakika",
        tip: "Köpürmeye başlayacak!",
        instructionKey: "week-6-yeast.steps.3.instruction",
        tipKey: "week-6-yeast.steps.3.tip",
      },
      {
        stepNumber: 4,
        instruction: "Bir damla maya çözeltisini lama koy.",
        instructionKey: "week-6-yeast.steps.4.instruction",
      },
      {
        stepNumber: 5,
        instruction: "İstersen bir damla metilen mavisi ekle.",
        instructionKey: "week-6-yeast.steps.5.instruction",
      },
      {
        stepNumber: 6,
        instruction: "40x büyütme ile incele.",
        instructionKey: "week-6-yeast.steps.6.instruction",
      },
    ],
    observationGuide: [
      "Maya hücrelerinin şekli nasıl?",
      "Tomurcuklanan hücreler bulabildin mi?",
      "Hücrelerin boyutu ne kadar?",
      "Canlı ve ölü hücreleri ayırt edebiliyor musun?",
    ],
    expectedResults: [
      "Oval veya yuvarlak hücreler göreceksin.",
      "Bazı hücrelerde küçük tomurcuklar olacak.",
      "Aktif mayalar hareket edebilir.",
      "Metilen mavisi ile ölü hücreler mavi görünür.",
    ],
    expectedResultsKey: "week-6-yeast.expectedResults",
  },

  {
    id: "week-7-stomata",
    weekNumber: 7,
    title: "Yaprak Gözeneklerini (Stoma) Keşfet",
    titleKey: "week-7-stomata.title",
    description:
      "Bitkilerin nefes aldığı gözenekleri bul! Stoma hücreleri ve koruyucu hücreleri gözlemle.",
    descriptionKey: "week-7-stomata.description",
    category: "Bitki Anatomisi",
    difficulty: "orta",
    estimatedTime: "35-45 dakika",
    points: difficultyPoints["orta"],
    learningObjectives: [
      "Stoma yapısını tanıma",
      "Gaz alışverişini anlama",
      "Koruyucu hücreleri gözlemleme",
      "Yaprak anatomisini keşfetme",
    ],
    materials: [
      { name: "Taze yaprak (ıspanak veya marul)", icon: "🥬" },
      { name: "Mikroskop", icon: "🔬" },
      { name: "Lam ve lamel", icon: "🔲" },
      { name: "Tırnak cilası (şeffaf)", icon: "💅" },
      { name: "Şeffaf bant", icon: "📎" },
      { name: "Su", icon: "💧" },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: "Yaprağın ALT yüzeyine ince bir kat tırnak cilası sür.",
        tip: "Stomalar genellikle yaprak altında bulunur.",
        instructionKey: "week-7-stomata.steps.1.instruction",
        tipKey: "week-7-stomata.steps.1.tip",
      },
      {
        stepNumber: 2,
        instruction: "Cilanın tamamen kurumasını bekle.",
        duration: "5-10 dakika",
        instructionKey: "week-7-stomata.steps.2.instruction",
      },
      {
        stepNumber: 3,
        instruction: "Kuruyan cilayı şeffaf bantla dikkatlice soy.",
        instructionKey: "week-7-stomata.steps.3.instruction",
      },
      {
        stepNumber: 4,
        instruction: "Bandı lama yapıştır.",
        instructionKey: "week-7-stomata.steps.4.instruction",
      },
      {
        stepNumber: 5,
        instruction: "10x, sonra 40x büyütme ile incele.",
        instructionKey: "week-7-stomata.steps.5.instruction",
      },
    ],
    observationGuide: [
      "Stomalar nasıl görünüyor? (ağız şeklinde)",
      "Koruyucu hücrelerin şekli nasıl?",
      "Stomalar açık mı kapalı mı?",
      "Bir alanda kaç stoma var?",
    ],
    expectedResults: [
      "Dudak şeklinde stoma gözenekleri göreceksin.",
      "Her stomanın yanında iki böbrek şekilli koruyucu hücre var.",
      "Stomalar açık veya kapalı olabilir.",
      "Yaprak yüzeyinde düzenli dağılmış olacaklar.",
    ],
    expectedResultsKey: "week-7-stomata.expectedResults",
  },

  {
    id: "week-8-blood-cells",
    weekNumber: 8,
    title: "Kan Hücrelerini Tanı (Hazır Preparat)",
    titleKey: "week-8-blood-cells.title",
    description:
      "Hazır kan preparatı ile alyuvar, akyuvar ve trombositleri tanı. İnsan vücudunun savunma sistemini keşfet!",
    descriptionKey: "week-8-blood-cells.description",
    category: "Hücre Biyolojisi",
    difficulty: "orta",
    estimatedTime: "30-40 dakika",
    points: difficultyPoints["orta"],
    learningObjectives: [
      "Kan hücresi türlerini tanıma",
      "Alyuvar ve akyuvar farkını anlama",
      "Kan yapısını öğrenme",
      "Hazır preparat kullanma",
    ],
    materials: [
      { name: "Hazır kan preparatı", icon: "🔬" },
      { name: "Mikroskop", icon: "🔬" },
      { name: "Yağ immersiyon objektifi (100x)", icon: "🔭", optional: true },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: "Hazır kan preparatını mikroskoba yerleştir.",
        tip: "Bu deneyler için hazır preparat kullanmak güvenlidir.",
        instructionKey: "week-8-blood-cells.steps.1.instruction",
        tipKey: "week-8-blood-cells.steps.1.tip",
      },
      {
        stepNumber: 2,
        instruction: "10x ile odakla, sonra 40x geç.",
        instructionKey: "week-8-blood-cells.steps.2.instruction",
      },
      {
        stepNumber: 3,
        instruction: "Alyuvarları (kırmızı kan hücreleri) bul.",
        instructionKey: "week-8-blood-cells.steps.3.instruction",
      },
      {
        stepNumber: 4,
        instruction: "Akyuvarları (beyaz kan hücreleri) ara.",
        instructionKey: "week-8-blood-cells.steps.4.instruction",
        tip: "Daha büyük ve mor çekirdekli olacaklar.",
        tipKey: "week-8-blood-cells.steps.4.tip",
      },
      {
        stepNumber: 5,
        instruction: "Farklı akyuvar türlerini ayırt etmeye çalış.",
        instructionKey: "week-8-blood-cells.steps.5.instruction",
      },
    ],
    safetyNotes: ["Hazır preparat kullan, asla kendi kanınla deney yapma!"],
    observationGuide: [
      "Alyuvarların şekli nasıl? (çekirdeksiz, disk şeklinde)",
      "Akyuvarları bulabildin mi? (çekirdekli, daha büyük)",
      "Alyuvar ve akyuvar oranı nedir?",
      "Farklı akyuvar türleri görebildin mi?",
    ],
    expectedResults: [
      "Çok sayıda kırmızı, disk şekilli alyuvar.",
      "Ara sıra mor çekirdekli büyük akyuvarlar.",
      "Alyuvarların çekirdeği YOK.",
      "Akyuvarların çekirdeği belirgin.",
    ],
    expectedResultsKey: "week-8-blood-cells.expectedResults",
  },

  // HAFTA 9-12: Daha Zorlu Deneyler
  {
    id: "week-9-dna-extraction",
    weekNumber: 9,
    title: "Evde DNA İzolasyonu",
    titleKey: "week-9-dna-extraction.title",
    description:
      "Muzdan DNA çıkar ve gözle görebilebilen DNA ipliklerini gözlemle! Moleküler biyolojiye giriş.",
    descriptionKey: "week-9-dna-extraction.description",
    category: "Kimyasal Reaksiyon",
    difficulty: "zor",
    estimatedTime: "45-60 dakika",
    points: difficultyPoints["zor"],
    learningObjectives: [
      "DNA yapısını anlama",
      "Hücre parçalama tekniği",
      "Çöktürme yöntemi",
      "Biyokimyasal işlem adımları",
    ],
    materials: [
      { name: "Muz (veya çilek)", icon: "🍌" },
      { name: "Bulaşık deterjanı", icon: "🧴" },
      { name: "Tuz", icon: "🧂" },
      { name: "Soğuk alkol (%70 veya %90)", icon: "🧪" },
      { name: "Su", icon: "💧" },
      { name: "Plastik poşet", icon: "🛍️" },
      { name: "Süzgeç veya filtre kağıdı", icon: "📄" },
      { name: "Cam bardak", icon: "🥛" },
      { name: "Tahta çubuk", icon: "🥢" },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: "Yarım muzu poşette iyice ez.",
        duration: "2-3 dakika",
        instructionKey: "week-9-dna-extraction.steps.1.instruction",
      },
      {
        stepNumber: 2,
        instruction:
          "Yarım bardak su, 1 çay kaşığı tuz ve 1 yemek kaşığı deterjan karıştır.",
        tip: "Bu karışım hücre zarını parçalar.",
        instructionKey: "week-9-dna-extraction.steps.2.instruction",
        tipKey: "week-9-dna-extraction.steps.2.tip",
      },
      {
        stepNumber: 3,
        instruction: "Karışımı ezilmiş muza ekle, poşette karıştır.",
        duration: "5 dakika",
        instructionKey: "week-9-dna-extraction.steps.3.instruction",
      },
      {
        stepNumber: 4,
        instruction: "Karışımı süzgeçten geçir, sıvıyı bardağa al.",
        instructionKey: "week-9-dna-extraction.steps.4.instruction",
      },
      {
        stepNumber: 5,
        instruction: "Bardağın üstüne yavaşça soğuk alkol ekle.",
        tip: "Alkolü bardak kenarından yavaşça akıt.",
        instructionKey: "week-9-dna-extraction.steps.5.instruction",
        tipKey: "week-9-dna-extraction.steps.5.tip",
      },
      {
        stepNumber: 6,
        instruction: "Birkaç dakika bekle, beyaz DNA ipliklerini gör!",
        duration: "3-5 dakika",
        instructionKey: "week-9-dna-extraction.steps.6.instruction",
      },
      {
        stepNumber: 7,
        instruction: "Tahta çubukla DNA ipliklerini topla.",
        instructionKey: "week-9-dna-extraction.steps.7.instruction",
      },
    ],
    safetyNotes: [
      "Alkolü yüzüne yaklaştırma.",
      "Büyüklerin gözetiminde yap.",
      "Elde edilen DNA'yı yeme!",
    ],
    observationGuide: [
      "DNA hangi renkte? (beyaz, saydam)",
      "İplikler nasıl görünüyor?",
      "Ne kadar DNA elde ettin?",
      "Alkol tabakası ile su tabakası arasında ne var?",
    ],
    expectedResults: [
      "Beyazımsı, ipliksi DNA göreceksin.",
      "DNA alkol ve su arasında toplanacak.",
      "Çubukla sarılarak toplanabilir.",
      "Bu gerçek DNA'dır!",
    ],
    expectedResultsKey: "week-9-dna-extraction.expectedResults",
  },

  {
    id: "week-10-paramecium",
    weekNumber: 10,
    title: "Paramecium Davranışlarını İncele",
    titleKey: "week-10-paramecium.title",
    description:
      "Paramecium'un engelden kaçma, beslenme ve çoğalma davranışlarını gözlemle.",
    descriptionKey: "week-10-paramecium.description",
    category: "Mikroorganizmalar",
    difficulty: "zor",
    estimatedTime: "60 dakika",
    points: difficultyPoints["zor"],
    scientificName: "Paramecium caudatum",
    taxonId: 129919,
    learningObjectives: [
      "Tek hücreli davranışları anlama",
      "Kirpikli hareket mekanizması",
      "Beslenme vakuolü gözlemi",
      "Uyaran tepkilerini inceleme",
    ],
    materials: [
      { name: "Paramecium kültürü veya havuz suyu", icon: "🦠" },
      { name: "Mikroskop", icon: "🔬" },
      { name: "Lam ve lamel", icon: "🔲" },
      { name: "Pamuk lifleri", icon: "🧶" },
      { name: "Tuz çözeltisi (zayıf)", icon: "🧂" },
      { name: "Maya süspansiyonu", icon: "🧫" },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: "Lama bir damla kültür suyu koy.",
        instructionKey: "week-10-paramecium.steps.1.instruction",
      },
      {
        stepNumber: 2,
        instruction: "Birkaç pamuk lifi ekle.",
        tip: "Bu Paramecium hareketini yavaşlatır.",
        instructionKey: "week-10-paramecium.steps.2.instruction",
        tipKey: "week-10-paramecium.steps.2.tip",
      },
      {
        stepNumber: 3,
        instruction: "Lameli kapat ve 10x ile bak.",
        instructionKey: "week-10-paramecium.steps.3.instruction",
      },
      {
        stepNumber: 4,
        instruction: "Paramecium bul ve 40x ile izle.",
        instructionKey: "week-10-paramecium.steps.4.instruction",
      },
      {
        stepNumber: 5,
        instruction: "Beslenme için bir damla maya ekle.",
        tip: "Lamel kenarından ekle.",
        instructionKey: "week-10-paramecium.steps.5.instruction",
        tipKey: "week-10-paramecium.steps.5.tip",
      },
      {
        stepNumber: 6,
        instruction: "Uyaran tepkisi için tuz çözeltisi ekle.",
        instructionKey: "week-10-paramecium.steps.6.instruction",
      },
    ],
    observationGuide: [
      "Paramecium nasıl hareket ediyor?",
      "Engele çarpınca ne yapıyor?",
      "Besin vakuollerini görebiliyor musun?",
      "Tuza tepkisi ne oldu?",
    ],
    expectedResults: [
      "Terlik şeklinde hızlı yüzen canlı.",
      "Engele çarpınca geri gidip yön değiştirir.",
      "İçinde yuvarlak besin vakuolleri görülebilir.",
      "Tuzdan kaçarak yüzecektir.",
    ],
    expectedResultsKey: "week-10-paramecium.expectedResults",
  },

  {
    id: "week-11-mitosis",
    weekNumber: 11,
    title: "Hücre Bölünmesini Gözlemle (Mitoz)",
    titleKey: "week-11-mitosis.title",
    description:
      "Soğan kök ucu preparatında mitoz bölünme evrelerini bul ve tanımla.",
    descriptionKey: "week-11-mitosis.description",
    category: "Hücre Biyolojisi",
    difficulty: "zor",
    estimatedTime: "45-60 dakika",
    points: difficultyPoints["zor"],
    learningObjectives: [
      "Mitoz evrelerini tanıma (profaz, metafaz, anafaz, telofaz)",
      "Kromozomları gözlemleme",
      "Hücre döngüsünü anlama",
    ],
    materials: [
      { name: "Soğan kök ucu hazır preparatı", icon: "🧅" },
      { name: "Mikroskop", icon: "🔬" },
      { name: "Çizim kağıdı", icon: "📄" },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: "Hazır soğan kök ucu preparatını mikroskoba yerleştir.",
        instructionKey: "week-11-mitosis.steps.1.instruction",
      },
      {
        stepNumber: 2,
        instruction: "10x ile odakla, kök ucu meristem bölgesini bul.",
        tip: "Küçük, yoğun hücreler olan bölge.",
        instructionKey: "week-11-mitosis.steps.2.instruction",
        tipKey: "week-11-mitosis.steps.2.tip",
      },
      {
        stepNumber: 3,
        instruction: "40x ile mitoz geçiren hücreleri ara.",
        instructionKey: "week-11-mitosis.steps.3.instruction",
      },
      {
        stepNumber: 4,
        instruction: "Her mitoz evresini bulmaya çalış ve çiz.",
        instructionKey: "week-11-mitosis.steps.4.instruction",
      },
    ],
    observationGuide: [
      "Interfaz hücreleri nasıl görünüyor?",
      "Profazda kromozomlar nasıl?",
      "Metafazda kromozomlar nerede dizilmiş?",
      "Anafaz ve telofazı bulabildin mi?",
    ],
    expectedResults: [
      "Çoğu hücre interfazda, çekirdek belirgin.",
      "Profazda çekirdek zarı kaybolur, kromozomlar görünür.",
      "Metafazda kromozomlar ortada dizili.",
      "Anafazda kromozomlar kutuplara çekilir.",
      "Telofazda iki yeni çekirdek oluşur.",
    ],
    expectedResultsKey: "week-11-mitosis.expectedResults",
  },

  {
    id: "week-12-bacteria",
    weekNumber: 12,
    title: "Yoğurttaki Bakterileri Keşfet",
    titleKey: "week-12-bacteria.title",
    description:
      "Probiyotik yoğurttaki faydalı bakterileri gözlemle. Lactobacillus dünyasına dal!",
    descriptionKey: "week-12-bacteria.description",
    category: "Mikroorganizmalar",
    difficulty: "orta",
    estimatedTime: "30-40 dakika",
    points: difficultyPoints["orta"],
    scientificName: "Lactobacillus delbrueckii",
    taxonId: 128712,
    learningObjectives: [
      "Bakteri morfolojisini tanıma",
      "Faydalı bakterileri anlama",
      "Fermantasyon sürecini öğrenme",
    ],
    materials: [
      { name: "Probiyotik yoğurt", icon: "🥛" },
      { name: "Mikroskop", icon: "🔬" },
      { name: "Lam ve lamel", icon: "🔲" },
      { name: "Metilen mavisi veya safranin", icon: "💧" },
      { name: "Su", icon: "💧" },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: "Kürdan ucuyla az miktarda yoğurt al.",
        instructionKey: "week-12-bacteria.steps.1.instruction",
      },
      {
        stepNumber: 2,
        instruction: "Lam üzerinde bir damla su ile karıştır.",
        instructionKey: "week-12-bacteria.steps.2.instruction",
      },
      {
        stepNumber: 3,
        instruction: "Çok ince bir tabaka oluştur, havada kurut.",
        instructionKey: "week-12-bacteria.steps.3.instruction",
      },
      {
        stepNumber: 4,
        instruction: "Üzerine bir damla metilen mavisi ekle, 1 dakika bekle.",
        instructionKey: "week-12-bacteria.steps.4.instruction",
      },
      {
        stepNumber: 5,
        instruction: "Suyla nazikçe yıka ve kurut.",
        instructionKey: "week-12-bacteria.steps.5.instruction",
      },
      {
        stepNumber: 6,
        instruction: "100x (yağ immersiyon) ile incele.",
        tip: "40x ile de görebilirsin ama zor olur.",
        instructionKey: "week-12-bacteria.steps.6.instruction",
        tipKey: "week-12-bacteria.steps.6.tip",
      },
    ],
    observationGuide: [
      "Bakterilerin şekli nasıl? (çubuk, yuvarlak)",
      "Nasıl dizilmişler? (tek, zincir, küme)",
      "Ne kadar küçükler?",
    ],
    expectedResults: [
      "Çubuk şekilli (basil) bakteriler.",
      "Zincir halinde dizilmiş olabilirler.",
      "Çok küçük, yüksek büyütme gerektirir.",
    ],
    expectedResultsKey: "week-12-bacteria.expectedResults",
  },
];

// Hafta numarasına göre deney getir
export function getExperimentByWeek(
  weekNumber: number
): Omit<WeeklyExperiment, "status" | "userObservation"> | null {
  return weeklyExperiments.find((e) => e.weekNumber === weekNumber) || null;
}

// Kategoriye göre deneyleri getir
export function getExperimentsByCategory(
  category: ExperimentCategory
): Omit<WeeklyExperiment, "status" | "userObservation">[] {
  return weeklyExperiments.filter((e) => e.category === category);
}

// Zorluğa göre deneyleri getir
export function getExperimentsByDifficulty(
  difficulty: ExperimentDifficulty
): Omit<WeeklyExperiment, "status" | "userObservation">[] {
  return weeklyExperiments.filter((e) => e.difficulty === difficulty);
}

export default weeklyExperiments;

// For each experiment, update materials:
weeklyExperiments.forEach((exp) => {
  if (Array.isArray(exp.materials)) {
    exp.materials = exp.materials.map((mat, idx) => ({
      ...mat,
      nameKey: `${exp.id}.materials.${idx}.name`,
    }));
  }
});
