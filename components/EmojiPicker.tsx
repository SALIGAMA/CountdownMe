import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING, FONT } from '../constants/theme';

const EMOJIS = [
  '🎂', '🎁', '🎉', '🎊', '🥳', '💝', '❤️', '💑',
  '💍', '💒', '✈️', '🌍', '🏖️', '⛰️', '🎡', '🚀',
  '🏆', '🥇', '🎯', '💪', '🌟', '⭐', '🌈', '☀️',
  '🎶', '🎸', '🎤', '🎬', '📚', '🎓', '💼', '🏠',
  '🌸', '🌺', '🌻', '🦋', '🐶', '🐱', '🎃', '🎄',
  '🎆', '🎇', '🧨', '🪄', '🎠', '🎪', '🎭', '🎨',
];

interface Props {
  selected: string;
  onSelect: (emoji: string) => void;
}

export default function EmojiPicker({ selected, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {EMOJIS.map((emoji) => (
        <TouchableOpacity
          key={emoji}
          onPress={() => onSelect(emoji)}
          style={[styles.cell, selected === emoji && styles.cellSelected]}
        >
          <Text style={styles.emoji}>{emoji}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: SPACING.xs,
    gap: SPACING.xs,
  },
  cell: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
  cellSelected: {
    backgroundColor: COLORS.surfaceStrong,
    borderWidth: 2,
    borderColor: '#FFC75F',
  },
  emoji: {
    fontSize: FONT.xl,
  },
});
