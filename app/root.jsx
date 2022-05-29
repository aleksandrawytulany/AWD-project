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

export default function App( {setMenuOpen, menuOpen} ) {
  const user = useLoaderData();
  // console.log(user);
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-slate-100 text-gray-900 font-sans flex justify-between">  
        {user ? (
        <div>
          <nav className=" hidden lg:w-full bg-white shadow-md h-20 text-right fixed py-2 px-10 lg:flex items-center justify-end">
            <strong className=" text-violet-700">Hi there! You're logged in now 🧑🏼‍🎓</strong>
          </nav>
          <header className= {
            menuOpen 
              ? "h-full bg-white tp-0 left-0 fixed px-10 py-20 shadow-xl flex flex-col justify-between"
              : "hidden h-full bg-white tp-0 left-0 fixed px-10 py-20 shadow-xl lg:flex flex-col justify-between"
          }>
              <div>
              <span 
              onClick={() => setMenuOpen(false)}
              className={menuOpen ? "block ml-auto mr-0" : "hidden"}>❌<br /><br /></span>
                <Link to="/" className=" hover:opacity-70 block mb-4 font-bold text-xl">
                  <h3>🏠 Home</h3>
                </Link>
                <Link to="/students/new" className=" hover:opacity-70 block mb-4 font-bold text-xl">
                  <h3>➕ New student</h3>
                </Link>
                <Link to="/account" className=" hover:opacity-70 block mb-4 font-bold text-xl">
                  <h3>👩‍🎓 Account</h3> 
                </Link>
                {/* <img src={studentPic} alt="Student graphic" className=" block mb-4 mt-20 w-44" /> */}
              </div>
              <Form method="post" action="/logout">
                <button type="submit" className=" flex items-center hover:opacity-70 font-bold text-xl">
                  <h3>🖐️ Logout</h3>
                </button>
              </Form>
          </header>
        </div>
        ) : null }
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}