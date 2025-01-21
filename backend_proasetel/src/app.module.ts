import { Module } from '@nestjs/common';
import { DepartamentosModule } from './departamentos/departamentos.module';
import { AuthModule } from './auth/auth.module';
import { ObjetivosDepModule } from './objetivos-dep/objetivos-dep.module';
import { EvaluacionPersModule } from './evaluacion-pers/evaluacion-pers.module';
import { FeedbackModule } from './feedback/feedback.module';
import { ObjetivosEmprModule } from './objetivos-empr/objetivos-empr.module';
import { ObjetivosPersModule } from './objetivos-pers/objetivos-pers.module';
import { PeriodoModule } from './periodo/periodo.module';
import { PeriodoEvaluacionModule } from './periodo-evaluacion/periodo-evaluacion.module';
import { FormularioModule } from './formulario/formulario.module';
import { FormularioPreguntasModule } from './formulario-preguntas/formulario-preguntas.module';
import { AnalisisSentimientosModule } from './analisis-sentimientos/analisis-sentimientos.module';
import { DataAccessModule } from './data-access/data-access.module';
import { MessagesWsModule } from './messages-ws/messages-ws.module';
import { MailsModule } from './mails/mails.module';
import { ConfigModule } from '@nestjs/config';

import { EvaluacionObjetivoPersModule } from './evaluacion_objetivo_pers/evaluacion_objetivo_pers.module';
import { ObjtivosEmpDepModule } from './objtivos-emp-dep/objtivos-emp-dep.module';

@Module({
  imports: [
    ConfigModule.forRoot(
      {isGlobal: true}
    ),
    DataAccessModule,
    DepartamentosModule, // Módulo de conexión
    AuthModule,
    ObjetivosDepModule,
    EvaluacionPersModule,
    FeedbackModule,
    ObjetivosEmprModule,
    ObjetivosPersModule,
    PeriodoModule,
    PeriodoEvaluacionModule,
    FormularioModule,
    FormularioPreguntasModule,
    AnalisisSentimientosModule,
    MessagesWsModule,
    MailsModule,
    EvaluacionObjetivoPersModule,
    ObjtivosEmpDepModule,
  ],
  
})
export class AppModule {}
