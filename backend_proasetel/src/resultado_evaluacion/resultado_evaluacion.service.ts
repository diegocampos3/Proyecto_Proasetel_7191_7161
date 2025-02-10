import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateResultadoEvaluacionDto } from './dto/create-resultado_evaluacion.dto';
import { UpdateResultadoEvaluacionDto } from './dto/update-resultado_evaluacion.dto';
import { ResultadoEvaluacion } from '../data-access/entities/resultado_evaluacion.entity';
import { FormulariosPreg } from 'src/data-access/entities/formulario-pregunta.entity';
import { ObjetivosPers } from 'src/data-access/entities/objetivosPers.entity'; // Asegúrate de importar la entidad ObjetivosDep
import { ObjetivosPersProp } from 'src/data-access/entities/objetivos-pers-prop.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';



@Injectable()
export class ResultadoEvaluacionService {
  private readonly logger = new Logger('ResultadoEvaluacionService');

  constructor(
    @InjectRepository(ResultadoEvaluacion)
    private readonly resultadoEvaluacionRepository: Repository<ResultadoEvaluacion>,

    @InjectRepository(FormulariosPreg)
    private readonly formulariosPregRepository: Repository<FormulariosPreg>,

    @InjectRepository(ObjetivosPers)
    private readonly objetivosPersRepository: Repository<ObjetivosPers>,

    @InjectRepository(ObjetivosPersProp)
    private readonly objetivosPersPropRepository: Repository<ObjetivosPersProp>,

    

  ) {}

