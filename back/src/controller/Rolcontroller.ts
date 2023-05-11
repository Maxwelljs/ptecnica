import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { validate } from "class-validator";
import { Rol } from "../entity/Rol";

export class RolController {

  static registerRol = async (request: Request, response: Response) => {
    const rolRepository = getRepository(Rol);
    const { name, description } = request.body;

    let rols: Rol = new Rol();
    rols.name = name
    rols.description = description

    //Validate
    const validationOpt = { validationError: { target: false, value: false } };
    const errors = await validate(request, validationOpt);
    if (errors.length > 0) {
      response.status(400).json(errors);
    }
    try {
      rols = await rolRepository.save(rols);
    } catch (error) {
      return response.status(409).json(error);
    }

    return response.send({
      message: 'OK'
    });
  };


}