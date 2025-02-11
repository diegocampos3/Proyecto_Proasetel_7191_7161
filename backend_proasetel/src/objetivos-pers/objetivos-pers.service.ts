import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateObjetivosPerDto } from './dto/create-objetivos-per.dto';
import { UpdateObjetivosPerDto } from './dto/update-objetivos-per.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjetivosPers } from 'src/data-access/entities/objetivosPers.entity';
import { Repository } from 'typeorm';
import { ObjetivosDep } from 'src/data-access/entities/objetivosDep.entity';
import { validate as isUUID } from 'uuid'
import { User } from 'src/data-access/entities/usuario.entity';
import { ResultadoEvaluacion } from 'src/data-access/entities/resultado_evaluacion.entity';

@Injectable()
export class ObjetivosPersService {

  private readonly logger = new Logger('ObjetivosEmprServices');

  constructor(

    @InjectRepository(ObjetivosPers)
    private readonly objetivosPersRepository: Repository<ObjetivosPers>,

    @InjectRepository(ObjetivosDep)
    private readonly objetivosDepRepository: Repository<ObjetivosDep>,

    // @InjectRepository(ResultadoEvaluacion)
    // private readonly resultadoEvaluacionRepository: Repository<ResultadoEvaluacion>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

  ){}



  async create(createObjetivosPerDto: CreateObjetivosPerDto, user: User) {
    
    const { objetivoDep: objId } = createObjetivosPerDto;

    const objetivoDep = await this.objetivosDepRepository.findOne({
      where: {idObjDep: objId}
    })

    try {
      
      const objPers = this.objetivosPersRepository.create({
        objetivoDep,
        user
      });

      await this.objetivosPersRepository.save(objPers);

      return this.findAll(user);

    } catch (error) {
       this.handleDBExceptions(error);
    }


  }

 async findAll(user: User) {
    const objPers =  await this.objetivosPersRepository.find({
      where: {user: user},
      relations: ['objetivoDep'],
    });

    if(objPers.length > 0){
      return objPers.map(item => ({
        idObjPer: item.idObjPer,
        idObjDep: item.objetivoDep.idObjDep,
        titulo: item.objetivoDep.titulo,
        descripcion: item.objetivoDep.descripcion,
        evaluado_empleado: item.evaluado_empleado,
        evaluado_supervisor:item.evaluado_supervisor
      }))
    }else{
      return []
    }
  }


  async findAllByUser(id: string) {
    const user = await this.userRepository.findOne({
      where: {id:id}
    })

    const objPers =  await this.objetivosPersRepository.find({
      where: {user: user},
      relations: ['objetivoDep'],
    });

    if(objPers.length > 0){
      return objPers.map(item => ({
        idObjPer: item.idObjPer,
        idObjDep: item.objetivoDep.idObjDep,
        titulo: item.objetivoDep.titulo,
        descripcion: item.objetivoDep.descripcion,
        evaluado_empleado: item.evaluado_empleado,
        evaluado_supervisor:item.evaluado_supervisor
      }))
    }else{
      return []
    }
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
  


  async update(idObjPer: string, updateObjetivosPerDto: UpdateObjetivosPerDto, user: User) {

    try {
      // const objToUpdate = await this.objetivosPersRepository.findOne({where: {idObjPer:id}});
      const objetivo = await this.objetivosPersRepository.findOne({where: { idObjPer }});
      if (!objetivo){
        throw new NotFoundException(`El objetivo personal con id ${idObjPer} no fue encontrado`);
      }

      // Guardar la entidad actualizada
      // await this.objetivosPersRepository.save(objToUpdate);
      // console.log('objDep', objDep)
      // console.log('objetivoDep', objetivoDep)
      // return this.findAll(user)
      // try {
      //   const updateObjPers = await this.objetivosPersRepository.save({
      //     ...restoDatos,
      //     objetivoDep,
      //   });

      //   return updateObjPers;
      // Actualizar los campos permitidos
      Object.assign(objetivo, updateObjetivosPerDto);

      // Guardar los cambios en la base de datos
      await this.objetivosPersRepository.save(objetivo);
      return this.findAll(user)


    } catch (error) {
      this.handleDBExceptions(error);
    }

  }

 async remove(id: string, user: User) {

    const objetivoPers = await this.findOne( id );

    await this.objetivosPersRepository.remove( objetivoPers);

    return this.findAll(user)
  }


  private handleDBExceptions( error: any): never{
    if( error.code === '23505')
      throw new BadRequestException(error.detail)
    
    this.logger.error(error);

    throw new InternalServerErrorException('Unexpected error, check server logs')
  }

}
