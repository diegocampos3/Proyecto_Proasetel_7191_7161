import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartamentosModule } from './departamentos/departamentos.module';
import { ObjetivosDepModule } from './objetivos-dep/objetivos-dep.module';
import { EvaluacionPersModule } from './evaluacion-pers/evaluacion-pers.module';
import { FeedbackModule } from './feedback/feedback.module';
import { ObjetivosEmprModule } from './objetivos-empr/objetivos-empr.module';
import { ObjetivosPersModule } from './objetivos-pers/objetivos-pers.module';
import { PeriodoModule } from './periodo/periodo.module';
import { PeriodoEvaluacionModule } from './periodo-evaluacion/periodo-evaluacion.module';
import { RolModule } from './rol/rol.module';
import { FormularioModule } from './formulario/formulario.module';
import { FormularioPreguntasModule } from './formulario-preguntas/formulario-preguntas.module';
import { AnalisisSentimientosModule } from './analisis-sentimientos/analisis-sentimientos.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true
    }),
    DepartamentosModule,
    ObjetivosDepModule,
    EvaluacionPersModule,
    FeedbackModule,
    ObjetivosEmprModule,
    ObjetivosPersModule,
    PeriodoModule,
    PeriodoEvaluacionModule,
    RolModule,
    FormularioModule,
    FormularioPreguntasModule,
    AnalisisSentimientosModule,
  ],
  
})
export class AppModule {}
