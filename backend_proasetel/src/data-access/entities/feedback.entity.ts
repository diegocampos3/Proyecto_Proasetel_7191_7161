import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./usuario.entity";
import { PeriodoEvaluacion } from "./periodoEvaluacion.entity";

@Entity()
export class Feedback {

    @PrimaryGeneratedColumn('uuid')
    idFeedback: string;

    @ManyToOne(() => PeriodoEvaluacion, (periodo) => periodo.idPeriodoEva)
    idPeriodoEva: PeriodoEvaluacion;

    @ManyToOne(() => User, (usuario) => usuario.id)
    idUserEvaluado: User;

    @Column({ type: 'text', nullable: false })
    descripcion: string;
}
