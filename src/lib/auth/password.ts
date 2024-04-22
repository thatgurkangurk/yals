export async function hashPassword(password: string) {
  return await Bun.password.hash(password, {
    algorithm: "argon2id",
  });
}

export async function verifyPassword(password: string, hash: string) {
  return await Bun.password.verify(password, hash);
}
