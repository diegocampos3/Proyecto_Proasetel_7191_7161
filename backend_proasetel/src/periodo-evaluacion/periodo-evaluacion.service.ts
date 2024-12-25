import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreatePeriodoEvaluacionDto } from './dto/create-periodo-evaluacion.dto';
import { UpdatePeriodoEvaluacionDto } from './dto/update-periodo-evaluacion.dto';
import { PeriodoEvaluacion } from 'src/data-access/entities/periodoEvaluacion.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/data-access/entities/usuario.entity';
import { isUUID } from 'class-validator';

@Injectable()
export class PeriodoEvaluacionService {
  
  private readonly logger = new Logger('Periodo');

  constructor(

   @InjectRepository(PeriodoEvaluacion)
    private readonly periodoEvaRepository: Repository<PeriodoEvaluacion>
  ){}
  
  
  
  async create(createPeriodoEvaluacionDto: CreatePeriodoEvaluacionDto, user: User) {
    try {
      const { idPeriodo } = createPeriodoEvaluacionDto;
  
      if (!isUUID(idPeriodo)) {
        throw new BadRequestException('El periodo ingresado no existe o no es válido');
      }
  
      const periodoEva = this.periodoEvaRepository.create({
        periodo: { idPeriodo }, 
        user,      
      });
  
      await this.periodoEvaRepository.save(periodoEva);
  
      return periodoEva;

    } catch (error) {

      console.error('Error al crear la evaluación de periodo:', error.message);
      throw new InternalServerErrorException('Error al crear la evaluación de periodo');
    }
  }
  
  
  async findAll() {
    try {
      const periodoEvaluaciones = await this.periodoEvaRepository.find({
        relations: ['periodo', 'user'], 
      });
  
      if (!periodoEvaluaciones || periodoEvaluaciones.length === 0) {
        throw new BadRequestException('No se encontraron evaluaciones de periodo');
      }
  
      return periodoEvaluaciones;
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener las evaluaciones de periodo');
    }
  }
  
  

  async findOne(id: string) {
    
      if (!isUUID(id)) {
        throw new BadRequestException('El ID de periodo no es válido');
      }
  
      const periodoEva = await this.periodoEvaRepository.findOne({
        where: { idPeriodoEva: id },
        relations: ['periodo', 'user'], 
      });
  
      if (!periodoEva) {
        throw new BadRequestException('No se encontró la evaluación de periodo con ese ID');
      }
  
      return periodoEva;
  }
  
  async update(id: string, updatePeriodoEvaluacionDto: UpdatePeriodoEvaluacionDto, user: User) {
    
    try {
      if (!isUUID(id)) {
        throw new BadRequestException('El ID de periodo no es válido');
      }
  
      const periodoEva = await this.periodoEvaRepository.findOne({ where: { idPeriodoEva: id } });
      if (!periodoEva) {
        throw new BadRequestException('No se encontró la evaluación de periodo con ese ID');
      }
  
      const updatedPeriodoEva = Object.assign(periodoEva, updatePeriodoEvaluacionDto);
      
      updatedPeriodoEva.user = user;

      await this.periodoEvaRepository.save(updatedPeriodoEva);
  
      return updatedPeriodoEva;

    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar la evaluación de periodo');
    }
  }
  

  async remove(id: string) {
    try {
      if (!isUUID(id)) {
        throw new BadRequestException('El ID de periodo no es válido');
      }
  
      const periodoEva = await this.periodoEvaRepository.findOne({ where: { idPeriodoEva: id } });
      if (!periodoEva) {
        throw new BadRequestException('No se encontró la evaluación de periodo con ese ID');
      }
  
      await this.periodoEvaRepository.remove(periodoEva);
  
      return { message: 'Evaluación de periodo eliminada exitosamente' };
    } catch (error) {
      throw new InternalServerErrorException('Error al eliminar la evaluación de periodo');
    }
  }
  

  private handleDBExceptions( error: any): never{
    if( error.code === '23505')
      throw new BadRequestException(error.detail)

    this.logger.error(error);

    throw new InternalServerErrorException('Unexpected error, check server logs');
  }

  
}


