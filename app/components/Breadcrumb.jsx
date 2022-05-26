import React from "react";
import { Link } from "@remix-run/react";

export default function Breadcrumb({ links = [] }) {
  const breadcrumbs = [...links];

  return (
    <nav className="mb-4 text-sm font-semibold">
      {breadcrumbs.map((link, i) => (
        <React.Fragment key={i}>
          {i !== 0 && (
            <span className="inline-block mx-2 text-gray-400">/</span>
          )}
          <Link to={link.to} className=" text-violet-700 hover:underline transition-all">
            {link.title}
          </Link>
        </React.Fragment>
      ))}
    </nav>
  );
}