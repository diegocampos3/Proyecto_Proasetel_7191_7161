import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateObjtivosEmpDepDto } from './dto/create-objtivos-emp-dep.dto';
import { UpdateObjtivosEmpDepDto } from './dto/update-objtivos-emp-dep.dto';
import { User } from 'src/data-access/entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjtivosEmpDep } from 'src/data-access/entities/objtivos-emp-dep.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { ObjetivosEmpr } from 'src/data-access/entities/objetivosEmpr.entity';
import { isUUID } from 'class-validator';

@Injectable()
export class ObjtivosEmpDepService {
  
  constructor(
    @InjectRepository(ObjtivosEmpDep)
    private readonly objtivosempdepRepository: Repository<ObjtivosEmpDep>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,


    @InjectRepository(ObjetivosEmpr)
    private readonly objetivosEmprRepository: Repository<ObjetivosEmpr>
  ) {}
  
  async create(createObjtivosEmpDepDto: CreateObjtivosEmpDepDto, user: User) {

    const {objetivoEmprId} = createObjtivosEmpDepDto;

    const objetivo = await this.objetivosEmprRepository.findOne({
      where: {id: objetivoEmprId}
    })
    
    const loadedUser = await this.userRepository.findOne({
      where: {id: user.id},
      relations: ['departamento']
    });


    try {
      
      const newObjEmpDep = this.objtivosempdepRepository.create({
        objetivoEmpr: objetivo,
        departamento: loadedUser.departamento
      });

      await this.objtivosempdepRepository.save(newObjEmpDep);

      return this.findAll()
      
    } catch (error) {
      throw new Error('Erros al crear la asignación')
    }
    

  }

  async findAll() {
    
    const selectObj = await this.objtivosempdepRepository.find({
      relations: ['objetivoEmpr', 'departamento'],
    });

    console.log('Imprimiendo selectObj', selectObj)
  
    // Mapear solo los datos de objetivoEmpr
    const result = selectObj.map((obj) => ({
      idbp: obj.id,
      id: obj.objetivoEmpr?.id,
      idep: obj.departamento?.id,
      titulo: obj.objetivoEmpr?.titulo ?? '', 
      descripcion: obj.objetivoEmpr?.descripcion ?? '',
    }));
    return result;
  }
  
  async findAllDep(user: User) {
    // Cargar el usuario con su departamento
    const loadedUser = await this.userRepository.findOne({
        where: { id: user.id },
        relations: ['departamento'],
    });

    if (!loadedUser) {
        throw new BadRequestException('Usuario no encontrado');
    }

    if (!loadedUser.departamento) {
        throw new BadRequestException('El usuario no tiene un departamento asignado');
    }

    // Filtrar objetivos solo del departamento del usuario
    const selectObj = await this.objtivosempdepRepository.find({
        where: { departamento: { id: loadedUser.departamento.id } },
        relations: ['objetivoEmpr', 'departamento'],
    });

    console.log('Imprimiendo selectObj', selectObj);

    // Mapear solo los datos de objetivoEmpr
    return selectObj.map((obj) => ({
        idbp: obj.id,
        id: obj.objetivoEmpr?.id,
        idep: obj.departamento?.id,
        titulo: obj.objetivoEmpr?.titulo ?? '',
        descripcion: obj.objetivoEmpr?.descripcion ?? '',
    }));
}



  

async findOne(id: string): Promise<boolean> {
  // Verificar si el ID es un UUID válido
  if (!isUUID(id)) {
    throw new BadRequestException(`El ID proporcionado no es un UUID válido: ${id}`);
  }

  const exists = await this.objtivosempdepRepository.exist({
    where: { objetivoEmpr: { id } },
  });

  return exists;
}


  update(id: number, updateObjtivosEmpDepDto: UpdateObjtivosEmpDepDto) {
    return `This action updates a #${id} objtivosEmpDep`;
  }

  async removeObjSelect(id: string) {
    
     const businessObj  = await this.objtivosempdepRepository.findOneBy({id});
    
     try {
      await this.objtivosempdepRepository.remove(businessObj)
      
      return this.findAll()

     } catch (error) {
      // Verificamos si el error es una violación de clave foránea
            if (
              error instanceof QueryFailedError &&
              error.message.includes('violates foreign key constraint')
            ) {
              throw new BadRequestException('No se puede eliminar este objetivo porque se encuentra asignado a objetivos departamentales');
            }
            // Si no es un error manejado, lo lanzamos nuevamente
            throw error;
     }
  }
}
