import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function EventScan() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventid, setEventid] = useState(null);

  useEffect(() => {
    async function fetchRegistrations() {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/event/?id=${eventid}`); // Adjust endpoint as needed
        setEvents(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRegistrations();
  }, [eventid]); // Re-run this effect when eventid changes

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-lg text-red-500">Error: {error}</p>;

  return (
    <div className="md:ml-72 md:mt-32 md:w-[80%] w-full mt-9 flex justify-center p-8 flex-col">
      <h1 className="text-2xl font-bold mb-6 text-center lg:text-left">Scan Attendance for Events</h1>
      {events.length > 0 ? 
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <div key={index} className="border border-gray-300 shadow-md rounded-lg p-6 bg-white">
            <h2 className="text-xl font-bold mb-2 text-gray-800">{event.eventName}</h2>
            
            <p className="mb-4 text-gray-600">Speaker: {event.nameOfSpeaker}</p>
            
            <Link
              to={`/attendancescan/${event.eventId}`}
              onClick={() => setEventid(event.eventId)}
              className="inline-block text-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition duration-300"
              >
              View Scanner
            </Link>
          </div>
        ))}
      </div>
        : <p>No Event Record</p>}
    </div>
  );
}

export default EventScan;
