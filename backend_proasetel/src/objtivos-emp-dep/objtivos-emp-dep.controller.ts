import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ObjtivosEmpDepService } from './objtivos-emp-dep.service';
import { CreateObjtivosEmpDepDto } from './dto/create-objtivos-emp-dep.dto';
import { UpdateObjtivosEmpDepDto } from './dto/update-objtivos-emp-dep.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/data-access/entities/usuario.entity';

@Controller('objtivos-emp-dep')
export class ObjtivosEmpDepController {
  constructor(private readonly objtivosEmpDepService: ObjtivosEmpDepService) {}

  @Post()
  @Auth(ValidRoles.admin, ValidRoles.supervisor)
  create
  (@Body() createObjtivosEmpDepDto: CreateObjtivosEmpDepDto,
  @GetUser() user: User
  ) {
    return this.objtivosEmpDepService.create(createObjtivosEmpDepDto, user);
  }

  @Get()
  findAll() {
    return this.objtivosEmpDepService.findAll();
  }

  @Get('dep')
  @Auth(ValidRoles.admin, ValidRoles.supervisor, ValidRoles.empleado) 
  findAllDep(@GetUser() user: User) { 
    return this.objtivosEmpDepService.findAllDep(user);
  }

  @Get('verificarObjEmp/:id')
  findOne(@Param('id') id: string) {
    return this.objtivosEmpDepService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateObjtivosEmpDepDto: UpdateObjtivosEmpDepDto) {
    return this.objtivosEmpDepService.update(+id, updateObjtivosEmpDepDto);
  }

  @Delete('businessObj/:id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.objtivosEmpDepService.removeObjSelect(id); 
  }
}
