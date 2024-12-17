import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ObjetivosDep } from "./objetivosDep.entity";

@Entity()
export class ObjetivosEmpr {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text',{
        unique: true
    })
    titulo: string;

    @Column('text')
    descripcion: string;

    // Relación 
    @OneToMany(
        () => ObjetivosDep,
        ( objetivoDep ) => objetivoDep.objetivoEmpr
    )
    objetivoDep: ObjetivosDep;


    @BeforeInsert()
    checkTitutuloInsert() {
        this.titulo = this.titulo.toLocaleLowerCase();
    }

}