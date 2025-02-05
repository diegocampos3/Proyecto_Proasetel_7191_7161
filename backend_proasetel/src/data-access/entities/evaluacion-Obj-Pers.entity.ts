// import {Entity,Column,PrimaryColumn,ManyToOne,JoinColumn,} from 'typeorm';
// import { ObjetivosPers } from './objetivosPers.entity';
// import { EvaluacionPers } from './evaluacionPers.entity';
  
// @Entity('evaluacion_objetivo_pers')
// export class EvaluacionObjetivoPers {
//     @PrimaryColumn({ type: 'uuid' })
//     idEvaPer: string;

//     @PrimaryColumn({ type: 'uuid' })
//     idObjPer: string;

//     @Column({ type: 'float', nullable: false })
//     nivelLogro: number;

//     @ManyToOne(() => ObjetivosPers, (objetivo) => objetivo.idObjPer, { onDelete: 'CASCADE' })
//     @JoinColumn({ name: 'idObjPer' })
//     objetivo: ObjetivosPers;

//     @ManyToOne(() => EvaluacionPers, (evaluacion) => evaluacion.idEvaPer, { onDelete: 'CASCADE' })
//     @JoinColumn({ name: 'idEvaPer' })
//     evaluacion: EvaluacionPers;
// }
  