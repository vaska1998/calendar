import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { NagerDateService } from './nager-date.service';
import { NagerDateRequestDto } from './dto/nager-date.request.dto';
import { NagerDateResponseDto } from './dto/nager-date.response.dto';

@Controller('nager-date')
export class NagerDateController {
  constructor(private readonly nagerDateService: NagerDateService) {}

  @Post('/')
  @HttpCode(HttpStatus.OK)
  async fetchHolidays(
    @Body() data: NagerDateRequestDto,
  ): Promise<NagerDateResponseDto[]> {
    return this.nagerDateService.fetchHolidays(data);
  }
}
