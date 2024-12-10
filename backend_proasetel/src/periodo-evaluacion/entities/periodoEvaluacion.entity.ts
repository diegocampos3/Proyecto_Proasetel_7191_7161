import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Periodo } from "../../periodo/entities/periodo.entity";
import { Usuario } from "../../auth/entities/auth.entity";

@Entity()
export class PeriodoEvaluacion {

    @PrimaryGeneratedColumn('uuid')
    idPeriodoEva: string;

    @ManyToOne(() => Periodo, (periodo) => periodo.idPeriodo)
    idPeriodo: Periodo;

    @ManyToOne(() => Usuario, (usuario) => usuario.id)
    idUserEvaluador: Usuario;

    @Column({ type: 'boolean', nullable: false })
    estado: boolean;
}
