import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ObjetivosPersService } from './objetivos-pers.service';
import { CreateObjetivosPerDto } from './dto/create-objetivos-per.dto';
import { UpdateObjetivosPerDto } from './dto/update-objetivos-per.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('objetivosPers')
export class ObjetivosPersController {
  constructor(private readonly objetivosPersService: ObjetivosPersService) {}

  @Post()
  @Auth(ValidRoles.supervisor, ValidRoles.empleado)
  create(@Body() createObjetivosPerDto: CreateObjetivosPerDto) {
    return this.objetivosPersService.create(createObjetivosPerDto);
  }

  @Get()
  findAll() {
    return this.objetivosPersService.findAll();
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
  @Auth(ValidRoles.supervisor)
  remove(@Param('id') id: string) {
    return this.objetivosPersService.remove(id);
  }
}
