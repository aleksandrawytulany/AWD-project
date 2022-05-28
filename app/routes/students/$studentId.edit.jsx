import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { redirect, json } from "@remix-run/node";
import connectDb from "~/db/connectDb.server";

export async function action({ request, params }) {
  const db = await connectDb();
  const form = await request.formData();
  const studentImg = form.get("studentImg");
  const fullName = form.get("fullName");
  const title = form.get("title");
  const bio = form.get("bio");
  const linkedinLink = form.get("linkedinLink");
  const websiteLink = form.get("websiteLink");
  const tags = form.get("tags");

  try {
    await db.models.Student.findByIdAndUpdate(
      { _id: params.studentId },
      {
        studentImg,
        fullName,
        title,
        bio,
        linkedinLink,
        websiteLink,
        tags,
      }
    );
    return redirect(`/students/${params.studentId}`);
  } catch (error) {
    return json(
      { errors: error.errors, values: Object.fromEntries(form) },
      { status: 400 }
    );
  }
}

export async function loader({ params }) {
  const db = await connectDb();
  const data = {
    student: await db.models.Student.findById(params.studentId),
  };
  return data;
}

export default function EditStudent() {
const actionData = useActionData();
  const loaderData = useLoaderData();
  console.log(loaderData);

  return (
    <div className=" ml-64 w-full px-10 pt-32">
      <h1 className="text-2xl font-bold mb-10">Edit the student profile</h1>
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
          placeholder="Drop your picture here"
          className={
            actionData?.errors?.studentImg 
            ? "border-2 border-red-500" 
            : "h-10 w-80 px-4 focus:outline-violet-700"
          }
        /><br /><br />
        {/* full name  */}
        <label htmlFor="fullName" className="block font-bold text-xs mb-2">
          Full Name
        </label>
        <input
          type="text"
          name="fullName"
          defaultValue={actionData?.values.fullName}
          id="fullName"
          placeholder={loaderData.student.fullName}
          className={
            actionData?.errors?.fullName 
            ? "border-2 border-red-500" 
            : "h-10 w-80 px-4 focus:outline-violet-700"
          }
        />
        {actionData?.errors?.fullName && (
          <p className="text-red-500">{actionData?.errors?.fullName.message}</p>
        )}
        <br /><br />

        {/* student title */}
        <label htmlFor="title" className="block font-bold text-xs mb-2">
          Title
        </label>
        <input
          type="text"
          name="title"
          defaultValue={loaderData.student.title}
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
        <br /><br />

        {/* bio description */}
        <label htmlFor="bio" className="block font-bold text-xs mb-2">
          Bio
        </label>
        <input
          type="text"
          name="bio"
          defaultValue={actionData?.values.bio}
          id="bio"
          placeholder={loaderData.student.bio}
          className={
            actionData?.errors?.bio 
            ? "border-2 border-red-500" 
            : "h-10 w-80 px-4 focus:outline-violet-700"
          }
        />
        {actionData?.errors?.bio && (
          <p className="text-red-500">{actionData?.errors?.bio.message}</p>
        )}
        <br /><br />

        {/* tags */}
        <label htmlFor="tags" className="block font-bold text-xs mb-2">
          Choose tags
        </label>
        <input
          type="text"
          name="tags"
          defaultValue={actionData?.values.tags}
          id="tags"
          placeholder={loaderData.student.tags}
          className={
            actionData?.errors?.tags 
            ? "border-2 border-red-500" 
            : "h-10 w-80 px-4 mr-3 focus:outline-violet-700"
          }
        />
        {actionData?.errors?.tags && (
          <p className="text-red-500">{actionData?.errors?.tags.message}</p>
        )}
        <br /><br />

        {/* LinkedIn link */}
        <label htmlFor="linkedinLink" className="block font-bold text-xs mb-2">
          LinkedIn profile
        </label>
        <input
          type="text"
          name="linkedinLink"
          defaultValue={actionData?.values.linkedinLink}
          id="linkedinLink"
          placeholder={loaderData.student.linkedinLink}
          className={
            actionData?.errors?.linkedinLink 
            ? "border-2 border-red-500" 
            : "h-10 w-80 px-4 mr-3 focus:outline-violet-700"
          }
        />
        {actionData?.errors?.linkedinLink && (
          <p className="text-red-500">{actionData?.errors?.linkedinLink.message}</p>
        )}
        <br /><br />

        {/* website link */}
        <label htmlFor="websiteLink" className="block font-bold text-xs mb-2">
          Personal website
        </label>
        <input
          type="text"
          name="websiteLink"
          defaultValue={actionData?.values.websiteLink}
          id="websiteLink"
          placeholder={loaderData.student.websiteLink}
          className={
            actionData?.errors?.websiteLink 
            ? "border-2 border-red-500" 
            : "h-10 w-80 px-4 mr-3 focus:outline-violet-700"
          }
        />
        {actionData?.errors?.websiteLink && (
          <p className="text-red-500">{actionData?.errors?.websiteLink.message}</p>
        )}
        <br /><br />

        <button type="submit" className=" px-8 py-2 rounded-md bg-violet-700 text-white font-bold block">Save</button>

      </Form>
    </div>
  );
}