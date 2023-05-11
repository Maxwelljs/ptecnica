import { getRepository } from "typeorm";
import { Request, Response } from "express";
import config from "./../config/config";
import * as jwt from "jsonwebtoken";
import { validate } from "class-validator";
import { User } from "../entity/User";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import { request } from "http";

/* 
*Author: Jaider Steven Mazabuel Muñoz
*Email: mazabueljs@gmail.com
*Descripcion: Controlador de usuario aqui se encuentras todas 
              las funciones en cuestion del ingreso y registro
              social y natural de usuario.
*Fecha de creacion: 11/05/2023
*Fecha de modificacion: 11/05/2023
*/

class AuthController {

    static login = async (request: Request, response: Response) => {

        const { email, password } = request.body;
        if (!(email && password)) {
            return response.status(400).json({ message: 'Username or password incorrect!' })
        }

        const userRepository = getRepository(User);
        let user: User;

        try {
            user = await userRepository.findOneOrFail({ where: { email } })
        } catch {
            return response.status(400).json({ message: 'Username or password incorrect!' })
        }

        if (!user.checkPassword(password))
            return response.status(400).json({ message: 'Username or password incorrect!' })

        const token = jwt.sign({ userId: user.id_user, email: user.email, document_number: user.document_number}, config.jwtSecret, { expiresIn: '1h' });
        return response.send({
            message:'OK',
            user_id: user.id_user,
            token: token
        });
    }


    static verify = async (idToken: any) => {
        const CLIENT_ID = "459267423423-bsj9e152oqnngsdiu7rm53r7mpabf0lh.apps.googleusercontent.com";
        const client = new OAuth2Client(CLIENT_ID);
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: CLIENT_ID
        })

        const payload = ticket.getPayload();
        return payload;
    }

    static loginSocial = async (request: Request, response: Response) => {
        const userRepository = getRepository(User);
        let usuarios: User; 
        const { idToken } = request.params;
        this.verify(idToken).then(async (payload: TokenPayload) => {
            usuarios = await userRepository.findOne({ where: { email: payload.email } });
            if (!usuarios) {
                usuarios = new User();
                usuarios.email = payload.email;
                usuarios.first_name = payload.name;
                usuarios.password = "";
                usuarios = await userRepository.save(usuarios);
            }

            const token = jwt.sign({ userId: usuarios.id_user, email: usuarios.email }, config.jwtSecret, { expiresIn: '1h' });
            return response.send({ message: 'OK',
                                    idusuarios: usuarios.id_user, 
                                    primer_nombre: usuarios.first_name, 
                                    primer_apellido: usuarios.last_name, 
                                    email: usuarios.email, 
                                    token: token });
        }).catch(error => {
            console.log(error);
            return response.status(404).json({ message: 'error' })
        });
    };
    

    static login_describe_user = async (request: Request, response: Response) =>{
        const userRepository = getRepository(User);
        const { id_user } = request.params;
        try {
            const user = await userRepository.query(`
            select 
            first_name, 
            second_name,
            first_last_name,
            second_last_name,
            email, 
            status.status,
            rol.name as rol
            from user
            inner join status on status.user_id = user.id_user
            inner join rol on rol.id_rol = status.rol_id
            where user.id_user = ${id_user};`)
            response.send(user[0]);
        } catch {
            return response.status(400).json({ message: 'Username not found!' })
        }
    }


    static register = async (request: Request, response: Response) => {
        const userRepository = getRepository(User);
        const { first_name, last_name,date_of_birth, document_number, address, email, phone,rol_id,photo, password } = request.body;

        let user: User = new User();
console.log(user)
        user.first_name = first_name;
        user.last_name = last_name;
        user.date_of_birth = date_of_birth;
        user.document_number = document_number;
        user.address = address;
        user.email = email;
        user.phone = phone;
        user.rol_id = rol_id;
        user.photo = photo;
        user.password = password;

        //Validate
        const validationOpt = { validationError: { target: false, value: false } };
        const errors = await validate(user, validationOpt);
        if (errors.length > 0) {
            response.status(400).json(errors);
        }

        try {
            user.hashPassword();
            user = await userRepository.save(user);
        } catch (error) {
            return response.status(409).json(error)
        }

        user.password = null;

        const token = jwt.sign({ userId: user.id_user, email: user.email }, config.jwtSecret, { expiresIn: '1h' });
        return response.send({
            message:'OK',
            user_id: user.id_user,
            first_name : user.first_name,
            last_name : user.last_name,
            email : user.email,
            token: token
        });
    };
}

export default AuthController;