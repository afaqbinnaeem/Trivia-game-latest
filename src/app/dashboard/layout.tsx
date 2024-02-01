"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { IoHome } from "react-icons/io5";
import { IoMdMenu } from "react-icons/io";
import "./globals.css";
import Drawrer from "@/components/Drawrer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// export const companyMenus = [
//   {
//     name: "Tournaments",
//     link: "/dashboard/tournments",
//     icon: IoHome,
//     iconClassName: "w-5 h-5",
//     activePath: "/dashboard/tournments",
//   },
//   {
//     name: "Quiz",
//     link: "/dashboard/quiz",
//     icon: IoHome,
//     iconClassName: "w-5 h-5",
//     activePath: "/dashboard/quiz",
//   },
//   {
//     name: "All Quiz",
//     link: "/dashboard/allquiz",
//     icon: IoHome,
//     iconClassName: "w-5 h-5",
//     activePath: "/dashboard/allquiz",
//   },
// ];
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [openDrawer, setOpenDrawer] = useState(false);

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen bg-slate-200">
          {/* {/ side bar /} */}
          <div
            className={`fixed left-0 top-0 hidden h-full w-80 text-black duration-500 lg:block`}
          >
            <div className="mx-3 font-bold text-3xl my-4 flex items-center p-2">
              Trivia Dashboard
            </div>
            <div className="fixed left-0 top-0 hidden h-full w-80 text-black duration-500 lg:block">
              <div className="mx-3 font-bold text-3xl my-4 flex items-center p-2">
                Trivia Dashboard
              </div>
              <div className="sidebar-div relative mt-8 flex max-h-[calc(100%-150px)] flex-col overflow-y-auto pr-8">
                <a href="/dashboard/tournments" className="my-1 flex text-2xl items-center gap-3.5  rounded-r-[50px] py-3 pl-6 font-inter font-normal leading-normal text-opacity-90 no-underline hover:bg-green-800 hover:text-white text-slate-700">
                  <div className="flex items-center w-5 h-5">
                    <IoHome />
                  </div>
                  <p className="my-0 whitespace-pre duration-200">Tournaments</p>
                </a>
                <a href="/dashboard/quiz" className="my-1 flex text-2xl items-center gap-3.5  rounded-r-[50px] py-3 pl-6 font-inter font-normal leading-normal text-opacity-90 no-underline hover:bg-green-800 hover:text-white text-slate-700">
                  <div className="flex items-center w-5 h-5">
                    <IoHome />
                  </div>
                  <p className="my-0 whitespace-pre duration-200">Quiz</p>
                </a>
                <a href="/dashboard/allquiz" className="my-1 flex text-2xl items-center gap-3.5  rounded-r-[50px] py-3 pl-6 font-inter font-normal leading-normal text-opacity-90 no-underline hover:bg-green-800 hover:text-white text-slate-700">
                  <div className="flex items-center w-5 h-5">
                    <IoHome />
                  </div>
                  <p className="my-0 whitespace-pre duration-200">All Quiz</p>
                </a>
              </div>
            </div>
          </div>
          {/* {/ top bar  /} */}
          <div
            className={`w-full overflow-auto duration-500 bg-white  lg:ml-[320px]`}
          >
            <nav className="mx-2 my-3 md:px-4 sm:mx-4 md:mx-6">
              <div className="relative flex items-center justify-between gap-5">
                <div className=" flex items-center gap-2">
                  <div>
                    <button
                      onClick={() => setOpenDrawer(!openDrawer)}
                      className={`flex h-max w-max cursor-pointer items-center justify-center rounded-full border-none bg-transparent duration-200 hover:bg-slate-200 lg:hidden`}
                    >
                      <IoMdMenu className="h-8 w-6" />
                    </button>
                  </div>
                </div>
                <div>
                  <button className="bg-red-600 px-4 py-2 rounded-lg text-white text-xl">
                    logout
                  </button>
                </div>
              </div>
            </nav>
            <div className="mx-2 sm:mx-4 md:mx-6 md:mb-6 ">{children}</div>
          </div>
          {/* <Drawrer showNav={openDrawer} setShowNav={setOpenDrawer} /> */}
          <ToastContainer />
        </div>
      </body>
    </html>
  );
}
