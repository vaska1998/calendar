import { Injectable } from '@nestjs/common';
import { NagerDateResponseDto } from './dto/nager-date.response.dto';
import { NagerDateRequestDto } from './dto/nager-date.request.dto';

@Injectable()
export class NagerDateService {
  url: string = 'https://date.nager.at/api/v3/PublicHolidays/';

  async fetchHolidays(
    data: NagerDateRequestDto,
  ): Promise<NagerDateResponseDto[]> {
    try {
      const response = await fetch(
        `${this.url}${data.year}/${data.countryCode}`,
      );
      const holidays = (await response.json()) as NagerDateResponseDto[];

      const seen = new Set<string>();
      return holidays.filter((h) => {
        const key = `${h.date}::${h.localName}::${h.name}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    } catch (error) {
      throw new Error('Failed to fetch holidays', { cause: error });
    }
  }
}
