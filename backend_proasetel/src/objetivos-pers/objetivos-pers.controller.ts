import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ObjetivosPersService } from './objetivos-pers.service';
import { CreateObjetivosPerDto } from './dto/create-objetivos-per.dto';
import { UpdateObjetivosPerDto } from './dto/update-objetivos-per.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/data-access/entities/usuario.entity';

@Controller('objetivosPers')
export class ObjetivosPersController {
  constructor(private readonly objetivosPersService: ObjetivosPersService) {}

  @Post()
  @Auth(ValidRoles.supervisor, ValidRoles.empleado, ValidRoles.admin)
  create(
    @Body() createObjetivosPerDto: CreateObjetivosPerDto,
    @GetUser() user: User
  
  ) {
    return this.objetivosPersService.create(createObjetivosPerDto, user);
  }

  @Get()
  @Auth(ValidRoles.supervisor, ValidRoles.empleado, ValidRoles.admin)
  findAll(
    @GetUser() user: User
  ) {
    return this.objetivosPersService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.objetivosPersService.findOne(id);
  }

  @Auth(ValidRoles.supervisor, ValidRoles.empleado)
  @Auth(ValidRoles.supervisor)
  update(@Param('id') id: string, @Body() updateObjetivosPerDto: UpdateObjetivosPerDto) {
    return this.objetivosPersService.update(id, updateObjetivosPerDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.supervisor, ValidRoles.admin, ValidRoles.empleado)
  remove(
    @Param('id') id: string,
    @GetUser() user: User
  ) {
    return this.objetivosPersService.remove(id, user);
  }
}
