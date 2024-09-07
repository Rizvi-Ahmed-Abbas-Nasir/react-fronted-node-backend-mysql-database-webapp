import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-gray-800 header text-white  w-full py-8">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-[1.2rem] font-bold logo">TPO Website</div>
        <nav>
          <ul className="flex nav-links space-x-4">
            <li>
              <Link to="/" className="hover:underline text-[1.2rem]">Events</Link>
            </li>
            <li>
              <Link to="/admin" className="hover:underline text-[1.2rem]">Admin</Link>
            </li>
          </ul>
        </nav>
        <div className="text-sm contact">
          <span className="font-semibold text-[1.2rem]">tpo@yourcollege.edu</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
