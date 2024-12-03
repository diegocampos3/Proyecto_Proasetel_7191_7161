import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class ObjetivosEmpr {
    @PrimaryGeneratedColumn('uuid')
    idObjEmp: string;

    @Column({ type: 'text', nullable: false })
    titulo: string;

    @Column({ type: 'text', nullable: true })
    descripcion: string;
}
