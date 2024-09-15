import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../header";
import AdminHeader from "./AdminHeader";
import ClipLoader from "react-spinners/ClipLoader";


function EditEventForm() {
  const [formData, setFormData] = useState({
    eventName: "",
    eventDescription: "",
    nameOfSpeaker: "",
    organizationOfSpeaker: "",
    locationOfSpeaker: "",
    eventNotice: "",
    date: "",
    eventDeadline:"",
    category: "",
    time: "",
    department: [],
    eligibleYear: [],
    isPaid: false,
    cost: "",
    banner: null,
    paymentQR:null,
  });
  const [editEventId, setEditEventId] = useState(null);
  const [events, setEvents] = useState([]); // For storing existing events
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const departments = ["Comps", "IT", "AIDS"];
  const eligibleYears = [
    "FE",
    "SE",
    "TE",
    "BE",
  ];

  useEffect(() => {
    fetchAllEvents(); // Load all events when component mounts
  }, []);

  // Fetch all existing events
  const fetchAllEvents = async () => {
    try {
      const response = await axios.get("http://localhost:8000/event");
      setEvents(response.data);
    } catch (error) {
      setError("Failed to load events.");
    }
  };

  // Handle change in form inputs
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      if (name === "banner") {
        setFormData({
          ...formData,
          banner: files[0],  // Store banner image
        });
      } else if (name === "paymentQR") {
        setFormData({
          ...formData,
          paymentQR: files[0],  // Store payment QR image
        });
      }
    } else if (name === "eligibleYear") {
      const updatedYears = checked
        ? [...formData.eligibleYear, value]
        : formData.eligibleYear.filter((year) => year !== value);
      setFormData({ ...formData, eligibleYear: updatedYears });
    } else if (name === "department") {
      const updatedDepartments = checked
        ? [...formData.department, value]
        : formData.department.filter((dep) => dep !== value);
      setFormData({ ...formData, department: updatedDepartments });
    } else {
      setFormData({
        ...formData,
        [name]: type === "radio" ? value === "true" : value,
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formattedDate = formatDate(formData.date);
      const deadlineDate = formatDate(formData.eventDeadline);
      const data = new FormData();
      data.append("eventName", formData.eventName);
      data.append("eventDescription", formData.eventDescription);
      data.append("nameOfSpeaker", formData.nameOfSpeaker);
      data.append("organizationOfSpeaker", formData.organizationOfSpeaker);
      data.append("locationOfSpeaker", formData.locationOfSpeaker);
      data.append("eventNotice", formData.eventNotice);
      data.append("date", formattedDate);
      data.append("eventDeadline", deadlineDate);
      data.append("category", formData.category);
      data.append("time", formData.time);
      data.append("department", formData.department);
      data.append("eligibleYear", formData.eligibleYear);
      data.append("isPaid", formData.isPaid);
      data.append("cost", formData.isPaid ? parseInt(formData.cost, 10) : null);
      if (formData.banner) {
        data.append("banner", formData.banner);
      }
      if (formData.paymentQR) {
        data.append("paymentQR", formData.paymentQR);
      }
      if (editEventId) {
        const response = await axios.put(
          `http://localhost:8000/event/${editEventId}`,
          data
        );
        setEditEventId(null);
        alert(response.data.message);
        setIsLoading(false);
        fetchAllEvents(); // Refresh event list after edit
      }
    } catch (error) {
      setError("Failed to update event.");
      setIsLoading(false);
    }
  };

  // Format the date for the form
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  // Handle event deletion
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/event/${id}`);
      alert("Event deleted successfully");
      fetchAllEvents(); // Refresh the event list after delete
    } catch (error) {
      setError("Failed to delete the event.");
    }
  };
  const handleRemove = async (id) => {
    if (
      window.confirm("Are you sure you want to mark this event as removed?")
    ) {
      try {
        const data = await axios.delete(
          `http://localhost:8000/removeEvent/${id}`
        );
        fetchAllEvents();
        alert(data.data.message);
      } catch (error) {
        setError("Failed to remove the event.");
      }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });

  };

  // Handle edit button click
  const handleEdit = (event) => {
    event.eligibleYear = [];
    event.department = [];
    setFormData({
      eventName: event.eventName,
      eventDescription: event.eventDescription,
      nameOfSpeaker: event.nameOfSpeaker,
      organizationOfSpeaker: event.organizationOfSpeaker,
      locationOfSpeaker: event.locationOfSpeaker,
      eventNotice: event.eventNotice,
      date: formatDate(event.date),
      eventDeadline: formatDate(event.eventDeadline),
      category: event.category,
      time: event.time,
      department: event.department,
      eligibleYear: event.eligibleYear,
      isPaid: event.isPaid,
      cost: event.isPaid ? event.cost : "",
      banner: null,
      paymentQR:null
    });
    setEditEventId(event.eventId);
    window.scrollTo({ top: 0, behavior: "smooth" });

  };

  return (
    <div className="lg:ml-72 lg:mt-32 w-full mt-10 lg:w-[80%] p-8 border border-gray-300 shadow-md rounded-lg text-black">
      <h2 className="text-2xl mb-6 text-center">Edit Event</h2>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

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
          <label className="w-1/3 font-semibold">Event Deadline:</label>
          <input
            type="date"
            name="eventDeadline"
            value={formData.eventDeadline}
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
          <label className="w-1/3 font-semibold">Year:</label>
          <div className="w-2/3 space-x-4 border border-gray-300 p-4 rounded-lg">
            {["FE", "SE", "TE", "BE"].map(
              (year) => (
                <label key={year} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="eligibleYear"
                    value={year}
                    checked={formData.eligibleYear.includes(year)}
                    onChange={handleChange}
                    className="mr-2 custom-checkbox rounded-lg"
                  />
                  {year}
                </label>
              )
            )}
          </div>
        </div>
        <div className="flex items-center">
          <label className="w-1/3 font-semibold">Department:</label>
          <div className="w-2/3 space-x-4 border border-gray-300 p-4 rounded-lg">
            {["Comps", "IT", "AIDS"].map(
              (department) => (
                <label key={department} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="department"
                    value={department}
                    checked={formData.department.includes(department)}
                    onChange={handleChange}
                    className="mr-2 custom-checkbox rounded-lg"
                  />
                  {department}
                </label>
              )
            )}
          </div>
        </div>
        <div className="flex items-center">
          <label className="w-1/3 font-semibold">Event Description:</label>
          <textarea
            name="eventDescription"
            value={formData.eventDescription}
            onChange={handleChange}
            className="w-2/3 p-2 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-400"
          />
        </div>

        <div className="flex items-center">
          <label className="w-1/3 font-semibold">Speaker Organization:</label>
          <input
            type="text"
            name="organizationOfSpeaker"
            value={formData.organizationOfSpeaker}
            onChange={handleChange}
            className="w-2/3 p-2 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-400"
          />
        </div>

        <div className="flex items-center">
          <label className="w-1/3 font-semibold">Speaker Location:</label>
          <input
            type="text"
            name="locationOfSpeaker"
            value={formData.locationOfSpeaker}
            onChange={handleChange}
            className="w-2/3 p-2 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-400"
          />
        </div>
        <div className="flex items-center">
          <label className="w-1/3 font-semibold">Notice:</label>
          <textarea
            name="eventNotice"
            value={formData.eventNotice}
            onChange={handleChange}
            className="w-2/3 p-2 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-400"
          />
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
          <div className="flex w-2/3 border border-gray-300 p-4 rounded-lg">
            <label className="flex items-center">
              <input
                type="radio"
                name="isPaid"
                value={true}
                checked={formData.isPaid === true}
                onChange={handleChange}
                className="mr-2 custom-radio-input"
                style={{ width: '24px', height: '24px' }} // Apply size
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
                className="mr-2 custom-radio-input"
                style={{ width: '24px', height: '24px' }} // Apply size
              />
              Not Paid
            </label>
          </div>
        </div>

        {formData.isPaid && (
          <div>

          <div className="flex items-center">
            <label className="w-1/3 font-semibold">Cost:</label>
            <input
              type="number"
              name="cost"
              value={formData.cost || ""}
              onChange={handleChange}
              className="w-2/3 p-2 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-400"
              />
          </div>
          <div className="flex items-center mt-2">
          <label className="w-1/3 font-semibold">paymentQR:</label>
          <input
            type="file"
            name="paymentQR"
            onChange={handleChange}
            className="w-2/3 p-2 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-400"
            />
            </div>
        </div>
        )}

<div className="flex justify-center">
          <button
            type="submit"
            className="w-full lg:w-1/3 mt-5 p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
          >
            {isLoading ? (
              <ClipLoader color="white" size={20} />
            ) : isLoading ? (
              "Update Event"
            ) : (
              "Updating Event"
            )}
          </button>
        </div>
      </form>

      {/* Event list */}
      <div>
        <h3 className="text-xl mt-8 mb-4">Existing Events</h3>
        {events.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-left min-w-[600px]">
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
                {events.map((event) => !event.isDeleted && (
                  <tr key={event.eventId} className="border-b border-gray-600">
                    <td className="p-4">{event.eventName}</td>
                    <td className="p-4">{event.nameOfSpeaker}</td>
                    <td className="p-4">
                      {new Date(event.date).toLocaleDateString()}
                    </td>
                    <td className="p-4">{event.isPaid ? "Paid" : "Free"}</td>
                    <td className="p-4">{event.cost ? event.cost : "N/A"}</td>
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
                      <button
                        onClick={() => handleRemove(event.eventId)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                      >
                        Remove
                      </button>
                      {event.loaOfSpeaker && (
                        <a
                          href={`http://localhost:8000/${event.loaOfSpeaker}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                        >
                          View LOA
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No events found.</p>
        )}
      </div>
      <style jsx>{`
     
     .custom-checkbox {
          position: relative;
          display: inline-block;
          width: 1.1rem; /* Increase width as needed */
          height:1.1rem; /* Increase height as needed */
        }
    
        .custom-checkbox input {
          opacity: 0; /* Hide the default checkbox */
          width: 0;
          height: 0;
          margin: 0;
          position: absolute;
        }
    
        .custom-checkbox .checkbox-label {
          display: flex;
          align-items: center;
          cursor: pointer;
          position: relative;
          width: 24px; /* Match the size of the container */
          height: 24px; /* Match the size of the container */
        }
    
        .custom-checkbox .checkbox-label::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 24px; /* Match the size of the container */
          height: 24px; /* Match the size of the container */
          border: 2px solid #ccc; /* Border color */
          background-color: #fff; /* Background color */
          border-radius: 4px; /* Rounded corners */
          box-shadow: inset 0 0 0 2px #000; /* Optional shadow */
          transition: background-color 0.3s, border-color 0.3s;
        }
    
        .custom-checkbox input:checked + .checkbox-label::before {
          background-color: #007BFF; /* Background color when checked */
          border-color: #007BFF; /* Border color when checked */
        }       
          `}</style>
    </div>
  );
}

export default EditEventForm;
