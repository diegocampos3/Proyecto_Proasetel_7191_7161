import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "src/data-access/entities/usuario.entity";
import { Periodo } from "src/data-access/entities/periodo.entity";
import { Feedback } from './feedback.entity';



@Entity()
export class PeriodoEvaluacion {

    @PrimaryGeneratedColumn('uuid')
    idPeriodoEva: string;

     @ManyToOne(
        () => Periodo, 
        (periodo) => periodo.periodoEvaluacion)
        @JoinColumn({ name: 'periodoId' })
        periodo: Periodo;

    @ManyToOne(
        () => User, 
        (user) => user.periodoeEvaluacion)
    user: User;

    @OneToMany(
        () => Feedback,
        (feedback) => feedback.periodoEva
    )
    feedback: Feedback
    

    @Column({ type: 'boolean', nullable: false, default: false })
    estado: boolean;
}
