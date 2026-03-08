import styled from '@emotion/styled';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { useState, useEffect } from 'react';
import { Input, IconButton, ButtonOutline, Select } from '../ui';
import { COUNTRIES } from '../../infrastructure/constants/countries.ts';
import { useCalendar } from '../../contexts/calendar.context.tsx';

const ToolbarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
`;

const NavSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TodayButton = styled(ButtonOutline)`
  padding: 6px 16px;
  font-size: 13px;
`;

const MonthLabel = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
  min-width: 220px;
  text-align: center;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SearchInput = styled(Input)`
  padding: 6px 12px;
  font-size: 13px;
  width: 200px;
`;

const CountrySelect = styled(Select)`
  padding: 6px 8px;
`;

interface CalendarToolbarProps {
  year: number;
  month: number;
  monthLabel: string;
  countryCode: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onCountryChange: (code: string) => void;
}

const CalendarToolbar = ({
  monthLabel,
  countryCode,
  onPrevMonth,
  onNextMonth,
  onToday,
  onCountryChange,
}: CalendarToolbarProps) => {
  const { setSearch } = useCalendar();
  const [inputValue, setInputValue] = useState('');
  const debouncedSearch = useDebouncedValue(inputValue, 250);

  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);

  return (
    <ToolbarContainer>
      <NavSection>
        <IconButton onClick={onPrevMonth} title="Previous month">
          ‹
        </IconButton>
        <IconButton onClick={onNextMonth} title="Next month">
          ›
        </IconButton>
        <TodayButton onClick={onToday}>Today</TodayButton>
      </NavSection>

      <MonthLabel>{monthLabel}</MonthLabel>

      <RightSection>
        <SearchInput
          type="text"
          placeholder="Search tasks..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <CountrySelect value={countryCode} onChange={(e) => onCountryChange(e.target.value)}>
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
        </CountrySelect>
      </RightSection>
    </ToolbarContainer>
  );
};

export default CalendarToolbar;
