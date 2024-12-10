import { Departamento } from "src/data-access/entities/departamento.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('usuarios')
export class User  {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    nombres: string

    @Column('text')
    apellidos: string

    @Column('text', {
        unique: true
    })
    email: string

    @Column('text', {
        select: false
    })
    password: string

    @Column('bool', {
        default: true
    })
    
    isActive: boolean;
    @Column('text',{
        default: 'user'
    })
    rol: string


    //Relación
    @ManyToOne(
        () => Departamento,
        ( departamento ) => departamento.user
    )
    departamento: Departamento

    @BeforeInsert()
    checkFieldsBeforeInsert(){
        this.email = this.email.toLocaleLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdte() {
        this.checkFieldsBeforeInsert();
    }


}
