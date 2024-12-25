import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./usuario.entity";
import { PeriodoEvaluacion } from "./periodoEvaluacion.entity";

@Entity()
export class Feedback {

    @PrimaryGeneratedColumn('uuid')
    idFeedback: string;

    @ManyToOne(
        () => PeriodoEvaluacion, 
        (periodoEva) => periodoEva.feedback)
    @JoinColumn({ name: 'periodoEvaId' })
    periodoEva: PeriodoEvaluacion;

    @ManyToOne(
        () => User, 
        (user) => user.feedback)
    user: User;

    @Column({ type: 'text', nullable: false })
    descripcion: string;
}
