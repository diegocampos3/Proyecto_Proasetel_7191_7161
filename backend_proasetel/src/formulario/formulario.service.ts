import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Formulario } from '../data-access/entities/formulario.entity';
import { CreateFormularioDto } from './dto/create-formulario.dto';
import { UpdateFormularioDto } from './dto/update-formulario.dto';
import { validate as isUUID } from 'uuid';

@Injectable()
export class FormularioService {
  private readonly logger = new Logger('FormularioService');

  constructor(
    @InjectRepository(Formulario)
    private readonly formularioRepository: Repository<Formulario>,
  ) {}

  async create(createFormularioDto: CreateFormularioDto) {
    try {
      const formulario = this.formularioRepository.create(createFormularioDto);
      await this.formularioRepository.save(formulario);
      return formulario;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findAll() {
    return this.formularioRepository.find();
  }

  async findOne(id: string) {
    if (!isUUID(id)) throw new BadRequestException(`${id} no es un UUID válido`);
    const formulario = await this.formularioRepository.findOne({ where: { idFormulario: id } });
    if (!formulario) throw new NotFoundException(`Formulario con id ${id} no encontrado`);
    return formulario;
  }

  async update(id: string, updateFormularioDto: UpdateFormularioDto) {
    const formulario = await this.formularioRepository.preload({
      idFormulario: id,
      ...updateFormularioDto,
    });
    if (!formulario) throw new NotFoundException(`Formulario con id ${id} no encontrado`);

    try {
      await this.formularioRepository.save(formulario);
      return formulario;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const formulario = await this.findOne(id);
    await this.formularioRepository.remove(formulario);
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException('Error inesperado, revisa los logs del servidor');
  }
}
