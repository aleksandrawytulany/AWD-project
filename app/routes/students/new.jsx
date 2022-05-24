import { redirect, json } from "@remix-run/node";
import { useActionData, Form } from "@remix-run/react";
import connectDb from "~/db/connectDb.server.js";

export async function action({ request }) {
  const db = await connectDb();
  const form = await request.formData();

  try {
    const newStudent = await db.models.Student.create({ fullName: form.get("fullName") });
    return redirect(`/students/${newStudent._id}`);
  } catch (error) {
    return json(
      { errors: error.errors, values: Object.fromEntries(form) },
      { status: 400 }
    );
  }
}

export async function loader() {
  const db = await connectDb();
  return db.models.Student.find();
}

export default function CreateStudent() {
  const actionData = useActionData();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-10">Create student</h1>
      <Form method="post">
        <label htmlFor="fullName" className="block">
          Full Name
        </label>
        <input
          type="text"
          name="fullName"
          defaultValue={actionData?.values.fullName}
          id="fullName"
          className={
            actionData?.errors?.fullName ? "border-2 border-red-500" : null
          }
        />
        {actionData?.errors?.fullName && (
          <p className="text-red-500">{actionData?.errors?.fullName.message}</p>
        )}

        <button type="submit">Save</button>
      </Form>
    </div>
  );
}