import { PartialType } from '@nestjs/mapped-types';
import { CreateObjetivosPersPropDto } from './create-objetivos-pers-prop.dto';

export class UpdateObjetivosPersPropDto extends PartialType(CreateObjetivosPersPropDto) {
    id: string;
}
