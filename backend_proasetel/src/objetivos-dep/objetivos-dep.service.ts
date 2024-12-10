import { Injectable } from '@nestjs/common';
import { CreateObjetivosDepDto } from './dto/create-objetivos-dep.dto';
import { UpdateObjetivosDepDto } from './dto/update-objetivos-dep.dto';

@Injectable()
export class ObjetivosDepService {
  create(createObjetivosDepDto: CreateObjetivosDepDto) {
    return 'This action adds a new objetivosDep';
  }

  findAll() {
    return `This action returns all objetivosDep`;
  }

  findOne(id: number) {
    return `This action returns a #${id} objetivosDep`;
  }

  update(id: number, updateObjetivosDepDto: UpdateObjetivosDepDto) {
    return `This action updates a #${id} objetivosDep`;
  }

  remove(id: number) {
    return `This action removes a #${id} objetivosDep`;
  }
}
