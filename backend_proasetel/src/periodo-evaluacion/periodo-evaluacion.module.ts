import { Module } from '@nestjs/common';
import { PeriodoEvaluacionService } from './periodo-evaluacion.service';
import { PeriodoEvaluacionController } from './periodo-evaluacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeriodoEvaluacion } from 'src/data-access/entities/periodoEvaluacion.entity';
import { PeriodoModule } from 'src/periodo/periodo.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [PeriodoEvaluacionController],
  providers: [PeriodoEvaluacionService],
  imports: [
    TypeOrmModule.forFeature([PeriodoEvaluacion]),
    PeriodoModule,
    AuthModule
  ],
  exports: [TypeOrmModule]

})
export class PeriodoEvaluacionModule {}
