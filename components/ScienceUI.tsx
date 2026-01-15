/**
 * Science Lab UI Components
 * Çocuk dostu, renkli ve bilimsel bileşenler
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ViewStyle,
} from 'react-native';
import { scienceTheme, difficultyInfo } from '@/theme/science';

// ============ BUTON ============
interface ScienceButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'accent';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export function ScienceButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  icon,
  style,
}: ScienceButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const variantStyles = {
    primary: {
      bg: scienceTheme.colors.primary,
      text: '#FFFFFF',
    },
    secondary: {
      bg: scienceTheme.colors.secondary,
      text: '#FFFFFF',
    },
    success: {
      bg: scienceTheme.colors.success,
      text: '#FFFFFF',
    },
    warning: {
      bg: scienceTheme.colors.warning,
      text: '#1A1A1A',
    },
    accent: {
      bg: scienceTheme.colors.accent,
      text: '#FFFFFF',
    },
  };

  const sizeStyles = {
    small: { paddingVertical: 10, paddingHorizontal: 16, fontSize: 13 },
    medium: { paddingVertical: 14, paddingHorizontal: 24, fontSize: 15 },
    large: { paddingVertical: 18, paddingHorizontal: 32, fontSize: 17 },
  };

  const colors = variantStyles[variant];
  const sizes = sizeStyles[size];

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.9}
        style={[
          styles.scienceButton,
          {
            backgroundColor: disabled ? '#CCC' : colors.bg,
            paddingVertical: sizes.paddingVertical,
            paddingHorizontal: sizes.paddingHorizontal,
          },
          scienceTheme.shadows.medium,
        ]}
      >
        <View style={styles.buttonContent}>
          {icon && <View style={styles.buttonIcon}>{icon}</View>}
          <Text
            style={[
              styles.buttonText,
              {
                color: disabled ? '#888' : colors.text,
                fontSize: sizes.fontSize,
              },
            ]}
          >
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ============ KART ============
interface ScienceCardProps {
  children: React.ReactNode;
  variant?:
    | 'default'
    | 'microscope'
    | 'chemistry'
    | 'biology'
    | 'physics'
    | 'gradient';
  style?: ViewStyle;
}

export function ScienceCard({
  children,
  variant = 'default',
  style,
}: ScienceCardProps) {
  const variantStyles = {
    default: {
      bg: scienceTheme.colors.cardBg,
      border: 'transparent',
    },
    microscope: {
      bg: scienceTheme.colors.bubbleBlue,
      border: 'transparent',
    },
    chemistry: {
      bg: scienceTheme.colors.bubbleGreen,
      border: 'transparent',
    },
    biology: {
      bg: scienceTheme.colors.bubblePink,
      border: 'transparent',
    },
    physics: {
      bg: scienceTheme.colors.bubbleBlue,
      border: 'transparent',
    },
    gradient: {
      bg: '#F8F9FF',
      border: 'transparent',
    },
  };

  const colors = variantStyles[variant];

  return (
    <View
      style={[
        styles.scienceCard,
        {
          backgroundColor: colors.bg,
        },
        scienceTheme.shadows.small,
        style,
      ]}
    >
      {children}
    </View>
  );
}

// ============ İLERLEME ÇUBUĞU ============
interface ProgressBarProps {
  current: number;
  max: number;
  level?: number;
  showLabel?: boolean;
  height?: number;
  color?: string;
}

export function ProgressBar({
  current,
  max,
  level,
  showLabel = true,
  height = 16,
  color = scienceTheme.colors.primary,
}: ProgressBarProps) {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const percentage = Math.min((current / max) * 100, 100);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: percentage,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [percentage]);

  const widthInterpolate = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.progressContainer}>
      {level !== undefined && (
        <View style={[styles.levelCircle, { backgroundColor: color }]}>
          <Text style={styles.levelNumber}>{level}</Text>
        </View>
      )}
      <View style={[styles.progressOuter, { height }]}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: widthInterpolate,
              backgroundColor: color,
            },
          ]}
        />
        {/* Işıltı efekti */}
        <View style={styles.progressShine} />
      </View>
      {showLabel && (
        <Text style={[styles.progressLabel, { color }]}>
          {current}/{max}
        </Text>
      )}
    </View>
  );
}

// ============ ZORLUK ROZETİ ============
interface DifficultyTagProps {
  difficulty: 'kolay' | 'orta' | 'zor' | 'uzman';
}

export function DifficultyTag({ difficulty }: DifficultyTagProps) {
  const info = difficultyInfo[difficulty];

  return (
    <View
      style={[styles.difficultyTag, { backgroundColor: info.color + '20' }]}
    >
      <Text style={styles.difficultyIcon}>{info.icon}</Text>
      <Text style={[styles.difficultyLabel, { color: info.color }]}>
        {info.label}
      </Text>
    </View>
  );
}

