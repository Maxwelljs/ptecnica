import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Rol{
    @PrimaryGeneratedColumn()
    id_rol: number;

    @Column()
    name: string;

    @Column()
    description: string;
}