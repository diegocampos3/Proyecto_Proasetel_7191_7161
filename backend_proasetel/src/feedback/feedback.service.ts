import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Feedback } from 'src/data-access/entities/feedback.entity';
import { isUUID } from 'class-validator';
import { PeriodoEvaluacion } from '../data-access/entities/periodoEvaluacion.entity';
import { User } from 'src/data-access/entities/usuario.entity';
import axios from 'axios';
import { AnalisisSentimientos } from 'src/data-access/entities/analisis-sentimiento.entity';

@Injectable()
export class FeedbackService {

  private readonly logger = new Logger('Feedback');
  analisisSentimientosRepository: any;
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,

    @InjectRepository(PeriodoEvaluacion)
    private readonly periodoEvaRepository: Repository<PeriodoEvaluacion>,

    @InjectRepository(AnalisisSentimientos)
    private readonly analisisSentRepository: Repository<AnalisisSentimientos>
  ){}

  async create(createFeedbackDto: CreateFeedbackDto, user: User) {
    const { peridoEvaId, descripcion } = createFeedbackDto;

    if (!isUUID(peridoEvaId))
      throw new BadRequestException('El ID del periodo evaluación no es válido');

    const periodoEva = await this.periodoEvaRepository.findOne({
      where: { idPeriodoEva: peridoEvaId },
    });

    if (!periodoEva)
      throw new BadRequestException('El periodo evaluación no existe');

    try{
      
      const feedback = this.feedbackRepository.create({
        periodoEva,
        descripcion,
        user,
      });

      await this.feedbackRepository.save(feedback);

      const apiResponse = await axios.post('http://127.0.0.1:5000/analyze', {
        comment: descripcion,
      });

      console.log(apiResponse.data);

      const prediction = apiResponse.data.prediction;

      let resultado = true;

      if (prediction === 'negativo')
        resultado = false

      console.log('Resultado', resultado);
    
      const analisis = this.analisisSentRepository.create({
        idFeedback: feedback, // Relación con el feedback recién creado
        resultado,
      });

      await this.analisisSentRepository.save(analisis);
      
    

      return feedback;

    } catch (error) {
      console.error('Error al crear el feedback o análisis:', error.message);
      throw new InternalServerErrorException('Error al crear el feedback o análisis de sentimientos');
    }
  }


async findAll() {
    
    try {
      const feedback = await this.feedbackRepository.find({
        relations: ['periodoEva', 'user']
      });

      if (!feedback || feedback.length === 0)
        throw new BadRequestException('No se encontraron feedbacks')

      return feedback

    } catch (error) {
      throw new BadRequestException('Error al obtener las evaluaciones');
    }
  }


 async findOne(id: string) {
    
    if (!isUUID(id))
      throw new BadRequestException('El id de feedback no es válido')
    
    const feedback = await this.feedbackRepository.findOne({
      where: { idFeedback: id },
      relations: ['periodoEva', 'user']
    });

    if(!feedback)
      throw new BadRequestException('No se encontró feedback con ese ID');

    return feedback;

  }

 async  update(id: string, updateFeedbackDto: UpdateFeedbackDto,  user: User) {
    
     
      if (!isUUID(id))
        throw new BadRequestException('El ID de feedback no es válido');

      const feedback =  await this.feedbackRepository.findOne({
        where: {idFeedback: id}
      })

      if (!feedback)
        throw new BadRequestException('No se encontro con feedback con ese ID');

    try {
      const updateFeedback = Object.assign(feedback, updateFeedbackDto);

      updateFeedback.user = user

      await this.feedbackRepository.save(updateFeedback);

      return updateFeedback

     } catch (error) {

      this.handleDBExceptions(error);
     }

  }

 async remove(id: string) {
   
      if(!isUUID(id))    
        throw new BadRequestException('El ID de feedback no es válido');  
      
      const feedback = await this.feedbackRepository.findOne({
        where: { idFeedback: id}
      });

      if (!feedback)
        throw new BadRequestException('No se encuentro feedback con ese ID');
    try{
      
      await this.feedbackRepository.remove(feedback);

      return { message: 'Feedback eliminado correctamente'}
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private handleDBExceptions( error: any){
    if( error.code === '23505')
      throw new BadRequestException(error.detail)
    
    this.logger.error(error);

    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
