import { useLoaderData, useCatch } from "@remix-run/react";
import { json } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";

export async function loader({ params }) {
  const db = await connectDb();
  const student = await db.models.Student.findById(params.studentId);
  if (!student) {
    throw new Response(`Couldn't find student with id ${params.studentId}`, {
      status: 404,
    });
  }
  return json(student);
}

export default function StudentPage() {
  const student = useLoaderData();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{student.fullName}</h1>
      <code>
        <pre>{JSON.stringify(student, null, 2)}</pre>
      </code>
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <div>
      <h1>
        {caught.status} {caught.statusText}
      </h1>
      <h2>{caught.data}</h2>
    </div>
  );
}

export function ErrorBoundary({ error }) {
  return (
    <h1 className="text-red-500 font-bold">
      {error.name}: {error.message}
    </h1>
  );
}
