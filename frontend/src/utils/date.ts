export function toDayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getMonthYearLabel(year: number, month: number): string {
  const date = new Date(year, month, 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function generateCalendarMatrix(
  year: number,
  month: number,
): { date: Date; dayKey: string; dayNumber: number; isCurrentMonth: boolean; isToday: boolean }[] {
  const today = new Date();
  const todayKey = toDayKey(today);

  const firstDayOfMonth = new Date(year, month, 1);
  const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;

  const startDate = new Date(year, month, 1 - startDayOfWeek);

  const cells: {
    date: Date;
    dayKey: string;
    dayNumber: number;
    isCurrentMonth: boolean;
    isToday: boolean;
  }[] = [];

  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);
    const dayKey = toDayKey(date);
    cells.push({
      date,
      dayKey,
      dayNumber: date.getDate(),
      isCurrentMonth: date.getMonth() === month && date.getFullYear() === year,
      isToday: dayKey === todayKey,
    });
  }

  return cells;
}
