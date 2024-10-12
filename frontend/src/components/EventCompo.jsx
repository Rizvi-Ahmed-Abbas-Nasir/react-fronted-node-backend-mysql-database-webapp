import React, { useState, useEffect } from "react";
import nodeApi from "../axiosConfig";
import CustomAlert from "../components/customAlert";

const EventCompo = () => {
  const [openPayBoxes, setOpenPayBoxes] = useState([]);
  const [openPaymentBoxes, setOpenPaymentBoxes] = useState([]); // New state for payment section
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactionIds, setTransactionIds] = useState({});
  const [transactionErrors, setTransactionErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState(""); // State for custom alert message
  const [showAlert, setShowAlert] = useState(false); // State to show or hide the custom alert

  const StdID = "3"; // Placeholder student ID, adjust as needed

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await nodeApi.get(`/getEligibleEvents/${StdID}`);
        setData(response.data.result);
        console.log(response.data)
        setOpenPayBoxes(new Array(response.data.length).fill(false));
        setOpenPaymentBoxes(new Array(response.data.length).fill(false)); // Initialize payment state
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

  const handleTogglePayment = (index) => {
    const newOpenPaymentBoxes = [...openPaymentBoxes];
    newOpenPaymentBoxes[index] = !newOpenPaymentBoxes[index];
    setOpenPaymentBoxes(newOpenPaymentBoxes);
  };

  const handleTransactionIdChange = (eventId, value) => {
    setTransactionIds((prevState) => ({
      ...prevState,
      [eventId]: value.trim(),
    }));

    setTransactionErrors((prevState) => ({
      ...prevState,
      [eventId]: "",
    }));
  };

  const registerClicked = async (event, eventId, isPaid) => {
    event.preventDefault();

    if (
      isPaid &&
      (!transactionIds[eventId] || transactionIds[eventId].trim() === "")
    ) {
      setAlertMessage("Please enter the transaction ID for paid events.");
      setTransactionErrors((prevState) => ({
        ...prevState,
        [eventId]: "Transaction ID is required for paid events.",
      }));
      setShowAlert(true);
      return;
    }

    const transactionId = isPaid ? transactionIds[eventId].trim() : null;

    try {
      const response = await nodeApi.post(
        `/userEventReg/${eventId}`,
        {
          student_id: StdID,
          transaction_id: transactionId,
        }
      );

      if (response.data) {
        alert(response.data.message);
      } else {
        alert("Registration failed.");
      }
    } catch (err) {
      alert("An error occurred during registration: " + err.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {showAlert && (
        <CustomAlert
          message={alertMessage}
          onClose={() => setShowAlert(false)} // Close the alert
        />
      )}

      {data.length > 0 ? (
        <div className="flex w-full flex-wrap gap-4 items-start md:py-12  mt-16 md:pl-10 ">
          {data.map(
            (event, index) =>
              !event.isDeleted && (
                <div
                  key={index}
                  className="bg-white border  rounded-lg shadow-md p-4 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 md:min-h-[600px] md:max-h-[600px]  overflow-y-hidden hover:overflow-y-scroll flex flex-col justify-start"
                >
                  <div className="flex justify-between  items-center p-2 bg-blue-600 rounded-lg">
                    <div>
                      <h3 className="text-white text-[1.2rem] font-semibold">
                        <strong>Event:</strong> {event.eventName}
                      </h3>
                    </div>
                    <div>
                      <button
                        className="ml-2 text-white hover:underline py-1 px-2 bg-blue-500 rounded-lg"
                        onClick={() => handleTogglePay(index)}
                      >
                        {openPayBoxes[index] ? "Hide Details" : "Show Details"}
                      </button>
                    </div>
                  </div>

                  <div className="mt-2">
                    {/* Event Details */}
                    {event.banner && (
                      <img
                        src={`http://localhost:8000/${event.banner}`}
                        alt="Event Banner"
                        className="w-full h-48 object-cover rounded-md mb-4"
                      />
                    )}
                    <p>
                      <strong>Speaker:</strong> {event.nameOfSpeaker}
                    </p>
                    <p>
                      <strong>Date:</strong> {event.date.split("T")[0]}
                    </p>
                    <p>
                      <strong>Deadline:</strong>{" "}
                      {event.eventDeadline.split("T")[0]}
                    </p>
                    <p>
                      <strong>Time:</strong> {event.time}
                    </p>
                    

                    {openPayBoxes[index] && (
                      <>
                        <p>
                          <strong>Department:</strong> {event.department}
                        </p>
                        <p>
                          <strong>Eligible Year:</strong> {event.eligible_degree_year}
                        </p>
                        <a
                          className="text-blue-700 font-bold underline"
                          href={`http://localhost:8000/${event.notice}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Notice
                        </a>

                        {/* Payment Section */}
                        {event.isPaid ? (
                          <div className="mt-4">
                            <button
                              className="ml-2 text-white hover:underline py-1 px-2 bg-green-500 rounded-lg"
                              onClick={() => handleTogglePayment(index)}
                            >
                              {openPaymentBoxes[index]
                                ? "Hide Payment"
                                : "Show Payment"}
                            </button>

                            {openPaymentBoxes[index] && (
                              <div className="mt-4">
                                <img
                                  src={`/${event.paymentQR}`}
                                  alt="QR Code for Payment"
                                  className="w-full h-32 object-contain"
                                />

                                <p>
                                  <strong>Transaction Id:</strong>
                                </p>
                                <input
                                  id={`transaction-${event.eventId}`}
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
                                {transactionErrors[event.eventId] && (
                                  <p className="text-red-600">
                                    {transactionErrors[event.eventId]}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="mb-20 font-bold">Free</p>
                        )}
                      </>
                    )}
                    <form
                      onSubmit={(e) =>
                        registerClicked(
                          e,
                          event.eventId,
                          event.isPaid
                        )
                      }
                    >
                      <button
                        type="submit"
                        className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg"
                      >
                        Register
                      </button>
                    </form>
                  </div>
                </div>
              )
          )}
        </div>
      ) : (
        <div>No events available for your criteria.</div>
      )}
    </>
  );
};

export default EventCompo;
