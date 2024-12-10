import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany } from "typeorm";
import { PeriodoEvaluacion } from "../../periodo-evaluacion/entities/periodoEvaluacion.entity";
import { Usuario } from "../../auth/entities/usuarios.entity";
import { ObjetivosPers } from "../../objetivos-pers/entities/objetivosPers.entity";
import { Formulario } from "../../formulario/entities/formulario.entity";

@Entity()
export class EvaluacionPers {

    @PrimaryGeneratedColumn('uuid')
    idEvaPer: string;

    @ManyToOne(() => Formulario, (formulario) => formulario.idFormulario)
    idFormulario: Formulario;

    @ManyToOne(() => PeriodoEvaluacion, (periodo) => periodo.idPeriodoEva)
    idPeriodoEva: PeriodoEvaluacion;

    @ManyToOne(() => Usuario, (usuario) => usuario.id)
    idUserEvaluado: Usuario;

    @ManyToMany(() => ObjetivosPers, (objetivoPers) => objetivoPers.idObjPer)
    idObjPer: ObjetivosPers;

    @Column({ type: 'boolean', nullable: false })
    estado: boolean;

    @Column({ type: 'float', nullable: true })
    nivelLogro: number;
}
