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
      fullName: new RegExp(querry, "i")
    });
    return searchName;
  }
  console.log(students);
  return students;
}

export default function Index() {
  const [selectedOption, setSelectedOption] = useState();
  const [selectedFilter, setSelectedFilter] = useState();
  let students = useLoaderData();
  let sortedStudents = [];

  const sortBy = (e) => {
    setSelectedOption(e.target.value);
    let sortedStudents = [];

    if (e.target.value == "fullName") {
      sortedStudents = students.sort((a, b) => a.fullName.localeCompare(b.fullName));
    }

    if (e.target.value == "dateUpdated") {
      sortedStudents = students.sort(
        (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
    }

    // if (e.target.value == "uiDesign") {
    //   sortedStudents = students.filter((student) => student.tags === "UI Design")
    // }

    students = sortedStudents;
  };

  const filter = (e) => {
    setSelectedFilter(e.target.value);
    let filteredStudents = [];

    if (e.target.value == "tags") {
      filteredStudents = students.filter(
        (student) => student.tags === "UX"
      );
    }

    if (e.target.value == "tags") {
      filteredStudents = students.filter(
        (student) => student.tags === "UI Design"
      );
    }

    // if (e.target.value == "all") {
    //   // filteredStudents = data;
    //   students = filteredStudents;
    // }
    students = filteredStudents;
    console.log(filteredStudents);
  };
  
  return (
    <div className=" m-0 md:ml-64 w-full px-4 md:px-10 pt-28 md:pt-32">
      <h1 className=" text-2xl md:text-3xl font-bold mb-4">Find a student</h1>
      <div className=" flex flex-col items-start md:items-end mb-10 md:flex-row">
        {/* search */}
        <Form method="GET" className=" flex items-center md:mr-4 mb-2 md:mb-0">
          <input type="text" name="q" placeholder="Search by name" className=" w-56 h-10 lg:w-80 px-4 mr-2 focus:outline-violet-700" />
          <button type="submit" className=" h-10 px-4 md:px-8 py-2 rounded-md bg-violet-700 text-white font-bold flex-nowrap hover:opacity-80 transition-all">
            🔍 Search
          </button>
        </Form>

        {/* sort by */}
        <div>
          <label className="block font-bold text-xs mb-2">
            Sort by
          </label>
          <select name="" id="" value={selectedOption} className=" h-10 w-40 px-4 focus:outline-violet-700 mr-2" onChange={sortBy}>
            <option value="value">Sort By</option>
            <option value="fullName">Name</option>
            <option value="dateCreated">Last posted</option>
            {/* <option value="uiDesign">UI Design</option> */}
          </select>
        </div>

        {/* filters */}
        <div>
          <label className="block font-bold text-xs mb-2">
            Filter
          </label>
          <select className=" h-10 w-40 px-4 focus:outline-violet-700" onChange={filter} value={selectedFilter}>
            <option value="value">All</option>
            <option value="tags">UX</option>
            <option value="tags">UI Design</option>
          </select>
        </div>

      </div>

      <ul>
        {students.map((student) => {
          return (
            <li key={student._id} className=" list-none">
              <Link
                to={`/students/${student._id}`}
                className=" text-black">
                  <article className=" w-full mb-6 px-4 md:px-6 py-6 bg-white shadow-md rounded-xl hover:shadow-lg transition-all flex justify-between">
                    <div className=" flex flex-col items-start md:flex-row md:items-center">
                      {/* student image */}
                      <img src={student.studentImg} alt="Student" className=" h-24 w-24 object-cover rounded-full mr-6" />
                      {/* student data */}
                      <div>
                        <h3 className=" text-xl font-bold ">{student.fullName} <span className=" font-normal text-base">{student?.title}</span></h3>
                        <p className=" italic max-w-xs lg:max-w-none">{student.bio}</p><br />
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