// ============ ROZET ============
interface BadgeCircleProps {
  icon: string;
  label?: string;
  color?: string;
  size?: 'small' | 'medium' | 'large';
  locked?: boolean;
}

export function BadgeCircle({
  icon,
  label,
  color = scienceTheme.colors.primary,
  size = 'medium',
  locked = false,
}: BadgeCircleProps) {
  const sizeStyles = {
    small: { width: 48, height: 48, fontSize: 20 },
    medium: { width: 64, height: 64, fontSize: 28 },
    large: { width: 80, height: 80, fontSize: 36 },
  };

  const sizes = sizeStyles[size];

  return (
    <View style={styles.badgeContainer}>
      <View
        style={[
          styles.badgeCircle,
          {
            width: sizes.width,
            height: sizes.height,
            backgroundColor: locked ? '#E0E0E0' : color + '20',
            borderColor: locked ? '#BDBDBD' : color,
          },
        ]}
      >
        <Text
          style={[
            styles.badgeIcon,
            { fontSize: sizes.fontSize, opacity: locked ? 0.3 : 1 },
          ]}
        >
          {locked ? '🔒' : icon}
        </Text>
      </View>
      {label && (
        <Text
          style={[
            styles.badgeLabel,
            { color: locked ? '#999' : scienceTheme.colors.text },
          ]}
        >
          {label}
        </Text>
      )}
    </View>
  );
}

// ============ BİLGİ KUTUSU ============
interface InfoBoxProps {
  title: string;
  value: string | number;
  icon: string;
  color?: string;
}

export function InfoBox({
  title,
  value,
  icon,
  color = scienceTheme.colors.primary,
}: InfoBoxProps) {
  return (
    <View style={[styles.infoBox, { backgroundColor: color + '10' }]}>
      <Text style={styles.infoIcon}>{icon}</Text>
      <Text style={[styles.infoValue, { color }]}>{value}</Text>
      <Text style={styles.infoTitle}>{title}</Text>
    </View>
  );
}

// ============ MALZEME ETİKETİ ============
interface MaterialTagProps {
  name: string;
  icon: string;
  optional?: boolean;
}

export function MaterialTag({
  name,
  icon,
  optional = false,
}: MaterialTagProps) {
  return (
    <View style={[styles.materialTag, optional && styles.materialTagOptional]}>
      <Text style={styles.materialIcon}>{icon}</Text>
      <Text
        style={[styles.materialName, optional && styles.materialNameOptional]}
      >
        {name}
      </Text>
      {optional && (
        <Text style={styles.materialOptionalLabel}>(opsiyonel)</Text>
      )}
    </View>
  );
}

// ============ ADIM KARTI ============
interface StepCardProps {
  stepNumber: number;
  instruction: string;
  tip?: string;
  duration?: string;
  isActive?: boolean;
  isCompleted?: boolean;
}

