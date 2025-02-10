import { Injectable } from '@nestjs/common';
import { CreateAnalisisSentimientoDto } from './dto/create-analisis-sentimiento.dto';
import { UpdateAnalisisSentimientoDto } from './dto/update-analisis-sentimiento.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AnalisisSentimientos } from 'src/data-access/entities/analisis-sentimiento.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AnalisisSentimientosService {

  constructor (
    @InjectRepository(AnalisisSentimientos)
    private readonly analisisSentRepository: Repository<AnalisisSentimientos>
  ){}

  async create(createAnalisisSentimientoDto: CreateAnalisisSentimientoDto) {
    const analisis = this.analisisSentRepository.create(createAnalisisSentimientoDto);
    await this.analisisSentRepository.save(analisis);
    return analisis;
  }

  findAll() {
    return this.analisisSentRepository.find();
  }

  async findOne(id: string) {
    return this.analisisSentRepository.findOne({ where: { idAnalisis: id } });
  }

  update(id: number, updateAnalisisSentimientoDto: UpdateAnalisisSentimientoDto) {
    return this.analisisSentRepository.update(id, updateAnalisisSentimientoDto);
  }

  remove(id: number) {
    return this.analisisSentRepository.delete(id);
  }

  /**
   * Obtiene la agregación de los análisis de sentimientos agrupados por departamento y periodo,
   * retornando nombres en lugar de códigos.
   *
   * La estructura de salida será similar a:
   * {
   *   "Ventas": {
   *     "2023-Q1": { Bueno: 1, Malo: 0 },
   *     "2023-Q2": { Bueno: 2, Malo: 1 }
   *   },
   *   "all": {
   *     "2023-Q1": { Bueno: 1, Malo: 0 },
   *     "2023-Q2": { Bueno: 2, Malo: 1 }
   *   }
   * }
   */
  async getSatisfactionData(): Promise<any> {
    const query = this.analisisSentRepository
      .createQueryBuilder('analisis')
      // Unir Feedback para acceder a PeriodoEvaluacion
      .leftJoin('analisis.idFeedback', 'feedback')
      // Unir PeriodoEvaluacion para obtener información del periodo
      .leftJoin('feedback.periodoEva', 'periodoEva')
      // Unir la entidad Periodo para obtener el nombre del periodo
      .leftJoin('periodoEva.periodo', 'periodo')
      // Unir User y Departamento para obtener el nombre del departamento
      .leftJoin('periodoEva.user', 'user')
      .leftJoin('user.departamento', 'departamento')
      // Seleccionar el nombre del departamento y el nombre del periodo
      .select('departamento.nombre', 'departmentName')
      .addSelect('periodo.titulo', 'periodoName')
      .addSelect(`SUM(CASE WHEN analisis.resultado = true THEN 1 ELSE 0 END)`, 'bueno')
      .addSelect(`SUM(CASE WHEN analisis.resultado = false THEN 1 ELSE 0 END)`, 'malo')
      .groupBy('departamento.nombre')
      .addGroupBy('periodo.titulo');

    const result = await query.getRawMany();

    // Reestructurar el resultado en el formato esperado para el gráfico.
    const data: Record<string, any> = {};

    for (const row of result) {
      const deptName = row.departmentName || 'Desconocido';
      const periodName = row.periodoName || 'Desconocido';
      const bueno = parseInt(row.bueno, 10);
      const malo = parseInt(row.malo, 10);

      // Datos por departamento individual (usando el nombre)
      if (!data[deptName]) {
        data[deptName] = {};
      }
      data[deptName][periodName] = { Bueno: bueno, Malo: malo };

      // Acumulado en "all"
      if (!data['all']) {
        data['all'] = {};
      }
      if (!data['all'][periodName]) {
        data['all'][periodName] = { Bueno: 0, Malo: 0 };
      }
      data['all'][periodName].Bueno += bueno;
      data['all'][periodName].Malo += malo;
    }

    return data;
  }



  async getSatisfactionDataByDepartment(idDepartamento: string): Promise<any> {
    const query = this.analisisSentRepository
      .createQueryBuilder('analisis')
      // Unir Feedback para acceder a PeriodoEvaluacion
      .leftJoin('analisis.idFeedback', 'feedback')
      // Unir PeriodoEvaluacion para obtener información del periodo
      .leftJoin('feedback.periodoEva', 'periodoEva')
      // Unir la entidad Periodo para obtener el nombre del periodo
      .leftJoin('periodoEva.periodo', 'periodo')
      // Unir User y Departamento para obtener el nombre del departamento
      .leftJoin('periodoEva.user', 'user')
      .leftJoin('user.departamento', 'departamento')
      // Filtrar solo por el departamento dado
      .where('departamento.id = :idDepartamento', { idDepartamento })
      // Seleccionar el nombre del departamento y el nombre del periodo
      .select('departamento.nombre', 'departmentName')
      .addSelect('periodo.titulo', 'periodoName')
      .addSelect(`SUM(CASE WHEN analisis.resultado = true THEN 1 ELSE 0 END)`, 'bueno')
      .addSelect(`SUM(CASE WHEN analisis.resultado = false THEN 1 ELSE 0 END)`, 'malo')
      .groupBy('departamento.nombre')
      .addGroupBy('periodo.titulo');
  
    const result = await query.getRawMany();
  
    // Reestructurar el resultado en el formato esperado para el gráfico.
    const data: Record<string, any> = {};
  
    for (const row of result) {
      const deptName = row.departmentName || 'Desconocido';
      const periodName = row.periodoName || 'Desconocido';
      const bueno = parseInt(row.bueno, 10);
      const malo = parseInt(row.malo, 10);
  
      // Calcular el nivel de satisfacción (ej. porcentaje de respuestas buenas)
      const total = bueno + malo;
      const satisfaction = total > 0 ? (bueno / total) * 100 : 0; // Nivel de satisfacción en porcentaje
  
      // Datos por departamento individual (usando el nombre)
      if (!data[deptName]) {
        data[deptName] = {};
      }
      data[deptName][periodName] = { Bueno: bueno, Malo: malo, Satisfaccion: satisfaction.toFixed(2) + "%" };
  
      // Acumulado en "all"
      if (!data['all']) {
        data['all'] = {};
      }
      if (!data['all'][periodName]) {
        data['all'][periodName] = { Bueno: 0, Malo: 0, Satisfaccion: 0 };
      }
      data['all'][periodName].Bueno += bueno;
      data['all'][periodName].Malo += malo;
      data['all'][periodName].Satisfaccion = (data['all'][periodName].Bueno / (data['all'][periodName].Bueno + data['all'][periodName].Malo)) * 100;
    }
  
    return data;
  }
  
}


