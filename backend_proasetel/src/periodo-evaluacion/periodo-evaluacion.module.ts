import { Module } from '@nestjs/common';
import { PeriodoEvaluacionService } from './periodo-evaluacion.service';
import { PeriodoEvaluacionController } from './periodo-evaluacion.controller';

@Module({
  controllers: [PeriodoEvaluacionController],
  providers: [PeriodoEvaluacionService],
})
export class PeriodoEvaluacionModule {}
