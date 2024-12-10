import { Injectable } from '@nestjs/common';
import { CreateAnalisisSentimientoDto } from './dto/create-analisis-sentimiento.dto';
import { UpdateAnalisisSentimientoDto } from './dto/update-analisis-sentimiento.dto';

@Injectable()
export class AnalisisSentimientosService {
  create(createAnalisisSentimientoDto: CreateAnalisisSentimientoDto) {
    return 'This action adds a new analisisSentimiento';
  }

  findAll() {
    return `This action returns all analisisSentimientos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} analisisSentimiento`;
  }

  update(id: number, updateAnalisisSentimientoDto: UpdateAnalisisSentimientoDto) {
    return `This action updates a #${id} analisisSentimiento`;
  }

  remove(id: number) {
    return `This action removes a #${id} analisisSentimiento`;
  }
}
