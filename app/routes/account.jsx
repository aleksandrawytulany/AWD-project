import { Link, useLoaderData, useParams, Form } from "@remix-run/react";
import { json } from "@remix-run/node";
// import { useState } from "react";
import { getSession } from "~/sessions.js";
import connectDb from "~/db/connectDb.server.js";

export async function loader({ params, request }) {
const db = await connectDb();
const students = await db.models.Student.find();
const session = await getSession(request.headers.get("Cookie"));
const userId = session.get("userId");

return students;
}

export default function Account() {
// let students = useLoaderData();
const loaderData = useLoaderData();
const params = useParams();

  return (
    <div className=" m-0 md:ml-64 w-full px-4 md:px-10 pt-28 md:pt-32">
        <h2 className=" text-2xl font-bold mb-4">Your Account</h2>
        
        {/* student profile display */}
        {loaderData?.student?.creatorId === loaderData?.userId ? (
            <Link to={`/students/${loaderData?.student?._id}`} className=" text-black">
                <article className=" w-full mb-6 px-6 py-4 bg-white shadow-md rounded-xl hover:shadow-lg transition-all flex justify-between">
                    <div className=" flex items-center">
                      <img src={loaderData?.student?.studentImg} alt="Student" className=" h-24 w-24 object-cover rounded-full mr-6" />
                      <div>
                        <h3 className=" text-xl font-bold ">{loaderData?.student?.fullName} <span className=" font-normal text-base">{loaderData?.student?.title}</span></h3>
                        <p className=" italic ">{loaderData?.student?.bio}</p><br />
                          {/* {student.tags.split(",").map(( tag, key ) => {
                            // console.log(tag);
                            return (
                              <p key={key} className=" px-2 py-1 bg-violet-300 text-violet-700 font-bold text-xs rounded-lg inline mr-2">{tag}</p>
                            ) 
                          })} */}
                      </div>
                    </div>
                    <p className=" text-slate-500">{loaderData?.student?.dateCreated}</p>            
                </article>     
            </Link> 
        ) : (
        <div>
            <p className=" inline-block mr-2">You haven't posted any student profile yet.</p>
            <Link to="/students/new" className=" hover:opacity-80 transition-all inline-block mb-4 font-bold text-base text-violet-700">
                <h3>➕ Create now</h3>
            </Link>
        </div>              
        )}                     
    </div>
  );
}