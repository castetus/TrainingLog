import {
  Box,
  Typography,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  Chip,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useState } from 'react';

export type DateRange = {
  start: Date;
  end: Date;
};

export type DateRangePreset =
  | 'current-week'
  | 'last-week'
  | 'last-month'
  | 'last-year'
  | 'all-time'
  | 'custom';

interface DateRangeSelectorProps {
  value: DateRangePreset;
  onChange: (preset: DateRangePreset, range?: DateRange) => void;
  customRange?: DateRange;
}

export default function DateRangeSelector({
  value,
  onChange,
  customRange,
}: DateRangeSelectorProps) {
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState<Date | null>(customRange?.start || null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(customRange?.end || null);

  const handlePresetChange = (preset: DateRangePreset) => {
    if (preset === 'custom') {
      setShowCustomPicker(true);
      return;
    }

    setShowCustomPicker(false);
    const range = getDateRangeForPreset(preset);
    onChange(preset, range);
  };

  const handleCustomRangeApply = () => {
    if (customStartDate && customEndDate) {
      onChange('custom', { start: customStartDate, end: customEndDate });
      setShowCustomPicker(false);
    }
  };

  const handleCustomRangeCancel = () => {
    setShowCustomPicker(false);
    setCustomStartDate(customRange?.start || null);
    setCustomEndDate(customRange?.end || null);
  };

  const getDateRangeForPreset = (preset: DateRangePreset): DateRange => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (preset) {
      case 'current-week': {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        return { start: startOfWeek, end: today };
      }
      case 'last-week': {
        const endOfLastWeek = new Date(today);
        endOfLastWeek.setDate(today.getDate() - today.getDay() - 1);
        const startOfLastWeek = new Date(endOfLastWeek);
        startOfLastWeek.setDate(endOfLastWeek.getDate() - 6);
        return { start: startOfLastWeek, end: endOfLastWeek };
      }
      case 'last-month': {
        const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        return { start: startOfLastMonth, end: endOfLastMonth };
      }
      case 'last-year': {
        const startOfLastYear = new Date(today.getFullYear() - 1, 0, 1);
        const endOfLastYear = new Date(today.getFullYear() - 1, 11, 31);
        return { start: startOfLastYear, end: endOfLastYear };
      }
      case 'all-time': {
        const startOfTime = new Date(2020, 0, 1); // Arbitrary start date
        return { start: startOfTime, end: today };
      }
      default:
        return { start: today, end: today };
    }
  };

  const formatDateRange = (range: DateRange): string => {
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    };
    return `${formatDate(range.start)} - ${formatDate(range.end)}`;
  };

  const getCurrentRange = (): DateRange => {
    if (value === 'custom' && customRange) {
      return customRange;
    }
    return getDateRangeForPreset(value);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
        <Stack spacing={2}>
          <Typography variant="subtitle1" fontWeight="medium">
            Date Range
          </Typography>

          <ToggleButtonGroup
            value={value}
            exclusive
            onChange={(_, newValue) => newValue && handlePresetChange(newValue)}
            size="small"
            sx={{ flexWrap: 'wrap' }}
          >
            <ToggleButton value="current-week">Current Week</ToggleButton>
            <ToggleButton value="last-week">Last Week</ToggleButton>
            <ToggleButton value="last-month">Last Month</ToggleButton>
            <ToggleButton value="last-year">Last Year</ToggleButton>
            <ToggleButton value="all-time">All Time</ToggleButton>
            <ToggleButton value="custom">Custom</ToggleButton>
          </ToggleButtonGroup>

          {showCustomPicker && (
            <Stack spacing={2} sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Select custom date range:
              </Typography>

              <Stack direction="row" spacing={2} alignItems="center">
                <DatePicker
                  label="Start Date"
                  value={customStartDate}
                  onChange={(date) => setCustomStartDate(date)}
                  slotProps={{ textField: { size: 'small' } }}
                />
                <DatePicker
                  label="End Date"
                  value={customEndDate}
                  onChange={(date) => setCustomEndDate(date)}
                  slotProps={{ textField: { size: 'small' } }}
                />
              </Stack>

              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleCustomRangeApply}
                  disabled={!customStartDate || !customEndDate}
                >
                  Apply
                </Button>
                <Button variant="outlined" size="small" onClick={handleCustomRangeCancel}>
                  Cancel
                </Button>
              </Stack>
            </Stack>
          )}

          <Chip
            label={formatDateRange(getCurrentRange())}
            color="primary"
            variant="outlined"
            sx={{ alignSelf: 'flex-start' }}
          />
        </Stack>
      </Box>
    </LocalizationProvider>
  );
}
