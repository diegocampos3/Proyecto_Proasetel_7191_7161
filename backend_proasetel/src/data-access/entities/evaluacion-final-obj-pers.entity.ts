import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { ObjetivosPers } from "./objetivosPers.entity";
import { ObjetivosPersProp } from "./objetivos-pers-prop.entity";

@Entity()
export class EvaluacionFinalObjPers {

    @PrimaryGeneratedColumn('uuid')
    idEvaluacionFinalObjPers: string;

    @ManyToOne(() => ObjetivosPers, (objetivoPersonal) => objetivoPersonal.evaluacionesFinales, { nullable: true })
    @JoinColumn({ name: 'idObjPer' })
    objetivoPersonal: ObjetivosPers | null;

    @ManyToOne(() => ObjetivosPersProp, (objetivoPersonalProyecto) => objetivoPersonalProyecto.evaluacionesFinales, { nullable: true })
    @JoinColumn({ name: 'idObjPersProp' })
    objetivoPersonalPropuesto: ObjetivosPersProp | null;

    @Column({ type: 'float', nullable: false })
    nivelLogro: number;
}