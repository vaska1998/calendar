import { Module } from '@nestjs/common';
import { NagerDateService } from './nager-date.service';
import { NagerDateController } from './nager-date.controller';

@Module({
  controllers: [NagerDateController],
  providers: [NagerDateService],
})
export class NagerDateModule {}
