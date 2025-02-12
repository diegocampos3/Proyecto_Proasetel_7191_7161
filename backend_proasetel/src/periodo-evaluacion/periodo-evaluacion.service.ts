import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreatePeriodoEvaluacionDto } from './dto/create-periodo-evaluacion.dto';
import { UpdatePeriodoEvaluacionDto } from './dto/update-periodo-evaluacion.dto';
import { PeriodoEvaluacion } from 'src/data-access/entities/periodoEvaluacion.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/data-access/entities/usuario.entity';
import { isUUID } from 'class-validator';
import { Formulario } from 'src/data-access/entities/formulario.entity';
import { MessageBody } from '@nestjs/websockets';
import { Periodo } from 'src/data-access/entities/periodo.entity';

@Injectable()
export class PeriodoEvaluacionService {
  
  private readonly logger = new Logger('Periodo');

  constructor(

   @InjectRepository(PeriodoEvaluacion)
    private readonly periodoEvaRepository: Repository<PeriodoEvaluacion>,

    @InjectRepository(Formulario)
    private readonly formularioRepository: Repository<Formulario>,

    @InjectRepository(Periodo)
    private readonly periodoRepository: Repository<Periodo>,
    
  ){}
  
  
  
  async create(createPeriodoEvaluacionDto: CreatePeriodoEvaluacionDto, user: User) {
    try {
      const { idFormulario, idPeriodo } = createPeriodoEvaluacionDto;
  
      if (!isUUID(idPeriodo)) {
        throw new BadRequestException('El periodo ingresado no existe o no es válido');
      }

      const formulario = await this.formularioRepository.findOne({ where: { idFormulario: idFormulario } });
      if (!formulario) {
        throw new NotFoundException('El formulario con id ${idFormulario} no fue encontrado.');
      }
  
      const periodoEva = this.periodoEvaRepository.create({
        // formulario: { idFormulario },
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
      // if (!isUUID(id)) {
      //   throw new BadRequestException('El ID de periodo no es válido');
      // }
  
      // const periodoEva = await this.periodoEvaRepository.findOne({ where: { idPeriodoEva: id } });
      // if (!periodoEva) {
      //   throw new BadRequestException('No se encontró la evaluación de periodo con ese ID');
      // }


      const formulario = await this.formularioRepository.findOne({
        where: { idFormulario: updatePeriodoEvaluacionDto.idFormulario}
      })

      const periodo = await this.periodoRepository.findOne({
        where: { idPeriodo: updatePeriodoEvaluacionDto.idPeriodo },
      });
  
      const periodoEva = await this.periodoEvaRepository.preload({
        idPeriodoEva: id,
        periodo,
        formulario,
        ...updatePeriodoEvaluacionDto
      });

      console.log('baaaaaaaaaccccckkkkkkkkkk',periodoEva)

      if (!periodoEva) {
        throw new NotFoundException(`Periodo con id ${id} no encontrado`);
      }

      // const updatedPeriodoEva = Object.assign(periodoEva, updatePeriodoEvaluacionDto);
      
      // updatedPeriodoEva.user = user;
      // updatedPeriodoEva.periodo = periodo;


      await this.periodoEvaRepository.save(periodoEva);
      return periodoEva;

      // await this.periodoEvaRepository.save(updatedPeriodoEva);
      // console.log('baaaaaaaaaccccckkkkkkkkkk',updatedPeriodoEva)
  
      // return updatedPeriodoEva;

    } catch (error) {
      //throw new InternalServerErrorException('Error al actualizar la evaluación de Periodo');
      throw error.MessageBody;
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