export function StepCard({
  stepNumber,
  instruction,
  tip,
  duration,
  isActive = false,
  isCompleted = false,
}: StepCardProps) {
  return (
    <View
      style={[
        styles.stepCard,
        isActive && styles.stepCardActive,
        isCompleted && styles.stepCardCompleted,
      ]}
    >
      <View
        style={[
          styles.stepNumber,
          {
            backgroundColor: isCompleted
              ? scienceTheme.colors.success
              : isActive
              ? scienceTheme.colors.primary
              : '#E0E0E0',
          },
        ]}
      >
        <Text style={styles.stepNumberText}>
          {isCompleted ? '✓' : stepNumber}
        </Text>
      </View>
      <View style={styles.stepContent}>
        <Text style={styles.stepInstruction}>{instruction}</Text>
        {duration && <Text style={styles.stepDuration}>⏱️ {duration}</Text>}
        {tip && (
          <View style={styles.stepTip}>
            <Text style={styles.stepTipIcon}>💡</Text>
            <Text style={styles.stepTipText}>{tip}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

// ============ BAŞARI POPUP ============
interface SuccessPopupProps {
  visible: boolean;
  title: string;
  message: string;
  xpEarned?: number;
  badgeEarned?: { icon: string; name: string };
  onClose: () => void;
}

export function SuccessPopup({
  visible,
  title,
  message,
  xpEarned,
  badgeEarned,
  onClose,
}: SuccessPopupProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      rotateAnim.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.popupOverlay}>
      <Animated.View
        style={[styles.successPopup, { transform: [{ scale: scaleAnim }] }]}
      >
        <Animated.Text style={[styles.popupEmoji, { transform: [{ rotate }] }]}>
          🎉
        </Animated.Text>
        <Text style={styles.popupTitle}>{title}</Text>
        <Text style={styles.popupMessage}>{message}</Text>

        {xpEarned && (
          <View style={styles.xpEarnedBox}>
            <Text style={styles.xpEarnedText}>+{xpEarned} XP</Text>
          </View>
        )}

        {badgeEarned && (
          <View style={styles.badgeEarnedBox}>
            <Text style={styles.badgeEarnedIcon}>{badgeEarned.icon}</Text>
            <Text style={styles.badgeEarnedName}>{badgeEarned.name}</Text>
          </View>
        )}

        <ScienceButton
          title="Harika!"
          onPress={onClose}
          variant="success"
          size="large"
          style={{ marginTop: 20 }}
        />
      </Animated.View>
    </View>
  );
}

// ============ STILLER ============
const styles = StyleSheet.create({
  // Buton
  scienceButton: {
    borderRadius: scienceTheme.borderRadius.large,
    overflow: 'hidden',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Kart
  scienceCard: {
    borderRadius: scienceTheme.borderRadius.medium,
    padding: 16,
    marginBottom: 12,
  },

  // İlerleme çubuğu
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  levelCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelNumber: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressOuter: {
    flex: 1,
    backgroundColor: '#E8EAF6',
    borderRadius: 100,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 100,
  },
  progressShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 100,
  },
  progressLabel: {
    fontWeight: 'bold',
    fontSize: 14,
    minWidth: 50,
  },

  // Zorluk
  difficultyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    gap: 4,
  },
  difficultyIcon: {
    fontSize: 12,
  },
  difficultyLabel: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Rozet
  badgeContainer: {
    alignItems: 'center',
    gap: 6,
  },
  badgeCircle: {
    borderRadius: 100,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeIcon: {
    // fontSize dinamik
  },
  badgeLabel: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Bilgi kutusu
  infoBox: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: scienceTheme.borderRadius.medium,
    gap: 4,
  },
  infoIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  infoTitle: {
    fontSize: 11,
    color: scienceTheme.colors.textLight,
    fontWeight: '500',
  },

  // Malzeme etiketi
  materialTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: scienceTheme.colors.bubbleBlue,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: scienceTheme.borderRadius.small,
    marginRight: 8,
    marginBottom: 8,
    gap: 6,
  },
  materialTagOptional: {
    backgroundColor: scienceTheme.colors.bubbleYellow,
    opacity: 0.8,
  },
  materialIcon: {
    fontSize: 16,
  },
  materialName: {
    fontSize: 13,
    fontWeight: '500',
    color: scienceTheme.colors.text,
  },
  materialNameOptional: {
    color: scienceTheme.colors.textLight,
  },
  materialOptionalLabel: {
    fontSize: 10,
    color: scienceTheme.colors.textLight,
    fontStyle: 'italic',
  },

  // Adım kartı
  stepCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: scienceTheme.borderRadius.medium,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    ...scienceTheme.shadows.small,
  },
  stepCardActive: {
    borderColor: scienceTheme.colors.primary,
    backgroundColor: scienceTheme.colors.primary + '08',
  },
  stepCardCompleted: {
    opacity: 0.7,
    backgroundColor: scienceTheme.colors.success + '08',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepInstruction: {
    fontSize: 14,
    color: scienceTheme.colors.text,
    lineHeight: 20,
  },
  stepDuration: {
    fontSize: 12,
    color: scienceTheme.colors.textLight,
    marginTop: 6,
  },
  stepTip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: scienceTheme.colors.bubbleYellow,
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    gap: 6,
  },
  stepTipIcon: {
    fontSize: 14,
  },
  stepTipText: {
    flex: 1,
    fontSize: 12,
    color: '#7B6B00',
    lineHeight: 18,
  },

  // Başarı popup
  popupOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  successPopup: {
    backgroundColor: '#FFF',
    borderRadius: scienceTheme.borderRadius.large,
    padding: 32,
    alignItems: 'center',
    marginHorizontal: 32,
    ...scienceTheme.shadows.large,
  },
  popupEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  popupTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: scienceTheme.colors.text,
    marginBottom: 8,
  },
  popupMessage: {
    fontSize: 15,
    color: scienceTheme.colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },
  xpEarnedBox: {
    backgroundColor: scienceTheme.colors.xpGold + '20',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 100,
    marginTop: 16,
  },
  xpEarnedText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: scienceTheme.colors.xpGold,
  },
  badgeEarnedBox: {
    alignItems: 'center',
    marginTop: 16,
    gap: 4,
  },
  badgeEarnedIcon: {
    fontSize: 48,
  },
  badgeEarnedName: {
    fontSize: 14,
    fontWeight: '600',
    color: scienceTheme.colors.text,
  },
});

export default {
  ScienceButton,
  ScienceCard,
  ProgressBar,
  DifficultyTag,
  BadgeCircle,
  InfoBox,
  MaterialTag,
  StepCard,
  SuccessPopup,
};
