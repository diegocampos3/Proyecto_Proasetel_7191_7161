import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { request } from 'http';
import { User } from './entities/usuario.entity';
import { Auth, GetUser, RoleProtected } from './decorators';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { ValidRoles } from './interfaces';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }


  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }


  @Get('private')
  @UseGuards( AuthGuard())
  testingPrivateRoute(
    @GetUser(['email', 'rol', 'nombres']) user: User
  ) {

    return {
      ok: true,
      message: 'Hola Mundo',
      user
    }
  }

  // Casos de prueba de Autorización
    // @SetMetadata('rol', ['admin', 'supervisor', 'empleado'])

  // @Get('private2')
  // @RoleProtected( ValidRoles.admin, ValidRoles.supervisor)
  // @UseGuards( AuthGuard(), UserRoleGuard)
  // privateRoute2(
  //   @GetUser() user: User
  // ){
  //   return {
  //     ok: true,
  //     user
  //   }
  // }


  // @Get('private3')
  // @Auth( ValidRoles.admin) // Para proteger la ruta podemos solo utilizar el Auth
  // privateRoute3(
  //   @GetUser() user: User
  // ){
  //   return {
  //     ok: true,
  //     user
  //   }
  // }


}
