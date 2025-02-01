import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ObjtivosEmpDep } from "./objtivos-emp-dep.entity";
import { User } from "./usuario.entity";

@Entity()
export class ObjetivosPersProp {

    @PrimaryGeneratedColumn('uuid')
    id: string;

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
        nullable: true
    })
    estado: boolean;

    @Column({
        type: 'boolean',
        nullable: true,
        default: null
    })
    aceptacion: boolean;

    @ManyToOne(
        () => ObjtivosEmpDep, 
        ( objtivoEmpDep) => objtivoEmpDep.objetivoDep)
    objtivoEmpDep: ObjtivosEmpDep;

    @ManyToOne(
        () => User,
        (user) => user.objetivosPersProp)
    user: User

    @BeforeInsert()
    checkFieldsBeforeInsert(){
        this.titulo = this.titulo.toLocaleLowerCase()
    }

    @BeforeUpdate()
    checkFielsBeforeUpdate(){
        this.checkFieldsBeforeInsert();
    }


}
