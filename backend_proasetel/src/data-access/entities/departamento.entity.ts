import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./usuario.entity";


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
