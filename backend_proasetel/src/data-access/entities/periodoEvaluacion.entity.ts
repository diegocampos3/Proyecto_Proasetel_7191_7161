import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "src/data-access/entities/usuario.entity";
import { Periodo } from "src/data-access/entities/periodo.entity";



@Entity()
export class PeriodoEvaluacion {

    @PrimaryGeneratedColumn('uuid')
    idPeriodoEva: string;

     @ManyToOne(
        () => Periodo, 
        (periodo) => periodo.periodoEvaluacion)
        @JoinColumn({ name: 'periodoId' })
        periodo: Periodo;

    @ManyToOne(
        () => User, 
        (user) => user.periodoeEvaluacion)
    user: User;
    

    @Column({ type: 'boolean', nullable: false, default: false })
    estado: boolean;
}
