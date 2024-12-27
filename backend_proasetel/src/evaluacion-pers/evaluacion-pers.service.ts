// import { Injectable, Logger, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { EvaluacionPers } from '../data-access/entities/evaluacionPers.entity';
// import { CreateEvaluacionPerDto } from './dto/create-evaluacion-per.dto';
// import { UpdateEvaluacionPerDto } from './dto/update-evaluacion-per.dto';
// import { Formulario } from 'src/data-access/entities/formulario.entity';
// import { ObjetivosPers } from 'src/data-access/entities/objetivosPers.entity';
// import { User } from 'src/data-access/entities/usuario.entity';

// @Injectable()
// export class EvaluacionPersService {
//   private readonly logger = new Logger('EvaluacionPersonalService');

//   constructor(
//     @InjectRepository(EvaluacionPers)
//     private readonly evaluacionPersonalRepository: Repository<EvaluacionPers>,

//     @InjectRepository(Formulario)
//     private readonly formularioRepository: Repository<Formulario>,

//     @InjectRepository(ObjetivosPers)
//     private readonly objetivosPersRepository: Repository<ObjetivosPers>,

//     @InjectRepository(User)
//     private readonly userRepository: Repository<User>,
//   ) {}

//   // Crear evaluación personal
//   async create(createEvaluacionPersonalDto: CreateEvaluacionPerDto) {
//     const formulario = await this.formularioRepository.findOne({
//       where: { idFormulario: createEvaluacionPersonalDto.idFormulario },
//     });
//     if (!formulario) {
//       throw new NotFoundException(`Formulario con id ${createEvaluacionPersonalDto.idFormulario} no encontrado.`);
//     }

//     const objetivoPers = await this.objetivosPersRepository.findOne({
//       where: { idObjPer: createEvaluacionPersonalDto.idObjPer },
//     });
//     if (!objetivoPers) {
//       throw new NotFoundException(`Objetivo personal con id ${createEvaluacionPersonalDto.idObjPer} no encontrado.`);
//     }

//     const userEvaluado = await this.userRepository.findOne({
//       where: { idUserEvaluado: createEvaluacionPersonalDto.idUserEvaluado },
//     });
//     if (!userEvaluado) {
//       throw new NotFoundException(`Usuario con id ${createEvaluacionPersonalDto.idUserEvaluado} no encontrado.`);
//     }

//     try {
//       const evaluacionPersonal = this.evaluacionPersonalRepository.create({
//         ...createEvaluacionPersonalDto,
//         idFormulario: formulario,
//         idObjPer: objetivoPers,
//         idUserEvaluado: userEvaluado,
//       });

//       await this.evaluacionPersonalRepository.save(evaluacionPersonal);
//       return evaluacionPersonal;
//     } catch (error) {
//       this.handleDBExceptions(error);
//     }
//   }

//   // Obtener todas las evaluaciones
//   findAll() {
//     return this.evaluacionPersonalRepository.find({
//       relations: ['idFormulario', 'idObjPer', 'idUserEvaluado'],
//     });
//   }

//   // Buscar una evaluación por id o término de búsqueda
//   async findOne(term: string) {
//     let evaluaciones: EvaluacionPersonal[];

//     // Si el término es un UUID, buscamos por id
//     if (isUUID(term)) {
//       evaluaciones = await this.evaluacionPersonalRepository.find({
//         where: { id: term },
//         relations: ['idFormulario', 'idObjPer', 'idUserEvaluado'],
//       });
//     } else {
//       const queryBuilder = this.evaluacionPersonalRepository.createQueryBuilder('evaluacion');
//       queryBuilder.leftJoinAndSelect('evaluacion.idFormulario', 'formulario')
//                   .leftJoinAndSelect('evaluacion.idObjPer', 'objetivo')
//                   .leftJoinAndSelect('evaluacion.idUserEvaluado', 'user')
//                   .where('LOWER(formulario.nombre) LIKE :term OR LOWER(objetivo.nombre) LIKE :term OR LOWER(user.nombre) LIKE :term', {
//                     term: `%${term.toLowerCase()}%`,
//                   });

//       evaluaciones = await queryBuilder.getMany();
//     }

//     if (evaluaciones.length === 0) {
//       throw new NotFoundException(`No se encontraron evaluaciones con el término "${term}"`);
//     }

//     return evaluaciones;
//   }

//   // Actualizar evaluación
//   async update(id: string, updateEvaluacionPersonalDto: UpdateEvaluacionPerDto) {
//     const formulario = await this.formularioRepository.findOne({
//       where: { idFormulario: updateEvaluacionPersonalDto.idFormulario },
//     });
//     if (!formulario) {
//       throw new NotFoundException(`Formulario con id ${updateEvaluacionPersonalDto.idFormulario} no encontrado.`);
//     }

//     const objetivoPers = await this.objetivosPersRepository.findOne({
//       where: { idObjPer: updateEvaluacionPersonalDto.idObjPer },
//     });
//     if (!objetivoPers) {
//       throw new NotFoundException(`Objetivo personal con id ${updateEvaluacionPersonalDto.idObjPer} no encontrado.`);
//     }

//     const userEvaluado = await this.userRepository.findOne({
//       where: { idUserEvaluado: updateEvaluacionPersonalDto.idUserEvaluado },
//     });
//     if (!userEvaluado) {
//       throw new NotFoundException(`Usuario con id ${updateEvaluacionPersonalDto.idUserEvaluado} no encontrado.`);
//     }

//     // Actualizamos la evaluación
//     const evaluacion = await this.evaluacionPersonalRepository.preload({
//       id: id,
//       ...updateEvaluacionPersonalDto,
//       idFormulario: formulario,
//       idObjPer: objetivoPers,
//       idUserEvaluado: userEvaluado,
//     });

//     if (!evaluacion) {
//       throw new NotFoundException(`Evaluación personal con id ${id} no encontrada.`);
//     }

//     try {
//       await this.evaluacionPersonalRepository.save(evaluacion);
//       return evaluacion;
//     } catch (error) {
//       this.handleDBExceptions(error);
//     }
//   }

//   // Eliminar una evaluación
//   async remove(id: string) {
//     const evaluacion = await this.findOne(id);

//     if (evaluacion) {
//       await this.evaluacionPersonalRepository.remove(evaluacion);
//       return { message: `Evaluación con id ${id} eliminada correctamente` };
//     }

//     throw new NotFoundException(`Evaluación con id ${id} no encontrada`);
//   }

//   // Manejo de excepciones de base de datos
//   private handleDBExceptions(error: any) {
//     if (error.code === '23505') {
//       throw new BadRequestException(error.detail);
//     }
//     this.logger.error(error);
//     throw new InternalServerErrorException('Unexpected error, check server logs');
//   }
// }
