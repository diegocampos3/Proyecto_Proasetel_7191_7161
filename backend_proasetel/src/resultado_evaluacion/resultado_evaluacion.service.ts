import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateResultadoEvaluacionDto } from './dto/create-resultado_evaluacion.dto';
import { UpdateResultadoEvaluacionDto } from './dto/update-resultado_evaluacion.dto';
import { ResultadoEvaluacion } from '../data-access/entities/resultado_evaluacion.entity';
import { FormulariosPreg } from 'src/data-access/entities/formulario-pregunta.entity';
import { ObjetivosPers } from 'src/data-access/entities/objetivosPers.entity';
import { ObjetivosPersProp } from 'src/data-access/entities/objetivos-pers-prop.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';



@Injectable()
export class ResultadoEvaluacionService {
  private readonly logger = new Logger('ResultadoEvaluacionService');

  constructor(
    @InjectRepository(ResultadoEvaluacion)
    private readonly resultadoEvaluacionRepository: Repository<ResultadoEvaluacion>,

    @InjectRepository(FormulariosPreg)
    private readonly formulariosPregRepository: Repository<FormulariosPreg>,

    @InjectRepository(ObjetivosPers)
    private readonly objetivosPersRepository: Repository<ObjetivosPers>,

    @InjectRepository(ObjetivosPersProp)
    private readonly objetivosPersPropRepository: Repository<ObjetivosPersProp>,

  ) {}

  async create(createResultadoEvaluacionDto: CreateResultadoEvaluacionDto) {
    try {

      // Buscar si el la pregunta existe
      const pregunta = await this.formulariosPregRepository.findOne({
        where: { idPregunta: createResultadoEvaluacionDto.idPregunta },
      });

      if (!pregunta) {
        throw new NotFoundException(`Pregunta con id ${createResultadoEvaluacionDto.idPregunta} no encontrado para la evaluación`);
      }

      // Buscar si el la objPer existe
      let objetivoPersonal = null;
      if(createResultadoEvaluacionDto.idObjPer !== null){
        objetivoPersonal = await this.objetivosPersRepository.findOne({
          where: { idObjPer: createResultadoEvaluacionDto.idObjPer },
        });

        if (!objetivoPersonal) {
          throw new NotFoundException(`Objetivo Personal con id ${createResultadoEvaluacionDto.idObjPer} no encontrado para la evaluación`);
        }
      }



      let objetivoPersonalPropuesto = null;
      // Buscar si el la objPerProp existe
      if(createResultadoEvaluacionDto.idObjPersProp !== null){
        objetivoPersonalPropuesto = await this.objetivosPersPropRepository.findOne({
          where: { id: createResultadoEvaluacionDto.idObjPersProp },
        });

        if (!objetivoPersonalPropuesto) {
          throw new NotFoundException(`Objetivo Personal Propuesto con id ${createResultadoEvaluacionDto.idObjPersProp} no encontrado para la evaluación`);
        }
      }

      // console.log('OBJETIVO PERSONAL', objetivoPersonal)
      // console.log('OBJETIVO PERSONAL PROPUESTO', objetivoPersonalPropuesto)
      // console.log('OBJETIVO PERSONAL PROPUESTO iiiiiiidddddddd', createResultadoEvaluacionDto.idObjPersProp)

      const resultadoEvaluacion = this.resultadoEvaluacionRepository.create({...createResultadoEvaluacionDto,pregunta, objetivoPersonal, objetivoPersonalPropuesto});
      await this.resultadoEvaluacionRepository.save(resultadoEvaluacion);
      return resultadoEvaluacion;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll() {
    const resultado = await this.resultadoEvaluacionRepository.find({
      relations:['objetivoPersonal', 'objetivoPersonalPropuesto', 'pregunta']
    });

    const result = resultado.map((obj) => {
      return{
        idResultadoEvaluacion: obj.idResultadoEvaluacion,
        idObjPer: obj.objetivoPersonal ? obj.objetivoPersonal.idObjPer : null,
        idObjPersProp: obj.objetivoPersonalPropuesto ? obj.objetivoPersonalPropuesto.id : null,
        idPregunta: obj.pregunta.idPregunta,
        puntaje_evaluado: obj.puntaje_evaluado,
        puntaje_supervisor: obj.puntaje_supervisor
      }
    });

    return result
  }

  async findOne(id: string) {
    if (!isUUID(id)) throw new BadRequestException(`${id} no es un UUID válido`);
    const resultadoEvaluacion = await this.resultadoEvaluacionRepository.findOne({ where: { idResultadoEvaluacion: id } });
    if (!resultadoEvaluacion) throw new NotFoundException(`Resultado de evaluación con id ${id} no encontrado`);
    return resultadoEvaluacion;
  }

  async update(id: string, updateResultadoEvaluacionDto: UpdateResultadoEvaluacionDto) {
    const resultadoEvaluacion = await this.resultadoEvaluacionRepository.preload({
      idResultadoEvaluacion: id,
      ...updateResultadoEvaluacionDto
    });

    if (!resultadoEvaluacion) {
      throw new NotFoundException(`Resultado de evaluación con id ${id} no encontrado`);
    }

    try {
      await this.resultadoEvaluacionRepository.save(resultadoEvaluacion);
      return resultadoEvaluacion;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const resultadoEvaluacion = await this.findOne(id);
    await this.resultadoEvaluacionRepository.remove(resultadoEvaluacion);
  }

  private handleDBExceptions(error: any): never {
    if (error instanceof BadRequestException || error instanceof NotFoundException) {
      throw error;
    }

    if (error.code === '23505') {
      throw new BadRequestException('Datos duplicados detectados en la base de datos');
    }

    console.error(error);
    throw new InternalServerErrorException('Error inesperado, revisa los logs del servidor');
  }
}