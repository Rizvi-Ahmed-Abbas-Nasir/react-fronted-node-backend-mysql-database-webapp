import React from 'react';
import { Link } from 'react-router-dom';

const AdminHeader = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <header className="bg-gray-800 text-white w-64 h-[89vh] fixed bottom-0 left-0 py-8 border border-black">
        <div className="container mx-auto flex justify-between flex-col items-center h-full">
          <nav className="h-full">
            <ul className="flex items-center justify-start gap-6 h-full flex-col">
              <li>
                <Link
                  to="/admin"
                  className="hover:text-black text-[1rem] lg:text-[1.2rem] whitespace-nowrap"
                >
                  Create Event
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/approve"
                  className="hover:text-black text-[1rem] lg:text-[1.2rem] whitespace-nowrap"
                >
                  Validate student
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/scan"
                  className="hover:text-black text-[1rem] lg:text-[1.2rem] whitespace-nowrap"
                >
                  Scan
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/attendence"
                  className="hover:text-black text-[1rem] lg:text-[1.2rem] whitespace-nowrap"
                >
                  Attendance
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </div>
  );
};

export default AdminHeader;
