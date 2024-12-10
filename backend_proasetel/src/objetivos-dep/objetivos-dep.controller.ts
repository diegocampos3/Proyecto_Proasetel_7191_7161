import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ObjetivosDepService } from './objetivos-dep.service';
import { CreateObjetivosDepDto } from './dto/create-objetivos-dep.dto';
import { UpdateObjetivosDepDto } from './dto/update-objetivos-dep.dto';

@Controller('objetivosDep')
export class ObjetivosDepController {
  constructor(private readonly objetivosDepService: ObjetivosDepService) {}

  @Post()
  create(@Body() createObjetivosDepDto: CreateObjetivosDepDto) {
    return this.objetivosDepService.create(createObjetivosDepDto);
  }

  @Get()
  findAll() {
    return this.objetivosDepService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.objetivosDepService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateObjetivosDepDto: UpdateObjetivosDepDto) {
    return this.objetivosDepService.update(+id, updateObjetivosDepDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.objetivosDepService.remove(+id);
  }
}
