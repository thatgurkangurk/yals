import { db } from "$lib/db";
import { users } from "$lib/db/schema/user";
import { generateId, type User } from "lucia";
import { hashPassword } from "./password";

async function userExists(username: string) {
    const existingUser = await db.query.users.findFirst({
        where: (user, { eq }) => eq(user.username, username)
    });

    return existingUser;
}

async function createUser({
    username,
    password
}: {
    username: string,
    password: string
}): Promise<{
    success: true,
    user: User
} | {
    success: false,
    cause: "USER_EXISTS" | "UNEXPECTED_ERROR"
}> {
    if (await userExists(username)) return {
        success: false,
        cause: "USER_EXISTS"
    }

    const id = generateId(15);
    const hashedPassword = await hashPassword(password);

    try {
        const insertedUser = await db.insert(users).values({
            id: id,
            username: username,
            hashed_password: hashedPassword
        }).returning({
            id: users.id,
            username: users.username,
            role: users.role
        })

        return {
            success: true,
            user: insertedUser[0]
        }
    } catch (e) {
        return {
            success: false,
            cause: "UNEXPECTED_ERROR"
        }
    }


}

export {
    userExists,
    createUser
}