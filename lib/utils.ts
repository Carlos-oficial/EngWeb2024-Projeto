import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeAgo(date: string | number | Date) {
  const units = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ];

  const calculateTimeDifference = (time: number) => {
    for (const { label, seconds } of units) {
      const interval = Math.floor(time / seconds);
      if (interval >= 1) {
        return {
          interval: interval,
          unit: label,
        };
      }
    }
    return {
      interval: 0,
      unit: '',
    };
  };

  const time = Math.floor(
    (new Date().valueOf() - new Date(date).valueOf()) / 1000,
  );
  const { interval, unit } = calculateTimeDifference(time);
  const suffix = interval === 1 ? '' : 's';
  return `${interval} ${unit}${suffix} ago`;
}

export function formatNumber(num: number): string {
  if (num < 1000) {
    return num.toString();
  } else if (num < 1000000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  } else {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
}

export function nameInitials(name: string) {
  return name
    .split(' ')
    .slice(0, name.split(' ').length)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export const PAGE_SIZE = 30;

export const getSkip = (page: number) => (page - 1) * PAGE_SIZE;

export function range(start: number, end: number): number[] {
  return Array.from({ length: end - start }, (_, index) => index + start);
}
