import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany } from "typeorm";
import { User } from "./usuario.entity";
import { Formulario } from "./formulario.entity";
import { ObjetivosPers } from "./objetivosPers.entity";
import { PeriodoEvaluacion } from "./periodoEvaluacion.entity";

@Entity()
export class EvaluacionPers {

    @PrimaryGeneratedColumn('uuid')
    idEvaPer: string;

    @ManyToOne(() => Formulario, (formulario) => formulario.idFormulario)
    idFormulario: Formulario;

    @ManyToOne(() => PeriodoEvaluacion, (periodo) => periodo.idPeriodoEva)
    idPeriodoEva: PeriodoEvaluacion;

    @ManyToOne(() => User, (usuario) => usuario.id)
    idUserEvaluado: User;

    @ManyToMany(() => ObjetivosPers, (objetivoPers) => objetivoPers.idObjPer)
    idObjPer: ObjetivosPers;

    @Column({ type: 'boolean', nullable: false })
    estado: boolean;

    @Column({ type: 'float', nullable: true })
    nivelLogro: number;
}
