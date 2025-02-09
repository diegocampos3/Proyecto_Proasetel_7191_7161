import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ObjtivosEmpDep } from "./objtivos-emp-dep.entity";
import { User } from "./usuario.entity";
import { ResultadoEvaluacion } from "./resultado_evaluacion.entity";
import { EvaluacionFinalObjPers } from "./evaluacion-final-obj-pers.entity";

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

    @Column({
        type: 'boolean',
        nullable: true,
        default: null
    })
    evaluado_empleado: boolean;

    @Column({
        type: 'boolean',
        nullable: true,
        default: null
    })
    evaluado_supervisor: boolean;

    @OneToMany(
        () => ResultadoEvaluacion,
        (resultadoEvaluacion) => resultadoEvaluacion.objetivoPersonalPropuesto
    )
    resultadoEvaluacion: ResultadoEvaluacion

    @OneToMany(
        () => EvaluacionFinalObjPers,
        (evaluacionesFinales) => evaluacionesFinales.objetivoPersonalPropuesto
    )
    evaluacionesFinales: EvaluacionFinalObjPers

    @BeforeInsert()
    checkFieldsBeforeInsert(){
        this.titulo = this.titulo.toLocaleLowerCase()
    }

    @BeforeUpdate()
    checkFielsBeforeUpdate(){
        this.checkFieldsBeforeInsert();
    }


}
