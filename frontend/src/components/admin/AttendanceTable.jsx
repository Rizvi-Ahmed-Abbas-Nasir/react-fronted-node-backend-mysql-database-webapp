import React, { useEffect, useState } from "react";
import axios from "axios";
const converter = require('json-2-csv');
function AttendanceTable() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [error, setError] = useState("");

   
  useEffect(() => {
    // Fetch data using axios
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/getAllAttendance"
        );
        setAttendanceData(response.data.result);
 
      } catch (err) {
        setError("Failed to fetch attendance data");
        console.error(err);
      }
    };

    fetchAttendanceData();
  }, []);
  
 
  const handleDownloadCSV = () => {
    try {
      
          const csv = converter.json2csv(attendanceData);
             // Convert JSON data to CSV
          const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csv); // Create data URL
    
          // Create a temporary link element
          const link = document.createElement('a');
          link.href = encodedUri;
          link.setAttribute('download', 'data.csv'); // Set download attribute
          document.body.appendChild(link);
          link.click(); // Trigger the download
    
          // Clean up
          document.body.removeChild(link);
      
      
    } catch (error) {
      console.error('Error generating CSV:', error);
    }
  };



  return (
    <div className="flex flex-col gap-4 justify-start items-start md:ml-72 md:mt-32 w-auto">
      <h1 className="text-2xl font-bold">Registration Details</h1>
      {/* {error && <p className="text-red-500">{error}</p>} */}
      {attendanceData?.length > 0 ? (
        <div className=" overflow-x-scroll">
          <table className="table-auto border-collapse w-full min-w-max">
            <thead>
              <tr>
                <th className="border px-4 py-2" >Student ID</th>
                <th className="border px-4 py-2">College ID</th>
                <th className="border px-4 py-2">Name</th>
                {attendanceData.length > 0 &&
                  Object.keys(attendanceData[0].events).map((event, index) => (
                    <th key={index} className="border px-4 py-2">
                      {event}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((student) => (
                <tr key={student.student_id}>
                  <td className="border px-4 py-2">{student.student_id}</td>
                  <td className="border px-4 py-2">{student.clg_id}</td>
                  <td className="border px-4 py-2">{`${student.first_name} ${
                    student.middle_name || ""
                  } ${student.last_name}`}</td>
                  {Object.values(student.events).map((status, index) => (
                    <td key={index} className="border px-4 py-2">
                      {status === 1
                        ? "Present"
                        : status === 0
                        ? "Absent"
                        : "Not Registered"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        
        </div>
      ) : (
        <div className="">
          <p>No Data yet</p>
        </div>
      )}
     <button onClick={handleDownloadCSV} className="px-4 py-2 bg-green-500 text-white rounded mr-2">DOWNLOAD CSV</button>
    </div>
  );
}

export default AttendanceTable;
