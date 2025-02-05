import { PartialType } from '@nestjs/mapped-types';
import { CreateEvaluacionFinalObjPersDto } from './create-evaluacion-final-obj-pers.dto';

export class UpdateEvaluacionFinalObjPersDto extends PartialType(CreateEvaluacionFinalObjPersDto) {}
