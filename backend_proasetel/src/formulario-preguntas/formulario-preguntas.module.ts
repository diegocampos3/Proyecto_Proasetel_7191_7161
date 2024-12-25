import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FormularioPreguntasService } from './formulario-preguntas.service';
import { FormularioPreguntasController } from './formulario-preguntas.controller';
import { FormulariosPreg } from 'src/data-access/entities/formulario-pregunta.entity';
import { AuthModule } from 'src/auth/auth.module';
import { FormularioModule } from '../formulario/formulario.module'; // Dependencia del módulo Formulario

@Module({
  controllers: [FormularioPreguntasController],
  providers: [FormularioPreguntasService],
  imports: [
    TypeOrmModule.forFeature([FormulariosPreg]), 
    forwardRef(() => AuthModule), // Si requiere autenticación
    forwardRef(() => FormularioModule), // Relación con el módulo Formulario
  ],
  exports: [
    TypeOrmModule,
    FormularioPreguntasService,
  ],
})
export class FormularioPreguntasModule {}
