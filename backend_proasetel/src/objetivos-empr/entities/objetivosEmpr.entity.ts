import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ObjetivosEmpr {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    titulo: string;

    @Column('text')
    descripcion: string;

    @BeforeInsert()
    checkTitutuloInsert() {
        this.titulo = this.titulo.toLocaleLowerCase();
    }

}