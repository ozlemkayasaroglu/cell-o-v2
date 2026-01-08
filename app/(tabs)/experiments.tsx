/**
 * Deneyler Ekranı - Bilim Teması
 * Haftalık deneyleri görüntüle ve tamamla
 */

import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useWeeklyExperiment } from '@/hooks/useWeeklyExperiment';
import {
  ScienceCard,
  ScienceButton,
  DifficultyTag,
  ProgressBar,
} from '@/components/ScienceUI';
import { scienceTheme } from '@/theme/science';
import { WeeklyExperiment } from '@/types/experimentTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ExperimentStep } from '@/types/experimentTypes';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function ExperimentsScreen() {
  const router = useRouter();
  const { currentExperiment, progress, completeExperiment, advanceWeek, loading } = useWeeklyExperiment();
  const [selectedExperiment, setSelectedExperiment] = useState<WeeklyExperiment | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedVariantSteps, setSelectedVariantSteps] = useState<ExperimentStep[] | null>(null);
  // Confetti için state ve referanslar
  const [showConfetti, setShowConfetti] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState<string | null>(null);
  const confettiCount = 14;
  const confettiAnims = useRef<Animated.Value[]>([]);
  const confettiLeft = useRef<number[]>([]);
  const confettiColors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#B388EB'];

  // initialize confetti arrays lazily
  if (!confettiAnims.current || confettiAnims.current.length === 0) {
    confettiAnims.current = Array.from({ length: confettiCount }, () => new Animated.Value(0));
    confettiLeft.current = Array.from({ length: confettiCount }, () => Math.random() * 90 + 5); // percent left
  }

  // Açılan deney için kullanıcının yaş grubuna göre uygun varyant adımlarını seçer
  const openExperiment = async (experiment: WeeklyExperiment) => {
    try {
      const profileData = await AsyncStorage.getItem('user_profile');
      const profile = profileData ? JSON.parse(profileData) : null;
      const ageGroup: string | undefined = profile?.ageGroup;

      let matchedSteps: ExperimentStep[] | null = null;

      if (experiment.variants && ageGroup) {
        // 1) Doğrudan anahtar eşleşmesi
        if (experiment.variants[ageGroup] && experiment.variants[ageGroup].steps) {
          matchedSteps = experiment.variants[ageGroup].steps || null;
        }

        // 2) Yaş aralığı/parçalama mantığı (örn. "4-5") -> sayısal karşılaştırma
        if (!matchedSteps) {
          const numMatch = ageGroup.match(/(\d{1,2})/);
          const ageNum = numMatch ? parseInt(numMatch[1], 10) : NaN;

          const preferredKeys: string[] = [];
          if (!isNaN(ageNum)) {
            if (ageNum <= 5) {
              preferredKeys.push('small', 'küçük', 'kucuk', 'young');
            } else if (ageNum <= 9) {
              preferredKeys.push('medium', 'orta');
            } else {
              preferredKeys.push('large', 'büyük', 'buyuk', 'advanced');
            }
          }

          // Arama: variant anahtarları normalize edilerek tercih listesiyle eşleşmeye çalışılır
          const variantKeys = Object.keys(experiment.variants || {});
          for (const pk of preferredKeys) {
            const found = variantKeys.find((k) => k.toLowerCase().includes(pk));
            if (found && experiment.variants![found].steps) {
              matchedSteps = experiment.variants![found].steps || null;
              break;
            }
          }

          // 3) Eğer hala yoksa, variant anahtarlarından özellikle küçük/orta/büyük Türkçe anahtarları dene
          if (!matchedSteps) {
            const fallbackKeys = ['küçük', 'kucuk', 'orta', 'büyük', 'buyuk', 'small', 'medium', 'large'];
            const found = variantKeys.find((k) => fallbackKeys.some(fk => k.toLowerCase().includes(fk)));
            if (found && experiment.variants![found].steps) {
              matchedSteps = experiment.variants![found].steps || null;
            }
          }
        }

        // 4) Eğer varyant sadece stepsCount içeriyorsa, orijinal adımlardan kırp
        if (!matchedSteps) {
          const variantEntryKey = Object.keys(experiment.variants || {})[0];
          const maybe = experiment.variants?.[variantEntryKey];
          if (maybe && maybe.stepsCount && experiment.steps) {
            matchedSteps = experiment.steps.slice(0, maybe.stepsCount);
          }
        }
      }

      setSelectedExperiment(experiment);
      setSelectedVariantSteps(matchedSteps);
      setCurrentStep(0);
      setShowModal(true);
    } catch (err) {
      console.error('openExperiment hata:', err);
      setSelectedExperiment(experiment);
      setSelectedVariantSteps(null);
      setCurrentStep(0);
      setShowModal(true);
    }
  };

  const nextStep = () => {
    const steps = selectedVariantSteps ?? selectedExperiment?.steps ?? [];
    if (steps && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (selectedExperiment) {
      try {
        const result = await completeExperiment(selectedExperiment.id, {
          notes: 'Deney tamamlandı!',
          rating: 5,
        });
        
        if (result.success) {
          // Gösterilecek kutlama mesajını ayarla
          setCelebrationMessage('Bu haftalık deneyi tamamladın!');

          // Konfeti çalıştır ve bitmesini bekle
          await triggerConfetti();

          // Sonraki haftaya geç ve modalı kapat
          await advanceWeek();
          setShowModal(false);

          // Kısa bekleme sonrası temizle ve deneyler listesine yönlendir
          setTimeout(() => {
            setShowConfetti(false);
            setCelebrationMessage(null);
            // Deneyler ekranına yönlendir
            router.replace('/(tabs)/experiments');
          }, 300);
        } else {
          Alert.alert('Bilgi', 'Bu deneyi zaten tamamlamıştın!');
          setShowModal(false);
        }
      } catch (error) {
        console.error('Deney tamamlama hatası:', error);
        Alert.alert('Hata', 'Deney tamamlanamadı.');
      }
    }
  };

  // Konfeti animasyonunu çalıştırır ve tamamlandığında çözülür
  const triggerConfetti = () => {
    return new Promise<void>((resolve) => {
      setShowConfetti(true);

      // reset anim değerleri
      confettiAnims.current.forEach((a) => a.setValue(0));

      const animations = confettiAnims.current.map((anim, i) => {
        return Animated.timing(anim, {
          toValue: 1,
          duration: 1200 + Math.random() * 600,
          delay: i * 40,
          useNativeDriver: true,
        });
      });

      Animated.stagger(30, animations).start(() => {
        // kısa süre sonra gizle
        setTimeout(() => {
          setShowConfetti(false);
          resolve();
        }, 700);
      });
    });
  };

  // displaySteps: modalda gösterilecek adım dizisi (variant varsa onu kullan)
  const displaySteps = selectedVariantSteps ?? selectedExperiment?.steps ?? [];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingEmoji}>🔬</Text>
        <Text style={styles.loadingText}>Deneyler yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>🧪</Text>
        <Text style={styles.headerTitle}>Haftalık Deneyler</Text>
        <Text style={styles.headerSubtitle}>
          Bilim dünyasını keşfetmeye hazır mısın?
        </Text>
      </View>

      <View style={styles.content}>
        {/* Current Week Experiment */}
        {currentExperiment && (
          <>
            <Text style={styles.sectionTitle}>🌟 Bu Haftanın Deneyi</Text>
            <TouchableOpacity
              onPress={() => openExperiment(currentExperiment)}
              activeOpacity={0.9}
            >
              <ScienceCard style={styles.currentCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.weekBadge}>
                    <Text style={styles.weekBadgeText}>
                      Hafta {currentExperiment.weekNumber}
                    </Text>
                  </View>
                  <DifficultyTag difficulty={currentExperiment.difficulty} />
                </View>

                {/* Age suitability and parent note */}
                <View style={styles.ageRow}>
                  {typeof currentExperiment.ageSuitable !== 'undefined' && (
                    <Text
                      style={[
                        styles.ageSuitability,
                        currentExperiment.ageSuitable ? styles.ageSuitableOk : styles.ageSuitableWarn,
                      ]}
                    >
                      {currentExperiment.ageSuitable ? 'Bu yaşa uygun' : 'Yaş için uyarlanmadı'}
                    </Text>
                  )}
                  {currentExperiment.parentRequired && (
                    <Text style={styles.parentNote}>👪 Ebeveyn gözetimi önerilir</Text>
                  )}
                </View>

               <Text style={styles.experimentTitle}>{currentExperiment.title}</Text>
                <Text style={styles.experimentDesc} numberOfLines={2}>
                  {currentExperiment.description}
                </Text>

                <View style={styles.experimentMeta}>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaIcon}>⏱️</Text>
                    <Text style={styles.metaText}>{currentExperiment.estimatedTime}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaIcon}>⭐</Text>
                    <Text style={styles.metaText}>+{currentExperiment.points} XP</Text>
                  </View>
                </View>

                <View style={styles.materialsPreview}>
                  <Text style={styles.materialsTitle}>Malzemeler:</Text>
                  <View style={styles.materialsRow}>
                    {currentExperiment.materials.slice(0, 5).map((m, i) => (
                      <Text key={i} style={styles.materialIcon}>{m.icon}</Text>
                    ))}
                    {currentExperiment.materials.length > 5 && (
                      <Text style={styles.moreText}>+{currentExperiment.materials.length - 5}</Text>
                    )}
                  </View>
                </View>

                <ScienceButton
                  title="Deneye Başla!"
                  onPress={() => openExperiment(currentExperiment)}
                  variant="primary"
                  size="medium"
                />
              </ScienceCard>
            </TouchableOpacity>
          </>
        )}

        {/* Progress */}
        <Text style={styles.sectionTitle}>📊 İlerleme</Text>
        <ScienceCard style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Tamamlanan Deneyler</Text>
            <Text style={styles.progressCount}>
              {progress?.totalExperimentsCompleted || 0} / 52
            </Text>
          </View>
          <ProgressBar
            current={progress?.totalExperimentsCompleted || 0}
            max={52}
            height={12}
            color={scienceTheme.colors.accent}
          />
        </ScienceCard>

        {/* Tips */}
        <ScienceCard style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Deney İpuçları</Text>
          <View style={styles.tipsList}>
            <Text style={styles.tipItem}>• Malzemeleri önceden hazırla</Text>
            <Text style={styles.tipItem}>• Adımları dikkatlice oku</Text>
            <Text style={styles.tipItem}>• Gözlemlerini not al</Text>
            <Text style={styles.tipItem}>• Eğlen ve öğren!</Text>
          </View>
        </ScienceCard>
      </View>

      {/* Experiment Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowModal(false)}
      >
        {selectedExperiment && (
          <>
            {/* konfeti overlay */}
            {showConfetti && (
              <View pointerEvents="none" style={styles.confettiContainer}>
                {confettiAnims.current.map((anim, i) => {
                   const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [-50, SCREEN_HEIGHT] });
                   const rotate = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
                   const leftPercent = confettiLeft.current[i];
                   const leftStyle = { left: `${leftPercent}%` } as any;
                   const opacity = anim.interpolate({ inputRange: [0, 0.8, 1], outputRange: [1, 1, 0] });

                   return (
                     <Animated.View
                       key={`c-${i}`}
                       style={[
                         styles.confettiPiece,
                         leftStyle,
                         {
                           backgroundColor: confettiColors[i % confettiColors.length],
                           transform: [{ translateY }, { rotate }],
                           opacity,
                         },
                       ]}
                     />
                   );
                 })}

                {/* Kutlama mesajı */}
                {celebrationMessage && (
                  <View style={styles.celebrationMessageBox}>
                    <Text style={styles.celebrationMessageText}>{celebrationMessage}</Text>
                  </View>
                )}
               </View>
             )}

            <View style={styles.modalContainer}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  onPress={() => setShowModal(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={28} color={scienceTheme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>{selectedExperiment.title}</Text>
                <View style={styles.stepIndicator}>
                  <Text style={styles.stepText}>
                    {currentStep + 1} / {displaySteps.length}
                  </Text>
                </View>
              </View>

              <ScrollView style={styles.modalContent}>
                {/* Progress Bar */}
                <ProgressBar
                  current={currentStep + 1}
                  max={displaySteps.length}
                  height={8}
                  color={scienceTheme.colors.primary}
                  showLabel={false}
                />

                {/* Current Step */}
                <View style={styles.stepCard}>
                  <View style={styles.stepHeader}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>{currentStep + 1}</Text>
                    </View>
                    <Text style={styles.stepLabel}>Adım</Text>
                  </View>

                  <Text style={styles.stepInstruction}>
                    {displaySteps[currentStep]?.instruction}
                  </Text>

                  {displaySteps[currentStep]?.tip && (
                    <View style={styles.tipBox}>
                      <Text style={styles.tipBoxIcon}>💡</Text>
                      <Text style={styles.tipBoxText}>
                        {displaySteps[currentStep]?.tip}
                      </Text>
                    </View>
                  )}

                  {displaySteps[currentStep]?.duration && (
                    <View style={styles.durationBox}>
                      <Text style={styles.durationIcon}>⏱️</Text>
                      <Text style={styles.durationText}>
                        {displaySteps[currentStep]?.duration}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Materials (on first step) */}
                {currentStep === 0 && (
                  <View style={styles.materialsSection}>
                    <Text style={styles.materialsSectionTitle}>📦 Malzemeler</Text>
                    <View style={styles.materialsGrid}>
                      {selectedExperiment.materials.map((material, index) => (
                        <View key={index} style={styles.materialItem}>
                          <Text style={styles.materialItemIcon}>{material.icon}</Text>
                          <Text style={styles.materialItemName}>{material.name}</Text>
                          {material.optional && (
                            <Text style={styles.optionalTag}>Opsiyonel</Text>
                          )}
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Safety Notes (on first step) */}
                {currentStep === 0 && selectedExperiment.safetyNotes && (
                  <View style={styles.safetySection}>
                    <Text style={styles.safetySectionTitle}>⚠️ Güvenlik</Text>
                    {selectedExperiment.safetyNotes.map((note, index) => (
                      <Text key={index} style={styles.safetyNote}>• {note}</Text>
                    ))}
                  </View>
                )}

                {/* Expected Results (on last step) */}
                {currentStep === displaySteps.length - 1 && (
                  <View style={styles.resultsSection}>
                    <Text style={styles.resultsSectionTitle}>🔍 Beklenen Sonuçlar</Text>
                    {selectedExperiment.expectedResults.map((result, index) => (
                      <Text key={index} style={styles.resultItem}>✓ {result}</Text>
                    ))}
                  </View>
                )}
              </ScrollView>

              {/* Modal Footer */}
              <View style={styles.modalFooter}>
                {currentStep > 0 && (
                  <TouchableOpacity onPress={prevStep} style={styles.prevButton}>
                    <Ionicons name="chevron-back" size={24} color={scienceTheme.colors.primary} />
                    <Text style={styles.prevButtonText}>Önceki</Text>
                  </TouchableOpacity>
                )}

                <View style={styles.footerSpacer} />

                {currentStep < displaySteps.length - 1 ? (
                  <TouchableOpacity onPress={nextStep} style={styles.nextButton}>
                    <Text style={styles.nextButtonText}>Sonraki</Text>
                    <Ionicons name="chevron-forward" size={24} color="#FFF" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={handleComplete} style={styles.completeButton}>
                    <Text style={styles.completeButtonText}>Tamamla! 🎉</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </>
        )}
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: scienceTheme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: scienceTheme.colors.background,
  },
  loadingEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: scienceTheme.colors.textLight,
  },
  header: {
    backgroundColor: scienceTheme.colors.primary,
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: scienceTheme.colors.text,
    marginBottom: 12,
    marginTop: 8,
  },
  currentCard: {
    marginBottom: 24,
  },
  cardHeader: {
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
    fontSize: 18,
    fontWeight: 'bold',
    color: scienceTheme.colors.text,
    marginBottom: 4,
  },
  experimentDesc: {
    fontSize: 14,
    color: scienceTheme.colors.textLight,
    marginBottom: 12,
  },
  experimentMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    fontSize: 16,
    color: scienceTheme.colors.text,
    marginRight: 4,
  },
  metaText: {
    fontSize: 14,
    color: scienceTheme.colors.text,
  },
  materialsPreview: {
    marginBottom: 16,
  },
  materialsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: scienceTheme.colors.text,
    marginBottom: 8,
  },
  materialsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  materialIcon: {
    fontSize: 24,
    color: scienceTheme.colors.primary,
    marginRight: 8,
  },
  moreText: {
    fontSize: 14,
    color: scienceTheme.colors.textLight,
  },
  progressCard: {
    backgroundColor: scienceTheme.colors.cardBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: scienceTheme.colors.text,
  },
  progressCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: scienceTheme.colors.primary,
  },
  tipsCard: {
    backgroundColor: scienceTheme.colors.cardBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: scienceTheme.colors.text,
    marginBottom: 12,
  },
  tipsList: {
    paddingLeft: 10,
  },
  tipItem: {
    fontSize: 14,
    color: scienceTheme.colors.text,
    marginBottom: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: scienceTheme.colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  modalHeader: {
    paddingTop: 24,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: scienceTheme.colors.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: scienceTheme.colors.textLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: scienceTheme.colors.text,
  },
  stepIndicator: {
    backgroundColor: scienceTheme.colors.primary,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  stepText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  stepCard: {
    backgroundColor: scienceTheme.colors.cardBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumber: {
    backgroundColor: scienceTheme.colors.primary,
    borderRadius: 100,
    padding: 8,
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  stepLabel: {
    fontSize: 14,
    color: scienceTheme.colors.text,
  },
  stepInstruction: {
    fontSize: 16,
    color: scienceTheme.colors.text,
    marginBottom: 12,
  },
  tipBox: {
    backgroundColor: scienceTheme.colors.cardBg,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipBoxIcon: {
    fontSize: 18,
    color: scienceTheme.colors.primary,
    marginRight: 8,
  },
  tipBoxText: {
    fontSize: 14,
    color: scienceTheme.colors.text,
  },
  durationBox: {
    backgroundColor: scienceTheme.colors.cardBg,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  durationIcon: {
    fontSize: 18,
    color: scienceTheme.colors.accent,
    marginRight: 8,
  },
  durationText: {
    fontSize: 14,
    color: scienceTheme.colors.text,
  },
  materialsSection: {
    marginBottom: 24,
  },
  materialsSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: scienceTheme.colors.text,
    marginBottom: 12,
  },
  materialsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  materialItem: {
    width: '48%',
    backgroundColor: scienceTheme.colors.cardBg,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  materialItemIcon: {
    fontSize: 24,
    color: scienceTheme.colors.primary,
    marginRight: 12,
  },
  materialItemName: {
    fontSize: 14,
    color: scienceTheme.colors.text,
    flex: 1,
  },
  optionalTag: {
    fontSize: 12,
    color: scienceTheme.colors.textLight,
    marginTop: 4,
  },
  safetySection: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 16,
    marginTop: 12,
  },
  safetySectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: scienceTheme.colors.warning,
    marginBottom: 12,
  },
  safetyNote: {
    fontSize: 14,
    color: scienceTheme.colors.text,
    marginBottom: 8,
  },
  resultsSection: {
    marginTop: 24,
  },
  resultsSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: scienceTheme.colors.text,
    marginBottom: 12,
  },
  resultItem: {
    fontSize: 14,
    color: scienceTheme.colors.text,
    marginBottom: 8,
  },
  modalFooter: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: scienceTheme.colors.textLight,
  },
  prevButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prevButtonText: {
    fontSize: 16,
    color: scienceTheme.colors.primary,
    marginLeft: 4,
  },
  footerSpacer: {
    flex: 1,
  },
  nextButton: {
    backgroundColor: scienceTheme.colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    color: '#FFF',
    marginRight: 4,
  },
  completeButton: {
    backgroundColor: scienceTheme.colors.accent,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  completeButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
  // Age suitability styles
  ageRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  ageSuitability: {
    fontSize: 12,
    fontWeight: '600',
  },
  ageSuitableOk: {
    color: scienceTheme.colors.success,
  },
  ageSuitableWarn: {
    color: scienceTheme.colors.warning,
  },
  parentNote: {
    fontSize: 12,
    color: scienceTheme.colors.textLight,
    marginLeft: 8,
  },
  // Confetti styles
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT,
    zIndex: 9999,
  },
  confettiPiece: {
    position: 'absolute',
    width: 12,
    height: 18,
    borderRadius: 2,
    opacity: 0.9,
  },
  celebrationMessageBox: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  celebrationMessageText: {
    fontSize: 16,
    fontWeight: '700',
    color: scienceTheme.colors.primary,
  },
});
