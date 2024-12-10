import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AnalisisSentimientosService } from './analisis-sentimientos.service';
import { CreateAnalisisSentimientoDto } from './dto/create-analisis-sentimiento.dto';
import { UpdateAnalisisSentimientoDto } from './dto/update-analisis-sentimiento.dto';

@Controller('analisis-sentimientos')
export class AnalisisSentimientosController {
  constructor(private readonly analisisSentimientosService: AnalisisSentimientosService) {}

  @Post()
  create(@Body() createAnalisisSentimientoDto: CreateAnalisisSentimientoDto) {
    return this.analisisSentimientosService.create(createAnalisisSentimientoDto);
  }

  @Get()
  findAll() {
    return this.analisisSentimientosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.analisisSentimientosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAnalisisSentimientoDto: UpdateAnalisisSentimientoDto) {
    return this.analisisSentimientosService.update(+id, updateAnalisisSentimientoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.analisisSentimientosService.remove(+id);
  }
}
