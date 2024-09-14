import React, { useState, useEffect } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

function CreateEvent() {
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
    cost: null,
    banner: null,
  });

  const [events, setEvents] = useState([]);
  const [editEventId, setEditEventId] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [bannerPreview, setBannerPreview] = useState(null);
  

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:8000/event");
      setEvents(response.data);
    } catch (error) {
      setError("Failed to fetch events.");
    }
  };

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
        : formData?.eligibleYear?.filter((year) => year !== value);
        console.log(updatedYears);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!formData.eventName || !formData.nameOfSpeaker || !formData.date) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      const formattedDate = formatDate(formData.date);
      const data = new FormData();
      data.append("eventName", formData.eventName);
      data.append("eventDescription", formData.eventDescription); // New field
      data.append("nameOfSpeaker", formData.nameOfSpeaker);
      data.append("organizationOfSpeaker", formData.organizationOfSpeaker); // New field
      data.append("locationOfSpeaker", formData.locationOfSpeaker); // New field
      data.append('eventNotice',formData.eventNotice); // New field
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
        const response = await axios.put(`http://localhost:8000/event/${editEventId}`, data);
        setEditEventId(null);
        alert(response.data.message)
      } else {
        const response = await axios.post("http://localhost:8000/event", data);
        alert(response.data.message)
      }

      setFormData({
        eventName: "",
        eventDescription: "", // Reset new field
        nameOfSpeaker: "",
        organizationOfSpeaker: "", // Reset new field
        locationOfSpeaker: "", // Reset new field
        eventNotice:"",
        date: "",
        category: "",
        time: "",
        department: [],
        eligibleYear: [],
        isPaid: false,
        cost: null,
        banner: null,
      });
      setError("");
      fetchEvents();
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    setIsLoading(false);

    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
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
          <label className="w-1/3 font-semibold">Year:</label>
          <div className="w-2/3 space-x-4">
            {["FE", "SE", "TE", "BE"].map(
              (year) => (
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
              )
            )}
          </div>
        </div>
        <div className="flex items-center">
          <label className="w-1/3 font-semibold">Department:</label>
          <div className="w-2/3 space-x-4">
            {["Comps", "IT", "AIDS"].map(
              (department) => (
                <label key={department} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="department"
                    value={department}
                    checked={formData.department.includes(department)}
                    onChange={handleChange}
                    className="mr-2"
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
              value={formData.cost || ""}
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
            {isLoading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateEvent;
