import { INATURALIST_API_BASE_URL } from "../config";

/**
 * iNaturalist API Servisi
 * Gerçek API çağrıları için
 * https://api.inaturalist.org/v1/docs/
 */

const BASE_URL = INATURALIST_API_BASE_URL;

// Rate limiting: max 60 requests per minute
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second between requests

async function rateLimitedFetch(url: string): Promise<Response> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise((resolve) =>
      setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
    );
  }

  lastRequestTime = Date.now();
  return fetch(url);
}

export interface INatTaxon {
  id: number;
  name: string;
  preferred_common_name?: string;
  rank: string;
  iconic_taxon_name: string;
  observations_count: number;
  default_photo?: {
    medium_url: string;
    attribution: string;
  };
  wikipedia_summary?: string;
  wikipedia_url?: string;
}

export interface INatObservation {
  id: number;
  taxon: INatTaxon;
  description: string;
  place_guess: string;
  observed_on: string;
  quality_grade: "casual" | "needs_id" | "research";
  photos: Array<{
    url: string;
    attribution: string;
  }>;
}

export interface INatSearchResult {
  total_results: number;
  results: INatTaxon[];
}

/**
 * Takson (tür) ara
 */
export async function searchTaxa(
  query: string,
  limit: number = 10
): Promise<INatTaxon[]> {
  try {
    const url = `${BASE_URL}/taxa?q=${encodeURIComponent(
      query
    )}&per_page=${limit}&locale=tr`;
    const response = await rateLimitedFetch(url);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    return [];
  }
}

/**
 * ID ile takson detaylarını getir
 */
export async function getTaxonById(taxonId: number): Promise<INatTaxon | null> {
  try {
    const url = `${BASE_URL}/taxa/${taxonId}?locale=tr`;
    const response = await rateLimitedFetch(url);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.results?.[0] || null;
  } catch (error) {
    return null;
  }
}

/**
 * Mikroskobik organizmalar için özel arama
 */
export async function searchMicroscopicOrganisms(
  category: string
): Promise<INatTaxon[]> {
  const microscopicQueries: Record<string, string[]> = {
    protista: ["paramecium", "amoeba", "euglena", "volvox", "stentor"],
    bacteria: ["bacteria", "cyanobacteria"],
    algae: ["diatom", "spirogyra", "chlorella", "chlamydomonas"],
    fungi: ["yeast", "mold", "aspergillus", "penicillium"],
    plant_cells: ["elodea", "onion epidermis", "stomata"],
    animal_cells: ["cheek cells", "blood cells"],
    pond_life: ["rotifer", "hydra", "daphnia", "cyclops", "planaria"],
  };

  const queries = microscopicQueries[category] || [];
  const allResults: INatTaxon[] = [];

  for (const query of queries.slice(0, 3)) {
    // Limit to 3 queries per category
    const results = await searchTaxa(query, 5);
    allResults.push(...results);
  }

  return allResults;
}

/**
 * Popüler gözlemleri getir (eğitim amaçlı)
 */
export async function getPopularObservations(
  taxonId: number,
  limit: number = 5
): Promise<INatObservation[]> {
  try {
    const url = `${BASE_URL}/observations?taxon_id=${taxonId}&quality_grade=research&per_page=${limit}&order=desc&order_by=votes`;
    const response = await rateLimitedFetch(url);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("iNaturalist observations fetch error:", error);
    return [];
  }
}

/**
 * Türkiye'deki gözlemleri getir
 */
export async function getTurkeyObservations(
  taxonId: number,
  limit: number = 10
): Promise<INatObservation[]> {
  try {
    // Turkey place_id = 7180
    const url = `${BASE_URL}/observations?taxon_id=${taxonId}&place_id=7180&quality_grade=research&per_page=${limit}`;
    const response = await rateLimitedFetch(url);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("iNaturalist Turkey observations error:", error);
    return [];
  }
}

export default {
  searchTaxa,
  getTaxonById,
  searchMicroscopicOrganisms,
  getPopularObservations,
  getTurkeyObservations,
};
