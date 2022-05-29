import { redirect, json } from "@remix-run/node";
import { useActionData, Form } from "@remix-run/react";
import { getSession } from "~/sessions.js";
import connectDb from "~/db/connectDb.server.js";

export async function action({ request }) {
  const db = await connectDb();
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  const form = await request.formData();
  const studentImg = form.get("studentImg");
  const fullName = form.get("fullName");
  const title = form.get("title");
  const bio = form.get("bio");
  const linkedinLink = form.get("linkedinLink");
  const websiteLink = form.get("websiteLink");
  const tags = form.get("tags");
  const date = new Date();
  const creatorId = userId;
  // const date_updated = Date.now();
  let dateCreated =
    // date.getFullYear() + " " + date.toLocaleString("default", { month: "short" }) + " " + date.getDate();
    date.toLocaleString("default", { month: "short" }) + " " + date.getFullYear() + "," + date.getDate();
  try {
    const newStudent = await db.models.Student.create({
      studentImg,
      fullName,
      title,
      bio,
      linkedinLink,
      websiteLink,
      tags,
      dateCreated,
      creatorId,
    });
    return redirect(`/students/${newStudent._id}`);
  } catch (error) {
    return json({ errors: error.errors, values: Object.fromEntries(form) }, { status: 400 });
  }
}

export async function loader( request ) {
  const db = await connectDb();
  return db.models.Student.find();
}

export default function CreateStudent() {
  const actionData = useActionData();
  return (
    <div className=" ml-64 w-full px-10 pt-32">
      <h1 className="text-2xl font-bold mb-10">Create student profile</h1>
      <Form method="post">

        {/* profile picture */}
        <label htmlFor="studentImg" className="block font-bold text-xs mb-2">
          Image
        </label>
        <input
          type="text"
          name="studentImg"
          defaultValue={actionData?.values.studentImg}
          id="studentImg"
          placeholder="Drop your picture url here"
          className={
            actionData?.errors?.studentImg
              ? "border-2 border-red-500"
              : "h-10 w-80 px-4 focus:outline-violet-700"
          }
        />
        <br />
        <br />
        {actionData?.errors?.studentImg && (
          <p className="text-red-500">{actionData?.errors?.studentImg.message}</p>
        )}

        {/* full name  */}
        <label htmlFor="fullName" className="block font-bold text-xs mb-2">
          Full Name
        </label>
        <input
          type="text"
          name="fullName"
          defaultValue={actionData?.values.fullName}
          id="fullName"
          placeholder="fex. John Doe"
          className={
            actionData?.errors?.fullName
              ? "border-2 border-red-500"
              : "h-10 w-80 px-4 focus:outline-violet-700"
          }
        />
        {actionData?.errors?.fullName && (
          <p className="text-red-500">{actionData?.errors?.fullName.message}</p>
        )}
        <br />
        <br />

        {/* student title */}
        <label htmlFor="title" className="block font-bold text-xs mb-2">
          Title
        </label>
        <input
          type="text"
          name="title"
          defaultValue={actionData?.values.title}
          id="title"
          placeholder="fex. Web Developer"
          className={
            actionData?.errors?.ttile
              ? "border-2 border-red-500"
              : "h-10 w-80 px-4 focus:outline-violet-700"
          }
        />
        {actionData?.errors?.title && (
          <p className="text-red-500">{actionData?.errors?.title.message}</p>
        )}
        <br />
        <br />

        {/* bio description */}
        <label htmlFor="bio" className="block font-bold text-xs mb-2">
          Bio
        </label>
        <input
          type="text"
          name="bio"
          defaultValue={actionData?.values.bio}
          id="bio"
          placeholder="Tell us about yourself"
          className={
            actionData?.errors?.bio ? "border-2 border-red-500" : "h-10 w-80 px-4 focus:outline-violet-700"
          }
        />
        {actionData?.errors?.bio && <p className="text-red-500">{actionData?.errors?.bio.message}</p>}
        <br />
        <br />

        {/* tags */}
        <label htmlFor="tags" className="block font-bold text-xs mb-2">
          Choose tags
        </label>
        <input
          type="text"
          name="tags"
          defaultValue={actionData?.values.tags}
          id="tags"
          placeholder="fex. UI, JavaScript - separate with coma"
          className={
            actionData?.errors?.tags
              ? "border-2 border-red-500"
              : "h-10 w-80 px-4 mr-3 focus:outline-violet-700"
          }
        />
        {actionData?.errors?.tags && <p className="text-red-500">{actionData?.errors?.tags.message}</p>}
        <br />
        <br />

        {/* LinkedIn link */}
        <label htmlFor="linkedinLink" className="block font-bold text-xs mb-2">
          LinkedIn profile
        </label>
        <input
          type="text"
          name="linkedinLink"
          defaultValue={actionData?.values.linkedinLink}
          id="linkedinLink"
          placeholder="Link your LinkedIn profile"
          className={
            actionData?.errors?.linkedinLink
              ? "border-2 border-red-500"
              : "h-10 w-80 px-4 mr-3 focus:outline-violet-700"
          }
        />
        {actionData?.errors?.linkedinLink && (
          <p className="text-red-500">{actionData?.errors?.linkedinLink.message}</p>
        )}
        <br />
        <br />

        {/* website link */}
        <label htmlFor="websiteLink" className="block font-bold text-xs mb-2">
          Personal website
        </label>
        <input
          type="text"
          name="websiteLink"
          defaultValue={actionData?.values.websiteLink}
          id="websiteLink"
          placeholder="Show off with your work"
          className={
            actionData?.errors?.websiteLink
              ? "border-2 border-red-500"
              : "h-10 w-80 px-4 mr-3 focus:outline-violet-700"
          }
        />
        {actionData?.errors?.websiteLink && (
          <p className="text-red-500">{actionData?.errors?.websiteLink.message}</p>
        )}
        <br />
        <br />

        <button type="submit" className=" mb-6 px-8 py-2 rounded-md bg-violet-700 text-white font-bold block hover:opacity-80 transition-all">
          Save
        </button>
      </Form>
    </div>
  );
}
