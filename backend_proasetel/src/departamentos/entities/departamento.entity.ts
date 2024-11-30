import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";


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
