import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PeriodoEvaluacionService } from './periodo-evaluacion.service';
import { CreatePeriodoEvaluacionDto } from './dto/create-periodo-evaluacion.dto';
import { UpdatePeriodoEvaluacionDto } from './dto/update-periodo-evaluacion.dto';

@Controller('periodoEvaluacion')
export class PeriodoEvaluacionController {
  constructor(private readonly periodoEvaluacionService: PeriodoEvaluacionService) {}

  @Post()
  create(@Body() createPeriodoEvaluacionDto: CreatePeriodoEvaluacionDto) {
    return this.periodoEvaluacionService.create(createPeriodoEvaluacionDto);
  }

  @Get()
  findAll() {
    return this.periodoEvaluacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.periodoEvaluacionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePeriodoEvaluacionDto: UpdatePeriodoEvaluacionDto) {
    return this.periodoEvaluacionService.update(+id, updatePeriodoEvaluacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.periodoEvaluacionService.remove(+id);
  }
}
