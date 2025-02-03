import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { RespuestasPreguntasService } from './respuestas_preguntas.service';
import { CreateRespuestasPreguntaDto } from './dto/create-respuestas_pregunta.dto';
import { UpdateRespuestasPreguntaDto } from './dto/update-respuestas_pregunta.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('respuestas-preguntas')
export class RespuestasPreguntasController {
  constructor(private readonly respuestasPreguntasService: RespuestasPreguntasService) {}

  @Post()
  @Auth(ValidRoles.admin)
  create(@Body() createRespuestasPreguntaDto: CreateRespuestasPreguntaDto) {
    return this.respuestasPreguntasService.create(createRespuestasPreguntaDto);
  }

  @Get()
  findAll() {
    return this.respuestasPreguntasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.respuestasPreguntasService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateRespuestasPreguntaDto: UpdateRespuestasPreguntaDto) {
    return this.respuestasPreguntasService.update(id, updateRespuestasPreguntaDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.respuestasPreguntasService.remove(id);
  }
}
