/**
 * Görevler Ekranı - Minecraft Teması
 * Bloklu UI ile gözlem görevlerini gösterir
 */

import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  Target,
  RefreshCw,
  Filter,
  X,
  CheckCircle,
  MapPin,
  ChevronRight,
} from 'lucide-react-native';
import { useObservationTasks } from '@/hooks/useObservationTasks';
import {
  ObservationTask,
  ObservationCategory,
  difficultyPoints,
} from '@/types/observationTypes';
import { observationEngine } from '@/engine/observationEngine';
import { scienceTheme } from '@/theme/science';

export default function TasksScreen() {
  const { tasks, loading, error, refreshTasks, completeTask, statistics } =
    useObservationTasks();

  const [selectedTask, setSelectedTask] = useState<ObservationTask | null>(
    null
  );
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [observationText, setObservationText] = useState('');
  const [locationText, setLocationText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<ObservationCategory | null>(null);
  const [filteredTasks, setFilteredTasks] = useState<ObservationTask[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (selectedCategory) {
        loadCategoryTasks(selectedCategory);
      }
    }, [selectedCategory])
  );

  const loadCategoryTasks = async (category: ObservationCategory) => {
    const categoryTasks = await observationEngine.getTasksByCategory(category);
    setFilteredTasks(categoryTasks);
  };

  const displayTasks = selectedCategory ? filteredTasks : tasks;
  const categories = observationEngine.getAvailableCategories();

  const handleTaskPress = (task: ObservationTask) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleCompleteTask = async () => {
    if (!selectedTask) return;

    if (!observationText.trim()) {
      Alert.alert('⚠️ Dur!', 'Önce ne gözlemlediğini yaz!');
      return;
    }

    setSubmitting(true);
    try {
      await completeTask(
        selectedTask,
        observationText,
        locationText || 'Bilinmeyen konum'
      );

      Alert.alert(
        '🎉 GÖREV TAMAMLANDI!',
        `+${selectedTask.points} XP kazandın!\n\nSeviye atlamak için keşfetmeye devam et!`
      );

      setShowTaskModal(false);
      setObservationText('');
      setLocationText('');
      setSelectedTask(null);

      if (selectedCategory) {
        loadCategoryTasks(selectedCategory);
      }
    } catch (err) {
      Alert.alert('Hata', 'Kaydedilemedi. Tekrar dene!');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCategorySelect = (category: ObservationCategory | null) => {
    setSelectedCategory(category);
    setShowCategoryFilter(false);
    if (category) {
      loadCategoryTasks(category);
    }
  };

  const handleRefresh = async () => {
    if (selectedCategory) {
      loadCategoryTasks(selectedCategory);
    } else {
      await refreshTasks();
    }
  };

  return (
    <View style={styles.container}>
      {/* Top grass border */}
      <View style={styles.grassBorder} />

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefresh}
            tintColor={scienceTheme.colors.xpGreen}
          />
        }
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIcon}>
                <Text style={styles.headerEmoji}>📜</Text>
              </View>
              <View style={styles.headerText}>
                <Text style={styles.title}>GÖREV GÜNLÜĞÜ</Text>
                <Text style={styles.subtitle}>
                  {statistics.totalCompleted} görev tamamlandı
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowCategoryFilter(true)}
            >
              <Filter size={20} color="#FFF" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Active Filter Badge */}
          {selectedCategory && (
            <View style={styles.activeFilter}>
              <Text style={styles.activeFilterEmoji}>
                {categoryBlockEmojis[selectedCategory]}
              </Text>
              <Text style={styles.activeFilterText}>{selectedCategory}</Text>
              <TouchableOpacity
                onPress={() => handleCategorySelect(null)}
                style={styles.clearFilter}
              >
                <X size={16} color="#FFF" strokeWidth={3} />
              </TouchableOpacity>
            </View>
          )}

          {/* Refresh Button */}
          <View style={styles.refreshSection}>
            <PixelButton
              title="🔄 GÖREVLERİ YENİLE"
              onPress={async () => {
                await refreshTasks();
                Alert.alert('✅ Yenilendi!', 'Görevler güncellendi.');
              }}
              variant="secondary"
              size="small"
            />
          </View>

          {/* Error State */}
          {error && (
            <BlockCard variant="dirt" style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
              <PixelButton
                title="TEKRAR DENE"
                onPress={handleRefresh}
                variant="danger"
                size="small"
              />
            </BlockCard>
          )}

          {/* Tasks List */}
          {loading && displayTasks.length === 0 ? (
            <View style={styles.loadingBox}>
              <Text style={styles.loadingEmoji}>⏳</Text>
              <Text style={styles.loadingText}>Görevler yükleniyor...</Text>
            </View>
          ) : displayTasks.length === 0 ? (
            <BlockCard variant="stone" style={styles.emptyBox}>
              <Text style={styles.emptyEmoji}>✨</Text>
              <Text style={styles.emptyTitle}>HEPSİ TAMAM!</Text>
              <Text style={styles.emptyText}>
                Tüm görevleri tamamladın. Yarın tekrar kontrol et!
              </Text>
              <PixelButton
                title="YENİ GÖREV AL"
                onPress={handleRefresh}
                variant="gold"
                icon={<RefreshCw size={16} color="#1A1A1A" strokeWidth={2} />}
                style={{ marginTop: 16 }}
              />
            </BlockCard>
          ) : (
            <View style={styles.tasksList}>
              {displayTasks.map((task) => (
                <TouchableOpacity
                  key={task.id}
                  style={styles.taskCard}
                  onPress={() => handleTaskPress(task)}
                  activeOpacity={0.8}
                >
                  {/* Card highlight */}
                  <View style={styles.cardHighlight} />

                  <View style={styles.taskHeader}>
                    <View style={styles.taskSlot}>
                      <Text style={styles.taskEmoji}>
                        {categoryBlockEmojis[task.category] || '❓'}
                      </Text>
                    </View>
                    <View style={styles.taskMeta}>
                      <Text style={styles.taskCategory}>{task.category}</Text>
                      <DifficultyBadge difficulty={task.difficulty} />
                    </View>
                  </View>

                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.taskDescription}>{task.description}</Text>

                  {task.hints && task.hints.length > 0 && (
                    <View style={styles.hintBox}>
                      <Text style={styles.hintText}>💡 {task.hints[0]}</Text>
                    </View>
                  )}

                  <View style={styles.taskFooter}>
                    <View style={styles.rewardBadge}>
                      <Text style={styles.rewardText}>+{task.points} XP</Text>
                    </View>
                    <View style={styles.startBadge}>
                      <Text style={styles.startText}>BAŞLA →</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Category Filter Modal */}
      <Modal
        visible={showCategoryFilter}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCategoryFilter(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.filterModal}>
            <View style={styles.filterModalHighlight} />
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>🗂️ FİLTRELE</Text>
              <TouchableOpacity onPress={() => setShowCategoryFilter(false)}>
                <X size={24} color="#FFF" strokeWidth={3} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.filterOption,
                !selectedCategory && styles.filterOptionActive,
              ]}
              onPress={() => handleCategorySelect(null)}
            >
              <Text style={styles.filterOptionEmoji}>🌍</Text>
              <Text style={styles.filterOptionText}>TÜM GÖREVLER</Text>
            </TouchableOpacity>

            <ScrollView style={styles.filterScroll}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.filterOption,
                    selectedCategory === category && styles.filterOptionActive,
                  ]}
                  onPress={() => handleCategorySelect(category)}
                >
                  <Text style={styles.filterOptionEmoji}>
                    {categoryBlockEmojis[category]}
                  </Text>
                  <Text style={styles.filterOptionText}>
                    {category.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Task Completion Modal */}
      <Modal
        visible={showTaskModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTaskModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.taskModal}>
            <View style={styles.taskModalHighlight} />

            <View style={styles.taskModalHeader}>
              <View style={styles.modalSlot}>
                <Text style={styles.modalEmoji}>
                  {selectedTask && categoryBlockEmojis[selectedTask.category]}
                </Text>
              </View>
              <Text style={styles.taskModalTitle} numberOfLines={2}>
                {selectedTask?.title}
              </Text>
              <TouchableOpacity
                onPress={() => setShowTaskModal(false)}
                style={styles.closeButton}
              >
                <X size={24} color="#FFF" strokeWidth={3} />
              </TouchableOpacity>
            </View>

            <Text style={styles.taskModalDescription}>
              {selectedTask?.description}
            </Text>

            {selectedTask?.hints && selectedTask.hints.length > 0 && (
              <BlockCard variant="wood" style={styles.hintsCard}>
                <Text style={styles.hintsTitle}>💡 İPUÇLARI</Text>
                {selectedTask.hints.map((hint, index) => (
                  <Text key={index} style={styles.hintItem}>
                    • {hint}
                  </Text>
                ))}
              </BlockCard>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>📍 KONUM</Text>
              <TextInput
                style={styles.input}
                placeholder="Neredesin?"
                value={locationText}
                onChangeText={setLocationText}
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>📝 GÖZLEMİN</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Ne keşfettin?"
                value={observationText}
                onChangeText={setObservationText}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                placeholderTextColor="#888"
              />
            </View>

            <PixelButton
              title={`GÖREVİ TAMAMLA (+${selectedTask?.points} XP)`}
              onPress={handleCompleteTask}
              variant="gold"
              size="large"
              disabled={submitting}
              icon={
                submitting ? (
                  <ActivityIndicator size="small" color="#1A1A1A" />
                ) : (
                  <CheckCircle size={20} color="#1A1A1A" strokeWidth={2} />
                )
              }
            />
          </View>
        </View>
      </Modal>

      {/* Bottom dirt border */}
      <View style={styles.dirtBorder} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: scienceTheme.colors.background,
  },
  grassBorder: {
    height: 8,
    backgroundColor: scienceTheme.colors.grassGreen,
    borderBottomWidth: 3,
    borderBottomColor: scienceTheme.colors.darkGreen,
  },
  dirtBorder: {
    height: 8,
    backgroundColor: scienceTheme.colors.dirt,
    borderTopWidth: 3,
    borderTopColor: scienceTheme.colors.darkBg,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    backgroundColor: 'rgba(139, 107, 74, 0.3)',
    minHeight: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 48,
    height: 48,
    backgroundColor: scienceTheme.colors.dirt,
    borderWidth: 3,
    borderColor: scienceTheme.colors.darkDirt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerEmoji: {
    fontSize: 24,
  },
  headerText: {},
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  subtitle: {
    fontSize: 12,
    color: scienceTheme.colors.xpGreen,
    fontWeight: 'bold',
    marginTop: 2,
  },
  filterButton: {
    width: 44,
    height: 44,
    backgroundColor: scienceTheme.colors.stone,
    borderWidth: 3,
    borderColor: scienceTheme.colors.darkStone,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: scienceTheme.colors.grassGreen,
    padding: 10,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: scienceTheme.colors.darkGreen,
  },
  activeFilterEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  activeFilterText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  clearFilter: {
    padding: 4,
  },
  errorBox: {
    marginBottom: 16,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 12,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  loadingBox: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  emptyText: {
    fontSize: 14,
    color: '#CCC',
    textAlign: 'center',
  },
  tasksList: {
    gap: 12,
  },
  taskCard: {
    backgroundColor: '#8B8B8B',
    borderWidth: 4,
    borderTopColor: '#C6C6C6',
    borderLeftColor: '#C6C6C6',
    borderRightColor: '#555555',
    borderBottomColor: '#555555',
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  cardHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  taskSlot: {
    width: 48,
    height: 48,
    backgroundColor: '#6B6B6B',
    borderWidth: 2,
    borderTopColor: '#888',
    borderLeftColor: '#888',
    borderRightColor: '#444',
    borderBottomColor: '#444',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  taskEmoji: {
    fontSize: 28,
  },
  taskMeta: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskCategory: {
    fontSize: 12,
    color: '#DDD',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  taskDescription: {
    fontSize: 13,
    color: '#DDD',
    lineHeight: 18,
    marginBottom: 10,
  },
  hintBox: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 8,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#555',
  },
  hintText: {
    fontSize: 12,
    color: '#FFE135',
    fontStyle: 'italic',
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardBadge: {
    backgroundColor: scienceTheme.colors.xpGreen,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 2,
    borderColor: scienceTheme.colors.darkGreen,
  },
  rewardText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  startBadge: {
    backgroundColor: scienceTheme.colors.gold,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 2,
    borderColor: '#B8860B',
  },
  startText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  filterModal: {
    backgroundColor: scienceTheme.colors.stone,
    borderWidth: 4,
    borderColor: scienceTheme.colors.darkStone,
    padding: 16,
    maxHeight: '70%',
    position: 'relative',
  },
  filterModalHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  filterScroll: {
    maxHeight: 400,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#555',
  },
  filterOptionActive: {
    backgroundColor: scienceTheme.colors.grassGreen,
    borderColor: scienceTheme.colors.darkGreen,
  },
  filterOptionEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  filterOptionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  taskModal: {
    backgroundColor: '#6B6B6B',
    borderWidth: 4,
    borderTopColor: '#888',
    borderLeftColor: '#888',
    borderRightColor: '#444',
    borderBottomColor: '#444',
    padding: 16,
    maxHeight: '85%',
    position: 'relative',
  },
  taskModalHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  taskModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalSlot: {
    width: 48,
    height: 48,
    backgroundColor: '#8B8B8B',
    borderWidth: 2,
    borderTopColor: '#C6C6C6',
    borderLeftColor: '#C6C6C6',
    borderRightColor: '#555555',
    borderBottomColor: '#555555',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  modalEmoji: {
    fontSize: 28,
  },
  taskModalTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  closeButton: {
    padding: 4,
  },
  taskModalDescription: {
    fontSize: 14,
    color: '#DDD',
    lineHeight: 20,
    marginBottom: 16,
  },
  hintsCard: {
    marginBottom: 16,
  },
  hintsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  hintItem: {
    fontSize: 12,
    color: '#DDD',
    marginBottom: 4,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  input: {
    backgroundColor: '#4A4A4A',
    borderWidth: 3,
    borderTopColor: '#333',
    borderLeftColor: '#333',
    borderRightColor: '#666',
    borderBottomColor: '#666',
    padding: 12,
    fontSize: 14,
    color: '#FFFFFF',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  refreshSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
});
