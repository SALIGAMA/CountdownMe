import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { CountdownEvent } from '../types';
import { GRADIENTS } from '../constants/gradients';
import { CATEGORY_LABELS } from '../constants/categories';
import { RADIUS, FONT, SPACING } from '../constants/theme';
import CountdownDisplay from './CountdownDisplay';
import { useCountdown } from '../hooks/useCountdown';
import { formatDateDisplay } from '../utils/dateUtils';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.md * 3) / 2;

interface Props {
  event: CountdownEvent;
  onPress: () => void;
}

export default function EventCard({ event, onPress }: Props) {
  const parts = useCountdown(event.targetDate);
  const colors = GRADIENTS[event.gradientIndex % GRADIENTS.length];

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.85} style={styles.wrapper}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* Top row: emoji + category */}
        <View style={styles.topRow}>
          <Text style={styles.emoji}>{event.emoji}</Text>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>
              {CATEGORY_LABELS[event.category]}
            </Text>
          </View>
        </View>

        {/* Event name */}
        <Text style={styles.name} numberOfLines={2}>
          {event.name}
        </Text>

        {/* Date */}
        <Text style={styles.date}>{formatDateDisplay(event.targetDate)}</Text>

        {/* Countdown */}
        <View style={styles.countdownWrapper}>
          <CountdownDisplay parts={parts} compact />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: CARD_WIDTH,
    marginBottom: SPACING.md,
    borderRadius: RADIUS.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  card: {
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    minHeight: 180,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  emoji: {
    fontSize: FONT.xxl,
  },
  categoryPill: {
    backgroundColor: 'rgba(0,0,0,0.22)',
    borderRadius: RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  categoryText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: FONT.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  name: {
    color: '#FFFFFF',
    fontSize: FONT.lg,
    fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    marginBottom: 2,
  },
  date: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: FONT.xs,
    fontWeight: '500',
    marginBottom: SPACING.sm,
  },
  countdownWrapper: {
    alignItems: 'center',
  },
});
