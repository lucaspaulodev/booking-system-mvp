export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function isPastDate(date: Date): boolean {
  const now = new Date();
  return date < now;
}

export function formatDateForDisplay(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTimeForDisplay(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, 
  });
}

export function formatDateTimeForDisplay(date: Date): string {
  return `${formatDateForDisplay(date)} at ${formatTimeForDisplay(date)}`;
}

export function parseDateTime(dateStr: string, timeStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);
  
  const date = new Date(year, month - 1, day, hours, minutes);
  return date;
}

export function toISODateTime(date: Date): string {
  return date.toISOString();
}

export function fromISODateTime(isoString: string): Date {
  return new Date(isoString);
}

export function getTimeFromDateTime(date: Date): string {
  return date.toTimeString().slice(0, 5);
} 