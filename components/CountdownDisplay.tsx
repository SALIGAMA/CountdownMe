import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { CountdownParts } from '../types';
import { pad } from '../utils/dateUtils';
import { COLORS, FONT, SPACING, RADIUS } from '../constants/theme';

interface Props {
  parts: CountdownParts;
  compact?: boolean;
}

function DigitBox({
  value,
  label,
  compact,
}: {
  value: number;
  label: string;
  compact?: boolean;
}) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = 1.15;
    scale.value = withSpring(1, { damping: 8, stiffness: 200 });
  }, [value]);

  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <View style={[styles.box, compact && styles.boxCompact]}>
      <Animated.Text style={[styles.digits, compact && styles.digitsCompact, animStyle]}>
        {pad(value)}
      </Animated.Text>
      <Text style={[styles.label, compact && styles.labelCompact]}>{label}</Text>
    </View>
  );
}

export default function CountdownDisplay({ parts, compact }: Props) {
  if (parts.isToday) {
    return (
      <View style={styles.todayContainer}>
        <Text style={[styles.todayText, compact && styles.todayTextCompact]}>
          🎉 TODAY!
        </Text>
      </View>
    );
  }

  if (parts.isPast) {
    return (
      <View style={styles.todayContainer}>
        <Text style={[styles.todayText, compact && styles.todayTextCompact]}>
          ✅ Passed
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.row}>
      <DigitBox value={parts.days} label="DAYS" compact={compact} />
      <Text style={[styles.colon, compact && styles.colonCompact]}>:</Text>
      <DigitBox value={parts.hours} label="HRS" compact={compact} />
      <Text style={[styles.colon, compact && styles.colonCompact]}>:</Text>
      <DigitBox value={parts.minutes} label="MIN" compact={compact} />
      <Text style={[styles.colon, compact && styles.colonCompact]}>:</Text>
      <DigitBox value={parts.seconds} label="SEC" compact={compact} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: RADIUS.sm,
    paddingHorizontal: 8,
    paddingVertical: 6,
    minWidth: 44,
  },
  boxCompact: {
    paddingHorizontal: 5,
    paddingVertical: 4,
    minWidth: 34,
  },
  digits: {
    color: COLORS.text,
    fontSize: FONT.xl,
    fontWeight: '700',
    letterSpacing: 1,
  },
  digitsCompact: {
    fontSize: FONT.md,
  },
  label: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginTop: 1,
  },
  labelCompact: {
    fontSize: 7,
  },
  colon: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: FONT.lg,
    fontWeight: '700',
    marginHorizontal: 3,
    marginBottom: 12,
  },
  colonCompact: {
    fontSize: FONT.sm,
    marginBottom: 8,
    marginHorizontal: 1,
  },
  todayContainer: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  todayText: {
    color: COLORS.text,
    fontSize: FONT.xl,
    fontWeight: '800',
    letterSpacing: 1,
  },
  todayTextCompact: {
    fontSize: FONT.md,
  },
});
