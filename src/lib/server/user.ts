import { db } from "$lib/db";

async function userExists(username: string) {
    const existingUser = await db.query.users.findFirst({
        where: (user, { eq }) => eq(user.username, username)
    });

    return existingUser;
}

export {
    userExists
}