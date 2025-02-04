import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./usuario.entity";
import { ObjtivosEmpDep } from "./objtivos-emp-dep.entity";


@Entity()
export class Departamento {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text',
        unique: true,
        nullable: true
    })
    nombre: string

    @Column({
        type: 'text',
        nullable: true
    }) 
    descripcion: string


    // Relación

    @OneToMany(
        () => User,
        ( user ) => user.departamento
    )
    user: User;


    @OneToMany(
        () => ObjtivosEmpDep,
        ( objetivoDep ) => objetivoDep.departamento
    )
    objetivoDep: ObjtivosEmpDep;


    // Verificar antes de insertar
    @BeforeInsert()
    checkNombreInsert() {
        this.nombre = this.nombre.toLowerCase()
    }

    @BeforeUpdate()
    checkNombreUpdate(){
        this.nombre = this.nombre.toLowerCase()
    }


}
