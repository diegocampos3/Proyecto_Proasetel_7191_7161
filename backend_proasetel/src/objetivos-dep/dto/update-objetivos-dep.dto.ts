import { PartialType } from '@nestjs/mapped-types';
import { CreateObjetivosDepDto } from './create-objetivos-dep.dto';

export class UpdateObjetivosDepDto extends PartialType(CreateObjetivosDepDto) {}
