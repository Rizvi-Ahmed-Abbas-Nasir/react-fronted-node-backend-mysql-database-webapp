// import React from 'react';
// import qr from "../assets/qrcodedemo.png"

// const JobBox = ({ title, details, isOpen, onToggle, isOpenPay, onTogglePay }) => {
//   return (
//     <div className="bg-white border rounded-lg shadow-md p-4 w-full max-w-lg flex flex-col ">
//       <div className="flex justify-between items-center  p-2 bg-blue-600 rounded-lg" >
//         <h3 className="text-white text-[1.2rem] font-semibold">{title}</h3>
//         <button
//           className="text-white hover:underline py-2 px-4 bg-blue-500 rounded-lg "
//           onClick={onToggle}
//         >
//           {isOpen ? 'Hide Details' : 'Show Details'}
//         </button>
//       </div>

//       {/* Only render details when the box is open */}
//       {isOpen && (
//         <div className="mt-4">
//           <p><strong>data:</strong> {details.ctc}</p>
//           <p><strong>data Link:</strong> <a href={details.link} className="text-blue-500 hover:underline">Click here</a></p>
//           <p><strong>data :</strong> {details.deadline}</p>
//           <p><strong>data:</strong> {details.role}</p>
//           </div>
//            )}
//           {/* Event Details */}
//           {details.eventDetails && (
//             <div className="mt-4 border-t pt-4 flex gap-2 flex-col w-full" >
//               <h4 className="font-semibold text-red-500 text-[1.5rem]">Event Details</h4>
//               <p><strong>Event Name:</strong> {details.eventDetails.eventName}</p>
//               <p><strong>Name of the Speaker:</strong> {details.eventDetails.speaker}</p>
//               <p><strong>Date of the Event:</strong> {details.eventDetails.date}</p>
//               <p><strong>Category:</strong> {details.eventDetails.category}</p>
//               <p><strong>Department:</strong> {details.eventDetails.department}</p>
//               <p><strong>Year:</strong> {details.eventDetails.year}</p>
//               <p><strong>Payment:</strong> 
//                 <button
//                   className=" ml-2 text-white hover:underline py-1 px-2 bg-green-500 rounded-lg"
//                   onClick={onTogglePay}
//                 >
//                   {isOpenPay ? 'Hide Payment' : 'Show Payment'}
//                 </button>
//               </p>
//               {isOpenPay && (
//                 <div>
//                   <img src={qr} />
//                 </div>
//               )}
//               <div className='w-full  mt-5'>
//               <button className=" ml-2 w-40 text-white hover:underline py-1 px-2 bg-blue-600 rounded-lg">
//                 Register
//               </button>
//               </div>
//               {/* <p><strong>Event ID:</strong> {details.eventDetails.eventId}</p> */}
//             </div>
//           )}
   
     
//     </div>
//   );
// };

// export default JobBox;
