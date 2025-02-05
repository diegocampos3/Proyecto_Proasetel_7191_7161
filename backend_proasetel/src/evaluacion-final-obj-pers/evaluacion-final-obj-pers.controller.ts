import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { EvaluacionFinalObjPersService } from './evaluacion-final-obj-pers.service';
import { CreateEvaluacionFinalObjPersDto } from './dto/create-evaluacion-final-obj-pers.dto';
import { UpdateEvaluacionFinalObjPersDto } from './dto/update-evaluacion-final-obj-pers.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('evaluacion-final-obj-pers')
export class EvaluacionFinalObjPersController {
  constructor(private readonly evaluacionFinalObjPersService: EvaluacionFinalObjPersService) {}

  @Post()
  // @Auth(ValidRoles.admin, ValidRoles.supervisor)
  create(@Body() createEvaluacionFinalObjPersDto: CreateEvaluacionFinalObjPersDto) {
    return this.evaluacionFinalObjPersService.create(createEvaluacionFinalObjPersDto);
  }

  @Get()
  findAll() {
    return this.evaluacionFinalObjPersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.evaluacionFinalObjPersService.findOne(id);
  }

  @Patch(':id')
  // @Auth(ValidRoles.admin, ValidRoles.supervisor)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateEvaluacionFinalObjPersDto: UpdateEvaluacionFinalObjPersDto) {
    return this.evaluacionFinalObjPersService.update(id, updateEvaluacionFinalObjPersDto);
  }

  @Delete(':id')
  // @Auth(ValidRoles.admin, ValidRoles.supervisor)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.evaluacionFinalObjPersService.remove(id);
  }
}