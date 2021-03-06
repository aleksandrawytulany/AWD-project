import { redirect } from "@remix-run/node";
import { getSession, destroySession } from "~/sessions.server.js";

export async function action({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export function loader() {
  return redirect("/login");
}