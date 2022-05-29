import { Form, Link, useLoaderData } from "@remix-run/react";
import { redirect, json } from "@remix-run/node";
import connectDb from "~/db/connectDb.server";
import seedData from "~/db/seed.json";

export async function loader() {
  const db = await connectDb();
  const currentStudentsCount = await db.models.Student.find().countDocuments();
  const seededStudents = seedData;
  return {
    seededStudents,
    currentStudentsCount,
  };
}

export async function action() {
  const db = await connectDb();
//   const form = await request.formData();
  try {
    await db.models.Student.deleteMany();
    await db.models.Student.insertMany(seedData);
    return redirect("/");
  } catch (error) {
    return redirect("/");
    // json({ errors: error.errors, values: Object.fromEntries(form) }, { status: 400 });
  }
}

export default function Seed() {
  const { currentStudentsCount, seededStudents } = useLoaderData();
//   console.log(seededStudents);

  return (
    <div className=" m-0 md:ml-64 w-full px-4 md:px-10 pt-28 md:pt-32">
        <h2 className=" text-2xl font-bold mb-6">Re-seed your student profile</h2>
        <p>You currently have {currentStudentsCount} student profiles.</p>
        <p>
          Do you want to delete your student profile and re-seed with{" "}
          {seededStudents.length} students?
        </p>
        <div className="flex gap-3 mt-3">
          <Link to="/">
            <button className="font-bold hover:opacity-80 transition-all">No</button>
          </Link>
          <Form method="post">
            <button type="submit" className="font-bold hover:opacity-80 transition-all">
              Yes
            </button>
          </Form>
        </div>
    </div>
  );
}