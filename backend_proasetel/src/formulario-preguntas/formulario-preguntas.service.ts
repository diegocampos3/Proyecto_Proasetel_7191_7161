import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException, Logger, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
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

  // async create(createFormularioPregDto: CreateFormularioPreguntaDto) {
  //   try {

  //     const formulario = await this.formularioRepository.findOne({ where: { idFormulario: createFormularioPregDto.idFormulario } });

  //     if (!formulario) {
  //       throw new NotFoundException(`Formulario con id ${createFormularioPregDto.idFormulario} no encontrado.`);
  //     }
      
  //     const pregunta = this.formulariosPregRepository.create({
  //       ...createFormularioPregDto,
  //       formulario,
  //     });

  //     await this.formulariosPregRepository.save(pregunta);
  //     return pregunta;
  //   } catch (error) {
  //     this.handleDBExceptions(error);
  //   }
  // }

  async create(createFormularioPregDto: CreateFormularioPreguntaDto) {
    try {
      // Buscar si el formulario existe
      const formulario = await this.formularioRepository.findOne({
        where: { idFormulario: createFormularioPregDto.idFormulario },
      });
  
      if (!formulario) {
        throw new NotFoundException(`Formulario con id ${createFormularioPregDto.idFormulario} no encontrado.`);
      }
  
      // Verificar si la pregunta ya existe en el formulario
      const preguntaExistente = await this.formulariosPregRepository.findOne({
        where: { pregunta: createFormularioPregDto.pregunta, formulario: { idFormulario: createFormularioPregDto.idFormulario } },
      });
  
      if (preguntaExistente) {
        throw new BadRequestException(`La pregunta '${createFormularioPregDto.pregunta}' ya existe para este formulario.`);
      }
  
      // Crear y guardar la nueva pregunta
      const pregunta = this.formulariosPregRepository.create({
        ...createFormularioPregDto,
        formulario,
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

  async findAllByFormulario(idFormulario: string) {
    if (!isUUID(idFormulario)) {
        throw new BadRequestException(`${idFormulario} no es un UUID válido`);
    }
    
    const preguntas = await this.formulariosPregRepository.find({
        where: { formulario: { idFormulario } },
        relations: ['formulario'], // Incluye la relación si necesitas los datos del formulario
    });

    if (!preguntas || preguntas.length === 0) {
      return [];
        // throw new NotFoundException(`No se encontraron preguntas para el formulario con id ${idFormulario}`);
    }
    
    return preguntas;
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

  // Verifica si ya existe una pregunta con el mismo texto en la base de datos
  const existingPregunta = await this.formulariosPregRepository.findOne({
    where: {
      pregunta: updateFormularioPregDto.pregunta, // Busca por el texto de la pregunta
      idPregunta: Not(id), // Excluye la pregunta que se está actualizando
    },
  });

  // Si existe una pregunta con el mismo texto, lanzamos un error
  if (existingPregunta) {
    throw new ConflictException(
      `Ya existe una pregunta con el texto: "${updateFormularioPregDto.pregunta}".`,
    );
  }

  // Ahora realizamos el preload, incluyendo el objeto formulario completo
  const pregunta = await this.formulariosPregRepository.preload({
    idPregunta: id,
    ...updateFormularioPregDto,
    formulario, // Asignamos el objeto completo de formulario
  });

  if (!pregunta) {
    throw new NotFoundException(`Pregunta con id ${id} no encontrada`);
  }

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

  private handleDBExceptions(error: any): never {
    // Si es una excepción ya conocida, lánzala tal cual
    if (error instanceof BadRequestException || error instanceof NotFoundException) {
      throw error;
    }
  
    // Manejo genérico para errores de base de datos inesperados
    if (error.code === '23505') { // Código de error para conflictos únicos en Postgres
      throw new BadRequestException('Esta pregunta ya existe en este formulario');
    }
  
    console.error(error); // Logs para inspección
    throw new InternalServerErrorException('Error inesperado, revisa los logs del servidor');
  }
}  
