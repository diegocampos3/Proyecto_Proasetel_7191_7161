import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ObjetivosDepService } from './objetivos-dep.service';
import { CreateObjetivosDepDto } from './dto/create-objetivos-dep.dto';
import { UpdateObjetivosDepDto } from './dto/update-objetivos-dep.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { RemoveObjetivosDepDto } from './dto/remove-objectivos-dep.dto';

@Controller('objetivosDep')
export class ObjetivosDepController {
  constructor(private readonly objetivosDepService: ObjetivosDepService) {}

  @Post()
  @Auth(ValidRoles.supervisor, ValidRoles.admin)
  create(@Body() createObjetivosDepDto: CreateObjetivosDepDto) {
    return this.objetivosDepService.create(createObjetivosDepDto);
  }

  @Get(':id')
  findAll(@Param('id') id: string) {
    return this.objetivosDepService.findAll(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.objetivosDepService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.supervisor, ValidRoles.admin)
  update(@Param('id') id: string, @Body() updateObjetivosDepDto: UpdateObjetivosDepDto) {
    return this.objetivosDepService.update(id, updateObjetivosDepDto);
  }

  @Delete()
  @Auth(ValidRoles.supervisor, ValidRoles.admin)
  remove(@Body() removeObjetivosDepDto: RemoveObjetivosDepDto ) {
    return this.objetivosDepService.remove(removeObjetivosDepDto);
  }  
}
