import { logout } from "./action";

export const runtime = "edge";

export default async function Page() {
  return (
    <form action={logout}>
      <button>Sign out</button>
    </form>
  );
}
