// import { Module } from '@nestjs/common';
// import { EvaluacionObjetivoPersService } from './evaluacion_objetivo_pers.service';
// import { EvaluacionObjetivoPersController } from './evaluacion_objetivo_pers.controller';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { EvaluacionObjetivoPers } from 'src/data-access/entities/evaluacion-Obj-Pers.entity';
// import { ObjetivosPers } from 'src/data-access/entities/objetivosPers.entity';
// import { EvaluacionPers } from 'src/data-access/entities/evaluacionPers.entity';

// @Module({
//   controllers: [EvaluacionObjetivoPersController],
//   providers: [EvaluacionObjetivoPersService],
//   imports: [
//     TypeOrmModule.forFeature([
//       EvaluacionObjetivoPers, // Tabla pivote
//       ObjetivosPers, // Entidad relacionada
//       EvaluacionPers, // Entidad relacionada
//     ]),
//   ],
//   exports: [TypeOrmModule]
// })
// export class EvaluacionObjetivoPersModule {}
