/**
 * Science Lab Theme - Çocuk Dostu Bilim Teması
 * Doğa temalı, eğlenceli ve bilimsel görünüm
 */

export const scienceTheme = {
  colors: {
    // Ana renkler - Doğa teması
    primary: '#0D9488',      // Teal - ana renk
    secondary: '#F59E0B',    // Amber - ikincil
    accent: '#10B981',       // Yeşil - vurgu
    
    // Bilim renkleri
    microscope: '#0891B2',   // Cyan - mikroskop
    chemistry: '#16A34A',    // Yeşil - kimya
    biology: '#EA580C',      // Turuncu - biyoloji
    physics: '#0284C7',      // Mavi - fizik
    
    // Arka plan
    background: '#F0FDF9',   // Açık mint
    cardBg: '#FFFFFF',
    darkBg: '#134E4A',
    
    // Metin
    text: '#1F2937',
    textLight: '#6B7280',
    textWhite: '#FFFFFF',
    
    // Durum renkleri
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#0EA5E9',
    
    // XP ve level
    xpGreen: '#14B8A6',
    xpGold: '#F59E0B',
    
    // Zorluk renkleri
    easy: '#86EFAC',
    medium: '#FDE047', 
    hard: '#FB923C',
    expert: '#F87171',
    
    // Dekoratif
    bubbleBlue: '#ECFEFF',
    bubblePink: '#FFF1F2',
    bubbleGreen: '#F0FDF4',
    bubbleYellow: '#FEFCE8',
  },
  
  shadows: {
    small: {
      shadowColor: '#6C63FF',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#6C63FF',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#6C63FF',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
  
  borderRadius: {
    small: 8,
    medium: 16,
    large: 24,
    full: 100,
  },
};

// Kategori renkleri
export const categoryColors: Record<string, string> = {
  'Mikroskop Gözlemi': '#7C4DFF',
  'Hücre Biyolojisi': '#FF6E40',
  'Mikroorganizmalar': '#00E676',
  'Kristal Oluşumu': '#00D9FF',
  'Bitki Anatomisi': '#8BC34A',
  'Su Yaşamı': '#03A9F4',
  'Mantarlar': '#FF7043',
  'Kimyasal Reaksiyon': '#E91E63',
};

// Zorluk bilgileri
export const difficultyInfo: Record<string, { color: string; label: string; icon: string }> = {
  'kolay': { color: '#81C784', label: 'Kolay', icon: '⭐' },
  'orta': { color: '#FFD54F', label: 'Orta', icon: '⭐⭐' },
  'zor': { color: '#FF8A65', label: 'Zor', icon: '⭐⭐⭐' },
  'uzman': { color: '#BA68C8', label: 'Uzman', icon: '🏆' },
};

export default scienceTheme;
