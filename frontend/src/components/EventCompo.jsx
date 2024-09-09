import React, { useState, useEffect } from 'react';
import axios from 'axios';
import qr from "../assets/qrcodedemo.png"; // Example QR code image

const EventCompo = () => {
  const [openBoxes, setOpenBoxes] = useState([false, false]); // Track which event boxes are open
  const [openPayBoxes, setOpenPayBoxes] = useState([false, false]); // Track which payment sections are open
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactionId, setTransactionId] = useState(""); // Transaction ID state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/event');
        console.log(response.data)
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleTogglePay = (index) => {
    const newOpenPayBoxes = [...openPayBoxes];
    newOpenPayBoxes[index] = !newOpenPayBoxes[index];
    setOpenPayBoxes(newOpenPayBoxes);
  };

  const registerClicked = async (event, eventId, isPaid) => {
    event.preventDefault(); // Prevent default form submission

    const transactionId = isPaid ? document.querySelector(`#transaction-${eventId}`).value : null;
    
    try {
      const response = await axios.post(`http://localhost:8000/userEventReg/${eventId}`, {
        student_id: "14",
        transaction_id: transactionId
      });

      if (response.data) {
        alert("Registration successful!");
      } else {
        alert("Registration failed.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during registration.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-wrap gap-4 justify-start items-start py-12 pl-10">
      {data.map((event, index) => (
        <div key={index} className="bg-white border rounded-lg shadow-md p-4 w-72 max-w-lg flex flex-col mt-16">
          <div className="flex justify-between items-center p-2 bg-blue-600 rounded-lg">
            <h3 className="text-white text-[1.2rem] font-semibold">
              <strong>Event:</strong> {event.eventName}
            </h3>
          </div>
          <div className="mt-4">
            {
              event.banner ?
              <img 
              src={`http://localhost:8000/${event.banner}`} 
              alt="Event Banner" 
              className="w-full h-48 object-cover rounded-md mb-4"
              />
              : null
            }
            <p><strong>Speaker:</strong> {event.nameOfSpeaker}</p>
            <p><strong>Date:</strong> {event.date.split('T')[0]}</p>
            <p><strong>Time:</strong> {event.time}</p>
            <p><strong>Category:</strong> {event.category}</p>
            <p><strong>Department:</strong> {event.department}</p>
            <p><strong>Eligible Year:</strong> {event.eligibleYear}</p>

            {event.isPaid ? (
              <p><strong>Payment:</strong>
                <button
                  className="ml-2 text-white hover:underline py-1 px-2 bg-green-500 rounded-lg"
                  onClick={() => handleTogglePay(index)}
                >
                  {openPayBoxes[index] ? 'Hide Payment' : 'Show Payment'}
                </button>
              </p>
            ) : (
              <p><strong>FREE</strong></p>
            )}

            {openPayBoxes[index] && (
              <div>
                <img src={qr} alt="QR Code for Payment" className="w-full h-32 object-contain" />
                <p><strong>Cost:</strong> {event.cost}</p>
              </div>
            )}
            <form onSubmit={(e) => registerClicked(e, event.eventId, event.isPaid)}>
              {event.isPaid ? (
                <div>
                  <p><strong>Transaction Id:</strong></p>
                  <input
                    id={`transaction-${event.eventId}`}
                    required
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="border-2 border-black w-full p-2"
                    type="text"
                    placeholder="Enter Transaction Id"
                  />
                </div>
              ) : null}

              <div className="w-full justify-center flex mt-10">
                <button
                  type="submit"
                  className="ml-2 text-white hover:underline py-3 px-5 bg-blue-500 rounded-lg"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventCompo;
