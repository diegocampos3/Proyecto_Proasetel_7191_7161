import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata, ParseUUIDPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { request } from 'http';
import { Auth, GetUser, RoleProtected } from './decorators';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { ValidRoles } from './interfaces';
import { User } from 'src/data-access/entities/usuario.entity';
import { SendMail } from './dto/send-mail.dto';
import { RequestResetPasswordDto } from './dto/request-reset-passwod.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';


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

  // Ruta para obtener los datos del usuario autenticado
  @Get('me')
  @UseGuards(AuthGuard('jwt')) // Asegura que la ruta está protegida
  getMyProfile(@GetUser() user: User) {
    
    return this.authService.myProfile(user)
  }

  @Get('supervisor/:id')
  getSupervisor(@Param('id') id: string){
    return this.authService.getSupervisor(id);
  }

  @Get(':term')
  findOne(@Param('term') term: string){
    return this.authService.findOne(term)
  }



  // @Patch(':id')
  // @Auth(ValidRoles.admin)
  // update(
  //   @Param('id', ParseUUIDPipe) id: string, 
  //   @Body() updateUserDto: UpdateUserDto
  // ) {
  //   return this.authService.update(id, updateUserDto);
  // }

  //nuevo para update
  
  @Patch('update-user/:id')
  //@Auth(ValidRoles.admin, ValidRoles.supervisor)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    //@GetUser() currentUser: User
  ) {
    return this.authService.update(id, updateUserDto);
  }


  @Patch('request-reset-password')
  requestResetPasswordDto(@Body() requestResetPasswordDto: RequestResetPasswordDto){
    return this.authService.requestResetPasswordDto(requestResetPasswordDto);
  }


  @Patch('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto){
    return this.authService.resetPassword(resetPasswordDto);
  }
  

  @Get()
  @Auth()
  findAll(
    @GetUser() user: User
  ) {
    return this.authService.findAll(user);
  }



  // Endpoint de prueba

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


}
