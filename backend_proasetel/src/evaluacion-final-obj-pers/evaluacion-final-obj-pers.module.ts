import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluacionFinalObjPersService } from './evaluacion-final-obj-pers.service';
import { EvaluacionFinalObjPersController } from './evaluacion-final-obj-pers.controller';
import { EvaluacionFinalObjPers } from 'src/data-access/entities/evaluacion-final-obj-pers.entity';
import { ObjetivosPersModule } from '../objetivos-pers/objetivos-pers.module';
import { ObjetivosPersPropModule } from '../objetivos-pers-prop/objetivos-pers-prop.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [EvaluacionFinalObjPersController],
  providers: [EvaluacionFinalObjPersService],
  imports: [
    TypeOrmModule.forFeature([EvaluacionFinalObjPers]),
    ObjetivosPersModule,
    ObjetivosPersPropModule,
    AuthModule,
  ],
  exports: [
    TypeOrmModule,
    EvaluacionFinalObjPersService,
  ],
})
export class EvaluacionFinalObjPersModule {}