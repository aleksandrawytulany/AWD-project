import { useLoaderData, Link, Form } from "@remix-run/react";
import { useState } from "react";
import searchIcon from "~/assets/search-icon.svg";
// import arrowDown from "~/assets/arrow-down.svg";
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
    <div className=" mt-10 ml-48 w-full p-10">
      <h1 className=" text-3xl font-bold mb-4">Student Market</h1>
      <div className=" flex items-center mb-10">
        {/* search */}
        <Form method="GET" className=" flex items-center mr-4">
          <input type="text" name="q" placeholder="Search" className="h-10 w-80 px-4 mr-2 focus:outline-violet-700" />
          <button type="submit">
            <img src={searchIcon} alt="Search" />
          </button>
        </Form>

        {/* filter */}
        <select name="" id="" value={selectedOption} className=" h-10 w-80 px-4 mr-3 focus:outline-violet-700" onChange={sortBy}>
          <option value="value">Sort By</option>
          <option value="fullName">Name</option>
        </select>
      </div>

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
                  <article className=" w-full mb-6 px-6 py-4 bg-white shadow-md rounded-xl hover:shadow-lg transition-all flex justify-between">
                    <div className=" flex items-center">
                      {/* student image */}
                      <img src={student.studentImg} alt="Student" className=" h-24 w-24 object-cover rounded-full mr-6" />
                      {/* student data */}
                      <div>
                        <h3 className=" text-xl font-bold ">{student.fullName}</h3>
                        <p className=" italic ">{student.bio}</p><br />
                        <p>{student.tags}</p>
                      </div>
                    </div>
                    <p>{student.dateCreated}</p>
                  </article>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
