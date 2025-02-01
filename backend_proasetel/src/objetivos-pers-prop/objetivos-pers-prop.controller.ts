import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ObjetivosPersPropService } from './objetivos-pers-prop.service';
import { CreateObjetivosPersPropDto } from './dto/create-objetivos-pers-prop.dto';
import { UpdateObjetivosPersPropDto } from './dto/update-objetivos-pers-prop.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/data-access/entities/usuario.entity';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('objetivos-pers-prop')
export class ObjetivosPersPropController {
  constructor(
    private readonly objetivosPersPropService: ObjetivosPersPropService,

  ) {}

  @Post()
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  create(
    @Body() createObjetivosPersPropDto: CreateObjetivosPersPropDto,
    @GetUser() user: User
  
  ) {
    return this.objetivosPersPropService.create(createObjetivosPersPropDto, user);
  }

  @Get('/user')
  @Auth(ValidRoles.admin, ValidRoles.empleado)
  findAll(@GetUser() user: User) {
    return this.objetivosPersPropService.findAll(user);
  }

  @Get('department')
  @Auth(ValidRoles.admin, ValidRoles.empleado, ValidRoles.supervisor)
  findAllDepartment(@GetUser() user: User){
    return this.objetivosPersPropService.findAllDepartment(user)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.objetivosPersPropService.findOne(+id);
  }

  @Patch(':id')
  @Auth( ValidRoles.admin, ValidRoles.empleado, ValidRoles.supervisor)
  update(
    @Param('id') id: string, 
    @Body() updateObjetivosPersPropDto: UpdateObjetivosPersPropDto,
    @GetUser() user: User
  
  ) {
    return this.objetivosPersPropService.update(id, updateObjetivosPersPropDto, user);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin, ValidRoles.empleado, ValidRoles.supervisor)
  remove(
    @Param('id') id: string,
    @GetUser() user: User
  ) {
    return this.objetivosPersPropService.remove(id, user);
  }
}
