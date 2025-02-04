import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateObjetivosPersPropDto } from './dto/create-objetivos-pers-prop.dto';
import { UpdateObjetivosPersPropDto } from './dto/update-objetivos-pers-prop.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjetivosPersProp } from 'src/data-access/entities/objetivos-pers-prop.entity';
import { Repository } from 'typeorm';
import { ObjtivosEmpDep } from 'src/data-access/entities/objtivos-emp-dep.entity';
import { User } from 'src/data-access/entities/usuario.entity';

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

  findAll(user: User) {
    return this.objetivosPersPropRepository.find({
      where: {user: user},
      relations: ['objtivoEmpDep']
    })
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

  async update(id: string, updateObjetivosPersPropDto: UpdateObjetivosPersPropDto, user: User) {
    
    const {objtivoEmpDep, ...data} = updateObjetivosPersPropDto;
   
    const objEmpDep = await this.objetivosEmpDepRepository.findOne({
      where: {id: objtivoEmpDep}
    })

    try {
      const objDepProp = await this.objetivosPersPropRepository.preload({
        id,
        objtivoEmpDep: objEmpDep,
        ...data
      })

      await this.objetivosPersPropRepository.save(objDepProp)
      
      return this.findAll(user)

    } catch (error) {
      this.handleDBExceptions(error)
    }
    

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

    throw new InternalServerErrorException('Unexpected error, check server logs')
    
  }
}
