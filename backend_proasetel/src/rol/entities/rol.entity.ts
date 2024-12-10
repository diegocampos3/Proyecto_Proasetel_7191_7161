import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Rol {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text',
        unique: true,
        nullable: true
    })
    nombre: string;

    @BeforeInsert()
    checkNombreInsert() {
        this.nombre = this.nombre.toUpperCase();
    }

    @BeforeUpdate()
    checkNombreUpdate() {
        this.nombre = this.nombre.toUpperCase();
    }
}
