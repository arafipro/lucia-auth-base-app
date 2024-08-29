"use server";

import { initializeLucia } from "@/auth";
import { db } from "@/drizzle/db";
import { userTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { Scrypt } from "lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData): Promise<ActionResult> {
  const username = formData.get("username");
  if (
    typeof username !== "string" ||
    username.length < 3 ||
    username.length > 31 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    return {
      error: "Invalid username",
    };
  }
  const password = formData.get("password");
  console.log("login", username, password);
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return {
      error: "Invalid password",
    };
  }

  const existingUser = await db
    .select()
    .from(userTable)
    .where(eq(userTable.username, username.toLowerCase()))
    .get();
  if (!existingUser) {
    return {
      error: "Incorrect username or password",
    };
  }
  const validPassword = await new Scrypt().verify(
    existingUser.password_hash,
    password
  );
  if (!validPassword) {
    return {
      error: "Incorrect username or password",
    };
  }

  const session = await initializeLucia().createSession(existingUser.id, {});
  const sessionCookie = initializeLucia().createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect("/");
}
