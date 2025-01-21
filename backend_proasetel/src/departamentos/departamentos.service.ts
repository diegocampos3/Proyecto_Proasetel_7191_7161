import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateDepartamentoDto } from './dto/create-departamento.dto';
import { UpdateDepartamentoDto } from './dto/update-departamento.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, QueryFailedError, Repository } from 'typeorm';
import { validate as isUUID } from 'uuid'
import { Departamento } from 'src/data-access/entities/departamento.entity';
import { User } from 'src/data-access/entities/usuario.entity';

@Injectable()
export class DepartamentosService {
  
  //Logger para mostrar los errores en consola de una forma más pecisa
  private readonly logger = new Logger('DepartamentosServices');

  // Patrón repositorio
  constructor (
    @InjectRepository(Departamento)
    private readonly departamentoRepository: Repository<Departamento>,

    @InjectRepository(User)
    private readonly userRepositoy: Repository<User>
  
  ){}

  async create(createDepartamentoDto: CreateDepartamentoDto) {
    
  try {

    // Creación de instancia del departamento con sus propiedades
    const departamento = this.departamentoRepository.create(createDepartamentoDto);
    
    // Grabar e impactar ne la base de datos
    await this.departamentoRepository.save(departamento);

    // Retornar el departamento
    
    return this.findAll();

    
   } catch (error) {
      this.handleDBExceptions(error);
   }

  }


  findAll() {
    return this.departamentoRepository.find({
      order: {
        nombre: 'ASC',
      }
    })
  }

  async findOne(term: string) {
    
    let departamento: Departamento;

    if ( isUUID(term)) {
      departamento = await this.departamentoRepository.findOneBy( { id: term});
    }else{
      
      const queryBuilder = this.departamentoRepository.createQueryBuilder();
      departamento = await queryBuilder
        .where('nombre =:nombre', {
          nombre: term.toLocaleLowerCase(),
        }).getOne();

      //departamento = await this.departamentoRepository.findOneBy( { nombre: term});
    }
    
      
    if ( !departamento ){
      throw new NotFoundException(`El departamento "${ term }" no fue encontrado`);
    }

    return departamento

  }
  

  async update(id: string, updateDepartamentoDto: UpdateDepartamentoDto) {

    const departamento = await this.departamentoRepository.preload({
      id: id,
      ...updateDepartamentoDto
    })

    if ( !departamento) throw new NotFoundException(`El departamento con id ${ id } no fue encontrado`);

    try {
      
      await this.departamentoRepository.save( departamento);
      return departamento

    } catch (error) {
      this.handleDBExceptions(error);
    }
    
  }

  async remove(id: string) {
    const departamento = await this.findOne(id);
  
    try {
      await this.departamentoRepository.remove(departamento);
      return this.findAll();
    } catch (error) {
      // Verificamos si el error es una violación de clave foránea
      if (
        error instanceof QueryFailedError &&
        error.message.includes('violates foreign key constraint')
      ) {
        throw new BadRequestException('No se puede eliminar este departamento porque se encuentra asignado a usuarios');
      }
      // Si no es un error manejado, lo lanzamos nuevamente
      throw error;
    }
  }


  async details(id: string) {
    const supervisor = await this.userRepositoy.findOne({
        where: {
            departamento: { id },
            rol: 'supervisor',
        },
    });


    const totalUsuarios = await this.userRepositoy.count({
      where: {
          departamento: { id },
      },
  });

    if (!supervisor) {
        
       return {
        id: null,
        totalUsuarios,
       }
    }


    return {
        id: supervisor.id,
        nombres: supervisor.nombres,
        apellidos: supervisor.apellidos,
        email: supervisor.email,
        totalUsuarios,
    };
}

  

  private handleDBExceptions( error: any){
    if ( error.code === '23505' )
      throw new BadRequestException('Ya existe un departamento con ese nombre.');
  
    this.logger.error(error);
    // console.log(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
