import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinColumn, JoinTable, OneToMany } from "typeorm";
import { ObjetivosDep } from "./objetivosDep.entity";
import { EvaluacionObjetivoPers } from "./evaluacion-Obj-Pers.entity";


@Entity()
export class ObjetivosPers {
    @PrimaryGeneratedColumn('uuid')
    idObjPer: string;

    @Column({ type: 'text', nullable: false, unique: true })
    titulo: string;

    @Column({ type: 'text', nullable: true })
    descripcion: string;

    @Column({type: 'boolean', default: true})
    estado: boolean;

    @ManyToOne(
        () => ObjetivosDep, 
        (objetivoDep) => objetivoDep.objetivoPers
    )
    @JoinColumn({ name: 'objetivoDepId' })
    objetivoDep: ObjetivosDep;

    @OneToMany(
        () => EvaluacionObjetivoPers,
        (evaluacionObjetivoPers) => evaluacionObjetivoPers.objetivo,
    )
    evaluacionObjetivoPers: EvaluacionObjetivoPers[];
    
}
