import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EvaluacionPersService } from './evaluacion-pers.service';
import { CreateEvaluacionPerDto } from './dto/create-evaluacion-per.dto';
import { UpdateEvaluacionPerDto } from './dto/update-evaluacion-per.dto';

@Controller('evaluacionPers')
export class EvaluacionPersController {
  constructor(private readonly evaluacionPersService: EvaluacionPersService) {}

  @Post()
  create(@Body() createEvaluacionPerDto: CreateEvaluacionPerDto) {
    return this.evaluacionPersService.create(createEvaluacionPerDto);
  }

  @Get()
  findAll() {
    return this.evaluacionPersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.evaluacionPersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEvaluacionPerDto: UpdateEvaluacionPerDto) {
    return this.evaluacionPersService.update(+id, updateEvaluacionPerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.evaluacionPersService.remove(+id);
  }
}
