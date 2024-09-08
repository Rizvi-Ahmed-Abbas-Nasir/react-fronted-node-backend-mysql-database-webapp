import React, { useState } from 'react';
import JobBox from './JobBox';

const AdminEvent = () => {
  const [openBoxes, setOpenBoxes] = useState([false, false]); // Track which job boxes are open
  const [openPayBoxes, setOpenPayBoxes] = useState([false, false]); // Track which payment sections are open

  const [event,setEvent] = useState({
    eventName:"",
    nameOfSpeaker:"",
    date:"",
    category:"",
    time:"",
    department:"",
    eligibleYear:"",
    isPaid:"",
    cost:"0",
    
    
  })  
 
  return (
    <div className="flex flex-wrap gap-4 justify-start items-start py-12 pl-10">
       <input 
       id="username"
       value={event.eventName}
       onChange={(e) => setEvent({...event,eventName:e.target.value})}
       type="text"
       />
       
    </div>
  );
};

export default EventCompo;
