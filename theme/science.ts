/**
 * Science Lab Theme - onboarding-lab.png renk paleti
 * Sıcak, pastel ve doğa temalı modern renkler
 */

export const scienceTheme = {
  colors: {
    // Ana renkler
    primary: '#14B8A6', // Canlı teal
    secondary: '#FBBF24', // Pastel sarı
    accent: '#34D399', // Açık yeşil
    background: '#F0FDF4', // Sıcak mint
    cardBg: '#FFFFFF', // Beyaz kart
    earth: '#F5E9DA', // Toprak/bej
    blue: '#38BDF8', // Pastel mavi
    pink: '#FCE7F3', // Pastel pembe
    warning: '#F59E0B', // Sarı-turuncu
    success: '#22C55E', // Yeşil
    error: '#EF4444', // Kırmızı
    text: '#1E293B', // Koyu mavi-gri
    textLight: '#64748B', // Açık gri-mavi
  },

  shadows: {
    small: {
      shadowColor: '#14B8A6',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 2,
    },
    medium: {
      shadowColor: '#14B8A6',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 4,
    },
    large: {
      shadowColor: '#14B8A6',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.16,
      shadowRadius: 24,
      elevation: 8,
    },
  },

  borderRadius: {
    small: 12,
    medium: 20,
    large: 32,
    full: 100,
  },
};

// Kategori renkleri (paletten türetildi)
export const categoryColors: Record<string, string> = {
  'Mikroskop Gözlemi': '#38BDF8', // mavi
  'Hücre Biyolojisi': '#34D399', // yeşil
  Mikroorganizmalar: '#FBBF24', // sarı
  'Kristal Oluşumu': '#FCE7F3', // pembe
  'Bitki Anatomisi': '#A7F3D0', // mint
  'Su Yaşamı': '#14B8A6', // teal
  Mantarlar: '#F5E9DA', // toprak
  'Kimyasal Reaksiyon': '#F59E0B', // turuncu
};

// Zorluk bilgileri (paletten türetildi)
export const difficultyInfo: Record<
  string,
  { color: string; label: string; icon: string }
> = {
  kolay: { color: '#A7F3D0', label: 'Kolay', icon: '⭐' },
  orta: { color: '#FBBF24', label: 'Orta', icon: '⭐⭐' },
  zor: { color: '#38BDF8', label: 'Zor', icon: '⭐⭐⭐' },
  uzman: { color: '#F59E0B', label: 'Uzman', icon: '🏆' },
};

export default scienceTheme;
