import React, { useState } from "react";
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
    eventDeadline: "",
    category: "",
    time: "",
    department: [],
    eligible_degree_year: [],
    isPaid: false,
    cost: null,
    banner: null,
    paymentQR: null,
  });

  const [editEventId, setEditEventId] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [bannerPreview, setBannerPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    // Handle file inputs for different fields like banner, paymentQR, etc.
    if (type === "file") {
      // Check which file input is being handled based on the `name` attribute
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
    } else if (name === "eligible_degree_year") {
      // Handle eligible years as a checkbox
      const updatedYears = checked
        ? [...formData.eligible_degree_year, value]
        : formData?.eligible_degree_year?.filter((year) => year !== value);
      // console.log(updatedYears);
      setFormData({ ...formData, eligible_degree_year: updatedYears });
    } else if (name === "department") {
      // Handle department as a checkbox
      const updatedDepartments = checked
        ? [...formData.department, value]
        : formData.department.filter((dep) => dep !== value);
      setFormData({ ...formData, department: updatedDepartments });
    } else {
      // Handle other inputs (radio, text, select, etc.)
      setFormData({
        ...formData,
        [name]: type === "radio" ? value === "true" : value,
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (
      !formData.eventName ||
      !formData.nameOfSpeaker ||
      !formData.date ||
      !formData.eventDeadline
    ) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      const formattedDate = formatDate(formData.date);
      const formattedDeadlineDate = formatDate(formData.eventDeadline);
      const data = new FormData();
      data.append("eventName", formData.eventName);
      data.append("eventDescription", formData.eventDescription); // New field
      data.append("nameOfSpeaker", formData.nameOfSpeaker);
      data.append("organizationOfSpeaker", formData.organizationOfSpeaker); // New field
      data.append("locationOfSpeaker", formData.locationOfSpeaker); // New field
      data.append("eventNotice", formData.eventNotice); // New field
      data.append("date", formattedDate);
      data.append("eventDeadline", formattedDeadlineDate);
      data.append("category", formData.category);
      data.append("time", formData.time);
      data.append("department", formData.department);
      data.append("eligible_degree_year", formData.eligible_degree_year);
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
          `${process.env.REACT_APP_URL}/event/${editEventId}`,
          data
        );
        setEditEventId(null);
        alert(response.data.message);
      } else {
        const response = await axios.post(`${process.env.REACT_APP_URL}/event`, data);
        alert(response.data.message);
      }

      setFormData({
        eventName: "",
        eventDescription: "", // Reset new field
        nameOfSpeaker: "",
        organizationOfSpeaker: "", // Reset new field
        locationOfSpeaker: "", // Reset new field
        eventNotice: "",
        date: "",
        eventDeadline: "",
        category: "",
        time: "",
        department: [],
        eligible_degree_year: [],
        isPaid: false,
        cost: null,
        banner: null,
        paymentQR: null,
      });
      setError("");
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
          <label className="w-1/3 font-semibold">Degree Year:</label>
          <div className="w-2/3 space-x-4 border border-gray-300 p-4 rounded-lg">
            {["2025", "2026", "2027", "2028"].map((year) => (
              <label key={year} className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="eligible_degree_year"
                  value={year}
                  checked={formData.eligible_degree_year.includes(year)}
                  onChange={handleChange}
                  className="mr-2 custom-checkbox rounded-lg"
                />
                {year}
              </label>
            ))}
          </div>
        </div>
        <div className="flex items-center">
          <label className="w-1/3 font-semibold">Department:</label>
          <div className="w-2/3 space-x-4 border border-gray-300 p-4 rounded-lg">
            {["Comps", "IT", "AIDS"].map((department) => (
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
            ))}
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
                style={{ width: "24px", height: "24px" }} // Apply size
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
                style={{ width: "24px", height: "24px" }} // Apply size
              />
              Not Paid
            </label>
          </div>
        </div>

        {formData.isPaid && (
          <div>
            <div className="flex items-center ">
              <label className="w-1/3 font-semibold">Cost:</label>
              <input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                className="w-2/3 p-2 rounded-lg bg-gray-100 text-black border border-gray-300 focus:border-blue-400"
              />
            </div>
            <div className="flex items-center mt-2">
              <label className="w-1/3 font-semibold">Payment QR:</label>
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
              "Creating Event"
            ) : (
              "Create Event"
            )}
          </button>
        </div>
      </form>
      <style jsx>{`
        .custom-checkbox {
          position: relative;
          display: inline-block;
          width: 1.1rem; /* Increase width as needed */
          height: 1.1rem; /* Increase height as needed */
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
          content: "";
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
          background-color: #007bff; /* Background color when checked */
          border-color: #007bff; /* Border color when checked */
        }
      `}</style>
    </div>
  );
}

export default CreateEvent;
