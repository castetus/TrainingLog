/**
 * Formats a date string or Date object to a localized date string
 * @param date - Date string, Date object, or timestamp
 * @param options - Intl.DateTimeFormatOptions for customization
 * @returns Formatted date string in user's locale
 */
export const formatDate = (
  date: string | Date | number,
  options?: Intl.DateTimeFormatOptions,
): string => {
  const dateObj = new Date(date);

  // Default options for consistent formatting
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };

  return dateObj.toLocaleDateString(undefined, defaultOptions);
};

/**
 * Formats a date for display in workout names (e.g., "Jan 15")
 * @param date - Date string, Date object, or timestamp
 * @returns Short date format
 */
export const formatShortDate = (date: string | Date | number): string => {
  return formatDate(date, {
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Formats a date for detailed display (e.g., "Monday, January 15, 2024")
 * @param date - Date string, Date object, or timestamp
 * @returns Long date format
 */
export const formatLongDate = (date: string | Date | number): string => {
  return formatDate(date, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Formats a date for metadata display (e.g., "Jan 15, 2024")
 * @param date - Date string, Date object, or timestamp
 * @returns Medium date format
 */
export const formatMediumDate = (date: string | Date | number): string => {
  return formatDate(date, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Formats duration in minutes to a human-readable string
 * @param minutes - Duration in minutes
 * @returns Formatted duration string (e.g., "1h 15m", "45m")
 */
export const formatDuration = (minutes?: number): string => {
  if (!minutes) return '';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

/**
 * Formats time in seconds to a human-readable string
 * @param seconds - Duration in seconds
 * @returns Formatted time string (e.g., "1:30", "45s")
 */
export const formatTime = (seconds?: number): string => {
  if (!seconds) return '-';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins > 0) {
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  return `${secs}s`;
};
