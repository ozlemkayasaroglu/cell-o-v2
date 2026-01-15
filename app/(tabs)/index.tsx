/**
 * Ana Ekran - Bilim Laboratuvarı Teması
 * Çocuk dostu, renkli mikroskop kaşifi arayüzü
 */

import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Microscope,
  FlaskConical,
  Trophy,
  ChevronRight,
  Sparkles,
} from 'lucide-react-native';
import { useWeeklyExperiment } from '@/hooks/useWeeklyExperiment';
import { useScreenTime } from '@/hooks/useScreenTime';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ScienceButton,
  ScienceCard,
  ProgressBar,
  DifficultyTag,
  InfoBox,
} from '@/components/ScienceUI';
import { scienceTheme, categoryColors } from '@/theme/science';

export default function HomeScreen() {
  const router = useRouter();
  const { currentExperiment, progress, loading } = useWeeklyExperiment();
  const screenTime = useScreenTime();
  const [totalXP, setTotalXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [profile, setProfile] = useState<any>(null);
  const floatAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;
  const xpIntervalRef = useRef<number | null>(null);

  // Age group default role titles (matches getDefaultNickname)
  const ageDefaultTitles: Record<string, string> = {
    '4-5': 'Küçük Bilim İnsanı',
    '6-7': 'Meraklı Öğrenen',
    '8-9': 'Deney Sever',
    '10-12': 'Bilim Yolcusu',
  };

  // Avatar id -> emoji map (must match profile-setup avatars)
  const avatarEmojiMap: Record<string, string> = {
    unicorn: '🦄',
    butterfly: '🦋',
    ladybug: '🐞',
    bunny: '🐰',
    cat: '🐱',
    dog: '🐶',
  };
  // Load saved profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const raw = await AsyncStorage.getItem('user_profile');
        if (raw) {
          setProfile(JSON.parse(raw));
        }
      } catch (e) {
        console.warn('Profil yüklenemedi:', e);
      }
    };
    loadProfile();
  }, []);

  useEffect(() => {
    // progress değiştiğinde animasyonlu XP artışı uygula
    const newXP = progress?.totalPoints || 0;
    animateXpTo(newXP);
    startAnimations();

    return () => {
      if (xpIntervalRef.current) {
        clearInterval(xpIntervalRef.current);
      }
    };
  }, [progress]);

  const startAnimations = () => {
    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Sparkle animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // Eski yükleme mantığı yerine animasyonlu artış
  const animateXpTo = (targetXP: number) => {
    if (xpIntervalRef.current) {
      clearInterval(xpIntervalRef.current);
      xpIntervalRef.current = null;
    }

    const startXP = totalXP;
    const diff = targetXP - startXP;
    if (diff === 0) {
      setLevel(Math.floor(targetXP / 100) + 1);
      setTotalXP(targetXP);
      return;
    }

    const duration = 800; // ms
    const stepMs = 40;
    const steps = Math.max(1, Math.ceil(duration / stepMs));
    let step = 0;

    xpIntervalRef.current = setInterval(() => {
      step += 1;
      const progressRatio = Math.min(1, step / steps);
      const current = Math.round(startXP + diff * progressRatio);
      setTotalXP(current);
      if (step >= steps) {
        if (xpIntervalRef.current) {
          clearInterval(xpIntervalRef.current);
          xpIntervalRef.current = null;
        }
        setTotalXP(targetXP);
        setLevel(Math.floor(targetXP / 100) + 1);
      }
    }, stepMs) as unknown as number;
  };

  // Seviye totalXP değiştiğinde de güncellensin
  useEffect(() => {
    setLevel(Math.floor(totalXP / 100) + 1);
  }, [totalXP]);

  const navigateToExperiments = () => {
    router.push('/(tabs)/experiments');
  };

  // XP ve seviye hesaplaması doğrudan progress'ten
  const xp = progress?.totalPoints || 0;
  const levelNow = Math.floor(xp / 100) + 1;
  const levelXP = xp % 100;
  const xpToNext = 100 - levelXP;

  const sparkleOpacity = sparkleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Animated.View
            style={[
              styles.iconContainer,
              { transform: [{ translateY: floatAnim }] },
            ]}
          >
            <Text style={styles.headerEmoji}>
              {profile ? avatarEmojiMap[profile.avatar] || '🔬' : '🔬'}
            </Text>
            <Animated.View
              style={[styles.sparkle, { opacity: sparkleOpacity }]}
            >
              <Sparkles size={20} color="#FFD700" />
            </Animated.View>
          </Animated.View>
          <Text style={styles.title}>
            {profile?.nickname || 'Küçük Bilim İnsanı'}
          </Text>
          <Text style={styles.subtitle}>
            {profile
              ? ageDefaultTitles[profile.ageGroup] || 'Küçük Bilim İnsanı'
              : 'Mikro dünyanın harikalarını keşfet!'}
          </Text>
        </View>

        {/* Decorative bubbles */}
        <View style={[styles.bubble, styles.bubble1]} />
        <View style={[styles.bubble, styles.bubble2]} />
        <View style={[styles.bubble, styles.bubble3]} />
      </View>

      <View style={styles.content}>
        {/* Screen Time Card */}
        <ScienceCard style={styles.screenTimeCard}>
          <View style={styles.screenTimeHeader}>
            <Text style={styles.screenTimeTitle}>⏰ Bugünkü Süren</Text>
            <View
              style={[
                styles.screenTimeBadge,
                screenTime.isLimitReached && styles.screenTimeBadgeWarning,
              ]}
            >
              <Text
                style={[
                  styles.screenTimeBadgeText,
                  screenTime.isLimitReached &&
                    styles.screenTimeBadgeTextWarning,
                ]}
              >
                {screenTime.ageGroup} yaş
              </Text>
            </View>
          </View>

          <View style={styles.screenTimeContent}>
            <View style={styles.screenTimeInfo}>
              <Text style={styles.screenTimeUsed}>
                {screenTime.usedFormatted}
              </Text>
              <Text style={styles.screenTimeLimit}>
                / {screenTime.dailyLimitMinutes} dk
              </Text>
            </View>

            <View style={styles.screenTimeRemaining}>
              <Text style={styles.screenTimeRemainingLabel}>Kalan:</Text>
              <Text
                style={[
                  styles.screenTimeRemainingValue,
                  screenTime.isLimitReached && styles.screenTimeWarning,
                ]}
              >
                {screenTime.remainingFormatted}
              </Text>
            </View>
          </View>

          <ProgressBar
            current={screenTime.percentUsed}
            max={100}
            height={12}
            color={
              screenTime.percentUsed > 80
                ? '#EF4444'
                : screenTime.percentUsed > 50
                ? '#F59E0B'
                : scienceTheme.colors.primary
            }
            showLabel={false}
          />

          {screenTime.isLimitReached && (
            <View style={styles.screenTimeWarningBox}>
              <Text style={styles.screenTimeWarningText}>
                ⚠️ Bugünlük süren doldu! Haftaya tekrar gel 🌙
              </Text>
            </View>
          )}
        </ScienceCard>
        {/* This Week's Experiment */}
        <Text style={styles.sectionTitle}>🧪 Bu Haftanın Deneyi</Text>

        {loading ? (
          <ScienceCard>
            <Text style={styles.loadingText}>Deney yükleniyor...</Text>
          </ScienceCard>
        ) : currentExperiment ? (
          <TouchableOpacity onPress={navigateToExperiments} activeOpacity={0.9}>
            <ScienceCard variant="microscope" style={styles.experimentCard}>
              <View style={styles.experimentHeader}>
                <View style={styles.weekBadge}>
                  <Text style={styles.weekBadgeText}>
                    Hafta {(progress?.totalExperimentsCompleted ?? 0) + 1}
                  </Text>
                </View>
                <DifficultyTag difficulty={currentExperiment.difficulty} />
              </View>

              <Text style={styles.experimentTitle}>
                {(currentExperiment as any).childFriendly?.title ??
                  currentExperiment.title}
              </Text>
              <Text style={styles.experimentDesc} numberOfLines={2}>
                {(currentExperiment as any).childFriendly?.description ??
                  currentExperiment.description}
              </Text>

              <View style={styles.experimentFooter}>
                <View style={styles.experimentInfo}>
                  <Text style={styles.experimentInfoText}>
                    ⏱️ {currentExperiment.estimatedTime}
                  </Text>
                  <Text style={styles.experimentInfoText}>
                    ⭐ +{currentExperiment.points} XP
                  </Text>
                </View>
                <View style={styles.arrowCircle}>
                  <ChevronRight size={20} color={scienceTheme.colors.primary} />
                </View>
              </View>
            </ScienceCard>
          </TouchableOpacity>
        ) : (
          <ScienceCard style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>🎉</Text>
            <Text style={styles.emptyText}>Tüm deneyler tamamlandı!</Text>
          </ScienceCard>
        )}

        {/* Stats */}
        <View style={styles.statsRow}>
          <InfoBox
            title="Deney"
            value={progress?.totalExperimentsCompleted || 0}
            icon="🧪"
            color={scienceTheme.colors.chemistry}
          />
          <InfoBox
            title="Rozet"
            value={progress?.badges?.length || 0}
            icon="🏅"
            color={scienceTheme.colors.accent}
          />
          <InfoBox
            title="Seri"
            value={progress?.streak || 0}
            icon="🔥"
            color={scienceTheme.colors.biology}
          />
        </View>

        {/* İlerleme Detayları Kartı */}
        <ScienceCard style={styles.progressDetailsCard}>
          <Text style={styles.progressDetailsTitle}>📈 İlerleme Detayları</Text>
          {progress ? (
            <View style={styles.progressDetailsBody}>
              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>Toplam XP</Text>
                <Text style={styles.progressValue}>{totalXP} XP</Text>
              </View>

              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>Tamamlanan Deney</Text>
                <Text style={styles.progressValue}>
                  {progress.totalExperimentsCompleted}
                </Text>
              </View>

              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>Seri (Gün)</Text>
                <Text style={styles.progressValue}>{progress.streak}</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.loadingText}>
              İlerleme bilgisi yükleniyor...
            </Text>
          )}
        </ScienceCard>

        {/* Tip Card */}
        <ScienceCard variant="chemistry" style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Text style={styles.tipEmoji}>💡</Text>
            <Text style={styles.tipTitle}>Bilim İpucu</Text>
          </View>
          <Text style={styles.tipText}>
            Mikroskop kullanırken en düşük büyütmeden başla ve yavaşça artır. Bu
            şekilde numuneni daha kolay bulursun!
          </Text>
        </ScienceCard>

        {/* Start Button */}
        <SafeAreaView
          edges={['bottom']}
          style={{ backgroundColor: 'transparent' }}
        >
          <ScienceButton
            title="Deneye Başla!"
            onPress={navigateToExperiments}
            variant="primary"
            size="large"
            icon={<FlaskConical size={22} color="#FFF" />}
            style={styles.startButton}
          />
        </SafeAreaView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: scienceTheme.colors.background,
  },
  header: {
    backgroundColor: scienceTheme.colors.primary,
    paddingTop: 60,
    paddingBottom: 40,
    marginBottom: 30,
    paddingHorizontal: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  headerContent: {
    alignItems: 'center',
    zIndex: 1,
  },
  iconContainer: {
    width: 100,
    height: 100,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerEmoji: {
    fontSize: 52,
  },
  sparkle: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
  },
  bubble: {
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  bubble1: {
    width: 80,
    height: 80,
    top: 20,
    left: -20,
  },
  bubble2: {
    width: 60,
    height: 60,
    top: 80,
    right: -10,
  },
  bubble3: {
    width: 40,
    height: 40,
    bottom: 30,
    left: 50,
  },
  content: {
    padding: 20,
    marginTop: -20,
  },
  xpCard: {
    marginBottom: 16,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  xpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: scienceTheme.colors.text,
  },
  levelBadge: {
    fontSize: 13,
    fontWeight: 'bold',
    color: scienceTheme.colors.primary,
    backgroundColor: scienceTheme.colors.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 100,
  },
  xpSubtext: {
    fontSize: 12,
    color: scienceTheme.colors.textLight,
    textAlign: 'center',
    marginTop: 8,
  },
  xpTotalText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: scienceTheme.colors.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  xpProgressRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 4,
  },
  xpProgressLabel: {
    fontSize: 12,
    color: scienceTheme.colors.textLight,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: scienceTheme.colors.text,
    marginBottom: 12,
    marginHorizontal: 8,
  },
  loadingText: {
    textAlign: 'center',
    color: scienceTheme.colors.textLight,
    padding: 20,
  },
  experimentCard: {
    marginBottom: 20,
  },
  experimentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  weekBadge: {
    backgroundColor: scienceTheme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 100,
  },
  weekBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFF',
  },
  experimentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: scienceTheme.colors.text,
    marginBottom: 6,
  },
  experimentDesc: {
    fontSize: 14,
    color: scienceTheme.colors.textLight,
    lineHeight: 20,
    marginBottom: 12,
  },
  experimentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  experimentInfo: {
    flexDirection: 'row',
    gap: 16,
  },
  experimentInfoText: {
    fontSize: 13,
    color: scienceTheme.colors.textLight,
  },
  arrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: scienceTheme.colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard: {
    alignItems: 'center',
    padding: 32,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: scienceTheme.colors.textLight,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  actionCard: {
    flex: 1,
    padding: 20,
    borderRadius: scienceTheme.borderRadius.medium,
    alignItems: 'center',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: scienceTheme.colors.text,
    marginBottom: 4,
  },
  actionDesc: {
    fontSize: 12,
    color: scienceTheme.colors.textLight,
    textAlign: 'center',
  },
  tipCard: {
    marginBottom: 20,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  tipEmoji: {
    fontSize: 20,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: scienceTheme.colors.text,
  },
  tipText: {
    fontSize: 14,
    color: scienceTheme.colors.textLight,
    lineHeight: 20,
  },
  startButton: {
    marginBottom: 32,
  },
  // Screen Time Styles
  screenTimeCard: {
    marginBottom: 20,
    padding: 16,
  },
  screenTimeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  screenTimeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: scienceTheme.colors.text,
  },
  screenTimeBadge: {
    backgroundColor: scienceTheme.colors.primary + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  screenTimeBadgeWarning: {
    backgroundColor: '#FEE2E2',
  },
  screenTimeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: scienceTheme.colors.primary,
  },
  screenTimeBadgeTextWarning: {
    color: '#EF4444',
  },
  screenTimeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  screenTimeInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  screenTimeUsed: {
    fontSize: 28,
    fontWeight: 'bold',
    color: scienceTheme.colors.text,
  },
  screenTimeLimit: {
    fontSize: 16,
    color: scienceTheme.colors.textLight,
    marginLeft: 4,
  },
  screenTimeRemaining: {
    alignItems: 'flex-end',
  },
  screenTimeRemainingLabel: {
    fontSize: 12,
    color: scienceTheme.colors.textLight,
  },
  screenTimeRemainingValue: {
    fontSize: 18,
    fontWeight: '600',
    color: scienceTheme.colors.primary,
  },
  screenTimeWarning: {
    color: '#EF4444',
  },
  screenTimeWarningBox: {
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  screenTimeWarningText: {
    fontSize: 13,
    color: '#DC2626',
    textAlign: 'center',
    fontWeight: '500',
  },
  progressDetailsCard: {
    marginBottom: 20,
    padding: 16,
  },
  progressDetailsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: scienceTheme.colors.text,
    marginBottom: 12,
  },
  progressDetailsBody: {
    // Body styles for progress details
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: scienceTheme.colors.textLight,
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '600',
    color: scienceTheme.colors.text,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  badgeIcon: {
    fontSize: 22,
  },
});
