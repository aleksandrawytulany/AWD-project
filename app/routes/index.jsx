import { useLoaderData, Link, Form } from "@remix-run/react";
// import { useState } from 'react';
import connectDb from "~/db/connectDb.server.js";

export async function loader({ params, request }) {
  const url = new URL(request.url);
  const querry = url.searchParams.get("q");
  const db = await connectDb();
  const students = await db.models.Student.find();

  if(querry) {
    const searchName = await db.models.Student.find( {
      fullName: new RegExp(querry, "i"),
    });
    return searchName;
  }
  console.log(students);
  return students;
}

export default function Index() {
  const students = useLoaderData();
  // const [selectedOption, setSelectedOption] = useState();
  // let sortedStudents = [];

  // const sortBy = (e) => {
  //   setSelectedOption(e.target.value);
  
  //     if(e.target.value == "fullName") {
  //       sortedStudents = students.sort((a, b) => a.title.localeCompare(b.fullName)
  //       );
  //       // students = sortedStudents;
  //     }

  //     if (e.target.value == "dateUpdated") {
  //       sortedStudents = students.sort(
  //         (a, b) => { return a.date_updated > b.date_updated ? 1 : -1;}
  //       );
  //     }

  //     if(e.target.value == "favourited") {
  //       sortedStudents = students.sort(
  //         (a, b) => { return a.favourite < b.favourite  ? 1 : -1;}
  //       );
  //       // return sortedStudents;
  //   }
  //   students = sortedStudents;
  // }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Student Market</h1>
      <Form method="GET">
        <input type="text" name="q" placeholder="Search" className="h-10 w-80 px-4 mr-3 focus:outline-violet-700" />
        <button type="submit" className=" px-4 py-2 text-white bg-violet-700 rounded-lg">Search</button>
      </Form><br />

      {/* <select name="" id="" value={selectedOption} className=" w-44 h-10 mb-6 ml-6" onChange={sortBy}>
        <option value="value">Sort By</option>
        <option value="fullName">Name</option>
        <option value="dateUpdated" defaultValue="dateUpdated">Date</option>
      </select><br /> */}

      <ul>
        {students.map((student) => {
          return (
            <li key={student._id} className=" list-none">
              <Link
                to={`/students/${student._id}`}
                className=" text-black">
                  <article className=" w-full mb-6 px-6 py-4 bg-white shadow-md rounded-xl hover:shadow-lg transition-all">
                    <h3 className=" text-xl font-bold">{student.fullName}</h3>
                    <p>{student.bio}</p>
                    <div>
                      {student.tags}
                    </div>
                    <p>{student.createdDate}</p>
                  </article>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
