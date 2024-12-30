import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinColumn, OneToMany } from "typeorm";
import { User } from "./usuario.entity";
import { Formulario } from "./formulario.entity";
import { ObjetivosPers } from "./objetivosPers.entity";
import { PeriodoEvaluacion } from "./periodoEvaluacion.entity";
import { EvaluacionObjetivoPers } from "./evaluacion-Obj-Pers.entity";

@Entity()
export class EvaluacionPers {

    @PrimaryGeneratedColumn('uuid')
    idEvaPer: string;

    @ManyToOne(() => Formulario, (formulario) => formulario.evaluacionPers)
    @JoinColumn({ name: 'idFormulario' })
    formulario: Formulario;

    @ManyToOne(() => PeriodoEvaluacion, (periodoEva) => periodoEva.evaluacionPers)
    @JoinColumn({ name: 'idPeriodoEva' })
    periodoEva: PeriodoEvaluacion;

    @ManyToOne(() => User, (user) => user.evaluacionPers)
    user: User;

    @Column({ type: 'boolean', nullable: false, default: true })
    estado: boolean;

    @OneToMany(
        () => EvaluacionObjetivoPers,
        (evaluacionObjetivoPers) => evaluacionObjetivoPers.evaluacion,
    )
    evaluacionObjetivoPers: EvaluacionObjetivoPers[];
}
