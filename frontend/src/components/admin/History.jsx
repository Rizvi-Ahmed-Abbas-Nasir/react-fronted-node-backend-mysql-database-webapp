import React, { useState, useEffect } from 'react';
import axios from 'axios';

function History() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  // Fetch events from API
  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:8000/event');
      setEvents(response.data);
    } catch (error) {
      setError('Failed to fetch events.');
    }
  };
  //Handle delete event permenantly
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const data = await axios.delete(`http://localhost:8000/event/${id}`);
        fetchEvents();
        alert(data.data.message)
      } catch (error) {
        setError('Failed to delete the event.');
      }
    }
  };

  // Handle delete event by setting isDeleted to 1
  const handleRemove = async (id) => {
    if (window.confirm('Are you sure you want to remove this event?')) {
      try {
        const data = await axios.delete(`http://localhost:8000/removeEvent/${id}`);
        fetchEvents(); // Refresh event list
        alert(data.data.message)
      } catch (error) {
        setError('Failed to remove the event.');
      }
    }
  };

  // Handle undo delete by setting isDeleted back to 0
  const handleUndo = async (id) => {
    try {
      const data = await axios.post(`http://localhost:8000/undoEvent/${id}`);
      fetchEvents(); // Refresh event list
      alert(data.data.message)
    } catch (error) {
      setError('Failed to undo the event deletion.');
    }
  };

  return (
    <div className="md:ml-72 md:mt-32 md:w-[80%] w-full mt-9 flex justify-center p-8 flex-col">
      <h2 className="text-2xl mb-6 text-center">Event History</h2>

      {/* Error Message */}
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      {/* Event Table */}
      {events.length > 0 ? (
        <table className="table-auto w-full text-left">
          <thead>
            <tr className="bg-white text-black">
              <th className="p-4">Event Name</th>
              <th className="p-4">Speaker</th>
              <th className="p-4">Date</th>
              <th className="p-4">Paid</th>
              <th className="p-4">Cost</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.eventId} className="border-b border-gray-600">
                <td className="p-4">{event.eventName}</td>
                <td className="p-4">{event.nameOfSpeaker}</td>
                <td className="p-4">{new Date(event.date).toLocaleDateString()}</td>
                <td className="p-4">{event.isPaid ? 'Paid' : 'Not Paid'}</td>
                <td className="p-4">{event.cost ? event.cost : 'Free'}</td>
                <td className="p-4 flex space-x-4">
                  <button
                    onClick={() => handleDelete(event.eventId)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >Delete</button>
                  {event.isDeleted === 0 ? (
                    <button
                      onClick={() => handleRemove(event.eventId)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUndo(event.eventId)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                    >
                      Undo
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No events available.</p>
      )}
    </div>
  );
}

export default History;
