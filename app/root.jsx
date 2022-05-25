import {
  Links,
  Link,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import styles from "~/tailwind.css";

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

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-slate-100 text-gray-900 font-sans flex justify-between">
        <header className=" h-full bg-white tp-0 left-0 fixed block px-10 py-20">
          <Link to="/" className=" hover:opacity-70 block mb-4 font-bold text-xl">
            Home
          </Link>
          <Link to="/students/new" className=" hover:opacity-70 block font-bold text-xl">
            New student
          </Link>
        </header>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
