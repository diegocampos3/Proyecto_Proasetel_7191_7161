// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { EvaluacionPersService } from './evaluacion-pers.service';
// import { EvaluacionPersController } from './evaluacion-pers.controller';
// import { EvaluacionPers } from '../data-access/entities/evaluacionPers.entity';
// import { Formulario } from '../data-access/entities/formulario.entity';
// import { PeriodoEvaluacion } from '../data-access/entities/periodoEvaluacion.entity';
// import { User } from '../data-access/entities/usuario.entity';
// import { AuthModule } from 'src/auth/auth.module';

// @Module({
//   controllers: [EvaluacionPersController],
//   providers: [EvaluacionPersService],
//   imports: [
//     TypeOrmModule.forFeature([
//       EvaluacionPers,
//       Formulario,
//       PeriodoEvaluacion,
//       User, // Incluye User si es necesario en este módulo
//     ]),
//     AuthModule, // Módulo de autenticación necesario para manejar tokens
//   ],
//   exports: [
//     TypeOrmModule,
//     EvaluacionPersService, // Exportar si otro módulo necesita el servicio
//   ],
// })
// export class EvaluacionPersModule {}
