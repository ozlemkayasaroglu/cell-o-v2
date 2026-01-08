/**
 * ObservationTaskCard Component
 * Displays a single observation task with details and actions
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  Target,
  Clock,
  ChevronRight,
  Star,
  Info,
} from 'lucide-react-native';
import {
  ObservationTask,
  categoryEmojis,
  focusIcons,
  focusDescriptions,
} from '@/types/observationTypes';

interface ObservationTaskCardProps {
  task: ObservationTask;
  onPress: (task: ObservationTask) => void;
  compact?: boolean;
}

const difficultyColors = {
  easy: '#4ECDC4',
  medium: '#FFE66D',
  hard: '#FF6B6B',
  expert: '#9B59B6',
};

const difficultyLabels = {
  easy: '⭐',
  medium: '⭐⭐',
  hard: '⭐⭐⭐',
  expert: '⭐⭐⭐⭐',
};

export function ObservationTaskCard({
  task,
  onPress,
  compact = false,
}: ObservationTaskCardProps) {
  const categoryEmoji = categoryEmojis[task.category] || '🔍';
  const focusIcon = focusIcons[task.focus] || '📋';
  const difficultyColor = difficultyColors[task.difficulty];

  if (compact) {
    return (
      <TouchableOpacity
        style={styles.compactCard}
        onPress={() => onPress(task)}
        activeOpacity={0.7}>
        <View style={styles.compactLeft}>
          <Text style={styles.categoryEmoji}>{categoryEmoji}</Text>
          <View style={styles.compactInfo}>
            <Text style={styles.compactTitle} numberOfLines={1}>
              {task.title}
            </Text>
            <Text style={styles.compactCategory}>{task.category}</Text>
          </View>
        </View>
        <View style={styles.compactRight}>
          <View
            style={[
              styles.difficultyBadge,
              { backgroundColor: difficultyColor + '20' },
            ]}>
            <Text style={[styles.difficultyText, { color: difficultyColor }]}>
              {task.points} pts
            </Text>
          </View>
          <ChevronRight size={20} color="#636E72" strokeWidth={2} />
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(task)}
      activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryEmoji}>{categoryEmoji}</Text>
          <Text style={styles.categoryText}>{task.category}</Text>
        </View>
        <View
          style={[
            styles.difficultyBadge,
            { backgroundColor: difficultyColor + '20' },
          ]}>
          <Text style={[styles.difficultyText, { color: difficultyColor }]}>
            {difficultyLabels[task.difficulty]}
          </Text>
        </View>
      </View>

      <Text style={styles.title}>{task.title}</Text>
      <Text style={styles.description}>{task.description}</Text>

      <View style={styles.focusRow}>
        <Text style={styles.focusIcon}>{focusIcon}</Text>
        <Text style={styles.focusText}>{focusDescriptions[task.focus]}</Text>
      </View>

      {task.hints && task.hints.length > 0 && (
        <View style={styles.hintBox}>
          <Info size={14} color="#636E72" strokeWidth={2} />
          <Text style={styles.hintText}>{task.hints[0]}</Text>
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Star size={16} color="#FFD700" strokeWidth={2} fill="#FFD700" />
          <Text style={styles.pointsText}>{task.points} points</Text>
        </View>
        <View style={styles.startButton}>
          <Target size={16} color="#FFF" strokeWidth={2} />
          <Text style={styles.startButtonText}>Start</Text>
        </View>
      </View>

      {task.targetTaxon && (
        <View style={styles.taxonInfo}>
          <Text style={styles.taxonName}>{task.targetTaxon.commonName}</Text>
          <Text style={styles.taxonScientific}>
            ({task.targetTaxon.name})
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  compactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  compactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  compactInfo: {
    marginLeft: 10,
    flex: 1,
  },
  compactTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3436',
  },
  compactCategory: {
    fontSize: 12,
    color: '#636E72',
    marginTop: 2,
  },
  compactRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryEmoji: {
    fontSize: 20,
  },
  categoryText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '600',
    color: '#636E72',
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#636E72',
    lineHeight: 20,
    marginBottom: 12,
  },
  focusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  focusIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  focusText: {
    fontSize: 13,
    color: '#636E72',
    flex: 1,
  },
  hintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  hintText: {
    fontSize: 12,
    color: '#636E72',
    marginLeft: 8,
    flex: 1,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  startButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  taxonInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  taxonName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4ECDC4',
  },
  taxonScientific: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginLeft: 6,
  },
});

export default ObservationTaskCard;
