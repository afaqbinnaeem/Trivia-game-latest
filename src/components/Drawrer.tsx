
// import { companyMenus } from '@/app/dashboard/layout';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'
interface DashboardDrawer {
    showNav: boolean;
    setShowNav: React.Dispatch<React.SetStateAction<boolean>>;
  }

const Drawrer = ({ showNav, setShowNav }: DashboardDrawer) => {
    const pathname = usePathname()

  return (
    <React.Fragment>
    <div className={`fixed z-50 inset-y-0 left-0 ${showNav ? 'block' : 'hidden'}`}>
      <div className="text-gray h-full w-[90vw] bg-slate-100 py-3 sm:w-72 md:w-80">
        <div className="mx-3 flex items-center justify-between">
        <div className="mr-3 font-bold text-2xl my-4 flex items-center p-2">
            Trivia 
            Dashboard
          </div>
          <span
            className="flex cursor-pointer items-center justify-center"
            onClick={() => setShowNav(false)}
          >
            <svg
              className="h-8 w-8 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </span>
        </div>
        <div className="sidebar-div relative mt-4 flex max-h-[calc(100%-100px)] flex-col overflow-y-auto pr-2 pt-2">
          {/* {companyMenus?.map((menu, i) => (
            <Link
              onClick={() => setShowNav(false)}
              href={menu?.link}
              key={i}
              className={`my-1 flex text-2xl items-center gap-3.5  rounded-r-[50px] py-3 pl-6 font-inter font-normal leading-normal text-opacity-90 no-underline hover:bg-green-800 hover:text-white ${
                pathname === menu.activePath ? "bg-green-800 text-white" : "text-slate-700 "
              }`}
            >
              <div className="flex items-center">{React.createElement(menu?.icon, { className: 'h-5 w-5' })}</div>
              <p
                className={`my-0 whitespace-pre duration-200 ${
                  !showNav && "translate-x-28 overflow-hidden opacity-0"
                }`}
              >
                {menu?.name}
              </p>
            </Link>
          ))} */}
        </div>
      </div>
    </div>
  </React.Fragment>
  
  )
}

export default Drawrer