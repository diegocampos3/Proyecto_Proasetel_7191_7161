import { Injectable } from '@nestjs/common';
import { CreateObjetivosEmprDto } from './dto/create-objetivos-empr.dto';
import { UpdateObjetivosEmprDto } from './dto/update-objetivos-empr.dto';

@Injectable()
export class ObjetivosEmprService {
  create(createObjetivosEmprDto: CreateObjetivosEmprDto) {
    return 'This action adds a new objetivosEmpr';
  }

  findAll() {
    return `This action returns all objetivosEmpr`;
  }

  findOne(id: number) {
    return `This action returns a #${id} objetivosEmpr`;
  }

  update(id: number, updateObjetivosEmprDto: UpdateObjetivosEmprDto) {
    return `This action updates a #${id} objetivosEmpr`;
  }

  remove(id: number) {
    return `This action removes a #${id} objetivosEmpr`;
  }
}
