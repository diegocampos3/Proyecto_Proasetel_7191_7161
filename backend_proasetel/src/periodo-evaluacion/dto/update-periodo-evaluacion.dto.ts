import { PartialType } from '@nestjs/mapped-types';
import { CreatePeriodoEvaluacionDto } from './create-periodo-evaluacion.dto';

export class UpdatePeriodoEvaluacionDto extends PartialType(CreatePeriodoEvaluacionDto) {}
