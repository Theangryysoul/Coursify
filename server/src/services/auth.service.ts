import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { RegisterUserInput } from "../types/auth.types.js";

export const registerUser = async (userData: RegisterUserInput) => {
  const { name, email, password } = userData;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const { password: _, ...safeUser } = user.toObject();

  return safeUser;
};