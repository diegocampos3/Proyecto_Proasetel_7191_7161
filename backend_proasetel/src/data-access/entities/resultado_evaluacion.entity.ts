import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { ObjetivosPers } from "./objetivosPers.entity";
import { ObjetivosPersProp } from "./objetivos-pers-prop.entity";
import { FormulariosPreg } from "./formulario-pregunta.entity";

@Entity()
export class ResultadoEvaluacion {

    @PrimaryGeneratedColumn('uuid')
    idResultadoEvaluacion: string;

    @ManyToOne(() => ObjetivosPers, (objetivoPersonal) => objetivoPersonal.resultadoEvaluacion, { nullable: true })
    @JoinColumn({ name: 'idObjPer' })
    objetivoPersonal: ObjetivosPers | null;

    @ManyToOne(() => ObjetivosPersProp, (objetivoPersonalProyecto) => objetivoPersonalProyecto.resultadoEvaluacion, { nullable: true })
    @JoinColumn({ name: 'idObjPersProp' })
    objetivoPersonalPropuesto: ObjetivosPersProp | null;

    @ManyToOne(() => FormulariosPreg, (pregunta) => pregunta.resultadoEvaluacion)
    @JoinColumn({ name: 'idPregunta' })
    pregunta: FormulariosPreg;

    @Column({ type: 'int', nullable: true })
    puntaje_evaluado: number;

    @Column({ type: 'int', nullable: true })
    puntaje_supervisor: number;
}