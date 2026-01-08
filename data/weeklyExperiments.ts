/**
 * Haftalık Deney Şablonları
 * 52 haftalık deney programı
 */

import {
  WeeklyExperiment,
  ExperimentCategory,
  ExperimentDifficulty,
  difficultyPoints,
} from '@/types/experimentTypes';

// Tüm haftalık deneyler
export const weeklyExperiments: Omit<
  WeeklyExperiment,
  'status' | 'userObservation'
>[] = [
  // HAFTA 1-4: Başlangıç - Kolay Deneyler
  {
    id: 'week-1-onion',
    weekNumber: 1,
    title: 'Soğan Zarı Hücrelerini Keşfet',
    description:
      'İlk mikroskop macerana soğan zarı hücrelerini inceleyerek başla! Bitki hücrelerinin temel yapısını öğreneceksin.',
    category: 'Hücre Biyolojisi',
    difficulty: 'kolay',
    estimatedTime: '30-45 dakika',
    points: difficultyPoints['kolay'],
    scientificName: 'Allium cepa',
    taxonId: 56541, // iNaturalist onion taxon ID
    learningObjectives: [
      'Bitki hücresinin temel yapısını tanıma',
      'Hücre duvarını gözlemleme',
      'Çekirdek (nükleus) belirleme',
      'Mikroskop kullanımını öğrenme',
    ],
    materials: [
      { name: 'Soğan', icon: '🧅' },
      { name: 'Mikroskop', icon: '🔬' },
      { name: 'Lam ve lamel', icon: '🔲' },
      { name: 'İyot çözeltisi', icon: '💧', optional: true },
      { name: 'Damlalık', icon: '💉' },
      { name: 'Cımbız', icon: '🔧' },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Soğanı ikiye kes ve bir katman ayır.',
        tip: 'İç kısımdaki ince zarı kullanmak daha kolay.',
      },
      {
        stepNumber: 2,
        instruction: 'Cımbız yardımıyla ince, saydam zarı dikkatlice soy.',
        duration: '2-3 dakika',
      },
      {
        stepNumber: 3,
        instruction: 'Zarı lamın üzerine düzgünce yerleştir.',
      },
      {
        stepNumber: 4,
        instruction: 'Bir damla su (veya iyot çözeltisi) ekle.',
        tip: 'İyot, hücreleri daha görünür yapar.',
      },
      {
        stepNumber: 5,
        instruction: 'Lameli 45 derece açıyla yavaşça indir.',
        tip: 'Hava kabarcığı oluşmamasına dikkat et.',
      },
      {
        stepNumber: 6,
        instruction: 'Mikroskobun en düşük büyütmesiyle başla, sonra artır.',
      },
    ],
    safetyNotes: [
      'Bıçakla dikkatli ol, büyüklerin yardımını al.',
      'İyot çözeltisi leke yapabilir, önlük giy.',
    ],
    observationGuide: [
      'Hücrelerin şekli nasıl? (dikdörtgen, kare, düzensiz)',
      'Hücre duvarını görebiliyor musun?',
      'Koyu renkli çekirdekleri (nükleus) bul.',
      'Hücrelerin boyutu yaklaşık ne kadar?',
      'Hücreler nasıl dizilmiş? (düzenli, rastgele)',
    ],
    expectedResults: [
      'Dikdörtgen şekilli hücreler göreceksin.',
      'Her hücrenin ortasında koyu bir çekirdek olacak.',
      'Hücreler tuğla duvarı gibi düzenli dizilmiş olacak.',
      'Hücre duvarı ince çizgi olarak görünecek.',
    ],
  },

  {
    id: 'week-2-salt-crystal',
    weekNumber: 2,
    title: 'Tuz Kristalleri Oluştur',
    description:
      'Tuzlu sudan kristaller büyüt ve kristal yapısını incele. Kimyanın büyülü dünyasına adım at!',
    category: 'Kristal Oluşumu',
    ageGroups: ['6-7', '8-9', '10-12'],
    difficulty: 'kolay',
    estimatedTime: '20 dakika hazırlık + 2-3 gün bekleme',
    points: difficultyPoints['kolay'],
    parentRequired: true,
    variants: {
      simple: {
        // Küçük yaşlar için kısa ve görsel versiyon
        steps: [
          { stepNumber: 1, instruction: 'Yarım bardak ılık su hazırla (büyükler yardım etsin).' },
          { stepNumber: 2, instruction: '3 kaşık tuz ekle ve karıştır.' },
          { stepNumber: 3, instruction: 'Çözeltiyi küçük kaplara dök ve birini güneşe koy.' },
          { stepNumber: 4, instruction: 'Her gün kristalleri gözlemle ve büyüme fotoğrafı çek.' },
        ],
        estimatedTime: '1-2 gün',
      },
      extended: {
        // Orta yaş grubu için renkli ve varyasyonlu versiyon
        steps: [
          { stepNumber: 1, instruction: 'Yarım bardak sıcak suya 3-4 kaşık tuz ekle ve karıştır.' },
          { stepNumber: 2, instruction: 'Karışımı 3 küçük kaba eşit paylaştır.' },
          { stepNumber: 3, instruction: 'Her kaba farklı renk gıda boyası ekle.' },
          { stepNumber: 4, instruction: 'Bir kabı ip asarak kristalin ip üzerinde büyümesini dene.' },
          { stepNumber: 5, instruction: 'Güneşli ve sabit bir yere koy, her gün fotoğraf çek.' },
          { stepNumber: 6, instruction: 'Büyüyen kristalleri büyüteç veya mikroskopla incele.' },
        ],
        estimatedTime: '2-4 gün',
      },
      advanced: {
        // Büyük çocuklar için daha deneysel/ölçüm odaklı versiyon
        steps: [
          { stepNumber: 1, instruction: 'Farklı tuz konsantrasyonları hazırla (ör: düşük, orta, yüksek).' },
          { stepNumber: 2, instruction: 'Her çözeltiyi ayrı bir kaba koy ve not al (hacim, kaşık sayısı).' },
          { stepNumber: 3, instruction: 'Farklı kaplarda ip ve düz yüzey deneyleri yaparak şekil farklarını gözlemle.' },
          { stepNumber: 4, instruction: 'Her gün kristal boyutlarını ölç ve tablo oluştur.' },
          { stepNumber: 5, instruction: 'Fotoğraf çek ve mikroskop görüntüsü al, bulgularını raporla.' },
          { stepNumber: 6, instruction: 'Sonuçları karşılaştır ve hangi koşul daha büyük kristal verdiğini analiz et.' },
        ],
        estimatedTime: '3-7 gün',
      },
    },
    learningObjectives: [
      'Kristal oluşumunu anlama',
      'Buharlaşma sürecini gözlemleme',
      'Düzenli geometrik yapıları tanıma',
      'Sabırlı gözlem yapma',
    ],
    materials: [
      { name: 'Sofra tuzu', icon: '🧂' },
      { name: 'Sıcak su', icon: '💧' },
      { name: 'Cam bardak', icon: '🥛' },
      { name: 'Kaşık', icon: '🥄' },
      { name: 'Siyah kağıt veya tabak', icon: '📄' },
      { name: 'Büyüteç', icon: '🔍' },
    ],
    // Güvenlik notu: sıcak su kullanımı, ebeveyn gözetimi vurgulanmalı
    steps: [
      {
        stepNumber: 1,
        instruction: 'Yarım bardak sıcak suya 3-4 kaşık tuz ekle.',
        tip: 'Su ne kadar sıcaksa, o kadar çok tuz çözer.',
      },
      {
        stepNumber: 2,
        instruction: 'Tuz tamamen çözülene kadar karıştır.',
        duration: '2-3 dakika',
      },
      {
        stepNumber: 3,
        instruction:
          'Çözeltiyi siyah kağıt üzerine ince bir tabaka halinde dök.',
      },
      {
        stepNumber: 4,
        instruction: 'Güneşli veya sıcak bir yere koy ve bekle.',
        duration: '2-3 gün',
      },
      {
        stepNumber: 5,
        instruction: 'Her gün kristallerin büyümesini gözlemle.',
      },
      {
        stepNumber: 6,
        instruction: 'Kristaller oluştuktan sonra büyüteçle incele.',
      },
    ],
    safetyNotes: [
      'Sıcak su kullanırken dikkatli ol; küçük çocuklar mutlaka bir yetişkin gözetiminde yapmalı.',
      'Kristalleri yeme, kirli veya keskin kenarlı olabilir.',
      'Ebeveyn gözetimi önerilir: kaynar su, keskin kaplar veya uzun bekleme gerektiren adımlar olabilir.',
    ],
    observationGuide: [
      'Kristallerin şekli nasıl? (küp, dikdörtgen)',
      'Kristaller ne renk?',
      'En büyük kristal ne kadar?',
      'Kristaller nerede daha çok oluşmuş?',
      'Günden güne nasıl değişti?',
    ],
    expectedResults: [
      'Küp şeklinde kristaller göreceksin.',
      'Kristaller şeffaf veya beyaz olacak.',
      'Kenarlar düz ve düzgün olacak.',
      'Su buharlaştıkça kristaller büyüyecek.',
    ],
  },

  {
    id: 'week-3-cheek-cells',
    weekNumber: 3,
    title: 'Kendi Yanak Hücrelerini İncele',
    description:
      'Kendi vücudundaki hücreleri keşfet! Hayvan hücreleri ile bitki hücrelerinin farkını öğren.',
    category: 'Hücre Biyolojisi',
    difficulty: 'kolay',
    estimatedTime: '25-35 dakika',
    points: difficultyPoints['kolay'],
    learningObjectives: [
      'Hayvan hücresi yapısını tanıma',
      'Bitki ve hayvan hücresi farkını anlama',
      'Hücre zarını gözlemleme',
      'Kendini bilimsel olarak keşfetme',
    ],
    materials: [
      { name: 'Mikroskop', icon: '🔬' },
      { name: 'Lam ve lamel', icon: '🔲' },
      { name: 'Pamuklu çubuk veya temiz kaşık', icon: '🥄' },
      { name: 'Metilen mavisi (veya iyot)', icon: '💧' },
      { name: 'Su', icon: '💧' },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Ağzını suyla çalkala.',
        tip: 'Yemek artıkları gözlemi zorlaştırır.',
      },
      {
        stepNumber: 2,
        instruction: 'Pamuklu çubukla yanağının iç kısmını hafifçe ovala.',
        duration: '10-15 saniye',
      },
      {
        stepNumber: 3,
        instruction: 'Çubuğu lamın üzerine hafifçe sür.',
      },
      {
        stepNumber: 4,
        instruction: 'Bir damla metilen mavisi veya iyot ekle.',
        tip: 'Boya hücreleri görünür yapar.',
      },
      {
        stepNumber: 5,
        instruction: 'Lameli yavaşça kapat.',
      },
      {
        stepNumber: 6,
        instruction: 'Düşük büyütmeyle başla, sonra 40x veya 100x kullan.',
      },
    ],
    safetyNotes: [
      'Çubuğu sert bastırma, yanağını incitme.',
      'Metilen mavisi leke yapar, dikkatli ol.',
      'Kullanılan malzemeleri paylaşma.',
    ],
    observationGuide: [
      'Hücrelerin şekli nasıl? (yuvarlak, düzensiz)',
      'Hücre duvarı var mı? (Hayvan hücresinde olmaz!)',
      'Çekirdeği bulabildin mi?',
      'Soğan hücresinden farkı ne?',
    ],
    expectedResults: [
      'Düzensiz şekilli, yassı hücreler göreceksin.',
      'Hücre duvarı YOK, sadece ince zar var.',
      'Her hücrede bir çekirdek olacak.',
      'Hücreler soğan hücresinden daha küçük.',
    ],
  },

  {
    id: 'week-4-elodea',
    weekNumber: 4,
    title: 'Su Bitkisinde Kloroplast Hareketi',
    description:
      'Elodea (su yosunu) yaprağında kloroplastların hareketini gözlemle. Canlı hücrelerdeki aktiviteyi gör!',
    category: 'Bitki Anatomisi',
    difficulty: 'kolay',
    estimatedTime: '30-40 dakika',
    points: difficultyPoints['kolay'],
    scientificName: 'Elodea canadensis',
    taxonId: 50436, // iNaturalist Elodea taxon ID
    learningObjectives: [
      'Kloroplastları tanıma',
      'Sitoplazmik akışı gözlemleme',
      'Fotosentez organellerini anlama',
      'Canlı hücre dinamiklerini görme',
    ],
    materials: [
      { name: 'Elodea (su bitkisi)', icon: '🌿' },
      { name: 'Mikroskop', icon: '🔬' },
      { name: 'Lam ve lamel', icon: '🔲' },
      { name: 'Su', icon: '💧' },
      { name: 'Lamba (ışık kaynağı)', icon: '💡', optional: true },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Elodea bitkisinden taze, yeşil bir yaprak kopar.',
        tip: 'Genç yapraklar daha iyi sonuç verir.',
      },
      {
        stepNumber: 2,
        instruction: 'Yaprağı bir damla su içinde lama yerleştir.',
      },
      {
        stepNumber: 3,
        instruction: 'Lameli kapat.',
      },
      {
        stepNumber: 4,
        instruction: '10x büyütmeyle başla, sonra 40x kullan.',
      },
      {
        stepNumber: 5,
        instruction: 'Yeşil noktacıkları (kloroplastlar) bul.',
      },
      {
        stepNumber: 6,
        instruction: '5-10 dakika bekle ve hareketi gözlemle.',
        tip: 'Işık altında hareket daha belirgin olur.',
      },
    ],
    safetyNotes: [
      'Elodea akvaryum mağazalarından alınabilir.',
      'Bitki zehirli değildir ama yenmemeli.',
    ],
    observationGuide: [
      'Yeşil kloroplastları görebiliyor musun?',
      'Kloroplastlar hareket ediyor mu?',
      'Hareketin yönü ne?',
      'Hücrelerin şekli nasıl?',
      'Hücre duvarını görebiliyor musun?',
    ],
    expectedResults: [
      'Dikdörtgen hücreler göreceksin.',
      'İçlerinde yeşil noktalar (kloroplastlar) olacak.',
      'Kloroplastlar hücre kenarı boyunca hareket edecek.',
      'Bu harekete "sitoplazmik akış" denir.',
    ],
  },

  // HAFTA 5-8: Orta Seviye Deneyler
  {
    id: 'week-5-pond-water',
    weekNumber: 5,
    title: 'Havuz Suyunda Mikroskobik Yaşam',
    description:
      'Bir damla havuz suyunda saklı olan mikroskobik canlıları keşfet! Paramecium, amoeba ve rotifer avına çık.',
    category: 'Mikroorganizmalar',
    difficulty: 'orta',
    estimatedTime: '45-60 dakika',
    points: difficultyPoints['orta'],
    learningObjectives: [
      'Tek hücreli canlıları tanıma',
      'Mikroorganizma çeşitliliğini anlama',
      'Hareket biçimlerini gözlemleme',
      'Doğal yaşam alanlarını keşfetme',
    ],
    materials: [
      { name: 'Havuz/gölet suyu', icon: '💧' },
      { name: 'Mikroskop', icon: '🔬' },
      { name: 'Lam ve lamel', icon: '🔲' },
      { name: 'Damlalık', icon: '💉' },
      { name: 'Kavanoz', icon: '🫙' },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction:
          'Havuz veya gölet kenarından su topla. Yosunlu alanlar daha iyi.',
        tip: 'Biraz yaprak ve tortu da al.',
      },
      {
        stepNumber: 2,
        instruction: 'Suyu birkaç saat veya gece boyunca beklet.',
      },
      {
        stepNumber: 3,
        instruction: 'Damlalıkla dipten ve yüzeyden örnek al.',
      },
      {
        stepNumber: 4,
        instruction: 'Bir damla suyu lama koy, lameli kapat.',
      },
      {
        stepNumber: 5,
        instruction: 'Düşük büyütmeyle tarama yap, sonra yakınlaş.',
      },
      {
        stepNumber: 6,
        instruction: 'Hareketli canlıları bul ve takip et!',
      },
    ],
    safetyNotes: [
      'Havuz suyu içme!',
      'Ellerini yıka.',
      'Güvenli yerlerden su topla.',
    ],
    observationGuide: [
      'Kaç farklı canlı türü gördün?',
      'Nasıl hareket ediyorlar? (yüzme, sürünme, zıplama)',
      'Boyutları ne kadar farklı?',
      'Hangileri tek hücreli, hangileri çok hücreli?',
    ],
    expectedResults: [
      'Paramecium: Terlik şeklinde, hızlı yüzer.',
      'Amoeba: Şekilsiz, yavaş hareket eder.',
      'Rotifer: Dönen kirpikleri vardır.',
      'Algler: Yeşil, genellikle hareketsiz.',
    ],
  },

  {
    id: 'week-6-yeast',
    weekNumber: 6,
    title: 'Maya Hücrelerini Gözlemle',
    description:
      'Ekmek mayasının sırrını keşfet! Tek hücreli mantarların tomurcuklanarak çoğalmasını gör.',
    category: 'Mantarlar',
    difficulty: 'orta',
    estimatedTime: '40-50 dakika',
    points: difficultyPoints['orta'],
    scientificName: 'Saccharomyces cerevisiae',
    taxonId: 175541,
    learningObjectives: [
      'Mantarların hücre yapısını tanıma',
      'Tomurcuklanma ile üreme',
      'Fermantasyonu anlama',
      'Canlı gözlem yapma',
    ],
    materials: [
      { name: 'Kuru maya (instant)', icon: '🧫' },
      { name: 'Ilık su', icon: '💧' },
      { name: 'Şeker', icon: '🍬' },
      { name: 'Mikroskop', icon: '🔬' },
      { name: 'Lam ve lamel', icon: '🔲' },
      { name: 'Metilen mavisi', icon: '💧', optional: true },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Yarım bardak ılık suya 1 çay kaşığı şeker ekle.',
        tip: 'Su çok sıcak olmasın (40°C ideal).',
      },
      {
        stepNumber: 2,
        instruction: 'Bir tutam kuru maya ekle ve karıştır.',
      },
      {
        stepNumber: 3,
        instruction: '10-15 dakika bekle.',
        duration: '10-15 dakika',
        tip: 'Köpürmeye başlayacak!',
      },
      {
        stepNumber: 4,
        instruction: 'Bir damla maya çözeltisini lama koy.',
      },
      {
        stepNumber: 5,
        instruction: 'İstersen bir damla metilen mavisi ekle.',
      },
      {
        stepNumber: 6,
        instruction: '40x büyütme ile incele.',
      },
    ],
    observationGuide: [
      'Maya hücrelerinin şekli nasıl?',
      'Tomurcuklanan hücreler bulabildin mi?',
      'Hücrelerin boyutu ne kadar?',
      'Canlı ve ölü hücreleri ayırt edebiliyor musun?',
    ],
    expectedResults: [
      'Oval veya yuvarlak hücreler göreceksin.',
      'Bazı hücrelerde küçük tomurcuklar olacak.',
      'Aktif mayalar hareket edebilir.',
      'Metilen mavisi ile ölü hücreler mavi görünür.',
    ],
  },

  {
    id: 'week-7-stomata',
    weekNumber: 7,
    title: 'Yaprak Gözeneklerini (Stoma) Keşfet',
    description:
      'Bitkilerin nefes aldığı gözenekleri bul! Stoma hücreleri ve koruyucu hücreleri gözlemle.',
    category: 'Bitki Anatomisi',
    difficulty: 'orta',
    estimatedTime: '35-45 dakika',
    points: difficultyPoints['orta'],
    learningObjectives: [
      'Stoma yapısını tanıma',
      'Gaz alışverişini anlama',
      'Koruyucu hücreleri gözlemleme',
      'Yaprak anatomisini keşfetme',
    ],
    materials: [
      { name: 'Taze yaprak (ıspanak veya marul)', icon: '🥬' },
      { name: 'Mikroskop', icon: '🔬' },
      { name: 'Lam ve lamel', icon: '🔲' },
      { name: 'Tırnak cilası (şeffaf)', icon: '💅' },
      { name: 'Şeffaf bant', icon: '📎' },
      { name: 'Su', icon: '💧' },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Yaprağın ALT yüzeyine ince bir kat tırnak cilası sür.',
        tip: 'Stomalar genellikle yaprak altında bulunur.',
      },
      {
        stepNumber: 2,
        instruction: 'Cilanın tamamen kurumasını bekle.',
        duration: '5-10 dakika',
      },
      {
        stepNumber: 3,
        instruction: 'Kuruyan cilayı şeffaf bantla dikkatlice soy.',
      },
      {
        stepNumber: 4,
        instruction: 'Bandı lama yapıştır.',
      },
      {
        stepNumber: 5,
        instruction: '10x, sonra 40x büyütme ile incele.',
      },
    ],
    observationGuide: [
      'Stomalar nasıl görünüyor? (ağız şeklinde)',
      'Koruyucu hücrelerin şekli nasıl?',
      'Stomalar açık mı kapalı mı?',
      'Bir alanda kaç stoma var?',
    ],
    expectedResults: [
      'Dudak şeklinde stoma gözenekleri göreceksin.',
      'Her stomanın yanında iki böbrek şekilli koruyucu hücre var.',
      'Stomalar açık veya kapalı olabilir.',
      'Yaprak yüzeyinde düzenli dağılmış olacaklar.',
    ],
  },

  {
    id: 'week-8-blood-cells',
    weekNumber: 8,
    title: 'Kan Hücrelerini Tanı (Hazır Preparat)',
    description:
      'Hazır kan preparatı ile alyuvar, akyuvar ve trombositleri tanı. İnsan vücudunun savunma sistemini keşfet!',
    category: 'Hücre Biyolojisi',
    difficulty: 'orta',
    estimatedTime: '30-40 dakika',
    points: difficultyPoints['orta'],
    learningObjectives: [
      'Kan hücresi türlerini tanıma',
      'Alyuvar ve akyuvar farkını anlama',
      'Kan yapısını öğrenme',
      'Hazır preparat kullanma',
    ],
    materials: [
      { name: 'Hazır kan preparatı', icon: '🔬' },
      { name: 'Mikroskop', icon: '🔬' },
      { name: 'Yağ immersiyon objektifi (100x)', icon: '🔭', optional: true },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Hazır kan preparatını mikroskoba yerleştir.',
        tip: 'Bu deneyler için hazır preparat kullanmak güvenlidir.',
      },
      {
        stepNumber: 2,
        instruction: '10x ile odakla, sonra 40x geç.',
      },
      {
        stepNumber: 3,
        instruction: 'Alyuvarları (kırmızı kan hücreleri) bul.',
      },
      {
        stepNumber: 4,
        instruction: 'Akyuvarları (beyaz kan hücreleri) ara.',
        tip: 'Daha büyük ve mor çekirdekli olacaklar.',
      },
      {
        stepNumber: 5,
        instruction: 'Farklı akyuvar türlerini ayırt etmeye çalış.',
      },
    ],
    safetyNotes: ['Hazır preparat kullan, asla kendi kanınla deney yapma!'],
    observationGuide: [
      'Alyuvarların şekli nasıl? (çekirdeksiz, disk şeklinde)',
      'Akyuvarları bulabildin mi? (çekirdekli, daha büyük)',
      'Alyuvar ve akyuvar oranı nedir?',
      'Farklı akyuvar türleri görebildin mi?',
    ],
    expectedResults: [
      'Çok sayıda kırmızı, disk şekilli alyuvar.',
      'Ara sıra mor çekirdekli büyük akyuvarlar.',
      'Alyuvarların çekirdeği YOK.',
      'Akyuvarların çekirdeği belirgin.',
    ],
  },

  // HAFTA 9-12: Daha Zorlu Deneyler
  {
    id: 'week-9-dna-extraction',
    weekNumber: 9,
    title: 'Evde DNA İzolasyonu',
    description:
      'Muzdan DNA çıkar ve gözle görebilebilen DNA ipliklerini gözlemle! Moleküler biyolojiye giriş.',
    category: 'Kimyasal Reaksiyon',
    difficulty: 'zor',
    estimatedTime: '45-60 dakika',
    points: difficultyPoints['zor'],
    learningObjectives: [
      'DNA yapısını anlama',
      'Hücre parçalama tekniği',
      'Çöktürme yöntemi',
      'Biyokimyasal işlem adımları',
    ],
    materials: [
      { name: 'Muz (veya çilek)', icon: '🍌' },
      { name: 'Bulaşık deterjanı', icon: '🧴' },
      { name: 'Tuz', icon: '🧂' },
      { name: 'Soğuk alkol (%70 veya %90)', icon: '🧪' },
      { name: 'Su', icon: '💧' },
      { name: 'Plastik poşet', icon: '🛍️' },
      { name: 'Süzgeç veya filtre kağıdı', icon: '📄' },
      { name: 'Cam bardak', icon: '🥛' },
      { name: 'Tahta çubuk', icon: '🥢' },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Yarım muzu poşette iyice ez.',
        duration: '2-3 dakika',
      },
      {
        stepNumber: 2,
        instruction:
          'Yarım bardak su, 1 çay kaşığı tuz ve 1 yemek kaşığı deterjan karıştır.',
        tip: 'Bu karışım hücre zarını parçalar.',
      },
      {
        stepNumber: 3,
        instruction: 'Karışımı ezilmiş muza ekle, poşette karıştır.',
        duration: '5 dakika',
      },
      {
        stepNumber: 4,
        instruction: 'Karışımı süzgeçten geçir, sıvıyı bardağa al.',
      },
      {
        stepNumber: 5,
        instruction: 'Bardağın üstüne yavaşça soğuk alkol ekle.',
        tip: 'Alkolü bardak kenarından yavaşça akıt.',
      },
      {
        stepNumber: 6,
        instruction: 'Birkaç dakika bekle, beyaz DNA ipliklerini gör!',
        duration: '3-5 dakika',
      },
      {
        stepNumber: 7,
        instruction: 'Tahta çubukla DNA ipliklerini topla.',
      },
    ],
    safetyNotes: [
      'Alkolü yüzüne yaklaştırma.',
      'Büyüklerin gözetiminde yap.',
      "Elde edilen DNA'yı yeme!",
    ],
    observationGuide: [
      'DNA hangi renkte? (beyaz, saydam)',
      'İplikler nasıl görünüyor?',
      'Ne kadar DNA elde ettin?',
      'Alkol tabakası ile su tabakası arasında ne var?',
    ],
    expectedResults: [
      'Beyazımsı, ipliksi DNA göreceksin.',
      'DNA alkol ve su arasında toplanacak.',
      'Çubukla sarılarak toplanabilir.',
      "Bu gerçek DNA'dır!",
    ],
  },

  {
    id: 'week-10-paramecium',
    weekNumber: 10,
    title: 'Paramecium Davranışlarını İncele',
    description:
      "Paramecium'un engelden kaçma, beslenme ve çoğalma davranışlarını gözlemle.",
    category: 'Mikroorganizmalar',
    difficulty: 'zor',
    estimatedTime: '60 dakika',
    points: difficultyPoints['zor'],
    scientificName: 'Paramecium caudatum',
    taxonId: 129919,
    learningObjectives: [
      'Tek hücreli davranışları anlama',
      'Kirpikli hareket mekanizması',
      'Beslenme vakuolü gözlemi',
      'Uyaran tepkilerini inceleme',
    ],
    materials: [
      { name: 'Paramecium kültürü veya havuz suyu', icon: '🦠' },
      { name: 'Mikroskop', icon: '🔬' },
      { name: 'Lam ve lamel', icon: '🔲' },
      { name: 'Pamuk lifleri', icon: '🧶' },
      { name: 'Tuz çözeltisi (zayıf)', icon: '🧂' },
      { name: 'Maya süspansiyonu', icon: '🧫' },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Lama bir damla kültür suyu koy.',
      },
      {
        stepNumber: 2,
        instruction: 'Birkaç pamuk lifi ekle.',
        tip: 'Bu Paramecium hareketini yavaşlatır.',
      },
      {
        stepNumber: 3,
        instruction: 'Lameli kapat ve 10x ile bak.',
      },
      {
        stepNumber: 4,
        instruction: 'Paramecium bul ve 40x ile izle.',
      },
      {
        stepNumber: 5,
        instruction: 'Beslenme için bir damla maya ekle.',
        tip: 'Lamel kenarından ekle.',
      },
      {
        stepNumber: 6,
        instruction: 'Uyaran tepkisi için tuz çözeltisi ekle.',
      },
    ],
    observationGuide: [
      'Paramecium nasıl hareket ediyor?',
      'Engele çarpınca ne yapıyor?',
      'Besin vakuollerini görebiliyor musun?',
      'Tuza tepkisi ne oldu?',
    ],
    expectedResults: [
      'Terlik şeklinde hızlı yüzen canlı.',
      'Engele çarpınca geri gidip yön değiştirir.',
      'İçinde yuvarlak besin vakuolleri görülebilir.',
      'Tuzdan kaçarak yüzecektir.',
    ],
  },

  // Daha fazla hafta eklenebilir...
  {
    id: 'week-11-mitosis',
    weekNumber: 11,
    title: 'Hücre Bölünmesini Gözlemle (Mitoz)',
    description:
      'Soğan kök ucu preparatında mitoz bölünme evrelerini bul ve tanımla.',
    category: 'Hücre Biyolojisi',
    difficulty: 'zor',
    estimatedTime: '45-60 dakika',
    points: difficultyPoints['zor'],
    learningObjectives: [
      'Mitoz evrelerini tanıma (profaz, metafaz, anafaz, telofaz)',
      'Kromozomları gözlemleme',
      'Hücre döngüsünü anlama',
    ],
    materials: [
      { name: 'Soğan kök ucu hazır preparatı', icon: '🧅' },
      { name: 'Mikroskop', icon: '🔬' },
      { name: 'Çizim kağıdı', icon: '📄' },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Hazır soğan kök ucu preparatını mikroskoba yerleştir.',
      },
      {
        stepNumber: 2,
        instruction: '10x ile odakla, kök ucu meristem bölgesini bul.',
        tip: 'Küçük, yoğun hücreler olan bölge.',
      },
      {
        stepNumber: 3,
        instruction: '40x ile mitoz geçiren hücreleri ara.',
      },
      {
        stepNumber: 4,
        instruction: 'Her mitoz evresini bulmaya çalış ve çiz.',
      },
    ],
    observationGuide: [
      'Interfaz hücreleri nasıl görünüyor?',
      'Profazda kromozomlar nasıl?',
      'Metafazda kromozomlar nerede dizilmiş?',
      'Anafaz ve telofazı bulabildin mi?',
    ],
    expectedResults: [
      'Çoğu hücre interfazda, çekirdek belirgin.',
      'Profazda çekirdek zarı kaybolur, kromozomlar görünür.',
      'Metafazda kromozomlar ortada dizili.',
      'Anafazda kromozomlar kutuplara çekilir.',
      'Telofazda iki yeni çekirdek oluşur.',
    ],
  },

  {
    id: 'week-12-bacteria',
    weekNumber: 12,
    title: 'Yoğurttaki Bakterileri Keşfet',
    description:
      'Probiyotik yoğurttaki faydalı bakterileri gözlemle. Lactobacillus dünyasına dal!',
    category: 'Mikroorganizmalar',
    difficulty: 'orta',
    estimatedTime: '30-40 dakika',
    points: difficultyPoints['orta'],
    scientificName: 'Lactobacillus delbrueckii',
    taxonId: 128712,
    learningObjectives: [
      'Bakteri morfolojisini tanıma',
      'Faydalı bakterileri anlama',
      'Fermantasyon sürecini öğrenme',
    ],
    materials: [
      { name: 'Probiyotik yoğurt', icon: '🥛' },
      { name: 'Mikroskop', icon: '🔬' },
      { name: 'Lam ve lamel', icon: '🔲' },
      { name: 'Metilen mavisi veya safranin', icon: '💧' },
      { name: 'Su', icon: '💧' },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Kürdan ucuyla az miktarda yoğurt al.',
      },
      {
        stepNumber: 2,
        instruction: 'Lam üzerinde bir damla su ile karıştır.',
      },
      {
        stepNumber: 3,
        instruction: 'Çok ince bir tabaka oluştur, havada kurut.',
      },
      {
        stepNumber: 4,
        instruction: 'Üzerine bir damla metilen mavisi ekle, 1 dakika bekle.',
      },
      {
        stepNumber: 5,
        instruction: 'Suyla nazikçe yıka ve kurut.',
      },
      {
        stepNumber: 6,
        instruction: '100x (yağ immersiyon) ile incele.',
        tip: '40x ile de görebilirsin ama zor olur.',
      },
    ],
    observationGuide: [
      'Bakterilerin şekli nasıl? (çubuk, yuvarlak)',
      'Nasıl dizilmişler? (tek, zincir, küme)',
      'Ne kadar küçükler?',
    ],
    expectedResults: [
      'Çubuk şekilli (basil) bakteriler.',
      'Zincir halinde dizilmiş olabilirler.',
      'Çok küçük, yüksek büyütme gerektirir.',
    ],
  },
];

// Hafta numarasına göre deney getir
export function getExperimentByWeek(
  weekNumber: number
): Omit<WeeklyExperiment, 'status' | 'userObservation'> | null {
  return weeklyExperiments.find((e) => e.weekNumber === weekNumber) || null;
}

// Kategoriye göre deneyleri getir
export function getExperimentsByCategory(
  category: ExperimentCategory
): Omit<WeeklyExperiment, 'status' | 'userObservation'>[] {
  return weeklyExperiments.filter((e) => e.category === category);
}

// Zorluğa göre deneyleri getir
export function getExperimentsByDifficulty(
  difficulty: ExperimentDifficulty
): Omit<WeeklyExperiment, 'status' | 'userObservation'>[] {
  return weeklyExperiments.filter((e) => e.difficulty === difficulty);
}

export default weeklyExperiments;
