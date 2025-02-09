import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateObjetivosPersPropDto } from './dto/create-objetivos-pers-prop.dto';
import { UpdateObjetivosPersPropDto } from './dto/update-objetivos-pers-prop.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjetivosPersProp } from 'src/data-access/entities/objetivos-pers-prop.entity';
import { Not, Repository } from 'typeorm';
import { ObjtivosEmpDep } from 'src/data-access/entities/objtivos-emp-dep.entity';
import { User } from 'src/data-access/entities/usuario.entity';
import { ResultadoEvaluacion } from 'src/data-access/entities/resultado_evaluacion.entity';

@Injectable()
export class ObjetivosPersPropService {

  private readonly logger = new Logger('ObjetivosPersPropServices')

  constructor(
    

    @InjectRepository(ObjetivosPersProp)
    private readonly objetivosPersPropRepository: Repository<ObjetivosPersProp>,

    @InjectRepository(ObjtivosEmpDep)
    private readonly objetivosEmpDepRepository:  Repository<ObjtivosEmpDep>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    // @InjectRepository(ResultadoEvaluacion)
    // private readonly resultadoEvaluacionRepository: Repository<ResultadoEvaluacion>,

  ){}

  async create(createObjetivosPersPropDto: CreateObjetivosPersPropDto, user: User) {
    
    const { objtivoEmpDep: objId, ...data  } = createObjetivosPersPropDto;

    const objtivoEmpDep = await this.objetivosEmpDepRepository.findOne({
      where: {id: objId}
    });

    try {
      const objPersP = this.objetivosPersPropRepository.create({
        ...data,
        objtivoEmpDep,
        user
      });

      await this.objetivosPersPropRepository.save(objPersP);
      

      return this.findAll(user);

    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  // async findAll(user: User) {
  //   return this.objetivosPersPropRepository.find({
  //     where: {user: user},
  //     relations: ['objtivoEmpDep']
  //   });
  // }

  async findAllByUser(id:string) {
    const user = await this.userRepository.findOne({
      where: {id:id}
    })
    const resultados = await this.objetivosPersPropRepository.find({
      where: {user: user},
      relations: ['objtivoEmpDep']
    });

    return resultados ?? [];
  }

  
  async findAll(user: User) {
    const resultados = await this.objetivosPersPropRepository.find({
      where: { user: user },
      relations: ['objtivoEmpDep'],
    });
  
    return resultados ?? [];
  }


  async findAllDepartment(user: User) {
    // Obtener el departamento del usuario
    const userDep = await this.userRepository.findOne({
        where: { id: user.id },
        relations: ['departamento'], // Relación con el departamento
    });

    // Verificar si el usuario tiene departamento
    if (!userDep || !userDep.departamento) {
        throw new Error('Usuario no tiene departamento asignado');
    }

    // Obtener los objetivos personales junto con los detalles del objetivo empresarial asociado
    const objpers = await this.objetivosPersPropRepository.find({
        where: {
            user: { departamento: { id: userDep.departamento.id } }, // Filtrar por el departamento del usuario
        },
        relations: [
            'user',
            'objtivoEmpDep',
            'objtivoEmpDep.objetivoEmpr', // Relación con el objetivo empresarial
        ],
    });

    // Mapear los resultados para incluir detalles del objetivo empresarial
    const result = objpers.map((obj) => {
        return {
            id: obj.id,
            titulo: obj.titulo,
            descripcion: obj.descripcion,
            estado: obj.estado,
            aceptacion: obj.aceptacion,
            tituloObjEmpr: obj.objtivoEmpDep.objetivoEmpr.titulo
        };
    });

    return result;
}


  findOne(id: number) {
    return `This action returns a #${id} objetivosPersProp`;
  }

  // async update(id: string, updateObjetivosPersPropDto: UpdateObjetivosPersPropDto, user: User) {
    
  //   // const {objtivoEmpDep, ...data} = updateObjetivosPersPropDto;
   
  //   // const objEmpDep = await this.objetivosEmpDepRepository.findOne({
  //   //   where: {id: objtivoEmpDep},
  //   //   relations:['objtivoEmpDep'],
  //   // })

  //   // const objtivoEmpDep = await this.objetivosEmpDepRepository.findOne({
  //   //   where: { id: updateObjetivosPersPropDto.objtivoEmpDep },
  //   // });

  //   const objPersProp = await this.objetivosPersPropRepository.preload({
  //     id: id,
  //     ...updateObjetivosPersPropDto
  //   });

  //   // Si el formulario no existe, lanzamos un error
  //   if (!objtivoEmpDep) {
  //     throw new NotFoundException(
  //       `Objetivo Empresa Departamento con id ${updateObjetivosPersPropDto.objtivoEmpDep} no encontrado.`,
  //     );
  //   }

  // //  // Verifica si ya existe una pregunta con el mismo texto en la base de datos
  // //  const existingObjPersProp = await this.objetivosPersPropRepository.findOne({
  // //    where: {
  // //      titulo: updateObjetivosPersPropDto.titulo, // Busca por el texto de la pregunta
  // //      id: Not(id), // Excluye la pregunta que se está actualizando
  // //    },
  // //  });
 
  // //  // Si existe una pregunta con el mismo texto, lanzamos un error
  // //  if (existingObjPersProp) {
  // //    throw new ConflictException(
  // //      `Ya existe una pregunta con el texto: "${updateObjetivosPersPropDto.titulo}".`,
  // //    );
  // //  }   

  //   // try {
  //   //   const objDepProp = await this.objetivosPersPropRepository.preload({
  //   //     id,
  //   //     objtivoEmpDep: objEmpDep,
  //   //     ...data
  //   //   })

  //   try {
  //     const objDepProp = await this.objetivosPersPropRepository.preload({
  //       id: idUpdate,
  //       ...updateObjetivosPersPropDto,
  //       objtivoEmpDep,
  //     })

  //     await this.objetivosPersPropRepository.save(objDepProp)
  //     console.log('AAAA objtivoEmpDep', objtivoEmpDep)
  //     console.log('EEEE idObjProp', idUpdate)
  //     //return this.findAll(user)
  //     return objDepProp;

  //   } catch (error) {
  //     this.handleDBExceptions(error)
  //   }
    

  // }

  async update(
    id: string,
    updateObjetivosPersPropDto: UpdateObjetivosPersPropDto,
    user: User,
  ){
    // Buscar el objetivo personal propuesto por ID
    const objetivo = await this.objetivosPersPropRepository.findOne({ where: { id } });
    if (!objetivo) {
      throw new NotFoundException(`Objetivo personal propuesto con ID ${id} no encontrado`);
    }

    // // Verificar que el usuario tenga permisos para actualizar el objetivo
    // if (user.id !== objetivo.user.id && user.rol !== 'admin') {
    //   throw new UnauthorizedException('No tiene permisos para actualizar este objetivo');
    // }

    // Actualizar los campos permitidos
    Object.assign(objetivo, updateObjetivosPersPropDto);

    // Guardar los cambios en la base de datos
    await this.objetivosPersPropRepository.save(objetivo);
    return this.findAll(user)

  }

  async remove(id: string, user: User) {
    
    const objPersProp = await this.objetivosPersPropRepository.findOne({where:{id}});
    await this.objetivosPersPropRepository.remove(objPersProp)
    return this.findAll(user)
  }

  private handleDBExceptions(error: any){
    if(error.code === '23505')
      throw new BadRequestException('Ya existe un onjetivo con ese título');

    this.logger.error(error);

    throw new InternalServerErrorException('Error inesperado, revise los logs del servidor')
    
  }
}
