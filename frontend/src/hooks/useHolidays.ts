import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getConnection } from '../utils/connections.ts';
import type { Holiday, HolidaysByDay } from '../infrastructure/dto/nager-date/holiday.ts';

function groupHolidaysByDay(holidays: Holiday[]): HolidaysByDay {
  const map: HolidaysByDay = {};
  for (const h of holidays) {
    if (!map[h.date]) map[h.date] = [];
    map[h.date].push(h);
  }
  return map;
}

export function useHolidays(year: number, countryCode: string) {
  const { data: holidays = [], isLoading } = useQuery<Holiday[]>({
    queryKey: ['holidays', year, countryCode],
    queryFn: async () => {
      const { client } = getConnection();
      const response = await client.nagerDate.getHolidays({ year, countryCode });
      if (response.type === 'SUCCESS') {
        return response.result;
      }
      console.error('Failed to fetch holidays:', response);
      return [];
    },
    staleTime: 1000 * 60 * 60 * 24,
  });

  const holidaysByDay = useMemo(() => groupHolidaysByDay(holidays), [holidays]);

  return { holidaysByDay, loading: isLoading };
}
