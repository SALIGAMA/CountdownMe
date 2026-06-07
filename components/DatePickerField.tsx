import React from 'react';
import { View, TextInput, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS, RADIUS, FONT } from '../constants/theme';

interface Props {
  value: Date;
  onChange: (date: Date) => void;
  mode: 'date' | 'time';
}

export default function DatePickerField({ value, onChange, mode }: Props) {
  if (Platform.OS === 'web') {
    const toInputValue = () => {
      if (mode === 'date') {
        return value.toISOString().split('T')[0];
      }
      const h = value.getHours().toString().padStart(2, '0');
      const m = value.getMinutes().toString().padStart(2, '0');
      return `${h}:${m}`;
    };

    const handleChange = (e: any) => {
      const val = e.target.value;
      if (!val) return;
      const updated = new Date(value);
      if (mode === 'date') {
        const [y, mo, d] = val.split('-').map(Number);
        updated.setFullYear(y, mo - 1, d);
      } else {
        const [h, m] = val.split(':').map(Number);
        updated.setHours(h, m, 0, 0);
      }
      onChange(updated);
    };

    return (
      <View style={styles.webWrapper}>
        <TextInput
          style={styles.webInput}
          value={toInputValue()}
          onChangeText={() => {}}
          // @ts-ignore — web only
          type={mode === 'date' ? 'date' : 'time'}
          onChange={handleChange}
        />
      </View>
    );
  }

  return (
    <DateTimePicker
      value={value}
      mode={mode}
      display={Platform.OS === 'ios' ? (mode === 'date' ? 'inline' : 'spinner') : 'default'}
      minimumDate={mode === 'date' ? new Date() : undefined}
      onChange={(_, date) => { if (date) onChange(date); }}
      themeVariant="dark"
    />
  );
}

const styles = StyleSheet.create({
  webWrapper: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 4,
  },
  webInput: {
    color: COLORS.text,
    fontSize: FONT.md,
    // @ts-ignore
    colorScheme: 'dark',
  },
});
