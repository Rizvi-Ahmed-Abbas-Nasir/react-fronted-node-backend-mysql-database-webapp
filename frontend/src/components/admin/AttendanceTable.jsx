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
  }, [degreeYearFilter, branchFilter]);

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
    <div className="flex flex-col gap-6 justify-start items-start md:ml-72 md:mt-32 w-auto p-4 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Registration Details</h1>

      <div className="mb-4 flex gap-4">
        <select 
          value={degreeYearFilter} 
          onChange={(e) => setDegreeYearFilter(e.target.value)} 
          className="border rounded-lg p-2"
        >
          <option value="">Select Degree Year</option>
          {uniqueDegreeYears.map((year, index) => (
            <option key={index} value={year}>{year}</option>
          ))}
        </select>

        <select 
          value={branchFilter} 
          onChange={(e) => setBranchFilter(e.target.value)} 
          className="border rounded-lg p-2"
        >
          <option value="">Select Branch</option>
          {uniqueBranches.map((branch, index) => (
            <option key={index} value={branch}>{branch}</option>
          ))}
        </select>

        <button 
          onClick={handleFilterChange} 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
        >
          Apply Filters
        </button>
      </div>

      <div className="mb-4">
        <button onClick={exportToCSV} className="mr-4 px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-200">
          Export to CSV
        </button>
        <button onClick={exportToExcel} className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-200">
          Export to Excel
        </button>
      </div>

      {filteredData.length > 0 ? (
        <div className="overflow-x-auto w-full rounded-xl">
          <table className="table-auto border-collapse w-full min-w-max bg-white shadow-lg rounded-lg">
            <thead className="bg-blue-600 text-white border-b border-gray-200">
              <tr>
                <th className="border px-6 py-3 text-sm font-medium">Student ID</th>
                <th className="border px-6 py-3 text-sm font-medium">College ID</th>
                <th className="border px-6 py-3 text-sm font-medium">Name</th>
                <th className="border px-6 py-3 text-sm font-medium">Branch</th>
                <th className="border px-6 py-3 text-sm font-medium">Degree Year</th>
                {filteredData.length > 0 &&
                  Object.keys(filteredData[0].events).map((event, index) => (
                    <React.Fragment key={index}>
                      <th colSpan={3} className="border px-6 py-1 text-sm font-medium">
                        <div className="border-b py-1">{event}</div>
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
                {filteredData.length > 0 &&
                  Object.keys(filteredData[0].events).map((event, index) => (
                    <React.Fragment key={index}>
                      <th className="border px-6 py-1 text-sm font-medium">E</th>
                      <th className="border px-6 py-1 text-sm font-medium">R</th>
                      <th className="border px-6 py-1 text-sm font-medium">P</th>
                    </React.Fragment>
                  ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="border px-6 py-2">{row.student_id}</td>
                  <td className="border px-6 py-2">{row.clg_id}</td>
                  <td className="border px-6 py-2">{`${row.first_name} ${row.middle_name || ''} ${row.last_name}`}</td>
                  <td className="border px-6 py-2">{row.branch}</td>
                  <td className="border px-6 py-2">{row.degree_year}</td>
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
        <div className="text-gray-600">{error || 'Loading...'}</div>
      )}
    </div>
  );
}

export default AttendanceTable;
