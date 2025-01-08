import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { PeriodoEvaluacion } from "src/data-access/entities/periodoEvaluacion.entity";


@Entity()
export class Periodo {
    @PrimaryGeneratedColumn('uuid')
    idPeriodo: string;

    @Column()
    titulo: string;


    @Column()
    descripcion: string

    @Column({ type: 'timestamptz', nullable: true})
    fecha_ini: Date;

    @Column({ type: 'timestamptz', nullable: true })
    fecha_fin: Date;

    @Column()
    color: string;

    @Column()
    textColor: string;

    @OneToMany(
          () => PeriodoEvaluacion,
          ( periodoEvaluacion ) => periodoEvaluacion.periodo
      )
      periodoEvaluacion: PeriodoEvaluacion;
}
