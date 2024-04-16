export async function hashPassword(password: string) {
    return await Bun.password.hash(password, {
        algorithm: "argon2id"
    });
}

export async function verifyPassword(hash: string, password: string) {
    return await Bun.password.verify(password, hash, "argon2id")
}