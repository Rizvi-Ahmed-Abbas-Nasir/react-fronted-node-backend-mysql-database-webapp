import React from 'react';
import { Link } from 'react-router-dom';

const AdminHeader = () => {
  return (
    <header className="bg-blue-600 header text-white w-full md:w-[20%] lg:w-[15%] xl:w-[10%] h-[80vh] mt-10 ml-4 lg:ml-10 rounded-xl py-8">
      <div className="container mx-auto flex justify-between flex-col items-center">
        <nav className="w-full h-[100%]">
          <ul className="flex items-center justify-center gap-6 lg:gap-20 p-4 lg:p-8 w-full h-[100%] flex-col">
            <li>
              <Link to="/createEvent" className="hover:bg-blue-300 p-4 lg:p-8 rounded-lg bg-blue-400 text-[1rem] lg:text-[1.2rem] whitespace-nowrap">
                Create
              </Link>
            </li>
            <li>
              <Link to="/admin" className="hover:bg-blue-300 p-4 lg:p-8 rounded-lg bg-blue-400 text-[1rem] lg:text-[1.2rem] whitespace-nowrap">
                Admin
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default AdminHeader;
