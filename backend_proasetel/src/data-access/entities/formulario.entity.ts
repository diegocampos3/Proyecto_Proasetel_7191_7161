import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { EvaluacionPers } from "./evaluacionPers.entity";
import { FormulariosPreg } from "./formulario-pregunta.entity";

@Entity()
export class Formulario {

    @PrimaryGeneratedColumn('uuid')
    idFormulario: string;

    @Column({ type: 'text', nullable: false })
    descripcion: string;

    @OneToMany(
        () => EvaluacionPers,
        (evaluacionPers) => evaluacionPers.formulario
    )
    evaluacionPers: EvaluacionPers

    @OneToMany(
        () => FormulariosPreg,
        (formularioPreg) => formularioPreg.formulario
    )
    formularioPreg: FormulariosPreg
}
