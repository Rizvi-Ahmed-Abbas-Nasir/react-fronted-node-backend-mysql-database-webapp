import React from 'react';
import { Link } from 'react-router-dom';

const AdminHeader = () => {
  return (
    <header className="bg-blue-600 header text-white  w-full py-8">
      <div className="container mx-auto flex justify-between items-center">
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
      </div>
    </header>
  );
};

export default AdminHeader;
