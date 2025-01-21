import { Injectable, BadRequestException, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { EvaluacionPers } from '../data-access/entities/evaluacionPers.entity';
import { CreateEvaluacionPerDto } from './dto/create-evaluacion-per.dto';
import { UpdateEvaluacionPerDto } from './dto/update-evaluacion-per.dto';
import { User } from 'src/data-access/entities/usuario.entity';
import { Formulario } from '../data-access/entities/formulario.entity';
import { PeriodoEvaluacion } from '../data-access/entities/periodoEvaluacion.entity';
import { ObjetivosPers } from '../data-access/entities/objetivosPers.entity';
import { isUUID } from 'class-validator';

@Injectable()
export class EvaluacionPersService {
  private readonly logger = new Logger('EvaluacionPersService');

  constructor(
    @InjectRepository(EvaluacionPers)
    private readonly evaluacionPersRepository: Repository<EvaluacionPers>,

    @InjectRepository(Formulario)
    private readonly formularioRepository: Repository<Formulario>,

    @InjectRepository(PeriodoEvaluacion)
    private readonly periodoEvaRepository: Repository<PeriodoEvaluacion>,

) {}
 
  async create(createEvaluacionPerDto: CreateEvaluacionPerDto, user: User): Promise<EvaluacionPers> {
    const {  idFormulario, idPeriodoEva  } = createEvaluacionPerDto;
    
    //   Verificar si ya existe una evaluación activa para el mismo usuario y un formulario distinto
    //   const existingEvaluation = await this.evaluacionPersRepository.findOne({
    //     where: {
    //       user, // Compara con la clave 'id' de la relación
    //       estado: true,
    //     },
    //     // relations: ['idUserEvaluado'], // Asegura que la relación esté cargada
    //     relations: ['idFormulario'],
    //   });
  
    //   if (existingEvaluation && existingEvaluation.formulario.idFormulario !== idFormulario) {
    //     throw new BadRequestException(
    //       'Ya existe una evaluación activa para este usuario con otro formulario.'
    //     );
    //   } 

      const formulario = await this.formularioRepository.findOne({ where: { idFormulario: idFormulario } });
      if (!formulario) {
        throw new NotFoundException('El formulario con id ${idFormulario} no fue encontrado.');
      }

          // Validar existencia de Periodo de Evaluación
        const periodoEva = await this.periodoEvaRepository.findOne({ where: { idPeriodoEva } });
        if (!periodoEva) {
        throw new NotFoundException(`El periodo de evaluación con id ${idPeriodoEva} no fue encontrado.`);
        }

    
    
    try{

    // Crear nueva evaluación
    const newEvaluacionPers = this.evaluacionPersRepository.create({
        formulario,        // Relación ManyToOne con Formulario
        periodoEva,           // Relación ManyToOne con PeriodoEvaluacion (antes idPeriodoEva)
        estado: createEvaluacionPerDto.estado,
        user,              // Relación ManyToOne con User
      });
 
      await this.evaluacionPersRepository.save(newEvaluacionPers);
      return newEvaluacionPers
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }
  

  async findAll(): Promise<EvaluacionPers[]> {
    try {
      const evaluaciones = await this.evaluacionPersRepository.find({
        relations: ['formulario', 'periodoEva', 'user']
      });
  
      if (!evaluaciones || evaluaciones.length === 0) {
        throw new BadRequestException('No se encontraron evaluaciones');
      }
  
      return evaluaciones;
    } catch (error) {
      throw new BadRequestException('Error al obtener las evaluaciones');
    }
  }

  async findOne(id: string): Promise<EvaluacionPers> {
    try {
      const evaluacion = await this.evaluacionPersRepository.findOne({
        where: { idEvaPer: id },
        relations: ['formulario', 'periodoEva', 'user'],
      });

      if (!evaluacion) {
        throw new NotFoundException(`La evaluación con id ${id} no fue encontrada.`);
      }

      return evaluacion;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  // async update(id: string, updateEvaluacionPerDto: UpdateEvaluacionPerDto, user: User): Promise<EvaluacionPers> {
  //   try {
  //     const formulario = await this.formularioRepository.findOne({where: {formulario}});
  //     const periodoEva = await this.periodoEvaRepository.findOne(periodoEva);

  //     const evaluacion = await this.evaluacionPersRepository.preload({
  //       idEvaPer: id,
  //       // ...updateEvaluacionPerDto,
  //       formulario,
  //       periodoEva,
  //       estado: updateEvaluacionPerDto.estado,
  //       user,
  //     });

  //     if (!evaluacion) {
  //       throw new NotFoundException(`La evaluación con id ${id} no fue encontrada.`);
  //     }

  //     return await this.evaluacionPersRepository.save(evaluacion);
  //     // return evaluacion;
  //   } catch (error) {
  //     this.handleDBExceptions(error);
  //   }
  // }

  async update(id: string, updateEvaluacionPerDto: UpdateEvaluacionPerDto, user: User): Promise<EvaluacionPers> {
    try {
      let formulario = null;
      let periodoEva = null;
  
      // Solo buscar formulario si se proporciona el idFormulario
      if (updateEvaluacionPerDto.idFormulario) {
        formulario = await this.formularioRepository.findOne({ where: { idFormulario: updateEvaluacionPerDto.idFormulario } });
        if (!formulario) {
          throw new NotFoundException(`El formulario con id ${updateEvaluacionPerDto.idFormulario} no fue encontrado.`);
        }
      }
  
      // Solo buscar periodo de evaluación si se proporciona el idPeriodoEva
      if (updateEvaluacionPerDto.idPeriodoEva) {
        periodoEva = await this.periodoEvaRepository.findOne({ where: { idPeriodoEva: updateEvaluacionPerDto.idPeriodoEva } });
        if (!periodoEva) {
          throw new NotFoundException(`El periodo de evaluación con id ${updateEvaluacionPerDto.idPeriodoEva} no fue encontrado.`);
        }
      }
  
      // Preload de la entidad EvaluacionPers con los cambios
      const evaluacion = await this.evaluacionPersRepository.preload({
        idEvaPer: id,
        formulario: formulario || undefined,
        periodoEva: periodoEva || undefined,
        estado: updateEvaluacionPerDto.estado,  // Actualización de estado
        user,  // Mantener la relación con el usuario
      });
  
      if (!evaluacion) {
        throw new NotFoundException(`La evaluación con id ${id} no fue encontrada.`);
      }
  
      // Guardar y devolver la evaluación actualizada
      await this.evaluacionPersRepository.save(evaluacion);
      return evaluacion
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }
  

  async remove(id: string) {
    // Verifica si el ID es un UUID válido
    if (!isUUID(id)) {
      throw new BadRequestException('El ID de evaluación no es válido');
    }
  
    // Busca la evaluación por el ID proporcionado
    const evaluacion = await this.evaluacionPersRepository.findOne({
      where: { idEvaPer: id }, // Utiliza el campo correcto según tu entidad (en este caso, 'idEvaPer')
    });
  
    // Si no se encuentra la evaluación, lanza una excepción con un mensaje claro
    if (!evaluacion) {
      throw new BadRequestException('No se encuentra evaluación con ese ID');
    }
  
    try {
      // Elimina la evaluación encontrada en la base de datos
      await this.evaluacionPersRepository.remove(evaluacion);
  
      // Responde con un mensaje indicando que la eliminación fue exitosa
      return { message: 'Evaluación eliminada correctamente' };
    } catch (error) {
      // Maneja cualquier error de la base de datos que ocurra durante la eliminación
      this.handleDBExceptions(error);
    }
  }
  

  private handleDBExceptions(error: any): void {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs.');
  }
}