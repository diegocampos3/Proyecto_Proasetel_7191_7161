import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ObjetivosEmprService } from './objetivos-empr.service';
import { CreateObjetivosEmprDto } from './dto/create-objetivos-empr.dto';
import { UpdateObjetivosEmprDto } from './dto/update-objetivos-empr.dto';

@Controller('objetivos-empr')
export class ObjetivosEmprController {
  constructor(private readonly objetivosEmprService: ObjetivosEmprService) {}

  @Post()
  create(@Body() createObjetivosEmprDto: CreateObjetivosEmprDto) {
    return this.objetivosEmprService.create(createObjetivosEmprDto);
  }

  @Get()
  findAll() {
    return this.objetivosEmprService.findAll();
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.objetivosEmprService.findOne(term);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateObjetivosEmprDto: UpdateObjetivosEmprDto
  ) {
    return this.objetivosEmprService.update(id, updateObjetivosEmprDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.objetivosEmprService.remove(id);
  }
}
