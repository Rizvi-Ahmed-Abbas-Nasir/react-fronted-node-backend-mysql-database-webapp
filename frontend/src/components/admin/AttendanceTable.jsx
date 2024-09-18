import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
const converter = require('json-2-csv');

function AttendanceTable() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState("");
  const [filterYear, setFilterYear] = useState(""); 
  const [filterDepartment, setFilterDepartment] = useState("");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedDepartment, setSelectedDepartment] = useState("All");

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/getAllAttendance");
        setAttendanceData(response.data.result);
        setFilteredData(response.data.result); // Set initial filtered data
      } catch (err) {
        setError("Failed to fetch attendance data");
        console.error(err);
      }
    };
    fetchAttendanceData();
  }, []);

  // Flatten and transform object for export purposes
  const flattenAndTransformObject = (obj, parent = '', res = {}) => {
    for (let key in obj) {
      const propName = parent ? `${parent}.${key}` : key;
      let value = obj[key];

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        flattenAndTransformObject(value, propName, res);
      } else {
        if (['first_name', 'middle_name', 'last_name'].includes(key)) {
          value = value ? value.charAt(0).toUpperCase() + value.slice(1) : 'N/A';
        }
        res[propName] = value;
      }
    }
    return res;
  };

  // Handle Filtering
  const handleFilter = () => {
    let data = attendanceData;
    if (filterYear) {
      data = data.filter(item => item.ac_yr === filterYear);
    }
    if (filterDepartment) {
      data = data.filter(item => item.branch.toLowerCase().includes(filterDepartment.toLowerCase()));
    }
    setFilteredData(data);
  };

  // PDF Export
  const handleDownloadPDF = () => {
    const doc = new jsPDF('p', 'pt', 'a4'); // Portrait, points, A4 size

    // Flatten and transform data for the PDF
    const flattenedData = filteredData.map(item => {
        const events = item.events;
        let flatData = {
            student_id: item.student_id,
            clg_id: item.clg_id,
            name: `${item.first_name} ${item.middle_name || ''} ${item.last_name}`,
            department: item.branch, // Include department
        };
        // Flatten event data with E, R, and P as sub-columns
        for (const [eventName, eventDetails] of Object.entries(events)) {
            flatData[`${eventName}_E`] = eventDetails.E;
            flatData[`${eventName}_R`] = eventDetails.R;
            flatData[`${eventName}_P`] = eventDetails.P;
        }
        return flatData;
    });

    // Create headers for the PDF
    const eventNames = Object.keys(flattenedData[0])
        .filter(key => key.includes('_E'))
        .map(key => key.split('_')[0]);

    const topLevelHeaders = [
        { content: 'Student ID', colSpan: 1 },
        { content: 'College ID', colSpan: 1 },
        { content: 'Name', colSpan: 1 },
        { content: 'Department', colSpan: 1 },
        ...eventNames.map(eventName => ({
            content: eventName,
            colSpan: 3, // 3 sub-columns for E, R, and P
            styles: { halign: 'center' }
        }))
    ];

    const secondLevelHeaders = [
        { content: '', colSpan: 1 },
        { content: '', colSpan: 1 },
        { content: '', colSpan: 1 },
        { content: '', colSpan: 1 },
        ...eventNames.flatMap(eventName => [
            { content: 'E', colSpan: 1 },
            { content: 'R', colSpan: 1 },
            { content: 'P', colSpan: 1 }
        ])
    ];

    // Configure the autoTable options
    doc.autoTable({
        head: [topLevelHeaders, secondLevelHeaders],
        body: flattenedData.map(item => Object.values(item)), // Populate body data
        startY: 60,
        theme: 'striped',
        styles: {
            fontSize: 10,
            cellPadding: 4,
            overflow: 'linebreak',
            halign: 'center',
        },
        headStyles: {
            fillColor: [220, 220, 220], // Light gray
            textColor: [0, 0, 0],
            fontStyle: 'bold',
            fontSize: 11,
        },
        columnStyles: {
            student_id: { cellWidth: 50 },
            clg_id: { cellWidth: 70 },
            name: { cellWidth: 100 },
            department: { cellWidth: 80 },
            E: { cellWidth: 30 },
            R: { cellWidth: 30 },
            P: { cellWidth: 30 },
        },
        didDrawPage: (data) => {
            // Add title
            doc.setFontSize(20);
            doc.text("Attendance Report", data.settings.margin.left, 40);

            // Add footer
            const pageCount = doc.internal.getNumberOfPages();
            doc.setFontSize(10);
            doc.text(`Page ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 30);
        },
    });

    doc.save('attendance-report.pdf');
};


  // CSV Export
  const handleDownloadCSV = async () => {
    try {
      const flattenedData = filteredData.map(item => {
        const events = item.events;
        let flatData = {
          student_id: item.student_id,
          clg_id: item.clg_id,
          name: `${item.first_name} ${item.middle_name || ''} ${item.last_name}`,
          department: item.branch,
          ac_yr: item.ac_yr,
        };
        for (const [eventName, eventDetails] of Object.entries(events)) {
          flatData[`${eventName}_E`] = eventDetails.E;
          flatData[`${eventName}_R`] = eventDetails.R;
          flatData[`${eventName}_P`] = eventDetails.P;
        }
        return flatData;
      });

      const csv = await converter.json2csv(flattenedData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'attendance-data.csv');
    } catch (error) {
      console.error('Error generating CSV:', error);
    }
  };

  // Excel Export
  const exportToExcel = () => {
    const flattenedData = filteredData.map(item => {
      const events = item.events;
      let flatData = {
        student_id: item.student_id,
        clg_id: item.clg_id,
        name: `${item.first_name} ${item.middle_name || ''} ${item.last_name}`,
        department: item.branch,
        ac_yr: item.ac_yr,
      };
      for (const [eventName, eventDetails] of Object.entries(events)) {
        flatData[`${eventName}_E`] = eventDetails.E;
        flatData[`${eventName}_R`] = eventDetails.R;
        flatData[`${eventName}_P`] = eventDetails.P;
      }
      return flatData;
    });

    const worksheet = XLSX.utils.json_to_sheet(flattenedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance Data');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(excelBlob, 'attendance-data.xlsx');
  };
 
  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    filterData(event.target.value, selectedDepartment);
  };

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
    filterData(selectedYear, event.target.value);
  };
  
  const filterData = (year, department) => {
    let filtered = attendanceData;

    if (year !== "All") {
      filtered = filtered.filter(student => student.ac_yr === year);
    }

    if (department !== "All") {
      filtered = filtered.filter(student => student.branch === department);
    }

    setFilteredData(filtered);
  };


  return (
    <div className="flex flex-col gap-6 justify-start items-start md:ml-72 md:mt-32 w-auto p-4 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Registration Details</h1>

      <div className="flex space-x-4 mb-4">
        <label htmlFor="yearFilter" className="font-medium text-gray-700">Filter by Year:</label>
        <select
          id="yearFilter"
          value={selectedYear}
          onChange={handleYearChange}
          className="px-4 py-2 border rounded-lg shadow-sm"
        >
          <option value="All">All</option>
          <option value="2026-2027">2026-2027</option>
          <option value="2025-2026">2025-2026</option>
          <option value="2024-2025">2024-2025</option>
          <option value="2023-2024">2023-2024</option>
          <option value="2022-2023">2022-2023</option>
          <option value="2021-2022">2021-2022</option>
          <option value="2020-2021">2020-2021</option>
        </select>

        <label htmlFor="departmentFilter" className="font-medium text-gray-700">Filter by Department:</label>
        <select
          id="departmentFilter"
          value={selectedDepartment}
          onChange={handleDepartmentChange}
          className="px-4 py-2 border rounded-lg shadow-sm"
        >
          <option value="All">All</option>
          <option value="Comps">Comps</option>
          <option value="IT">IT</option>
          <option value="AIDS">AIDS</option>
        </select>
      </div>

      <div className="flex space-x-4">
      
        <button onClick={handleDownloadCSV} className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-200">Download CSV</button>
        <button onClick={handleDownloadPDF} className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200">Download PDF</button>
        <button onClick={exportToExcel} className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-200">Download Excel</button>
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
                <th className="border px-6 py-3 text-sm font-medium">Academic Year</th>
                {filteredData.length > 0 &&
                  Object.keys(filteredData[0].events).map((event, index) => (
                    <React.Fragment key={index}>
                      <th colSpan={3} className="border px-6 py-1 text-sm font-medium">
                        <div className="border-b py-3">{event}</div>
                        
                        <div className="flex mt-1 w-full justify-between  py-2">
                          <div>                          <span className="  pt-1 text-[0.9rem]">E</span>
                          </div>
                          <div>                          <span className="  pt-1 text-[0.9rem]">R</span>
                          </div>
                          <div>                          <span className="  pt-1 text-[0.9rem]">P</span>
                          </div>
                        </div>
                      </th>
                    </React.Fragment>
                  ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((student) => (
                <tr key={student.student_id} className="even:bg-gray-100 odd:bg-white">
                  <td className="border px-6 py-4 text-gray-800">{student.student_id}</td>
                  <td className="border px-6 py-4 text-gray-800">{student.clg_id}</td>
                  <td className="border px-6 py-4 text-gray-800">{`${student.first_name} ${student.middle_name || ""} ${student.last_name}`}</td>
                  <td className="border px-6 py-4 text-gray-800">{student.branch}</td>
                  <td className="border px-6 py-4 text-gray-800">{student.ac_yr}</td> {/* Displaying Academic Year */}
                  {Object.values(student.events).map((status, index) => (
                    <>
                      <td key={`${index}_E`} className="border px-6 py-4 text-center text-gray-800">{status.E}</td>
                      <td key={`${index}_R`} className="border px-6 py-4 text-center text-gray-800">{status.R}</td>
                      <td key={`${index}_P`} className="border px-6 py-4 text-center text-gray-800">{status.P}</td>
                    </>
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
