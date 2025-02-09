import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, BeforeInsert, BeforeUpdate } from "typeorm";
import { Formulario } from "./formulario.entity";
import { ResultadoEvaluacion } from "./resultado_evaluacion.entity";

@Entity()
export class FormulariosPreg {

    @PrimaryGeneratedColumn('uuid')
    idPregunta: string;

    @ManyToOne(() => Formulario, (formulario) => formulario.formularioPreg)
    @JoinColumn({ name: 'idFormulario' })
    formulario: Formulario;

    @Column({ type: 'text', nullable: false, unique: true })
    pregunta: string;

    @OneToMany(
        () => ResultadoEvaluacion,
        (resultadoEvaluacion) => resultadoEvaluacion.pregunta
    )
    resultadoEvaluacion: ResultadoEvaluacion

    @BeforeInsert()
    checkFieldsBeforeInsert(){
        this.pregunta = this.pregunta.toLocaleLowerCase()
    }

    @BeforeUpdate()
    checkFielsBeforeUpdate(){
        this.checkFieldsBeforeInsert();
    }
}
