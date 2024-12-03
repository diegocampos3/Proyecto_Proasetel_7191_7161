import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Rol {
    @PrimaryGeneratedColumn('uuid')
    idRol: string;

    @Column({
        type: 'text',
        unique: true,
        nullable: false,
    })
    nombre: string;
}
