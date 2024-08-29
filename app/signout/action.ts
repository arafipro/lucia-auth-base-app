"use server";

import { initializeLucia, validateRequest } from "@/auth";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout(): Promise<ActionResult> {
  const { env } = getRequestContext();
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await initializeLucia(env.DB).invalidateSession(session.id);

  const sessionCookie = initializeLucia(env.DB).createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect("/login");
}
