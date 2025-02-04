import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "src/data-access/entities/usuario.entity";
import { Periodo } from "src/data-access/entities/periodo.entity";
import { Feedback } from './feedback.entity';
import { EvaluacionPers } from "./evaluacionPers.entity";
import { Formulario } from "./formulario.entity";



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

    @ManyToOne(
        () => Formulario, 
        (formulario) => formulario.periodoEvaluacion)
        @JoinColumn({ name: 'idFormulario' })
    formulario: Formulario;

    @OneToMany(
        () => Feedback,
        (feedback) => feedback.periodoEva
    )
    feedback: Feedback
    
    @Column({ type: 'boolean', nullable: false, default: false })
    estado: boolean;

    @OneToMany(
        () => EvaluacionPers,
        (evaluacionPers) => evaluacionPers.periodoEva
    )
    evaluacionPers: EvaluacionPers
}
