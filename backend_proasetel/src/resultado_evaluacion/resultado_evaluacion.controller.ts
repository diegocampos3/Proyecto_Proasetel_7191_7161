import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ResultadoEvaluacionService } from './resultado_evaluacion.service';
import { CreateResultadoEvaluacionDto } from './dto/create-resultado_evaluacion.dto';
import { UpdateResultadoEvaluacionDto } from './dto/update-resultado_evaluacion.dto';

@Controller('resultado-evaluacion')
export class ResultadoEvaluacionController {
  constructor(private readonly resultadoEvaluacionService: ResultadoEvaluacionService) {}

  @Post()
  create(@Body() createResultadoEvaluacionDto: CreateResultadoEvaluacionDto) {
    return this.resultadoEvaluacionService.create(createResultadoEvaluacionDto);
  }

  @Get()
  findAll() {
    return this.resultadoEvaluacionService.findAll();
  }

  @Get('result/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.resultadoEvaluacionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateResultadoEvaluacionDto: UpdateResultadoEvaluacionDto) {
    return this.resultadoEvaluacionService.update(id, updateResultadoEvaluacionDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.resultadoEvaluacionService.remove(id);
  }

  @Get('promedio-avance')
  getPromedioAvance() {
     return this.resultadoEvaluacionService.getPromedioAvance();
  }

  @Get('promedio-avance-objemp')
  getPromedioAvanceObjEmp() {
     return this.resultadoEvaluacionService.getPromedioAvanceObjEmpr();
  }


  @Get('promedio-avance-dep')
  getPromedioAvanceDep() {
     return this.resultadoEvaluacionService.getAvancePorDepartamento();
  }

  @Get('promedio-avance-emprDep/:id')
  getPromedioAvanceObjEmprDep(@Param('id') idDepartamento: string) {
    return this.resultadoEvaluacionService.getAvancePorObjEmpDepartamento(idDepartamento);
  }

  @Get('promedio-avance-emprDepUser/:id')
  getPromedioAvanceObjEmprDepUser(@Param('id') idDepartamento: string) {
    return this.resultadoEvaluacionService.getAvancePorDepartamentoUser(idDepartamento);
  }

  @Get('promedio-avance-user/:id')
  getAvanceUser(@Param('id') idUser: string) {
    return this.resultadoEvaluacionService.getAvancePorUsuario(idUser);
  }

  @Get('totalObjEmpr')
  getTotalObjEmpr() {
    return this.resultadoEvaluacionService.getTotalObjetivos();
  }


  @Get('totalObjEmprDep/:id')
  getTotalObjEmprDep(@Param('id') id:string) {
    return this.resultadoEvaluacionService.getTotalObjetivosPorDepartamento(id);
  }


  @Get('totalObjUser/:id')
  getTotalObjUser(@Param('id') id:string) {
    return this.resultadoEvaluacionService.getTotalObjetivosPorUsuario(id);
  }
  
}