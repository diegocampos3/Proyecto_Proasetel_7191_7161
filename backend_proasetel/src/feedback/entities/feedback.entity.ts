import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { PeriodoEvaluacion } from "../../periodo-evaluacion/entities/periodoEvaluacion.entity";
import { Usuario } from "../../auth/entities/usuarios.entity";

@Entity()
export class Feedback {

    @PrimaryGeneratedColumn('uuid')
    idFeedback: string;

    @ManyToOne(() => PeriodoEvaluacion, (periodo) => periodo.idPeriodoEva)
    idPeriodoEva: PeriodoEvaluacion;

    @ManyToOne(() => Usuario, (usuario) => usuario.id)
    idUserEvaluado: Usuario;

    @Column({ type: 'text', nullable: false })
    descripcion: string;
}
