import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ObjtivosEmpDep } from "./objtivos-emp-dep.entity";

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

    @Column({
        type: 'boolean',
    })
    estado: boolean;

    // Relación 
    @OneToMany(
        () => ObjtivosEmpDep,
        ( objetivoDep ) => objetivoDep.objetivoEmpr
    )
    objetivoDep: ObjtivosEmpDep;


    @BeforeInsert()
    checkTitutuloInsert() {
        this.titulo = this.titulo.toLocaleLowerCase();
    }

    @BeforeUpdate()
    checkNombreUpdate(){
        this.titulo = this.titulo.toLowerCase()
    }

}