import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CreateEvent() {
  const [formData, setFormData] = useState({
    eventName: '',
    nameOfSpeaker: '',
    date: '',
    category: '',
    time: '',
    department: '',
    eligibleYear: [],
    isPaid: false,
    cost: null,
    banner: null, // For event banner
  });

  const [events, setEvents] = useState([]);
  const [editEventId, setEditEventId] = useState(null);
  const [error, setError] = useState('');
  const [bannerPreview, setBannerPreview] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:8000/event');
      console.log(response.data)
      setEvents(response.data);
    } catch (error) {
      setError('Failed to fetch events.');
    }
  };
  const fetchEventsReg = async () => {
    try {
      const response = await axios.get('http://localhost:8000/event');
      console.log(response.data)
      setEvents(response.data);
    } catch (error) {
      setError('Failed to fetch events.');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'file') {
      setFormData({
        ...formData,
        banner: files[0],
      });
    } else if (name === 'eligibleYear') {
      const updatedYears = checked
        ? [...formData.eligibleYear, value]
        : formData.eligibleYear.filter((year) => year !== value);
      setFormData({ ...formData, eligibleYear: updatedYears });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'radio' ? value === 'true' : value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.eventName || !formData.nameOfSpeaker || !formData.date) {
      setError('Please fill all required fields.');
      return;
    }

    try {
      const formattedDate = formatDate(formData.date);
      const data = new FormData();
      data.append('eventName', formData.eventName);
      data.append('nameOfSpeaker', formData.nameOfSpeaker);
      data.append('date', formattedDate);
      data.append('category', formData.category);
      data.append('time', formData.time);
      data.append('department', formData.department);
      data.append('eligibleYear', formData.eligibleYear);
      data.append('isPaid', formData.isPaid);
      data.append('cost', formData.isPaid ? parseInt(formData.cost, 10) : null);
      if (formData.banner) {
        data.append('banner', formData.banner);
      }

      if (editEventId) {
        await axios.put(`http://localhost:8000/event/${editEventId}`, data);
        setEditEventId(null);
      } else {
        await axios.post('http://localhost:8000/event', data);
      }

      setFormData({
        eventName: '',
        nameOfSpeaker: '',
        date: '',
        category: '',
        time: '',
        department: '',
        eligibleYear: [],
        isPaid: false,
        cost: null,
        banner: null,
      });
      setError('');
      fetchEvents();
    } catch (error) {
      setError(error.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleEdit = (event) => {
    setFormData({
      ...event,
      date: formatDate(event.date),
    });
    setEditEventId(event.eventId);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`http://localhost:8000/event/${id}`);
        fetchEvents();
      } catch (error) {
        setError('Failed to delete the event.');
      }
    }
  };

  return (
    <div className="lg:ml-72 lg:mt-32 w-full mt-10 lg:w-[80%]  p-8 border border-gray-300 shadow-md rounded-lg text-black">
      <h2 className="text-2xl mb-6 text-center">Event Management</h2>
      
      {/* Error Message */}
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center">
          <label className="w-1/3 font-semibold">Event Name:</label>
          <input
            type="text"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            className="w-2/3 p-2 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-400"
            required
          />
        </div>

        <div className="flex items-center">
          <label className="w-1/3 font-semibold">Speaker Name:</label>
          <input
            type="text"
            name="nameOfSpeaker"
            value={formData.nameOfSpeaker}
            onChange={handleChange}
            className="w-2/3 p-2 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-400"
            required
          />
        </div>

        <div className="flex items-center">
          <label className="w-1/3 font-semibold">Date of Event:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-2/3 p-2 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-400"
            required
          />
        </div>

        <div className="flex items-center">
          <label className="w-1/3 font-semibold">Event Time:</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-2/3 p-2 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-400"
          />
        </div>

        <div className="flex items-center">
          <label className="w-1/3 font-semibold">Category:</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-2/3 p-2 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-400"
          >
            <option value="">Select Category</option>
            <option value="Placement">Placement</option>
            <option value="Higher Studies">Higher Studies</option>
            <option value="Entrepreneurship">Entrepreneurship</option>
          </select>
        </div>

        <div className="flex items-center">
          <label className="w-1/3 font-semibold">Department:</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-2/3 p-2 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-400"
          />
        </div>

        <div className="flex items-center">
          <label className="w-1/3 font-semibold">Year:</label>
          <div className="w-2/3 space-x-4">
            {['First Year', 'Second Year', 'Third Year', 'Final Year'].map((year) => (
              <label key={year} className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="eligibleYear"
                  value={year}
                  checked={formData.eligibleYear.includes(year)}
                  onChange={handleChange}
                  className="mr-2"
                />
                {year}
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center">
          <label className="w-1/3 font-semibold">Banner:</label>
          <input
            type="file"
            name="banner"
            onChange={handleChange}
            className="w-2/3 p-2 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-400"
          />
        </div>

        <div className="flex items-center">
          <label className="w-1/3 font-semibold">Is the event paid?</label>
          <div className="flex w-2/3">
            <label className="flex items-center">
              <input
                type="radio"
                name="isPaid"
                value={true}
                checked={formData.isPaid === true}
                onChange={handleChange}
                className="mr-2"
              />
              Paid
            </label>
            <label className="flex items-center ml-6">
              <input
                type="radio"
                name="isPaid"
                value={false}
                checked={formData.isPaid === false}
                onChange={handleChange}
                className="mr-2"
              />
              Not Paid
            </label>
          </div>
        </div>

        {formData.isPaid && (
          <div className="flex items-center">
            <label className="w-1/3 font-semibold">Cost:</label>
            <input
              type="number"
              name="cost"
              value={formData.cost || ''}
              onChange={handleChange}
              className="w-2/3 p-2 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-400"
            />
          </div>
        )}

        <div className="text-center">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {editEventId ? 'Update Event' : 'Create Event'}
          </button>
        </div>
      </form>

      {/* Existing Events */}
      <h3 className="text-xl mt-8 mb-4">Existing Events</h3>
      {events.length >0 ? 
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
                <td className="p-4">{event.isPaid? 'Paid' : 'Not Paid'}</td>
                <td className="p-4">{event.cost ? event.cost : "Free"}</td>
                <td className="p-4 flex space-x-4">
                  <button
                    onClick={() => handleEdit(event)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event.eventId)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        : <p> No Event Record</p>}
    </div>
  );
}

export default CreateEvent;
