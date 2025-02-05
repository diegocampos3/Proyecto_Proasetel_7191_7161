import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Formulario } from "./formulario.entity";
import { ResultadoEvaluacion } from "./resultado_evaluacion.entity";

@Entity()
export class FormulariosPreg {

    @PrimaryGeneratedColumn('uuid')
    idPregunta: string;

    @ManyToOne(() => Formulario, (formulario) => formulario.formularioPreg)
    @JoinColumn({ name: 'idFormulario' })
    formulario: Formulario;

    @Column({ type: 'text', nullable: false })
    pregunta: string;

    @OneToMany(
        () => ResultadoEvaluacion,
        (resultadoEvaluacion) => resultadoEvaluacion.pregunta
    )
    resultadoEvaluacion: ResultadoEvaluacion
}
