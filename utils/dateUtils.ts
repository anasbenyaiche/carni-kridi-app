/**
 * Simple date formatting utilities using JavaScript's built-in Intl API
 * This avoids potential issues with date-fns imports in React Native
 */

/**
 * Safely format a date string or Date object
 */
export const formatDate = (
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  },
  fallback: string = 'Date invalide'
): string => {
  try {
    console.log('formatDate called with:', date, 'type:', typeof date);
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    console.log('dateObj:', dateObj, 'isValid:', !isNaN(dateObj.getTime()));
    if (isNaN(dateObj.getTime())) {
      console.log('Date is invalid, returning fallback:', fallback);
      return fallback;
    }

    const result = new Intl.DateTimeFormat('fr-FR', options).format(dateObj);
    console.log('formatDate result:', result);
    return result;
  } catch (error) {
    console.log('formatDate error:', error);
    return fallback;
  }
};

/**
 * Format date with time
 */
export const formatDateTime = (
  date: string | Date,
  fallback: string = 'Date invalide'
): string => {
  return formatDate(
    date,
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
    fallback
  );
};

/**
 * Format date for transactions
 */
export const formatTransactionDate = (
  date: string | Date,
  fallback: string = 'Date invalide'
): string => {
  return formatDateTime(date, fallback);
};

/**
 * Format date for cards and lists
 */
export const formatCardDate = (
  date: string | Date,
  fallback: string = 'Date invalide'
): string => {
  return formatDate(
    date,
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
    fallback
  );
};

/**
 * Format month and year
 */
export const formatMonthYear = (
  date: string | Date = new Date(),
  fallback: string = 'Date invalide'
): string => {
  console.log('formatMonthYear called with:', date);
  const result = formatDate(
    date,
    {
      month: 'long',
      year: 'numeric',
    },
    fallback
  );
  console.log('formatMonthYear result:', result);
  return result;
};
