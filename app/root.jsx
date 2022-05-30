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
import { useState } from "react";
import { json, redirect } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";
import styles from "~/tailwind.css";
import { getSession } from "~/sessions.server.js";
import logo from "~/assets/logo.svg";
import menuIcon from "~/assets/menu-icon.svg";

export const links = () => [
  {
    rel: "stylesheet",
    href: styles,
  },
  {
    rel: "manifest",
    href: "/site.webmanifest?v=2",
  },
  {
    rel: "apple-touch-icon",
    sizes: "180x180",
    href: "/manifest/apple-touch-icon.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "32x32",
    href: "/manifest/favicon-32x32.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "16x16",
    href: "/manifest/favicon-16x16.png",
  },
  {
    rel: "manifest",
    href: "/manifest/site.webmanifest",
  },
  {
    rel: "mask-icon",
    href: "/manifest/safari-pinned-tab.svg",
    color: "#5bbad5",
  },
];

export const meta = () => [
  {
    charSet: "utf-8",
    title: "Student Market",
    viewport: "width=device-width,initial-scale=1",
  },
  {
    name: "msapplication-TileColor",
    content: "#9f00a7",
  },
  {
    name: "theme-color",
    content: "#ffffff",
  },
];

export async function loader({ request }) {
  const db = await connectDb();
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  const user = await db.models.User.findById(userId);
  return json(user);
}

export default function App() {
  const user = useLoaderData();
  const [menuOpen, setMenuOpen] = useState();

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
          <nav className=" w-full bg-white shadow-md h-20 text-right fixed py-2 px-4 md:px-10 flex items-center md:justify-end">
            <img src={menuIcon} alt="Menu icon" className=" md:hidden block" onClick={() => setMenuOpen(true)} />
            <strong className=" hidden md:inline text-violet-700">Hi there! You're logged in now 🧑🏼‍🎓</strong>
          </nav>
          <header className= {
            menuOpen 
              ? "h-full bg-white tp-0 left-0 fixed px-8 md:px-10 py-8 shadow-xl flex flex-col justify-between w-full md:w-auto"
              : "hidden h-full bg-white tp-0 left-0 fixed px-10 py-8 shadow-xl md:flex flex-col justify-between"
          }>
              <div className=" flex justify-between items-center">
                <img src={logo} alt="Pltform logo" className=" md:mb-10 w-56 md:w-auto" />
                <span onClick={() => setMenuOpen(false)} className={menuOpen ? "block ml-auto mr-0 float-right" : "hidden"}>❌</span><br /><br />
              </div>
              <div>
                  <Link to="/" className=" hover:opacity-70 block mb-4 font-bold text-xl" onClick={() => setMenuOpen(false)}>
                    <h3>🏠 Home</h3>
                  </Link>
                  <Link to="/students/new" className=" hover:opacity-70 block mb-4 font-bold text-xl" onClick={() => setMenuOpen(false)}>
                    <h3>➕ New student</h3>
                  </Link>
                  <Link to="/account" className=" hover:opacity-70 block mb-4 font-bold text-xl" onClick={() => setMenuOpen(false)}>
                    <h3>👩‍🎓 Account</h3> 
                  </Link>
                  {/* <img src={studentPic} alt="Student graphic" className=" block mb-4 mt-20 w-44" /> */}
                
                <Form method="post" action="/logout">
                  <button type="submit" className=" flex items-center hover:opacity-70 font-bold text-xl">
                    <h3>🖐️ Logout</h3>
                  </button>
                </Form>
              </div>
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