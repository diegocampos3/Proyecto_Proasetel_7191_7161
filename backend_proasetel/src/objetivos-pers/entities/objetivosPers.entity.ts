import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { ObjetivosDep } from "../../objetivos-dep/entities/objetivosDep.entity";

@Entity()
export class ObjetivosPers {
    @PrimaryGeneratedColumn('uuid')
    idObjPer: string;

    @Column({ type: 'text', nullable: false })
    titulo: string;

    @Column({ type: 'text', nullable: true })
    descripcion: string;

    @ManyToOne(() => ObjetivosDep, (objetivoDep) => objetivoDep.idObjDep)
    idObjDep: ObjetivosDep;
}
