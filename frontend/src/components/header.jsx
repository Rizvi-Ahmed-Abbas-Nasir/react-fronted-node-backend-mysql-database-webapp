import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  const [activeMenu, setActiveMenu] = useState(false);

  // Toggle the hamburger menu
  const toggleMenu = () => {
    setActiveMenu(!activeMenu);
  };

  return (
    <>
      <header className="bg-gray-800 text-white w-full py-8 px-5 fixed top-0 left-0 h-[10vh] z-10">
        <div className="container mx-auto h-[100%] flex justify-between items-center">
          <div className="text-[1.2rem] font-bold logo">TPO Website</div>

          {/* Desktop Navigation */}
          <nav>
            <ul className="hidden md:flex space-x-4">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive
                      ? 'bg-blue-500 text-[1.2rem] p-2 rounded'
                      : 'text-[1.2rem] hover:bg-blue-500 p-2 rounded'
                  }
                  end
                >
                  Events
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/adminp"
                  className={({ isActive }) =>
                    isActive
                      ? 'bg-blue-500 text-[1.2rem] p-2 rounded'
                      : 'text-[1.2rem] hover:bg-blue-500 p-2 rounded'
                  }
                >
                  Admin
                </NavLink>
              </li>
            </ul>
          </nav>

          {/* Hamburger Icon for Mobile */}
          <div
            className="HamBurgerIcon flex md:hidden justify-center items-center pr-4 cursor-pointer"
            onClick={toggleMenu}
          >
            <div className="flex flex-col justify-center items-center">
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

          {/* Contact Information (Visible on desktop) */}
          <div className="text-sm hidden md:flex contact">
            <span className="font-semibold text-[1.2rem]">tpo@pvppcoe.ac.in</span>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-gray-800 text-white transition-all duration-500 overflow-hidden ${activeMenu ? 'max-h-[20vh] mt-[10vh]' : 'max-h-20'}`}
        style={{
          transitionTimingFunction: 'ease-in-out',
        }}
      >
        <nav className="flex flex-col items-center py-4">
          <ul className="flex flex-col items-center gap-4">
            <li>
              <NavLink
                to="/"
                onClick={toggleMenu}
                className="text-white text-lg py-2 hover:bg-blue-500 rounded-lg px-4"
              >
                Events
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/adminp"
                onClick={toggleMenu}
                className="text-white text-lg py-2 hover:bg-blue-500 rounded-lg px-4"
              >
                Admin
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Header;
