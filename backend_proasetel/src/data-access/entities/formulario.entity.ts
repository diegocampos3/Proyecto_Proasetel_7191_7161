import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Formulario {

    @PrimaryGeneratedColumn('uuid')
    idFormulario: string;

    @Column({ type: 'text', nullable: false })
    descripcion: string;
}
