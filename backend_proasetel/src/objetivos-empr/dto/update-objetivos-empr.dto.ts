import { PartialType } from '@nestjs/mapped-types';
import { CreateObjetivosEmprDto } from './create-objetivos-empr.dto';

export class UpdateObjetivosEmprDto extends PartialType(CreateObjetivosEmprDto) {}
