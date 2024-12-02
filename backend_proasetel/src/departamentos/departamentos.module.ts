import { forwardRef, Module } from '@nestjs/common';
import { DepartamentosService } from './departamentos.service';
import { DepartamentosController } from './departamentos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Departamento } from './entities/departamento.entity';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  controllers: [DepartamentosController],
  providers: [DepartamentosService],
  imports: [
    TypeOrmModule.forFeature([Departamento]),
    forwardRef(() => AuthModule), // Trabajar de forma cícila
  ],
  exports: [
    TypeOrmModule, 
    DepartamentosService, 
  ],
})
export class DepartamentosModule {}