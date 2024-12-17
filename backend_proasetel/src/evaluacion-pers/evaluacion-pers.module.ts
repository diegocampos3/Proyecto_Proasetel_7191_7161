import { Module } from '@nestjs/common';
import { EvaluacionPersService } from './evaluacion-pers.service';
import { EvaluacionPersController } from './evaluacion-pers.controller';
import { ObjetivosPers } from 'src/data-access/entities/objetivosPers.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [EvaluacionPersController],
  providers: [EvaluacionPersService],
  imports: [
    TypeOrmModule.forFeature([ObjetivosPers]),

  ],
  exports: [TypeOrmModule]

})
export class EvaluacionPersModule {}
