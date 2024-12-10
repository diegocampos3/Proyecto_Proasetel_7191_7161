import { Injectable } from '@nestjs/common';
import { CreatePeriodoEvaluacionDto } from './dto/create-periodo-evaluacion.dto';
import { UpdatePeriodoEvaluacionDto } from './dto/update-periodo-evaluacion.dto';

@Injectable()
export class PeriodoEvaluacionService {
  create(createPeriodoEvaluacionDto: CreatePeriodoEvaluacionDto) {
    return 'This action adds a new periodoEvaluacion';
  }

  findAll() {
    return `This action returns all periodoEvaluacion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} periodoEvaluacion`;
  }

  update(id: number, updatePeriodoEvaluacionDto: UpdatePeriodoEvaluacionDto) {
    return `This action updates a #${id} periodoEvaluacion`;
  }

  remove(id: number) {
    return `This action removes a #${id} periodoEvaluacion`;
  }
}
