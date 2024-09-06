import React from 'react';

const Header = () => {
  return (
    <header className="bg-gray-800 header text-white py-4">
      <div className="container mx-auto  flex justify-between items-center">
        <div className="text-lg font-bold logo">TPO Website</div>
        <nav>
          <ul className="flex nav-links space-x-4">
            <li>
              <a href="#" className="hover:underline">Home</a>
            </li>
            <li>
              <a href="#" className="hover:underline">Registered Companies</a>
            </li>
            <li>
              <a href="#" className="hover:underline">Notification</a>
            </li>
            <li>
              <a href="#" className="hover:underline">Aptitude Test</a>
            </li>
            <li>
              <a href="#" className="hover:underline">Mock Interview History</a>
            </li>
          </ul>
        </nav>
        <div className="text-sm contact">
          <span className="font-semibold">tpo@yourcollege.edu</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
