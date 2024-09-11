import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
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


 

  const flattenAndTransformObject = (obj, parent = '', res = {}) => {
    for (let key in obj) {
      const propName = parent ? `${parent}.${key}` : key; 
      let value = obj[key];

       if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        flattenAndTransformObject(value, propName, res);
      } else {
        
        if (propName.includes('events')) {
          
          value = value === null ? 'Not Participated' : value === 1 ? 'Participated' : 'Absent  ';
        } else if (['first_name', 'middle_name', 'last_name'].includes(key)) {
         
          value = value.charAt(0).toUpperCase() + value.slice(1);
        }

        res[propName] = value;
      }
    }
    return res;
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

   
    const flattenedData = attendanceData.map(item => flattenAndTransformObject(item));
    const headers = Object.keys(flattenedData.reduce((acc, item) => ({
      ...acc,
      ...item
    }), {})).map(key => ({
      header: key,
      dataKey: key
    }));

   
    doc.autoTable({
      columns: headers,
      body: flattenedData,
      margin: { top: 20 },
      theme: 'striped',
      styles: {
        cellWidth: 'auto',
        overflow: 'linebreak',
        cellPadding: 2,
        fontSize : 10,
      }});
  
    doc.save('dynamic-data.pdf');
  };
 
  const handleDownloadCSV = () => {
    try {
      
          const csv = converter.json2csv(flattenAndTransformObject(attendanceData));
            
          const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csv); // Create data URL
    
         
          const link = document.createElement('a');
          link.href = encodedUri;
          link.setAttribute('download', 'data.csv'); 
          document.body.appendChild(link);
          link.click();
    
          document.body.removeChild(link);
      
      
    } catch (error) {
      console.error('Error generating CSV:', error);
    }
  };
  
  const exportToExcel = () => {
    
    const transformedData = attendanceData.map(item => flattenAndTransformObject(item));
    const worksheet = XLSX.utils.json_to_sheet(transformedData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(excelBlob, 'exported_data.xlsx');
  };


  return (
    <div className="flex flex-col gap-4 justify-start items-start md:ml-72 md:mt-32 w-auto">
      
      <h1 className="text-2xl font-bold">Registration Details</h1>
      <div className="flex">
      <button onClick={handleDownloadCSV} className="px-4 py-2 bg-green-500 text-white rounded mr-2">DOWNLOAD CSV</button>
      <button  onClick={handleDownloadPDF} className="px-4 py-2 bg-green-500 text-white rounded mr-2"> DOWNLOAD PDF</button>
      <button onClick={exportToExcel} className="px-4 py-2 bg-green-500 text-white rounded mr-2">DOWNLOAD EXEL</button>
      </div>
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
     
    </div>
  );
}

export default AttendanceTable;
