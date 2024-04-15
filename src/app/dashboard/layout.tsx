import { getUser } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
  return <>{children}</>;
}
