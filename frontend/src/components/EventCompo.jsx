import React, { useState ,useEffect} from 'react';
import JobBox from './JobBox';
import axios from 'axios';
import JobBox2 from './JobBox2';

const EventCompo = () => {
  const [openBoxes, setOpenBoxes] = useState([false, false]); // Track which job boxes are open
  const [openPayBoxes, setOpenPayBoxes] = useState([false, false]); // Track which payment sections are open
  const [data ,setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const jobs = [
    {
      title: 'Desciption Details',
      details: {
        ctc: 'Details',
        link: '#', // Replace with yourrr linkkk 
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
      title: 'Description Details ',
      details: {
        ctc: 'Details',
        link: '#', // Replace with your link bro
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
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/event');
       
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }



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

  return (
    <div className="flex flex-wrap gap-4 justify-start items-start py-12 pl-10">
     {data.map((data, index) => (
          
             <JobBox2
          key={index}
          eventName={data.eventName}
          nameOfSpeaker={data.nameOfSpeaker}
          date={data.date}
          category={data.category}
          time={data.time}
          department={data.department}
          eligibleYear={data.eligibleYear}
          isPaid={data.isPaid}
          cost={data.cost}
          isOpen={openBoxes[index]}
          onToggle={() => handleToggle(index)} 
          isOpenPay={openPayBoxes[index]} 
          onTogglePay={() => handleTogglePay(index)} 
        />
      
        ))}
    </div>
  );
};

export default EventCompo;
