import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from 'src/data-access/entities/feedback.entity';
import { PeriodoEvaluacionModule } from 'src/periodo-evaluacion/periodo-evaluacion.module';
import { AuthModule } from 'src/auth/auth.module';
import { AnalisisSentimientosModule } from 'src/analisis-sentimientos/analisis-sentimientos.module';

@Module({
  controllers: [FeedbackController],
  providers: [FeedbackService],
  imports: [
    TypeOrmModule.forFeature([Feedback]),
    PeriodoEvaluacionModule,
    AuthModule,
    AnalisisSentimientosModule
  ],
  exports:[ TypeOrmModule]
})
export class FeedbackModule {}
