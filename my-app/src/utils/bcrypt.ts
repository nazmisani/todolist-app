import bcrypt from "bcryptjs";

export async function hashPassword(password: string) {
  return bcrypt.hashSync(password, 10);
}

export async function comparePassword(
  password: string,
  hashedPassword: string
) {
  return bcrypt.compareSync(password, hashedPassword);
}
