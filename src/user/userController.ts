/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import UserModel, { User } from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  //validation
  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }

  //database call
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      const error = createHttpError(400, "User Already Exist With This Email");
      return next(error);
    }
  } catch (error) {
    return next(createHttpError(500, "Error while getting user"));
  }
  //hash password
  const hashPassword = await bcrypt.hash(password, 10);

  let newUser: User;
  try {
    // create new user in database
    newUser = await UserModel.create({
      name,
      email,
      password: hashPassword,
    });
  } catch (error) {
    return next(createHttpError(500, "Error while creating user"));
  }

  try {
    //token generation
    const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
      expiresIn: "7d",
      algorithm: "HS256",
    });

    //response
    res.json({ accessToken: token });
  } catch (error) {
    return next(createHttpError(500, "Error while token generation"));
  }
};

export { createUser };
