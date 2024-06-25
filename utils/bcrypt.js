import "dotenv/config";
import bcrypt from "bcrypt";

export function createHash(password) {
  const saltRounds = 10;
  return bcrypt.hashSync(password, saltRounds);
}
export async function verifyHash(password, passwordFromDatabase) {
  const result = await bcrypt.compare(password, passwordFromDatabase);
  if (result) {
    return result;
  } else {
    return false;
  }
}
