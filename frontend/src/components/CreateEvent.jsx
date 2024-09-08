import React, { useState } from 'react';

function CreateEvent() {
  const [formData, setFormData] = useState({
    eventName: '',
    nameOfSpeaker: '',
    date: '',
    category: '',
    time: '',
    department: '',
    eligibleYear: '',
    isPaid: false,
    cost: '',
  });

  const [error, setError] = useState('');
  const [nameError, setNameError] = useState('');
  const [speakerError, setSpeakerError] = useState('');

  // Validation function
  const validateName = (name, type) => {
    const reg = /^[a-zA-Z\s]+$/;
    if (!reg.test(name)) {
      return "Only alphabets are allowed";
    }
    if (name.trim() === "") {
      return "Name is required";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'radio') {
      setFormData({ ...formData, [name]: value === 'true' });
    } else if (type === 'number') {
      setFormData({ ...formData, [name]: value ? parseFloat(value) : '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    if (name === 'nameOfSpeaker') {
      setSpeakerError(validateName(value, 'speaker'));
    }
  };

  const validateForm = () => {
    const { eventName, nameOfSpeaker, date, category, time, department, eligibleYear } = formData;
    return (
      eventName && 
      nameOfSpeaker && 
      date && 
      category && 
      time && 
      department && 
      eligibleYear &&
      !speakerError
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setError("Please fill out all required fields.");
      return;
    }

    if (formData.isPaid && formData.cost === '') {
      setError("Please enter the cost for paid events.");
      return;
    }

    setError('');

    const dataToSubmit = {
      eventName: formData.eventName,
      nameOfSpeaker: formData.nameOfSpeaker,
      date: formData.date,
      category: formData.category,
      time: formData.time,
      department: formData.department,
      eligibleYear: formData.eligibleYear,
      isPaid: formData.isPaid,
      cost: formData.isPaid ? formData.cost : null,
    };

    try {

      const res = await fetch("http://localhost:8000/event", {
        method: "POST",
        body: JSON.stringify(dataToSubmit),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        setFormData({
          eventName: '',
          nameOfSpeaker: '',
          date: '',
          category: '',
          time: '',
          department: '',
          eligibleYear: '',
          isPaid: false,
          cost: '',
        });
        alert("Event created successfully.");
      } else {
        const data = await res.json();
        setError(data.error);
      }
    } catch (error) {
      setError("Failed to submit the form. Please try again.");
    }
  };

  return (
    <div className='w-[80%] h-[100%] mt-8 p-8 rounded-xl bg-gray-800 border'>
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-white text-2xl mb-6 text-center">Create Event</h2>

        {/* Event Name */}
        <div className="flex items-center">
          <label className="w-1/3 text-white font-semibold">Event Name:</label>
          <input
            type="text"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            className="w-2/3 p-2 rounded-lg bg-gray-200 border border-gray-400"
            required
          />
        </div>

        {/* Speaker Name */}
        <div className="flex items-center">
            
          <label className="w-1/3 text-white font-semibold">Speaker Name:</label>
          <input
            type="text"
            name="nameOfSpeaker"
            value={formData.nameOfSpeaker}
            onChange={handleChange}
            className="w-2/3 px-4 py-2  rounded-lg  bg-gray-200 border border-gray-400"
            required
          />
        
        </div>

        {/* Date of the Event */}
        <div className="flex items-center">
          <label className="w-1/3 text-white font-semibold">Date of the Event:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-2/3 p-2 rounded-lg bg-gray-200 border border-gray-400"
            required
          />
        </div>

        {/* Event Time */}
        <div className="flex items-center">
          <label className="w-1/3 text-white font-semibold">Event Time:</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-2/3 p-2 rounded-lg bg-gray-200 border border-gray-400"
            required
          />
        </div>

        {/* Category */}
        <div className="flex items-center">
          <label className="w-1/3 text-white font-semibold">Category:</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-2/3 p-2 rounded-lg bg-gray-200 border border-gray-400"
            required
          >
            <option value="">Select Category</option>
            <option value="Placement">Placement</option>
            <option value="Higher Studies">Higher Studies</option>
            <option value="Entrepreneurship">Entrepreneurship</option>
          </select>
        </div>

        {/* Department */}
        <div className="flex items-center">
          <label className="w-1/3 text-white font-semibold">Department:</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-2/3 p-2 rounded-lg bg-gray-200 border border-gray-400"
            required
          />
        </div>

        {/* Year */}
        <div className="flex items-center">
          <label className="w-1/3 text-white font-semibold">Year:</label>
          <select
            name="eligibleYear"
            value={formData.eligibleYear}
            onChange={handleChange}
            className="w-2/3 p-2 rounded-lg bg-gray-200 border border-gray-400"
            required
          >
            <option value="">Select Year</option>
            <option value="First Year">First Year</option>
            <option value="Second Year">Second Year</option>
            <option value="Third Year">Third Year</option>
            <option value="Final Year">Final Year</option>
          </select>
        </div>

        {/* Is Paid */}
        <div className="flex items-center bg-gray-700 p-4 rounded-lg border border-gray-600">
          <label className="w-1/3 text-white font-semibold">Is the event paid?</label>
          <div className="w-2/3 flex space-x-4">
            <label className="flex items-center text-white">
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
            <label className="flex items-center text-white">
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

        {/* Cost */}
        {formData.isPaid && (
          <div className="flex items-center">
            <label className="w-1/3 text-white font-semibold">Cost:</label>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              className="w-2/3 p-2 rounded-lg bg-gray-200 border border-gray-400"
              min="0"
              step="0.01"
            />
          </div>
        )}

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          className="w-full mt-6 p-3 rounded-lg bg-blue-500 text-white text-lg hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default CreateEvent;
