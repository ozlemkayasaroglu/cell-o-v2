import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scienceTheme } from '../theme/science';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  colors: [string, string];
  emoji: string;
}

const slides: OnboardingSlide[] = [
  {
    id: 1,
    title: 'Küçük Bilim İnsanı Ol! 🔬',
    description: 'Evdeki malzemelerle harika deneyler yap ve doğanın sırlarını keşfet!',
    icon: 'flask',
    colors: ['#14B8A6', '#0D9488'] as [string, string],
    emoji: '🧪',
  },
  {
    id: 2,
    title: 'Her Hafta Yeni Macera! 🌟',
    description: 'Her hafta seni bekleyen eğlenceli deneyler var. Adım adım talimatları takip et!',
    icon: 'calendar',
    colors: ['#F59E0B', '#D97706'] as [string, string],
    emoji: '📅',
  },
  {
    id: 3,
    title: 'Rozetler Kazan! 🏆',
    description: 'Deneyleri tamamla, rozetler kazan ve gerçek bir bilim insanı ol!',
    icon: 'trophy',
    colors: ['#10B981', '#059669'] as [string, string],
    emoji: '🎖️',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slideRef = useRef<any>(null);

  // Animasyonlar
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    // Bounce animasyonu
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('onboarding_completed', 'true');
      router.replace('/profile-setup');
    } catch (error) {
      console.error('Onboarding tamamlanamadı:', error);
      router.replace('/profile-setup');
    }
  };

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => {
          const isActive = index === currentIndex;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => setCurrentIndex(index)}
              style={[
                styles.dot,
                {
                  backgroundColor: isActive ? '#fff' : 'rgba(255,255,255,0.4)',
                  width: isActive ? 24 : 10,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  const currentSlide = slides[currentIndex];

  return (
    <LinearGradient
      colors={currentSlide.colors}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Skip Button */}
      {currentIndex < slides.length - 1 && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Atla</Text>
        </TouchableOpacity>
      )}

      {/* Content */}
      <View style={styles.content}>
        {/* Icon Container */}
        <Animated.View
          style={[
            styles.iconContainer,
            { transform: [{ scale: bounceAnim }] },
          ]}
        >
          <View style={styles.iconCircle}>
            <Text style={styles.emoji}>{currentSlide.emoji}</Text>
          </View>
        </Animated.View>

        {/* Floating Elements */}
        <View style={styles.floatingElements} pointerEvents="none">
          <Animated.View style={[styles.floatingBubble, styles.bubble1]}>
            <Text style={styles.bubbleEmoji}>⭐</Text>
          </Animated.View>
          <Animated.View style={[styles.floatingBubble, styles.bubble2]}>
            <Text style={styles.bubbleEmoji}>🌈</Text>
          </Animated.View>
          <Animated.View style={[styles.floatingBubble, styles.bubble3]}>
            <Text style={styles.bubbleEmoji}>✨</Text>
          </Animated.View>
        </View>

        {/* Text Content */}
        <Text style={styles.title}>{currentSlide.title}</Text>
        <Text style={styles.description}>{currentSlide.description}</Text>
      </View>

      {/* Dots */}
      {renderDots()}

      {/* Button */}
      <TouchableOpacity
        style={styles.nextButton}
        onPress={handleNext}
        activeOpacity={0.8}
      >
        <View style={styles.buttonContent}>
          <Text style={styles.buttonText}>
            {currentIndex === slides.length - 1 ? 'Başlayalım!' : 'İleri'}
          </Text>
          <Ionicons
            name={currentIndex === slides.length - 1 ? 'rocket' : 'arrow-forward'}
            size={20}
            color={currentSlide.colors[0]}
          />
        </View>
      </TouchableOpacity>

      {/* Decorative Bottom Wave */}
      <View style={styles.waveContainer} pointerEvents="none">
        <View style={[styles.wave, { backgroundColor: 'rgba(255,255,255,0.1)' }]} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 10,
  },
  skipText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 40,
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  emoji: {
    fontSize: 80,
  },
  floatingElements: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  floatingBubble: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble1: {
    top: '20%',
    left: '10%',
  },
  bubble2: {
    top: '15%',
    right: '15%',
  },
  bubble3: {
    bottom: '30%',
    left: '20%',
  },
  bubbleEmoji: {
    fontSize: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  description: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 16,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    gap: 8,
    zIndex: 100,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  nextButton: {
    marginHorizontal: 32,
    marginBottom: 48,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 100,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6366F1',
  },
  waveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  wave: {
    flex: 1,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
  },
});
