import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'

import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { Departamento } from 'src/data-access/entities/departamento.entity';
import { User } from 'src/data-access/entities/usuario.entity';


@Injectable()
export class AuthService {
  

  private readonly logger = new Logger('DepartamentosServices');

  // Injección del repositorio

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Departamento)
    private readonly departamentoRepository: Repository<Departamento>,

    private readonly jwtService: JwtService,
  ){}
  
  
 async  create(createUserDto: CreateUserDto) {
  
    
    try {
      
      const { password, departamento: nombreDepartamento, ...userData } = createUserDto;

      // Buscar el departamento por el nombre 

      const departamento =  await this.departamentoRepository.findOne({
        where: { nombre: nombreDepartamento.toLocaleLowerCase()},
      })

      if ( !departamento )
        throw new BadRequestException(`El departamento ${nombreDepartamento} no existe`);
      



      // Preparar para la inserción
      const user = this.userRepository.create( {
        ...userData,
        password: bcrypt.hashSync( password, 10),
        departamento
      });

      await this.userRepository.save(user);

      delete user.password;

      return {
        ...user,
        token: this.getJwtToken( {id: user.id })
      }

    } catch (error) {

      this.handleDBErrors(error);
    }

  }

  async login(loginUserDto: LoginUserDto) {

    const { password, email} = loginUserDto;

    const user = await this.userRepository.findOne({ 
      where: { email},
      select: { email: true, password: true, id: true}
    });

    if (!user)
      throw new UnauthorizedException('Las credenciales no son válidas (email)');

    if ( !bcrypt.compareSync( password, user.password))
      throw new UnauthorizedException('Las credenciales no son válidad (password)');

    return {
      ...user,
      token: this.getJwtToken( {id: user.id })
    }

  }

  // // Actualización de usuario 

  // async update(id: string, updateUserDto: UpdateUserDto) {
  //   const { departamento: departamentoNombre, ...restoDatos } = updateUserDto;
  
  //   let departamento: Departamento | undefined = undefined;
  
  //   if (departamentoNombre) {
  //     // Busca el departamento por nombre o ID
  //     departamento = await this.departamentoRepository.findOne({
  //       where: { nombre: departamentoNombre.toLowerCase() },
  //     });
  
  //     if (!departamento) {
  //       throw new NotFoundException(`El departamento ${departamentoNombre} no fue encontrado`);
  //     }
  //   }
  
  //   // Prepara los datos para la actualización
  //   const user = await this.userRepository.preload({
  //     id: id,
  //     ...restoDatos,
  //     departamento, // Asigna el objeto completo del departamento
  //   });
  
  //   if (!user) {
  //     throw new NotFoundException(`El usuario con id ${id} no fue encontrado`);
  //   }
  
  //   try {
      
  //     const savedUser = await this.userRepository.save(user);
  //     // Retorna el usuario con su departamento cargado
  //     return this.userRepository.findOne({
  //       where: { id: savedUser.id },
  //       relations: ['departamento'], // Asegura que la relación está cargada
  //     });
      
  //   } catch (error) {
  //     this.handleDBErrors(error);
  //   }
  // }



   //nueva actualizacion de usuario para permitir a los supervisores tambien asignar rol de empleado
   async update(id: string, updateUserDto: UpdateUserDto, currentUser: User) {
    const { departamento: departamentoNombre, rol, ...restoDatos } = updateUserDto;
  
    let departamento: Departamento | undefined = undefined;
  
    if (departamentoNombre) {
      departamento = await this.departamentoRepository.findOne({
        where: { nombre: departamentoNombre.toLowerCase() },
      });
  
      if (!departamento) {
        throw new NotFoundException(`El departamento ${departamentoNombre} no fue encontrado`);
      }
    }
  
    const userToUpdate = await this.userRepository.findOne({ where: { id } });
  
    if (!userToUpdate) {
      throw new NotFoundException(`El usuario con id ${id} no fue encontrado`);
    }
  
    // Restricciones específicas para supervisores
    if (currentUser.rol === 'supervisor') {
      // No puede actualizar usuarios con rol admin o supervisor
      if (['admin', 'supervisor'].includes(userToUpdate.rol)) {
        throw new ForbiddenException('Supervisores no pueden modificar usuarios con rol admin o supervisor');
      }
  
      // No puede asignar el rol admin o supervisor
      if (rol && ['admin', 'supervisor'].includes(rol)) {
        throw new ForbiddenException('Supervisores no pueden asignar roles admin o supervisor');
      }
    }
  
    try {
      const updatedUser = await this.userRepository.save({
        ...userToUpdate,
        ...restoDatos,
        rol, // Si el rol no es prohibido, se asigna
        departamento,
      });
  
      return this.userRepository.findOne({
        where: { id: updatedUser.id },
        relations: ['departamento'],
      });
    } catch (error) {
      this.handleDBErrors(error);
    }
  }
  

  private getJwtToken( payload: JwtPayload ){
    
    const token = this.jwtService.sign( payload );

    return token;
  }


  private handleDBErrors( error: any ):  never{
    
    if ( error.code === '23505')
      throw new BadRequestException( error.detail);

    console.log(error)
   
    throw new InternalServerErrorException('Please check server logs');
  }

  
}
