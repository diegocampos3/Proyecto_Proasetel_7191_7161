import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateObjetivosPerDto } from './dto/create-objetivos-per.dto';
import { UpdateObjetivosPerDto } from './dto/update-objetivos-per.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjetivosPers } from 'src/data-access/entities/objetivosPers.entity';
import { Repository } from 'typeorm';
import { ObjetivosDep } from 'src/data-access/entities/objetivosDep.entity';
import { validate as isUUID } from 'uuid'

@Injectable()
export class ObjetivosPersService {

  private readonly logger = new Logger('ObjetivosEmprServices');

  constructor(

    @InjectRepository(ObjetivosPers)
    private readonly objetivosPersRepository: Repository<ObjetivosPers>,

    @InjectRepository(ObjetivosDep)
    private readonly objetivosDepRepository: Repository<ObjetivosDep>

  ){}



  async create(createObjetivosPerDto: CreateObjetivosPerDto) {
    
    const { objetivoDep: tituloObj, ...objPersData } = createObjetivosPerDto;

    let objetivoDep: ObjetivosDep | undefined = undefined;

    if( tituloObj){
      objetivoDep = await this.objetivosDepRepository.findOne({
        where: { titulo: tituloObj.toLocaleLowerCase() }
      })

      if(!objetivoDep)
        throw new NotFoundException(`El objetivo departamental ${tituloObj} no fue encontrado`);
    }

    try {
      
      const objPers = this.objetivosPersRepository.create({
        ...objPersData,
        objetivoDep
      });

      await this.objetivosPersRepository.save(objPers);

      return objPers;

    } catch (error) {
       this.handleDBExceptions(error);
    }


  }

  findAll() {
    return this.objetivosPersRepository.find({});
  }

 async findOne(term: string) {

  let objetivosPers: ObjetivosPers[];

  if ( isUUID(term)){
      objetivosPers = await this.objetivosPersRepository.find( { where: {idObjPer: term}});
  
  }else{
    const searchWord = term.toLocaleLowerCase().split(' ');

      const queryBuilder = this.objetivosPersRepository.createQueryBuilder('objetivo');
      searchWord.forEach( (word, index) => {
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

      objetivosPers = await queryBuilder.getMany();
    }

    if ( objetivosPers.length === 0 ) {
      throw new NotFoundException(`No se encontraron objetivos que coincidan con "${term}"`);
    }

    return objetivosPers
  }
  


  async update(id: string, updateObjetivosPerDto: UpdateObjetivosPerDto) {
    
    const { objetivoDep: tituloObj, ...restoDatos } = updateObjetivosPerDto;

    let objetivoDep: ObjetivosDep | undefined = undefined;

    if ( tituloObj){
      objetivoDep = await this.objetivosDepRepository.findOne({
        where: { titulo: tituloObj.toLocaleLowerCase()}
      })

      if (!objetivoDep){
        throw new NotFoundException(`El objetivo departamental ${tituloObj} no fue encontrado`);
      }
    }

    const objToUpdate = await this.objetivosPersRepository.findOne({where: {idObjPer:id}});

    if (!objToUpdate)
      throw new NotFoundException(`El objetivo personal con id ${id} no fue encontrado`);

    try {
      const updateObjPers = await this.objetivosPersRepository.save({
        ...restoDatos,
        objetivoDep
      });

      return updateObjPers;

    } catch (error) {
      this.handleDBExceptions(error);
    }

  }

 async remove(id: string) {

    const objetivoPers = await this.findOne( id );

    await this.objetivosPersRepository.remove( objetivoPers);
  }


  private handleDBExceptions( error: any): never{
    if( error.code === '23505')
      throw new BadRequestException(error.detail)
    
    this.logger.error(error);

    throw new InternalServerErrorException('Unexpected error, check server logs')
  }

}
