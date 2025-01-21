import { Injectable } from '@nestjs/common';
import { CreateAnalisisSentimientoDto } from './dto/create-analisis-sentimiento.dto';
import { UpdateAnalisisSentimientoDto } from './dto/update-analisis-sentimiento.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AnalisisSentimientos } from 'src/data-access/entities/analisis-sentimiento.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AnalisisSentimientosService {

  constructor (
    @InjectRepository(AnalisisSentimientos)
    private readonly analisisSentRepository: Repository<AnalisisSentimientos>
  ){}

  async create(createAnalisisSentimientoDto: CreateAnalisisSentimientoDto) {
     
    const analisis = this.analisisSentRepository.create(createAnalisisSentimientoDto);

    await this.analisisSentRepository.save(analisis)

    return analisis;
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
