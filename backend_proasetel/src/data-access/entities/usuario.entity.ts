import { Departamento } from "src/data-access/entities/departamento.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PeriodoEvaluacion } from "src/data-access/entities/periodoEvaluacion.entity";
import { Feedback } from "./feedback.entity";



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

    @Column(
        {
            type: 'uuid', 
            unique: true, 
            name:'reset_password_token', 
            nullable: true
        })
    resetPasswordToken: string
    
    @Column({ type: 'timestamp', nullable: true })
    resetPasswordTokenExpiration: Date;


    //Relación
    @ManyToOne(
        () => Departamento,
        ( departamento ) => departamento.user
    )
    departamento: Departamento


    @OneToMany(
        () => PeriodoEvaluacion,
        ( periodoeEvaluacion ) => periodoeEvaluacion.user
    )
    periodoeEvaluacion: PeriodoEvaluacion

    @OneToMany(
        ()=> Feedback,
        (feedback) => feedback.user
    )
    feedback: Feedback

    @BeforeInsert()
    checkFieldsBeforeInsert(){
        this.email = this.email.toLocaleLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdte() {
        this.checkFieldsBeforeInsert();
    }


}
