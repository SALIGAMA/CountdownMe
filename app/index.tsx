import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEvents } from '../hooks/useEvents';
import EventCard from '../components/EventCard';
import { COLORS, SPACING, FONT, RADIUS } from '../constants/theme';
import { CountdownEvent } from '../types';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { events, loading, deleteEvent } = useEvents();

  // Refresh check every time screen is focused (returning from add/edit)
  useFocusEffect(
    useCallback(() => {
      // nothing needed — useEvents is reactive
    }, [])
  );

  const handleCardPress = (event: CountdownEvent) => {
    if (event) {
      router.push(`/edit/${event.id}`);
    }
  };

  const renderCard = ({ item, index }: { item: CountdownEvent; index: number }) => (
    <View style={index % 2 === 0 ? styles.cardLeft : styles.cardRight}>
      <EventCard event={item} onPress={() => handleCardPress(item)} />
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {events.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🗓️</Text>
          <Text style={styles.emptyTitle}>No events yet</Text>
          <Text style={styles.emptySubtitle}>
            Add a birthday, anniversary, or any event{'\n'}and watch it count down in style!
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => router.push('/add')}
          >
            <Text style={styles.emptyButtonText}>+ Add First Event</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={renderCard}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.row}
        />
      )}

      {/* FAB */}
      {events.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/add')}
          activeOpacity={0.8}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: COLORS.textMuted,
    fontSize: FONT.md,
  },
  list: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
  },
  cardLeft: {
    flex: 1,
    marginRight: SPACING.sm / 2,
  },
  cardRight: {
    flex: 1,
    marginLeft: SPACING.sm / 2,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyEmoji: {
    fontSize: 72,
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: FONT.xxl,
    fontWeight: '800',
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: COLORS.textMuted,
    fontSize: FONT.md,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  emptyButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.full,
  },
  emptyButtonText: {
    color: COLORS.text,
    fontSize: FONT.lg,
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.xl,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF6B6B',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  fabText: {
    color: COLORS.text,
    fontSize: 30,
    fontWeight: '300',
    marginTop: -2,
  },
});
