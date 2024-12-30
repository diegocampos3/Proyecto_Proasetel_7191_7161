import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Formulario } from "./formulario.entity";

@Entity()
export class FormulariosPreg {

    @PrimaryGeneratedColumn('uuid')
    idPregunta: string;

    @ManyToOne(() => Formulario, (formulario) => formulario.formularioPreg)
    @JoinColumn({ name: 'idFormulario' })
    formulario: Formulario;

    @Column({ type: 'text', nullable: false })
    pregunta: string;
}
