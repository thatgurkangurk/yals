import { getUser } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const { user } = await getUser();

  if (!user) {
    return redirect("/");
  }

  const dbUser = await db.query.userTable.findFirst({
    where: (userInTable, { eq }) => eq(userInTable.id, user.id),
  });

  if (!dbUser) {
    return redirect("/");
  }

  return (
    <>
      <h1 className="text-5xl">welcome to yals, {user.username}</h1>
      <p>your current role is: {dbUser.role}</p>
    </>
  );
}
