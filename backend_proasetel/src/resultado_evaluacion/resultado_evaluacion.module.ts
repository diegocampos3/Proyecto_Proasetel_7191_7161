import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResultadoEvaluacionService } from './resultado_evaluacion.service';
import { ResultadoEvaluacionController } from './resultado_evaluacion.controller';
import { ResultadoEvaluacion } from '../data-access/entities/resultado_evaluacion.entity';
import { ObjetivosPersModule } from '../objetivos-pers/objetivos-pers.module';
import { ObjetivosPersPropModule } from '../objetivos-pers-prop/objetivos-pers-prop.module';
import { FormularioPreguntasModule } from '../formulario-preguntas/formulario-preguntas.module';
import { ObjetivosEmprModule } from 'src/objetivos-empr/objetivos-empr.module';
import { ObjetivosDepModule } from 'src/objetivos-dep/objetivos-dep.module';



@Module({
  controllers: [ResultadoEvaluacionController],
  providers: [ResultadoEvaluacionService],
  imports: [
    TypeOrmModule.forFeature([ResultadoEvaluacion]),
    ObjetivosPersModule,
    ObjetivosPersPropModule,
    FormularioPreguntasModule,
  ],
  exports: [TypeOrmModule]
})
export class ResultadoEvaluacionModule {}
