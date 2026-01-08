/**
 * Mock iNaturalist API verileri
 * iNaturalist'in taxa ve gözlem yapısına dayalı
 * https://api.inaturalist.org/v1/docs/
 */

export interface INatTaxon {
  id: number;
  name: string;
  commonName: string;
  rank: 'kingdom' | 'phylum' | 'class' | 'order' | 'family' | 'genus' | 'species';
  iconicTaxonName: string;
  observationsCount: number;
  defaultPhoto?: {
    mediumUrl: string;
    attribution: string;
  };
}

export interface INatObservation {
  id: number;
  taxon: INatTaxon;
  description: string;
  location: string;
  observedOn: string;
  qualityGrade: 'casual' | 'needs_id' | 'research';
}

// Kategoriye göre organize edilmiş mock türler
export const mockTaxa: INatTaxon[] = [
  // KUŞLAR
  {
    id: 1,
    name: 'Turdus migratorius',
    commonName: 'Amerikan Ardıç Kuşu',
    rank: 'species',
    iconicTaxonName: 'Aves',
    observationsCount: 1500000,
  },
  {
    id: 2,
    name: 'Cardinalis cardinalis',
    commonName: 'Kuzey Kardinali',
    rank: 'species',
    iconicTaxonName: 'Aves',
    observationsCount: 800000,
  },
  {
    id: 3,
    name: 'Cyanocitta cristata',
    commonName: 'Mavi Alakarga',
    rank: 'species',
    iconicTaxonName: 'Aves',
    observationsCount: 600000,
  },
  {
    id: 4,
    name: 'Corvus brachyrhynchos',
    commonName: 'Amerikan Kargası',
    rank: 'species',
    iconicTaxonName: 'Aves',
    observationsCount: 500000,
  },
  {
    id: 5,
    name: 'Columba livia',
    commonName: 'Kaya Güvercini',
    rank: 'species',
    iconicTaxonName: 'Aves',
    observationsCount: 400000,
  },
  {
    id: 6,
    name: 'Passer domesticus',
    commonName: 'Ev Serçesi',
    rank: 'species',
    iconicTaxonName: 'Aves',
    observationsCount: 900000,
  },

  // BÖCEKLER
  {
    id: 101,
    name: 'Danaus plexippus',
    commonName: 'Kral Kelebeği',
    rank: 'species',
    iconicTaxonName: 'Insecta',
    observationsCount: 700000,
  },
  {
    id: 102,
    name: 'Apis mellifera',
    commonName: 'Bal Arısı',
    rank: 'species',
    iconicTaxonName: 'Insecta',
    observationsCount: 500000,
  },
  {
    id: 103,
    name: 'Coccinella septempunctata',
    commonName: 'Yedi Noktalı Uğur Böceği',
    rank: 'species',
    iconicTaxonName: 'Insecta',
    observationsCount: 300000,
  },
  {
    id: 104,
    name: 'Bombus impatiens',
    commonName: 'Yaygın Yaban Arısı',
    rank: 'species',
    iconicTaxonName: 'Insecta',
    observationsCount: 200000,
  },
  {
    id: 105,
    name: 'Papilio glaucus',
    commonName: 'Kaplan Kırlangıçkuyruk',
    rank: 'species',
    iconicTaxonName: 'Insecta',
    observationsCount: 150000,
  },
  {
    id: 106,
    name: 'Libellula pulchella',
    commonName: 'On İki Benekli Yusufçuk',
    rank: 'species',
    iconicTaxonName: 'Insecta',
    observationsCount: 100000,
  },
  {
    id: 107,
    name: 'Formica rufa',
    commonName: 'Kızıl Orman Karıncası',
    rank: 'species',
    iconicTaxonName: 'Insecta',
    observationsCount: 80000,
  },
  {
    id: 108,
    name: 'Gryllus pennsylvanicus',
    commonName: 'Tarla Cırcır Böceği',
    rank: 'species',
    iconicTaxonName: 'Insecta',
    observationsCount: 50000,
  },

  // BİTKİLER
  {
    id: 201,
    name: 'Taraxacum officinale',
    commonName: 'Karahindiba',
    rank: 'species',
    iconicTaxonName: 'Plantae',
    observationsCount: 1200000,
  },
  {
    id: 202,
    name: 'Trifolium repens',
    commonName: 'Beyaz Yonca',
    rank: 'species',
    iconicTaxonName: 'Plantae',
    observationsCount: 600000,
  },
  {
    id: 203,
    name: 'Quercus rubra',
    commonName: 'Kızıl Meşe',
    rank: 'species',
    iconicTaxonName: 'Plantae',
    observationsCount: 300000,
  },
  {
    id: 204,
    name: 'Acer saccharum',
    commonName: 'Şeker Akçaağacı',
    rank: 'species',
    iconicTaxonName: 'Plantae',
    observationsCount: 250000,
  },
  {
    id: 205,
    name: 'Rosa multiflora',
    commonName: 'Çok Çiçekli Gül',
    rank: 'species',
    iconicTaxonName: 'Plantae',
    observationsCount: 200000,
  },
  {
    id: 206,
    name: 'Helianthus annuus',
    commonName: 'Ayçiçeği',
    rank: 'species',
    iconicTaxonName: 'Plantae',
    observationsCount: 180000,
  },
  {
    id: 207,
    name: 'Plantago major',
    commonName: 'Sinir Otu',
    rank: 'species',
    iconicTaxonName: 'Plantae',
    observationsCount: 400000,
  },

  // MANTARLAR
  {
    id: 301,
    name: 'Amanita muscaria',
    commonName: 'Sinek Mantarı',
    rank: 'species',
    iconicTaxonName: 'Fungi',
    observationsCount: 150000,
  },
  {
    id: 302,
    name: 'Ganoderma applanatum',
    commonName: 'Ressam Mantarı',
    rank: 'species',
    iconicTaxonName: 'Fungi',
    observationsCount: 80000,
  },
  {
    id: 303,
    name: 'Trametes versicolor',
    commonName: 'Hindi Kuyruğu Mantarı',
    rank: 'species',
    iconicTaxonName: 'Fungi',
    observationsCount: 200000,
  },
  {
    id: 304,
    name: 'Pleurotus ostreatus',
    commonName: 'İstiridye Mantarı',
    rank: 'species',
    iconicTaxonName: 'Fungi',
    observationsCount: 100000,
  },

  // MEMELİLER
  {
    id: 401,
    name: 'Sciurus carolinensis',
    commonName: 'Gri Sincap',
    rank: 'species',
    iconicTaxonName: 'Mammalia',
    observationsCount: 400000,
  },
  {
    id: 402,
    name: 'Sylvilagus floridanus',
    commonName: 'Pamuk Kuyruklu Tavşan',
    rank: 'species',
    iconicTaxonName: 'Mammalia',
    observationsCount: 200000,
  },
  {
    id: 403,
    name: 'Procyon lotor',
    commonName: 'Rakun',
    rank: 'species',
    iconicTaxonName: 'Mammalia',
    observationsCount: 150000,
  },
  {
    id: 404,
    name: 'Odocoileus virginianus',
    commonName: 'Ak Kuyruklu Geyik',
    rank: 'species',
    iconicTaxonName: 'Mammalia',
    observationsCount: 300000,
  },
  {
    id: 405,
    name: 'Marmota monax',
    commonName: 'Dağ Sıçanı',
    rank: 'species',
    iconicTaxonName: 'Mammalia',
    observationsCount: 100000,
  },

  // SÜRÜNGENLER
  {
    id: 501,
    name: 'Chrysemys picta',
    commonName: 'Boyalı Kaplumbağa',
    rank: 'species',
    iconicTaxonName: 'Reptilia',
    observationsCount: 150000,
  },
  {
    id: 502,
    name: 'Thamnophis sirtalis',
    commonName: 'Çizgili Yılan',
    rank: 'species',
    iconicTaxonName: 'Reptilia',
    observationsCount: 200000,
  },
  {
    id: 503,
    name: 'Anolis carolinensis',
    commonName: 'Yeşil Anolis',
    rank: 'species',
    iconicTaxonName: 'Reptilia',
    observationsCount: 180000,
  },

  // İKİ YAŞAMLILAR
  {
    id: 601,
    name: 'Lithobates catesbeianus',
    commonName: 'Boğa Kurbağası',
    rank: 'species',
    iconicTaxonName: 'Amphibia',
    observationsCount: 200000,
  },
  {
    id: 602,
    name: 'Anaxyrus americanus',
    commonName: 'Amerikan Kara Kurbağası',
    rank: 'species',
    iconicTaxonName: 'Amphibia',
    observationsCount: 150000,
  },
  {
    id: 603,
    name: 'Plethodon cinereus',
    commonName: 'Kızıl Sırtlı Semender',
    rank: 'species',
    iconicTaxonName: 'Amphibia',
    observationsCount: 80000,
  },

  // YUMUŞAKÇALAR
  {
    id: 701,
    name: 'Cornu aspersum',
    commonName: 'Bahçe Salyangozu',
    rank: 'species',
    iconicTaxonName: 'Mollusca',
    observationsCount: 300000,
  },
  {
    id: 702,
    name: 'Arion vulgaris',
    commonName: 'Sümüklü Böcek',
    rank: 'species',
    iconicTaxonName: 'Mollusca',
    observationsCount: 100000,
  },

  // ÖRÜMCEKGİLLER
  {
    id: 801,
    name: 'Argiope aurantia',
    commonName: 'Sarı Bahçe Örümceği',
    rank: 'species',
    iconicTaxonName: 'Arachnida',
    observationsCount: 150000,
  },
  {
    id: 802,
    name: 'Nephila clavipes',
    commonName: 'Altın İpek Örümceği',
    rank: 'species',
    iconicTaxonName: 'Arachnida',
    observationsCount: 80000,
  },
];

