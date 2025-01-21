import { PartialType } from '@nestjs/mapped-types';
import { CreateObjtivosEmpDepDto } from './create-objtivos-emp-dep.dto';

export class UpdateObjtivosEmpDepDto extends PartialType(CreateObjtivosEmpDepDto) {}
