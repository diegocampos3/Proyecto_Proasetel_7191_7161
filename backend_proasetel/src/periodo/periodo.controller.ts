import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PeriodoService } from './periodo.service';
import { CreatePeriodoDto } from './dto/create-periodo.dto';
import { UpdatePeriodoDto } from './dto/update-periodo.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('periodo')
export class PeriodoController {
  constructor(private readonly periodoService: PeriodoService) {}

  @Post()
  @Auth(ValidRoles.admin)
  create(@Body() createPeriodoDto: CreatePeriodoDto) {
    return this.periodoService.create(createPeriodoDto);
  }

  @Get()
  findAll() {
    return this.periodoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.periodoService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(@Param('id') id: string, @Body() updatePeriodoDto: UpdatePeriodoDto) {
    return this.periodoService.update(id, updatePeriodoDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id') id: string) {
    return this.periodoService.remove(id);
  }
}
