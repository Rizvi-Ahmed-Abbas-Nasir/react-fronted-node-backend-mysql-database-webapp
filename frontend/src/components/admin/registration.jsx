import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../header';
import AdminHeader from './AdminHeader';
import QRCode from 'qrcode';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress from Material-UI

function RegistrationPage() {
  const { id: eventId } = useParams(); // Descriptive name for 'id'
  const [registrations, setRegistrations] = useState([]); // Renamed to plural 'registrations'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionStatus, setActionStatus] = useState({}); // Tracks loading state for approve/decline buttons

  // Fetch registrations on component load
  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/getAllRegistrations/${eventId}`);
        setRegistrations(response.data || []);
      } catch (err) {
        setError("Error fetching registration data");
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [eventId]);

  // Handle approving a student
  const approveStudent = async (studentId, emailId) => {
    setActionStatus({ ...actionStatus, [studentId]: 'approving' }); // Show loader for this student
    try {
      const qrCodeData = JSON.stringify({ event_id: eventId, student_id: studentId });
      const qrCodeUrl = await QRCode.toDataURL(qrCodeData);

      await axios.put(`http://localhost:8000/approveStudent/${eventId}`, { student_id: studentId });
      await axios.post(`http://localhost:8000/sendAttendanceQrcode`, { email: emailId, src: qrCodeUrl });

      setRegistrations(registrations.map(reg =>
        reg.student_id === studentId ? { ...reg, isApproved: true } : reg
      ));
      alert("Student approved successfully!");
    } catch (err) {
      setError("Error approving student");
    } finally {
      setActionStatus({ ...actionStatus, [studentId]: null }); // Reset loader
    }
  };

  // Handle declining a student
  const declineStudent = async (studentId) => {
    setActionStatus({ ...actionStatus, [studentId]: 'declining' }); // Show loader for this student
    try {
      await axios.delete(`http://localhost:8000/deleteRegistration/${eventId}`, { data: { student_id: studentId } });
      setRegistrations(registrations.filter(reg => reg.student_id !== studentId));
      alert("Student declined successfully!");
    } catch (err) {
      setError("Error declining student");
    } finally {
      setActionStatus({ ...actionStatus, [studentId]: null }); // Reset loader
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Header />
      <AdminHeader />
      <div className="flex flex-col gap-4 justify-start items-start md:ml-72 md:mt-32 w-[80%]">
        <h1 className="text-2xl font-bold">Registration Details</h1>
        {registrations.length ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3">College ID</th>
                {/* <th className="px-6 py-3">Student ID</th> */}
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Approved</th>
                <th className="px-6 py-3">Transaction Id</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {registrations.map(({ student_id, clg_id, email_id, first_name, last_name,transaction_id, isApproved }) => (
                <tr key={student_id}>
                  <td className="px-6 py-4">{clg_id}</td>
                  {/* <td className="px-6 py-4">{student_id}</td> */}
                  <td className="px-6 py-4">{email_id}</td>
                  <td className="px-6 py-4">{first_name} {last_name}</td>
                  <td className="px-6 py-4">{isApproved ? 'Yes' : 'No'}</td>
                  <td className="px-6 py-4">{transaction_id}</td>
                  <td className="px-6 py-4">
                    {!isApproved && (
                      <>
                        <button
                          onClick={() => approveStudent(student_id, email_id)}
                          disabled={actionStatus[student_id] === 'approving'}
                          className="px-4 py-2 bg-green-500 text-white rounded mr-2"
                        >
                          {actionStatus[student_id] === 'approving' ? <CircularProgress size={20} color="inherit" /> : 'Approve'}
                        </button>
                        <button
                          onClick={() => declineStudent(student_id)}
                          disabled={actionStatus[student_id] === 'declining'}
                          className="px-4 py-2 bg-red-500 text-white rounded"
                        >
                          {actionStatus[student_id] === 'declining' ? <CircularProgress size={20} color="inherit" /> : 'Decline'}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No registration details available.</p>
        )}
      </div>
    </>
  );
}

export default RegistrationPage;
