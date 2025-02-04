import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { EvaluacionPers } from "./evaluacionPers.entity";
import { FormulariosPreg } from "./formulario-pregunta.entity";
import { PeriodoEvaluacion } from "./periodoEvaluacion.entity";

@Entity()
export class Formulario {

    @PrimaryGeneratedColumn('uuid')
    idFormulario: string;

    @Column({ type: 'text', nullable: false })
    nombre: string;

    @Column({ type: 'text', nullable: false })
    descripcion: string;

    @Column({ type: 'boolean', nullable: false, default: false })
    estado: boolean;

    @OneToMany(
        () => PeriodoEvaluacion,
        (periodoEvaluacion) => periodoEvaluacion.formulario
    )
    periodoEvaluacion: PeriodoEvaluacion

    @OneToMany(
        () => FormulariosPreg,
        (formularioPreg) => formularioPreg.formulario
    )
    formularioPreg: FormulariosPreg
}
