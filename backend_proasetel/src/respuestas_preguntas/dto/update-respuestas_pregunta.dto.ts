import { PartialType } from '@nestjs/mapped-types';
import { CreateRespuestasPreguntaDto } from './create-respuestas_pregunta.dto';

export class UpdateRespuestasPreguntaDto extends PartialType(CreateRespuestasPreguntaDto) {}
