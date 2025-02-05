import { PartialType } from '@nestjs/mapped-types';
import { CreateResultadoEvaluacionDto } from './create-resultado_evaluacion.dto';

export class UpdateResultadoEvaluacionDto extends PartialType(CreateResultadoEvaluacionDto) {}
