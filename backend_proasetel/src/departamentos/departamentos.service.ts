import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateDepartamentoDto } from './dto/create-departamento.dto';
import { UpdateDepartamentoDto } from './dto/update-departamento.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid'
import { Departamento } from 'src/data-access/entities/departamento.entity';

@Injectable()
export class DepartamentosService {
  
  //Logger para mostrar los errores en consola de una forma más pecisa
  private readonly logger = new Logger('DepartamentosServices');

  // Patrón repositorio
  constructor (
    @InjectRepository(Departamento)
    private readonly departamentoRepository: Repository<Departamento>
  
  ){}

  async create(createDepartamentoDto: CreateDepartamentoDto) {
    
  try {

    // Creación de instancia del departamento con sus propiedades
    const departamento = this.departamentoRepository.create(createDepartamentoDto);
    
    // Grabar e impactar ne la base de datos
    await this.departamentoRepository.save(departamento);

    // Retornar el departamento
    
    return departamento;

    
   } catch (error) {
      this.handleDBExceptions(error);
   }

  }

  // TODO: paginar
  findAll() {
    return this.departamentoRepository.find({})
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

    // Prepara para la actualizaci'on
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
    const departamento = await this.findOne( id );
    await this.departamentoRepository.remove( departamento );
  }

  private handleDBExceptions( error: any){
    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);
  
    this.logger.error(error);
    // console.log(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
