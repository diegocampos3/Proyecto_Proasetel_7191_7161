import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException, Logger, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
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
      // Verificar si ya existe un formulario con el mismo nombre
      const existingFormulario = await this.formularioRepository.findOne({
        where: { nombre: createFormularioDto.nombre },
      });
  
      if (existingFormulario) {
        // Si existe, lanzar una excepción
        throw new ConflictException(
          `No se puede crear el formulario porque ya existe uno con el nombre '${createFormularioDto.nombre}'.`,
        );
      }
  
      // Si no existe, crear y guardar el nuevo formulario
      const formulario = this.formularioRepository.create(createFormularioDto);
      await this.formularioRepository.save(formulario);
      return formulario;
    } catch (error) {
      // Si la excepción es una ConflictException, la relanzamos
      if (error instanceof ConflictException) {
        throw error;
      }
      // Para cualquier otro error, lanzamos una InternalServerErrorException
      throw new InternalServerErrorException(
        'Error inesperado, revisa los logs del servidor',
      );
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

  // async remove(id: string) {
  //   const formulario = await this.findOne(id);
  //   await this.formularioRepository.remove(formulario);
  // }

  async remove(id: string) {
    try {
      // Buscar el formulario por ID
      const formulario = await this.findOne(id);
  
      if (!formulario) {
        // Si no se encuentra el formulario, lanzar una excepción
        throw new NotFoundException(`Formulario con ID ${id} no encontrado.`);
      }
  
      // Intentar eliminar el formulario
      await this.formularioRepository.remove(formulario);
    } catch (error) {
      // Verificar si el error es debido a una restricción de clave foránea
      if (
        error instanceof QueryFailedError &&
        error.driverError?.code === '23503' // Código de error de PostgreSQL para violación de clave foránea
      ) {
        throw new ConflictException(
          'Este registro no se puede eliminar porque tiene elementos asociados al mismo.',
        );
      }
  
      // Si el error es porque no se encontró el formulario, relanzar la excepción
      if (error instanceof NotFoundException) {
        throw error;
      }
  
      // Para cualquier otro error, lanzar una excepción de servidor interno
      throw new InternalServerErrorException(
        'Error inesperado, revisa los logs del servidor',
      );
    }
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException('Error inesperado, revisa los logs del servidor');
  }
}
