import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { FormularioPreguntasService } from './formulario-preguntas.service';
import { CreateFormularioPreguntaDto } from './dto/create-formulario-pregunta.dto';
import { UpdateFormularioPreguntaDto } from './dto/update-formulario-pregunta.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('formulario-preguntas')
export class FormularioPreguntasController {
  constructor(private readonly formularioPreguntasService: FormularioPreguntasService) {}

  @Post()
  @Auth(ValidRoles.admin, ValidRoles.supervisor)
  create(@Body() createFormularioPreguntaDto: CreateFormularioPreguntaDto) {
    return this.formularioPreguntasService.create(createFormularioPreguntaDto);
  }

  @Get()
  findAll() {
    return this.formularioPreguntasService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.formularioPreguntasService.findOne(id);
  // }

  @Get(':idFormulario')
findAllByFormulario(@Param('idFormulario') idFormulario: string) {
    return this.formularioPreguntasService.findAllByFormulario(idFormulario);
    
}

  @Patch(':id')
  @Auth(ValidRoles.admin, ValidRoles.supervisor)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateFormularioPreguntaDto: UpdateFormularioPreguntaDto) {
    return this.formularioPreguntasService.update(id, updateFormularioPreguntaDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin, ValidRoles.supervisor)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.formularioPreguntasService.remove(id);
  }
}
