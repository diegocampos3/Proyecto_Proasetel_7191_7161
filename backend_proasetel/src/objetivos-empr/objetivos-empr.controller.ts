import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ObjetivosEmprService } from './objetivos-empr.service';
import { CreateObjetivosEmprDto } from './dto/create-objetivos-empr.dto';
import { UpdateObjetivosEmprDto } from './dto/update-objetivos-empr.dto';
<<<<<<< HEAD
=======
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
>>>>>>> 6f494fd4d20514cbe27f6bcbd702a180a733d7dc

@Controller('objetivos-empr')
export class ObjetivosEmprController {
  constructor(private readonly objetivosEmprService: ObjetivosEmprService) {}

  @Post()
<<<<<<< HEAD
=======
  @Auth(ValidRoles.admin)
>>>>>>> 6f494fd4d20514cbe27f6bcbd702a180a733d7dc
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
<<<<<<< HEAD
=======
  @Auth(ValidRoles.admin)
>>>>>>> 6f494fd4d20514cbe27f6bcbd702a180a733d7dc
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateObjetivosEmprDto: UpdateObjetivosEmprDto
  ) {
    return this.objetivosEmprService.update(id, updateObjetivosEmprDto);
  }

  @Delete(':id')
<<<<<<< HEAD
=======
  @Auth(ValidRoles.admin)
>>>>>>> 6f494fd4d20514cbe27f6bcbd702a180a733d7dc
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.objetivosEmprService.remove(id);
  }
}
