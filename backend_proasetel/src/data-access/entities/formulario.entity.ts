import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert, BeforeUpdate } from "typeorm";
// import { EvaluacionPers } from "./evaluacionPers.entity";
import { FormulariosPreg } from "./formulario-pregunta.entity";
import { PeriodoEvaluacion } from "./periodoEvaluacion.entity";

@Entity()
export class Formulario {

    @PrimaryGeneratedColumn('uuid')
    idFormulario: string;

    @Column({ type: 'text', nullable: false, unique: true })
    nombre: string;

    @Column({ type: 'text', nullable: false })
    descripcion: string;

    @Column({ type: 'int', nullable: false, default: 1})
    estado: number;

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

    @BeforeInsert()
    checkFieldsBeforeInsert(){
        this.nombre = this.nombre.toLocaleLowerCase()
    }

    @BeforeUpdate()
    checkFielsBeforeUpdate(){
        this.checkFieldsBeforeInsert();
    }
}
