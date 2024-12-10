import { Departamento } from "src/data-access/entities/departamento.entity";
import { ObjetivosEmpr } from "src/data-access/entities/objetivosEmpr.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

@Entity()
export class ObjetivosDep {
    @PrimaryGeneratedColumn('uuid')
    idObjDep: string;

    @Column({ type: 'text', nullable: false })
    titulo: string;

    @Column({ type: 'text', nullable: true })
    descripcion: string;

    @ManyToOne(() => Departamento, (departamento) => departamento.id)
    idDep: Departamento;

    @ManyToOne(() => ObjetivosEmpr, (objetivoEmpr) => objetivoEmpr.id)
    idObjEmp: ObjetivosEmpr;
}
