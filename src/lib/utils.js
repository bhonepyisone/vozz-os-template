// FILE: src/lib/utils.js

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';

// A handy function for combining Tailwind CSS classes conditionally.
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// A function to format dates consistently across the app.
export function formatDate(date, formatString = 'PPP') {
  // PPP format is like "Jul 5, 2025"
  if (!date) return '';
  return format(new Date(date), formatString);
}

// A function to format currency.
export function formatCurrency(value) {
  if (typeof value !== 'number') return '';
  return value.toLocaleString('en-US');
}