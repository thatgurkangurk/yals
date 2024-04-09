import { getUser, lucia } from "@/lib/auth/config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET() {
  const { session } = await getUser();

  if (!session)
    return NextResponse.json(
      {
        error: "Unauthorised",
      },
      {
        status: 403,
      }
    );

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  redirect("/auth");

  //   return NextResponse.json(
  //     {
  //       message: "successfully signed out",
  //     },
  //     {
  //       status: 200,
  //     }
  //   );
}
