import { redirect } from "@remix-run/node";
import { useLoaderData, Link, Form } from "@remix-run/react";
import { useState } from "react";
import connectDb from "~/db/connectDb.server.js";
import { getSession } from "~/sessions.js";

export async function loader({ params, request }) {
  const url = new URL(request.url);
  const querry = url.searchParams.get("q");
  const db = await connectDb();
  const students = await db.models.Student.find();
  const session = await getSession(request.headers.get("Cookie"));

  if(session.get("userId")) { 
    
  } else {
    return redirect("/login");
  }


  if(querry) {
    const searchName = await db.models.Student.find( {
      fullName: new RegExp(querry, "i"),
      tags: new RegExp(querry, "i"),
    });
    return searchName;
  }
  console.log(students);
  return students;
}

export default function Index() {
  const [selectedOption, setSelectedOption] = useState();
  let students = useLoaderData();
  let sortedStudents = [];

  const sortBy = (e) => {
    setSelectedOption(e.target.value);
    let sortedStudents = [];

    if (e.target.value == "fullName") {
      sortedStudents = students.sort((a, b) => a.fullName.localeCompare(b.fullName));
    }

    students = sortedStudents;
  };
  
  return (
    <div className=" ml-64 w-full px-10 pt-32">
      <h1 className=" text-3xl font-bold mb-4">Student Market</h1>
      <div className=" flex items-center mb-10">
        {/* search */}
        <Form method="GET" className=" flex items-center mr-4">
          <input type="text" name="q" placeholder="Search" className="h-10 w-80 px-4 mr-2 focus:outline-violet-700" />
          <button type="submit" className=" px-8 py-2 rounded-md bg-violet-700 text-white font-bold hover:opacity-80 transition-all">
            {/* <img src={searchIcon} alt="Search" /> */}
            🔍 Search
          </button>
        </Form>

        {/* filter */}
        <select name="" id="" value={selectedOption} className=" h-10 w-40 px-4 focus:outline-violet-700" onChange={sortBy}>
          <option value="value">Sort By</option>
          <option value="fullName">Name</option>
        </select>
      </div>

      <ul>
        {students.map((student) => {
          return (
            <li key={student._id} className=" list-none">
              <Link
                to={`/students/${student._id}`}
                className=" text-black">
                  <article className=" w-full mb-6 px-6 py-4 bg-white shadow-md rounded-xl hover:shadow-lg transition-all flex justify-between">
                    <div className=" flex items-center">
                      {/* student image */}
                      <img src={student.studentImg} alt="Student" className=" h-24 w-24 object-cover rounded-full mr-6" />
                      {/* student data */}
                      <div>
                        <h3 className=" text-xl font-bold ">{student.fullName} <span className=" font-normal text-base">{student?.title}</span></h3>
                        <p className=" italic ">{student.bio}</p><br />
                          {student.tags.split(",").map(( tag, key ) => {
                            // console.log(tag);
                            return (
                              <p key={key} className=" px-2 py-1 bg-violet-300 text-violet-700 font-bold text-xs rounded-lg inline mr-2">{tag}</p>
                            ) 
                          })}
                      </div>
                    </div>
                    <p className=" text-slate-500">{student.dateCreated}</p>
                  </article>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
