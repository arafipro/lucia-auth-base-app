"use server";

import { initializeLucia, validateRequest } from "@/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout(): Promise<ActionResult> {
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await initializeLucia().invalidateSession(session.id);

  const sessionCookie = initializeLucia().createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect("/login");
}
