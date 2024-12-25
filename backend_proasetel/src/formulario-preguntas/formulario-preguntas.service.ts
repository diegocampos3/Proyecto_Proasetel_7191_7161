import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Formulario } from '../data-access/entities/formulario.entity';
import { FormulariosPreg } from '../data-access/entities/formulario-pregunta.entity';
import { CreateFormularioPreguntaDto } from './dto/create-formulario-pregunta.dto';
import { UpdateFormularioPreguntaDto } from './dto/update-formulario-pregunta.dto';
import { validate as isUUID } from 'uuid';

@Injectable()
export class FormularioPreguntasService {
  private readonly logger = new Logger('FormulariosPregService');

  constructor(
    @InjectRepository(FormulariosPreg)
    private readonly formulariosPregRepository: Repository<FormulariosPreg>,

    @InjectRepository(Formulario)
    private readonly formularioRepository: Repository<Formulario>,
  ) {}

  async create(createFormularioPregDto: CreateFormularioPreguntaDto) {
    try {

      const formulario = await this.formularioRepository.findOne({ where: { idFormulario: createFormularioPregDto.idFormulario } });

      if (!formulario) {
        throw new NotFoundException(`Formulario con id ${createFormularioPregDto.idFormulario} no encontrado.`);
      }
      
      const pregunta = this.formulariosPregRepository.create({
        ...createFormularioPregDto,
        idFormulario: formulario,
      });

      await this.formulariosPregRepository.save(pregunta);
      return pregunta;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findAll() {
    return this.formulariosPregRepository.find({ relations: ['idFormulario'] });
  }

  async findOne(id: string) {
    if (!isUUID(id)) throw new BadRequestException(`${id} no es un UUID válido`);
    const pregunta = await this.formulariosPregRepository.findOne({ where: { idPregunta: id } });
    if (!pregunta) throw new NotFoundException(`Pregunta con id ${id} no encontrada`);
    return pregunta;
  }

  async update(id: string, updateFormularioPregDto: UpdateFormularioPreguntaDto) {
  // Recupera el formulario correspondiente al ID proporcionado
    const formulario = await this.formularioRepository.findOne({
      where: { idFormulario: updateFormularioPregDto.idFormulario },
    });

    // Si el formulario no existe, lanzamos un error
    if (!formulario) {
      throw new NotFoundException(
        `Formulario con id ${updateFormularioPregDto.idFormulario} no encontrado.`,
      );
    }

    // Ahora realizamos el preload, incluyendo el objeto formulario completo
    const pregunta = await this.formulariosPregRepository.preload({
      idPregunta: id,
      ...updateFormularioPregDto,
      idFormulario: formulario,  // Asignamos el objeto completo de formulario
    });







    if (!pregunta) throw new NotFoundException(`Pregunta con id ${id} no encontrada`);

    try {
      await this.formulariosPregRepository.save(pregunta);
      return pregunta;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const pregunta = await this.findOne(id);
    await this.formulariosPregRepository.remove(pregunta);
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException('Error inesperado, revisa los logs del servidor');
  }
}
