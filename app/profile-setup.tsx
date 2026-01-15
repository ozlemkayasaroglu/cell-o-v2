import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

// Avatar seçenekleri - çocuk dostu
const avatars = [
  { id: 'unicorn', emoji: '🦄' },
  { id: 'butterfly', emoji: '🦋' },
  { id: 'ladybug', emoji: '🐞' },
  { id: 'bunny', emoji: '🐰' },
  { id: 'cat', emoji: '🐱' },
  { id: 'dog', emoji: '🐶' },
];

// Yaş grupları
const ageGroups = [
  { id: '4-5', label: '4-5 yaş', emoji: '🫘' },
  { id: '6-7', label: '6-7 yaş', emoji: '🌱' },
  { id: '8-9', label: '8-9 yaş', emoji: '🌿' },
  { id: '10-12', label: '10-12 yaş', emoji: '🌳' },
];

export default function ProfileSetupScreen() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('unicorn');
  // Use one of the defined age group ids ('8-9' matches ageGroups)
  const [selectedAge, setSelectedAge] = useState('8-9');

  const handleContinue = async () => {
    try {
      // Profili kaydet
      const profile = {
        nickname: nickname.trim() || 'Küçük Bilim İnsanı',
        avatar: selectedAvatar,
        ageGroup: selectedAge,
        createdAt: new Date().toISOString(),
        totalPoints: 0,
        completedExperiments: [],
        badges: [],
        currentStreak: 0,
      };

      await AsyncStorage.setItem('user_profile', JSON.stringify(profile));
      await AsyncStorage.setItem('profile_completed', 'true');

      router.replace('/(tabs)');
    } catch (error) {
      console.error('Profil kaydedilemedi:', error);
      router.replace('/(tabs)');
    }
  };

  const handleSkip = async () => {
    try {
      // Varsayılan profil oluştur
      const defaultProfile = {
        nickname: 'Küçük Bilim İnsanı',
        avatar: 'scientist',
        // Match the defined age groups (use '8-9' instead of '8-10')
        ageGroup: '8-9',
        createdAt: new Date().toISOString(),
        totalPoints: 0,
        completedExperiments: [],
        badges: [],
        currentStreak: 0,
      };

      await AsyncStorage.setItem(
        'user_profile',
        JSON.stringify(defaultProfile)
      );
      await AsyncStorage.setItem('profile_completed', 'true');

      router.replace('/(tabs)');
    } catch (error) {
      console.error('Profil kaydedilemedi:', error);
      router.replace('/(tabs)');
    }
  };

  const selectedAvatarData = avatars.find((a) => a.id === selectedAvatar);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
      <LinearGradient colors={['#14B8A6', '#0D9488']} style={styles.container}>
        {/* Skip Button */}
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Atla</Text>
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerEmoji}>🎨</Text>
            <Text style={styles.title}>Profilini Oluştur!</Text>
            <Text style={styles.subtitle}>
              İstersen bir takma ad ve avatar seç
            </Text>
          </View>

          {/* Nickname Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Takma Adın</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person" size={20} color="#0D9488" />
              <TextInput
                style={styles.input}
                placeholder="Örn: Süper Kaşif"
                placeholderTextColor="#99E2D8"
                value={nickname}
                onChangeText={setNickname}
                maxLength={20}
              />
            </View>
          </View>

          {/* Avatar Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Avatarını Seç</Text>
            <View style={styles.avatarGrid}>
              {avatars.map((avatar) => (
                <TouchableOpacity
                  key={avatar.id}
                  style={[
                    styles.avatarItem,
                    selectedAvatar === avatar.id && styles.avatarItemSelected,
                  ]}
                  onPress={() => setSelectedAvatar(avatar.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.avatarEmoji}>{avatar.emoji}</Text>
                  {selectedAvatar === avatar.id && (
                    <View style={styles.checkBadge}>
                      <Ionicons name="checkmark" size={12} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Age Group Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Yaş Grubun</Text>
            <View style={styles.ageGrid}>
              {ageGroups.map((age) => (
                <TouchableOpacity
                  key={age.id}
                  style={[
                    styles.ageItem,
                    selectedAge === age.id && styles.ageItemSelected,
                  ]}
                  onPress={() => setSelectedAge(age.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.ageEmoji}>{age.emoji}</Text>
                  <Text
                    style={[
                      styles.ageLabel,
                      selectedAge === age.id && styles.ageLabelSelected,
                    ]}
                  >
                    {age.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Preview */}
          <View style={styles.previewCard}>
            <Text style={styles.previewEmoji}>{selectedAvatarData?.emoji}</Text>
            <Text style={styles.previewName}>
              {nickname.trim() || 'Küçük Bilim İnsanı'}
            </Text>
            <Text style={styles.previewAge}>
              {ageGroups.find((a) => a.id === selectedAge)?.label}
            </Text>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.continueText}>Hazırım! 🚀</Text>
          </TouchableOpacity>

          {/* Privacy Note */}
          <Text style={styles.privacyNote}>
            🔒 Bilgilerin sadece bu cihazda saklanır
          </Text>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 100,
  },
  skipText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContent: {
    paddingTop: 100,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  avatarItem: {
    width: (width - 48 - 50) / 6,
    aspectRatio: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarItemSelected: {
    backgroundColor: '#fff',
    borderColor: '#F59E0B',
  },
  avatarEmoji: {
    fontSize: 24,
  },
  checkBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ageGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  ageItem: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  ageItemSelected: {
    backgroundColor: '#fff',
    borderColor: '#10B981',
  },
  ageEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  ageLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
  },
  ageLabelSelected: {
    color: '#1F2937',
  },
  previewCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  previewEmoji: {
    fontSize: 64,
    marginBottom: 12,
  },
  previewName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  previewAge: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  continueButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 8,
        }),
  },
  continueText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D9488',
  },
  privacyNote: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginTop: 16,
  },
});

// pointerEvents uyarısı için örnek kullanım:
// <View style={{ pointerEvents: 'none' }}> yerine kullanabilirsiniz.
