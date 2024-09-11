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
<<<<<<< HEAD
          
          value = value === null ? 'Not Participated' : value === 1 ? 'Participated' : 'Absent  ';
=======
          value = value === null ? 'Not Participated' : value === 0 ? 'Participated' : value;
>>>>>>> 8d9701ce070dd8d256e8cc101b3c6d9b30330e30
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
        fontSize: 10,
      }});
    doc.save('dynamic-data.pdf');
  };

  const handleDownloadCSV = () => {
    try {
      const csv = converter.json2csv(flattenAndTransformObject(attendanceData));
      const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csv);
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
    <div className="flex flex-col gap-6 justify-start items-start md:ml-72 md:mt-32 w-auto p-4 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Registration Details</h1>
      <div className="flex space-x-4">
        <button onClick={handleDownloadCSV} className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-200">Download CSV</button>
        <button onClick={handleDownloadPDF} className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200">Download PDF</button>
        <button onClick={exportToExcel} className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-200">Download Excel</button>
      </div>
      {attendanceData?.length > 0 ? (
        <div className="overflow-x-auto w-full">
          <table className="table-auto border-collapse w-full min-w-max bg-white shadow-lg rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-6 py-3 text-gray-700 text-sm font-medium">Student ID</th>
                <th className="border px-6 py-3 text-gray-700 text-sm font-medium">College ID</th>
                <th className="border px-6 py-3 text-gray-700 text-sm font-medium">Name</th>
                {attendanceData.length > 0 &&
                  Object.keys(attendanceData[0].events).map((event, index) => (
                    <th key={index} className="border px-6 py-3 text-gray-700 text-sm font-medium">
                      {event}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((student) => (
                <tr key={student.student_id} className="even:bg-gray-100 odd:bg-white">
                  <td className="border px-6 py-4 text-gray-800">{student.student_id}</td>
                  <td className="border px-6 py-4 text-gray-800">{student.clg_id}</td>
                  <td className="border px-6 py-4 text-gray-800">{`${student.first_name} ${student.middle_name || ""} ${student.last_name}`}</td>
                  {Object.values(student.events).map((status, index) => (
                    <td key={index} className="border px-6 py-4 text-center text-gray-800">
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
        <div className="text-gray-500">
          <p>No Data yet</p>
        </div>
      )}
    </div>
  );
}

export default AttendanceTable;
