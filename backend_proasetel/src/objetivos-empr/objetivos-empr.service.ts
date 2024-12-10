import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateObjetivosEmprDto } from './dto/create-objetivos-empr.dto';
import { UpdateObjetivosEmprDto } from './dto/update-objetivos-empr.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjetivosEmpr } from './entities/objetivos-empr.entity';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid'


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

      return objempr;


    } catch (error) {
      this.handleDBExceptions(error);
    }

  }

  findAll() {
    return this.objetivosEmprRepository.find({});
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
      return objetivoEmpr;

    } catch (error) {
      
      this.handleDBExceptions(error);

    }
  }

  async remove(id: string) {
    
    const objetivoEmpr = await this.findOne( id );

    await this.objetivosEmprRepository.remove( objetivoEmpr)

  }

  private handleDBExceptions( error: any) {
    if( error.code === '23505')
      throw new BadRequestException(error.detail)

    this.logger.error(error);

    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
  
}
