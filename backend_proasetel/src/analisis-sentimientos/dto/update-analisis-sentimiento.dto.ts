import { PartialType } from '@nestjs/mapped-types';
import { CreateAnalisisSentimientoDto } from './create-analisis-sentimiento.dto';

export class UpdateAnalisisSentimientoDto extends PartialType(CreateAnalisisSentimientoDto) {}
