import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { validate as isUUID } from 'uuid'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateObjetivosDepDto } from './dto/create-objetivos-dep.dto';
import { UpdateObjetivosDepDto } from './dto/update-objetivos-dep.dto';
import { ObjetivosDep } from 'src/data-access/entities/objetivosDep.entity';
import { ObjtivosEmpDep } from 'src/data-access/entities/objtivos-emp-dep.entity';
import { RemoveObjetivosDepDto } from './dto/remove-objectivos-dep.dto';

@Injectable()
export class ObjetivosDepService {

  private readonly logger = new Logger('ObjetivosDepServices');

  constructor(

    @InjectRepository(ObjetivosDep)
    private readonly objetivosDepRepository: Repository<ObjetivosDep>,

    @InjectRepository(ObjtivosEmpDep)
    private readonly objtivosEmpDepRepository: Repository<ObjtivosEmpDep>

  ){}


async create(createObjetivosDepDto: CreateObjetivosDepDto) {
    
    
      const { objtivoEmpDep: objId, ...data } = createObjetivosDepDto;

      const objtivoEmpDep = await this.objtivosEmpDepRepository.findOne({
        where: {id: objId}
      })

      try{

      // Preparar para la inserción
      const objDep = this.objetivosDepRepository.create( {
        ...data,
        objtivoEmpDep

      });

      await this.objetivosDepRepository.save(objDep);

      return this.findAll(objId);

    } catch (error) {

      this.handleDBExceptions(error)
    }
  }

  findAll(id: string) {
    return this.objetivosDepRepository.find({
      where: {objtivoEmpDep: {id}}
    })
  }

  async findOne(term: string) {
    
    let objetivosDep:  ObjetivosDep[];

    if ( isUUID(term)){
      objetivosDep = await this.objetivosDepRepository.find( { where: {idObjDep: term}})
    
    }else{

      const searchWord = term.toLocaleLowerCase().split(' ');

      const queryBuilder = this.objetivosDepRepository.createQueryBuilder('objetivo');
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

      objetivosDep = await queryBuilder.getMany();
    }

    if ( objetivosDep.length === 0 ) {
      throw new NotFoundException(`No se encontraron objetivos que coincidan con "${term}"`);
    }

    return objetivosDep
  }


async update(id: string, updateObjetivosDepDto: UpdateObjetivosDepDto) {
  

    const {objtivoEmpDep: objId, ...data} = updateObjetivosDepDto;

    const objDep = await this.objetivosDepRepository.preload({
      idObjDep: id,
      ...data
    })

    if(!objDep) throw new NotFoundException('El objetivo no due encontrado');

    try {
      await this.objetivosDepRepository.save(objDep);
      return this.findAll(objId)

    } catch (error) {

      this.handleDBExceptions(error)
    }
  
  
  // const { departamento: departamentoNombre, objetivoEmpr: tituloObj, ...restoDatos } = updateObjetivosDepDto;

  // let departamento: Departamento | undefined = undefined;
  // let objtivoEmpr: ObjetivosEmpr| undefined = undefined;
  


  // if(departamentoNombre){
  //   departamento = await this.departamentoRepository.findOne({
  //     where: { nombre: departamentoNombre.toLocaleLowerCase()}
  //   })

  //   if( !departamento){
  //     throw new NotFoundException(`El departamento ${departamentoNombre} no fue encontrado`);
  //   }

  // }

  // if(tituloObj){
  //   objtivoEmpr = await this.objetivosEmprRepository.findOne({
  //     where: { titulo: tituloObj.toLocaleLowerCase()}
  //   })

  //   if( !objtivoEmpr){
  //     throw new NotFoundException(`El objetivo empresarial ${tituloObj} no fue encontrado`);
  //   }
    
  // }

  // const objToUpdate = await this.objetivosDepRepository.findOne({ where: { idObjDep: id}});

  // if( !objToUpdate)
  //   throw new NotFoundException(`El objetivo con id ${id} no fue encontrado`);

  // try {
  //   const updateObjDep = await this.objetivosDepRepository.save({
  //     ...restoDatos,
  //     departamento,
  //     objtivoEmpr
  //   });

  //   return updateObjDep;

  // } catch (error) {
  //   this.handleDBExceptions(error);
  // }

}

async  remove(removeObjetivosDepDto: RemoveObjetivosDepDto) {
    
   const {id, objtivoEmpDep} = removeObjetivosDepDto; 
   const objetivoDep = await this.findOne( id );
    
    await this.objetivosDepRepository.remove( objetivoDep);

    return this.findAll(objtivoEmpDep)
}

  private handleDBExceptions( error: any): never{
    if( error.code === '23505')
      throw new BadRequestException('Ya existe un objetivo con ese título.');

    this.logger.error(error);

    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
}