// iNaturalist ikonik taksonlarından kategori eşleştirmesi
export const categoryMapping: Record<string, string> = {
  Aves: 'Kuşlar',
  Insecta: 'Böcekler',
  Plantae: 'Bitkiler',
  Fungi: 'Mantarlar',
  Mammalia: 'Memeliler',
  Reptilia: 'Sürüngenler',
  Amphibia: 'İki Yaşamlılar',
  Mollusca: 'Yumuşakçalar',
  Arachnida: 'Örümcekgiller',
};

// Kategoriye göre türleri getir
export function getTaxaByCategory(category: string): INatTaxon[] {
  const iconicName = Object.entries(categoryMapping).find(
    ([_, value]) => value === category
  )?.[0];
  
  if (!iconicName) return [];
  return mockTaxa.filter((taxon) => taxon.iconicTaxonName === iconicName);
}

// Mevcut kategorileri getir
export function getAvailableCategories(): string[] {
  return Object.values(categoryMapping);
}

// Kategoriden rastgele tür getir
export function getRandomTaxonFromCategory(category: string): INatTaxon | null {
  const taxa = getTaxaByCategory(category);
  if (taxa.length === 0) return null;
  return taxa[Math.floor(Math.random() * taxa.length)];
}

// iNaturalist API yanıtını simüle et
export function simulateINatSearch(query: string): INatTaxon[] {
  const lowerQuery = query.toLowerCase();
  return mockTaxa.filter(
    (taxon) =>
      taxon.commonName.toLowerCase().includes(lowerQuery) ||
      taxon.name.toLowerCase().includes(lowerQuery)
  );
}
