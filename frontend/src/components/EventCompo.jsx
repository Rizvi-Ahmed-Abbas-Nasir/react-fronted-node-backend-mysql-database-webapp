import React, { useState } from 'react';
import JobBox from './JobBox';

const EventCompo = () => {
  const [openBoxes, setOpenBoxes] = useState([false, false]); // Track which job boxes are open
  const [openPayBoxes, setOpenPayBoxes] = useState([false, false]); // Track which payment sections are open
  const [registered, setRegistered] = useState([false, false]); // Track registration state for each job

  const jobs = [
    {
      title: 'Description Details',
      details: {
        ctc: 'Details',
        link: '#', // Replace with your link
        deadline: '01-12-2024',
        role: 'Details',
        eventDetails: {
          eventName: 'Tech Innovations 2026',
          speaker: 'Rizvi Abbas',
          date: '15-11-2024',
          category: 'Placement',
          department: 'Computer Science',
          year: 'Second-year',
          payment: 'Paid',
          eventId: 'EV123456',
        },
      },
    },
    {
      title: 'Description Details',
      details: {
        ctc: 'Details',
        link: '#', // Replace with your link
        deadline: '15-12-2024',
        role: 'Details',
        eventDetails: {
          eventName: 'Industry Connect 2026',
          speaker: 'Abbas',
          date: '20-11-2024',
          category: 'Higher Studies',
          department: 'Information Technology',
          year: 'Final-year',
          payment: 'Unpaid',
          eventId: 'EV654321',
        },
      },
    },
  ];

  const handleToggle = (index) => {
    const newOpenBoxes = [...openBoxes];
    newOpenBoxes[index] = !newOpenBoxes[index];
    setOpenBoxes(newOpenBoxes);
  };

  const handleTogglePay = (index) => {
    const newOpenPayBoxes = [...openPayBoxes];
    newOpenPayBoxes[index] = !newOpenPayBoxes[index];
    setOpenPayBoxes(newOpenPayBoxes);
  };

  const handleRegister = (index) => {
    const newRegistered = [...registered];
    newRegistered[index] = true; // Mark the job as registered
    setRegistered(newRegistered);
  };

  return (
    <div className="flex flex-wrap gap-4 justify-start items-start py-12 pl-10">
      {jobs.map((job, index) => (
        <JobBox
          key={index}
          title={job.title}
          details={job.details}
          isOpen={openBoxes[index]}
          onToggle={() => handleToggle(index)} 
          isOpenPay={openPayBoxes[index]} 
          onTogglePay={() => handleTogglePay(index)} 
          isRegistered={registered[index]} // Pass registration status
          onRegister={() => handleRegister(index)} // Handle register click
        />
      ))}
    </div>
  );
};

export default EventCompo;
