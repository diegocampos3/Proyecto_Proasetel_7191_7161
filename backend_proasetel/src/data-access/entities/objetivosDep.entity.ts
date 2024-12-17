import { Departamento } from "src/data-access/entities/departamento.entity";
import { ObjetivosEmpr } from "src/data-access/entities/objetivosEmpr.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, BeforeInsert } from "typeorm";
import { ObjetivosPers } from "src/data-access/entities/objetivosPers.entity";

@Entity()
export class ObjetivosDep {
    @PrimaryGeneratedColumn('uuid')
    idObjDep: string;

    @Column(
        { 
        type: 'text', 
        nullable: false,
        unique: true
        })
    titulo: string;

    @Column({ type: 'text', nullable: true })
    descripcion: string;

    @ManyToOne(
        () => Departamento, 
        (departamento) => departamento.objetivoDep)
    departamento: Departamento;

    @ManyToOne(
        () => ObjetivosEmpr, 
        (objetivoEmpr) => objetivoEmpr.objetivoDep)
    objetivoEmpr: ObjetivosEmpr;

    // Relación OneToMany, referenciando la propiedad 'objetivoDep' en ObjetivosPers
    @OneToMany(
        () => ObjetivosPers,
        (objetivoPers) => objetivoPers.objetivoDep
    )
    objetivoPers: ObjetivosPers;

    @BeforeInsert()
    checkTitutuloInsert() {
        this.titulo = this.titulo.toLocaleLowerCase();
    }

}

