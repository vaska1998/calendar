import styled from '@emotion/styled';
import { useState, useMemo } from 'react';
import CalendarToolbar from '../../components/calendar/CalendarToolbar';
import CalendarGrid from '../../components/calendar/CalendarGrid';
import { CalendarProvider } from '../../providers/CalendarProvider.tsx';
import { useHolidays } from '../../hooks/useHolidays';
import { generateCalendarMatrix, getMonthYearLabel } from '../../utils/date';

const CalendarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
`;

const CalendarPage = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [countryCode, setCountryCode] = useState('UA');

  const cells = useMemo(() => generateCalendarMatrix(year, month), [year, month]);
  const dateRange = useMemo(
    () => ({ from: cells[0].dayKey, to: cells[cells.length - 1].dayKey }),
    [cells],
  );
  const monthLabel = useMemo(() => getMonthYearLabel(year, month), [year, month]);

  const { holidaysByDay } = useHolidays(year, countryCode);

  const adjacentYear = month === 0 ? year - 1 : month === 11 ? year + 1 : year;
  const { holidaysByDay: adjacentHolidays } = useHolidays(
    adjacentYear !== year ? adjacentYear : year,
    countryCode,
  );

  const mergedHolidays = useMemo(() => {
    if (adjacentYear === year) return holidaysByDay;
    return { ...adjacentHolidays, ...holidaysByDay };
  }, [holidaysByDay, adjacentHolidays, adjacentYear, year]);

  const handlePrevMonth = () => {
    setMonth((m) => {
      if (m === 0) {
        setYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  };

  const handleNextMonth = () => {
    setMonth((m) => {
      if (m === 11) {
        setYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  };

  const handleToday = () => {
    const now = new Date();
    setYear(now.getFullYear());
    setMonth(now.getMonth());
  };

  return (
    <CalendarProvider dateRange={dateRange}>
      <CalendarWrapper>
        <CalendarToolbar
          year={year}
          month={month}
          monthLabel={monthLabel}
          countryCode={countryCode}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onToday={handleToday}
          onCountryChange={setCountryCode}
        />
        <CalendarGrid cells={cells} holidaysByDay={mergedHolidays} />
      </CalendarWrapper>
    </CalendarProvider>
  );
};

export default CalendarPage;
