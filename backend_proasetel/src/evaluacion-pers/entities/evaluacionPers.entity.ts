import { Entity, PrimaryColumn, Column, ManyToOne, ManyToMany } from "typeorm";
import { PeriodoEvaluacion } from "../../periodo-evaluacion/entities/periodoEvaluacion.entity";
import { Usuario } from "../../auth/entities/usuarios.entity";
import { ObjetivosPers } from "../../objetivos-pers/entities/objetivosPers.entity";

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
