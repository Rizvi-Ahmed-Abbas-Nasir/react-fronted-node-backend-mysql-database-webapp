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
      <header className="lg:bg-gray-800 bg-gray-900 text-white w-full lg:w-64  lg:h-[90vh] md:fixed lg:bottom-0 lg:left-0 py-8 border-t border-black">
        <div className="container mx-auto flex justify-between flex-col items-center h-full">
          <nav className="h-full flex justify-center">
            <ul className="lg:flex items-center justify-start gap-6 h-full hidden lg:flex-col">
              <li>
                <NavLink
                  to="/adminp"
                  className={({ isActive }) =>
                    isActive
                      ? 'p-2 text-[1.2rem] rounded text-white font-bold underline'
                      : 'text-[1.2rem] text-gray-300 hover:bg-gray-700 hover:text-white p-2 rounded'
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
                      ? 'p-2 text-[1.2rem] rounded text-white font-bold underline'
                      : 'text-[1.2rem] text-gray-300 hover:bg-gray-700 hover:text-white p-2 rounded'
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
                      ? 'p-2 text-[1.2rem] rounded text-white font-bold underline'
                      : 'text-[1.2rem] text-gray-300 hover:bg-gray-700 hover:text-white p-2 rounded'
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
                      ? 'p-2 text-[1.2rem] rounded text-white font-bold underline'
                      : 'text-[1.2rem] text-gray-300 hover:bg-gray-700 hover:text-white p-2 rounded'
                  }
                >
                  Attendance
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/history"
                  className={({ isActive }) =>
                    isActive
                      ? 'p-2 text-[1.2rem] rounded text-white font-bold underline'
                      : 'text-[1.2rem] text-gray-300 hover:bg-gray-700 hover:text-white p-2 rounded'
                  }
                >
                  Event History
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

          {/* Mobile Menu */}
          <div
            className={`lg:hidden transition-all duration-500 overflow-hidden ${activeMenu ? 'max-h-[400px] mb-4' : 'max-h-0'} w-full`}
            style={{ transitionTimingFunction: 'ease-in-out' }}
          >
            <nav className="flex flex-col items-center bg-gray-800 w-full">
              <ul className="flex flex-col items-center gap-4 py-4">
                <li>
                  <NavLink
                    to="/adminp"
                    onClick={toggleMenu}
                    className={({ isActive }) =>
                      isActive
                        ? 'text-white text-lg py-2 rounded-lg px-4 font-bold underline'
                        : 'text-white text-lg py-2 hover:bg-gray-700 rounded-lg px-4'
                    }
                  >
                    Create Event
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/approve"
                    onClick={toggleMenu}
                    className={({ isActive }) =>
                      isActive
                        ? 'text-white text-lg py-2 rounded-lg px-4 font-bold underline'
                        : 'text-white text-lg py-2 hover:bg-gray-700 rounded-lg px-4'
                    }
                  >
                    Validate Student
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/scan"
                    onClick={toggleMenu}
                    className={({ isActive }) =>
                      isActive
                        ? 'text-white text-lg py-2 rounded-lg px-4 font-bold underline'
                        : 'text-white text-lg py-2 hover:bg-gray-700 rounded-lg px-4'
                    }
                  >
                    Scan
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/attendance"
                    onClick={toggleMenu}
                    className={({ isActive }) =>
                      isActive
                        ? 'text-white text-lg py-2 rounded-lg px-4 font-bold underline'
                        : 'text-white text-lg py-2 hover:bg-gray-700 rounded-lg px-4'
                    }
                  >
                    Attendance
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/history"
                    onClick={toggleMenu}
                    className={({ isActive }) =>
                      isActive
                        ? 'text-white text-lg py-2 rounded-lg px-4 font-bold underline'
                        : 'text-white text-lg py-2 hover:bg-gray-700 rounded-lg px-4'
                    }
                  >
                    Event History
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
    </div>
  );
};

export default AdminHeader;
