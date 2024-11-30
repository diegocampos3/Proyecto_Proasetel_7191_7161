import { Entity, PrimaryColumn, Column, ManyToOne, ManyToMany } from "typeorm";
import { PeriodoEvaluacion } from "./periodoEvaluacion.entity";
import { Usuario } from "./usuarios.entity";
import { ObjetivosPers } from "./objetivosPers.entity";

@Entity()
export class EvaluacionPers {
    @PrimaryColumn('uuid')
    @ManyToOne(() => PeriodoEvaluacion, (periodo) => periodo.idPeriodo)
    idPeriodo: PeriodoEvaluacion;

    @PrimaryColumn('uuid')
    @ManyToOne(() => PeriodoEvaluacion, (usuarioEvaluador) => usuarioEvaluador.idUserEvaluador)
    idUserEvaluador: PeriodoEvaluacion;

    @PrimaryColumn('uuid')
    @ManyToOne(() => Usuario, (usuario) => usuario.id)
    idUserEvaluado: Usuario;

    @PrimaryColumn('uuid')
    @ManyToMany(() => ObjetivosPers, (objetivoPers) => objetivoPers.idObjPer)
    idObjPer: ObjetivosPers;

    @Column({ type: 'boolean', nullable: false })
    estado: boolean;

    @Column({ type: 'float', nullable: true })
    nivelLogro: number;
}
