// import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { CreateEvaluacionObjetivoPerDto } from './dto/create-evaluacion_objetivo_per.dto';
// import { UpdateEvaluacionObjetivoPerDto } from './dto/update-evaluacion_objetivo_per.dto';
// import { EvaluacionObjetivoPers } from 'src/data-access/entities/evaluacion-Obj-Pers.entity';
// import { ObjetivosPers } from 'src/data-access/entities/objetivosPers.entity';
// import { EvaluacionPers } from 'src/data-access/entities/evaluacionPers.entity';


// @Injectable()
// export class EvaluacionObjetivoPersService {
//   constructor(
//     @InjectRepository(EvaluacionObjetivoPers)
//     private readonly evaluacionObjetivoPersRepository: Repository<EvaluacionObjetivoPers>,
//     @InjectRepository(ObjetivosPers)
//     private readonly objetivoPerRepository: Repository<ObjetivosPers>,

//     @InjectRepository(EvaluacionPers)
//     private readonly evaluacionPersRepository: Repository<EvaluacionPers>,

//   ) {}

//   async create(createDto: CreateEvaluacionObjetivoPerDto): Promise<EvaluacionObjetivoPers> {
//     try {
//       const nuevoRegistro = this.evaluacionObjetivoPersRepository.create(createDto);
//       return await this.evaluacionObjetivoPersRepository.save(nuevoRegistro);
//     } catch (error) {
//       throw new InternalServerErrorException(
//         'Error al crear el registro en evaluacion_objetivo_pers',
//       );
//     }
//   }

//   async findAll(): Promise<EvaluacionObjetivoPers[]> {
//     try {
//       return await this.evaluacionObjetivoPersRepository.find({
//         relations: ['objetivo', 'evaluacion'],
//       });
//     } catch (error) {
//       throw new InternalServerErrorException(
//         'Error al obtener todos los registros de evaluacion_objetivo_pers',
//       );
//     }
//   }

//   async findOne(idEvaPer: string, idObjPer: string): Promise<EvaluacionObjetivoPers> {
//     try {
//       const registro = await this.evaluacionObjetivoPersRepository.findOne({
//         where: { idEvaPer, idObjPer },
//         relations: ['evaluacion', 'objetivo'],
//       });
//       if (!registro) {
//         throw new NotFoundException(
//           `No se encontró el registro con idObjPer=${idObjPer} e idEvaPer=${idEvaPer}`,
//         );
//       }
//       return registro;
//     } catch (error) {
//       if (error instanceof NotFoundException) {
//         throw error;
//       }
//       throw new InternalServerErrorException(
//         'Error al obtener un registro específico de evaluacion_objetivo_pers',
//       );
//     }
//   }

  
//   async update(
//     idEvaPer: string,
//     idObjPer: string,
//     nivelLogro: number, // Directamente recibimos nivelLogro
//   ): Promise<EvaluacionObjetivoPers> {
//     try {
//       // Buscar el registro existente
//       const registro = await this.evaluacionObjetivoPersRepository.findOne({
//         where: { idEvaPer, idObjPer },
//         relations: ['evaluacion', 'objetivo'], // Cargar relaciones si es necesario
//       });
  
//       if (!registro) {
//         throw new NotFoundException(
//           `No se encontró el registro con idEvaPer=${idEvaPer} e idObjPer=${idObjPer}.`,
//         );
//       }
  
//       // Actualizar solo el nivelLogro
//       registro.nivelLogro = nivelLogro;
  
//       // Guardar cambios
//       await this.evaluacionObjetivoPersRepository.save(registro);
  
//       return registro;
//     } catch (error) {
//       if (error instanceof NotFoundException) {
//         throw error;
//       }
//       throw new InternalServerErrorException(
//         'Error al actualizar el registro en evaluacion_objetivo_pers.',
//       );
//     }
//   }
  
  

//   async remove(idEvaPer: string, idObjPer: string): Promise<void> {
//     try {
//       const result = await this.evaluacionObjetivoPersRepository.delete({  idEvaPer, idObjPer });
//       if (result.affected === 0) {
//         throw new NotFoundException(
//           `No se encontró el registro para eliminar con idObjPer=${idObjPer} e idEvaPer=${idEvaPer}`,
//         );
//       }
//     } catch (error) {
//       if (error instanceof NotFoundException) {
//         throw error;
//       }
//       throw new InternalServerErrorException(
//         'Error al eliminar un registro de evaluacion_objetivo_pers',
//       );
//     }
//   }
// }
