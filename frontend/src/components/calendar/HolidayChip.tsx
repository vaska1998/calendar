import styled from '@emotion/styled';
import type { Holiday } from '../../infrastructure/dto/nager-date/holiday.ts';

const ChipWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  background: #fff3e0;
  border-left: 3px solid #f29d38;
  border-radius: 2px;
  font-size: 11px;
  color: #8b6914;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: none;
  user-select: none;
`;

const HolidayIcon = styled.span`
  flex-shrink: 0;
`;

interface HolidayChipProps {
  holiday: Holiday;
}

const HolidayChip = ({ holiday }: HolidayChipProps) => {
  return (
    <ChipWrapper title={holiday.name}>
      <HolidayIcon>🎉</HolidayIcon>
      {holiday.localName}
    </ChipWrapper>
  );
};

export default HolidayChip;
