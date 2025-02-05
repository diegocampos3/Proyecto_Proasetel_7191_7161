import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ResultadoEvaluacionService } from './resultado_evaluacion.service';
import { CreateResultadoEvaluacionDto } from './dto/create-resultado_evaluacion.dto';
import { UpdateResultadoEvaluacionDto } from './dto/update-resultado_evaluacion.dto';

@Controller('resultado-evaluacion')
export class ResultadoEvaluacionController {
  constructor(private readonly resultadoEvaluacionService: ResultadoEvaluacionService) {}

  @Post()
  create(@Body() createResultadoEvaluacionDto: CreateResultadoEvaluacionDto) {
    return this.resultadoEvaluacionService.create(createResultadoEvaluacionDto);
  }

  @Get()
  findAll() {
    return this.resultadoEvaluacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.resultadoEvaluacionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateResultadoEvaluacionDto: UpdateResultadoEvaluacionDto) {
    return this.resultadoEvaluacionService.update(id, updateResultadoEvaluacionDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.resultadoEvaluacionService.remove(id);
  }
}