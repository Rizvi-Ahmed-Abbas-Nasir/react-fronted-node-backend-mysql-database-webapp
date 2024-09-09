import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const AdminHeader = () => {
  const [activeMenu, setActiveMenu] = useState(false);

  // Toggle the hamburger menu
  const toggleMenu = () => {
    setActiveMenu(!activeMenu);
  };

  return (
    <div>
      {/* Sidebar */}
      <header className="lg:bg-gray-800 bg-gray-900 text-white w-full  lg:w-64 lg:h-[89vh] md:fixed lg:bottom-0 lg:left-0 py-8 border border-black">
        <div className="container mx-auto flex justify-between flex-col items-center h-full">
          {/* Desktop Menu */}
          <nav className="h-full flex justify-center">
            <ul className="lg:flex items-center justify-start gap-6 h-full hidden lg:flex-col">
              <li>
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    isActive
                      ? 'bg-blue-500 p-2 text-[1.2rem] rounded text-white'
                      : 'hover:text-black text-[1.2rem] whitespace-nowrap'
                  }
                >
                  Create Event
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/approve"
                  className={({ isActive }) =>
                    isActive
                      ? 'bg-blue-500 p-2 text-[1.2rem] rounded text-white'
                      : 'hover:text-white hover:bg-blue-500 hover:p-2 rounded text-[1.2rem] whitespace-nowrap'
                  }
                >
                  Validate Student
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/scan"
                  className={({ isActive }) =>
                    isActive
                      ? 'bg-blue-500 p-2 text-[1.2rem] rounded text-white'
                      : 'hover:text-white hover:bg-blue-500 hover:p-2 rounded text-[1.2rem] whitespace-nowrap'
                  }
                >
                  Scan
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/attendance"
                  className={({ isActive }) =>
                    isActive
                      ? 'bg-blue-500 p-2 text-[1.2rem] rounded text-white'
                      : 'hover:text-white hover:bg-blue-500 hover:p-2 rounded text-[1.2rem] whitespace-nowrap'
                  }
                >
                  Attendance
                </NavLink>
              </li>
            </ul>
          </nav>

          {/* Hamburger Menu */}
          <div className="lg:hidden flex items-center justify-center w-full mt-4">
            <div className="flex flex-col justify-center items-center cursor-pointer" onClick={toggleMenu}>
              <div
                className={`w-8 h-1 bg-white mb-1 transition-all duration-300 ${activeMenu ? 'rotate-45 translate-y-2' : ''}`}
              ></div>
              <div
                className={`w-8 h-1 bg-white mb-1 transition-all duration-300 ${activeMenu ? 'opacity-0' : ''}`}
              ></div>
              <div
                className={`w-8 h-1 bg-white transition-all duration-300 ${activeMenu ? '-rotate-45 -translate-y-2' : ''}`}
              ></div>
            </div>
          </div>

          <div
            className={`lg:hidden transition-all duration-500 overflow-hidden ${activeMenu ? 'max-h-[400px] mb-4' : 'max-h-0'
              } w-full`}
            style={{
              transitionTimingFunction: 'ease-in-out',
            }}
          >
            <nav className="flex flex-col items-center bg-gray-800 w-full">
              <ul className="flex flex-col items-center gap-4 py-4">
                <li>
                  <NavLink
                    to="/admin"
                    onClick={toggleMenu}
                    className="text-white text-lg py-2 hover:bg-blue-500 rounded-lg px-4"
                  >
                    Create Event
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/approve"
                    onClick={toggleMenu}
                    className="text-white text-lg py-2 hover:bg-blue-500 rounded-lg px-4"
                  >
                    Validate Student
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/scan"
                    onClick={toggleMenu}
                    className="text-white text-lg py-2 hover:bg-blue-500 rounded-lg px-4"
                  >
                    Scan
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/attendance"
                    onClick={toggleMenu}
                    className="text-white text-lg py-2 hover:bg-blue-500 rounded-lg px-4"
                  >
                    Attendance
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <div className={`transition-all duration-500 ${activeMenu ? 'mt-[100px]' : 'mt-0'}`}>
        <div className="p-4 flex w-full justify-center md:hidden">
          <h1 className="text-xl font-bold">Welcome to the Admin Panel</h1>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
