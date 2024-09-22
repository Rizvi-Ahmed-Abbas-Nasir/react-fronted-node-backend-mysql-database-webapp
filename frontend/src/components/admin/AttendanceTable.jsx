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
  const [batchFilter, setBatchFilter] = useState(""); // Batch filter state

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/getAllAttendance");
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

    // Filter by degree year
    if (degreeYearFilter) {
      newData = newData.filter(item => item.degree_year === degreeYearFilter);
    }

    // Filter by branch
    if (branchFilter) {
      newData = newData.filter(item => item.branch === branchFilter);
    }
 
    // Filter by batch within events
    if (batchFilter) {
      const filteredAttendance = attendanceData.map(item => {
        const filteredEvents = Object.values(item.events).filter(event => {
          console.log(event.Batch === batchFilter); // Log the Batch value
          return event.Batch === batchFilter;
        });
    
        return {
          ...item,
          events: filteredEvents // Replace the events with the filtered ones
        };
      });
    
      // Filter out any items that have no events left after filtering
      newData = filteredAttendance.filter(item => item.events.length > 0);
    }
    setFilteredData(newData);
  };

  useEffect(() => {
    handleFilterChange();
  }, [degreeYearFilter, branchFilter, batchFilter]);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance Data");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "attendance_data.xlsx");
  };

  const exportToCSV = () => {
    converter.json2csv(filteredData, (err, csv) => {
      if (err) {
        console.error("Error converting to CSV", err);
        return;
      }
      const blob = new Blob([csv], { type: "text/csv" });
      saveAs(blob, "attendance_data.csv");
    });
  };

  // Get unique degree years, branches, and batches for the filter options
  const uniqueDegreeYears = [...new Set(attendanceData.map(item => item.degree_year))];
  const uniqueBranches = [...new Set(attendanceData.map(item => item.branch))];
  const uniqueBatches = [...new Set(attendanceData.flatMap(item => 
    Object.values(item.events).map(event => event.Batch)
  ))];

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

        <div className="flex flex-col w-1/3">
          <label className="text-gray-600 font-semibold mb-2">Batch</label>
          <select 
            value={batchFilter} 
            onChange={(e) => setBatchFilter(e.target.value)} 
            className="border border-gray-300 rounded-lg p-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ease-in-out duration-200"
          >
            <option value="">Select Batch</option>
            {uniqueBatches.map((batch, index) => (
              <option key={index} value={batch}>{batch}</option>
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
                <th className="border px-6 py-4 text-sm font-semibold tracking-wide">Total E</th>
                <th className="border px-6 py-4 text-sm font-semibold tracking-wide">Total R</th>
                <th className="border px-6 py-4 text-sm font-semibold tracking-wide">Total P</th>
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
                <th className="border"></th>
                <th className="border"></th>
                <th className="border"></th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredData.map((row, index) => {
                // Calculate total E, R, P values
                const totalE = Object.values(row.events).reduce((sum, event) => sum + (event.E || 0), 0);
                const totalR = Object.values(row.events).reduce((sum, event) => sum + (event.R || 0), 0);
                const totalP = Object.values(row.events).reduce((sum, event) => sum + (event.P || 0), 0);

                return (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="border px-6 py-3">{row.student_id}</td>
                    <td className="border px-6 py-3">{row.clg_id}</td>
                    <td className="border px-6 py-3">{`${row.first_name} ${row.middle_name || ''} ${row.last_name}`}</td>
                    <td className="border px-6 py-3">{row.branch}</td>
                    <td className="border px-6 py-3">{row.degree_year}</td>
                    {Object.values(row.events).map((eventDetail, eventIndex) => (
                      <React.Fragment key={eventIndex}>
                        <td className="border px-6 py-2">{eventDetail.E || 0}</td>
                        <td className="border px-6 py-2">{eventDetail.R || 0}</td>
                        <td className="border px-6 py-2">{eventDetail.P || 0}</td>
                      </React.Fragment>
                    ))}
                    <td className="border px-6 py-3">{totalE}</td>
                    <td className="border px-6 py-3">{totalR}</td>
                    <td className="border px-6 py-3">{totalP}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-red-600 font-semibold text-lg">No attendance data found.</p>
      )}
    
      
      
    </div>
  );
}

export default AttendanceTable;
