import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RespuestasPreguntasService } from './respuestas_preguntas.service';
import { RespuestasPreguntasController } from './respuestas_preguntas.controller';

import { RespuestasPreguntas } from '../data-access/entities/respuestas_pregunta.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [RespuestasPreguntasController],
  providers: [RespuestasPreguntasService],
  imports: [
    TypeOrmModule.forFeature([RespuestasPreguntas]), 
    forwardRef(() => AuthModule), // Trabajar de forma cíclica si es necesario
  ],
  exports: [
    TypeOrmModule, 
    RespuestasPreguntasService, 
  ],
})
export class RespuestasPreguntasModule {}
