import { getUser } from "@/lib/auth/config";
import { redirect } from "next/navigation";

export default async function ServerSettings() {
  const { user } = await getUser();

  if (!user || user.role !== "admin") redirect("/dashboard");

  return (
    <div>
      <h1 className="text-4xl">server settings</h1>
      <p>wip</p>
    </div>
  );
}
