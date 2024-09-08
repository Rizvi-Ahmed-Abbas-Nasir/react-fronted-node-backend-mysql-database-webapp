import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ApproveCode() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventid, setEventid] = useState(null);

  useEffect(() => {
    async function fetchRegistrations() {
      try {
        const response = await axios.get(`http://localhost:8000/event/?id=${eventid}`); // Adjust endpoint as needed
        setEvents(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);  
      }
    }

    fetchRegistrations();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col flex-wrap gap-4 justify-start items-start ml-72 mt-32 w-[80%] ">
      <h1>Events</h1>
      <div className='flex flex-row justify-start'>
      {events.map((event,index) => (
        <div key={index} className="border p-4 rounded m-2">
          <h2 className="text-xl font-bold">{event.eventName}</h2>
          <p>{event.nameOfSpeaker}</p>
          <Link to={`/registrations/${event.eventId}`} onClick={(eventId)=>{setEventid(eventId)}} className="text-blue-500">View Students</Link>
          {/* Add more fields as needed */}

        </div>
      ))}
      </div>
    </div>
  );
}

export default ApproveCode;
