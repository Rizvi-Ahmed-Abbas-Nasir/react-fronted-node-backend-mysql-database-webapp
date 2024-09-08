import React from 'react';
import qr from "../assets/qrcodedemo.png"

const JobBox = ({ eventName,  nameOfSpeaker, isOpen, date, category, time, department ,eligibleYear,isPaid,cost ,onTogglePay,isOpenPay}) => {
  const registerBtn =()=>{
    alert('Registration Successful');
  }
  return (
    <div className="bg-white border rounded-lg shadow-md p-4 flex flex-col mt-20 w-80 ">
      <div className="flex justify-between items-center  p-2 bg-blue-600 rounded-lg" >
        <h3 className="text-white text-[1.2rem] font-semibold">{eventName}</h3>
      </div>

        
    
          {/* Event Details */}
          {(
            <div className="mt-4 border-t pt-4 flex gap-2 flex-col" >
              <h4 className="font-semibold text-red-500 text-[1.5rem]">Event Details</h4>
              <p><strong>Event Name:</strong> {eventName}</p>
              <p><strong>Name of the Speaker:</strong> {nameOfSpeaker}</p>
              <p><strong>Date of the Event:</strong> {date}</p>
              <p><strong>Category:</strong> {category}</p>
              <p><strong>Department:</strong> {department}</p>
              <p><strong>Year:</strong> {eligibleYear}</p>
              {isPaid?
              <div>
              <p><strong>Payment:</strong> 
                <button
                  className=" ml-2 text-white hover:underline py-1 px-2 bg-green-500 rounded-lg"
                  onClick={onTogglePay}
                  >
                  {isOpenPay ? 'Hide Payment' : 'Show Payment'}
                </button>
              </p>
              {isOpenPay && (
                <div>
                  <img src={qr} alt={'qrcode'}/>
                </div>
              )}
              </div>
              :<p><strong>FREE</strong></p>}
              {isPaid?
              <div >
                <p><strong>Transaction Id:</strong> </p>
                <input className='border' type="text" placeholder='Enter Transaction Id'/>
              </div>
              
            :null}
              <div className=' mt-5'>
              <button onClick={registerBtn} className=" ml-2 w-40 text-white hover:underline py-1 px-2 bg-blue-600 rounded-lg">
                Register
              </button>
              </div>
              {/* <p><strong>Event ID:</strong> {details.eventDetails.eventId}</p> */}
            </div>
          )}
   
     
    </div>
  );
};

export default JobBox;
