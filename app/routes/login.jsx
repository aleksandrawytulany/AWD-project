import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import bcrypt from "bcryptjs";
import { getSession, commitSession } from "~/sessions.js";
import connectDb from "~/db/connectDb.server.js";

export async function action({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const db = await connectDb();
  const form = await request.formData();

  const user = await db.models.User.findOne({
    username: form.get("username").trim(),
  });

  let isCorrectPassword = false;

  if (user) {
    isCorrectPassword = await bcrypt.compare(
      form.get("password").trim(),
      user.password
    );
  }

  if (user && isCorrectPassword) {
    session.set("userId", user._id);
    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } else {
    return json(
      { errorMessage: "The user wasn't found or password didn't match" },
      { status: 401 }
    );
  }
}

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  return json({
    userId: session.get("userId"),
  });
}

export default function Login() {
  const { userId } = useLoaderData();
  const actionData = useActionData();

  if (userId) {
    return (
      <div>
        <p>You are already logged in as user id {userId}.</p>
        <Link to="/" className="underline">
          Go home
        </Link>
        <Form method="post" action="/logout">
          <button type="submit" className="px-8 py-2 rounded-md bg-violet-700 text-white font-bold block">
            Logout
          </button>
        </Form>
      </div>
    );
  }
  return (
    <div className=" mt-10 ml-48 w-full p-10">
      <h1 className="text-2xl font-bold mb-10">Login to your account</h1>
      {actionData?.errorMessage ? (
        <p className="text-red-500 font-bold my-3">{actionData.errorMessage}</p>
      ) : null}
      <Form method="post" className="text-inherit">
          {/* username */}
        <label htmlFor="username" className="block font-bold text-xs mb-2">
          Username
        </label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Username"
          className="block h-10 w-80 px-4 mr-3 focus:outline-violet-700"
        /><br />

        {/* password */}
        <label htmlFor="username" className="block font-bold text-xs mb-2">
            Password    
        </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          className="block h-10 w-80 px-4 mr-3 focus:outline-violet-700"
        /><br />
        <div className="flex flex-row items-center gap-3">
          <button type="submit" className="px-8 py-2 rounded-md bg-violet-700 text-white font-bold block">
            Log in
          </button>

          <Link to="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </Form>
    </div>
  );
}