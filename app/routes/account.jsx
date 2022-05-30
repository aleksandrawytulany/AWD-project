import { Link, useLoaderData, useParams, Form } from "@remix-run/react";
import { json } from "@remix-run/node";
// import { useState } from "react";
import { getSession } from "~/sessions.server.js";
import connectDb from "~/db/connectDb.server.js";
import linkIcon from "~/assets/link-icon.svg";
import linkedinIcon from "~/assets/linkedin-icon.svg";

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
console.log(loaderData.student);

  return (
    <div className=" m-0 md:ml-64 w-full px-4 md:px-10 pt-28 md:pt-32">
        <h2 className=" text-2xl font-bold mb-4">Your Account</h2>
        
                {/* student profile display */}
                {loaderData?.student?.creatorId === loaderData?.userId ? (
                <article className=" w-full mb-6 px-6 py-4 bg-white shadow-md rounded-xl">
                    <img src={loaderData[0].studentImg} alt="Student" className=" h-24 w-24 object-cover rounded-full mr-6 block" /><br />
                    <div className=" flex justify-between items-baseline md:items-center mb-4">
                        <h2 className="text-2xl font-bold">{loaderData[0].fullName} <span className=" font-normal text-base">{loaderData[0].title}</span></h2>
                        <div className=" flex items-center">
                            <Link to={`/students/${params.studentId}/edit`}>
                                <button className=" px-8 py-2 rounded-md text-violet-700 font-bold whitespace-nowrap hover:opacity-80 transition-all">
                                ✍️ Edit
                                </button>
                            </Link>
                            <Form method="post">
                                <input type="hidden" name="_method" value="delete" />
                                <button type="submit" className=" px-8 py-2 rounded-md bg-violet-700 text-white font-bold whitespace-nowrap hover:opacity-80 transition-all">
                                🗑️ Delete
                                </button>
                            </Form>
                        </div>
                        </div>
                        <p className=" italic ">{loaderData[0].bio}</p><br />
                        {loaderData[0].tags.split(",").map(( tag, key ) => {
                        // console.log(tag);
                        return (
                            <p key={key} className=" px-2 py-1 bg-violet-300 text-violet-700 font-bold text-xs rounded-lg inline mr-2">{tag}</p>
                            ) 
                        })}<br /><br />
                        <a href={loaderData[0].linkedinLink} target="_blank" rel="noreferrer" className=" flex items-center">
                            <img src={linkedinIcon} alt="LinkediIn" className=" mr-1" />
                            <strong>LinkedIn</strong>
                        </a>
                        <a href={loaderData[0].websiteLink} target="_blank" rel="noreferrer" className=" flex items-center">
                            <img src={linkIcon} alt="Link" className=" mr-1" />
                            <strong>Portfolio</strong>
                        </a>           
                </article>     
                ) : 
                    <div>
                        <p className=" inline-block mr-2">You haven't posted any student profile yet.</p>
                        <Link to="/students/new" className=" hover:opacity-80 transition-all inline-block mb-4 font-bold text-base text-violet-700">
                            <h3>➕ Create now</h3>
                        </Link>
                    </div>              
                }                     
    </div>
  );
}