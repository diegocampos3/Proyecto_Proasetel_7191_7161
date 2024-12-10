import { Module } from '@nestjs/common';
import { ObjetivosPersService } from './objetivos-pers.service';
import { ObjetivosPersController } from './objetivos-pers.controller';

@Module({
  controllers: [ObjetivosPersController],
  providers: [ObjetivosPersService],
})
export class ObjetivosPersModule {}
