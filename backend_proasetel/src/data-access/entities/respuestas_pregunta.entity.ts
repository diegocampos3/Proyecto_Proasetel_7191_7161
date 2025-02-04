import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity()
export class RespuestasPreguntas {

    @PrimaryGeneratedColumn('uuid')
    idRespuestaPregunta: string;

    @Column({ type: 'text', nullable: false })
    clave: string;

    @Column({ type: 'text', nullable: false })
    descripcion: string;

    @Column({ type: 'float', nullable: false })
    valor: number;
}
