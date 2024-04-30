import { hash, verify } from "@node-rs/argon2";

async function hashPassword(password: string) {
    return await hash(password);
}

async function verifyPassword(hash: string, password: string) {
    return await verify(hash, password);
}

export {
    hashPassword,
    verifyPassword
}