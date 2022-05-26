import { useLoaderData, useParams, useCatch, Form, Link } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { getSession } from "~/sessions.js";
// import deleteIcon from "~/assets/delete-icon.svg";
// import editIcon from "~/assets/edit-icon.svg";
import Breadcrumb from "~/components/Breadcrumb.jsx";
import connectDb from "~/db/connectDb.server.js";

export async function action({ params, request }) {
  const form = await request.formData();
  const db = await connectDb();
  const id = params.studentId;

  if (form.get("_method") === "delete") {
    try {
      await db.models.Student.findByIdAndDelete({
        _id: id,
      });
      return redirect(`/`);
    } catch (error) {
      return json({ errors: error.errors, values: Object.fromEntries(form) }, { status: 400 });
    }
  }
}

export async function loader({ params, request }) {
  const db = await connectDb();
  const student = await db.models.Student.findById(params.studentId);
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  if (!student) {
    throw new Response(`Couldn't find student with id ${params.studentId}`, {
      status: 404,
    });
  }
  return json({ student: student, userId: userId });
}

export default function StudentPage() {
  const loaderData = useLoaderData();
  console.log(loaderData);

  const params = useParams();
  return (
    <div className=" mt-10 ml-48 w-full p-10">
      <Breadcrumb links={[{ to: "/", title: "Back to student list" }]} />
      <img
        src={loaderData?.student?.studentImg}
        alt="Student"
        className=" h-24 w-24 object-cover rounded-full mr-6 block"
      />
      <div className=" flex justify-between">
        <h2 className="text-2xl font-bold mb-4">{loaderData?.student?.fullName}</h2>
        {loaderData?.student?.creatorId === loaderData?.userId ? (
          <div className=" flex items-center">
            <Link to={`/students/${params.studentId}/edit`}>
              <button className=" px-8 py-2 rounded-md text-violet-700 font-bold">Edit</button>
            </Link>
            <Form method="post">
              <input type="hidden" name="_method" value="delete" />
              <button type="submit" className=" px-8 py-2 rounded-md bg-violet-700 text-white font-bold">
                Delete
              </button>
            </Form>
          </div>
        ) : null}
      </div>
      <p>{loaderData?.student?.bio}</p>
      <a href={loaderData?.student?.linkedinLink} target="_blank" rel="noreferrer">
        LinkedIn
      </a>
      <br />
      <a href={loaderData?.student?.websiteLink} target="_blank" rel="noreferrer">
        Personal website
      </a>
      <p>{loaderData?.student?.tags}</p>
      <br />
      {/* <p>{student.dateCreated}</p> */}
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
