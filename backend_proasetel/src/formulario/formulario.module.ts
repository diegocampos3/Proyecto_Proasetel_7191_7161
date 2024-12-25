import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FormularioService } from './formulario.service';
import { FormularioController } from './formulario.controller';
import { Formulario } from 'src/data-access/entities/formulario.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [FormularioController],
  providers: [FormularioService],
  imports: [
    TypeOrmModule.forFeature([Formulario]), 
    forwardRef(() => AuthModule), // Trabajar de forma cíclica si es necesario
  ],
  exports: [
    TypeOrmModule, 
    FormularioService, 
  ],
})
export class FormularioModule {}
