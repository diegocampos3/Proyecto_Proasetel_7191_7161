import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { PeriodoEvaluacion } from "../../periodo-evaluacion/entities/periodoEvaluacion.entity";
import { User } from "src/auth/entities/usuario.entity";

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
