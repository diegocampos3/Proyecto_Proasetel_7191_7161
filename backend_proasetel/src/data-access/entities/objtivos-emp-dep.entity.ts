import { Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Departamento } from "./departamento.entity";
import { ObjetivosEmpr } from "./objetivosEmpr.entity";
import { ObjetivosDep } from "./objetivosDep.entity";

@Entity()
export class ObjtivosEmpDep {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(
            () => Departamento, 
            (departamento) => departamento.objetivoDep)
    departamento: Departamento;

    @ManyToOne(
            () => ObjetivosEmpr, 
            (objetivoEmpr) => objetivoEmpr.objetivoDep)
    objetivoEmpr: ObjetivosEmpr;

    @OneToMany(
        () => ObjetivosDep,
        ( objetivoDep ) => objetivoDep.objtivoEmpDep
    )
    objetivoDep: ObjetivosDep;
    
}
