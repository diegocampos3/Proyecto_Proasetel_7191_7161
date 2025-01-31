import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateObjetivosEmprDto } from './dto/create-objetivos-empr.dto';
import { UpdateObjetivosEmprDto } from './dto/update-objetivos-empr.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid'
import { ObjetivosEmpr } from 'src/data-access/entities/objetivosEmpr.entity';


@Injectable()
export class ObjetivosEmprService {


  private readonly logger = new Logger('ObjetivosEmprServices');
  constructor(

    @InjectRepository(ObjetivosEmpr)
    private readonly objetivosEmprRepository: Repository<ObjetivosEmpr>

  ){}


  async create(createObjetivosEmprDto: CreateObjetivosEmprDto) {
    
    try {
      const objempr = this.objetivosEmprRepository.create(createObjetivosEmprDto);
      
      await this.objetivosEmprRepository.save(objempr);

      return this.findAll();


    } catch (error) {
      this.handleDBExceptions(error);
    }

  }

  findAll() {
    return this.objetivosEmprRepository.find({
      order: {
        titulo: 'ASC',
      }
    });
  }


  async findOne(term: string) {
    
    let objetivosEmpr: ObjetivosEmpr[];
  
    if (isUUID(term)) {
      objetivosEmpr = await this.objetivosEmprRepository.find({ where: { id: term } });

    } else {
      const searchWords = term.toLocaleLowerCase().split(' ');
  
      const queryBuilder = this.objetivosEmprRepository.createQueryBuilder('objetivo');
      searchWords.forEach((word, index) => {
        const paramKey = `word${index}`; 
        if (index === 0) {
          queryBuilder.where(`LOWER(objetivo.titulo) LIKE :${paramKey}`, {
            [paramKey]: `%${word}%`,
          });
        } else {
          queryBuilder.orWhere(`LOWER(objetivo.titulo) LIKE :${paramKey}`, {
            [paramKey]: `%${word}%`,
          });
        }
      });
  
      objetivosEmpr = await queryBuilder.getMany();
    }
  
    if (objetivosEmpr.length === 0) {
      throw new NotFoundException(`No se encontraron objetivos que coincidan con "${term}"`);
    }
  
    return objetivosEmpr;
  }
  
  

async update(id: string, updateObjetivosEmprDto: UpdateObjetivosEmprDto) {
    
    const objetivoEmpr = await this.objetivosEmprRepository.preload({
      id: id,
      ...updateObjetivosEmprDto
    })

    if ( !objetivoEmpr) throw new NotFoundException(`El objetivo empresarial con id ${ id } no fue encontrado`);

    try {
      
      await this.objetivosEmprRepository.save(objetivoEmpr);
      return this.findAll();

    } catch (error) {
      
      this.handleDBExceptions(error);

    }
  }

  async remove(id: string) {
    
    const objetivoEmpr = await this.findOne( id );

    await this.objetivosEmprRepository.remove( objetivoEmpr);

    return this.findAll();

  }

  private handleDBExceptions( error: any) {
    if( error.code === '23505')
      throw new BadRequestException('Ya existe un objetivo con ese título.');

    this.logger.error(error);

    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
  
}
