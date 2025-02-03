import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateRespuestasPreguntaDto } from './dto/create-respuestas_pregunta.dto';
import { UpdateRespuestasPreguntaDto } from './dto/update-respuestas_pregunta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RespuestasPreguntas } from '../data-access/entities/respuestas_pregunta.entity';
import { Not, QueryFailedError, Repository } from 'typeorm';
import { isUUID } from 'class-validator';

@Injectable()
export class RespuestasPreguntasService {
  private readonly logger = new Logger('RespuestasPreguntasService');

  constructor(
      @InjectRepository(RespuestasPreguntas)
      private readonly respuestasPreguntasRepository: Repository<RespuestasPreguntas>,
  ) {}

  async create(createRespuestasPreguntaDto: CreateRespuestasPreguntaDto) {
    try {
        //verificar si ya existe una pregunta con la misma clave
        const existingRespuesta = await this.respuestasPreguntasRepository.findOne({
          where: { clave : createRespuestasPreguntaDto.clave }
      });
      
      if (existingRespuesta) {
          throw new BadRequestException(`Ya existe una respuesta con la clave '${createRespuestasPreguntaDto.clave}'.`);
      }

      //continuar con la cracion y guardado
        const respuestaPregunta = this.respuestasPreguntasRepository.create(createRespuestasPreguntaDto);
        await this.respuestasPreguntasRepository.save(respuestaPregunta);
        return respuestaPregunta;
    } catch (error) {
        // throw new InternalServerErrorException('Error al crear la respuesta de pregunta');
        this.handleDBExceptions(error);
    }
  }

  findAll() {
    return this.respuestasPreguntasRepository.find();
  }

  async findOne(id: string) {
    if (!isUUID(id)) throw new BadRequestException(`${id} no es un UUID válido`);
    const respuestaPregunta = await this.respuestasPreguntasRepository.findOne({ where: { idRespuestaPregunta: id } });
    if (!respuestaPregunta) throw new NotFoundException(`Respuesta de pregunta con id ${id} no encontrada`);
    return respuestaPregunta;
  }

  // async update(id: string, updateRespuestasPreguntaDto: UpdateRespuestasPreguntaDto) {
  //   const respuestaPregunta = await this.respuestasPreguntasRepository.preload({
  //       idRespuestaPregunta: id,
  //       ...updateRespuestasPreguntaDto,
  //   });
  //   if (!respuestaPregunta) throw new NotFoundException(`Respuesta de pregunta con id ${id} no encontrada`);

  //   try {
  //       await this.respuestasPreguntasRepository.save(respuestaPregunta);
  //       return respuestaPregunta;
  //   } catch (error) {
  //     this.handleDBExceptions(error);  
  //   }
  // }

  async update(id: string, updateRespuestasPreguntaDto: UpdateRespuestasPreguntaDto) {
    // Obtener el registro existente
    const existingRespuesta = await this.respuestasPreguntasRepository.findOneBy({ 
      idRespuestaPregunta: id 
    });
    
    if (!existingRespuesta) {
      throw new NotFoundException(`Respuesta de pregunta con id ${id} no encontrada`);
    }

    // Verificar si se está actualizando la clave
    const nuevaClave = updateRespuestasPreguntaDto.clave;
    if (nuevaClave && nuevaClave !== existingRespuesta.clave) {
      // Buscar registros con la misma clave (excluyendo el actual)
      const registroDuplicado = await this.respuestasPreguntasRepository.findOne({
        where: { 
          clave: nuevaClave,
          idRespuestaPregunta: Not(id), // Excluir el registro actual
        },
      });

      if (registroDuplicado) {
        throw new BadRequestException('La clave ya está en uso por otro registro.');
      }
    }

    // Preload y guardar los cambios
    const respuestaActualizada = await this.respuestasPreguntasRepository.preload({
      idRespuestaPregunta: id,
      ...updateRespuestasPreguntaDto,
    });

    try {
      await this.respuestasPreguntasRepository.save(respuestaActualizada);
      return respuestaActualizada;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    try {
        const respuestaPregunta = await this.findOne(id);
        if (!respuestaPregunta) {
            throw new NotFoundException(`Respuesta de pregunta con ID ${id} no encontrada.`);
        }
        await this.respuestasPreguntasRepository.remove(respuestaPregunta);
    } catch (error) {
        if (error instanceof QueryFailedError && error.driverError?.code === '23503') {
            throw new ConflictException('No se puede eliminar porque tiene elementos asociados.');
        }
        throw new InternalServerErrorException('Error inesperado, revisa los logs del servidor');
    }
  }

  private handleDBExceptions(error: any): never {
    // Si es una excepción ya conocida, lánzala tal cual
    if (error instanceof BadRequestException || error instanceof NotFoundException) {
      throw error;
    }
  
    // Manejo genérico para errores de base de datos inesperados
    if (error.code === '23505') { // Código de error para conflictos únicos en Postgres
      throw new BadRequestException('Datos duplicados detectados en la base de datos');
    }
  
    console.error(error); // Logs para inspección
    throw new InternalServerErrorException('Error inesperado, revisa los logs del servidor');
  }
}
