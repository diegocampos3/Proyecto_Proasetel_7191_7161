import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { FormularioService } from './formulario.service';
import { CreateFormularioDto } from './dto/create-formulario.dto';
import { UpdateFormularioDto } from './dto/update-formulario.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('formulario')
export class FormularioController {
  constructor(private readonly formularioService: FormularioService) {}

  @Post()
  @Auth(ValidRoles.admin)
  create(@Body() createFormularioDto: CreateFormularioDto) {
    return this.formularioService.create(createFormularioDto);
  }

  @Get()
  findAll() {
    return this.formularioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.formularioService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateFormularioDto: UpdateFormularioDto) {
    return this.formularioService.update(id, updateFormularioDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.formularioService.remove(id);
  }
}
