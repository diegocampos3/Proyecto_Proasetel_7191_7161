import { Departamento } from "src/data-access/entities/departamento.entity";
import { ObjetivosEmpr } from "src/data-access/entities/objetivosEmpr.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, BeforeInsert, BeforeUpdate } from "typeorm";
import { ObjetivosPers } from "src/data-access/entities/objetivosPers.entity";
import { ObjtivosEmpDep } from "./objtivos-emp-dep.entity";

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

    @Column({
        type: 'boolean',
    })
    estado: boolean;


    @ManyToOne(
        () => ObjtivosEmpDep, 
        ( objtivoEmpDep) => objtivoEmpDep.objetivoDep)
    objtivoEmpDep: ObjtivosEmpDep;

    @OneToMany(
        () => ObjetivosPers,
        (objetivoPers) => objetivoPers.objetivoDep)
    objetivoPers: ObjetivosPers


    @BeforeInsert()
    checkTitutuloInsert() {
        this.titulo = this.titulo.toLocaleLowerCase();
    }

    @BeforeUpdate()
    checkTitutuloUpdate(){
        this.titulo = this.titulo.toLocaleLowerCase();
    }

}

