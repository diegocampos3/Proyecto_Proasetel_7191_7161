import { PartialType } from '@nestjs/mapped-types';
import { CreateEvaluacionPerDto } from './create-evaluacion-per.dto';

export class UpdateEvaluacionPerDto extends PartialType(CreateEvaluacionPerDto) {}
