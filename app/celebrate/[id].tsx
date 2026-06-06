import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEvents } from '../../hooks/useEvents';
import { GRADIENTS } from '../../constants/gradients';
import { COLORS, FONT, SPACING, RADIUS } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

const CONFETTI_COLORS = [
  '#FF6B6B', '#FFC75F', '#43E97B', '#4FACFE',
  '#FBC2EB', '#FEE140', '#C471ED', '#38F9D7',
];

function ConfettiPiece({ x, delay }: { x: number; delay: number }) {
  const y = useSharedValue(-20);
  const opacity = useSharedValue(1);
  const rotate = useSharedValue(0);
  const color = CONFETTI_COLORS[(x * 7 + delay) % CONFETTI_COLORS.length];
  const size = 8 + (x % 5) * 2;

  useEffect(() => {
    y.value = withDelay(
      delay,
      withTiming(height + 40, { duration: 2500 + (x % 800), easing: Easing.linear })
    );
    opacity.value = withDelay(delay + 1800, withTiming(0, { duration: 700 }));
    rotate.value = withDelay(
      delay,
      withRepeat(withTiming(360, { duration: 600 + (x % 400) }), -1, false)
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    left: x % (width - 20),
    top: y.value,
    opacity: opacity.value,
    width: size,
    height: size,
    borderRadius: x % 3 === 0 ? size / 2 : 2,
    backgroundColor: color,
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  return <Animated.View style={style} />;
}

export default function CelebrateScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getEvent } = useEvents();
  const event = getEvent(id);

  const titleScale = useSharedValue(0);
  const emojiScale = useSharedValue(0);

  useEffect(() => {
    emojiScale.value = withSequence(
      withTiming(1.3, { duration: 400 }),
      withSpring(1)
    );
    titleScale.value = withDelay(300, withTiming(1, { duration: 400 }));

    // Auto-dismiss after 8 seconds
    const timer = setTimeout(() => router.back(), 8000);
    return () => clearTimeout(timer);
  }, []);

  const emojiStyle = useAnimatedStyle(() => ({
    transform: [{ scale: emojiScale.value }],
  }));
  const titleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: titleScale.value }],
    opacity: titleScale.value,
  }));

  if (!event) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background }}>
        <TouchableOpacity onPress={() => router.back()} style={styles.dismissBtn}>
          <Text style={styles.dismissText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const gradientColors = GRADIENTS[event.gradientIndex % GRADIENTS.length];

  // Generate 40 confetti pieces with varied x/delay
  const confettiPieces = Array.from({ length: 40 }, (_, i) => ({
    x: (i * 73 + 11) % (width - 20),
    delay: (i * 113) % 1200,
  }));

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Confetti */}
      {confettiPieces.map((p, i) => (
        <ConfettiPiece key={i} x={p.x} delay={p.delay} />
      ))}

      <SafeAreaView style={styles.inner}>
        <Animated.Text style={[styles.emoji, emojiStyle]}>
          {event.emoji}
        </Animated.Text>

        <Animated.View style={[styles.textBlock, titleStyle]}>
          <Text style={styles.todayLabel}>TODAY IS THE DAY!</Text>
          <Text style={styles.eventName}>{event.name}</Text>
          <Text style={styles.celebrateText}>🎊 Celebrate! 🎊</Text>
        </Animated.View>

        <TouchableOpacity
          style={styles.dismissBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.dismissText}>Continue</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emoji: {
    fontSize: 100,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  textBlock: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  todayLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FONT.md,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
  },
  eventName: {
    color: '#FFFFFF',
    fontSize: FONT.xxxl,
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    marginBottom: SPACING.md,
  },
  celebrateText: {
    color: '#FFFFFF',
    fontSize: FONT.xxl,
    fontWeight: '700',
  },
  dismissBtn: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  dismissText: {
    color: '#FFFFFF',
    fontSize: FONT.lg,
    fontWeight: '700',
  },
});
