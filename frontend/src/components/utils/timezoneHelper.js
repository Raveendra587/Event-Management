import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const IANA_TIMEZONES = {
  'Eastern Time (ET)': 'America/New_York',
  'India (IST)': 'Asia/Kolkata',
  'Pacific Time (PT)': 'America/Los_Angeles',
  'Coordinated Universal Time (UTC)': 'UTC',
  'Central Time (CT)': 'America/Chicago',
  'London (GMT)': 'Europe/London',
};

export const DISPLAY_TIMEZONES = Object.keys(IANA_TIMEZONES);

/**
 * Converts a UTC date string to a formatted string in the target timezone.
 * @param {string} utcDate - The ISO 8601 UTC date string (e.g., from MongoDB)
 * @param {string} viewTimezone - The *display name* of the timezone (e.g., "Eastern Time (ET)")
 * @param {string} format - The dayjs format string
 * @returns {string} The formatted date/time string
 */
export const formatInTimeZone = (utcDate, viewTimezone, format) => {
  if (!utcDate) return '';
  const ianaTimezone = IANA_TIMEZONES[viewTimezone] || 'UTC';
  return dayjs(utcDate).tz(ianaTimezone).format(format);
};