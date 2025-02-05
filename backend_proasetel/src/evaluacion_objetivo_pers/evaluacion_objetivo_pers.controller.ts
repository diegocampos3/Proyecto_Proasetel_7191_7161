// import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
// import { EvaluacionObjetivoPersService } from './evaluacion_objetivo_pers.service';
// import { CreateEvaluacionObjetivoPerDto } from './dto/create-evaluacion_objetivo_per.dto';
// import { UpdateEvaluacionObjetivoPerDto } from './dto/update-evaluacion_objetivo_per.dto';

// @Controller('evaluacion-objetivo-pers')
// export class EvaluacionObjetivoPersController {
//   constructor(private readonly evaluacionObjetivoPersService: EvaluacionObjetivoPersService) {}

//   @Post()
//   create(@Body() createEvaluacionObjetivoPerDto: CreateEvaluacionObjetivoPerDto) {
//     return this.evaluacionObjetivoPersService.create(createEvaluacionObjetivoPerDto);
//   }

//   @Get()
//   findAll() {
//     return this.evaluacionObjetivoPersService.findAll();
//   }

//   @Get(':idEvaPer/:idObjPer')
//   async findOne(
//     @Param('idEvaPer') idEvaPer: string,
//     @Param('idObjPer') idObjPer: string,
//   ) {
//     return await this.evaluacionObjetivoPersService.findOne( idEvaPer, idObjPer);
//   }


//   @Patch(':idEvaPer/:idObjPer')
//   async update(
//     @Param('idEvaPer') idEvaPer: string,
//     @Param('idObjPer') idObjPer: string,
//     @Body() updateDto: UpdateEvaluacionObjetivoPerDto, // Usamos el DTO completo
//   ) {
  
//     // Pasamos los valores requeridos al servicio
//     return await this.evaluacionObjetivoPersService.update(
//       idEvaPer,
//       idObjPer,
//       updateDto.nivelLogro, // Solo enviamos nivelLogro al servicio
//     );
//   }
  
  

//   @Delete(':idEvaPer/:idObjPer')
//   async remove(
//     @Param('idEvaPer') idEvaPer: string,
//     @Param('idObjPer') idObjPer: string,
//   ) {
//     await this.evaluacionObjetivoPersService.remove(idEvaPer, idObjPer);
//   }
// }
