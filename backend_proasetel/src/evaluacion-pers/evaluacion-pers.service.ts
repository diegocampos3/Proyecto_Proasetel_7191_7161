import { Injectable } from '@nestjs/common';
import { CreateEvaluacionPerDto } from './dto/create-evaluacion-per.dto';
import { UpdateEvaluacionPerDto } from './dto/update-evaluacion-per.dto';

@Injectable()
export class EvaluacionPersService {
  create(createEvaluacionPerDto: CreateEvaluacionPerDto) {
    return 'This action adds a new evaluacionPer';
  }

  findAll() {
    return `This action returns all evaluacionPers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} evaluacionPer`;
  }

  update(id: number, updateEvaluacionPerDto: UpdateEvaluacionPerDto) {
    return `This action updates a #${id} evaluacionPer`;
  }

  remove(id: number) {
    return `This action removes a #${id} evaluacionPer`;
  }
}
