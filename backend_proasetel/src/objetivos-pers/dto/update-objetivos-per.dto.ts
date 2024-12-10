import { PartialType } from '@nestjs/mapped-types';
import { CreateObjetivosPerDto } from './create-objetivos-per.dto';

export class UpdateObjetivosPerDto extends PartialType(CreateObjetivosPerDto) {}