  async create(createResultadoEvaluacionDto: CreateResultadoEvaluacionDto) {
    try {

      // Buscar si el la pregunta existe
      const pregunta = await this.formulariosPregRepository.findOne({
        where: { idPregunta: createResultadoEvaluacionDto.idPregunta },
      });

      if (!pregunta) {
        throw new NotFoundException(`Pregunta con id ${createResultadoEvaluacionDto.idPregunta} no encontrado para la evaluación`);
      }

      // Buscar si el la objPer existe
      let objetivoPersonal = null;
      if(createResultadoEvaluacionDto.idObjPer !== null){
        objetivoPersonal = await this.objetivosPersRepository.findOne({
          where: { idObjPer: createResultadoEvaluacionDto.idObjPer },
        });

        if (!objetivoPersonal) {
          throw new NotFoundException(`Objetivo Personal con id ${createResultadoEvaluacionDto.idObjPer} no encontrado para la evaluación`);
        }
      }



      let objetivoPersonalPropuesto = null;
      // Buscar si el la objPerProp existe
      if(createResultadoEvaluacionDto.idObjPersProp !== null){
        objetivoPersonalPropuesto = await this.objetivosPersPropRepository.findOne({
          where: { id: createResultadoEvaluacionDto.idObjPersProp },
        });

        if (!objetivoPersonalPropuesto) {
          throw new NotFoundException(`Objetivo Personal Propuesto con id ${createResultadoEvaluacionDto.idObjPersProp} no encontrado para la evaluación`);
        }
      }

      // console.log('OBJETIVO PERSONAL', objetivoPersonal)
      // console.log('OBJETIVO PERSONAL PROPUESTO', objetivoPersonalPropuesto)
      // console.log('OBJETIVO PERSONAL PROPUESTO iiiiiiidddddddd', createResultadoEvaluacionDto.idObjPersProp)

      const resultadoEvaluacion = this.resultadoEvaluacionRepository.create({...createResultadoEvaluacionDto,pregunta, objetivoPersonal, objetivoPersonalPropuesto});
      await this.resultadoEvaluacionRepository.save(resultadoEvaluacion);
      return resultadoEvaluacion;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll() {
    const resultado = await this.resultadoEvaluacionRepository.find({
      relations:['objetivoPersonal', 'objetivoPersonalPropuesto', 'pregunta']
    });

    const result = resultado.map((obj) => {
      return{
        idResultadoEvaluacion: obj.idResultadoEvaluacion,
        idObjPer: obj.objetivoPersonal ? obj.objetivoPersonal.idObjPer : null,
        idObjPersProp: obj.objetivoPersonalPropuesto ? obj.objetivoPersonalPropuesto.id : null,
        idPregunta: obj.pregunta.idPregunta,
        puntaje_evaluado: obj.puntaje_evaluado,
        puntaje_supervisor: obj.puntaje_supervisor
      }
    });

    return result
  }

  async findOne(id: string) {
    if (!isUUID(id)) throw new BadRequestException(`${id} no es un UUID válido`);
    const resultadoEvaluacion = await this.resultadoEvaluacionRepository.findOne({ where: { idResultadoEvaluacion: id } });
    if (!resultadoEvaluacion) throw new NotFoundException(`Resultado de evaluación con id ${id} no encontrado`);
    return resultadoEvaluacion;
  }


  async getPromedioAvance() {
    try {
        // Obtener todos los resultados de evaluación con las relaciones necesarias
        const resultados = await this.resultadoEvaluacionRepository.find({
            relations: [
                'objetivoPersonal',
                'objetivoPersonal.user',  // Relación para obtener el usuario de objetivoPersonal
                'objetivoPersonalPropuesto',
                'objetivoPersonalPropuesto.user', // Si ObjetivosPersProp tiene relación con usuario
                'objetivoPersonal.objetivoDep',
                'objetivoPersonal.objetivoDep.objtivoEmpDep',
                'objetivoPersonalPropuesto.objtivoEmpDep',
                'objetivoPersonalPropuesto.objtivoEmpDep.departamento',
                'objetivoPersonalPropuesto.objtivoEmpDep.objetivoEmpr',
                'objetivoPersonal.objetivoDep.objtivoEmpDep.objetivoEmpr',
                'objetivoPersonal.objetivoDep.objtivoEmpDep.departamento',
                'pregunta',
                'pregunta.formulario',
                'pregunta.formulario.periodoEvaluacion',
                'pregunta.formulario.periodoEvaluacion.periodo'
            ]
        });

        const resultadosFinales = [];

        resultados.forEach(({ 
            objetivoPersonal, 
            objetivoPersonalPropuesto, 
            puntaje_evaluado, 
            puntaje_supervisor, 
            pregunta 
        }) => {
            // Si existe un objetivo personal o un objetivo propuesto
            const idObj = objetivoPersonal ? objetivoPersonal.idObjPer : objetivoPersonalPropuesto?.id;
            const nombreObj = objetivoPersonal ? objetivoPersonal?.objetivoDep?.titulo : objetivoPersonalPropuesto?.titulo || 'Desconocido';
            const objetivoEmp = objetivoPersonal?.objetivoDep?.objtivoEmpDep || objetivoPersonalPropuesto?.objtivoEmpDep;

            if (!objetivoEmp || !idObj) {
                return;
            }

            // Extraer el ID y nombre del usuario:
            const userId = objetivoPersonal
                ? objetivoPersonal.user?.id
                : objetivoPersonalPropuesto?.user?.id || 'Desconocido';
            
            const userName = objetivoPersonal
                ? objetivoPersonal.user?.nombres
                : objetivoPersonalPropuesto?.user?.nombres || 'Desconocido';

            const userApellido = objetivoPersonal
            ? objetivoPersonal.user?.apellidos
            : objetivoPersonalPropuesto?.user?.apellidos || 'Desconocido';

            // Extraer el id y título del periodo de evaluación, considerando que puede venir como arreglo
            const idPeriodo = Array.isArray(pregunta?.formulario?.periodoEvaluacion)
                ? pregunta.formulario.periodoEvaluacion[0]?.periodo?.idPeriodo
                : pregunta?.formulario?.periodoEvaluacion?.periodo?.idPeriodo || 'Desconocido';

            const nombrePeriodo = Array.isArray(pregunta?.formulario?.periodoEvaluacion)
                ? pregunta.formulario.periodoEvaluacion[0]?.periodo?.titulo 
                : pregunta?.formulario?.periodoEvaluacion?.periodo?.titulo || 'Desconocido';

            // Generar un objeto para cada evaluación, incluyendo el id y nombre del usuario y del objetivo
            resultadosFinales.push({
                idObj,
                nombreObj,
                idDepartamento: objetivoEmp.departamento?.id || 'Desconocido',
                nombreDepartamento: objetivoEmp.departamento?.nombre || 'Desconocido',
                idObjetivoEmpresarial: objetivoEmp.objetivoEmpr?.id || 'Desconocido',
                nombreObjetivoEmpresarial: objetivoEmp.objetivoEmpr?.titulo || 'Desconocido',
                idPeriodo,
                nombrePeriodo,
                puntaje_evaluado: puntaje_evaluado ?? 0,
                puntaje_supervisor: puntaje_supervisor ?? 0,
                userId,
                userName,
                userApellido
            });
        });

        return resultadosFinales;
    } catch (error) {
        this.logger.error('Error al calcular el promedio de avance de los objetivos empresariales', error);
        throw new InternalServerErrorException('Error al calcular el promedio de avance de los objetivos empresariales');
    }
}


async getTotalObjetivos(): Promise<{ totalObjetivosEmpresariales: number; totalObjetivosDepartamentales: number }> {
  const data = await this.getPromedioAvance();

  let objetivosEmpresariales = new Set<string>();
  let objetivosDepartamentales = new Set<string>();

  for (const item of data) {
    // Agregar al set para contar únicos
    if (item.idObjetivoEmpresarial) {
      objetivosEmpresariales.add(item.idObjetivoEmpresarial);
    }
    if (item.idObj) {
      objetivosDepartamentales.add(item.idObj);
    }
  }

  return {
    totalObjetivosEmpresariales: objetivosEmpresariales.size,
    totalObjetivosDepartamentales: objetivosDepartamentales.size,
  };
}


async getTotalObjetivosPorDepartamento(idDepartamento: string): Promise<{ totalObjetivosEmpresariales: number; totalObjetivosDepartamentales: number }> {
  const data = await this.getPromedioAvance();

  let objetivosEmpresariales = new Set<string>();
  let objetivosDepartamentales = new Set<string>();

  for (const item of data) {
    if (item.idDepartamento === idDepartamento) {
      // Agregar objetivos únicos dentro del departamento
      if (item.idObjetivoEmpresarial) {
        objetivosEmpresariales.add(item.idObjetivoEmpresarial);
      }
      if (item.idObj) {
        objetivosDepartamentales.add(item.idObj);
      }
    }
  }

  return {
    totalObjetivosEmpresariales: objetivosEmpresariales.size,
    totalObjetivosDepartamentales: objetivosDepartamentales.size,
  };
}



async getTotalObjetivosPorUsuario(idUsuario: string): Promise<{ totalObjetivosUsuario: number, totalObjetivosEmpresariales: number }> {
  const data = await this.getPromedioAvance();

  let objetivosUsuario = new Set<string>();
  let objetivosEmpresariales = new Set<string>();

  for (const item of data) {
    if (item.userId === idUsuario) { 
      // Contar objetivos personales y propuestos del usuario
      objetivosUsuario.add(item.idObj);

      // Contar objetivos empresariales a los que está vinculado
      if (item.idObjetivoEmpresarial) {
        objetivosEmpresariales.add(item.idObjetivoEmpresarial);
      }
    }
  }

  return {
    totalObjetivosUsuario: objetivosUsuario.size,
    totalObjetivosEmpresariales: objetivosEmpresariales.size
  };
}






async getPromedioAvanceObjEmpr(): Promise<any[]> {
  const data = await this.getPromedioAvance();

  // Agrupar la data
  const grupos = data.reduce((acum, item) => {
    const key = `${item.idObjetivoEmpresarial}_${item.idPeriodo}`;
    if (!acum[key]) {
      acum[key] = {
        idObjetivoEmpresarial: item.idObjetivoEmpresarial,
        nombreObjetivoEmpresarial: item.nombreObjetivoEmpresarial,
        idPeriodo: item.idPeriodo,
        nombrePeriodo: item.nombrePeriodo,
        sumaEvaluado: 0,
        sumaSupervisor: 0,
        count: 0,
      };
    }
    acum[key].sumaEvaluado += item.puntaje_evaluado;
    acum[key].sumaSupervisor += item.puntaje_supervisor;
    acum[key].count += 1;
    return acum;
  }, {} as Record<string, any>); // Aquí forzamos el tipo "any"

  // Convertir a arreglo y forzar el tipo a "any[]"
  const gruposArray = Object.values(grupos) as any[];

  // Mapear para calcular los promedios
  return gruposArray.map(grupo => ({
    idObjetivoEmpresarial: grupo.idObjetivoEmpresarial,
    nombreObjetivoEmpresarial: grupo.nombreObjetivoEmpresarial,
    idPeriodo: grupo.idPeriodo,
    nombrePeriodo: grupo.nombrePeriodo,
    promedio_evaluado: grupo.sumaEvaluado / grupo.count,
    promedio_supervisor: grupo.sumaSupervisor / grupo.count,
  }));
}


async getAvancePorDepartamento(): Promise<any[]> {
  const data = await this.getPromedioAvance();

  // Forzar el tipo para evitar 'unknown'
  const grupos = (data as any[]).reduce((acum, item) => {
    const key = `${item.idDepartamento}_${item.idPeriodo}`;

    if (!acum[key]) {
      acum[key] = {
        idDepartamento: item.idDepartamento,
        nombreDepartamento: item.nombreDepartamento,
        idPeriodo: item.idPeriodo,
        nombrePeriodo: item.nombrePeriodo,
        sumaAvance: 0,
        count: 0,
        objetivosEmp: {} as Record<string, any>
      };
    }

    if (!acum[key].objetivosEmp[item.idObjetivoEmpresarial]) {
      acum[key].objetivosEmp[item.idObjetivoEmpresarial] = {
        idemp: item.idObjetivoEmpresarial,
        nombreObjetivoEmpresarial: item.nombreObjetivoEmpresarial,
        sumaAvance: 0,
        numeroObjasociados: 0
      };
    }

    acum[key].objetivosEmp[item.idObjetivoEmpresarial].sumaAvance += 
      (item.puntaje_evaluado + item.puntaje_supervisor) / 2;
    acum[key].objetivosEmp[item.idObjetivoEmpresarial].numeroObjasociados += 1;

    acum[key].sumaAvance += (item.puntaje_evaluado + item.puntaje_supervisor) / 2;
    acum[key].count += 1;

    return acum;
  }, {} as Record<string, any>); // 🔹 Forzar tipo en el acumulador

  // Convertir el objeto a un array y aplicar el mapeo
  return Object.values(grupos as any[]).map(depto => ({
    idDepartamento: depto.idDepartamento,
    nombreDepartamento: depto.nombreDepartamento,
    avance: depto.count ? (depto.sumaAvance / depto.count).toFixed(2) + "%" : "0%",
    idPeriodo: depto.idPeriodo,
    nombrePeriodo: depto.nombrePeriodo,
    objetivosEmp: Object.values(depto.objetivosEmp).map((obj: any) => ({
      idemp: obj.idemp,
      nombreObjetivoEmpresarial: obj.nombreObjetivoEmpresarial,
      avance: obj.numeroObjasociados ? (obj.sumaAvance / obj.numeroObjasociados).toFixed(2) : 0,
      numeroObjasociados: obj.numeroObjasociados
    }))
  }));
}


async getAvancePorObjEmpDepartamento(idDepartamento: string): Promise<any> {
  const data = await this.getPromedioAvance();

  // Filtrar solo los datos del departamento especificado
  const dataFiltrada = (data as any[]).filter(item => item.idDepartamento === idDepartamento);

  if (dataFiltrada.length === 0) {
    return { mensaje: "No se encontraron datos para el departamento proporcionado." };
  }

  // Agrupar la data por período y objetivo empresarial
  const grupos = dataFiltrada.reduce((acum, item) => {
    const key = `${item.idObjetivoEmpresarial}_${item.idPeriodo}`;

    if (!acum[key]) {
      acum[key] = {
        idemp: item.idObjetivoEmpresarial,
        nombreObjetivoEmpresarial: item.nombreObjetivoEmpresarial,
        idPeriodo: item.idPeriodo,
        nombrePeriodo: item.nombrePeriodo,
        sumaAvance: 0,
        sumaEvaluado: 0,
        sumaSupervisor: 0,
        numeroObjasociados: 0
      };
    }

    acum[key].sumaAvance += (item.puntaje_evaluado + item.puntaje_supervisor) / 2;
    acum[key].sumaEvaluado += item.puntaje_evaluado;
    acum[key].sumaSupervisor += item.puntaje_supervisor;
    acum[key].numeroObjasociados += 1;

    return acum;
  }, {} as Record<string, any>); // 🔹 Forzar tipo en el acumulador

  // Convertir el objeto a un array y calcular los promedios
  const objetivosEmpresariales = Object.values(grupos as any[]).map(obj => ({
    idemp: obj.idemp,
    nombreObjetivoEmpresarial: obj.nombreObjetivoEmpresarial,
    idPeriodo: obj.idPeriodo,
    nombrePeriodo: obj.nombrePeriodo,
    avance: obj.numeroObjasociados
      ? (obj.sumaAvance / obj.numeroObjasociados)
      : 0,
    promedio_evaluado: obj.numeroObjasociados
      ? (obj.sumaEvaluado / obj.numeroObjasociados)
      : 0,
    promedio_supervisor: obj.numeroObjasociados
      ? (obj.sumaSupervisor / obj.numeroObjasociados)
      : 0,
    numeroObjasociados: obj.numeroObjasociados
  }));

  return {
    idDepartamento,
    objetivosEmpresariales
  };
}


async getAvancePorDepartamentoUser(idDepartamento: string): Promise<any> {
  const data = await this.getPromedioAvance();

  // Filtrar solo los datos del departamento especificado
  const dataFiltrada = (data as any[]).filter(item => item.idDepartamento === idDepartamento);

  if (dataFiltrada.length === 0) {
    return { mensaje: "No se encontraron datos para el departamento proporcionado." };
  }

  // Agrupar los datos por objetivo empresarial y período
  const grupos = dataFiltrada.reduce((acum, item) => {
    const key = `${item.idObjetivoEmpresarial}_${item.idPeriodo}`;

    if (!acum[key]) {
      acum[key] = {
        idemp: item.idObjetivoEmpresarial,
        nombreObjetivoEmpresarial: item.nombreObjetivoEmpresarial,
        idPeriodo: item.idPeriodo,
        nombrePeriodo: item.nombrePeriodo,
        sumaAvance: 0,
        sumaEvaluado: 0,
        sumaSupervisor: 0,
        numeroObjasociados: 0,
        usuarios: {}
      };
    }

    // Sumar avance del objetivo empresarial
    acum[key].sumaAvance += (item.puntaje_evaluado + item.puntaje_supervisor) / 2;
    acum[key].sumaEvaluado += item.puntaje_evaluado;
    acum[key].sumaSupervisor += item.puntaje_supervisor;
    acum[key].numeroObjasociados += 1;

    // Agregar usuarios y su avance
    if (!acum[key].usuarios[item.userId]) {
      acum[key].usuarios[item.userId] = {
        idUser: item.userId,
        nombre: item.userName,  // Accediendo a userName
        apellido: item.userApellido,  // Accediendo a userApellido
        sumaAvance: 0,
        sumaEvaluado: 0,
        sumaSupervisor: 0,
        count: 0
      };
    }

    acum[key].usuarios[item.userId].sumaAvance += (item.puntaje_evaluado + item.puntaje_supervisor) / 2;
    acum[key].usuarios[item.userId].sumaEvaluado += item.puntaje_evaluado;
    acum[key].usuarios[item.userId].sumaSupervisor += item.puntaje_supervisor;
    acum[key].usuarios[item.userId].count += 1;

    return acum;
  }, {} as Record<string, any>); // 🔹 Forzar tipo en el acumulador

  // Convertir a un array y calcular promedios
  const objetivosEmpresariales = Object.values(grupos as any[]).map(obj => ({
    idemp: obj.idemp,
    nombreObjetivoEmpresarial: obj.nombreObjetivoEmpresarial,
    idPeriodo: obj.idPeriodo,
    nombrePeriodo: obj.nombrePeriodo,
    avance: obj.numeroObjasociados
      ? (obj.sumaAvance / obj.numeroObjasociados)
      : 0,
    promedio_evaluado: obj.numeroObjasociados
      ? (obj.sumaEvaluado / obj.numeroObjasociados)
      : 0,
    promedio_supervisor: obj.numeroObjasociados
      ? (obj.sumaSupervisor / obj.numeroObjasociados)
      : 0,
    usuarios: Object.values(obj.usuarios).map((user: any) => ({
      idUser: user.idUser,
      nombre: user.nombre,  // Mostrar nombre del usuario
      apellido: user.apellido,  // Mostrar apellido del usuario
      avance: user.count
        ? (user.sumaAvance / user.count)
        : 0,
      promedio_evaluado: user.count
        ? (user.sumaEvaluado / user.count)
        : 0,
      promedio_supervisor: user.count
        ? (user.sumaSupervisor / user.count)
        : 0
    }))
  }));

  return {
    idDepartamento,
    objetivosEmpresariales
  };
}




async getAvancePorUsuario(idUser: string): Promise<any> {
  const data = await this.getPromedioAvance();

  // Filtrar solo los datos del usuario especificado
  const dataFiltrada = (data as any[]).filter(item => item.userId === idUser);

  if (dataFiltrada.length === 0) {
      return { mensaje: "No se encontraron datos para el usuario proporcionado." };
  }

  // Agrupar los datos por objetivo y período
  const grupos = dataFiltrada.reduce((acum, item) => {
      const key = `${item.idObj}_${item.idPeriodo}`;

      if (!acum[key]) {
          acum[key] = {
              idUser: item.userId,
              idObj: item.idObj,
              nombreObj: item.nombreObj,
              idPeriodo: item.idPeriodo,
              nombrePeriodo: item.nombrePeriodo,
              sumaAvance: 0,
              count: 0,
              puntaje_evaluado: item.puntaje_evaluado,
              puntaje_supervisor: item.puntaje_supervisor
          };
      }

      // Sumar avance
      acum[key].sumaAvance += (item.puntaje_evaluado + item.puntaje_supervisor) / 2;
      acum[key].count += 1;

      return acum;
  }, {} as Record<string, any>);

  // Convertir a un array y calcular promedios
  const resultados = Object.values(grupos as any[]).map(obj => ({
      idUser: obj.idUser,
      idObj: obj.idObj,
      nombreObj: obj.nombreObj,
      idPeriodo: obj.idPeriodo,
      nombrePeriodo: obj.nombrePeriodo,
      puntaje_evaluado: obj.puntaje_evaluado,
      puntaje_supervisor: obj.puntaje_supervisor,
      avance: obj.count ? (obj.sumaAvance / obj.count) : 0
  }));

  return {
      idUser,
      resultados
  };
}


  async update(id: string, updateResultadoEvaluacionDto: UpdateResultadoEvaluacionDto) {
    const resultadoEvaluacion = await this.resultadoEvaluacionRepository.preload({
      idResultadoEvaluacion: id,
      ...updateResultadoEvaluacionDto
    });

    if (!resultadoEvaluacion) {
      throw new NotFoundException(`Resultado de evaluación con id ${id} no encontrado`);
    }

    try {
      await this.resultadoEvaluacionRepository.save(resultadoEvaluacion);
      return resultadoEvaluacion;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const resultadoEvaluacion = await this.findOne(id);
    await this.resultadoEvaluacionRepository.remove(resultadoEvaluacion);
  }

  private handleDBExceptions(error: any): never {
    if (error instanceof BadRequestException || error instanceof NotFoundException) {
      throw error;
    }

    if (error.code === '23505') {
      throw new BadRequestException('Datos duplicados detectados en la base de datos');
    }

    console.error(error);
    throw new InternalServerErrorException('Error inesperado, revisa los logs del servidor');
  }
}