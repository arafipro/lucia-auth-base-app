import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col gap-4">
      <Link href="/sign-up">Sign Up</Link>
      <Link href="/sign-in">Login</Link>
      <Link href="/sign-out">Sign Out</Link>
    </main>
  );
}
