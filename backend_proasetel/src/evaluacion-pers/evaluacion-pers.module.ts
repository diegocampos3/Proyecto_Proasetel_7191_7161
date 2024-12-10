import { Module } from '@nestjs/common';
import { EvaluacionPersService } from './evaluacion-pers.service';
import { EvaluacionPersController } from './evaluacion-pers.controller';

@Module({
  controllers: [EvaluacionPersController],
  providers: [EvaluacionPersService],
})
export class EvaluacionPersModule {}
