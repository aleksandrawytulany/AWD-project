import {
  Links,
  Link,
  Form,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";
import homeIcon from "~/assets/home-icon.svg";
// import profileIcon from "~/assets/profile-icon.svg";
import logoutIcon from "~/assets/logout-icon.svg";
import styles from "~/tailwind.css";
import { getSession } from "~/sessions.js";

export const links = () => [
  {
    rel: "stylesheet",
    href: styles,
  },
];

export function meta() {
  return {
    charset: "utf-8",
    title: "Student Market",
    viewport: "width=device-width,initial-scale=1",
  };
}

export async function loader({ request }) {
  const db = await connectDb();
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  const user = await db.models.User.findById(userId);
  return json(user);
}

export default function App() {
  const user = useLoaderData();
  // console.log(user);
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-slate-100 text-gray-900 font-sans flex justify-between">
        <nav className=" w-full bg-white shadow-md h-20 text-right fixed p-2 flex items-center justify-end">
          {user ? (
            <nav className=" w-full bg-white shadow-md h-20 text-right fixed p-2 flex items-center justify-end">
              <p>Hi user!</p>
            </nav>
          ) : (
            <nav className=" w-full bg-white shadow-md h-20 text-right fixed p-2 flex items-center justify-end">
            </nav>
          // <Link to="/signup" className="underline">
          //   Sign up
          // </Link>
          )
        }
        </nav>
        <header className=" h-full bg-white tp-0 left-0 fixed block px-10 py-20 shadow-xl">
          <Link to="/" className=" hover:opacity-70 block mb-4 font-bold text-xl">
            <div className=" flex items-center">
              <img src={homeIcon} alt="Home" className=" mr-2" />
              <h3>Home</h3>
            </div>
          </Link>
          <Link to="/students/new" className=" hover:opacity-70 block mb-4 font-bold text-xl">
            New student
          </Link>
          <Form method="post" action="/logout">
            <button type="submit" className=" flex items-center hover:opacity-70 font-bold text-xl">
              <img src={logoutIcon} alt="Home" className=" mr-2" />
              <h3>Logout</h3>
            </button>
          </Form>
        </header>
        
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}