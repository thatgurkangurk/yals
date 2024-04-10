import { getUser } from "@/lib/auth/config";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const { user } = await getUser();

  if (!user) {
    return redirect("/");
  }

  return <h1 className="text-5xl">welcome to yals, {user.username}</h1>;
}
