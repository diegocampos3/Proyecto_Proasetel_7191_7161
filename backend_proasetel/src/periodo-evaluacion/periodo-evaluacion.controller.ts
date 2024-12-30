import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PeriodoEvaluacionService } from './periodo-evaluacion.service';
import { CreatePeriodoEvaluacionDto } from './dto/create-periodo-evaluacion.dto';
import { UpdatePeriodoEvaluacionDto } from './dto/update-periodo-evaluacion.dto';
import { User } from 'src/data-access/entities/usuario.entity';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('periodoEva')
export class PeriodoEvaluacionController {
  constructor(private readonly periodoEvaluacionService: PeriodoEvaluacionService) {}

  @Post()
  @Auth(ValidRoles.admin, ValidRoles.supervisor)
  create(
    @Body() createPeriodoEvaluacionDto: CreatePeriodoEvaluacionDto,
    @GetUser() user: User,
 ) {
    return this.periodoEvaluacionService.create(createPeriodoEvaluacionDto, user);
  }

  @Get()
  findAll() {
    return this.periodoEvaluacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.periodoEvaluacionService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin, ValidRoles.supervisor)
  update(@Param('id') id: string, 
    @Body() updatePeriodoEvaluacionDto: UpdatePeriodoEvaluacionDto,
    @GetUser() user: User
  ) {
    return this.periodoEvaluacionService.update(id, updatePeriodoEvaluacionDto, user);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin, ValidRoles.supervisor)
  remove(@Param('id') id: string) {
    return this.periodoEvaluacionService.remove(id);
  }
}
