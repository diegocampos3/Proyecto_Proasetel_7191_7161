import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Feedback } from "../../feedback/entities/feedback.entity";

@Entity()
export class AnalisisSentimientos {

    @PrimaryGeneratedColumn('uuid')
    idAnalisis: string;

    @ManyToOne(() => Feedback, (feedback) => feedback.idFeedback)
    idFeedback: Feedback;

    @Column({ type: 'float', nullable: false })
    resultado: number;
}

