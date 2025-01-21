import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreatePeriodoDto } from './dto/create-periodo.dto';
import { UpdatePeriodoDto } from './dto/update-periodo.dto';
import { Periodo } from '../data-access/entities/periodo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { fromZonedTime } from 'date-fns-tz';
import { Not, Repository } from 'typeorm';
import { validate as isUUID } from 'uuid'


@Injectable()
export class PeriodoService {
 
  private readonly logger = new Logger('Periodo');

  constructor(
    
    @InjectRepository(Periodo)
    private readonly periodoRepository: Repository<Periodo>

  ){}
 
 
async   create(createPeriodoDto: CreatePeriodoDto) {
    
  let {fecha_ini, fecha_fin} = createPeriodoDto;

  const timeZone = 'America/Guayaquil';
  fecha_ini = fromZonedTime(new Date(fecha_ini), timeZone);
  fecha_fin = fromZonedTime(new Date(fecha_fin), timeZone);

       // Validar que las fechas de un periodo no sean iguales a las de otro ya existente
    const periodosExistentes = await this.periodoRepository.find({
        where: [
          {
            fecha_ini:  fecha_ini,
            fecha_fin: fecha_fin
          }
        ]
      });
    
      if ( periodosExistentes.length > 0)
        throw new BadRequestException('Las fechas proporcionadas coindiden con las de un evento de evaluación ya existente');

      // Validar que la fecha de fin no sea anterior a la fecha de inicio
    if (fecha_fin < fecha_ini)
      throw new BadRequestException('La fecha fin no puede ser anterior a la fecha de inicio');
 
    if ( fecha_fin < (fecha_ini))
      throw new BadRequestException('La fecha fin no puede ser anterior a la fecha de inicio');



    try {

      const periodo = this.periodoRepository.create(createPeriodoDto);
      await this.periodoRepository.save(periodo);
      return this.findAll();
        
    } catch (error) {
      
      this.handleDBExceptions(error);

    }
  }

  findAll() {
    return this.periodoRepository.find({});
  }

  async findOne(id: string) {
    
    if (!isUUID(id)) {
      throw new BadRequestException(`El ID proporcionado (${id}) no es un UUID válido.`);
    }
  
    const periodo = await this.periodoRepository.findOne({
      where: { idPeriodo: id },
    });
  
    if (!periodo) {
      throw new NotFoundException(`No se encontró un periodo con el ID ${id}.`);
    }
  
    return periodo;
  }
  

async  update(id: string, updatePeriodoDto: UpdatePeriodoDto) {
    
    const periodo = await this.periodoRepository.preload ({
      idPeriodo: id,
      ...updatePeriodoDto
    });

    if ( !periodo) throw new NotFoundException(`El periodo con id ${id} no fue encontrado`);


    let {fecha_ini, fecha_fin} = periodo;

      fecha_ini = new Date(fecha_ini);
      fecha_fin = new Date(fecha_fin);

       // Validar que las fechas de un periodo no sean iguales a las de otro ya existente
    const periodosExistentes = await this.periodoRepository.find({
        where: [
          {
            fecha_ini:  fecha_ini,
            fecha_fin: fecha_fin,
            idPeriodo: Not(id)
          }
        ]
      });
    
      if ( periodosExistentes.length > 0)
        throw new BadRequestException('Las fechas proporcionadas coindiden con las de un periodo ya existente');

      
  //     const fechaActual = new Date();
      
  //     if ( fecha_ini < fechaActual)
  //       throw new BadRequestException('La fecha inicio no puede ser anterior a la fecha actual');
    if ( fecha_fin < (fecha_ini))
      throw new BadRequestException('La fecha fin no puede ser anterior a la fecha de inicio');

    try {

      await this.periodoRepository.save(periodo);
      return this.findAll();
      
    } catch (error) {

      this.handleDBExceptions(error);
      
    }
  }

async remove(id: string) {
    
    const perido = await this.findOne( id );

    await this.periodoRepository.remove(perido);

    return this.findAll();
  }

  private handleDBExceptions( error: any): never{
    if( error.code === '23505')
      throw new BadRequestException(error.detail)

    this.logger.error(error);

    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}


