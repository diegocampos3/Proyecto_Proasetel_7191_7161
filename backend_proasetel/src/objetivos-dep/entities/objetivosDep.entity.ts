import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Departamento } from "../../departamentos/entities/departamento.entity";
import { ObjetivosEmpr } from "../../objetivos-empr/entities/objetivosEmpr.entity";

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
