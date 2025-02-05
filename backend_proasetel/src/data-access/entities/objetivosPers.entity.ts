import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinColumn, JoinTable, OneToMany } from "typeorm";
import { ObjetivosDep } from "./objetivosDep.entity";
// import { EvaluacionObjetivoPers } from "./evaluacion-Obj-Pers.entity";
import { User } from "./usuario.entity";
import { ResultadoEvaluacion } from "./resultado_evaluacion.entity";
import { EvaluacionFinalObjPers} from "./evaluacion-final-obj-pers.entity";



@Entity()
export class ObjetivosPers {
    @PrimaryGeneratedColumn('uuid')
    idObjPer: string;


    @ManyToOne(
        () => ObjetivosDep, 
        (objetivoDep) => objetivoDep.objetivoPers
    )
    @JoinColumn({ name: 'objetivoDepId' })
    objetivoDep: ObjetivosDep;

    @ManyToOne(
        () => User,
        (user) => user.objpers
    )
    user: User

    // @OneToMany(
    //     () => EvaluacionObjetivoPers,
    //     (evaluacionObjetivoPers) => evaluacionObjetivoPers.objetivo,
    // )
    // evaluacionObjetivoPers: EvaluacionObjetivoPers[];

    @OneToMany(
        () => ResultadoEvaluacion,
        (resultadoEvaluacion) => resultadoEvaluacion.objetivoPersonal
    )
    resultadoEvaluacion: ResultadoEvaluacion

    @OneToMany(
        () => EvaluacionFinalObjPers,
        (evaluacionesFinales) => evaluacionesFinales.objetivoPersonal
    )
    evaluacionesFinales: EvaluacionFinalObjPers
    
}
