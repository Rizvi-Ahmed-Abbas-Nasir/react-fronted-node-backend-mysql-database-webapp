import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../header";
import AdminHeader from "./AdminHeader";

function EditEventForm() {
  const [formData, setFormData] = useState({
    eventName: "",
    eventDescription: "",
    nameOfSpeaker: "",
    organizationOfSpeaker: "",
    locationOfSpeaker: "",
    eventNotice: "",
    date: "",
    category: "",
    time: "",
    department: [],
    eligibleYear: [],
    isPaid: false,
    cost: "",
    banner: null,
  });
  const [editEventId, setEditEventId] = useState(null);
  const [events, setEvents] = useState([]); // For storing existing events
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const departments = ["Computer", "IT", "AIDS"];
  const eligibleYears = [
    "First Year",
    "Second Year",
    "Third Year",
    "Final Year",
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
      setFormData({
        ...formData,
        banner: files[0],
      });
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
      const data = new FormData();
      data.append("eventName", formData.eventName);
      data.append("eventDescription", formData.eventDescription);
      data.append("nameOfSpeaker", formData.nameOfSpeaker);
      data.append("organizationOfSpeaker", formData.organizationOfSpeaker);
      data.append("locationOfSpeaker", formData.locationOfSpeaker);
      data.append("eventNotice", formData.eventNotice);
      data.append("date", formattedDate);
      data.append("category", formData.category);
      data.append("time", formData.time);
      data.append("department", formData.department);
      data.append("eligibleYear", formData.eligibleYear);
      data.append("isPaid", formData.isPaid);
      data.append("cost", formData.isPaid ? parseInt(formData.cost, 10) : null);
      if (formData.banner) {
        data.append("banner", formData.banner);
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
      category: event.category,
      time: event.time,
      department: event.department,
      eligibleYear: event.eligibleYear,
      isPaid: event.isPaid,
      cost: event.isPaid ? event.cost : "",
      banner: null,
    });
    setEditEventId(event.eventId);
  };

  return (
    <div className="lg:ml-72 lg:mt-32 w-full mt-10 lg:w-[80%] p-8 border border-gray-300 shadow-md rounded-lg text-black">
      <h2 className="text-2xl mb-6 text-center">Edit Event</h2>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2">Event Name</label>
          <input
            type="text"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Event Description</label>
          <textarea
            name="eventDescription"
            value={formData.eventDescription}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
            required
          ></textarea>
        </div>

        <div>
          <label className="block mb-2">Name of Speaker</label>
          <input
            type="text"
            name="nameOfSpeaker"
            value={formData.nameOfSpeaker}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Organization of Speaker</label>
          <input
            type="text"
            name="organizationOfSpeaker"
            value={formData.organizationOfSpeaker}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        <div>
          <label className="block mb-2">Location of Speaker</label>
          <input
            type="text"
            name="locationOfSpeaker"
            value={formData.locationOfSpeaker}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        <div>
          <label className="block mb-2">Event Notice</label>
          <textarea
            name="eventNotice"
            value={formData.eventNotice}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
            required
          ></textarea>
        </div>

        <div>
          <label className="block mb-2">Event Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Event Time</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Event Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Departments</label>
          {departments.map((dep) => (
            <div key={dep}>
              <input
                type="checkbox"
                name="department"
                value={dep}
                checked={formData.department.includes(dep)}
                onChange={handleChange}
              />
              <label className="ml-2">{dep}</label>
            </div>
          ))}
        </div>

        <div>
          <label className="block mb-2">Eligible Year</label>
          {eligibleYears.map((year) => (
            <div key={year}>
              <input
                type="checkbox"
                name="eligibleYear"
                value={year}
                checked={formData.eligibleYear.includes(year)}
                onChange={handleChange}
              />
              <label className="ml-2">{year}</label>
            </div>
          ))}
        </div>

        <div>
          <label className="block mb-2">Is the Event Paid?</label>
          <div>
            <input
              type="radio"
              name="isPaid"
              value={true}
              checked={formData.isPaid === true}
              onChange={handleChange}
            />{" "}
            Yes
            <input
              type="radio"
              name="isPaid"
              value={false}
              checked={formData.isPaid === false}
              onChange={handleChange}
              className="ml-4"
            />{" "}
            No
          </div>
        </div>

        {formData.isPaid && (
          <div>
            <label className="block mb-2">Cost</label>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
            />
          </div>
        )}

        <div>
          <label className="block mb-2">Upload Event Banner</label>
          <input
            type="file"
            name="banner"
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {isLoading ? "Updating..." : "Update Event"}
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
    </div>
  );
}

export default EditEventForm;
