import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Feedback } from "./feedback.entity";

@Entity()
export class AnalisisSentimientos {

    @PrimaryGeneratedColumn('uuid')
    idAnalisis: string;

    @ManyToOne(() => Feedback, (feedback) => feedback.idFeedback)
    @JoinColumn({ name: 'idFeedback' })
    idFeedback: Feedback;

    @Column({ type: 'boolean', nullable: false })
    resultado: boolean;
}

