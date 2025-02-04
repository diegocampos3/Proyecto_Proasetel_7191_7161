import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateObjtivosEmpDepDto } from './dto/create-objtivos-emp-dep.dto';
import { UpdateObjtivosEmpDepDto } from './dto/update-objtivos-emp-dep.dto';
import { User } from 'src/data-access/entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjtivosEmpDep } from 'src/data-access/entities/objtivos-emp-dep.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { ObjetivosEmpr } from 'src/data-access/entities/objetivosEmpr.entity';

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
      relations: ['objetivoEmpr'],
    });
  
    // Mapear solo los datos de objetivoEmpr
    const result = selectObj.map((obj) => ({
      idbp: obj.id,
      id: obj.objetivoEmpr?.id,
      titulo: obj.objetivoEmpr?.titulo ?? '', 
      descripcion: obj.objetivoEmpr?.descripcion ?? '',
    }));
    return result;
  }
  
  

  findOne(id: string) {
    return `This action returns a #${id} objtivosEmpDep`;
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
