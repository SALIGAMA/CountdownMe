import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useEvents } from '../hooks/useEvents';
import EmojiPicker from '../components/EmojiPicker';
import { COLORS, SPACING, FONT, RADIUS } from '../constants/theme';
import {
  ALL_CATEGORIES,
  CATEGORY_LABELS,
  CATEGORY_EMOJIS,
  CATEGORY_DEFAULT_GRADIENT,
} from '../constants/categories';
import { GRADIENTS } from '../constants/gradients';
import { EventCategory } from '../types';
import { scheduleEventNotifications } from '../hooks/useNotifications';
import { formatDateDisplay } from '../utils/dateUtils';

export default function AddScreen() {
  const { addEvent } = useEvents();

  const [name, setName] = useState('');
  const [targetDate, setTargetDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d;
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [emoji, setEmoji] = useState('🎂');
  const [category, setCategory] = useState<EventCategory>('birthday');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [saving, setSaving] = useState(false);

  const gradientIndex = CATEGORY_DEFAULT_GRADIENT[category];
  const gradientColors = GRADIENTS[gradientIndex];

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Please give your event a name.');
      return;
    }
    setSaving(true);
    try {
      const event = await addEvent({
        name: name.trim(),
        targetDate: targetDate.toISOString(),
        emoji,
        category,
        notificationsEnabled,
      });
      if (notificationsEnabled) {
        const notifId = await scheduleEventNotifications(event);
        // ignore scheduling errors silently
      }
      router.back();
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Preview card strip */}
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.previewCard}
        >
          <Text style={styles.previewEmoji}>{emoji}</Text>
          <Text style={styles.previewName} numberOfLines={1}>
            {name || 'Event Name'}
          </Text>
          <Text style={styles.previewDate}>{formatDateDisplay(targetDate.toISOString())}</Text>
        </LinearGradient>

        {/* Name */}
        <Text style={styles.label}>Event Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Mom's Birthday"
          placeholderTextColor={COLORS.textDim}
          value={name}
          onChangeText={setName}
          maxLength={40}
          autoFocus
        />

        {/* Emoji */}
        <Text style={styles.label}>Choose Emoji</Text>
        <EmojiPicker selected={emoji} onSelect={setEmoji} />

        {/* Category */}
        <Text style={[styles.label, { marginTop: SPACING.md }]}>Category</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}
        >
          {ALL_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => {
                setCategory(cat);
                setEmoji(CATEGORY_EMOJIS[cat]);
              }}
              style={[styles.catPill, category === cat && styles.catPillSelected]}
            >
              <Text style={styles.catPillText}>
                {CATEGORY_EMOJIS[cat]} {CATEGORY_LABELS[cat]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Date */}
        <Text style={[styles.label, { marginTop: SPACING.md }]}>Date</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            📅 {targetDate.toLocaleDateString(undefined, {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={targetDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            minimumDate={new Date()}
            onChange={(_, date) => {
              setShowDatePicker(Platform.OS === 'ios');
              if (date) {
                const merged = new Date(targetDate);
                merged.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                setTargetDate(merged);
              }
            }}
            themeVariant="dark"
          />
        )}

        {/* Time */}
        <Text style={[styles.label, { marginTop: SPACING.md }]}>Time</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            ⏰ {targetDate.toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </TouchableOpacity>

        {showTimePicker && (
          <DateTimePicker
            value={targetDate}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_, time) => {
              setShowTimePicker(Platform.OS === 'ios');
              if (time) {
                const merged = new Date(targetDate);
                merged.setHours(time.getHours(), time.getMinutes(), 0, 0);
                setTargetDate(merged);
              }
            }}
            themeVariant="dark"
          />
        )}

        {/* Notifications */}
        <View style={styles.notifRow}>
          <View>
            <Text style={styles.notifTitle}>Remind me</Text>
            <Text style={styles.notifSub}>Get a notification on the event day</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: COLORS.surface, true: '#FF6B6B' }}
            thumbColor={COLORS.text}
          />
        </View>

        {/* Save button */}
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? 'Saving...' : '🎉 Save Event'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  previewCard: {
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  previewEmoji: { fontSize: 48, marginBottom: SPACING.xs },
  previewName: {
    color: '#FFF',
    fontSize: FONT.xl,
    fontWeight: '800',
    textAlign: 'center',
  },
  previewDate: { color: 'rgba(255,255,255,0.75)', fontSize: FONT.sm, marginTop: 4 },
  label: {
    color: COLORS.textMuted,
    fontSize: FONT.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    color: COLORS.text,
    fontSize: FONT.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryRow: { flexDirection: 'row', gap: SPACING.xs, paddingBottom: SPACING.xs },
  catPill: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  catPillSelected: { borderColor: '#FFC75F', backgroundColor: COLORS.surfaceStrong },
  catPillText: { color: COLORS.text, fontSize: FONT.sm, fontWeight: '600' },
  dateButton: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xs,
  },
  dateButtonText: { color: COLORS.text, fontSize: FONT.md },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  notifTitle: { color: COLORS.text, fontSize: FONT.md, fontWeight: '600' },
  notifSub: { color: COLORS.textMuted, fontSize: FONT.xs, marginTop: 2 },
  saveButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: RADIUS.full,
    padding: SPACING.md,
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  saveButtonDisabled: { opacity: 0.5 },
  saveButtonText: { color: COLORS.text, fontSize: FONT.lg, fontWeight: '700' },
});
