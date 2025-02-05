import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EvaluacionFinalObjPers } from 'src/data-access/entities/evaluacion-final-obj-pers.entity';
import { CreateEvaluacionFinalObjPersDto } from './dto/create-evaluacion-final-obj-pers.dto';
import { UpdateEvaluacionFinalObjPersDto } from './dto/update-evaluacion-final-obj-pers.dto';
import { validate as isUUID } from 'uuid';

@Injectable()
export class EvaluacionFinalObjPersService {
  private readonly logger = new Logger('EvaluacionFinalObjPersService');

  constructor(
    @InjectRepository(EvaluacionFinalObjPers)
    private readonly evaluacionFinalObjPersRepository: Repository<EvaluacionFinalObjPers>,
  ) {}

  async create(createEvaluacionFinalObjPersDto: CreateEvaluacionFinalObjPersDto) {
    try {
      const evaluacionFinal = this.evaluacionFinalObjPersRepository.create(createEvaluacionFinalObjPersDto);
      await this.evaluacionFinalObjPersRepository.save(evaluacionFinal);
      return evaluacionFinal;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findAll() {
    return this.evaluacionFinalObjPersRepository.find();
  }

  async findOne(id: string) {
    if (!isUUID(id)) throw new BadRequestException(`${id} no es un UUID válido`);
    const evaluacionFinal = await this.evaluacionFinalObjPersRepository.findOne({ where: { idEvaluacionFinalObjPers: id } });
    if (!evaluacionFinal) throw new NotFoundException(`Evaluación final con id ${id} no encontrada`);
    return evaluacionFinal;
  }

  async update(id: string, updateEvaluacionFinalObjPersDto: UpdateEvaluacionFinalObjPersDto) {
    const evaluacionFinal = await this.evaluacionFinalObjPersRepository.preload({
      idEvaluacionFinalObjPers: id,
      ...updateEvaluacionFinalObjPersDto,
    });

    if (!evaluacionFinal) {
      throw new NotFoundException(`Evaluación final con id ${id} no encontrada`);
    }

    try {
      await this.evaluacionFinalObjPersRepository.save(evaluacionFinal);
      return evaluacionFinal;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const evaluacionFinal = await this.findOne(id);
    await this.evaluacionFinalObjPersRepository.remove(evaluacionFinal);
  }

  private handleDBExceptions(error: any): never {
    if (error instanceof BadRequestException || error instanceof NotFoundException) {
      throw error;
    }

    if (error.code === '23505') {
      throw new BadRequestException('Datos duplicados detectados en la base de datos');
    }

    console.error(error);
    throw new InternalServerErrorException('Error inesperado, revisa los logs del servidor');
  }
}