import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { serverSettingsTable } from "@/lib/schema";
import { getServerSettingsOrInit } from "@/lib/settings";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

async function RegistrationEnabledSetting() {
  const serverSettings = await getServerSettingsOrInit();

  const { registrationEnabled } = serverSettings;

  async function toggleRegistration() {
    "use server";
    const { user } = await getUser();
    if (!user || user.role !== "admin") redirect("/dashboard");

    await db
      .update(serverSettingsTable)
      .set({
        registrationEnabled: !registrationEnabled,
      })
      .where(eq(serverSettingsTable.id, 1));

    revalidatePath("/", "layout");
    redirect("/dashboard/server/settings");
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Server Registration</CardTitle>
        <CardDescription className="max-w-lg text-balance leading-relaxed">
          If this is disabled, no one will be able to make a new account on this
          server. Useful for private instances.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <form action={toggleRegistration}>
          {registrationEnabled ? (
            <Button type="submit" variant={"destructive"}>
              Disable Registration
            </Button>
          ) : (
            <Button type="submit">Enable Registration</Button>
          )}
        </form>
      </CardFooter>
    </Card>
  );
}

export default async function ServerSettings() {
  const { user } = await getUser();

  if (!user || user.role !== "admin") redirect("/dashboard");

  return (
    <>
      <h1 className="text-4xl">server settings</h1>

      <div className="pt-4 grid md:grid-cols-4 gap-2">
        <RegistrationEnabledSetting />
      </div>
    </>
  );
}
