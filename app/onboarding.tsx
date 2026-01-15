import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    type: 'image',
    colors: ['#10B981', '#059669'] as [string, string],
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const currentSlide = slides[currentIndex];

  const renderSlide = () => {
    // Illustration container on top and content card below
    return (
      <>
        <View style={styles.illustrationContainer}>
          <Image
            source={require('../assets/images/onboarding.png')}
            style={styles.illustrationImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.contentCard}>
          <View style={styles.iconWrapper}>
            <Image
              source={require('../assets/images/logo.png')}
              style={styles.cardIcon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.cardTitle}>Keşfet & Deneyle!</Text>
          <Text style={styles.cardDescription}>
            Merak seni inanılmaz keşiflere götüren küçük laboratuvarımıza hoş
            geldin. Güvenli, eğlenceli ve harikalar dolu.
          </Text>
        </View>
      </>
    );
  };

  return (
    <LinearGradient
      colors={['#E8F5F1', '#F0F9F6']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Atla</Text>
      </TouchableOpacity>

      {renderSlide()}

      {/* Dots */}
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              index === currentIndex ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={handleNext}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Keşfe Başla →</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F0F9F6',
  },
  illustrationContainer: {
    width: '100%',
    height: height * 0.58,
    backgroundColor: '#C5D9D0',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationImage: {
    width: '100%',
    height: '100%',
  },
  contentCard: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginTop: -40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  },
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 80,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -48,
    marginBottom: 12,
  },
  cardIcon: {
    width: 80,
    height: 80,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 15,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 22,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
    gap: 12,
  },
  activeDot: {
    width: 32,
    height: 8,
    borderRadius: 8,
    backgroundColor: '#10B981',
    marginHorizontal: 6,
  },
  inactiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 6,
  },
  skipButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  skipText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#10B981',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 28,
    width: '90%',
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
});
