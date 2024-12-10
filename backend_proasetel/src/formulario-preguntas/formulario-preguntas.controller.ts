import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FormularioPreguntasService } from './formulario-preguntas.service';
import { CreateFormularioPreguntaDto } from './dto/create-formulario-pregunta.dto';
import { UpdateFormularioPreguntaDto } from './dto/update-formulario-pregunta.dto';

@Controller('formulario-preguntas')
export class FormularioPreguntasController {
  constructor(private readonly formularioPreguntasService: FormularioPreguntasService) {}

  @Post()
  create(@Body() createFormularioPreguntaDto: CreateFormularioPreguntaDto) {
    return this.formularioPreguntasService.create(createFormularioPreguntaDto);
  }

  @Get()
  findAll() {
    return this.formularioPreguntasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.formularioPreguntasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFormularioPreguntaDto: UpdateFormularioPreguntaDto) {
    return this.formularioPreguntasService.update(+id, updateFormularioPreguntaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.formularioPreguntasService.remove(+id);
  }
}
