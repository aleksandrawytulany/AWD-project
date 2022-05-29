import { useLoaderData, useParams, useCatch, Form, Link } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { getSession } from "~/sessions.js";
import linkIcon from "~/assets/link-icon.svg";
import linkedinIcon from "~/assets/linkedin-icon.svg";
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
  const params = useParams();
  // console.log(loaderData);

  return (
    <div className=" ml-64 w-full px-10 pt-32">
      <Breadcrumb links={[{ to: "/", title: "👈 Back to student list" }]} />
      <div className=" w-full mb-6 px-6 py-4 bg-white shadow-md rounded-xl hover:shadow-lg transition-all">
      <img
        src={loaderData?.student?.studentImg}
        alt="Student"
        className=" h-24 w-24 object-cover rounded-full mr-6 block"
      /><br />
      <div className=" flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{loaderData?.student?.fullName} <span className=" font-normal text-base">{loaderData?.student?.title}</span></h2>
        {loaderData?.student?.creatorId === loaderData?.userId ? (
          <div className=" flex items-center">
            <Link to={`/students/${params.studentId}/edit`}>
              <button className=" px-8 py-2 rounded-md text-violet-700 font-bold">
              ✍️ Edit
              </button>
            </Link>
            <Form method="post">
              <input type="hidden" name="_method" value="delete" />
              <button type="submit" className=" px-8 py-2 rounded-md bg-violet-700 text-white font-bold hover:opacity-80 transition-all">
              🗑️ Delete
              </button>
            </Form>
          </div>
        ) : null}
      </div>
      <p>{loaderData?.student?.bio}</p><br />
      {loaderData?.student.tags.split(",").map(( tag, key ) => {
      // console.log(tag);
        return (
            <p key={key} className=" px-2 py-1 bg-violet-300 text-violet-700 font-bold text-xs rounded-lg inline mr-2">{tag}</p>
          ) 
        })}<br /><br />
      <a href={loaderData?.student?.linkedinLink} target="_blank" rel="noreferrer" className=" flex items-center">
        <img src={linkedinIcon} alt="LinkediIn" className=" mr-1" />
        <strong>LinkedIn</strong>
      </a>
      <a href={loaderData?.student?.websiteLink} target="_blank" rel="noreferrer" className=" flex items-center">
        <img src={linkIcon} alt="Link" className=" mr-1" />
        <strong>Portfolio</strong>
      </a>
      </div>
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
