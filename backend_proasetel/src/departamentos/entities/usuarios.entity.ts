import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Departamento } from "./departamento.entity";
import { Rol } from "./rol.entity";

@Entity()
export class Usuario {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', nullable: false })
    nombres: string;

    @Column({ type: 'text', nullable: false })
    apellidos: string;

    @Column({ type: 'text', unique: true, nullable: false })
    correo: string;

    @Column({ type: 'text', nullable: false })
    contrasenia: string;

    @ManyToOne(() => Departamento, (departamento) => departamento.id)
    idDep: Departamento;

    @ManyToOne(() => Rol, (rol) => rol.idRol)
    idRol: Rol;
}
