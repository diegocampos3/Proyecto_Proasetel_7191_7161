import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Periodo {
    @PrimaryGeneratedColumn('uuid')
    idPeriodo: string;

    @Column({ type: 'date', nullable: false })
    fecha_ini: Date;

    @Column({ type: 'date', nullable: false })
    fecha_fin: Date;
}
