import bcrypt from "bcryptjs";

/** Hachage de mot de passe (bcrypt, pur JS — pas de binaire natif requis). */
const SALT_ROUNDS = 10;

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
