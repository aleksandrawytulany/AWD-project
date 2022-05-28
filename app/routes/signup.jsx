import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import bcrypt from "bcryptjs";
import { getSession, commitSession } from "~/sessions.js";
import connectDb from "~/db/connectDb.server.js";

export async function action({ request }) {
  const db = await connectDb();
  const session = await getSession(request.headers.get("Cookie"));
  const form = await request.formData();

  if (form.get("password").trim() !== form.get("repeatPassword").trim()) {
    return json(
      { errorMessage: "The entered passwords are not equal" },
      { status: 400 }
    );
  }

  if (form.get("password").trim()?.length < 4) {
    return json(
      { errorMessage: "Password must be at least 4 characters" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(form.get("password").trim(), 10);

  try {
    const user = await db.models.User.create({
      username: form.get("username").trim(),
      password: hashedPassword,
    });
    if (user) {
      session.set("userId", user._id);
      return redirect("/", {
        secret: process.env.COOKIE_SECRET,
        status: 302,
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    } else {
      return json(
        { errorMessage: "Can't create the user" },
        { status: 400 }
      );
    }
  } catch (error) {
    return json(
      {
        errorMessage:
          error.message ??
          error.errors?.map((error) => error.message).join(", "),
      },
      { status: 400 }
    );
  }
}

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.get("userId")) {
    return redirect("/");
  }
  return null;
}

export default function Signup() {
  const actionData = useActionData();

  return (
    <div className=" flex flex-col justify-center items-center w-full h-screen">
      <h1 className="text-2xl font-bold mb-10">✏️ Sign up to the platform</h1>
      {actionData?.errorMessage ? (
        <p className="text-red-500 font-bold my-3">{actionData.errorMessage}</p>
      ) : null}
      <Form method="post" className="text-inherit">
        <label htmlFor="username" className="block font-bold text-xs mb-2">
          Username
        </label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Username"
          className="block h-10 w-80 px-4 focus:outline-violet-700"
        /><br />

        <label htmlFor="studentImg" className="block font-bold text-xs mb-2">
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          className="block h-10 w-80 px-4 focus:outline-violet-700"
        /><br />

        <label htmlFor="studentImg" className="block font-bold text-xs mb-2">
          Repeat password
        </label>
        <input
          type="password"
          name="repeatPassword"
          id="repeatPassword"
          placeholder="Repeat password"
          className="block h-10 w-80 px-4 focus:outline-violet-700"
        /><br />

        <div className="flex flex-row items-center justify-center">
          <button type="submit" className="px-8 py-2 rounded-md bg-violet-700 text-white font-bold block hover:opacity-80 transition-all">
            Sign up
          </button>
          
          <Link to="/login" className="px-8 py-2 rounded-md text-violet-700 font-bold">
            Log in
          </Link>
        </div>
      </Form>
    </div>
  );
}