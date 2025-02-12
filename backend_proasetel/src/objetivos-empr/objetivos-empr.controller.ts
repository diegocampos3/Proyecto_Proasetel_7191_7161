import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ObjetivosEmprService } from './objetivos-empr.service';
import { CreateObjetivosEmprDto } from './dto/create-objetivos-empr.dto';
import { UpdateObjetivosEmprDto } from './dto/update-objetivos-empr.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('objetivos-empr')
export class ObjetivosEmprController {
  constructor(private readonly objetivosEmprService: ObjetivosEmprService) {}

  @Post()
  @Auth(ValidRoles.admin)
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
  @Auth(ValidRoles.admin, ValidRoles.supervisor)
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateObjetivosEmprDto: UpdateObjetivosEmprDto
  ) {
    return this.objetivosEmprService.update(id, updateObjetivosEmprDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.objetivosEmprService.remove(id);
  }
}
