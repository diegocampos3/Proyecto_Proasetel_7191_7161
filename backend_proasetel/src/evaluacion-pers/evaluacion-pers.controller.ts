// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { EvaluacionPersService } from './evaluacion-pers.service';
// import { CreateEvaluacionPerDto } from './dto/create-evaluacion-per.dto';
// import { UpdateEvaluacionPerDto } from './dto/update-evaluacion-per.dto';
// import { User } from 'src/data-access/entities/usuario.entity';
// import { Auth, GetUser } from 'src/auth/decorators';
// import { ValidRoles } from 'src/auth/interfaces';
// @Controller('evaluacion-pers')
// export class EvaluacionPersController {
//   constructor(private readonly evaluacionPersService: EvaluacionPersService) {}

//   @Post()
//   @Auth( ValidRoles.empleado, ValidRoles.admin,ValidRoles.supervisor)
//   create(
//     @Body() createEvaluacionPerDto: CreateEvaluacionPerDto,
//     @GetUser() user: User,
// ) {
//     return this.evaluacionPersService.create(createEvaluacionPerDto, user);
//   }

//   @Get()
//   findAll() {
//     return this.evaluacionPersService.findAll();
//   }
 
//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.evaluacionPersService.findOne(id);
//   }

//   @Patch(':id')
//   @Auth( ValidRoles.empleado, ValidRoles.admin,ValidRoles.supervisor)
//   update(
//     @Param('id') id: string,
//     @Body() updateEvaluacionPerDto: UpdateEvaluacionPerDto,
//     @GetUser() user: User,
//   ) {
//     return this.evaluacionPersService.update(id, updateEvaluacionPerDto,user);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.evaluacionPersService.remove(id);
//   }
// }