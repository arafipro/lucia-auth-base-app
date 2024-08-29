import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col gap-4">
      <Link href="/signup">Sign Up</Link>
      <Link href="/login">Login</Link>
      <Link href="/signout">Sign Out</Link>
    </main>
  );
}
