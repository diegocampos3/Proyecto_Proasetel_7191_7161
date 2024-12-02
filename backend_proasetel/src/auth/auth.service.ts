import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'

import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/usuario.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { Departamento } from '../departamentos/entities/departamento.entity';


@Injectable()
export class AuthService {
  
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
