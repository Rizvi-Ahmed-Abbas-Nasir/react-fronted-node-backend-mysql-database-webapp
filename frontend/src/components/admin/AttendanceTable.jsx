import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
let converter = require('json-2-csv');

function AttendanceTable() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState("");
  const [degreeYearFilter, setDegreeYearFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/getAllAttendance`);
        setAttendanceData(response.data.result);
        setFilteredData(response.data.result); // Initialize filteredData
      } catch (err) {
        setError("Failed to fetch attendance data");
        console.error(err);
      }
    };
    fetchAttendanceData();
  }, []);

  const handleFilterChange = () => {
    let newData = attendanceData;
    if (degreeYearFilter) {
      newData = newData.filter(item => item.degree_year === degreeYearFilter);
    }
    if (branchFilter) {
      newData = newData.filter(item => item.branch === branchFilter);
    }
    setFilteredData(newData);
  };

  useEffect(() => {
    handleFilterChange();
  },);

  const exportToExcel = () => {
    // Complete data for the first sheet
    const completeData = filteredData.map(item => {
      const events = item.events;
      let flatData = {
        student_id: item.student_id,
        clg_id: item.clg_id,
        name: `${item.first_name} ${item.middle_name || ''} ${item.last_name}`,
        branch: item.branch,
        degree_year: item.degree_year,
      };
      for (const [eventName, eventDetails] of Object.entries(events)) {
        flatData[`${eventName}_E`] = eventDetails.E;
        flatData[`${eventName}_R`] = eventDetails.R;
        flatData[`${eventName}_P`] = eventDetails.P;
      }
      return flatData;
    });
  
    // E column data
    const eData = filteredData.map(item => {
      const events = item.events;
      let flatData = {
        student_id: item.student_id,
        clg_id: item.clg_id,
        name: `${item.first_name} ${item.middle_name || ''} ${item.last_name}`,
        branch: item.branch,
        degree_year: item.degree_year,
      };
      for (const [eventName, eventDetails] of Object.entries(events)) {
        flatData[`${eventName}_E`] = eventDetails.E;
      }
      return flatData;
    });
  
    // R column data
    const rData = filteredData.map(item => {
      const events = item.events;
      let flatData = {
        student_id: item.student_id,
        clg_id: item.clg_id,
        name: `${item.first_name} ${item.middle_name || ''} ${item.last_name}`,
        branch: item.branch,
        degree_year: item.degree_year,
      };
      for (const [eventName, eventDetails] of Object.entries(events)) {
        flatData[`${eventName}_R`] = eventDetails.R;
      }
      return flatData;
    });
  
    // P column data
    const pData = filteredData.map(item => {
      const events = item.events;
      let flatData = {
        student_id: item.student_id,
        clg_id: item.clg_id,
        name: `${item.first_name} ${item.middle_name || ''} ${item.last_name}`,
        branch: item.branch,
        degree_year: item.degree_year,
      };
      for (const [eventName, eventDetails] of Object.entries(events)) {
        flatData[`${eventName}_P`] = eventDetails.P;
      }
      return flatData;
    });
  
    // Create new workbook and append sheets
    const workbook = XLSX.utils.book_new();
  
    // Sheet with complete data
    const completeSheet = XLSX.utils.json_to_sheet(completeData);
    XLSX.utils.book_append_sheet(workbook, completeSheet, 'Complete Data');
  
    // E sheet
    const eSheet = XLSX.utils.json_to_sheet(eData);
    XLSX.utils.book_append_sheet(workbook, eSheet, 'Events E');
  
    // R sheet
    const rSheet = XLSX.utils.json_to_sheet(rData);
    XLSX.utils.book_append_sheet(workbook, rSheet, 'Events R');
  
    // P sheet
    const pSheet = XLSX.utils.json_to_sheet(pData);
    XLSX.utils.book_append_sheet(workbook, pSheet, 'Events P');
  
    // Generate Excel file and prompt download
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(excelBlob, 'attendance-data.xlsx');
  };
  
  const exportToCSV = async () => {
    try {
      const dataToExport = filteredData.map(item => {
        const events = item.events;
        let flatData = {
          student_id: item.student_id,
          clg_id: item.clg_id,
          name: `${item.first_name} ${item.middle_name || ''} ${item.last_name}`,
          branch: item.branch,
          degree_year: item.degree_year,
        };
        for (const [eventName, eventDetails] of Object.entries(events)) {
          flatData[`${eventName}_E`] = eventDetails.E;
          flatData[`${eventName}_R`] = eventDetails.R;
          flatData[`${eventName}_P`] = eventDetails.P;
        }
        return flatData;
      });

      const csv = await converter.json2csv(dataToExport);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'attendance-data.csv');
    } catch (error) {
      console.error('Error generating CSV:', error);
    }
  };

  // Get unique degree years and branches for the filter options
  const uniqueDegreeYears = [...new Set(attendanceData.map(item => item.degree_year))];
  const uniqueBranches = [...new Set(attendanceData.map(item => item.branch))];

  return (
    <div className="flex flex-col gap-8 justify-start items-start md:ml-72 md:mt-32 w-auto p-10 bg-white rounded-2xl shadow-2xl transition-all duration-500 ease-in-out transform hover:scale-[1.01]">
      <h1 className="text-5xl font-extrabold text-gray-800 mb-8 tracking-wider border-b pb-4 border-gray-200 w-full">
        Attendance Management
      </h1>
  
      <div className="mb-6 flex gap-6 items-center w-full">
        <div className="flex flex-col w-1/3">
          <label className="text-gray-600 font-semibold mb-2">Degree Year</label>
          <select 
            value={degreeYearFilter} 
            onChange={(e) => setDegreeYearFilter(e.target.value)} 
            className="border border-gray-300 rounded-lg p-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ease-in-out duration-200"
          >
            <option value="">Select Degree Year</option>
            {uniqueDegreeYears.map((year, index) => (
              <option key={index} value={year}>{year}</option>
            ))}
          </select>
        </div>
  
        <div className="flex flex-col w-1/3">
          <label className="text-gray-600 font-semibold mb-2">Branch</label>
          <select 
            value={branchFilter} 
            onChange={(e) => setBranchFilter(e.target.value)} 
            className="border border-gray-300 rounded-lg p-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ease-in-out duration-200"
          >
            <option value="">Select Branch</option>
            {uniqueBranches.map((branch, index) => (
              <option key={index} value={branch}>{branch}</option>
            ))}
          </select>
        </div>
  
        <button 
          onClick={handleFilterChange} 
          className="px-6 py-3 mt-7 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition transform hover:scale-105 ease-in-out duration-300"
        >
          Apply Filters
        </button>
      </div>
  
      <div className="mb-6 flex gap-4">
        <button 
          onClick={exportToCSV} 
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 transition transform hover:scale-105 ease-in-out duration-300"
        >
          Export to CSV
        </button>
        <button 
          onClick={exportToExcel} 
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition transform hover:scale-105 ease-in-out duration-300"
        >
          Export to Excel
        </button>
      </div>
  
      {filteredData.length > 0 ? (
        <div className="overflow-x-auto w-full rounded-lg shadow-2xl border border-gray-200 bg-gradient-to-r from-gray-100 to-gray-50">
          <table className="table-auto border-collapse w-full text-left bg-white">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="border px-6 py-4 text-sm font-semibold tracking-wide">Student ID</th>
                <th className="border px-6 py-4 text-sm font-semibold tracking-wide">College ID</th>
                <th className="border px-6 py-4 text-sm font-semibold tracking-wide">Name</th>
                <th className="border px-6 py-4 text-sm font-semibold tracking-wide">Branch</th>
                <th className="border px-6 py-4 text-sm font-semibold tracking-wide">Degree Year</th>
                {Object.keys(filteredData[0].events).map((event, index) => (
                  <React.Fragment key={index}>
                    <th colSpan={3} className="border px-6 py-4 text-sm font-semibold tracking-wide">
                      <div className="border-b pb-2">{event}</div>
                    </th>
                  </React.Fragment>
                ))}
              </tr>
              <tr>
                <th className="border"></th>
                <th className="border"></th>
                <th className="border"></th>
                <th className="border"></th>
                <th className="border"></th>
                {Object.keys(filteredData[0].events).map((event, index) => (
                  <React.Fragment key={index}>
                    <th className="border px-6 py-2 text-sm font-semibold tracking-wide">E</th>
                    <th className="border px-6 py-2 text-sm font-semibold tracking-wide">R</th>
                    <th className="border px-6 py-2 text-sm font-semibold tracking-wide">P</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border px-6 py-3">{row.student_id}</td>
                  <td className="border px-6 py-3">{row.clg_id}</td>
                  <td className="border px-6 py-3">{`${row.first_name} ${row.middle_name || ''} ${row.last_name}`}</td>
                  <td className="border px-6 py-3">{row.branch}</td>
                  <td className="border px-6 py-3">{row.degree_year}</td>
                  {Object.values(row.events).map((eventDetail, eventIndex) => (
                    <React.Fragment key={eventIndex}>
                      <td className="border px-6 py-2">{eventDetail.E}</td>
                      <td className="border px-6 py-2">{eventDetail.R}</td>
                      <td className="border px-6 py-2">{eventDetail.P}</td>
                    </React.Fragment>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-gray-500 text-lg italic">{error || 'Loading...'}</div>
      )}
    </div>
  );
  
}

export default AttendanceTable;
