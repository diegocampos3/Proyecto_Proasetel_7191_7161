import { Entity, PrimaryColumn, Column, ManyToOne } from "typeorm";
import { Periodo } from "./periodo.entity";
import { Usuario } from "./usuarios.entity";

@Entity()
export class PeriodoEvaluacion {

    @PrimaryColumn('uuid')
    @ManyToOne(() => Periodo, (periodo) => periodo.idPeriodo)
    idPeriodo: Periodo;

    @PrimaryColumn('uuid')
    @ManyToOne(() => Usuario, (usuario) => usuario.id)
    idUserEvaluador: Usuario;

    @Column({ type: 'boolean', nullable: false })
    estado: boolean;
}
