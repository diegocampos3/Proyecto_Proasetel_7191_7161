import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { ObjetivosDep } from "./objetivosDep.entity";

@Entity()
export class ObjetivosPers {
    @PrimaryGeneratedColumn('uuid')
    idObjPer: string;

    @Column({ type: 'text', nullable: false, unique: true })
    titulo: string;

    @Column({ type: 'text', nullable: true })
    descripcion: string;

    @ManyToOne(
        () => ObjetivosDep, 
        (objetivoDep) => objetivoDep.objetivoPers
    )
    @JoinColumn({ name: 'objetivoDepId' })
    objetivoDep: ObjetivosDep;
}
