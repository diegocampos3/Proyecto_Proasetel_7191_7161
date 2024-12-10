import { Injectable } from '@nestjs/common';
import { CreateObjetivosPerDto } from './dto/create-objetivos-per.dto';
import { UpdateObjetivosPerDto } from './dto/update-objetivos-per.dto';

@Injectable()
export class ObjetivosPersService {
  create(createObjetivosPerDto: CreateObjetivosPerDto) {
    return 'This action adds a new objetivosPer';
  }

  findAll() {
    return `This action returns all objetivosPers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} objetivosPer`;
  }

  update(id: number, updateObjetivosPerDto: UpdateObjetivosPerDto) {
    return `This action updates a #${id} objetivosPer`;
  }

  remove(id: number) {
    return `This action removes a #${id} objetivosPer`;
  }
}
