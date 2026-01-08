/**
 * İlerleme Ekranı - Bilim Teması
 * Çocuk dostu deney ilerlemesi ve başarılar
 */

import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useWeeklyExperiment } from '@/hooks/useWeeklyExperiment';
import {
  ScienceCard,
  ProgressBar,
  BadgeCircle,
  InfoBox,
} from '@/components/ScienceUI';
import { scienceTheme } from '@/theme/science';

export default function ProgressScreen() {
  const [totalXP, setTotalXP] = useState(0);
  const [level, setLevel] = useState(1);
  const { progress } = useWeeklyExperiment();

  const loadData = useCallback(() => {
    if (progress) {
      const xp = progress.totalPoints;
      setTotalXP(xp);
      setLevel(Math.floor(xp / 100) + 1);
    }
  }, [progress]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const currentLevelXP = totalXP % 100;
  const experimentsCompleted = progress?.totalExperimentsCompleted || 0;

  // Achievement badges - deney odaklı
  const achievements = [
    {
      id: 1,
      icon: '🔬',
      name: 'İlk Deney',
      unlocked: experimentsCompleted >= 1,
      desc: '1 deney tamamla',
    },
    {
      id: 2,
      icon: '🧪',
      name: 'Meraklı',
      unlocked: experimentsCompleted >= 3,
      desc: '3 deney tamamla',
    },
    {
      id: 3,
      icon: '🧫',
      name: 'Bilim İnsanı',
      unlocked: experimentsCompleted >= 5,
      desc: '5 deney tamamla',
    },
    {
      id: 4,
      icon: '🏆',
      name: 'Araştırmacı',
      unlocked: experimentsCompleted >= 8,
      desc: '8 deney tamamla',
    },
    {
      id: 5,
      icon: '💎',
      name: 'Uzman',
      unlocked: experimentsCompleted >= 10,
      desc: '10 deney tamamla',
    },
    {
      id: 6,
      icon: '👑',
      name: 'Profesör',
      unlocked: experimentsCompleted >= 12,
      desc: '12 deney tamamla',
    },
  ];

  const earnedBadges = progress?.badges || [];
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}

      <View style={styles.content}>
        {/* Profile Card */}
        <ScienceCard style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarEmoji}>🧑‍🔬</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileTitle}>Küçük Bilim İnsanı</Text>
              <Text style={styles.levelText}>Seviye {level}</Text>
            </View>
          </View>

          <View style={styles.xpSection}>
            <View style={styles.xpHeader}>
              <Text style={styles.xpLabel}>Deneyim Puanı</Text>
              <Text style={styles.xpValue}>{totalXP} XP</Text>
            </View>
            <ProgressBar
              current={currentLevelXP}
              max={100}
              height={16}
              color={scienceTheme.colors.primary}
              showLabel={false}
            />
            <Text style={styles.xpSubtext}>
              Seviye {level + 1} için {100 - currentLevelXP} XP daha
            </Text>
          </View>
        </ScienceCard>

        {/* Stats */}
        <Text style={styles.sectionTitle}>📊 İstatistikler</Text>
        <View style={styles.statsRow}>
          <InfoBox
            title="Deney"
            value={experimentsCompleted}
            icon="🧪"
            color={scienceTheme.colors.microscope}
          />
          <InfoBox
            title="Rozet"
            value={earnedBadges.length}
            icon="🏅"
            color={scienceTheme.colors.xpGold}
          />
          <InfoBox
            title="Seri"
            value={progress?.streak || 0}
            icon="🔥"
            color={scienceTheme.colors.biology}
          />
        </View>

        {/* Achievements */}
        <Text style={styles.sectionTitle}>
          🏆 Başarılar ({unlockedCount}/{achievements.length})
        </Text>
        <ScienceCard style={styles.achievementsCard}>
          <View style={styles.achievementsGrid}>
            {achievements.map((achievement) => (
              <View key={achievement.id} style={styles.achievementItem}>
                <BadgeCircle
                  icon={achievement.icon}
                  label={achievement.name}
                  color={
                    achievement.unlocked ? scienceTheme.colors.xpGold : '#999'
                  }
                  size="medium"
                  locked={!achievement.unlocked}
                />
                <Text
                  style={[
                    styles.achievementDesc,
                    !achievement.unlocked && styles.achievementDescLocked,
                  ]}
                >
                  {achievement.desc}
                </Text>
              </View>
            ))}
          </View>
        </ScienceCard>

        {/* Earned Badges */}
        {earnedBadges.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>🎖️ Kazanılan Rozetler</Text>
            <ScienceCard variant="chemistry" style={styles.badgesCard}>
              {earnedBadges.map((badge) => (
                <View key={badge.id} style={styles.badgeRow}>
                  <Text style={styles.badgeIcon}>{badge.icon}</Text>
                  <View style={styles.badgeInfo}>
                    <Text style={styles.badgeName}>{badge.name}</Text>
                    <Text style={styles.badgeDesc}>{badge.description}</Text>
                  </View>
                </View>
              ))}
            </ScienceCard>
          </>
        )}

        {/* Empty State */}
        {experimentsCompleted === 0 && (
          <ScienceCard variant="microscope" style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>🔬</Text>
            <Text style={styles.emptyTitle}>İlk Deneyini Yap!</Text>
            <Text style={styles.emptyText}>
              XP kazanmak ve seviye atlamak için haftalık deneyleri tamamla!
            </Text>
          </ScienceCard>
        )}

        {/* Motivation */}
        <ScienceCard variant="biology" style={styles.motivationCard}>
          <Text style={styles.motivationEmoji}>💪</Text>
          <Text style={styles.motivationTitle}>Devam Et!</Text>
          <Text style={styles.motivationText}>
            Her deney seni bir adım daha yaklaştırıyor. Bilim Ustası olmak için
            keşfetmeye devam et!
          </Text>
        </ScienceCard>
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
    backgroundColor: scienceTheme.colors.xpGold,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerEmoji: {
    fontSize: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.6)',
    marginTop: 2,
  },
  content: {
    padding: 20,
  },
  profileCard: {
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: scienceTheme.colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarEmoji: {
    fontSize: 40,
  },
  profileInfo: {
    flex: 1,
  },
  profileTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: scienceTheme.colors.text,
  },
  levelText: {
    fontSize: 15,
    color: scienceTheme.colors.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  xpSection: {
    backgroundColor: scienceTheme.colors.background,
    padding: 16,
    borderRadius: 12,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  xpLabel: {
    fontSize: 14,
    color: scienceTheme.colors.textLight,
  },
  xpValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: scienceTheme.colors.primary,
  },
  xpSubtext: {
    fontSize: 12,
    color: scienceTheme.colors.textLight,
    textAlign: 'center',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: scienceTheme.colors.text,
    marginBottom: 12,
    marginTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  achievementsCard: {
    marginBottom: 24,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 20,
  },
  achievementDesc: {
    fontSize: 10,
    color: scienceTheme.colors.textLight,
    textAlign: 'center',
    marginTop: 6,
  },
  achievementDescLocked: {
    color: '#CCC',
  },
  badgesCard: {
    marginBottom: 24,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  badgeIcon: {
    fontSize: 36,
    marginRight: 16,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeName: {
    fontSize: 16,
    fontWeight: '600',
    color: scienceTheme.colors.text,
  },
  badgeDesc: {
    fontSize: 13,
    color: scienceTheme.colors.textLight,
    marginTop: 2,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 32,
    marginBottom: 24,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: scienceTheme.colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: scienceTheme.colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
  motivationCard: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 32,
  },
  motivationEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  motivationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: scienceTheme.colors.text,
    marginBottom: 8,
  },
  motivationText: {
    fontSize: 14,
    color: scienceTheme.colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
});
