import { Entity, PrimaryColumn, Column, ManyToOne } from "typeorm";
import { PeriodoEvaluacion } from "./periodoEvaluacion.entity";
import { Usuario } from "./usuarios.entity";

@Entity()
export class Feedback {
    @PrimaryColumn('uuid')
    @ManyToOne(() => PeriodoEvaluacion, (periodo) => periodo.idPeriodo)
    idPeriodo: PeriodoEvaluacion;

    @PrimaryColumn('uuid')
    @ManyToOne(() => PeriodoEvaluacion, (usuarioEvaluador) => usuarioEvaluador.idUserEvaluador)
    idUserEvaluador: PeriodoEvaluacion;

    @PrimaryColumn('uuid')
    @ManyToOne(() => Usuario, (usuario) => usuario.id)
    idUserEvaluado: Usuario;

    @Column({ type: 'text', nullable: false })
    descripcion: string;
}
