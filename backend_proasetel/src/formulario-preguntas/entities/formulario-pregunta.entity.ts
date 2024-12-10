import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Formulario } from "../../formulario/entities/formulario.entity";

@Entity()
export class FormulariosPreg {

    @PrimaryGeneratedColumn('uuid')
    idPregunta: string;

    @ManyToOne(() => Formulario, (formulario) => formulario.idFormulario)
    idFormulario: Formulario;

    @Column({ type: 'text', nullable: false })
    pregunta: string;
}
