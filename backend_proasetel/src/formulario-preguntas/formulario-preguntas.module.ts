import { Module } from '@nestjs/common';
import { FormularioPreguntasService } from './formulario-preguntas.service';
import { FormularioPreguntasController } from './formulario-preguntas.controller';

@Module({
  controllers: [FormularioPreguntasController],
  providers: [FormularioPreguntasService],
})
export class FormularioPreguntasModule {}
