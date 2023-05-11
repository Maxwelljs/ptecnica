import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn,JoinColumn, ManyToOne } from "typeorm";
import { IsEmail } from "class-validator";
import * as bcrypt from "bcryptjs"
import { Rol } from "./Rol";

@Entity()
@Unique(['email','document_number'])

export class User{

    @PrimaryGeneratedColumn()
    id_user: number;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column()
    date_of_birth: Date;

    @Column()
    document_number: string;

    @Column()
    address: string;

    @Column()
    @IsEmail()
    email: string;

    @Column()
    phone: string;

    @Column()
    password: string;

    @Column()
    photo: string;

    @ManyToOne(() => Rol, (Rol) => Rol.id_rol,{cascade: false}) @JoinColumn({name: 'rol_id', referencedColumnName: 'id_rol'})
    @Column()
    rol_id: number;


    hashPassword(): void {
        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
    }

    checkPassword(password: string): boolean {
        return bcrypt.compareSync(password, this.password);
    }

}