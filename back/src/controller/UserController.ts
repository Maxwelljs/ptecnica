import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { validate } from "class-validator";
import { User } from "../entity/User";

export class UserController {

  static getUsersById = async (request: Request, response: Response) => {
    const userRepository = getRepository(User);
    const { id_user } = request.params;
    try {
      const usuarios = await userRepository.query(`
      select 
      user.id_user,
      user.first_name,
      user.second_name, 
      user.first_last_name, 
      user.second_last_name,
      user.gender,
      user.photo,
      user.date_of_birth,
      user.email, 
      user.phone,
      user.document_number, 
      user.document_type, 
      user.expedition_date,
      status.status,
      rol.name as rol
      from user 
      inner join status on status.user_id  = id_user  
      inner join rol on rol.id_rol = status.rol_id 
      where user.id_user=${id_user};`);
      response.send(usuarios);
    } catch (error) {
      response.status(404).json({ message: "Not result" });
    }
  };

  static getUsers = async (request: Request, response: Response) => {
    const userRepository = getRepository(User);
    try {
      const usuarios = await userRepository.query(`
      select 
      user.id_user,
      user.first_name,
      user.last_name,
      user.photo,
      user.date_of_birth,
      user.email, 
      user.phone,
      user.address,
      user.document_number, 
      rol.name as rol
      from user 
      inner join rol on rol.id_rol = user.rol_id ;`);
      response.send(usuarios);
    } catch (error) {
      response.status(404).json({ message: "Not result" });
    }
  };


}
