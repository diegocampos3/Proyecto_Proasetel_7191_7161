import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { PeriodoEvaluacion } from "src/data-access/entities/periodoEvaluacion.entity";


@Entity()
export class Periodo {
    @PrimaryGeneratedColumn('uuid')
    idPeriodo: string;

    @Column({ type: 'date', nullable: false })
    fecha_ini: Date;

    @Column({ type: 'date', nullable: false })
    fecha_fin: Date;

    @OneToMany(
          () => PeriodoEvaluacion,
          ( periodoEvaluacion ) => periodoEvaluacion.periodo
      )
      periodoEvaluacion: PeriodoEvaluacion;
}
