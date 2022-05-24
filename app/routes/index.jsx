import { useLoaderData, Link } from "@remix-run/react";
import connectDb from "~/db/connectDb.server.js";

export async function loader() {
  const db = await connectDb();
  const students = await db.models.Student.find();
  return students;
}

export default function Index() {
  const students = useLoaderData();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Student Market</h1>
      <h2 className="text-lg font-bold mb-3">
        Students to hire:
      </h2>
      <ul className="ml-5 list-disc">
        {students.map((student) => {
          return (
            <li key={student._id}>
              <Link
                to={`/students/${student._id}`}
                className="text-blue-600 hover:underline">
                {student.fullName}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
