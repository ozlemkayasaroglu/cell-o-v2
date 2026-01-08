/**
 * Gözlem Görevi Şablonları
 * iNaturalist verileriyle birleşen önceden tanımlanmış görev şablonları
 */

import {
  ObservationCategory,
  ObservationFocus,
  ObservationDifficulty,
} from '@/types/observationTypes';

export interface TaskTemplate {
  id: string;
  titleTemplate: string;
  descriptionTemplate: string;
  category: ObservationCategory;
  focus: ObservationFocus;
  difficulty: ObservationDifficulty;
  hints: string[];
  requiresTaxon: boolean;
  applicableSeasons?: ('spring' | 'summer' | 'fall' | 'winter')[];
}

export const taskTemplates: TaskTemplate[] = [
  // KUŞLAR - Kolay
  {
    id: 'bird-id-easy',
    titleTemplate: 'Bir {taxonName} Bul',
    descriptionTemplate:
      'Çevrende bir {taxonName} bul ve tanımla. Renklerini ve boyutunu not al.',
    category: 'Kuşlar',
    focus: 'identification',
    difficulty: 'easy',
    hints: [
      'Ağaçlara, elektrik tellerine veya yere bak',
      'Kuş seslerini dinleyerek onları bulmaya çalış',
      'Sabah ve akşam en iyi zamanlar',
    ],
    requiresTaxon: true,
  },
  {
    id: 'bird-behavior-easy',
    titleTemplate: 'Kuş Beslenişini İzle',
    descriptionTemplate:
      'Herhangi bir kuşun yemek yediğini gözlemle. Ne yiyor? Nasıl yiyor?',
    category: 'Kuşlar',
    focus: 'behavior',
    difficulty: 'easy',
    hints: [
      'Kuş yemlikleri harika yerler',
      'Yerde bir şeyler toplayan kuşları izle',
      'Yiyecekleri tutmak için ayaklarını kullanıyorlar mı?',
    ],
    requiresTaxon: false,
  },
  {
    id: 'bird-count-medium',
    titleTemplate: 'Kuş Sayımı',
    descriptionTemplate:
      '15 dakikada kaç farklı kuş türü görebileceğini say.',
    category: 'Kuşlar',
    focus: 'count',
    difficulty: 'medium',
    hints: [
      'Bir yerde kal ve sabırlı ol',
      'Varsa dürbün kullan',
      'Tek tek kuşları değil, türleri say',
    ],
    requiresTaxon: false,
  },
  {
    id: 'bird-sounds-medium',
    titleTemplate: 'Kuş Şarkısı Dedektifi',
    descriptionTemplate:
      'Kuş şarkılarını dinle. En az 3 farklı ötüş ayırt edebilir misin?',
    category: 'Kuşlar',
    focus: 'sounds',
    difficulty: 'medium',
    hints: [
      'Sabahın erken saatleri en çok ötüşün olduğu zaman',
      'Ses kalıbını tanımlamaya çalış',
      'Bazı kuşlar diğer sesleri taklit eder',
    ],
    requiresTaxon: false,
  },

  // BÖCEKLER - Çeşitli
  {
    id: 'insect-id-easy',
    titleTemplate: 'Bir {taxonName} Bul',
    descriptionTemplate:
      'Bir {taxonName} ara. Çiçeklere, yapraklara ve havaya bak.',
    category: 'Böcekler',
    focus: 'identification',
    difficulty: 'easy',
    hints: [
      'Böcekler güneşli yerleri sever',
      'Tozlayıcılar için çiçekleri kontrol et',
      'Yaprakların ve kütüklerin altına bak',
    ],
    requiresTaxon: true,
  },
  {
    id: 'insect-patterns-easy',
    titleTemplate: 'Kelebek Renkleri',
    descriptionTemplate:
      'Bir kelebek bul ve kanat desenlerini ve renklerini tanımla.',
    category: 'Böcekler',
    focus: 'patterns',
    difficulty: 'easy',
    hints: [
      'Kelebekler kanatları kapalı dinlenir',
      'Çiçekli bahçelere bak',
      'Leke veya çizgileri not al',
    ],
    requiresTaxon: false,
  },
  {
    id: 'insect-lifecycle-medium',
    titleTemplate: 'Böcek Yaşam Döngüsü',
    descriptionTemplate:
      'Farklı böcek yaşam evrelerinin kanıtlarını bul: yumurta, larva, pupa veya yetişkin.',
    category: 'Böcekler',
    focus: 'lifecycle',
    difficulty: 'medium',
    hints: [
      'Yapraklarda yumurta veya tırtıl kontrol et',
      'Dallarda koza ara',
      'Kelebek bahçeleri harika yerler',
    ],
    requiresTaxon: false,
    applicableSeasons: ['spring', 'summer'],
  },
  {
    id: 'insect-behavior-medium',
    titleTemplate: 'Karınca Yolu Gözlemcisi',
    descriptionTemplate:
      'Bir karınca yolu bul. Nereye gidiyorlar? Ne taşıyorlar?',
    category: 'Böcekler',
    focus: 'behavior',
    difficulty: 'medium',
    hints: [
      'Karıncalar feromon izlerini takip eder',
      'Yuvalarına nereden girdiklerini izle',
      'Hangi yiyeceği tercih ettiklerini not al',
    ],
    requiresTaxon: false,
  },
  {
    id: 'insect-interaction-hard',
    titleTemplate: 'Tozlayıcı Ortakları',
    descriptionTemplate:
      '10 dakika boyunca bir çiçeği izle. Ziyaret eden tüm böcekleri belgele.',
    category: 'Böcekler',
    focus: 'interaction',
    difficulty: 'hard',
    hints: [
      'Çok çiçeği olan bir bitki seç',
      'Her ziyaretçinin ne kadar kaldığını not al',
      'Farklı böcekler farklı çiçekleri mi tercih ediyor?',
    ],
    requiresTaxon: false,
    applicableSeasons: ['spring', 'summer'],
  },

  // BİTKİLER - Çeşitli
  {
    id: 'plant-id-easy',
    titleTemplate: 'Bir {taxonName} Tanımla',
    descriptionTemplate:
      'Bölgende büyüyen bir {taxonName} bul. Yapraklarını ve çiçeklerini tanımla.',
    category: 'Bitkiler',
    focus: 'identification',
    difficulty: 'easy',
    hints: [
      'Yaprak şekline ve kenarlarına bak',
      'Yaprakların karşılıklı mı yoksa sırayla mı dizildiğini not al',
      'Çiçek, meyve veya tohum kontrol et',
    ],
    requiresTaxon: true,
  },
  {
    id: 'plant-habitat-easy',
    titleTemplate: 'Bitkiler Nerede Büyür',
    descriptionTemplate:
      'Aynı tür bitkiyi farklı yerlerde bul. Boyutlarını karşılaştır.',
    category: 'Bitkiler',
    focus: 'habitat',
    difficulty: 'easy',
    hints: [
      'Güneşli ve gölgeli yerleri karşılaştır',
      'Toprak nemindeki farkları not al',
      'Bitki boyunu ölç veya tahmin et',
    ],
    requiresTaxon: false,
  },
  {
    id: 'plant-patterns-medium',
    titleTemplate: 'Yaprak Deseni Dedektifi',
    descriptionTemplate:
      '5 farklı yaprak şekli gözlemi topla. Her birini çiz veya tanımla.',
    category: 'Bitkiler',
    focus: 'patterns',
    difficulty: 'medium',
    hints: [
      'Basit ve bileşik yapraklara bak',
      'Dişli ve düz kenarları not al',
      'Damar desenlerini kontrol et',
    ],
    requiresTaxon: false,
  },
  {
    id: 'plant-seasonal-medium',
    titleTemplate: 'Mevsim İşaretleri',
    descriptionTemplate:
      'Mevsimsel değişiklikler gösteren 3 bitki bul (tomurcuk, çiçek, meyve veya sonbahar renkleri).',
    category: 'Bitkiler',
    focus: 'seasonal',
    difficulty: 'medium',
    hints: [
      'İlkbahar: yeni tomurcuklar ara',
      'Yaz: çiçekler ve büyüme',
      'Sonbahar: renk değişimleri ve tohumlar',
    ],
    requiresTaxon: false,
  },
  {
    id: 'plant-comparison-hard',
    titleTemplate: 'Ağaç Karşılaştırması',
    descriptionTemplate:
      'İki farklı ağaç türünü karşılaştır. Aralarındaki 5 farkı not al.',
    category: 'Bitkiler',
    focus: 'comparison',
    difficulty: 'hard',
    hints: [
      'Kabuk dokusunu ve rengini karşılaştır',
      'Yaprak şekline ve boyutuna bak',
      'Genel ağaç şeklini not al',
    ],
    requiresTaxon: false,
  },

  // MANTARLAR - Çeşitli
  {
    id: 'fungi-id-easy',
    titleTemplate: 'Mantar Avı',
    descriptionTemplate:
      'Herhangi bir mantar bul ve şapkasını, sapını ve nerede büyüdüğünü tanımla.',
    category: 'Mantarlar',
    focus: 'identification',
    difficulty: 'easy',
    hints: [
      'Gölgeli, nemli alanlara bak',
      'Ölü ağaçların çevresini kontrol et',
      'Bilinmeyen mantarlara asla dokunma!',
    ],
    requiresTaxon: false,
  },
  {
    id: 'fungi-habitat-medium',
    titleTemplate: 'Mantar Yaşam Alanları',
    descriptionTemplate:
      '3 farklı yaşam alanında büyüyen mantarlar bul (ağaçlarda, yerde, kütüklerde).',
    category: 'Mantarlar',
    focus: 'habitat',
    difficulty: 'medium',
    hints: [
      'Konsol mantarları ağaçlarda büyür',
      'Bazıları sadece ölü odunda büyür',
      'Yağmurlu günlerden sonra kontrol et',
    ],
    requiresTaxon: false,
  },
  {
    id: 'fungi-patterns-hard',
    titleTemplate: 'Mantar Spor Baskıları',
    descriptionTemplate:
      'Bulduğun farklı mantar şapkalarının renklerini ve desenlerini tanımla.',
    category: 'Mantarlar',
    focus: 'patterns',
    difficulty: 'hard',
    hints: [
      'Şapka şeklini not al: düz, dışbükey, çan şeklinde',
      'Altında lamel, por veya diş olup olmadığına bak',
      'Renkler yaşla değişebilir',
    ],
    requiresTaxon: false,
    applicableSeasons: ['fall', 'spring'],
  },

  // MEMELİLER - Çeşitli
  {
    id: 'mammal-id-easy',
    titleTemplate: 'Bir {taxonName} Gör',
    descriptionTemplate:
      'Bir {taxonName} bul. Rahatsız etmeden gözlemle.',
    category: 'Memeliler',
    focus: 'identification',
    difficulty: 'easy',
    hints: [
      'Sabah erken veya akşam en iyisi',
      'Sessiz ve hareketsiz kal',
      'Ağaçlarda veya çimlerde harekete bak',
    ],
    requiresTaxon: true,
  },
  {
    id: 'mammal-behavior-medium',
    titleTemplate: 'Sincap Gözlemcisi',
    descriptionTemplate:
      '5 dakika boyunca bir sincabı izle. Hangi aktiviteleri gözlemliyorsun?',
    category: 'Memeliler',
    focus: 'behavior',
    difficulty: 'medium',
    hints: [
      'Beslenme davranışını not al',
      'Yiyecek saklama davranışını izle',
      'Ağaçlarda nasıl hareket ettiklerini gözlemle',
    ],
    requiresTaxon: false,
  },
  {
    id: 'mammal-habitat-hard',
    titleTemplate: 'Hayvan İzleri',
    descriptionTemplate:
      'Memeli kanıtları bul: izler, dışkı, yuvalar veya kürk.',
    category: 'Memeliler',
    focus: 'habitat',
    difficulty: 'hard',
    hints: [
      'Çamur ve kar izleri iyi gösterir',
      'Yerdeki delikleri ara',
      'Ağaç kabuğunda çizik izlerini kontrol et',
    ],
    requiresTaxon: false,
  },

  // SÜRÜNGENLER & İKİ YAŞAMLILAR
  {
    id: 'reptile-id-easy',
    titleTemplate: 'Güneşlenen Sürüngenler',
    descriptionTemplate:
      'Güneşte ısınan bir sürüngen bul. Boyutunu ve renklerini tanımla.',
    category: 'Sürüngenler',
    focus: 'identification',
    difficulty: 'easy',
    hints: [
      'Kayalara ve güneşli noktalara bak',
      'Sabahın erken saatleri güneşlenme zamanı',
      'Mesafeni koru',
    ],
    requiresTaxon: false,
    applicableSeasons: ['spring', 'summer'],
  },
  {
    id: 'amphibian-sounds-medium',
    titleTemplate: 'Kurbağa Korosu',
    descriptionTemplate:
      'Suyun yakınında kurbağa sesleri dinle. Kaç farklı ses duyuyorsun?',
    category: 'İki Yaşamlılar',
    focus: 'sounds',
    difficulty: 'medium',
    hints: [
      'Akşam kurbağa sesleri için en iyi zaman',
      'Göletler ve sulak alanların yakınında dinle',
      'Her türün benzersiz bir sesi var',
    ],
    requiresTaxon: false,
    applicableSeasons: ['spring', 'summer'],
  },
  {
    id: 'amphibian-lifecycle-hard',
    titleTemplate: 'İribaştan Kurbağaya',
    descriptionTemplate:
      'İribaş veya diğer kurbağa larvalarını bul. Gelişim aşamalarını not al.',
    category: 'İki Yaşamlılar',
    focus: 'lifecycle',
    difficulty: 'hard',
    hints: [
      'Gölet kenarlarını ve yavaş akarsulari kontrol et',
      'Bacak gelişimini ara',
      'Kuyruk boyutunu vücuda göre not al',
    ],
    requiresTaxon: false,
    applicableSeasons: ['spring', 'summer'],
  },

  // YUMUŞAKÇALAR & ÖRÜMCEKGİLLER
  {
    id: 'mollusk-habitat-easy',
    titleTemplate: 'Salyangoz Safarisi',
    descriptionTemplate:
      'Salyangoz veya sümüklü böcek bul. Nerede saklanmayı seviyorlar?',
    category: 'Yumuşakçalar',
    focus: 'habitat',
    difficulty: 'easy',
    hints: [
      'Yağmurdan sonra veya sabah çiyinde kontrol et',
      'Taşların ve kütüklerin altına bak',
      'Nemli, gölgeli yerler en iyisi',
    ],
    requiresTaxon: false,
  },
  {
    id: 'arachnid-patterns-medium',
    titleTemplate: 'Örümcek Ağı Mimarı',
    descriptionTemplate:
      'Bir örümcek ağı bul. Şeklini ve örümceğin nereye konumlandırdığını tanımla.',
    category: 'Örümcekgiller',
    focus: 'patterns',
    difficulty: 'medium',
    hints: [
      'Sabah çiyi ağları ortaya çıkarır',
      'Bitkiler arasına ve köşelere bak',
      'Örümceğin görünür olup olmadığını not al',
    ],
    requiresTaxon: false,
  },
  {
    id: 'arachnid-behavior-hard',
    titleTemplate: 'Örümcek Avcısı',
    descriptionTemplate:
      'Bir örümceğin avını yakalama veya taşıma şeklini gözlemle (güvenliyse).',
    category: 'Örümcekgiller',
    focus: 'behavior',
    difficulty: 'hard',
    hints: [
      'Ağ örümcekleri titreşimleri bekler',
      'Ağı rahatsız etmeden izle',
      'Bu sabır gerektirebilir',
    ],
    requiresTaxon: false,
  },

  // HAVA DURUMU & MANZARA
  {
    id: 'weather-observation-easy',
    titleTemplate: 'Bulut Gözlemcisi',
    descriptionTemplate:
      '3 farklı bulut türü tanımla. Hava nasıl olabilir?',
    category: 'Hava Durumu',
    focus: 'patterns',
    difficulty: 'easy',
    hints: [
      'Kabarık bulutlar = güzel hava',
      'Düz gri bulutlar = yağmur geliyor',
      'Yüksek ince bulutlar = güzel hava',
    ],
    requiresTaxon: false,
  },
  {
    id: 'landscape-seasonal-medium',
    titleTemplate: 'Mevsimsel Manzara',
    descriptionTemplate:
      'Manzaranın şu an nasıl göründüğünü tanımla. Hangi mevsim işaretlerini görüyorsun?',
    category: 'Manzara',
    focus: 'seasonal',
    difficulty: 'medium',
    hints: [
      'Bitki renklerini ve büyümeyi not al',
      'Hayvan aktivitesini ara',
      'Derelerdeki su seviyelerini kontrol et',
    ],
    requiresTaxon: false,
  },
  {
    id: 'behavior-interaction-hard',
    titleTemplate: 'Besin Ağı Gözlemcisi',
    descriptionTemplate:
      'Bir canlının başka bir canlıyı yemesi veya yenmesi örneği bul.',
    category: 'Davranış',
    focus: 'interaction',
    difficulty: 'hard',
    hints: [
      'Böcek yakalayan kuş',
      'Avlı örümcek',
      'Yaprak yiyen tırtıl',
    ],
    requiresTaxon: false,
  },
];

// Kategoriye göre şablonları getir
export function getTemplatesByCategory(category: ObservationCategory): TaskTemplate[] {
  return taskTemplates.filter((t) => t.category === category);
}

// Zorluğa göre şablonları getir
export function getTemplatesByDifficulty(difficulty: ObservationDifficulty): TaskTemplate[] {
  return taskTemplates.filter((t) => t.difficulty === difficulty);
}

// Odağa göre şablonları getir
export function getTemplatesByFocus(focus: ObservationFocus): TaskTemplate[] {
  return taskTemplates.filter((t) => t.focus === focus);
}

// Mevcut mevsim için şablonları getir
export function getSeasonalTemplates(): TaskTemplate[] {
  const month = new Date().getMonth();
  let season: 'spring' | 'summer' | 'fall' | 'winter';

  if (month >= 2 && month <= 4) season = 'spring';
  else if (month >= 5 && month <= 7) season = 'summer';
  else if (month >= 8 && month <= 10) season = 'fall';
  else season = 'winter';

  return taskTemplates.filter(
    (t) => !t.applicableSeasons || t.applicableSeasons.includes(season)
  );
}
