import { Form, redirect, json, useActionData } from "@remix-run/node";
import connectDb from "~/db/connectDb.server";

export async function action({ request, params }) {
  const db = await connectDb();
  const form = await request.formData();
  const fullName = form.get("fullName");

  try {
    const newStudent = await db.models.Snippet.create({ fullName });
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
            actionData?.errors.fullName ? "border-2 border-red-500" : null
          }
        />
        {actionData?.errors.fullName && (
          <p className="text-red-500">{actionData.errors.fullName.message}</p>
        )}

        <button type="submit">Save</button>
      </Form>
    </div>
  );
}



// export default function CreateSnippet() {
//   const folders = useLoaderData();
//   return (
//     <div className="wrapper">
//       <div className="wrapper-inner">
//         <h1 className="h1">Add a new code snippet</h1>
//         <SnippetForm folders={folders} />
//       </div>
//     </div>
//   );
// }