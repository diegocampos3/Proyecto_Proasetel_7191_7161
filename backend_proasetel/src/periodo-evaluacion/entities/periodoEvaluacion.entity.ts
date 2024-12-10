import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Periodo } from "../../periodo/entities/periodo.entity";
import { User } from "src/auth/entities/usuario.entity";

@Entity()
export class PeriodoEvaluacion {

    @PrimaryGeneratedColumn('uuid')
    idPeriodoEva: string;

    @ManyToOne(() => Periodo, (periodo) => periodo.idPeriodo)
    idPeriodo: Periodo;

    @ManyToOne(() => User, (usuario) => usuario.id)
    idUserEvaluador: User;

    @Column({ type: 'boolean', nullable: false })
    estado: boolean;
}
