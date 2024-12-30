import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'

import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { Departamento } from 'src/data-access/entities/departamento.entity';
import { User } from 'src/data-access/entities/usuario.entity';
import { isUUID } from 'class-validator';
import { MailsService } from 'src/mails/mails.service';
import { SendMail } from './dto/send-mail.dto';
import { RequestResetPasswordDto } from './dto/request-reset-passwod.dto';
import { v4 as uuidv4 } from 'uuid';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { addMinutes } from 'date-fns';


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

    private readonly mailService: MailsService
  ){}
  
  
 async  create(createUserDto: CreateUserDto) {
  
    
      const { password, departamento: nombreDepartamento, ...userData } = createUserDto;

      // Buscar el departamento por el nombre 

      const departamento =  await this.departamentoRepository.findOne({
        where: { nombre: nombreDepartamento.toLocaleLowerCase()},
      })

      if ( !departamento )
        throw new BadRequestException(`El departamento ${nombreDepartamento} no existe`);
      

    try{

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
      throw new UnauthorizedException('No se ha podido encontrar una cuenta con ese correo');

    if ( !bcrypt.compareSync( password, user.password))
      throw new UnauthorizedException('Su correo o contraseña no es correcto');

    return {
      ...user,
      token: this.getJwtToken( {id: user.id })
    }

  }

  // Actualización de usuario 
  async update(id: string, updateUserDto: UpdateUserDto) {
    const { departamento: departamentoNombre, ...restoDatos } = updateUserDto;
  
    let departamento: Departamento | undefined = undefined;
  
    if (departamentoNombre) {
      // Busca el departamento por nombre o ID
      departamento = await this.departamentoRepository.findOne({
        where: { nombre: departamentoNombre.toLowerCase() },
      });
  
      if (!departamento) {
        throw new NotFoundException(`El departamento ${departamentoNombre} no fue encontrado`);
      }
    }
  
    // Prepara los datos para la actualización
    const user = await this.userRepository.preload({
      id: id,
      ...restoDatos,
      departamento, // Asigna el objeto completo del departamento
    });
  
    if (!user) {
      throw new NotFoundException(`El usuario con id ${id} no fue encontrado`);
    }
  
    try {
      const savedUser = await this.userRepository.save(user);
      // Retorna el usuario con su departamento cargado
      return this.userRepository.findOne({
        where: { id: savedUser.id },
        relations: ['departamento'], // Asegura que la relación está cargada
      });
    } catch (error) {
      this.handleDBErrors(error);
    }
  }
  
  


  //nueva actualizacion de usuario para permitir a los supervisores tambien asignar rol de empleado
  // async update(id: string, updateUserDto: UpdateUserDto, currentUser: User) {
  //   const { departamento: departamentoNombre, rol, ...restoDatos } = updateUserDto;
  
  //   let departamento: Departamento | undefined = undefined;
  
  //   if (departamentoNombre) {
  //     departamento = await this.departamentoRepository.findOne({
  //       where: { nombre: departamentoNombre.toLowerCase() },
  //     });
  
  //     if (!departamento) {
  //       throw new NotFoundException(`El departamento ${departamentoNombre} no fue encontrado`);
  //     }
  //   }
  
  //   const userToUpdate = await this.userRepository.findOne({ where: { id } });
  
  //   if (!userToUpdate) {
  //     throw new NotFoundException(`El usuario con id ${id} no fue encontrado`);
  //   }
  
  //   // Restricciones específicas para supervisores
  //   if (currentUser.rol === 'supervisor') {
  //     // No puede actualizar usuarios con rol admin o supervisor
  //     if (['admin', 'supervisor'].includes(userToUpdate.rol)) {
  //       throw new ForbiddenException('Supervisores no pueden modificar usuarios con rol admin o supervisor');
  //     }
  
  //     // No puede asignar el rol admin o supervisor
  //     if (rol && ['admin', 'supervisor'].includes(rol)) {
  //       throw new ForbiddenException('Supervisores no pueden asignar roles admin o supervisor');
  //     }
  //   }
  
  //   try {
  //     const updatedUser = await this.userRepository.save({
  //       ...userToUpdate,
  //       ...restoDatos,
  //       rol, // Si el rol no es prohibido, se asigna
  //       departamento,
  //     });
  
  //     return this.userRepository.findOne({
  //       where: { id: updatedUser.id },
  //       relations: ['departamento'],
  //     });
  //   } catch (error) {
  //     this.handleDBErrors(error);
  //   }
  // }

  async findOne(term: string) {

    let user: User;
  
    if (isUUID(term)) {
      user = await this.userRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.userRepository.createQueryBuilder();
      user = await queryBuilder
        .where('email = :email', 
        { email: term.toLowerCase() 

        }).getOne();
    }

    if(!user)
      throw new NotFoundException(`El correo ${term} no se encuentra registrado`);
  
    return user;
  }



   async requestResetPasswordDto(requestResetPasswordDto: RequestResetPasswordDto) {
    
    const { email } = requestResetPasswordDto;
    const user = await this.userRepository.findOne({ where: { email: email.toLowerCase() } });
  
    
    if (!user) {
      throw new NotFoundException(`El correo ${email} no se encuentra registrado`);
    }
  
    const resetToken = uuidv4();

    const expirationTime = addMinutes(new Date(), 10)
  
    const updatedUser = await this.userRepository.preload({
      id: user.id,
      resetPasswordToken: resetToken,
      resetPasswordTokenExpiration: expirationTime,
    });
  
    if (!updatedUser) {
      throw new NotFoundException(`El usuario con id ${user.id} no fue encontrado`);
    }

    try {
      const savedUser = await this.userRepository.save(updatedUser);
      const firstName = savedUser.nombres.split(' ')[0]; 
      const lastName = savedUser.apellidos.split(' ')[0]; 
      const fullName = `${firstName.charAt(0).toUpperCase() + firstName.slice(1)} ${lastName.charAt(0).toUpperCase() + lastName.slice(1)}`;
      await this.mailService.sendCodeConfirmation(fullName, savedUser.email,savedUser.resetPasswordToken);
      return {message: "email enviado"};

    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto){
     
    const { resetPasswordToken, password} = resetPasswordDto;

    const user: User = await this.userRepository.findOne({ where: { resetPasswordToken } });

    if(!user)
      throw new NotFoundException(`El usuario no fue encontrado`)

    
    // Verificar si el token a expirado
    if (new Date() > user.resetPasswordTokenExpiration) {
      throw new BadRequestException('Su tiempo de restablecimiento ha expirado');
    }

    // Actualizar la constraseña
    user.password = bcrypt.hashSync( password, 1)
    user.resetPasswordToken = null;
    user.resetPasswordTokenExpiration = null;
    try {

      this.userRepository.save(user);
      
      return ({
        fechaActual: new Date(),
        fechaExpitacion: user.resetPasswordTokenExpiration

      })
    } catch (error) {

      this.handleDBErrors(error)
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
