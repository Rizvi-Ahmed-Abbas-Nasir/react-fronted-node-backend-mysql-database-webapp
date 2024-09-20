import React, { useState, useEffect } from "react";
import axios from "axios";

const EventCompo = () => {
  const [openPayBoxes, setOpenPayBoxes] = useState([]); // Adjust to handle dynamic number of events
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactionIds, setTransactionIds] = useState({}); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/event");
        setData(response.data);
        setOpenPayBoxes(new Array(response.data.length).fill(false)); // Initialize openPayBoxes for each event
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

  const handleTransactionIdChange = (eventId, value) => {
    setTransactionIds((prevState) => ({
      ...prevState,
      [eventId]: value,
    }));
  };

  const registerClicked = async (event, eventId, isPaid) => {
    event.preventDefault(); 

    const transactionId = isPaid ? transactionIds[eventId] : null;

    try {
      const response = await axios.post(
        `http://localhost:8000/userEventReg/${eventId}`,
        {
          student_id: 1, 
          transaction_id: transactionId,
        }
      );

      if (response.data) {
        alert(response.data.message);
      } else {
        alert("Registration failed.");
      }
    } catch (err) {
      alert("An error occurred during registration." + err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {data.length > 0 ? (
        <div className="flex w-full flex-wrap gap-4 justify-center items-start py-12 pl-10 mt-16">
          {data.map(
            (event, index) =>
              !event.isDeleted && (
                <div
                  key={index}
                  className="bg-white border rounded-lg shadow-md p-4 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 h-auto flex flex-col justify-between"
                >
                  <div className="flex justify-between items-center p-2 bg-blue-600 rounded-lg">
                    <h3 className="text-white text-[1.2rem] font-semibold">
                      <strong>Event:</strong> {event.eventName}
                    </h3>
                  </div>
                  <div className="mt-4">
                    {event.banner ? (
                      <img
                        src={`http://localhost:8000/${event.banner}`}
                        alt="Event Banner"
                        className="w-full h-48 object-cover rounded-md mb-4"
                      />
                    ) : null}
                    <p>
                      <strong>Speaker:</strong> {event.nameOfSpeaker}
                    </p>
                    <p>
                      <strong>Date:</strong> {event.date.split("T")[0]}
                    </p>
                    <p>
                      <strong>Time:</strong> {event.time}
                    </p>
                    <p>
                      <strong>Category:</strong> {event.category}
                    </p>
                    <p>
                      <strong>Department:</strong> {event.department}
                    </p>
                    <p>
                      <strong>Eligible Year:</strong> {event.eligibleYear}
                    </p>
                    <a
                      className="text-blue-700 font-bold underline"
                      href={`http://localhost:8000/${event.notice}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Notice
                    </a>

                    {event.isPaid ? (
                      <p>
                        <strong>Payment:</strong>
                        <button
                          className="ml-2 text-white hover:underline py-1 px-2 bg-green-500 rounded-lg"
                          onClick={() => handleTogglePay(index)}
                        >
                          {openPayBoxes[index]
                            ? "Hide Payment"
                            : "Show Payment"}
                        </button>
                      </p>
                    ) : (
                      <p>
                        <strong>FREE</strong>
                      </p>
                    )}

                    {openPayBoxes[index] && (
                      <div>
                        <img
                          src={`http://localhost:8000/${event.paymentQR}`}
                          alt="QR Code for Payment"
                          className="w-full h-32 object-contain"
                        />
                        <p>
                          <strong>Cost:</strong> {event.cost}
                        </p>

                        {/* Show transaction input when payment section is visible */}
                        <div>
                          <p>
                            <strong>Transaction Id:</strong>
                          </p>
                          <input
                            id={`transaction-${event.eventId}`}
                            required
                            value={transactionIds[event.eventId] || ""}
                            onChange={(e) =>
                              handleTransactionIdChange(
                                event.eventId,
                                e.target.value
                              )
                            }
                            className="border-2 border-black w-full p-2"
                            type="text"
                            placeholder="Enter Transaction Id"
                          />
                        </div>
                      </div>
                    )}

                    <form
                      onSubmit={(e) =>
                        registerClicked(e, event.eventId, event.isPaid)
                      }
                    >
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
              )
          )}
        </div>
      ) : (
        <div className="flex w-full flex-wrap gap-4 justify-center items-center py-12">
          <div className="bg-white  p-4 max-w-lg flex flex-col mt-16">
            <p>No Event Record</p>
          </div>
        </div>
      )}
    </>
  );
};

export default EventCompo;
